# 🌿 ECODASH — SISTEMA DE DIAGNÓSTICO DE GREEN SOFTWARE

> Plataforma web para análise de eficiência energética de software, com cálculo do Score de Carbono (SCI), dashboard interativo, insights de IA e relatórios PDF automáticos.

---

## 🔗 Links de Acesso

| Ambiente | URL |
|---|---|
| Frontend (Vercel) | Em breve |
| Backend API | Em breve |
| Documentação da API | `http://localhost:8000/api/docs/` |

---

## 📸 Capturas de Tela

### Dashboard Principal
> Visão geral com total de análises, score SCI médio, distribuição de grades e histórico recente.

### Tela de Análise
> Instruções de instalação do script coletor, download do `ecodash-collector.py` pré-configurado e botão para disparar nova análise.

### Relatório de Sustentabilidade
> Consumo de energia em kWh, índice de eficiência, status (Green Software / Não Sustentável) e tabela de métricas brutas de CPU, Memória e I/O.

### Comparação de Versões
> Gráficos de CPU e Memória lado a lado, comparando duas versões ou softwares distintos.

### Chat com IA
> Assistente EcoDash baseado em Claude (Anthropic) — responde sobre análises, tendências e recomendações de otimização.

---

## 🚀 Funcionalidades

- ✅ Cadastro e login de usuários com autenticação JWT
- ✅ Download do script coletor Python pré-configurado com token do usuário
- ✅ Script executa o software monitorado e captura CPU%, memória RAM e tempo de execução
- ✅ Cálculo automático do **Score SCI** (Software Carbon Intensity) seguindo o padrão da Green Software Foundation
- ✅ Classificação por Grade de sustentabilidade: **AAA · AA · A · B · C · D**
- ✅ Dashboard com gráficos comparativos e histórico de análises
- ✅ Relatório de Sustentabilidade com visão técnica detalhada por recurso (CPU, Memória, I/O)
- ✅ **Exportação de Relatório PDF** — documento completo com métricas, grade, SCI e pegada de carbono
- ✅ Comparação lado a lado entre versões ou softwares distintos
- ✅ **Chat com IA** (Claude/Anthropic) — insights, recomendações e análise em linguagem natural
- ✅ Recomendações automáticas de IA para reduzir o impacto ambiental do código
- ✅ Suporte a múltiplos ambientes: laptop, desktop, servidor, VM em nuvem
- ✅ Suporte a múltiplas regiões: Brasil, EUA, Europa, Alemanha, França, China, Índia, Austrália, UK
- ✅ Design responsivo com tema claro/escuro
- ✅ Proteção de rotas autenticadas

---

## 🧩 Estrutura do Projeto

```
ecodash/
├── ecodash-app/              # Frontend React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── ai/           # Chat IA e painel de insights
│   │   │   ├── analysis/     # Tela de análise e instruções
│   │   │   ├── comparison/   # Gráficos de comparação de versões
│   │   │   ├── dashboard/    # Layout, sidebar, histórico, métricas
│   │   │   ├── report/       # Relatório de sustentabilidade e cards
│   │   │   └── ui/           # Componentes base (shadcn/ui + Radix)
│   │   ├── hooks/            # Hooks de dados por domínio
│   │   ├── lib/
│   │   │   └── api/          # Camada de chamadas à API REST
│   │   ├── routes/           # Páginas (TanStack Router file-based)
│   │   └── types/            # Tipos TypeScript compartilhados
│   ├── public/
│   └── package.json
│
├── ecodash-server/           # Backend Django REST
│   ├── api/
│   │   ├── ai/               # Integração Claude (service, prompts, client)
│   │   ├── models.py         # CollectorToken, Analise
│   │   ├── views.py          # Endpoints REST
│   │   ├── serializers.py    # Validação e serialização
│   │   ├── pdf.py            # Geração de relatório PDF (WeasyPrint)
│   │   ├── authentication.py # Autenticação por X-Collector-Token
│   │   └── urls.py           # Roteamento da API
│   ├── collector_template.py # Script coletor entregue ao usuário
│   ├── metrics_sci.py        # Cálculo SCI (CPU, RAM, energia, carbono)
│   ├── requirements.txt
│   └── Dockerfile
│
├── .env.example              # Modelo de variáveis de ambiente
└── README.md
```

---

## 🛠 Tecnologias Utilizadas

### Frontend

