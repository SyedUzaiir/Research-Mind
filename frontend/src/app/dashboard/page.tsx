'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  Folder,
  Layers,
  Network,
  HelpCircle,
  Settings,
  Plus,
  UploadCloud,
  Search,
  BookOpen,
  ChevronRight,
  User,
  LogOut,
  Sparkles,
  CheckCircle,
  Menu,
  X
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Paper, Workspace } from '@/types';
import { ApiClient } from '@/lib/api';

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeFolder, setActiveFolder] = useState('all');
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      const wsList = await ApiClient.getWorkspaces();
      setWorkspaces(wsList);
      if (wsList.length > 0) {
        const paperList = await ApiClient.getPapers(wsList[0].id);
        setPapers(paperList);
      }
    };
    loadDashboard();
  }, []);

  const handleSimulatedUpload = () => {
    setUploading(true);
    setTimeout(() => {
      const newPaper: Paper = {
        id: `paper_${Date.now()}`,
        workspaceId: 'ws-default-1',
        title: 'Mastering the Game of Go with Deep Neural Networks',
        authors: ['David Silver', 'Aja Huang', 'Demis Hassabis'],
        year: 2016,
        journal: 'Nature',
        abstract: 'We introduce a algorithm using deep neural networks and tree search...',
        fileUrl: '/sample-alphago.pdf',
        status: 'INDEXED',
        createdAt: new Date().toISOString()
      };
      setPapers(prev => [newPaper, ...prev]);
      setUploading(false);
    }, 1500);
  };

  const filteredPapers = papers.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.authors.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans overflow-hidden transition-colors">
      {/* Collapsible Left Sidebar (Linear / Notion Inspired) */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-16'
        } transition-all duration-200 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col justify-between shrink-0 z-30`}
      >
        <div className="space-y-4 p-4">
          {/* Header & Collapse Toggle */}
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center text-white dark:text-zinc-900 font-bold text-xs">
                  R
                </div>
                <span className="font-bold text-xs tracking-tight">ResearchMind</span>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded text-zinc-500"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs">
            <button
              onClick={() => setActiveFolder('all')}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg font-medium transition-colors ${
                activeFolder === 'all'
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>All Research Papers</span>}
            </button>

            <Link
              href="/compare"
              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Layers className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>Literature Reviews</span>}
            </Link>

            <Link
              href="/compare"
              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Network className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>Citation Graphs</span>}
            </Link>

            <Link
              href="/paper/paper-demo-1"
              className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-lg font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <HelpCircle className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>Flashcards & Quizzes</span>}
            </Link>
          </nav>

          {/* Folder Tree Organization */}
          {sidebarOpen && (
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
              <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider px-3">
                Research Folders
              </span>
              <div className="space-y-0.5 text-xs text-zinc-600 dark:text-zinc-400">
                <button
                  onClick={() => setActiveFolder('ml')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center space-x-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                    activeFolder === 'ml' ? 'font-bold text-zinc-900 dark:text-zinc-100' : ''
                  }`}
                >
                  <Folder className="w-3.5 h-3.5 text-amber-500" />
                  <span>Machine Learning</span>
                </button>
                <button
                  onClick={() => setActiveFolder('nlp')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center space-x-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                    activeFolder === 'nlp' ? 'font-bold text-zinc-900 dark:text-zinc-100' : ''
                  }`}
                >
                  <Folder className="w-3.5 h-3.5 text-blue-500" />
                  <span>Natural Language Processing</span>
                </button>
                <button
                  onClick={() => setActiveFolder('ds')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center space-x-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                    activeFolder === 'ds' ? 'font-bold text-zinc-900 dark:text-zinc-100' : ''
                  }`}
                >
                  <Folder className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Distributed Systems</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center space-x-2 text-xs font-medium">
                <User className="w-4 h-4 text-zinc-500" />
                <span>Dr. Scholar</span>
              </div>
            )}
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Action Header */}
        <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3 w-96">
            <div className="relative w-full flex items-center">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search papers by title or author..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/paper/paper-demo-1"
              className="flex items-center space-x-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Open Reader Workspace</span>
            </Link>
          </div>
        </header>

        {/* Main Library & Upload Content Area */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Drag & Drop Quick Upload Target Zone */}
          <div
            onClick={handleSimulatedUpload}
            className="ui-card p-6 border-dashed border-2 border-zinc-300 dark:border-zinc-700/80 bg-zinc-50/50 dark:bg-zinc-900/40 hover:border-zinc-900 dark:hover:border-zinc-100 transition-colors cursor-pointer text-center space-y-2 rounded-2xl"
          >
            <div className="w-10 h-10 rounded-full bg-zinc-200/80 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-700 dark:text-zinc-300">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                {uploading ? 'Parsing PDF Layout & Calculating Relative Bounding Boxes...' : 'Drag & Drop PDF Paper Here'}
              </h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Supports PDF, DOCX, and TXT files up to 50MB. Auto-chunks & indexes vector embeddings.
              </p>
            </div>
            {uploading && (
              <div className="flex items-center justify-center space-x-2 text-xs text-amber-500 pt-1 font-mono">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Running PyMuPDF Layout Extraction...</span>
              </div>
            )}
          </div>

          {/* Filterable Paper Library Table View */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-zinc-500" /> Research Paper Library ({filteredPapers.length})
              </h2>
            </div>

            <div className="ui-card bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-500 uppercase font-semibold text-[10px] tracking-wider">
                    <th className="p-3.5 w-2/5">Paper Title</th>
                    <th className="p-3.5 w-1/4">Authors</th>
                    <th className="p-3.5 w-1/6">Year & Venue</th>
                    <th className="p-3.5 w-1/6">Index Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-zinc-700 dark:text-zinc-300">
                  {filteredPapers.map((paper) => (
                    <tr key={paper.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="p-3.5">
                        <Link href={`/paper/${paper.id}`} className="font-semibold text-zinc-900 dark:text-zinc-100 hover:underline flex items-center gap-1.5">
                          {paper.title} <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                        </Link>
                      </td>
                      <td className="p-3.5 text-zinc-500 dark:text-zinc-400 truncate max-w-xs">{paper.authors.join(', ')}</td>
                      <td className="p-3.5 font-mono text-[11px] text-zinc-500">{paper.year} • {paper.journal || 'Academic'}</td>
                      <td className="p-3.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/40">
                          <CheckCircle className="w-3 h-3" /> INDEXED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
