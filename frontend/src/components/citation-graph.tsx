'use client';

import React from 'react';
import { Network, ExternalLink, GitFork } from 'lucide-react';

export const CitationGraphView: React.FC = () => {
  const nodes = [
    { id: '1', title: 'Attention Is All You Need (2017)', type: 'target', citations: 120400, x: 50, y: 50 },
    { id: '2', title: 'BERT: Pre-training of Deep Bidirectional Transformers (2018)', type: 'derivative', citations: 85200, x: 25, y: 25 },
    { id: '3', title: 'GPT-3: Language Models are Few-Shot Learners (2020)', type: 'derivative', citations: 45000, x: 75, y: 25 },
    { id: '4', title: 'Deep Residual Learning for Image Recognition (2016)', type: 'predecessor', citations: 165000, x: 25, y: 75 },
    { id: '5', title: 'Neural Machine Translation by Jointly Learning to Align (2014)', type: 'predecessor', citations: 32000, x: 75, y: 75 }
  ];

  return (
    <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-950 p-6 space-y-4 select-none">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Network className="w-4 h-4 text-purple-500" /> Interactive Citation Influence Network Graph
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Powered by Semantic Scholar & OpenAlex API forward/backward citation trajectories.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-[11px] font-mono">
          <span className="flex items-center gap-1.5 text-zinc-900 dark:text-zinc-100 bg-zinc-200 dark:bg-zinc-800 px-2.5 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-zinc-900 dark:bg-zinc-100 animate-ping"></span> Target Paper
          </span>
          <span className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/60 px-2.5 py-1 rounded-full border border-purple-200 dark:border-purple-800">
            Derivative Work
          </span>
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            Predecessor Reference
          </span>
        </div>
      </div>

      {/* Interactive Visual Canvas Area */}
      <div className="flex-1 ui-card bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 relative overflow-hidden flex items-center justify-center p-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#71717a_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="relative w-full max-w-3xl h-96">
          <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-zinc-300 dark:stroke-zinc-700 stroke-2">
            <line x1="50%" y1="50%" x2="25%" y2="25%" strokeDasharray="4 4" />
            <line x1="50%" y1="50%" x2="75%" y2="25%" strokeDasharray="4 4" />
            <line x1="50%" y1="50%" x2="25%" y2="75%" />
            <line x1="50%" y1="50%" x2="75%" y2="75%" />
          </svg>

          {nodes.map((node) => (
            <div
              key={node.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-3.5 rounded-xl border transition-all duration-200 hover:scale-105 cursor-pointer max-w-xs shadow-sm ${
                node.type === 'target'
                  ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                  : node.type === 'derivative'
                  ? 'border-purple-300 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/40 text-purple-950 dark:text-purple-100'
                  : 'border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100'
              }`}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              <div className="flex items-start justify-between space-x-2">
                <span className="text-[11px] font-bold leading-tight">{node.title}</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-70 hover:opacity-100" />
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] opacity-80 font-mono">
                <span>{node.citations.toLocaleString()} citations</span>
                <span>Click to Expand</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
