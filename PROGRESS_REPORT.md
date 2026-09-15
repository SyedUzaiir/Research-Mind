# ResearchMind — Current System Progress Report

**Project Name:** ResearchMind — Academic Workspace & Grounded RAG Platform  
**Institution:** Vardhaman College of Engineering, Hyderabad — B.Tech CSE (2025–2026 Major Project)  
**Repository:** [https://github.com/SyedUzaiir/Research-Mind.git](https://github.com/SyedUzaiir/Research-Mind.git)  
**Status:** Core Platform Architecture, PDF.js Canvas Reader, PostgreSQL pgvector RRF, RAG Chat, and AI Synthesis Features 100% Implemented, Debugged & E2E Verified 🟢

---

## 📊 Summary of Completed Milestones

```
[M1: System Specs & Docs] ──► [M2: Database & Prisma] ──► [M3: Python RAG Engine]
                                                                  │
[M6: GitHub & Deployment] ◄── [M5: Linear/Notion UI] ◄── [M4: Core Node API]
```

| Component / Module | Scope & Deliverables | Status |
| :--- | :--- | :---: |
| **System Specs & Documentation** | `docs/ARCHITECTURE.md`, `DATABASE.md`, `RAG_PIPELINE.md`, `FEATURES_GUIDE.md`, `HISTORY.md` | ✅ Complete |
| **Database & Vector Store** | PostgreSQL Prisma Schema (`schema.prisma`) with `pgvector` extension, `directUrl` for Supabase pooler | ✅ Complete |
| **Python AI Engine (`backend-ai`)** | PyMuPDF percentage bounding-box parser, layout-aware semantic chunker, RRF vector search, FlashRank reranker, RAG engine, Semantic Scholar client | ✅ Complete |
| **Core Node API (`backend-core`)** | Express.js API with TypeScript, JWT authentication, Workspace CRUD, Multer PDF file uploads, Annotations API | ✅ Complete |
| **Frontend Workspace (`frontend`)** | Next.js 14 App Router, Tailwind CSS, `next-themes` Light/Dark mode, Split-Screen PDF reader canvas, RAG chat sidebar, Literature matrix, Citation graph | ✅ Complete |
| **Team Showcase** | Integrated B.Tech Major Project team details for **Vardhaman College of Engineering, Hyderabad — B.Tech CSE, 2025–26** | ✅ Complete |
| **Environment & Git Setup** | `.env.example` templates, Supabase URL encoding, `.gitignore`, GitHub repository initialized and pushed to `main` branch | ✅ Complete |

---

## 🛠️ Detailed Feature Progress Breakdown

### 1. Layout-Aware PDF Ingestion & Bounding-Box Normalization
- Integrated PyMuPDF (`fitz`) in `backend-ai/app/services/pdf_parser.py`.
- Computes percentage-based relative coordinates $(0.0 \text{ to } 1.0)$ for every extracted block:
  $$\text{norm\_x0} = \frac{x_0}{\text{page\_width}}, \quad \text{norm\_y0} = \frac{y_0}{\text{page\_height}}$$
- Guarantees scaling-independent yellow bounding-box highlight overlays on frontend canvas regardless of viewport resolution or zoom level.

### 2. PostgreSQL Dense + Sparse Hybrid Search with Reciprocal Rank Fusion (RRF)
- Dense vector similarity (`pgvector` `<=>` Cosine distance) combined with sparse keyword search (`tsvector` / `tsquery`).
- Fused using Reciprocal Rank Fusion formula in `backend-ai/app/services/vector_store.py`:
  $$RRF\_Score(d) = \sum_{m \in M} \frac{1}{k + r_m(d)}$$
- Top RRF candidates pass through `FlashRank` cross-encoder reranker before LLM RAG prompt generation.

### 3. Multi-Paper Literature Review & Comparison Matrix
- Automated 10-paper comparative analysis across *Dataset / Benchmark*, *Core Algorithm*, *Quantitative Metrics*, and *Methodological Limitations*.
- Literature review synthesis report generator producing structured multi-section markdown summaries.

### 4. Grounded RAG Chat & Interactive PDF Highlights
- Assistant answers return explicit page numbers and citation bounding boxes `[Page X, ¶Y]`.
- Clicking any citation badge inside `RagChat` sidebar fires callback to `PdfViewer` canvas, jumping directly to that page and rendering the yellow highlight overlay.

### 5. Semantic Scholar Citation Network Graph API
- Built `SemanticScholarService` (`backend-ai/app/services/semantic_scholar.py`) supporting authenticated API requests (`x-api-key`).
- Exposed GET `/api/v1/citation-graph/{paper_id}` endpoint feeding forward and backward paper citations into 2D node graph visualizers.

---

## 📁 Repository File Tree Verified

```text
ResearchMind/
├── docs/                      <!-- Architecture, ERD, RAG Pipeline & Features Guides -->
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── RAG_PIPELINE.md
│   └── FEATURES_GUIDE.md
├── HISTORY.md                 <!-- Chronological Audit Log & Change Tracker -->
├── PROGRESS_REPORT.md         <!-- System Completion & Milestones Report -->
├── TODO_ROADMAP.md            <!-- Full Roadmap of Future Enhancements -->
├── README.md                  <!-- Project Quickstart & Environment Setup Guide -->
├── frontend/                  <!-- Next.js 14 App Router Workspace -->
│   ├── src/
│   │   ├── app/               <!-- Landing (/), Login (/login), Dashboard (/dashboard), Reader (/paper/[id]), Compare (/compare) -->
│   │   ├── components/        <!-- PdfViewer, RagChat, CitationGraphView, TeamSection, ThemeToggle -->
│   │   ├── lib/               <!-- API clients & demo auth validator -->
│   │   └── types/             <!-- Shared TypeScript interfaces -->
├── backend-core/              <!-- Express Node.js Auth & Workspace API -->
│   ├── prisma/                <!-- Prisma Schema with pgvector & Supabase directUrl -->
│   └── src/                   <!-- Express controllers & JWT auth middleware -->
└── backend-ai/                <!-- Python FastAPI RAG AI Engine -->
    └── app/                   <!-- PyMuPDF parser, chunker, RRF vector store, FlashRank reranker, RAG engine -->
```
