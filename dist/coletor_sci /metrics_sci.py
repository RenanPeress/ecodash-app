#!/usr/bin/env python3
"""
user_sci_client.py — Cliente local para coleta de métricas e cálculo de SCI
(Software Carbon Intensity) conforme especificação Green Software Foundation.

Uso:
    python3 user_sci_client.py "python3 meu_script.py" [opções]

Opções:
    --region          Região geográfica para intensidade de carbono (padrão: BR)
    --functional_unit Unidade funcional para divisão do SCI (padrão: 1)
    --timeout         Tempo máximo de execução em segundos (padrão: 300)
    --tdp             TDP manual em watts (substitui detecção automática)
    --hardware_type   Tipo de hardware: desktop, laptop, server (padrão: auto)
    --send_url        URL para envio automático do JSON via POST HTTP
"""

import argparse
import json
import os
import platform
import re
import subprocess
import sys
import threading
import time
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from typing import Optional

# ---------------------------------------------------------------------------
# Dependência opcional: psutil
# ---------------------------------------------------------------------------
try:
    import psutil
except ImportError:
    print("[ERRO] Biblioteca 'psutil' não encontrada.")
    print("       Instale com: pip install psutil")
    sys.exit(1)

# ---------------------------------------------------------------------------
# Dependência opcional: requests (apenas necessária se --send_url for usado)
# ---------------------------------------------------------------------------
try:
    import urllib.request
    import urllib.error
    HAS_URLLIB = True
except ImportError:
    HAS_URLLIB = False

# ===========================================================================
# CONSTANTES
# ===========================================================================

# Intensidade de carbono da rede elétrica por região (gCO₂eq/kWh)
# Fonte: Electricity Maps / Our World in Data (valores médios aproximados)
CARBON_INTENSITY_BY_REGION: dict[str, float] = {
    "BR":  100.0,   # Brasil — predominantemente hidrelétrica
    "US":  386.0,   # EUA — média nacional
    "EU":  233.0,   # União Europeia — média
    "DE":  350.0,   # Alemanha
    "FR":   56.0,   # França — predominantemente nuclear
    "GB":  225.0,   # Reino Unido
    "CN":  555.0,   # China
    "IN":  713.0,   # Índia
    "AU":  656.0,   # Austrália
    "CA":  130.0,   # Canadá
    "JP":  463.0,   # Japão
    "DEFAULT": 475.0,  # Mundo — valor padrão conservador
}

# Carbono embutido estimado por tipo de hardware (kgCO₂eq total de fabricação)
EMBODIED_CARBON_BY_HARDWARE: dict[str, float] = {
    "laptop":  300.0,
    "desktop": 400.0,
    "server":  1000.0,
}

# Vida útil estimada em horas por tipo de hardware
HARDWARE_LIFESPAN_HOURS: dict[str, float] = {
    "laptop":  17_520.0,   # ~2 anos (8h/dia)
    "desktop": 26_280.0,   # ~3 anos (8h/dia)
    "server":  43_800.0,   # ~5 anos (24h/dia)
}

# TDP estimado por tipo de hardware quando não detectado automaticamente (Watts)
DEFAULT_TDP_BY_HARDWARE: dict[str, float] = {
    "laptop":  15.0,
    "desktop": 65.0,
    "server":  150.0,
}

# Intervalo de amostragem das métricas (segundos)
SAMPLE_INTERVAL: float = 0.2

# Classificação SCI (gCO₂eq por unidade funcional)
SCI_RATING_THRESHOLDS = [
    (1.0,   "AAA"),
    (5.0,   "AA"),
    (15.0,  "A"),
    (50.0,  "B"),
    (150.0, "C"),
    (float("inf"), "D"),
]

# ===========================================================================
# CLASSE: HardwareProfile
# ===========================================================================

