'use client';

import React from 'react';
import { GitFork, ExternalLink, Network } from 'lucide-react';

export const CitationGraph: React.FC = () => {
  const nodes = [
    { id: '1', title: 'Attention Is All You Need (2017)', type: 'target', citations: 120400, x: 50, y: 50 },
    { id: '2', title: 'BERT: Pre-training of Deep Bidirectional Transformers (2018)', type: 'derivative', citations: 85200, x: 25, y: 25 },
    { id: '3', title: 'GPT-3: Language Models are Few-Shot Learners (2020)', type: 'derivative', citations: 45000, x: 75, y: 25 },
    { id: '4', title: 'Deep Residual Learning for Image Recognition (2016)', type: 'predecessor', citations: 165000, x: 25, y: 75 },
    { id: '5', title: 'Neural Machine Translation by Jointly Learning to Align (2014)', type: 'predecessor', citations: 32000, x: 75, y: 75 }
  ];

  return (
    <div className="flex flex-col h-full bg-[#0b0f17] p-6 space-y-4 select-none">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-purple-500" /> Interactive Citation Network Graph
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            2D Influence Tree powered by Semantic Scholar & OpenAlex API co-citation trajectories.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="flex items-center gap-1.5 text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-full border border-brand-500/30">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping"></span> Target Paper
          </span>
          <span className="flex items-center gap-1.5 text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/30">
            Derivative Work
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
            Predecessor Reference
          </span>
        </div>
      </div>

      {/* Interactive Visual Canvas Area */}
      <div className="flex-1 glass-panel rounded-xl border border-dark-border relative overflow-hidden flex items-center justify-center p-8">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>

        {/* Node Layout Canvas */}
        <div className="relative w-full max-w-3xl h-96">
          {/* SVG Connector Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-gray-700/80 stroke-2">
            <line x1="50%" y1="50%" x2="25%" y2="25%" strokeDasharray="4 4" className="animate-pulse" />
            <line x1="50%" y1="50%" x2="75%" y2="25%" strokeDasharray="4 4" className="animate-pulse" />
            <line x1="50%" y1="50%" x2="25%" y2="75%" />
            <line x1="50%" y1="50%" x2="75%" y2="75%" />
          </svg>

          {nodes.map((node) => (
            <div
              key={node.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-3.5 rounded-xl glass-panel border transition-all duration-300 hover:scale-105 cursor-pointer max-w-xs ${
                node.type === 'target'
                  ? 'border-brand-500 shadow-lg shadow-brand-500/20 bg-brand-900/40'
                  : node.type === 'derivative'
                  ? 'border-purple-500/50 bg-purple-950/30'
                  : 'border-emerald-500/50 bg-emerald-950/30'
              }`}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              <div className="flex items-start justify-between space-x-2">
                <span className="text-[11px] font-bold text-white leading-tight">{node.title}</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400 shrink-0 hover:text-white" />
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px] text-gray-400">
                <span>{node.citations.toLocaleString()} citations</span>
                <span className="font-mono text-brand-400">Click to Expand</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
