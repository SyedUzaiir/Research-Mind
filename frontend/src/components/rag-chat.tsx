'use client';

import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, MapPin, CheckCircle2, Code, HelpCircle, FileText } from 'lucide-react';
import { ChatMessage, BoundingBox } from '@/types';
import { ApiClient } from '@/lib/api';

interface RagChatProps {
  paperId?: string;
  workspaceId: string;
  onSelectCitation: (box: BoundingBox, pageNumber: number) => void;
}

export const RagChat: React.FC<RagChatProps> = ({
  paperId,
  workspaceId,
  onSelectCitation,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: 'Welcome to ResearchMind AI! Ask any question about your research paper. Every answer is grounded with page numbers and canvas bounding boxes.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: inputQuery.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await ApiClient.askPaper(userMsg.content, paperId, workspaceId);

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: response.answer,
        citations: response.citations,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);

      if (response.citations && response.citations.length > 0) {
        const first = response.citations[0];
        onSelectCitation(first.boundingBox, first.pageNumber);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800">
      {/* Panel Header */}
      <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
          <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Grounded Research RAG</h3>
        </div>
        <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
          PostgreSQL RRF + FlashRank
        </span>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-auto p-4 space-y-4 text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-2.5 ${
              msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                msg.role === 'user'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700'
              }`}
            >
              {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div className="flex-1 max-w-[85%] space-y-1">
              <div
                className={`p-3 rounded-xl leading-relaxed text-xs ${
                  msg.role === 'user'
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 rounded-tr-none'
                    : 'ui-card bg-zinc-50 dark:bg-zinc-950/60 text-zinc-900 dark:text-zinc-100 rounded-tl-none border-zinc-200 dark:border-zinc-800'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>

                {/* Grounded Citation Triggers */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-zinc-200 dark:border-zinc-800/80 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Grounded Source Citations ({msg.citations.length})
                    </span>

                    {msg.citations.map((cit, idx) => (
                      <button
                        key={idx}
                        onClick={() => onSelectCitation(cit.boundingBox, cit.pageNumber)}
                        className="w-full text-left p-2 rounded-lg bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/80 transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="text-[11px] text-zinc-700 dark:text-zinc-300 font-medium truncate">
                            [Page {cit.pageNumber}, ¶{idx+1}] — <span className="italic text-zinc-500 font-serif-paper">"{cit.snippet.substring(0, 55)}..."</span>
                          </span>
                        </div>
                        <span className="text-[10px] text-zinc-900 dark:text-zinc-100 font-mono underline shrink-0 ml-2">
                          Highlight Box
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-[9px] text-zinc-400 font-mono block px-1">{msg.timestamp}</span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-zinc-500 text-xs p-3 ui-card rounded-xl w-fit">
            <Sparkles className="w-4 h-4 text-zinc-900 dark:text-zinc-100 animate-spin" />
            <span>Fusing RRF candidate chunks & FlashRank cross-encoder...</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0">
        <div className="flex items-center bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3 py-2 focus-within:border-zinc-900 dark:focus-within:border-zinc-100 transition-colors">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about equations, datasets, or limitations..."
            className="flex-1 bg-transparent text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="p-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 disabled:opacity-40 text-white dark:text-zinc-900 rounded-lg transition-colors ml-2"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
