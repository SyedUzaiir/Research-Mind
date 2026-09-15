'use client';

import React, { useState, useEffect } from 'react';
import { Table, Sparkles, Download, Layers } from 'lucide-react';
import { ComparisonRow } from '@/types';
import { ApiClient } from '@/lib/api';

export const MatrixComparison: React.FC<{ paperIds: string[] }> = ({ paperIds }) => {
  const [rows, setRows] = useState<ComparisonRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMatrix = async () => {
      setLoading(true);
      const data = await ApiClient.comparePapers(paperIds);
      setRows(data);
      setLoading(false);
    };
    fetchMatrix();
  }, [paperIds]);

  return (
    <div className="flex flex-col h-full bg-[#0b0f17] p-6 space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-500" /> Multi-Paper Literature Comparison Matrix
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Automated comparative synthesis across benchmark datasets, core algorithms, metrics, and limitations.
          </p>
        </div>

        <button className="flex items-center space-x-2 bg-dark-card hover:bg-dark-hover text-gray-300 text-xs px-3 py-2 rounded-lg border border-dark-border transition-colors">
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV / Markdown</span>
        </button>
      </div>

      {/* Comparison Table */}
      <div className="flex-1 overflow-auto glass-panel rounded-xl border border-dark-border">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-3">
            <Sparkles className="w-6 h-6 text-brand-500 animate-spin" />
            <span className="text-xs text-gray-400">Extracting paper dimensions and building matrix...</span>
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-dark-card/90 border-b border-dark-border text-gray-300 font-semibold uppercase tracking-wider text-[10px]">
                <th className="p-3.5 w-1/5">Research Paper</th>
                <th className="p-3.5 w-1/5">Benchmark Dataset</th>
                <th className="p-3.5 w-1/5">Core Algorithm / Model</th>
                <th className="p-3.5 w-1/5">Quantitative Metrics</th>
                <th className="p-3.5 w-1/5">Identified Limitations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border text-gray-300">
              {rows.map((row) => (
                <tr key={row.paperId} className="hover:bg-dark-hover/50 transition-colors">
                  <td className="p-3.5 font-bold text-white leading-snug">{row.title}</td>
                  <td className="p-3.5 text-gray-300 font-mono text-[11px]">{row.dataset}</td>
                  <td className="p-3.5 text-brand-400 font-medium">{row.algorithm}</td>
                  <td className="p-3.5 text-emerald-400 font-mono text-[11px]">{row.metrics}</td>
                  <td className="p-3.5 text-amber-300/90 text-[11px] leading-relaxed">{row.limitations}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
