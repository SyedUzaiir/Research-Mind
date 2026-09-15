import logging
from typing import List, Dict, Any

logger = logging.getLogger("chunker")

class SemanticChunker:
    """
    Groups extracted text blocks into semantic chunks with overlapping boundaries,
    preserving page numbers and merged relative bounding box coordinates.
    """

    def __init__(self, target_chunk_size: int = 1500, min_overlap: int = 200):
        self.target_chunk_size = target_chunk_size
        self.min_overlap = min_overlap

    def create_chunks(self, extracted_blocks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Takes raw layout blocks and produces merged chunks with normalized bounding boxes.
        """
        if not extracted_blocks:
            return []

        chunks = []
        current_text = ""
        current_page = extracted_blocks[0]["pageNumber"]
        current_boxes = []

        chunk_idx = 0

        for block in extracted_blocks:
            text = block["text"]
            page = block["pageNumber"]
            box = block["boundingBox"]

            # If page changes or chunk size exceeded, flush current chunk
            if (len(current_text) + len(text) > self.target_chunk_size and current_text) or (page != current_page and current_text):
                # Compute merged bounding box for flushed chunk
                merged_box = self._merge_bounding_boxes(current_boxes, current_page)
                chunks.append({
                    "chunkIndex": chunk_idx,
                    "text": current_text.strip(),
                    "pageNumber": current_page,
                    "boundingBox": merged_box
                })
                chunk_idx += 1

                # Carry over overlap if same page
                if page == current_page:
                    overlap_text = current_text[-self.min_overlap:] if len(current_text) > self.min_overlap else ""
                    current_text = overlap_text + "\n" + text
                    current_boxes = [box]
                else:
                    current_text = text
                    current_page = page
                    current_boxes = [box]
            else:
                if current_text:
                    current_text += "\n" + text
                else:
                    current_text = text
                    current_page = page
                current_boxes.append(box)

        # Flush final chunk
        if current_text.strip():
            merged_box = self._merge_bounding_boxes(current_boxes, current_page)
            chunks.append({
                "chunkIndex": chunk_idx,
                "text": current_text.strip(),
                "pageNumber": current_page,
                "boundingBox": merged_box
            })

        logger.info(f"Generated {len(chunks)} semantic chunks from layout blocks.")
        return chunks

    def _merge_bounding_boxes(self, boxes: List[Dict[str, Any]], page: int) -> Dict[str, Any]:
        """
        Merges multiple normalized bounding boxes on the same page into a enclosing bounding box.
        """
        if not boxes:
            return {"page": page, "x0": 0.0, "y0": 0.0, "w": 1.0, "h": 0.1, "text": ""}

        min_x0 = min(b["x0"] for b in boxes)
        min_y0 = min(b["y0"] for b in boxes)
        max_x1 = max(b["x0"] + b["w"] for b in boxes)
        max_y1 = max(b["y0"] + b["h"] for b in boxes)

        return {
            "page": page,
            "x0": round(min_x0, 4),
            "y0": round(min_y0, 4),
            "w": round(max(0.01, max_x1 - min_x0), 4),
            "h": round(max(0.01, max_y1 - min_y0), 4),
            "text": boxes[0].get("text", "")[:100]
        }
