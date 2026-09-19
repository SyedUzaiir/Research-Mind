# ResearchMind — RAG Pipeline & Citation Specification

## 1. Document Ingestion & Layout Parsing

### Relative Coordinate Normalization
To prevent scaling mismatches across client screen resolutions, zoom levels, or viewport aspect ratios, `backend-ai` normalizes all PyMuPDF (`fitz`) bounding box coordinates relative to the page dimensions:

$$\text{norm\_x0} = \frac{x_0}{\text{page\_width}}, \quad \text{norm\_y0} = \frac{y_0}{\text{page\_height}}$$
$$\text{norm\_w} = \frac{x_1 - x_0}{\text{page\_width}}, \quad \text{norm\_h} = \frac{y_1 - y_0}{\text{page\_height}}$$

The bounding box structure stored in `PaperChunk.boundingBox` is:
```json
{
  "page": 1,
  "x0": 0.12,
  "y0": 0.35,
  "w": 0.76,
  "h": 0.08,
  "text": "Extracted paragraph heading or text block..."
}
```

## 2. PostgreSQL Hybrid Search & Reciprocal Rank Fusion (RRF)

### Dense + Sparse Retrieval Architecture
Retrieval combines dense semantic similarity with sparse keyword matching:
1. **Dense Vector Search**: PostgreSQL `pgvector` Cosine distance operator (`<=>`).
2. **Sparse Full-Text Search**: PostgreSQL `tsvector` / `tsquery` matching specific terminology, author names, dataset references, and mathematical formulas.

### Reciprocal Rank Fusion (RRF) Formula
Results from dense and sparse search streams are fused using Reciprocal Rank Fusion (RRF):

$$RRF\_Score(d) = \sum_{m \in M} \frac{1}{k + r_m(d)}$$

Where:
- $M$ is the set of retrieval channels (Dense Vector and Sparse TSVector).
- $r_m(d)$ is the rank position of document/chunk $d$ in retrieval stream $m$.
- $k$ is a smoothing constant (typically $k = 60$).

### Cross-Encoder Reranking
- Top $N$ candidates resulting from RRF fusion pass through `FlashRank` / Cross-Encoder reranker.
- Top 5 reranked chunks form the context payload for LLM RAG generation.

## 3. Grounded Citation & PDF Canvas Highlighting
- RAG response returns text answer with citation metadata:
  ```json
  {
    "answer": "The transformer architecture relies on multi-head attention...",
    "citations": [
      {
        "chunkId": "uuid-1234",
        "paperId": "paper-uuid",
        "pageNumber": 3,
        "boundingBox": { "x0": 0.15, "y0": 0.22, "w": 0.70, "h": 0.10 },
        "snippet": "Multi-head attention allows the model to jointly attend..."
      }
    ]
  }
  ```
- Client `pdfjs-dist` converts relative percentages back to canvas pixels:
  $$\text{pixel\_x} = \text{norm\_x0} \times \text{canvas\_width}$$
  $$\text{pixel\_y} = \text{norm\_y0} \times \text{canvas\_height}$$
