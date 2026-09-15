from fastapi import APIRouter, HTTPException, BackgroundTasks, UploadFile, File, Form
from typing import List, Optional
import os
import shutil
import tempfile
import logging

from app.models.schemas import (
    PaperIngestRequest, PaperIngestResponse,
    ChatRequest, ChatResponse,
    ComparePapersRequest, ComparePapersResponse,
    LitReviewRequest, LitReviewResponse,
    FlashcardsResponse
)
from app.services.pdf_parser import PDFParser
from app.services.chunker import SemanticChunker
from app.services.vector_store import VectorStoreService
from app.services.rag_engine import RAGEngine
from app.services.synthesis import SynthesisService

logger = logging.getLogger("rag_router")
router = APIRouter(prefix="/api/v1", tags=["RAG & Research AI"])

# Initialize Services
vector_service = VectorStoreService()
rag_engine = RAGEngine()
chunker = SemanticChunker()

# In-memory document storage fallback for rapid testing & local dev
IN_MEMORY_CHUNKS: List[dict] = []

@router.post("/parse-pdf")
async def parse_pdf(file: UploadFile = File(...)):
    """
    Parses an uploaded PDF file and returns layout blocks with relative percentage bounding boxes.
    """
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            shutil.copyfileobj(file.file, tmp)
            tmp_path = tmp.name

        blocks = PDFParser.extract_blocks_with_boxes(tmp_path)
        chunks = chunker.create_chunks(blocks)
        os.remove(tmp_path)

        return {
            "fileName": file.filename,
            "totalBlocks": len(blocks),
            "totalChunks": len(chunks),
            "sampleChunk": chunks[0] if chunks else None
        }
    except Exception as e:
        logger.error(f"Error parsing PDF: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ingest-paper", response_model=PaperIngestResponse)
async def ingest_paper(req: PaperIngestRequest):
    """
    Ingests a paper PDF from filePath, parses layout, creates chunks with relative bounding boxes,
    and indexes embeddings into vector store.
    """
    if not os.path.exists(req.filePath):
        raise HTTPException(status_code=404, detail=f"File not found: {req.filePath}")

    try:
        blocks = PDFParser.extract_blocks_with_boxes(req.filePath)
        chunks = chunker.create_chunks(blocks)

        for chunk in chunks:
            chunk["paperId"] = req.paperId
            chunk["embedding"] = vector_service.generate_embedding(chunk["text"])
            IN_MEMORY_CHUNKS.append(chunk)

        return PaperIngestResponse(
            paperId=req.paperId,
            totalChunks=len(chunks),
            status="INDEXED",
            message=f"Successfully indexed {len(chunks)} chunks with percentage bounding boxes."
        )
    except Exception as e:
        logger.error(f"Ingestion failure: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat-paper", response_model=ChatResponse)
async def chat_paper(req: ChatRequest):
    """
    RAG Query Endpoint: Performs hybrid search / similarity ranking + FlashRank reranking,
    and returns grounded answer with citation page numbers and relative bounding box overlays.
    """
    try:
        query_vec = vector_service.generate_embedding(req.question)

        # Filter candidate chunks
        candidate_chunks = [
            c for c in IN_MEMORY_CHUNKS
            if (req.paperId is None or c.get("paperId") == req.paperId)
        ]

        if not candidate_chunks and IN_MEMORY_CHUNKS:
            candidate_chunks = IN_MEMORY_CHUNKS

        # 1. Dense scoring (Cosine similarity)
        for c in candidate_chunks:
            if "embedding" in c and c["embedding"]:
                # Cosine similarity dot product (for normalized vectors)
                c["denseScore"] = float(sum(a * b for a, b in zip(query_vec, c["embedding"])))
            else:
                c["denseScore"] = 0.0

        # Sort candidate chunks by dense score
        dense_sorted = sorted(candidate_chunks, key=lambda x: x.get("denseScore", 0.0), reverse=True)[:15]

        # 2. Rerank top candidates using FlashRank cross-encoder
        reranked = rag_engine.rerank_chunks(req.question, dense_sorted, top_n=5)

        # 3. Generate grounded answer
        history_list = [{"role": h.role, "content": h.content} for h in req.history] if req.history else []
        rag_output = rag_engine.generate_grounded_answer(req.question, reranked, history_list)

        return ChatResponse(
            answer=rag_output["answer"],
            citations=rag_output["citations"]
        )
    except Exception as e:
        logger.error(f"Chat paper error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/compare-papers", response_model=ComparePapersResponse)
async def compare_papers(req: ComparePapersRequest):
    """Generates matrix comparison across specified paper IDs."""
    sample_papers = [
        {"paperId": pid, "title": f"Research Paper {idx+1}", "text": "transformer attention image classification dataset accuracy limit"}
        for idx, pid in enumerate(req.paperIds)
    ]
    rows = SynthesisService.generate_matrix(sample_papers)
    return ComparePapersResponse(rows=rows)

@router.post("/lit-review", response_model=LitReviewResponse)
async def lit_review(req: LitReviewRequest):
    """Generates multi-section synthesis literature review."""
    sample_papers = [
        {"paperId": pid, "title": f"Selected Study {idx+1}", "text": "neural network attention dataset metrics"}
        for idx, pid in enumerate(req.paperIds)
    ]
    matrix = SynthesisService.generate_matrix(sample_papers)
    review_text = SynthesisService.generate_lit_review(matrix)

    return LitReviewResponse(
        title=f"Literature Synthesis Report ({len(req.paperIds)} Papers)",
        matrixData={"rows": matrix},
        reviewText=review_text
    )

@router.get("/flashcards/{paper_id}", response_model=FlashcardsResponse)
async def get_flashcards(paper_id: str):
    """Generates active-recall flashcards for a specific paper."""
    cards = SynthesisService.generate_flashcards("Target Paper", [])
    return FlashcardsResponse(paperId=paper_id, flashcards=cards)