@dataclass
class HardwareProfile:
    """
    Representa o perfil de hardware da máquina onde o software é executado.
    Responsável por detectar CPU, RAM, TDP e tipo de hardware.
    """
    cpu_model: str = "Desconhecido"
    cpu_cores_physical: int = 1
    cpu_cores_logical: int = 1
    ram_total_gb: float = 0.0
    hardware_type: str = "desktop"   # laptop | desktop | server
    tdp_watts: float = 65.0
    os_name: str = ""
    os_version: str = ""

    @classmethod
    def detect(
        cls,
        hardware_type_override: Optional[str] = None,
        tdp_override: Optional[float] = None,
    ) -> "HardwareProfile":
        """
        Detecta automaticamente as características do hardware local.
        Permite sobrescrever tipo e TDP via argumentos CLI.
        """
        profile = cls()

        # --- Sistema operacional ---
        profile.os_name = platform.system()
        profile.os_version = platform.version()

        # --- CPU ---
        profile.cpu_model = platform.processor() or cls._read_cpu_model_linux()
        profile.cpu_cores_physical = psutil.cpu_count(logical=False) or 1
        profile.cpu_cores_logical = psutil.cpu_count(logical=True) or 1

        # --- RAM ---
        mem = psutil.virtual_memory()
        profile.ram_total_gb = round(mem.total / (1024 ** 3), 2)

        # --- Tipo de hardware ---
        if hardware_type_override:
            profile.hardware_type = hardware_type_override.lower()
        else:
            profile.hardware_type = cls._detect_hardware_type()

        # --- TDP ---
        if tdp_override is not None:
            profile.tdp_watts = tdp_override
        else:
            profile.tdp_watts = cls._estimate_tdp(
                profile.cpu_model, profile.hardware_type
            )

        return profile

    # -----------------------------------------------------------------------
    # Métodos auxiliares de detecção
    # -----------------------------------------------------------------------

    @staticmethod
    def _read_cpu_model_linux() -> str:
        """Lê o modelo de CPU do /proc/cpuinfo (Linux)."""
        try:
            with open("/proc/cpuinfo", "r") as f:
                for line in f:
                    if line.startswith("model name"):
                        return line.split(":")[1].strip()
        except Exception:
            pass
        return "Desconhecido"

    @staticmethod
    def _detect_hardware_type() -> str:
        """
        Tenta identificar se a máquina é laptop, desktop ou server.
        Usa /sys/class/power_supply (Linux) e heurísticas de nome de host.
        """
        # Linux: verifica presença de bateria
        power_supply_path = "/sys/class/power_supply"
        if os.path.isdir(power_supply_path):
            entries = os.listdir(power_supply_path)
            for entry in entries:
                if entry.lower().startswith("bat"):
                    return "laptop"

        # Heurística pelo hostname
        hostname = platform.node().lower()
        if any(kw in hostname for kw in ["server", "srv", "node", "rack"]):
            return "server"

        return "desktop"

    @staticmethod
    def _estimate_tdp(cpu_model: str, hardware_type: str) -> float:
        """
        Estima o TDP baseado no modelo de CPU detectado.
        Usa expressões regulares para identificar famílias conhecidas.
        Se não reconhecer, cai no padrão por tipo de hardware.
        """
        cpu_lower = cpu_model.lower()

        # Padrões conhecidos (W)
        tdp_patterns = [
            (r"i9-\d{4}[hk]",  45.0),
            (r"i7-\d{4}[hk]",  45.0),
            (r"i5-\d{4}[hk]",  45.0),
            (r"i9-\d{4}",      125.0),
            (r"i7-\d{4}",       65.0),
            (r"i5-\d{4}",       65.0),
            (r"i3-\d{4}",       58.0),
            (r"ryzen 9",        105.0),
            (r"ryzen 7",         65.0),
            (r"ryzen 5",         65.0),
            (r"ryzen 3",         65.0),
            (r"xeon",           150.0),
            (r"epyc",           200.0),
            (r"m[123] (pro|max|ultra)", 30.0),
            (r"celeron|pentium",  35.0),
            (r"atom",            6.0),
        ]

        for pattern, tdp in tdp_patterns:
            if re.search(pattern, cpu_lower):
                return tdp

        return DEFAULT_TDP_BY_HARDWARE.get(hardware_type, 65.0)

    def to_dict(self) -> dict:
        return asdict(self)


# ===========================================================================
# CLASSE: ExecutionMetrics
# ===========================================================================

