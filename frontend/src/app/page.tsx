'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Search,
  Layers,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Terminal,
  ShieldCheck,
  ChevronRight,
  Zap
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { TeamSection } from '@/components/team-section';

export default function LandingPage() {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      num: 1,
      title: '1. Layout-Aware PDF Ingestion',
      desc: 'PyMuPDF parses mathematical formulas, multi-column layouts, and tables into relative percentage bounding box coordinates (0.0–1.0).',
      demo: {
        file: 'attention_is_all_you_need.pdf',
        output: 'Page 3: BoundingBox { x0: 0.12, y0: 0.28, w: 0.76, h: 0.14 }'
      }
    },
    {
      num: 2,
      title: '2. PostgreSQL RRF Hybrid Search',
      desc: 'Combines pgvector Cosine embeddings with PostgreSQL tsvector full-text search using Reciprocal Rank Fusion (RRF) & FlashRank reranking.',
      demo: {
        query: '"What is the formula for Scaled Dot-Product Attention?"',
        topRank: 'Chunk #4 [RRF Score: 0.0328, Rerank: 0.941]'
      }
    },
    {
      num: 3,
      title: '3. Grounded Citation & Matrix Synthesis',
      desc: 'LLM outputs structured responses. Clicking any citation jumps directly to the PDF page and draws an exact canvas bounding box overlay.',
      demo: {
        answer: 'Multi-Head Attention projects Q, K, V into d_k dimensions.',
        citation: '[Page 3, ¶2] -> Bounding Box Rendered'
      }
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans transition-colors">
      {/* Top Navbar */}
      <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900 font-bold text-sm">
            R
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">ResearchMind</span>
            <span className="text-[10px] text-zinc-500 font-mono ml-2">v1.0 Capstone</span>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-xs font-medium">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            Docs
          </a>
          <ThemeToggle />
          <Link
            href="/login"
            className="flex items-center space-x-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
          >
            <span>Launch Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Hero Container */}
      <main className="max-w-6xl mx-auto px-6 pt-16 pb-20 space-y-20">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-200/60 dark:bg-zinc-800/60 px-3.5 py-1.5 rounded-full border border-zinc-300/60 dark:border-zinc-700/60">
            <Zap className="w-3.5 h-3.5 text-amber-500" /> Non-AI Cliché Academic RAG Platform
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.15]">
            Stop Drowning in Research Papers. <br />
            <span className="text-zinc-500 dark:text-zinc-400">Read with Grounded Precision.</span>
          </h1>

          <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl mx-auto font-serif-paper">
            ResearchMind combines layout-aware PDF parsing with PostgreSQL Reciprocal Rank Fusion (RRF) search and FlashRank reranking. Click any AI citation to highlight the exact text bounding box directly inside your paper viewer.
          </p>

          <div className="pt-4 flex items-center justify-center space-x-4">
            <Link
              href="/login"
              className="flex items-center space-x-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-sm"
            >
              <span>Explore Demo Workspace</span>
              <ChevronRight className="w-4 h-4" />
            </Link>

            <a
              href="#how-it-works"
              className="flex items-center space-x-2 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-5 py-3 rounded-xl font-medium text-sm border border-zinc-200 dark:border-zinc-800 transition-colors"
            >
              <span>See How It Works</span>
            </a>
          </div>
        </div>

        {/* Live Interactive "How It Works" Preview Component */}
        <div id="how-it-works" className="space-y-6 pt-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Interactive Execution Pipeline
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Click through the stages below to inspect how ResearchMind parses, indexes, and synthesizes papers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {steps.map((s) => (
              <button
                key={s.num}
                onClick={() => setActiveStep(s.num)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  activeStep === s.num
                    ? 'border-zinc-900 dark:border-zinc-100 bg-white dark:bg-zinc-900 shadow-sm'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-900/40 hover:border-zinc-400'
                }`}
              >
                <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{s.title}</h3>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-normal">{s.desc}</p>
              </button>
            ))}
          </div>

          {/* Interactive Output Console Card */}
          <div className="ui-card p-6 bg-zinc-900 dark:bg-zinc-950 text-zinc-100 font-mono text-xs rounded-2xl border-zinc-800 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-zinc-400 text-[11px] flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" /> Pipeline Inspector — Stage #{activeStep}
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                ACTIVE PIPELINE LOG
              </span>
            </div>

            <div className="space-y-2 py-2 text-[11px]">
              {activeStep === 1 && (
                <>
                  <p className="text-zinc-400">&gt; PyMuPDF fitz loading file: <span className="text-zinc-100">{steps[0].demo.file}</span></p>
                  <p className="text-amber-300">&gt; Normalized Coordinates: <span className="text-zinc-200">{steps[0].demo.output}</span></p>
                  <p className="text-zinc-500 italic">&gt; Bounding box percentage ratios calculated (0.0 to 1.0) for resolution-independent viewer canvas.</p>
                </>
              )}

              {activeStep === 2 && (
                <>
                  <p className="text-zinc-400">&gt; Executing Query: <span className="text-zinc-100">{steps[1].demo.query}</span></p>
                  <p className="text-emerald-300">&gt; Dense pgvector Cosine Search + Sparse tsvector Search fused via RRF constant k=60.</p>
                  <p className="text-purple-300">&gt; FlashRank Cross-Encoder Top Candidate: <span className="text-zinc-100">{steps[1].demo.topRank}</span></p>
                </>
              )}

              {activeStep === 3 && (
                <>
                  <p className="text-zinc-400">&gt; Grounded LLM Response: <span className="text-zinc-100">{steps[2].demo.answer}</span></p>
                  <p className="text-blue-300">&gt; Grounded Citation Badge Attached: <span className="text-amber-300">{steps[2].demo.citation}</span></p>
                  <p className="text-emerald-400">&gt; Click citation badge in viewer sidebar to instantly trigger yellow canvas highlight overlay!</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Team & Capstone Project Showcase Component */}
        <TeamSection />
      </main>
    </div>
  );
}
