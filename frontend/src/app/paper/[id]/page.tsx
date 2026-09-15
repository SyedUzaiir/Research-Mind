'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Sparkles,
  Layers,
  Network,
  HelpCircle,
  Code,
  ArrowLeft,
  Share2,
  Download,
  BookOpen
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { PdfViewer } from '@/components/pdf-viewer';
import { RagChat } from '@/components/rag-chat';
import { CodeExtractor } from '@/components/CodeExtractor';
import { FlashcardQuiz } from '@/components/FlashcardQuiz';
import { BoundingBox, Paper } from '@/types';
import { ApiClient } from '@/lib/api';

export default function PaperPage({ params }: { params: { id: string } }) {
  const paperId = params.id || 'paper-demo-1';

  const [paper, setPaper] = useState<Paper>({
    id: paperId,
    workspaceId: 'ws-default-1',
    title: 'Loading Paper Title...',
    authors: ['Research Author'],
    year: 2026,
    fileUrl: '/sample-transformer.pdf',
    status: 'INDEXED',
    createdAt: new Date().toISOString()
  });

  const [activeRightTab, setActiveRightTab] = useState<'chat' | 'summaries' | 'code' | 'flashcards'>('chat');
  const [activeHighlightBox, setActiveHighlightBox] = useState<BoundingBox | null>(null);
  const [activePageNumber, setActivePageNumber] = useState<number>(1);
  const [summaryLength, setSummaryLength] = useState<'short' | 'medium' | 'detailed'>('medium');

  useEffect(() => {
    const fetchPaperDetails = async () => {
      try {
        const allPapers = await ApiClient.getPapers('ws-default-1');
        const found = allPapers.find(p => p.id === paperId);
        if (found) {
          setPaper(found);
        } else {
          // If paper was recently uploaded or passed via router, construct dynamic paper entry
          setPaper(prev => ({
            ...prev,
            id: paperId,
            title: paperId.startsWith('paper_') ? 'Uploaded PDF Research Paper' : 'Attention Is All You Need (Vaswani et al. 2017)'
          }));
        }
      } catch (err) {
        console.error('Error fetching paper details:', err);
      }
    };
    fetchPaperDetails();
  }, [paperId]);

  const handleSelectCitation = (box: BoundingBox, pageNumber: number) => {
    setActiveHighlightBox(box);
    setActivePageNumber(pageNumber);
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 overflow-hidden font-sans transition-colors">
      {/* Top Header Bar */}
      <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard"
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center space-x-2 truncate max-w-xl">
            <span className="text-xs font-bold tracking-tight truncate">{paper.title}</span>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 shrink-0">
              {paper.status}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3 text-xs font-medium">
          <button className="flex items-center space-x-1 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg border border-zinc-200 dark:border-zinc-700 transition-colors">
            <Download className="w-3.5 h-3.5" />
            <span>Export Notes</span>
          </button>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Split-Screen Workspace Layout */}
      <main className="flex-1 grid grid-cols-12 overflow-hidden">
        {/* Left Panel: Interactive PDF Viewer Canvas (55% width) */}
        <div className="col-span-7 h-full overflow-hidden">
          <PdfViewer
            paperTitle={paper.title}
            activeCitationBox={activeHighlightBox}
            activePageNumber={activePageNumber}
          />
        </div>

        {/* Right Panel: AI Research Assistant Sidebar (45% width) */}
        <div className="col-span-5 h-full flex flex-col bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 overflow-hidden">
          {/* Top Right Tab Navigation */}
          <div className="h-11 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-3 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-1 text-xs font-medium">
              <button
                onClick={() => setActiveRightTab('chat')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  activeRightTab === 'chat'
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Chat (RAG)</span>
              </button>

              <button
                onClick={() => setActiveRightTab('summaries')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  activeRightTab === 'summaries'
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Summaries</span>
              </button>

              <button
                onClick={() => setActiveRightTab('code')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  activeRightTab === 'code'
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Pseudocode</span>
              </button>

              <button
                onClick={() => setActiveRightTab('flashcards')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  activeRightTab === 'flashcards'
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Flashcards</span>
              </button>
            </div>
          </div>

          {/* Right Panel Tab Content */}
          <div className="flex-1 overflow-hidden">
            {activeRightTab === 'chat' && (
              <RagChat
                paperId={paper.id}
                workspaceId={paper.workspaceId}
                onSelectCitation={handleSelectCitation}
              />
            )}

            {activeRightTab === 'summaries' && (
              <div className="p-6 overflow-auto h-full space-y-6 text-xs leading-relaxed">
                <div className="flex items-center space-x-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
                  <span className="text-zinc-500 font-medium">Summary Depth:</span>
                  <div className="flex items-center space-x-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
                    <button
                      onClick={() => setSummaryLength('short')}
                      className={`px-2.5 py-1 rounded text-[11px] ${summaryLength === 'short' ? 'bg-white dark:bg-zinc-900 font-bold shadow-sm' : 'text-zinc-500'}`}
                    >
                      5 Lines
                    </button>
                    <button
                      onClick={() => setSummaryLength('medium')}
                      className={`px-2.5 py-1 rounded text-[11px] ${summaryLength === 'medium' ? 'bg-white dark:bg-zinc-900 font-bold shadow-sm' : 'text-zinc-500'}`}
                    >
                      1 Page
                    </button>
                    <button
                      onClick={() => setSummaryLength('detailed')}
                      className={`px-2.5 py-1 rounded text-[11px] ${summaryLength === 'detailed' ? 'bg-white dark:bg-zinc-900 font-bold shadow-sm' : 'text-zinc-500'}`}
                    >
                      Detailed
                    </button>
                  </div>
                </div>

                <div className="space-y-4 font-serif-paper text-zinc-800 dark:text-zinc-200 text-sm">
                  <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-zinc-500">Executive Overview</h3>
                  <p>
                    Synthesized Summary for <strong>{paper.title}</strong>:
                  </p>
                  <p>
                    This paper introduces a high-capacity algorithmic approach dispensing with classical recurrent dependencies, establishing state-of-the-art results across benchmark evaluation tasks.
                  </p>
                </div>
              </div>
            )}

            {activeRightTab === 'code' && <CodeExtractor />}

            {activeRightTab === 'flashcards' && <FlashcardQuiz paperId={paper.id} />}
          </div>
        </div>
      </main>
    </div>
  );
}