@dataclass
class ExecutionMetrics:
    """
    Armazena todas as métricas coletadas durante a execução do software.
    Amostradas via psutil a cada SAMPLE_INTERVAL segundos.
    """
    # Identificação da execução
    command: str = ""
    start_time_iso: str = ""
    end_time_iso: str = ""

    # Tempo
    duration_seconds: float = 0.0

    # CPU
    cpu_avg_pct: float = 0.0
    cpu_peak_pct: float = 0.0

    # Memória
    mem_avg_mb: float = 0.0
    mem_peak_mb: float = 0.0

    # Threads
    threads_avg: float = 0.0
    threads_peak: int = 0

    # I/O de disco (MB totais lidos/escritos durante a execução)
    disk_read_mb: float = 0.0
    disk_write_mb: float = 0.0

    # Amostras coletadas (interno)
    _cpu_samples: list = field(default_factory=list, repr=False)
    _mem_samples: list = field(default_factory=list, repr=False)
    _thread_samples: list = field(default_factory=list, repr=False)

    # Código de retorno do processo
    return_code: Optional[int] = None
    timed_out: bool = False

    def finalize(self) -> None:
        """Calcula estatísticas agregadas a partir das amostras brutas."""
        if self._cpu_samples:
            self.cpu_avg_pct = round(
                sum(self._cpu_samples) / len(self._cpu_samples), 2
            )
            self.cpu_peak_pct = round(max(self._cpu_samples), 2)

        if self._mem_samples:
            self.mem_avg_mb = round(
                sum(self._mem_samples) / len(self._mem_samples), 2
            )
            self.mem_peak_mb = round(max(self._mem_samples), 2)

        if self._thread_samples:
            self.threads_avg = round(
                sum(self._thread_samples) / len(self._thread_samples), 1
            )
            self.threads_peak = max(self._thread_samples)

    def to_dict(self) -> dict:
        d = asdict(self)
        # Remove campos internos (listas brutas de amostras)
        d.pop("_cpu_samples", None)
        d.pop("_mem_samples", None)
        d.pop("_thread_samples", None)
        return d


# ===========================================================================
# CLASSE: SCIResult
# ===========================================================================

@dataclass
class SCIResult:
    """
    Resultado do cálculo de SCI (Software Carbon Intensity).
    SCI = ((E * I) + M) / R

    Onde:
        E  = energia consumida em kWh
        I  = intensidade de carbono da rede (gCO₂eq/kWh)
        M  = carbono embutido do hardware alocado para esta execução (gCO₂eq)
        R  = unidade funcional (ex: 1 execução, 1000 usuários, etc.)
    """
    region: str = "BR"
    functional_unit: float = 1.0

    # Componentes de energia
    energy_cpu_kwh: float = 0.0
    energy_ram_kwh: float = 0.0
    energy_total_kwh: float = 0.0

    # Intensidade de carbono
    carbon_intensity_gco2_per_kwh: float = 0.0

    # Carbono embutido
    embodied_carbon_gco2: float = 0.0

    # SCI final
    sci_value: float = 0.0
    sci_rating: str = ""
    sci_label: str = ""

    def to_dict(self) -> dict:
        return asdict(self)


# ===========================================================================
# FUNÇÕES DE CÁLCULO
# ===========================================================================

def calculate_energy(
    metrics: ExecutionMetrics,
    hardware: HardwareProfile,
) -> tuple[float, float, float]:
    """
    Calcula a energia consumida (E) dividida em CPU e RAM.

    Modelos:
        E_cpu = TDP * (cpu_avg_pct / 100) * duration_hours
        E_ram = 0.000375 kWh/GB/h * ram_used_avg_gb * duration_hours
              (estimativa baseada em 3W por 8 GB de RAM em uso médio)

    Retorna: (energy_cpu_kwh, energy_ram_kwh, energy_total_kwh)
    """
    duration_hours = metrics.duration_seconds / 3600.0

    # Energia da CPU em kWh
    energy_cpu = (
        hardware.tdp_watts
        * (metrics.cpu_avg_pct / 100.0)
        * duration_hours
        / 1000.0  # W → kW
    )

    # Energia da RAM em kWh
    ram_used_gb = metrics.mem_avg_mb / 1024.0
    energy_ram = 0.000375 * ram_used_gb * duration_hours  # ~3W por 8GB

    total = energy_cpu + energy_ram
    return round(energy_cpu, 8), round(energy_ram, 8), round(total, 8)


def calculate_embodied_carbon(
    hardware: HardwareProfile,
    duration_seconds: float,
) -> float:
    """
    Calcula o carbono embutido (M) alocado proporcionalmente à duração.

    M = (total_embodied_carbon / lifespan_hours) * duration_hours
    Resultado em gCO₂eq.
    """
    hw_type = hardware.hardware_type
    total_embodied_kg = EMBODIED_CARBON_BY_HARDWARE.get(hw_type, 400.0)
    lifespan_h = HARDWARE_LIFESPAN_HOURS.get(hw_type, 26_280.0)

    total_embodied_g = total_embodied_kg * 1000.0  # kg → g
    duration_hours = duration_seconds / 3600.0

    allocated_g = (total_embodied_g / lifespan_h) * duration_hours
    return round(allocated_g, 6)


