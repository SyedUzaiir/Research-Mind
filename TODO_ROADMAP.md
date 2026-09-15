# ResearchMind — Master Roadmap of Complete Future Tasks (TODO)

This document outlines all remaining tasks, production deployment steps, asynchronous processing enhancements, advanced feature additions, and capstone presentation preparation for **ResearchMind**.

---

## 🎯 Master Phase Checklist

```
[Phase 1: DB Migration & Cloud] ──► [Phase 2: Async Job Queues] ──► [Phase 3: Real PDF Renderer]
                                                                             │
[Phase 6: Capstone Presentation] ◄── [Phase 5: RAG Evaluation] ◄── [Phase 4: Overleaf & Sandboxing]
```

---

## 📌 Phase 1: Database Migration & Cloud Deployment

- [ ] **1.1 Push Database Schema to Supabase**:
  - Run `npx prisma db push` inside `backend-core/` to create all PostgreSQL tables (`users`, `workspaces`, `papers`, `paper_chunks` with `pgvector`) in the remote Supabase database.
- [ ] **1.2 Deploy `backend-ai` FastAPI Service**:
  - Deploy Python FastAPI microservice to Render / Railway / AWS ECS.
  - Set production `GEMINI_API_KEY` and `SEMANTIC_SCHOLAR_API_KEY` environment variables.
- [ ] **1.3 Deploy `backend-core` API Service**:
  - Deploy Express Node.js API server to Render / Vercel Serverless.
  - Configure `DATABASE_URL` (Supabase transaction pooler) and `DIRECT_URL`.
- [ ] **1.4 Deploy `frontend` Next.js App**:
  - Deploy Next.js 14 App Router application to Vercel.
  - Configure production `NEXT_PUBLIC_CORE_API_URL` and `NEXT_PUBLIC_AI_API_URL`.

---

## ⚡ Phase 2: Asynchronous Background Ingestion Queue (Redis + BullMQ)

- [ ] **2.1 Configure Redis Task Queue**:
  - Set up Redis instance (Upstash / Redis Cloud) for background job processing.
- [ ] **2.2 Asynchronous Document Ingestion Worker**:
  - Implement BullMQ (Node) / Celery (Python) queue workers to parse large 100+ page papers asynchronously without blocking web requests.
  - Broadcast ingestion progress events (`PARSING`, `CHUNKING`, `EMBEDDING`, `INDEXED`) via WebSockets or SSE to the frontend progress bar.

---

## 📜 Phase 3: Real PDF Canvas Rendering (`react-pdf` / `pdfjs-dist`)

- [ ] **3.1 High-Performance Canvas Viewer**:
  - Integrate `react-pdf` canvas rendering in `frontend/src/components/pdf-viewer.tsx` to display uploaded user PDF files natively.
- [ ] **3.2 Precision Bounding-Box Overlay Layer**:
  - Convert percentage coordinates `(norm_x0, norm_y0, norm_w, norm_h)` into exact pixel positions relative to the canvas scale:
    $$\text{pixel\_x} = \text{norm\_x0} \times \text{canvas\_width}$$
    $$\text{pixel\_y} = \text{norm\_y0} \times \text{canvas\_height}$$
  - Render interactive SVG highlight overlays on mouse hover or citation click.

---

## 🔬 Phase 4: Advanced Academic Synthesis & Sandboxing

- [ ] **4.1 Overleaf / LaTeX Export**:
  - Add export button to download synthesized Literature Reviews directly as standard `.tex` source code formatted for IEEE / ACM paper templates.
- [ ] **4.2 Code Sandbox Runner**:
  - Integrate lightweight Python execution sandbox (Piston API / Docker container) to test code snippets extracted by the Pseudocode Extractor.
- [ ] **4.3 OpenAlex API Integration**:
  - Expand citation graphs to query OpenAlex for institutional author networks and co-authorship graphs.

---

## 📈 Phase 5: RAG Pipeline Benchmarking & Evaluation

- [ ] **5.1 RAGAS / TruLens Evaluation**:
  - Benchmark RAG pipeline accuracy using standard metrics: *Faithfulness*, *Answer Relevance*, *Context Precision*, and *Context Recall*.
- [ ] **5.2 OCR Fallback for Scanned Papers**:
  - Integrate Tesseract OCR / Marker in `backend-ai` for non-digitized scanned PDF documents.

---

## 🎓 Phase 6: B.Tech Major Project Capstone Deliverables (2025–2026)

- [ ] **6.1 Project Thesis Documentation**:
  - Finalize B.Tech Major Project thesis report for **Vardhaman College of Engineering, Hyderabad — B.Tech CSE (2025–26)**.
- [ ] **6.2 Live Presentation Slides & Demo Video**:
  - Create capstone presentation slides detailing system architecture, RRF mathematical formulas, and live platform demo video.
