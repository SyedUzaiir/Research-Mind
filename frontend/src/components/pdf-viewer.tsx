'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Bookmark, Loader2 } from 'lucide-react';
import { BoundingBox } from '@/types';

interface PDFViewerProps {
  paperTitle: string;
  fileUrl?: string;
  activeCitationBox?: BoundingBox | null;
  activePageNumber?: number;
}

export const PdfViewer: React.FC<PDFViewerProps> = ({
  paperTitle,
  fileUrl,
  activeCitationBox,
  activePageNumber = 1,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(activePageNumber);
  const [totalPages, setTotalPages] = useState<number>(5);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [loading, setLoading] = useState<boolean>(false);
  const [pdfDoc, setPdfDoc] = useState<any>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync activePageNumber when parent triggers citation jump
  useEffect(() => {
    if (activePageNumber && activePageNumber !== currentPage) {
      setCurrentPage(activePageNumber);
    }
  }, [activePageNumber]);

  // Load PDF document using PDF.js if fileUrl exists
  useEffect(() => {
    let isMounted = true;
    if (!fileUrl) return;

    const loadPdf = async () => {
      try {
        setLoading(true);
        const pdfjsLib = await import('pdfjs-dist');
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

        const normalizedUrl = fileUrl.startsWith('/uploads')
          ? `${process.env.NEXT_PUBLIC_CORE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${fileUrl}`
          : fileUrl;

        const loadingTask = pdfjsLib.getDocument(normalizedUrl);
        const doc = await loadingTask.promise;

        if (isMounted) {
          setPdfDoc(doc);
          setTotalPages(doc.numPages);
          setLoading(false);
        }
      } catch (err: any) {
        console.warn('PDF.js loading warning:', err?.message || err);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadPdf();
    return () => {
      isMounted = false;
    };
  }, [fileUrl]);

  // Render canvas page when currentPage, zoomLevel, or pdfDoc changes
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    let isMounted = true;

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(currentPage);
        if (!isMounted || !canvasRef.current) return;

        const viewport = page.getViewport({ scale: zoomLevel / 100 });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (context) {
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };
          await page.render(renderContext).promise;
        }
      } catch (err) {
        console.error('Error rendering page canvas:', err);
      }
    };

    renderPage();
    return () => {
      isMounted = false;
    };
  }, [pdfDoc, currentPage, zoomLevel]);

  return (
    <div className="flex flex-col h-full bg-zinc-100 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 select-none">
      {/* Top Controls Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
        <div className="flex items-center space-x-2 truncate max-w-sm">
          <Bookmark className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <h2 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">{paperTitle}</h2>
        </div>

        {/* Page Navigation & Zoom Controls */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700/60 px-2 py-0.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-30 rounded text-zinc-600 dark:text-zinc-400 transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-2 text-zinc-600 dark:text-zinc-300">
              Page <strong className="text-zinc-900 dark:text-zinc-100">{currentPage}</strong> of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-30 rounded text-zinc-600 dark:text-zinc-400 transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700/60 px-1.5 py-0.5 space-x-1">
            <button
              onClick={() => setZoomLevel(z => Math.max(50, z - 10))}
              className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded text-zinc-600 dark:text-zinc-400"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-1.5 text-zinc-600 dark:text-zinc-300">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(z => Math.min(200, z + 10))}
              className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded text-zinc-600 dark:text-zinc-400"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas Viewer Container */}
      <div className="flex-1 overflow-auto p-6 flex justify-center items-start bg-zinc-200/50 dark:bg-zinc-950">
        <div
          className="relative bg-white text-zinc-900 rounded shadow-md border border-zinc-300 dark:border-zinc-800 overflow-hidden"
          style={{
            width: `${620 * (zoomLevel / 100)}px`,
            minHeight: `${840 * (zoomLevel / 100)}px`,
          }}
        >
          {loading && (
            <div className="absolute inset-0 bg-white/80 dark:bg-zinc-900/80 z-20 flex items-center justify-center space-x-2 text-xs font-mono text-zinc-600 dark:text-zinc-300">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              <span>Rendering PDF page canvas...</span>
            </div>
          )}

          {/* Real PDF Canvas Element */}
          {pdfDoc ? (
            <div className="relative w-full h-full flex justify-center items-center">
              <canvas ref={canvasRef} className="max-w-full h-auto block mx-auto" />
            </div>
          ) : (
            /* Page Content Layout View when loading fallback or fixture */
            <div className="p-8 text-xs font-serif-paper leading-relaxed text-zinc-900 space-y-4">
              <div className="text-center pb-4 border-b border-zinc-200">
                <h1 className="text-base font-bold text-zinc-900 mb-1">{paperTitle}</h1>
                <p className="text-[10px] text-zinc-600 italic">
                  Document Layout View — PyMuPDF Multi-Page Extraction Pipeline
                </p>
                <p className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-2">
                  Page {currentPage} of {totalPages}
                </p>
              </div>

              {/* Dynamic Page Content showing exact page number text */}
              <div className="bg-zinc-50 p-4 rounded border-l-4 border-zinc-900 font-sans text-xs space-y-2">
                <strong className="block text-zinc-900 font-bold">
                  Document Page Content — Page {currentPage}
                </strong>
                <p className="text-zinc-700">
                  ResearchMind Test Page {currentPage}. This layout region contains parsed text blocks extracted by PyMuPDF across page {currentPage} of the uploaded PDF document.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-[11px] text-justify leading-relaxed font-serif-paper pt-2">
                <div className="space-y-2">
                  <h3 className="font-sans font-bold text-xs text-zinc-900 uppercase tracking-wider">
                    Section {currentPage}.1 — Methodology & Analysis
                  </h3>
                  <p>
                    Page {currentPage} presents the technical formulation for deep representation learning. Feature boundaries are extracted with relative normalized percentage bounding boxes.
                  </p>
                  <p>
                    Reciprocal Rank Fusion (RRF k=60) is evaluated on page {currentPage} to guarantee dense vector and sparse lexical retrieval alignment.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-sans font-bold text-xs text-zinc-900 uppercase tracking-wider">
                    Section {currentPage}.2 — Experimental Results
                  </h3>
                  <p>
                    Multi-head self-attention mechanisms on page {currentPage} map queries and key vectors across matching representation subspaces.
                  </p>
                  <p>
                    Cross-encoder reranking with FlashRank refines the candidate set retrieved from page {currentPage} before LLM answer generation.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Citation Grounded Bounding Box Overlay */}
          {activeCitationBox && activeCitationBox.page === currentPage && (
            <div
              className="pdf-highlight-box border-2 border-amber-500 bg-amber-400/30 rounded absolute pointer-events-none transition-all z-10 animate-pulse shadow-lg"
              style={{
                left: `${activeCitationBox.x0 * 100}%`,
                top: `${activeCitationBox.y0 * 100}%`,
                width: `${activeCitationBox.w * 100}%`,
                height: `${activeCitationBox.h * 100}%`,
              }}
              title={activeCitationBox.text || 'Grounded Citation Source Bounding Box'}
            >
              <span className="absolute -top-6 left-0 bg-amber-500 text-white text-[9px] font-bold font-sans px-2 py-0.5 rounded shadow">
                Cited Source (Page {currentPage})
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
