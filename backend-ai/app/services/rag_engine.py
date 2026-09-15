import os
import logging
from typing import List, Dict, Any, Optional

logger = logging.getLogger("rag_engine")

class RAGEngine:
    """
    RAG Pipeline handling FlashRank Cross-Encoder reranking, LLM answer synthesis,
    and grounded source citation extraction.
    """

    def __init__(self):
        # FlashRank setup
        self.ranker = None
        try:
            from flashrank import Ranker
            self.ranker = Ranker(model_name="ms-marco-MiniLM-L-12-v2")
        except ImportError:
            logger.warning("flashrank package not found. Reranking will fallback to dense score rank.")
        except Exception as e:
            logger.warning(f"FlashRank init warning: {e}. Falling back to default scoring.")

        # LLM Clients setup
        self.gemini_key = os.getenv("GEMINI_API_KEY")
        self.openai_key = os.getenv("OPENAI_API_KEY")
        self.gemini_model = None
        self.openai_client = None

        if self.gemini_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.gemini_key)
                self.gemini_model = genai.GenerativeModel("gemini-1.5-flash")
            except Exception as e:
                logger.warning(f"Gemini init warning: {e}")

        if self.openai_key:
            try:
                from openai import OpenAI
                self.openai_client = OpenAI(api_key=self.openai_key)
            except Exception as e:
                logger.warning(f"OpenAI init warning: {e}")

    def rerank_chunks(self, query: str, chunks: List[Dict[str, Any]], top_n: int = 5) -> List[Dict[str, Any]]:
        """Reranks candidate chunks using FlashRank cross-encoder."""
        if not chunks:
            return []

        if not self.ranker:
            return chunks[:top_n]

        try:
            from flashrank import RerankRequest
            passages = [
                {"id": c.get("id", str(idx)), "text": c["text"], "meta": c}
                for idx, c in enumerate(chunks)
            ]

            rerank_req = RerankRequest(query=query, passages=passages)
            results = self.ranker.rerank(rerank_req)

            reranked_chunks = []
            for res in results[:top_n]:
                chunk_data = res["meta"]
                chunk_data["rerankScore"] = res["score"]
                reranked_chunks.append(chunk_data)

            return reranked_chunks
        except Exception as e:
            logger.warning(f"Reranking error: {e}. Falling back to top_n chunks.")
            return chunks[:top_n]

    def generate_grounded_answer(
        self, query: str, context_chunks: List[Dict[str, Any]], history: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        """
        Generates an LLM response grounded strictly in context_chunks.
        Attaches exact page numbers and normalized bounding boxes as citations.
        """
        if not context_chunks:
            return {
                "answer": "I could not find relevant content in the uploaded document(s) to answer your question.",
                "citations": []
            }

        # Build context prompt
        context_str = ""
        citations = []

        for idx, chunk in enumerate(context_chunks):
            chunk_id = chunk.get("id", f"chunk_{idx}")
            paper_id = chunk.get("paperId", "unknown")
            page_num = chunk.get("pageNumber", 1)
            box = chunk.get("boundingBox", {})

            context_str += f"\n--- DOCUMENT SOURCE [{idx+1}] (Page {page_num}) ---\n{chunk['text']}\n"

            citations.append({
                "chunkId": chunk_id,
                "paperId": paper_id,
                "pageNumber": page_num,
                "boundingBox": box,
                "snippet": chunk["text"][:150] + "..."
            })

        system_instruction = (
            "You are ResearchMind AI, an expert academic research assistant. "
            "Answer the user's question accurately using ONLY the provided document sources below. "
            "Be clear, rigorous, and reference specific sections or pages when appropriate.\n\n"
            f"PROVIDED SOURCES:\n{context_str}"
        )

        prompt = f"User Question: {query}"

        # 1. Try Gemini API
        if self.gemini_model:
            try:
                response = self.gemini_model.generate_content(
                    f"{system_instruction}\n\n{prompt}"
                )
                return {
                    "answer": response.text.strip(),
                    "citations": citations
                }
            except Exception as e:
                logger.error(f"Gemini API error: {e}")

        # 2. Try OpenAI API
        if self.openai_client:
            try:
                response = self.openai_client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[
                        {"role": "system", "content": system_instruction},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.2
                )
                return {
                    "answer": response.choices[0].message.content.strip(),
                    "citations": citations
                }
            except Exception as e:
                logger.error(f"OpenAI API error: {e}")

        # 3. Fallback when no API keys are active
        fallback_answer = (
            f"Based on Document Page {citations[0]['pageNumber']}:\n"
            f"\"{context_chunks[0]['text'][:300]}...\"\n\n"
            "(Note: Add GEMINI_API_KEY or OPENAI_API_KEY to .env for full LLM synthesis capabilities)."
        )

        return {
            "answer": fallback_answer,
            "citations": citations
        }

    def generate_summary(self, chunks: List[Dict[str, Any]], length: str = "medium") -> str:
        """Generates an executive summary of paper text chunks using Gemini or OpenAI."""
        if not chunks:
            return "No document text available to generate a summary."

        combined_text = "\n\n".join([c["text"] for c in chunks[:10]])
        length_instruction = {
            "short": "Provide a concise 5-line executive summary of this research paper.",
            "medium": "Provide a comprehensive 1-page structured summary covering background, key methods, results, and conclusions.",
            "detailed": "Provide an in-depth detailed technical summary covering motivation, system architecture, experimental setup, quantitative results, and limitations."
        }.get(length, "Provide a structured summary of this paper.")

        prompt = f"{length_instruction}\n\nPAPER CONTENT:\n{combined_text[:6000]}"

        if self.gemini_model:
            try:
                response = self.gemini_model.generate_content(prompt)
                return response.text.strip()
            except Exception as e:
                logger.error(f"Gemini summary generation error: {e}")

        if self.openai_client:
            try:
                response = self.openai_client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.3
                )
                return response.choices[0].message.content.strip()
            except Exception as e:
                logger.error(f"OpenAI summary generation error: {e}")

        # Intelligent extractive summary fallback
        first_chunk = chunks[0]["text"] if chunks else ""
        return f"### Executive Summary ({length.capitalize()} Mode)\n\n{first_chunk[:500]}...\n\n*(Connect GEMINI_API_KEY for dynamic abstract synthesis)*"

