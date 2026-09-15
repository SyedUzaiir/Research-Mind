# ResearchMind — Academic Workspace & RAG Platform

**ResearchMind** (powered by AntiGravity AI) is a production-grade, full-stack, AI-driven academic research workspace designed for B.Tech/M.Tech students, PhD scholars, and researchers.

---

## 🔑 Required & Optional API Keys

To run the full **ResearchMind** platform, you will need the following environment keys:

### 1. Primary LLM API (Required for RAG & Synthesis)
- **`GEMINI_API_KEY`** (Google Gemini 1.5 Pro / Flash) — *Recommended*
  *OR*
- **`OPENAI_API_KEY`** (OpenAI GPT-4o / GPT-4o-mini)

### 2. Embeddings & Reranker (Local or External)
- **Local (Default & Free)**: Python `sentence-transformers` (`all-mpnet-base-v2` / `bge-base-en-v1.5`) & `FlashRank` cross-encoder. *No API key required!*
- **External (Optional)**: `COHERE_API_KEY` if using Cohere Rerank v3.

### 3. Citation Graph & Academic Metadata (Free Tier Available)
- **Semantic Scholar API Key** (`SEMANTIC_SCHOLAR_API_KEY`): Free key available at [semanticscholar.org](https://www.semanticscholar.org/product/api). Works without key under public rate limits.
- **OpenAlex API**: Open-access API (requires passing user email in request headers).

### 4. Database & Storage
- **`DATABASE_URL`**: PostgreSQL connection string with `pgvector` enabled (e.g. `postgresql://postgres:postgres@localhost:5432/researchmind`).
- **`JWT_SECRET`**: Secret string for user session token authentication.

---

## 🏛️ Project Microservices Structure

```text
ResearchMind/
├── docs/                      <!-- System Documentation & Specifications -->
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── RAG_PIPELINE.md
│   └── FEATURES_GUIDE.md
├── HISTORY.md                 <!-- Audit Log & Change Tracker -->
├── frontend/                  <!-- Next.js 14 App Router Client -->
├── backend-core/              <!-- Node.js/Express Auth & Workspace API -->
└── backend-ai/                <!-- FastAPI Python AI Engine -->
```

---

## 🚀 Quick Start Guide

### 1. Database Setup
Ensure PostgreSQL is running with `pgvector` enabled, then initialize Prisma:
```bash
cd backend-core
npm install
npx prisma db push
```

### 2. FastAPI AI Engine Setup
```bash
cd backend-ai
python -m venv venv
# On Windows:
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 3. Core Node Backend Setup
```bash
cd backend-core
npm run dev
```

### 4. Next.js Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
