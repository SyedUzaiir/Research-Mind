from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import logging
from dotenv import load_dotenv

from app.routers import rag

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("main")

app = FastAPI(
    title="ResearchMind AI Engine",
    description="FastAPI AI microservice providing PDF Parsing, Relative Bounding Box Chunking, Hybrid RAG with RRF, Reranking, and Literature Review Synthesis.",
    version="1.0.0"
)

# Enable CORS for Next.js frontend and Express backend-core
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rag.router)

@app.get("/")
def read_root():
    return {
        "service": "ResearchMind AI Engine",
        "status": "online",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