def classify_sci(sci_value: float) -> tuple[str, str]:
    """
    Classifica o valor de SCI em rating (AAA–D) e label de qualidade.
    """
    for threshold, rating in SCI_RATING_THRESHOLDS:
        if sci_value <= threshold:
            label = "Green Software" if rating in ("AAA", "AA", "A") else "Needs Improvement"
            return rating, label
    return "D", "Needs Improvement"


def compute_sci(
    metrics: ExecutionMetrics,
    hardware: HardwareProfile,
    region: str,
    functional_unit: float,
) -> SCIResult:
    """
    Orquestra o cálculo completo do SCI e retorna um SCIResult preenchido.
    """
    result = SCIResult(region=region, functional_unit=functional_unit)

    # Intensidade de carbono da região
    carbon_intensity = CARBON_INTENSITY_BY_REGION.get(
        region.upper(), CARBON_INTENSITY_BY_REGION["DEFAULT"]
    )
    result.carbon_intensity_gco2_per_kwh = carbon_intensity

    # Energia
    e_cpu, e_ram, e_total = calculate_energy(metrics, hardware)
    result.energy_cpu_kwh = e_cpu
    result.energy_ram_kwh = e_ram
    result.energy_total_kwh = e_total

    # Carbono embutido
    result.embodied_carbon_gco2 = calculate_embodied_carbon(
        hardware, metrics.duration_seconds
    )

    # SCI = ((E * I) + M) / R
    operational_carbon = e_total * carbon_intensity  # gCO₂eq
    sci_raw = (operational_carbon + result.embodied_carbon_gco2) / max(
        functional_unit, 1e-9
    )
    result.sci_value = round(sci_raw, 6)

    # Classificação
    result.sci_rating, result.sci_label = classify_sci(result.sci_value)

    return result


# ===========================================================================
# COLETA DE MÉTRICAS (thread de monitoramento)
# ===========================================================================

def collect_metrics(
    pid: int,
    metrics: ExecutionMetrics,
    stop_event: threading.Event,
) -> None:
    """
    Roda em uma thread separada: coleta CPU, memória e threads do processo
    (e filhos) a cada SAMPLE_INTERVAL segundos até stop_event ser sinalizado.
    """
    try:
        parent = psutil.Process(pid)
    except psutil.NoSuchProcess:
        return

    while not stop_event.is_set():
        try:
            # Coleta do processo principal + filhos
            procs = [parent] + parent.children(recursive=True)

            cpu_total = 0.0
            mem_total_bytes = 0
            threads_total = 0

            for proc in procs:
                try:
                    cpu_total += proc.cpu_percent(interval=None)
                    mem_info = proc.memory_info()
                    mem_total_bytes += mem_info.rss
                    threads_total += proc.num_threads()
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    continue

            metrics._cpu_samples.append(cpu_total)
            metrics._mem_samples.append(mem_total_bytes / (1024 ** 2))  # → MB
            metrics._thread_samples.append(threads_total)

        except (psutil.NoSuchProcess, psutil.AccessDenied):
            break
        except Exception:
            pass

        stop_event.wait(SAMPLE_INTERVAL)


# ===========================================================================
# EXECUÇÃO DO SOFTWARE
# ===========================================================================

