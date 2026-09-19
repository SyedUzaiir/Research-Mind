# ResearchMind — Architecture & Microservice Specification

## 1. System Overview
ResearchMind is built using a decoupled dual-backend microservice architecture paired with a Next.js 14 single-page workspace application.

```
                                  +-----------------------+
                                  |   Next.js 14 Client   |
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
                                  +-----------------------+
```

## 2. Service Responsibilities

### A. Frontend (`frontend/`)
- Next.js 14 (App Router), React, TypeScript, Tailwind CSS, `lucide-react`.
- Split-screen PDF viewer (`pdfjs-dist`) with real-time text highlight bounding boxes.
- Interactive RAG Chat Panel, Synthesis Matrix, Citation Network Graph (`React Flow`), Mind Maps, Flashcards.

### B. Core API Backend (`backend-core/`)
- Express.js / Node.js service for User Auth (JWT/Bcrypt), Workspace Access Control, Document Metadata CRUD, Annotations.
- Prisma ORM managing PostgreSQL schema with `pgvector`.
- BullMQ asynchronous job producer for paper ingestion tasks.

### C. AI Engine Backend (`backend-ai/`)
- FastAPI Python microservice.
- Document Parsing & Optical Layout Analysis (PyMuPDF / Fitz) preserving formulas, headings, tables, and bounding boxes `(page, x, y, width, height)`.
- Dynamic Semantic Chunking & Vector Ingestion via `pgvector`.
- Hybrid Search (BM25 + Cosine Similarity) & Cross-Encoder Reranking (`FlashRank` / `SentenceTransformers`).
- RAG response generator with explicit source citations and highlight coordinates.
- Multi-paper synthesis, Literature Review matrix generation, Quiz/Flashcard generator, Pseudocode Extractor.

## 3. Asynchronous Job Pipelines
- **PDF Upload Flow**:
  1. Client uploads PDF to `backend-core`.
  2. `backend-core` stores PDF metadata and dispatches ingestion task to queue / `backend-ai`.
  3. `backend-ai` parses PDF structure, generates text chunks with bounding box JSON, computes vector embeddings, and stores vectors directly in PostgreSQL `PaperChunk`.
  4. Client receives completion event via WebSockets / Polling status.
