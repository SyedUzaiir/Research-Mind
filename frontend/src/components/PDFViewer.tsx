'use client';

import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Bookmark } from 'lucide-react';
import { BoundingBox } from '@/types';

interface PDFViewerProps {
  paperTitle: string;
  fileUrl: string;
  activeCitationBox?: BoundingBox | null;
  activePageNumber?: number;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({
  paperTitle,
  activeCitationBox,
  activePageNumber = 1,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(activePageNumber);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (activePageNumber) {
      setCurrentPage(activePageNumber);
    }
  }, [activePageNumber]);

  return (
    <div className="flex flex-col h-full bg-[#0d121d] border-r border-dark-border select-none">
      {/* Top Controls Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 glass-panel border-b border-dark-border">
        <div className="flex items-center space-x-2 truncate max-w-md">
          <Bookmark className="w-5 h-5 text-brand-500 shrink-0" />
          <h2 className="text-sm font-semibold text-gray-200 truncate">{paperTitle}</h2>
        </div>

        {/* Page & Zoom Controls */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-dark-card rounded-lg border border-dark-border px-2 py-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="p-1 hover:bg-dark-hover rounded text-gray-400 hover:text-white"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono px-3 text-gray-300">
              Page <strong className="text-white">{currentPage}</strong> of 12
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(12, p + 1))}
              className="p-1 hover:bg-dark-hover rounded text-gray-400 hover:text-white"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center bg-dark-card rounded-lg border border-dark-border px-2 py-1 space-x-1">
            <button
              onClick={() => setZoomLevel(z => Math.max(50, z - 10))}
              className="p-1 hover:bg-dark-hover rounded text-gray-400 hover:text-white"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono px-2 text-gray-300">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(z => Math.min(200, z + 10))}
              className="p-1 hover:bg-dark-hover rounded text-gray-400 hover:text-white"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main PDF Page Viewer Area */}
      <div className="flex-1 overflow-auto p-6 flex justify-center items-start bg-[#080b11]">
        <div
          ref={canvasContainerRef}
          className="relative bg-white text-gray-900 rounded-sm shadow-2xl transition-transform duration-200"
          style={{
            width: `${620 * (zoomLevel / 100)}px`,
            minHeight: `${840 * (zoomLevel / 100)}px`,
          }}
        >
          {/* Simulated Academic Paper Page View */}
          <div className="p-8 text-xs font-serif leading-relaxed text-gray-900 space-y-4">
            <div className="text-center pb-4 border-b border-gray-200">
              <h1 className="text-base font-bold text-gray-900 mb-1">{paperTitle}</h1>
              <p className="text-[10px] text-gray-600 italic">
                Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit — Google Brain & Research
              </p>
              <p className="text-[9px] text-brand-700 font-sans mt-1">Page {currentPage}</p>
            </div>

            {currentPage === 1 && (
              <div className="bg-blue-50/60 p-3 rounded border-l-2 border-brand-500 font-sans text-[11px] text-gray-800">
                <strong className="block text-brand-900 font-bold mb-1">Abstract</strong>
                The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-[10.5px] text-justify leading-normal font-serif">
              <div>
                <h3 className="font-sans font-bold text-[11px] text-gray-900 mb-1 uppercase tracking-wider">1. Introduction</h3>
                <p className="mb-2">
                  Recurrent neural networks, particularly long short-term memory (LSTM) and gated recurrent (GRU) neural networks, have been firmly established as state of the art approaches in sequence modeling and transduction problems such as language modeling and machine translation.
                </p>
                <p>
                  Recurrent models typically factor computation along the symbol positions of the input and output sequences. Aligning the positions to steps in computation time, they generate a sequence of hidden states h_t, as a function of the previous hidden state h_t-1 and the input for position t.
                </p>
              </div>

              <div>
                <h3 className="font-sans font-bold text-[11px] text-gray-900 mb-1 uppercase tracking-wider">2. Model Architecture</h3>
                <p className="mb-2">
                  Most competitive neural sequence transduction models have an encoder-decoder structure. Here, the encoder maps an input sequence of symbol representations (x_1, ..., x_n) to a sequence of continuous representations z = (z_1, ..., z_n).
                </p>
                <p>
                  Given z, the decoder then generates an output sequence (y_1, ..., y_m) of symbols one element at a time. At each step the model is auto-regressive, consuming the previously generated symbols as additional input when generating the next.
                </p>
              </div>
            </div>

            {currentPage === 3 && (
              <div className="p-3 bg-amber-50 rounded border border-amber-200 text-[10.5px]">
                <strong className="block text-amber-900 font-bold mb-1">3.2 Multi-Head Attention</strong>
                Multi-head attention allows the model to jointly attend to information from different representation subspaces at different positions. With a single attention head, averaging inhibits this.
              </div>
            )}
          </div>

          {/* Dynamic Grounded Bounding Box Highlight Overlay */}
          {activeCitationBox && activeCitationBox.page === currentPage && (
            <div
              className="pdf-highlight-box animate-pulse"
              style={{
                left: `${activeCitationBox.x0 * 100}%`,
                top: `${activeCitationBox.y0 * 100}%`,
                width: `${activeCitationBox.w * 100}%`,
                height: `${activeCitationBox.h * 100}%`,
              }}
              title={activeCitationBox.text || 'Grounded RAG Source Highlight'}
            >
              <span className="absolute -top-5 left-0 bg-yellow-500 text-gray-900 text-[9px] font-bold font-sans px-1.5 py-0.5 rounded shadow">
                Source Citation Bounding Box
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
