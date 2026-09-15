import os
import httpx
import logging
from typing import Dict, Any, List, Optional

logger = logging.getLogger("semantic_scholar")

class SemanticScholarService:
    """
    Fetches paper metadata, citations, and reference trees from the Semantic Scholar API.
    """

    BASE_URL = "https://api.semanticscholar.org/graph/v1"

    def __init__(self):
        self.api_key = os.getenv("SEMANTIC_SCHOLAR_API_KEY")
        self.headers = {}
        if self.api_key and self.api_key != "your_semantic_scholar_api_key_here":
            self.headers["x-api-key"] = self.api_key
            logger.info("Semantic Scholar API Key loaded successfully.")
        else:
            logger.info("Running Semantic Scholar queries under public unauthenticated rate limits.")

    async def get_paper_citations(self, paper_id: str) -> Dict[str, Any]:
        """Fetches paper details, forward citations, and backward references."""
        url = f"{self.BASE_URL}/paper/{paper_id}"
        params = {
            "fields": "title,authors,year,abstract,citationCount,referenceCount,citations.title,citations.year,references.title,references.year"
        }

        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(url, headers=self.headers, params=params, timeout=10.0)
                if response.status_code == 200:
                    return response.json()
                else:
                    logger.warning(f"Semantic Scholar API returned status {response.status_code}")
                    return {}
            except Exception as e:
                logger.error(f"Error querying Semantic Scholar API: {e}")
                return {}
