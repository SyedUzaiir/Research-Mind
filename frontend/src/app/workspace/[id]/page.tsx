'use client';

import React, { useState } from 'react';
import { PDFViewer } from '@/components/PDFViewer';
import { ChatPanel } from '@/components/ChatPanel';
import { MatrixComparison } from '@/components/MatrixComparison';
import { CitationGraph } from '@/components/CitationGraph';
import { FlashcardQuiz } from '@/components/FlashcardQuiz';
import { CodeExtractor } from '@/components/CodeExtractor';

import {
  FileText,
  Sparkles,
  Layers,
  Network,
  HelpCircle,
  Code,
  ArrowLeft,
  Share2,
  Brain
} from 'lucide-react';
import { BoundingBox } from '@/types';
import Link from 'next/link';

export default function WorkspacePage({ params }: { params: { id: string } }) {
  const workspaceId = params.id || 'ws-default-1';

  // Active view tab state
  const [activeTab, setActiveTab] = useState<
    'reader' | 'matrix' | 'graph' | 'flashcards' | 'code'
  >('reader');

  // Interactive PDF Highlight state
  const [activeHighlightBox, setActiveHighlightBox] = useState<BoundingBox | null>(null);
  const [activePageNumber, setActivePageNumber] = useState<number>(1);

  const handleSelectCitation = (box: BoundingBox, pageNumber: number) => {
    setActiveHighlightBox(box);
    setActivePageNumber(pageNumber);
    setActiveTab('reader'); // Switch back to reader view to display highlight canvas
  };

  return (
    <div className="flex flex-col h-screen bg-[#0b0f17] text-gray-100 overflow-hidden font-sans">
      {/* Top Workspace Header Bar */}
      <header className="h-14 glass-panel border-b border-dark-border px-6 flex items-center justify-between z-20">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="p-1.5 hover:bg-dark-hover rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-brand-500" />
            <span className="text-sm font-bold tracking-tight text-white">ResearchMind AI</span>
            <span className="text-xs text-gray-400 font-mono">/ Workspace</span>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <div className="flex items-center bg-dark-card border border-dark-border p-1 rounded-xl space-x-1 text-xs">
          <button
            onClick={() => setActiveTab('reader')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'reader'
                ? 'bg-brand-600 text-white font-medium shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Split-Screen PDF RAG</span>
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'matrix'
                ? 'bg-brand-600 text-white font-medium shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Comparison Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('graph')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'graph'
                ? 'bg-brand-600 text-white font-medium shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Citation Graph</span>
          </button>

          <button
            onClick={() => setActiveTab('flashcards')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'flashcards'
                ? 'bg-brand-600 text-white font-medium shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Flashcards</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'code'
                ? 'bg-brand-600 text-white font-medium shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Code Extractor</span>
          </button>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center space-x-3 text-xs">
          <button className="flex items-center space-x-1.5 px-3 py-1.5 bg-dark-card hover:bg-dark-hover border border-dark-border text-gray-300 rounded-lg transition-colors">
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Workspace</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Body Content */}
      <main className="flex-1 overflow-hidden relative">
        {activeTab === 'reader' && (
          <div className="grid grid-cols-12 h-full">
            {/* Left 60%: Interactive PDF Viewer Canvas */}
            <div className="col-span-7 h-full overflow-hidden border-r border-dark-border">
              <PDFViewer
                paperTitle="Attention Is All You Need (Vaswani et al. 2017)"
                fileUrl="/sample-transformer.pdf"
                activeCitationBox={activeHighlightBox}
                activePageNumber={activePageNumber}
              />
            </div>

            {/* Right 40%: Grounded RAG Chat Panel */}
            <div className="col-span-5 h-full overflow-hidden">
              <ChatPanel
                paperId="paper-demo-1"
                workspaceId={workspaceId}
                onSelectCitation={handleSelectCitation}
              />
            </div>
          </div>
        )}

        {activeTab === 'matrix' && (
          <MatrixComparison paperIds={['paper-demo-1', 'paper-demo-2']} />
        )}

        {activeTab === 'graph' && <CitationGraph />}

        {activeTab === 'flashcards' && <FlashcardQuiz paperId="paper-demo-1" />}

        {activeTab === 'code' && <CodeExtractor />}
      </main>
    </div>
  );
}
