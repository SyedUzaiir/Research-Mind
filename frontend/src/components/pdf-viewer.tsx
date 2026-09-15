'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Bookmark, FileText } from 'lucide-react';
import { BoundingBox } from '@/types';

interface PDFViewerProps {
  paperTitle: string;
  activeCitationBox?: BoundingBox | null;
  activePageNumber?: number;
}

export const PdfViewer: React.FC<PDFViewerProps> = ({
  paperTitle,
  activeCitationBox,
  activePageNumber = 1,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(activePageNumber);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  React.useEffect(() => {
    if (activePageNumber) {
      setCurrentPage(activePageNumber);
    }
  }, [activePageNumber]);

  return (
    <div className="flex flex-col h-full bg-zinc-100 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 select-none">
      {/* Top Controls Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shrink-0">
        <div className="flex items-center space-x-2 truncate max-w-sm">
          <Bookmark className="w-4 h-4 text-zinc-500 shrink-0" />
          <h2 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">{paperTitle}</h2>
        </div>

        {/* Page & Zoom Controls */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700/60 px-2 py-0.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded text-zinc-600 dark:text-zinc-400"
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-2 text-zinc-600 dark:text-zinc-300">
              Page <strong className="text-zinc-900 dark:text-zinc-100">{currentPage}</strong> of 12
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(12, p + 1))}
              className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded text-zinc-600 dark:text-zinc-400"
              title="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700/60 px-1.5 py-0.5 space-x-1">
            <button
              onClick={() => setZoomLevel(z => Math.max(50, z - 10))}
              className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded text-zinc-600 dark:text-zinc-400"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-1.5 text-zinc-600 dark:text-zinc-300">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(z => Math.min(200, z + 10))}
              className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded text-zinc-600 dark:text-zinc-400"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main PDF Page Viewer Area */}
      <div className="flex-1 overflow-auto p-6 flex justify-center items-start bg-zinc-200/50 dark:bg-zinc-950">
        <div
          className="relative bg-white text-zinc-900 rounded shadow-md transition-transform duration-200 border border-zinc-300 dark:border-zinc-800"
          style={{
            width: `${600 * (zoomLevel / 100)}px`,
            minHeight: `${820 * (zoomLevel / 100)}px`,
          }}
        >
          {/* Simulated Authentic Paper Typography Page View */}
          <div className="p-8 text-xs font-serif-paper leading-relaxed text-zinc-900 space-y-4">
            <div className="text-center pb-4 border-b border-zinc-200">
              <h1 className="text-base font-bold text-zinc-900 mb-1">{paperTitle}</h1>
              <p className="text-[10px] text-zinc-600 italic">
                Research Paper Document — Ingested via ResearchMind PyMuPDF Parser
              </p>
              <p className="text-[9px] text-zinc-500 font-sans mt-1">Page {currentPage}</p>
            </div>

            {currentPage === 1 && (
              <div className="bg-zinc-50 p-3.5 rounded border-l-2 border-zinc-900 font-sans text-[11px] text-zinc-800 leading-normal">
                <strong className="block text-zinc-900 font-bold mb-1">Abstract</strong>
                Layout-aware text extracted from <strong>{paperTitle}</strong>. PyMuPDF normalizes all paragraph boundaries into percentage-based relative coordinates for instant canvas highlight mapping.
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-[10.5px] text-justify leading-normal font-serif-paper">
              <div>
                <h3 className="font-sans font-bold text-[11px] text-zinc-900 mb-1 uppercase tracking-wider">1. Introduction</h3>
                <p className="mb-2">
                  Modern deep learning architectures demand high representation capacity and efficient parameterization. This research investigates structural trade-offs in neural modeling.
                </p>
                <p>
                  Recurrent models factor computation along symbol positions, whereas global attention mechanisms allow parallel sequence evaluation.
                </p>
              </div>

              <div>
                <h3 className="font-sans font-bold text-[11px] text-zinc-900 mb-1 uppercase tracking-wider">2. Methodology</h3>
                <p className="mb-2">
                  Our proposed pipeline formulates vector representations using dense embeddings paired with sparse lexical full-text retrieval streams.
                </p>
                <p>
                  Candidate rankings are fused using Reciprocal Rank Fusion (RRF) and cross-encoder reranking to ensure grounded accuracy.
                </p>
              </div>
            </div>

            {currentPage === 3 && (
              <div className="p-3 bg-amber-50 rounded border border-amber-200 text-[10.5px]">
                <strong className="block text-amber-900 font-bold mb-1">3. Experimental Evaluation</strong>
                Multi-head attention projections allow the model to jointly attend to representations across different subspace dimensions.
              </div>
            )}
          </div>

          {/* Bounding Box Canvas Overlay Layer */}
          {activeCitationBox && activeCitationBox.page === currentPage && (
            <div
              className="pdf-highlight-box animate-pulse"
              style={{
                left: `${activeCitationBox.x0 * 100}%`,
                top: `${activeCitationBox.y0 * 100}%`,
                width: `${activeCitationBox.w * 100}%`,
                height: `${activeCitationBox.h * 100}%`,
              }}
              title={activeCitationBox.text || 'Grounded Citation Source Bounding Box'}
            >
              <span className="absolute -top-5 left-0 bg-yellow-500 text-zinc-900 text-[9px] font-bold font-sans px-1.5 py-0.5 rounded shadow-sm">
                Cited Source Bounding Box
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
