'use client';

import React, { useState } from 'react';
import { Code, Copy, Check, Terminal } from 'lucide-react';

export const CodeExtractor: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [selectedLang, setSelectedLang] = useState<'python' | 'cpp'>('python');

  const pythonCode = `import torch
import torch.nn as nn
import math

class MultiHeadAttention(nn.Module):
    """
    Extracted PyTorch implementation of Multi-Head Attention
    From: Vaswani et al., Attention Is All You Need (2017)
    """
    def __init__(self, d_model: int = 512, n_head: int = 8):
        super().__init__()
        assert d_model % n_head == 0
        self.d_k = d_model // n_head
        self.n_head = n_head
        
        self.q_linear = nn.Linear(d_model, d_model)
        self.k_linear = nn.Linear(d_model, d_model)
        self.v_linear = nn.Linear(d_model, d_model)
        self.out_proj = nn.Linear(d_model, d_model)

    def forward(self, q, k, v, mask=None):
        bs = q.size(0)
        # 1. Linear projections & reshape for multi-head
        q = self.q_linear(q).view(bs, -1, self.n_head, self.d_k).transpose(1, 2)
        k = self.k_linear(k).view(bs, -1, self.n_head, self.d_k).transpose(1, 2)
        v = self.v_linear(v).view(bs, -1, self.n_head, self.d_k).transpose(1, 2)
        
        # 2. Scaled Dot-Product Attention
        scores = torch.matmul(q, k.transpose(-2, -1)) / math.sqrt(self.d_k)
        if mask is not None:
            scores = scores.masked_fill(mask == 0, -1e9)
        attn_weights = torch.softmax(scores, dim=-1)
        output = torch.matmul(attn_weights, v)
        
        # 3. Concatenate heads and project
        output = output.transpose(1, 2).contiguous().view(bs, -1, self.n_head * self.d_k)
        return self.out_proj(output)
`;

  const cppCode = `#include <iostream>
#include <vector>
#include <cmath>

// C++ Starter implementation for Scaled Dot-Product Attention
std::vector<std::vector<float>> scaled_dot_product_attention(
    const std::vector<std::vector<float>>& Q,
    const std::vector<std::vector<float>>& K,
    const std::vector<std::vector<float>>& V,
    int d_k
) {
    // Computes Softmax((Q * K^T) / sqrt(d_k)) * V
    std::cout << "Executing C++ Attention Kernel..." << std::endl;
    return V;
}
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(selectedLang === 'python' ? pythonCode : cppCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#0b0f17] p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Code className="w-5 h-5 text-emerald-400" /> Pseudocode to PyTorch/C++ Extractor
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Auto-synthesizes paper algorithms into clean executable starter code templates.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSelectedLang('python')}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              selectedLang === 'python'
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-dark-card text-gray-400 border-dark-border'
            }`}
          >
            PyTorch (Python)
          </button>
          <button
            onClick={() => setSelectedLang('cpp')}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              selectedLang === 'cpp'
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-dark-card text-gray-400 border-dark-border'
            }`}
          >
            C++ Kernel
          </button>
          <button
            onClick={copyToClipboard}
            className="flex items-center space-x-1 px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs rounded-lg transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>
      </div>

      {/* Code Window Container */}
      <div className="flex-1 glass-panel rounded-xl border border-dark-border overflow-hidden flex flex-col font-mono text-xs">
        <div className="bg-[#090d14] px-4 py-2 border-b border-dark-border flex items-center space-x-2 text-gray-400 text-[11px]">
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span>{selectedLang === 'python' ? 'attention_module.py' : 'attention_kernel.cpp'}</span>
        </div>

        <pre className="flex-1 p-4 overflow-auto text-emerald-300/90 leading-relaxed bg-[#06090e]">
          <code>{selectedLang === 'python' ? pythonCode : cppCode}</code>
        </pre>
      </div>
    </div>
  );
};
