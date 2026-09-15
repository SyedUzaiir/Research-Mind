from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class BoundingBox(BaseModel):
    page: int
    x0: float = Field(..., description="Normalized relative x coordinate (0.0 - 1.0)")
    y0: float = Field(..., description="Normalized relative y coordinate (0.0 - 1.0)")
    w: float = Field(..., description="Normalized relative width (0.0 - 1.0)")
    h: float = Field(..., description="Normalized relative height (0.0 - 1.0)")
    text: Optional[str] = ""

class PaperIngestRequest(BaseModel):
    paperId: str
    filePath: str
    title: str
    authors: Optional[List[str]] = []
    year: Optional[int] = None

class PaperIngestResponse(BaseModel):
    paperId: str
    totalChunks: int
    status: str
    message: str

class ChatMessage(BaseModel):
    role: str # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    paperId: Optional[str] = None
    workspaceId: str
    question: str
    history: Optional[List[ChatMessage]] = []

class Citation(BaseModel):
    chunkId: str
    paperId: str
    pageNumber: int
    boundingBox: Dict[str, Any]
    snippet: str

class ChatResponse(BaseModel):
    answer: str
    citations: List[Citation]

class ComparePapersRequest(BaseModel):
    paperIds: List[str]

class ComparisonRow(BaseModel):
    paperId: str
    title: str
    dataset: str
    algorithm: str
    metrics: str
    limitations: str

class ComparePapersResponse(BaseModel):
    rows: List[ComparisonRow]

class LitReviewRequest(BaseModel):
    paperIds: List[str]
    workspaceId: str

class LitReviewResponse(BaseModel):
    title: str
    matrixData: Dict[str, Any]
    reviewText: str

class Flashcard(BaseModel):
    question: str
    answer: str
    difficulty: str = "MEDIUM"

class FlashcardsResponse(BaseModel):
    paperId: str
    flashcards: List[Flashcard]