def run_software(
    command: str,
    metrics: ExecutionMetrics,
    timeout: Optional[float] = None,
) -> None:
    """
    Executa o comando do usuário como subprocesso, monitora métricas
    em paralelo e preenche os campos de tempo e I/O em `metrics`.
    """
    # Snapshot inicial de I/O de disco (sistema inteiro — melhor disponível
    # sem root via psutil em muitos ambientes)
    try:
        io_before = psutil.disk_io_counters()
    except Exception:
        io_before = None

    metrics.start_time_iso = datetime.now(timezone.utc).isoformat()
    start_ts = time.monotonic()

    # Inicia o subprocesso
    try:
        proc = subprocess.Popen(
            command,
            shell=True,
            stdout=sys.stdout,
            stderr=sys.stderr,
        )
    except Exception as exc:
        print(f"\n[ERRO] Falha ao iniciar o processo: {exc}", file=sys.stderr)
        metrics.return_code = -1
        metrics.end_time_iso = datetime.now(timezone.utc).isoformat()
        metrics.duration_seconds = 0.0
        return

    # Inicia thread de monitoramento
    stop_event = threading.Event()

    # Pequena pausa para o processo inicializar antes de começar a amostrar
    time.sleep(0.05)

    monitor_thread = threading.Thread(
        target=collect_metrics,
        args=(proc.pid, metrics, stop_event),
        daemon=True,
    )
    monitor_thread.start()

    # Aguarda o término do processo
    try:
        proc.wait(timeout=timeout)
        metrics.timed_out = False
    except subprocess.TimeoutExpired:
        print(
            f"\n[AVISO] Timeout de {timeout}s atingido. Encerrando o processo...",
            file=sys.stderr,
        )
        proc.kill()
        proc.wait()
        metrics.timed_out = True

    # Para o monitoramento
    stop_event.set()
    monitor_thread.join(timeout=2.0)

    end_ts = time.monotonic()
    metrics.end_time_iso = datetime.now(timezone.utc).isoformat()
    metrics.duration_seconds = round(end_ts - start_ts, 4)
    metrics.return_code = proc.returncode

    # Delta de I/O
    try:
        io_after = psutil.disk_io_counters()
        if io_before and io_after:
            metrics.disk_read_mb = round(
                (io_after.read_bytes - io_before.read_bytes) / (1024 ** 2), 4
            )
            metrics.disk_write_mb = round(
                (io_after.write_bytes - io_before.write_bytes) / (1024 ** 2), 4
            )
    except Exception:
        pass

    metrics.finalize()


# ===========================================================================
# ENVIO DO JSON PARA A PLATAFORMA WEB
# ===========================================================================

def send_json_to_url(url: str, payload: dict) -> None:
    """
    Envia o payload JSON via HTTP POST para a URL fornecida.
    Usa apenas urllib (stdlib) — sem dependência de requests.
    """
    if not HAS_URLLIB:
        print("[ERRO] urllib não disponível. Não foi possível enviar o JSON.")
        return

    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=body,
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            status = resp.getcode()
            response_body = resp.read().decode("utf-8", errors="replace")
            print(f"\n[INFO] JSON enviado com sucesso para {url}")
            print(f"       Status HTTP: {status}")
            if response_body:
                print(f"       Resposta: {response_body[:200]}")
    except urllib.error.HTTPError as exc:
        print(f"\n[ERRO] Falha HTTP ao enviar JSON: {exc.code} {exc.reason}")
    except urllib.error.URLError as exc:
        print(f"\n[ERRO] Erro de rede ao enviar JSON: {exc.reason}")
    except Exception as exc:
        print(f"\n[ERRO] Erro inesperado ao enviar JSON: {exc}")


# ===========================================================================
# SAÍDA NO TERMINAL
# ===========================================================================

