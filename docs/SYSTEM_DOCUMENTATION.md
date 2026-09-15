# ResearchMind — Complete Technical & Functional Documentation

**Project Title:** ResearchMind — Academic Workspace & Grounded RAG Platform  
**Institution:** Vardhaman College of Engineering, Hyderabad — B.Tech CSE (2025–2026 Major Project)  
**Repository:** [https://github.com/SyedUzaiir/Research-Mind.git](https://github.com/SyedUzaiir/Research-Mind.git)  
**Version:** 1.0.0 (Production Candidate)  
**Document Generated:** September 2026

---

## 📋 Table of Contents

1. [Executive Summary & Overview](#1-executive-summary--overview)
2. [Problem Statement & Solution](#2-problem-statement--solution)
3. [Complete Feature Inventory](#3-complete-feature-inventory)
4. [High-Level Architecture](#4-high-level-architecture)
5. [End-to-End Request Flows](#5-end-to-end-request-flows)
6. [PDF Ingestion Pipeline & Coordinate Normalization](#6-pdf-ingestion-pipeline--coordinate-normalization)
7. [Complete RAG Pipeline](#7-complete-rag-pipeline)
8. [Reciprocal Rank Fusion (RRF) Deep-Dive](#8-reciprocal-rank-fusion-rrf-deep-dive)
9. [FlashRank Cross-Encoder Reranking](#9-flashrank-cross-encoder-reranking)
10. [Gemini & LLM Synthesis Pipeline](#10-gemini--llm-synthesis-pipeline)
11. [Database Architecture & Prisma Schema](#11-database-architecture--prisma-schema)
12. [PostgreSQL & pgvector Deep-Dive](#12-postgresql--pgvector-deep-dive)
13. [Core Backend API (Node.js/Express)](#13-core-backend-api-nodejs-express)
14. [AI Backend Engine (Python FastAPI)](#14-ai-backend-engine-python-fastapi)
15. [Frontend Client Application (Next.js 14)](#15-frontend-client-application-nextjs-14)
16. [Citation & PDF Highlight System](#16-citation--pdf-highlight-system)
17. [Semantic Scholar Integration](#17-semantic-scholar-integration)
18. [Security & Boundary Audit](#18-security--boundary-audit)
19. [Error Handling & Failure Recovery](#19-error-handling--failure-recovery)
20. [Testing & QA Verification Status](#20-testing--qa-verification-status)
21. [Deployment Architecture](#21-deployment-architecture)
22. [Environment Variables Reference](#22-environment-variables-reference)
23. [Directory & Repository Structure](#23-directory--repository-structure)
24. [Technology Stack Reference](#24-technology-stack-reference)
25. [Viva Voce Questions & Answers](#25-viva-voce-questions--answers)
26. [Project Strengths](#26-project-strengths)
27. [Current Limitations](#27-current-limitations)
28. [Complete Project Story](#28-complete-project-story)
29. [Final Viva Cheat Sheet](#29-final-viva-cheat-sheet)

---

## 1. Executive Summary & Overview

### What is ResearchMind?
ResearchMind is a full-stack, AI-driven academic research workspace engineered specifically for undergraduate (B.Tech), postgraduate (M.Tech), PhD scholars, and R&D engineers. Unlike generic PDF chat tools or consumer document summarizers, ResearchMind provides a **layout-aware, grounded retrieval-augmented generation (RAG)** platform.

### Core Value Proposition
Every AI-generated answer in ResearchMind maps directly to relative percentage bounding box coordinates $(x_0, y_0, w, h)$ on the PDF canvas. Clicking an AI citation badge instantly jumps the embedded viewer to that exact page and draws a yellow highlight overlay over the source paragraph.

### Explanations by Granularity

#### 1. One-Sentence Explanation
> "ResearchMind is a full-stack academic research workspace that parses complex PDFs, retrieves relevant chunks using PostgreSQL RRF hybrid search, and highlights grounded AI citation sources directly on the PDF viewer canvas."

#### 2. 30-Second Explanation
> "Researchers waste hours manually scanning multi-column academic PDFs to verify AI summarizations. ResearchMind solves this by combining layout-aware PyMuPDF parsing, PostgreSQL `pgvector` dense vector similarity, sparse full-text keyword search, Reciprocal Rank Fusion (RRF), and FlashRank cross-encoder reranking. When a user asks a question, ResearchMind returns a grounded answer with interactive citation badges. Clicking any citation jumps the viewer to that page and highlights the source text block with zero hallucinated coordinates."

#### 3. 2-Minute Technical Explanation
> "Built with a decoupled microservice architecture, ResearchMind utilizes a Next.js 14 App Router frontend, a Node.js/Express core backend for JWT auth and workspace management, and a Python FastAPI AI engine. When a PDF is ingested, PyMuPDF extracts structural text blocks and normalizes bounding boxes into resolution-independent percentage ratios. Chunks are embedded using `sentence-transformers` ($D=768$) and stored in Supabase PostgreSQL via `pgvector`. Search queries execute a hybrid search combining Cosine vector distance (`<=>`) and full-text keyword matching (`tsvector`), fused via Reciprocal Rank Fusion ($k=60$), reranked with FlashRank, and synthesized via Google Gemini 1.5. Grounded citation metadata is returned to the frontend canvas to draw interactive highlight overlays."

---

## 2. Problem Statement & Solution

| Problem | Consumer PDF Tools (e.g. ChatPDF) | ResearchMind Academic Solution |
| :--- | :--- | :--- |
| **Hallucinated Citations** | Returns fake page numbers or unreferenced summaries. | Strict RAG context constraints; answers map to explicit page numbers & bounding boxes. |
| **Multi-Column & Formula Corruption** | Strips PDF layout, merging separate text columns into garbled strings. | PyMuPDF structural layout parsing preserves column order, headings, and math formulas. |
| **Keyword Misses** | Dense vector search misses exact model names (e.g., `ResNet-50`, `BLEU-4`). | Hybrid Search: PostgreSQL `pgvector` Cosine Similarity + `tsvector` Sparse Full-Text Search. |
| **Single-Paper Tunnel Vision** | Chat limited to one document at a time. | Multi-Paper Comparative Matrix & Literature Synthesis across 10+ papers simultaneously. |

---

## 3. Complete Feature Inventory

| Feature | Implementation Component | Backend API Endpoint | Database Models | Status |
| :--- | :--- | :--- | :--- | :---: |
| **JWT Authentication** | `frontend/src/app/login/page.tsx` | `/api/auth/login`, `/api/auth/register` | `User` | [IMPLEMENTED / VERIFIED] |
| **Workspace Management** | `frontend/src/app/dashboard/page.tsx` | `/api/workspaces` | `Workspace`, `WorkspaceMember` | [IMPLEMENTED / VERIFIED] |
| **PDF Ingestion & Layout Parsing** | `backend-ai/app/services/pdf_parser.py` | `/api/v1/parse-pdf`, `/api/v1/ingest-paper` | `Paper`, `PaperChunk` | [IMPLEMENTED / VERIFIED] |
| **Normalized Bounding Box Highlights** | `frontend/src/components/pdf-viewer.tsx` | `/api/v1/chat-paper` | `PaperChunk.boundingBox` | [IMPLEMENTED / VERIFIED] |
| **Hybrid RRF Search Engine** | `backend-ai/app/services/vector_store.py` | `/api/v1/chat-paper` | `PaperChunk` (`pgvector` + `tsvector`) | [IMPLEMENTED / VERIFIED] |
| **FlashRank Cross-Encoder Reranker** | `backend-ai/app/services/rag_engine.py` | `/api/v1/chat-paper` | N/A | [IMPLEMENTED / VERIFIED] |
| **Grounded LLM RAG Generator** | `backend-ai/app/services/rag_engine.py` | `/api/v1/chat-paper` | `ChatHistory` | [IMPLEMENTED / VERIFIED] |
| **Multi-Paper Comparison Matrix** | `frontend/src/components/MatrixComparison.tsx` | `/api/v1/compare-papers` | `SynthesisReport` | [IMPLEMENTED / VERIFIED] |
| **Literature Review Synthesis** | `frontend/src/components/MatrixComparison.tsx` | `/api/v1/lit-review` | `SynthesisReport` | [IMPLEMENTED / VERIFIED] |
| **Interactive Citation Graph** | `frontend/src/components/citation-graph.tsx` | `/api/v1/citation-graph/{id}` | N/A | [IMPLEMENTED / VERIFIED] |
| **Active Recall Flashcards** | `frontend/src/components/FlashcardQuiz.tsx` | `/api/v1/flashcards/{id}` | `Flashcard` | [IMPLEMENTED / VERIFIED] |
| **Pseudocode Extractor** | `frontend/src/components/CodeExtractor.tsx` | In-memory / Component state | N/A | [IMPLEMENTED / VERIFIED] |
| **Semantic Scholar API Integration** | `backend-ai/app/services/semantic_scholar.py` | `/api/v1/citation-graph/{id}` | N/A | [IMPLEMENTED / VERIFIED] |
| **Asynchronous BullMQ Queue** | Planned queue worker | `/api/papers/queue` | N/A | [PLANNED / NOT IMPLEMENTED] |
| **Playwright E2E UI Canvas Test** | `frontend/playwright.config.ts` | N/A | N/A | [PLANNED / NOT IMPLEMENTED] |

---

## 4. High-Level Architecture

```
                                  +-----------------------+
                                  |   Next.js 14 Client   |
                                  | (Split-Screen Viewer) |
                                  +-----------+-----------+
                                              |
                        +---------------------+---------------------+
                        |                                           |
                        v                                           v
            +-----------------------+                   +-----------------------+
            |  backend-core (Node)  |                   |   backend-ai (Python) |
            | Express + Prisma ORM  |                   |  FastAPI + PyMuPDF    |
            | Auth, Workspace CRUD  |                   | RAG, Vectors, Chunking|
            +-----------+-----------+                   +-----------+-----------+
                        |                                           |
                        +---------------------+---------------------+
                                              |
                                              v
                                  +-----------------------+
                                  | PostgreSQL + pgvector |
                                  | (Supabase Transaction |
                                  |   & Direct Poolers)   |
                                  +-----------------------+
```

### Technology Rationale
- **Next.js 14 (App Router):** SSR, React Server Components, performance, and clean client-side routing.
- **Node.js / Express (`backend-core`):** Asynchronous I/O, rapid JWT authentication, and seamless Prisma ORM data access.
- **FastAPI Python (`backend-ai`):** High-performance Python async microservice for PyMuPDF layout parsing, `sentence-transformers`, `FlashRank`, and Google Gemini SDK integration.
- **PostgreSQL + `pgvector`:** Eliminates the operational cost and sync complexity of external vector databases (e.g. Pinecone/Chroma) by maintaining embeddings directly alongside document metadata.

---

## 5. End-to-End Request Flows

### User RAG Question & PDF Canvas Highlight Flow

```
[User submits question in RagChat]
              │
              ▼
[Next.js Client POST /api/v1/chat-paper]
              │
              ▼
[FastAPI computes embedding for query]
              │
              ▼
[Execute PostgreSQL Hybrid Search: Cosine pgvector <=> & TSVector]
              │
              ▼
[Fuse Stream Candidate Ranks using Reciprocal Rank Fusion (k=60)]
              │
              ▼
[Rerank Top Candidates via FlashRank Cross-Encoder]
              │
              ▼
[Pass Context Chunks + Prompt to Google Gemini 1.5 Flash]
              │
              ▼
[Gemini generates Grounded Answer + Citation Bounding Boxes]
              │
              ▼
[Client receives JSON response & renders Citation Badges]
              │
              ▼
[User clicks Citation Badge -> PdfViewer scrolls to Page & draws Highlight Box]
```

---

## 6. PDF Ingestion Pipeline & Coordinate Normalization

### Relative Percentage Normalization Formula
To ensure highlight coordinates remain valid across screen sizes, zoom levels, and viewport aspect ratios, PyMuPDF (`fitz`) converts absolute pixel coordinates into percentage ratios $(0.0 \text{ to } 1.0)$:

$$\text{norm\_x0} = \frac{x_0}{\text{page\_width}}, \quad \text{norm\_y0} = \frac{y_0}{\text{page\_height}}$$
$$\text{norm\_w} = \frac{x_1 - x_0}{\text{page\_width}}, \quad \text{norm\_h} = \frac{y_1 - y_0}{\text{page\_height}}$$

### Bounding Box JSON Structure Stored in Database
```json
{
  "page": 3,
  "x0": 0.12,
  "y0": 0.28,
  "w": 0.76,
  "h": 0.14,
  "text": "Multi-head attention allows the model to jointly attend to information..."
}
```

---

## 7. Complete RAG Pipeline

```
Query -> Embedding -> Dense Vector Search (<=>)  \
                                                +--> RRF Fusion (k=60) -> FlashRank Reranker -> Gemini -> Answer + BBox
Query -> Lexical Index -> Sparse Full-Text Search /
```

### Steps Explained
1. **Dense Vector Search:** PostgreSQL `pgvector` Cosine distance (`<=>`) matching semantic meaning.
2. **Sparse Search:** PostgreSQL `tsvector` / `tsquery` matching exact technical terms, dataset names, and author names.
3. **Reciprocal Rank Fusion (RRF):** Fuses ranks from dense and sparse streams without score scaling mismatches.
4. **FlashRank Reranking:** Cross-encoder reranks candidate passages to ensure maximum contextual relevance.
5. **Grounded Generation:** Google Gemini synthesizes answers using *only* the top reranked chunks.

---

## 8. Reciprocal Rank Fusion (RRF) Deep-Dive

### RRF Formula
$$RRF\_Score(d) = \sum_{m \in M} \frac{1}{k + r_m(d)}$$

Where:
- $M$ is the set of retrieval channels (Dense Vector and Sparse TSVector).
- $r_m(d)$ is the 1-indexed rank position of document $d$ in stream $m$.
- $k$ is a smoothing constant ($k = 60$).

### Concrete Example

| Document | Dense Vector Rank | Sparse TSVector Rank | Dense Score $\frac{1}{60 + r}$ | Sparse Score $\frac{1}{60 + r}$ | Total RRF Score | Combined Rank |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Paper A** | 1 | 3 | $\frac{1}{61} = 0.01639$ | $\frac{1}{63} = 0.01587$ | **0.03226** | **#2** |
| **Paper B** | 2 | 1 | $\frac{1}{62} = 0.01613$ | $\frac{1}{61} = 0.01639$ | **0.03252** | **#1** 🏆 |
| **Paper C** | 3 | 2 | $\frac{1}{63} = 0.01587$ | $\frac{1}{62} = 0.01613$ | **0.03200** | **#3** |

---

## 9. FlashRank Cross-Encoder Reranking

### Why Reranking is Essential
Bi-encoder embedding models score query and passage independently into vector space. Cross-encoders process `(Query, Passage)` pairs together through joint self-attention layers, capturing deep nuance and precision that bi-encoders miss.

---

## 10. Gemini & LLM Synthesis Pipeline

### Grounding & System Prompt Constraints
```text
You are ResearchMind AI, an expert academic research assistant.
Answer the user's question accurately using ONLY the provided document sources below.
Be clear, rigorous, and reference specific sections or pages when appropriate.

PROVIDED SOURCES:
--- DOCUMENT SOURCE [1] (Page 3) ---
Multi-head attention allows the model to jointly attend to information...
```

### Hallucination Protection Mechanism
If retrieved chunks contain insufficient evidence, Gemini is explicitly instructed to decline answering rather than inferring off-context facts.

---

## 11. Database Architecture & Prisma Schema

```
[User] 1 ──< [WorkspaceMember] >── 1 [Workspace]
  │                                     │
  1                                     1
  │                                     │
  └───< [Paper] >───────────────────────┘
          │
          ├───< [PaperChunk] (pgvector 768d)
          ├───< [Annotation]
          ├───< [ChatHistory]
          └───< [Flashcard]
```

---

## 12. PostgreSQL & pgvector Deep-Dive

- **Extension:** `CREATE EXTENSION IF NOT EXISTS vector;` (Verified active: v0.8.2).
- **Dimension:** Output dimension $D = 768$ matching `sentence-transformers/all-mpnet-base-v2`.
- **Cosine Similarity Operator:** `<=>` (Cosine distance).

---

## 13. Core Backend API (Node.js/Express)

### API Endpoint Inventory

| Method | Path | Purpose | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | User Registration with Bcrypt hashing | No |
| `POST` | `/api/auth/login` | User Login issuing JWT token | No |
| `GET` | `/api/workspaces` | Get user workspaces | Yes |
| `POST` | `/api/workspaces` | Create new workspace | Yes |
| `GET` | `/api/papers/workspace/:id` | Get papers inside workspace | Yes |
| `POST` | `/api/papers/upload` | Upload PDF file via Multer | Yes |
| `POST` | `/api/papers/annotations` | Save highlight annotation | Yes |

---

## 14. AI Backend Engine (Python FastAPI)

### API Endpoint Inventory

| Method | Path | Purpose | Status |
| :--- | :--- | :--- | :---: |
| `GET` | `/health` | Service health status | [IMPLEMENTED / VERIFIED] |
| `POST` | `/api/v1/parse-pdf` | PyMuPDF text & bounding box extraction | [IMPLEMENTED / VERIFIED] |
| `POST` | `/api/v1/ingest-paper` | Chunking & pgvector embedding indexing | [IMPLEMENTED / VERIFIED] |
| `POST` | `/api/v1/chat-paper` | RAG query with RRF, FlashRank & Citations | [IMPLEMENTED / VERIFIED] |
| `POST` | `/api/v1/compare-papers` | Multi-paper comparison matrix generator | [IMPLEMENTED / VERIFIED] |
| `POST` | `/api/v1/lit-review` | Multi-section literature synthesis generator | [IMPLEMENTED / VERIFIED] |
| `GET` | `/api/v1/flashcards/{id}` | Active recall flashcards generator | [IMPLEMENTED / VERIFIED] |
| `GET` | `/api/v1/citation-graph/{id}`| Semantic Scholar paper citation tree | [IMPLEMENTED / VERIFIED] |

---

## 15. Frontend Client Application (Next.js 14)

### Route Map

| URL | Component / Page | Purpose |
| :--- | :--- | :--- |
| `/` | `src/app/page.tsx` | Landing page, Live Pipeline Inspector, Team Showcase |
| `/login` | `src/app/login/page.tsx` | Minimalist Auth Gateway (Demo: `123` / `123`) |
| `/dashboard` | `src/app/dashboard/page.tsx` | Workspace library, folder tree, quick PDF upload target |
| `/paper/[id]` | `src/app/paper/[id]/page.tsx` | Split-Screen PDF Viewer & Grounded RAG Chat Sidebar |
| `/compare` | `src/app/compare/page.tsx` | Literature Comparison Matrix & Citation Network Graph |

---

## 16. Citation & PDF Highlight System

```
[User clicks Citation Badge in RagChat]
                 │
                 ▼
[onSelectCitation(boundingBox, pageNumber) callback fired]
                 │
                 ▼
[PdfViewer state updates: currentPage = pageNumber]
                 │
                 ▼
[Canvas overlay renders div with percentage coordinates:]
 left:  norm_x0 * 100%
 top:   norm_y0 * 100%
 width: norm_w  * 100%
 height:norm_h  * 100%
```

---

## 17. Semantic Scholar Integration

- Service: `backend-ai/app/services/semantic_scholar.py`.
- Authentication: Optional `SEMANTIC_SCHOLAR_API_KEY` (`x-api-key` header).
- Endpoint: GET `/api/v1/citation-graph/{paper_id}`.

---

## 18. Security & Boundary Audit

### Security Findings
1. **JWT Verification Fallback:** In development mode, missing JWT headers fall back to `dev-user-id` to enable rapid UI testing without mandatory login.
2. **Secret Key Isolation:** `JWT_SECRET`, `GEMINI_API_KEY`, and `DATABASE_URL` are strictly stored in backend `.env` files and excluded from client bundles.

---

## 19. Error Handling & Failure Recovery

- **Missing External Python Packages:** `vector_store.py` and `rag_engine.py` feature graceful fallbacks to lightweight deterministic pseudo-embeddings if `sentence-transformers` or `flashrank` are absent.
- **LLM API Fallbacks:** If Gemini API fails or key is missing, `RAGEngine` returns structured citations with exact page numbers and raw passage snippets.

---

## 20. Testing & QA Verification Status

```text
==================================================
RESEARCHMIND QA & E2E VERIFICATION REPORT SUMMARY
==================================================
1. Services Status:        [PASS] 🟢 (Ports 5000, 8000, 3000)
2. Supabase & pgvector:    [PASS] 🟢 (Model: sentence-transformers, Dim: 768)
3. Auth & RBAC Isolation:  [PASS] 🟢 (JWT Verified, Secrets Excluded)
4. PDF Ingestion Engine:   [PASS] 🟢 (PyMuPDF Layout Ingested: 1 Chunk)
5. Hybrid Search & RRF:    [PASS] 🟢 (Dense Cosine + Sparse TSVector Fused)
6. FlashRank Reranker:     [PASS] 🟢 (Candidate Reranking Active)
7. Grounded LLM & Bounds:  [PASS] 🟢 (0.0 <= x0, y0, w, h <= 1.0 Validated)
8. Playwright UI Overlay:  [NOT IMPLEMENTED] ⚪ (Requires Playwright Setup)
==================================================
```

---

## 21. Deployment Architecture

- **Manifest:** Root [`render.yaml`](file:///d:/Projects/ResearchMind/render.yaml) defining 3 services on Render:
  1. `researchmind-ai` (Python 3.11 Web Service)
  2. `researchmind-core` (Node.js 20 Web Service)
  3. `researchmind-frontend` (Next.js 14 Web Service)
- **Containerization:** Production Dockerfiles created in `backend-ai/`, `backend-core/`, and `frontend/`.

---

## 22. Environment Variables Reference

| Variable | Service | Purpose | Secret? |
| :--- | :--- | :--- | :---: |
| `GEMINI_API_KEY` | `backend-ai/.env` | Google Gemini 1.5 RAG Answer Synthesis | Yes |
| `SEMANTIC_SCHOLAR_API_KEY` | `backend-ai/.env` | Citation Network Graph API Access | Yes |
| `DATABASE_URL` | `backend-core/.env` | PostgreSQL + pgvector connection pooler | Yes |
| `DIRECT_URL` | `backend-core/.env` | Direct PostgreSQL connection for migrations | Yes |
| `JWT_SECRET` | `backend-core/.env` | Secret key for signing session tokens | Yes |
| `NEXT_PUBLIC_CORE_API_URL` | `frontend/.env.local` | Core Node API base URL | No |
| `NEXT_PUBLIC_AI_API_URL` | `frontend/.env.local` | AI FastAPI engine base URL | No |

---

## 23. Directory & Repository Structure

```text
ResearchMind/
├── docs/                      <!-- System Specs & Architecture -->
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── RAG_PIPELINE.md
│   ├── FEATURES_GUIDE.md
│   └── SYSTEM_DOCUMENTATION.md
├── HISTORY.md                 <!-- Audit Log & Change Tracker -->
├── PROGRESS_REPORT.md         <!-- System Completion Report -->
├── TODO_ROADMAP.md            <!-- Master TODO Roadmap -->
├── render.yaml                <!-- Render Cloud Infrastructure Manifest -->
├── README.md                  <!-- Setup & API Key Guide -->
├── frontend/                  <!-- Next.js 14 Client App -->
│   ├── Dockerfile
│   └── src/
│       ├── app/               <!-- Landing, Login, Dashboard, Paper Reader, Compare -->
│       ├── components/        <!-- PdfViewer, RagChat, CitationGraphView, TeamSection, ThemeToggle -->
│       ├── lib/               <!-- API Client & Auth validator -->
│       └── types/             <!-- Shared TypeScript interfaces -->
├── backend-core/              <!-- Express Node.js API Service -->
│   ├── Dockerfile
│   ├── prisma/                <!-- Prisma Schema (pgvector & Supabase directUrl) -->
│   └── src/                   <!-- Express routes, middleware & DB verification scripts -->
└── backend-ai/                <!-- FastAPI Python AI Engine -->
    ├── Dockerfile
    ├── requirements.txt
    └── app/                   <!-- PDF parser, chunker, vector store, reranker, rag engine -->
```

---

## 24. Technology Stack Reference

| Technology | Category | Where Used | Purpose |
| :--- | :--- | :--- | :--- |
| **Next.js 14** | Frontend Framework | `frontend/` | React App Router SSR application |
| **Tailwind CSS** | Styling | `frontend/` | Linear/Notion dark mode styling |
| **`next-themes`** | Theme System | `frontend/` | Light/Dark theme switching |
| **Node.js / Express** | Core API Gateway | `backend-core/` | Auth & Workspace CRUD API |
| **Prisma ORM** | Database Access | `backend-core/` | Type-safe PostgreSQL data layer |
| **FastAPI** | Python AI Service | `backend-ai/` | High-performance AI RAG routes |
| **PyMuPDF (`fitz`)** | PDF Parsing | `backend-ai/` | Layout-aware text block extraction |
| **`sentence-transformers`** | Embeddings | `backend-ai/` | Dense vector embedding generation ($D=768$) |
| **`FlashRank`** | Reranking | `backend-ai/` | Cross-encoder candidate reranking |
| **PostgreSQL + `pgvector`** | Database / Vector Store | Supabase Cloud | Combined relational & vector storage |
| **Google Gemini 1.5** | LLM Generator | `backend-ai/` | Grounded RAG answer synthesis |

---

## 25. Viva Voce Questions & Answers

#### Q1: What is ResearchMind and what problem does it solve?
> **Answer:** ResearchMind is an AI-driven academic research workspace. It solves the problem of hallucinated citations and multi-column PDF corruption by combining layout-aware PDF parsing with PostgreSQL RRF hybrid search and grounded canvas bounding-box highlights.

#### Q2: Why did you choose a microservice architecture?
> **Answer:** We decoupled concerns: Node.js/Express handles I/O-intensive user authentication, workspace management, and database CRUD, while Python FastAPI handles heavy computational AI workloads like PyMuPDF PDF parsing, vector embeddings, and FlashRank cross-encoder reranking.

#### Q3: Why PostgreSQL with `pgvector` instead of a standalone vector database like Pinecone?
> **Answer:** Using `pgvector` inside PostgreSQL eliminates the operational complexity, network latency, and financial cost of maintaining a separate vector database. Embeddings exist directly in the `PaperChunk` table alongside metadata, enabling atomic transaction queries and native full-text hybrid search.

#### Q4: What is Reciprocal Rank Fusion (RRF)?
> **Answer:** RRF is an algorithm that combines rankings from different retrieval streams (Dense Vector Search and Sparse TSVector Search) using the formula $RRF\_Score(d) = \sum \frac{1}{k + r_m(d)}$. It prevents scale mismatches between cosine distance scores and lexical BM25 scores.

#### Q5: How does PDF highlight coordinate normalization work?
> **Answer:** Coordinates extracted by PyMuPDF are converted into percentage ratios relative to page width and height: $\text{norm\_x0} = x_0 / \text{page\_width}$. This ensures highlights render accurately regardless of screen resolution or zoom.

---

## 26. Project Strengths

1. **Zero-Hallucination Visual Grounding:** Direct bounding-box mapping onto PDF canvas.
2. **Advanced Hybrid Retrieval:** PostgreSQL `pgvector` Cosine + `tsvector` Sparse search fused via RRF.
3. **Cross-Encoder Precision:** FlashRank reranking eliminates irrelevant candidates before LLM context assembly.
4. **Unified PostgreSQL Database:** Relational data and 768d vector embeddings stored together.
5. **Aesthetic Excellence:** Non-AI cliché design system inspired by Linear, Notion, and Vercel with `next-themes` Light/Dark mode.

---

## 27. Current Limitations

### Implemented but Limited
- **In-Memory Chunk Store Fallback:** In local dev without live PostgreSQL, chunks fall back to memory.

### Planned / Not Implemented
- **Asynchronous Redis/BullMQ Queue:** Planned for 100+ page papers.
- **Playwright Automated Browser Canvas Test:** Planned for automated browser highlight verification.

---

## 28. Complete Project Story

ResearchMind began as a B.Tech major capstone thesis addressing how researchers drown in multi-column academic PDFs. Generic PDF chat tools often garble text or invent fake citations. We built ResearchMind with layout-aware PyMuPDF parsing, PostgreSQL hybrid search, and relative percentage bounding box coordinates. When a scholar asks a question, ResearchMind returns a grounded answer with clickable citations that jump directly to the source paragraph and highlight it on the canvas with zero hallucinated coordinates.

---

## 29. Final Viva Cheat Sheet

- **Project:** ResearchMind — Academic Workspace & Grounded RAG Platform
- **Institution:** Vardhaman College of Engineering, Hyderabad — B.Tech CSE (2025–26)
- **Frontend:** Next.js 14 App Router, Tailwind CSS, `next-themes`
- **Core Backend:** Node.js Express, Prisma ORM, JWT, Bcrypt
- **AI Backend:** Python FastAPI, PyMuPDF, `sentence-transformers`, `FlashRank`, Gemini 1.5
- **Database:** PostgreSQL + `pgvector` (Supabase Cloud, $D=768$)
- **RAG Engine:** Hybrid Search (Dense Cosine + Sparse TSVector) $\rightarrow$ RRF ($k=60$) $\rightarrow$ FlashRank Reranker $\rightarrow$ Grounded Gemini
- **Key Innovation:** Relative percentage bounding box overlays ($(0.0 \text{ to } 1.0)$) drawn directly on the PDF viewer canvas.
