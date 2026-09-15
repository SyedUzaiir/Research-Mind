import os
import json
import logging
import numpy as np
from typing import List, Dict, Any, Optional

logger = logging.getLogger("vector_store")

class VectorStoreService:
    """
    Manages vector embeddings and PostgreSQL Hybrid Search (pgvector + tsvector)
    with Reciprocal Rank Fusion (RRF).
    """

    def __init__(self, model_name: str = "sentence-transformers/all-mpnet-base-v2"):
        self.dimension = 768
        self.model = None

        try:
            from sentence_transformers import SentenceTransformer
            logger.info(f"Loading embedding model: {model_name}")
            self.model = SentenceTransformer(model_name)
            self.dimension = self.model.get_sentence_embedding_dimension()
        except ImportError:
            logger.warning("sentence_transformers package not found. Using lightweight fallback embedding generator.")
        except Exception as e:
            logger.warning(f"Could not load SentenceTransformer ({e}). Using lightweight fallback embedding generator.")

    def generate_embedding(self, text: str) -> List[float]:
        """Generates embedding vector for text."""
        if self.model:
            vector = self.model.encode(text, convert_to_numpy=True)
            return vector.tolist()
        else:
            # Deterministic pseudo-embedding for dev testing without heavy download
            np.random.seed(abs(hash(text)) % (2**32))
            vec = np.random.uniform(-1, 1, self.dimension)
            vec = vec / np.linalg.norm(vec)
            return vec.tolist()

    @staticmethod
    def reciprocal_rank_fusion(dense_results: List[Dict[str, Any]], sparse_results: List[Dict[str, Any]], k: int = 60) -> List[Dict[str, Any]]:
        """
        Combines Dense Vector Search and Sparse Full-Text Search results using RRF:
        RRF_Score(d) = sum(1 / (k + rank_m(d)))
        """
        rrf_scores: Dict[str, float] = {}
        chunk_map: Dict[str, Dict[str, Any]] = {}

        # Process Dense Ranks
        for rank, item in enumerate(dense_results):
            chunk_id = item["id"]
            chunk_map[chunk_id] = item
            rrf_scores[chunk_id] = rrf_scores.get(chunk_id, 0.0) + (1.0 / (k + (rank + 1)))

        # Process Sparse Ranks
        for rank, item in enumerate(sparse_results):
            chunk_id = item["id"]
            chunk_map[chunk_id] = item
            rrf_scores[chunk_id] = rrf_scores.get(chunk_id, 0.0) + (1.0 / (k + (rank + 1)))

        # Sort combined results by RRF score descending
        sorted_chunk_ids = sorted(rrf_scores.keys(), key=lambda cid: rrf_scores[cid], reverse=True)

        combined_results = []
        for cid in sorted_chunk_ids:
            chunk = chunk_map[cid]
            chunk["rrfScore"] = rrf_scores[cid]
            combined_results.append(chunk)

        return combined_results
