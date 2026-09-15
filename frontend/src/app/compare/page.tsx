'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Layers, Network, Download, CheckSquare, Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { MatrixComparison } from '@/components/MatrixComparison';
import { CitationGraphView } from '@/components/citation-graph';

export default function ComparePage() {
  const [activeTab, setActiveTab] = useState<'matrix' | 'graph'>('matrix');
  const [selectedPapers, setSelectedPapers] = useState<string[]>(['paper-demo-1', 'paper-demo-2']);

  const allAvailablePapers = [
    { id: 'paper-demo-1', title: 'Attention Is All You Need (2017)', authors: 'Vaswani et al.' },
    { id: 'paper-demo-2', title: 'Deep Residual Learning for Image Recognition (2016)', authors: 'He et al.' },
    { id: 'paper-demo-3', title: 'BERT: Pre-training of Deep Bidirectional Transformers (2018)', authors: 'Devlin et al.' }
  ];

  const togglePaperSelection = (id: string) => {
    if (selectedPapers.includes(id)) {
      if (selectedPapers.length > 1) {
        setSelectedPapers(prev => prev.filter(p => p !== id));
      }
    } else {
      if (selectedPapers.length < 10) {
        setSelectedPapers(prev => [...prev, id]);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 overflow-hidden font-sans transition-colors">
      {/* Top Navigation Header */}
      <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard"
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-zinc-900 dark:text-zinc-100" />
            <span className="text-sm font-bold tracking-tight">Multi-Paper Synthesis & Compare</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl space-x-1 text-xs font-medium">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'matrix'
                ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Comparison Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('graph')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'graph'
                ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Citation Network Graph</span>
          </button>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <ThemeToggle />
        </div>
      </header>

      {/* Main Body Content */}
      <main className="flex-1 grid grid-cols-12 overflow-hidden">
        {/* Paper Selector Sidebar (Left 25%) */}
        <div className="col-span-3 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-4 overflow-auto shrink-0">
          <div>
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
              Select Papers to Synthesize ({selectedPapers.length}/10)
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
              Select up to 10 research papers to build automated comparative dimensions.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            {allAvailablePapers.map((paper) => {
              const isSelected = selectedPapers.includes(paper.id);
              return (
                <div
                  key={paper.id}
                  onClick={() => togglePaperSelection(paper.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-800/80 shadow-sm'
                      : 'border-zinc-200 dark:border-zinc-800/60 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    <CheckSquare className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400'}`} />
                    <div>
                      <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">{paper.title}</h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5">{paper.authors}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Comparison Matrix or Citation Network View (Right 75%) */}
        <div className="col-span-9 h-full overflow-hidden">
          {activeTab === 'matrix' && <MatrixComparison paperIds={selectedPapers} />}
          {activeTab === 'graph' && <CitationGraphView />}
        </div>
      </main>
    </div>
  );
}
