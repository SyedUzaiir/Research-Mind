import fitz  # PyMuPDF
import logging
from typing import List, Dict, Any

logger = logging.getLogger("pdf_parser")

class PDFParser:
    """
    Layout-aware PDF Parser using PyMuPDF (fitz).
    Extracts text blocks with normalized relative percentage bounding box coordinates (0.0 to 1.0).
    """

    @staticmethod
    def extract_blocks_with_boxes(file_path: str) -> List[Dict[str, Any]]:
        """
        Parses a PDF file and returns structured blocks per page.
        Each block includes:
        - page: 1-indexed page number
        - text: extracted text content
        - boundingBox: { x0, y0, w, h, text } normalized to [0.0, 1.0]
        """
        doc = fitz.open(file_path)
        extracted_blocks = []

        for page_index in range(len(doc)):
            page = doc[page_index]
            page_num = page_index + 1
            rect = page.rect
            page_width = rect.width
            page_height = rect.height

            # Fallback if page dimensions are non-positive
            if page_width <= 0:
                page_width = 1.0
            if page_height <= 0:
                page_height = 1.0

            # Extract text blocks: (x0, y0, x1, y1, "text", block_no, block_type)
            text_blocks = page.get_text("blocks")

            for b in text_blocks:
                x0, y0, x1, y1, text, block_no, block_type = b
                cleaned_text = text.strip()

                if not cleaned_text or block_type != 0:  # 0 is text block
                    continue

                # Relative normalized coordinates (0.0 - 1.0)
                norm_x0 = max(0.0, min(1.0, round(x0 / page_width, 4)))
                norm_y0 = max(0.0, min(1.0, round(y0 / page_height, 4)))
                norm_w = max(0.0, min(1.0, round((x1 - x0) / page_width, 4)))
                norm_h = max(0.0, min(1.0, round((y1 - y0) / page_height, 4)))

                extracted_blocks.append({
                    "pageNumber": page_num,
                    "text": cleaned_text,
                    "boundingBox": {
                        "page": page_num,
                        "x0": norm_x0,
                        "y0": norm_y0,
                        "w": norm_w,
                        "h": norm_h,
                        "text": cleaned_text[:100]  # snippet
                    }
                })

        doc.close()
        logger.info(f"Successfully extracted {len(extracted_blocks)} text blocks from {file_path}")
        return extracted_blocks