| Tecnologia | Versão | Descrição |
|---|---|---|
| React | 19 | Interface de usuário |
| TypeScript | 5.8 | Tipagem estática |
| Vite | 7 | Build tool e dev server |
| TanStack Router | 1.x | Roteamento file-based com type safety |
| TanStack Query | 5.x | Gerenciamento de estado assíncrono |
| Tailwind CSS | 4 | Estilização utilitária |
| shadcn/ui + Radix UI | — | Componentes acessíveis |
| Recharts | 3 | Gráficos interativos |
| date-fns | 4 | Formatação de datas |
| Zod | 3 | Validação de esquemas |

### Backend

| Tecnologia | Versão | Descrição |
|---|---|---|
| Python | 3.12 | Linguagem principal |
| Django | 6.0 | Framework web |
| Django REST Framework | 3.16 | API REST |
| SimpleJWT | 5.4 | Autenticação JWT |
| drf-spectacular | 0.29 | Documentação OpenAPI/Swagger |
| WeasyPrint | 65.1 | Geração de PDF via HTML/CSS |
| Anthropic SDK | ≥0.50 | Integração com Claude (IA) |
| psutil | 6.1 | Coleta de métricas de sistema |
| Celery + Redis | 5.5 / 5.3 | Tarefas assíncronas |
| PostgreSQL | — | Banco de dados em produção |
| Gunicorn | 23 | Servidor WSGI em produção |
| WhiteNoise | 6.9 | Serve arquivos estáticos |

---

## ⚙️ Pré-requisitos

Antes de começar, você precisará ter instalado:

- **Python 3.12+**
- **Node.js 20+** e **npm**
- **PostgreSQL** (produção) ou SQLite (desenvolvimento local)
- **Redis** (para Celery — tarefas assíncronas)
- Chave de API da **Anthropic** (para funcionalidades de IA)

---

## ⚙️ Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/ecodash.git
cd ecodash
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
# Edite o .env com suas credenciais
```

Variáveis principais do `.env`:

```env
# Django
DJANGO_SECRET_KEY=sua-chave-secreta-longa-e-aleatoria
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

# Banco de dados (omita para usar SQLite em dev)
POSTGRES_DB=ecodash
POSTGRES_USER=ecodash_user
POSTGRES_PASSWORD=senha-forte

# Redis
REDIS_URL=redis://localhost:6379/0

# IA (Anthropic Claude)
ANTHROPIC_API_KEY=sua-chave-anthropic
```

---

## 🚦 Como Executar o Projeto

### Opção 1: Backend (Django)

```bash
cd ecodash-server

# Crie e ative o ambiente virtual
python3 -m venv venv
source venv/bin/activate      # Linux/macOS
# venv\Scripts\activate       # Windows

# Instale as dependências
pip install -r requirements.txt

# Execute as migrações
python manage.py migrate

# Inicie o servidor de desenvolvimento
python manage.py runserver
```

> API disponível em `http://localhost:8000`
> Swagger UI em `http://localhost:8000/api/docs/`

---

### Opção 2: Frontend (React + Vite)

```bash
cd ecodash-app

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

> Aplicação disponível em `http://localhost:5173`

---

### Opção 3: Docker (produção)

```bash
# Build e execução da imagem do backend
docker build -t ecodash-server ./ecodash-server
docker run -p 8000:8000 --env-file .env ecodash-server
```

---

## 📋 Funcionalidades Detalhadas

### 🔐 Autenticação
- Cadastro de novos usuários com validação
- Login seguro com tokens JWT (access + refresh)
- Renovação automática de tokens
- Logout e limpeza de sessão no cliente

### 📡 Script Coletor
- Download do `ecodash-collector.py` pré-configurado com o token pessoal do usuário
- Executa qualquer comando e monitora o processo filho em tempo real
- Captura: **CPU%** (média e pico), **RAM** (média e pico em MB), **I/O de disco**, **duração** e **threads**
- Calcula o SCI Score localmente e envia automaticamente para a plataforma via API

### 📊 Dashboard
- Total de análises realizadas
- Score SCI médio histórico
- Distribuição de grades (AAA a D)
- Histórico dos registros mais recentes com navegação rápida

### 📄 Relatório de Sustentabilidade
- Consumo de energia total em kWh
- Índice de eficiência percentual com barra de progresso visual
- Status de sustentabilidade: **Green Software** / **Em Análise** / **Não Sustentável**
- Tabela de métricas brutas por recurso: utilização média, pico de demanda e pegada de carbono estimada
- **Exportar PDF** — gera relatório completo via WeasyPrint com layout profissional e download direto no navegador