def print_report(payload: dict) -> None:
    """Exibe o relatório final formatado no terminal."""
    sep = "=" * 70
    hw = payload["hardware"]
    m  = payload["metrics"]
    s  = payload["sci"]

    print(f"\n{sep}")
    print("  SCI CLIENT — Relatório de Análise de Software")
    print(sep)

    print(f"\n📦 Comando        : {m['command']}")
    print(f"   Início         : {m['start_time_iso']}")
    print(f"   Fim            : {m['end_time_iso']}")
    print(f"   Duração        : {m['duration_seconds']} s")
    print(f"   Retorno        : {m['return_code']}"
          + ("  ⚠ TIMEOUT" if m["timed_out"] else ""))

    print(f"\n🖥  Hardware")
    print(f"   CPU            : {hw['cpu_model']}")
    print(f"   Núcleos        : {hw['cpu_cores_physical']} físicos / "
          f"{hw['cpu_cores_logical']} lógicos")
    print(f"   RAM Total      : {hw['ram_total_gb']} GB")
    print(f"   Tipo           : {hw['hardware_type']}")
    print(f"   TDP estimado   : {hw['tdp_watts']} W")

    print(f"\n📊 Métricas de Execução")
    print(f"   CPU média      : {m['cpu_avg_pct']} %")
    print(f"   CPU pico       : {m['cpu_peak_pct']} %")
    print(f"   Memória média  : {m['mem_avg_mb']} MB")
    print(f"   Memória pico   : {m['mem_peak_mb']} MB")
    print(f"   Threads médio  : {m['threads_avg']}")
    print(f"   Threads pico   : {m['threads_peak']}")
    print(f"   Disco lido     : {m['disk_read_mb']} MB")
    print(f"   Disco escrito  : {m['disk_write_mb']} MB")

    print(f"\n⚡ Energia Consumida")
    print(f"   CPU            : {s['energy_cpu_kwh']:.8f} kWh")
    print(f"   RAM            : {s['energy_ram_kwh']:.8f} kWh")
    print(f"   Total          : {s['energy_total_kwh']:.8f} kWh")

    print(f"\n🌍 Carbono")
    print(f"   Região         : {s['region']}")
    print(f"   Intensidade    : {s['carbon_intensity_gco2_per_kwh']} gCO₂eq/kWh")
    print(f"   Carbono emb.   : {s['embodied_carbon_gco2']:.6f} gCO₂eq")

    rating_emoji = {"AAA": "🟢", "AA": "🟢", "A": "🟢",
                    "B": "🟡", "C": "🟠", "D": "🔴"}.get(s["sci_rating"], "⚪")
    print(f"\n{rating_emoji} SCI")
    print(f"   Valor          : {s['sci_value']:.6f} gCO₂eq / unidade func.")
    print(f"   Unidade func.  : {s['functional_unit']}")
    print(f"   Rating         : {s['sci_rating']}")
    print(f"   Classificação  : {s['sci_label']}")
    print(f"\n{sep}\n")


# ===========================================================================
# PONTO DE ENTRADA
# ===========================================================================

def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Coleta métricas de software e calcula o SCI (Software Carbon Intensity).",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument(
        "command",
        nargs="+",
        help='Comando a executar, ex: "python3 meu_script.py" ou python3 meu_script.py',
    )
    parser.add_argument(
        "--region",
        default="BR",
        help="Código da região para intensidade de carbono (padrão: BR)",
    )
    parser.add_argument(
        "--functional_unit",
        type=float,
        default=1.0,
        help="Unidade funcional R para divisão do SCI (padrão: 1.0)",
    )
    parser.add_argument(
        "--timeout",
        type=float,
        default=300.0,
        help="Tempo máximo de execução em segundos (padrão: 300)",
    )
    parser.add_argument(
        "--tdp",
        type=float,
        default=None,
        help="TDP manual em watts (substitui detecção automática)",
    )
    parser.add_argument(
        "--hardware_type",
        choices=["desktop", "laptop", "server"],
        default=None,
        help="Tipo de hardware: desktop, laptop ou server (padrão: auto)",
    )
    parser.add_argument(
        "--send_url",
        default=None,
        help="URL para envio automático do JSON via POST HTTP",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()

    # Reconstrói o comando como string (permite passar com ou sem aspas)
    command_str = " ".join(args.command)

    print(f"\n[SCI CLIENT] Iniciando análise de: {command_str}")
    print(f"             Região: {args.region} | Timeout: {args.timeout}s\n")

    # 1. Detectar hardware
    hardware = HardwareProfile.detect(
        hardware_type_override=args.hardware_type,
        tdp_override=args.tdp,
    )

    # 2. Preparar objeto de métricas
    metrics = ExecutionMetrics(command=command_str)

    # 3. Executar software e coletar métricas
    run_software(command_str, metrics, timeout=args.timeout)

    # 4. Calcular SCI
    sci_result = compute_sci(
        metrics=metrics,
        hardware=hardware,
        region=args.region,
        functional_unit=args.functional_unit,
    )

    # 5. Montar payload final
    payload = {
        "schema_version": "1.0.0",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "hardware": hardware.to_dict(),
        "metrics": metrics.to_dict(),
        "sci": sci_result.to_dict(),
    }

    # 6. Exibir relatório no terminal
    print_report(payload)

    # 7. Exibir JSON completo
    print("JSON completo:")
    print(json.dumps(payload, indent=2, ensure_ascii=False))

    # 8. Enviar para URL (se fornecida)
    if args.send_url:
        send_json_to_url(args.send_url, payload)

    # Propaga código de erro do processo analisado
    sys.exit(metrics.return_code if metrics.return_code is not None else 0)


if __name__ == "__main__":
    main()
