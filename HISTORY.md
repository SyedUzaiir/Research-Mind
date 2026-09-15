# ResearchMind — Change Audit Log & History Tracker

All major changes, database updates, microservice additions, and pipeline enhancements are tracked here chronologically.

---

## [2026-09-15 07:16] - Master Project Setup & Specs Initialization
- **Scope:** System Specification & Documentation Architecture
- **Summary:** Initialized core documentation structure, architecture diagrams, database schema design with pgvector support, RAG pipeline specifications, and features guide.
- **Files Created:**
  - `docs/ARCHITECTURE.md`
  - `docs/DATABASE.md`
  - `docs/RAG_PIPELINE.md`
  - `docs/FEATURES_GUIDE.md`
  - `HISTORY.md`
- **Docs Updated:** All `docs/*.md` files initialized.

---

## [2026-09-15 07:17] - Prisma Schema & Database Models
- **Scope:** Backend Database Schema (`backend-core/src/prisma/schema.prisma`)
- **Summary:** Created full Prisma schema with PostgreSQL `pgvector` extension enabled. Defined `User`, `Workspace`, `WorkspaceMember`, `Paper`, `PaperChunk` (vector embedding & boundingBox), `Annotation`, `ChatHistory`, `Flashcard`, and `SynthesisReport` models.
- **Files Created:**
  - `backend-core/src/prisma/schema.prisma`
- **Docs Updated:** `docs/DATABASE.md`

---

## [2026-09-15 07:19] - Technical Specifications for Bounding Box Mapping & PostgreSQL RRF Hybrid Search
- **Scope:** AI RAG Pipeline & Database Search Specifications (`docs/RAG_PIPELINE.md`)
- **Summary:** Added mathematical specification for normalized page coordinates ($\text{norm\_x} = x_0 / \text{page\_width}$, $\text{norm\_y} = y_0 / \text{page\_height}$) to guarantee resolution-independent frontend canvas rendering. Added hybrid search specification combining dense vector embeddings (`pgvector` `<=>`) with sparse full-text search (`tsvector` / `tsquery`) via Reciprocal Rank Fusion (RRF: $RRF\_Score(d) = \sum \frac{1}{k + r_m(d)}$) before FlashRank cross-encoder reranking.
- **Files Modified:**
  - `docs/RAG_PIPELINE.md`
- **Docs Updated:** `docs/RAG_PIPELINE.md`

---

## [2026-09-15 07:20] - Project Naming & API Credentials Guide
- **Scope:** Project Naming & Setup Guide (`README.md`)
- **Summary:** Formally set project branding as **ResearchMind**. Documented API key requirements: `GEMINI_API_KEY` or `OPENAI_API_KEY` for LLM RAG synthesis; zero-cost local models for embeddings/reranking (`sentence-transformers` & `FlashRank`); and optional `SEMANTIC_SCHOLAR_API_KEY` for paper citation network graph traversal.
- **Files Created:**
  - `README.md`
- **Docs Updated:** `README.md`

---

## [2026-09-15 07:23] - Step 2: FastAPI AI Engine Microservice Implementation
- **Scope:** Python AI Engine (`backend-ai/`)
- **Summary:** Created full FastAPI service featuring PyMuPDF relative bounding box normalization (`pdf_parser.py`), semantic chunker (`chunker.py`), RRF vector search service (`vector_store.py`), RAG grounded answer generator with FlashRank reranking (`rag_engine.py`), and multi-paper synthesis matrix & lit review engine (`synthesis.py`).
- **Files Created:**
  - `backend-ai/requirements.txt`
  - `backend-ai/app/main.py`
  - `backend-ai/app/models/schemas.py`
  - `backend-ai/app/services/pdf_parser.py`
  - `backend-ai/app/services/chunker.py`
  - `backend-ai/app/services/vector_store.py`
  - `backend-ai/app/services/rag_engine.py`
  - `backend-ai/app/services/synthesis.py`
  - `backend-ai/app/routers/rag.py`
- **Docs Updated:** `docs/ARCHITECTURE.md`, `docs/RAG_PIPELINE.md`, `HISTORY.md`

---

## [2026-09-15 07:26] - Step 3: Core API Backend Implementation
- **Scope:** Express Node.js API Service (`backend-core/`)
- **Summary:** Built Express server with TypeScript, JWT authentication, Workspace CRUD routes, Paper upload & annotation endpoints, and Prisma schema integration.
- **Files Created:**
  - `backend-core/package.json`
  - `backend-core/tsconfig.json`
  - `backend-core/src/server.ts`
  - `backend-core/src/middleware/auth.ts`
  - `backend-core/src/routes/auth.ts`
  - `backend-core/src/routes/workspace.ts`
  - `backend-core/src/routes/paper.ts`

---

## [2026-09-15 07:44] - Team Section Update (Vardhaman College of Engineering, 2025–26)
- **Scope:** Team Section Component (`frontend/src/components/team-section.tsx`)
- **Summary:** Updated team section with exact metadata: **Vardhaman College of Engineering, Hyderabad — B.Tech CSE, 2025–26** and member profiles (Syed Uzair Mohiuddin, Sarasam Chinmaee Reddy, Manohar Yadav Boddu).
- **Files Modified:**
  - `frontend/src/components/team-section.tsx`

---

## [2026-09-15 19:50] - Semantic Scholar API Key Integration
- **Scope:** Python AI Engine (`backend-ai/app/services/semantic_scholar.py`)
- **Summary:** Added `SEMANTIC_SCHOLAR_API_KEY` configuration to `backend-ai/.env` and built `SemanticScholarService` to fetch paper forward/backward citations with authenticated rate limit support (`x-api-key`). Exposed GET `/api/v1/citation-graph/{paper_id}` route.
- **Files Created/Modified:**
  - `backend-ai/.env`
  - `backend-ai/app/services/semantic_scholar.py`
  - `backend-ai/app/routers/rag.py`
- **Docs Updated:** `HISTORY.md`