### 🔀 Comparação de Versões
- Seleção de dois softwares ou versões distintos
- Gráficos de barras de CPU e Memória lado a lado
- Cards de métricas rápidas: SCI Score, energia consumida e grade

### 🤖 Inteligência Artificial (Claude/Anthropic)
- **Recomendações por análise**: sugestões concretas para reduzir o SCI Score, classificadas por impacto (alto / médio / baixo)
- **Resumo em linguagem natural** da análise SCI
- **Chat interativo**: assistente responde perguntas sobre suas análises com contexto completo do histórico

---

## 🔌 Referência de Endpoints da API

| Método | Endpoint | Auth | Descrição |
|---|---|---|---|
| `POST` | `/api/auth/signup/` | Não | Cadastro de usuário |
| `POST` | `/api/auth/login/` | Não | Login |
| `POST` | `/api/auth/refresh/` | Não | Renovar token |
| `GET` | `/api/collector/token/` | JWT | Ver token do coletor |
| `POST` | `/api/collector/token/` | JWT | Regenerar token |
| `GET` | `/api/collector/download/` | JWT | Baixar script coletor `.py` |
| `GET` | `/api/analyses/` | JWT / CT | Listar análises |
| `POST` | `/api/analyses/` | JWT / CT | Criar análise |
| `GET` | `/api/analyses/{id}/` | JWT / CT | Detalhar análise |
| `DELETE` | `/api/analyses/{id}/` | JWT / CT | Excluir análise |
| `GET` | `/api/analyses/{id}/export/pdf/` | JWT | Exportar análise como PDF |
| `GET` | `/api/analyses/{id}/recommendations/` | JWT | Recomendações de IA |
| `GET` | `/api/analyses/{id}/summary/` | JWT | Resumo em linguagem natural |
| `GET` | `/api/dashboard/` | JWT | Dados agregados do dashboard |
| `POST` | `/api/chat/` | JWT | Chat com IA sobre análises |

> **JWT** = `Authorization: Bearer <access_token>`
> **CT** = `X-Collector-Token: <token>` (usado pelo script coletor)

---

## 📐 Como Funciona o Score SCI

O **Software Carbon Intensity (SCI)** segue o padrão da [Green Software Foundation](https://greensoftware.foundation/):

```
SCI = (Carbono Operacional + Carbono Incorporado) / Unidade Funcional
```

| Componente | Cálculo |
|---|---|
| Energia CPU | `TDP × CPU% × duração_h / 1000` |
| Energia RAM | `(RAM_GB/8 × 3W) × uso% × duração_h / 1000` |
| Carbono Operacional | `energia_kWh × intensidade_rede_elétrica` |
| Carbono Incorporado | `taxa_embodied × duração_h × fração_CPU` |

### Classificação por Grade

| Grade | Faixa SCI (gCO₂eq) | Status |
|---|---|---|
| **AAA** | 0 – 0,1 | 🟢 Green Software |
| **AA** | 0,1 – 0,5 | 🟢 Green Software |
| **A** | 0,5 – 2,0 | 🟢 Green Software |
| **B** | 2,0 – 10,0 | 🟡 Em Análise |
| **C** | 10,0 – 50,0 | 🔴 Não Sustentável |
| **D** | > 50,0 | 🔴 Não Sustentável |

### Intensidade da Rede Elétrica por Região

| Região | gCO₂/kWh |
|---|---|
| Brasil | 100 |
| França | 58 |
| Reino Unido | 233 |
| Alemanha | 350 |
| EUA | 386 |
| Austrália | 480 |
| China | 557 |
| Índia | 632 |

---

## 👥 Contribuidores

Projeto desenvolvido como Trabalho de Conclusão de Curso (TCC) do Curso de Sistemas de Informação na Fametro.

---

## 🌍 Alinhamento com ODS

Este projeto contribui com os Objetivos de Desenvolvimento Sustentável da Agenda 2030:

- **ODS 9** — Indústria, Inovação e Infraestrutura
- **ODS 11** — Cidades e Comunidades Sustentáveis
- **ODS 13** — Ação contra a Mudança Global do Clima

---

## 📄 Licença

Projeto acadêmico — Todos os direitos reservados aos autores.