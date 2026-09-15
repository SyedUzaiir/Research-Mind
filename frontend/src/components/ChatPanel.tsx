'use client';

import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, MapPin, FileText, CheckCircle2 } from 'lucide-react';
import { ChatMessage, Citation, BoundingBox } from '@/types';
import { ApiClient } from '@/lib/api';

interface ChatPanelProps {
  paperId?: string;
  workspaceId: string;
  onSelectCitation: (box: BoundingBox, pageNumber: number) => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
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

      // Automatically trigger highlight for first citation if available
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
    <div className="flex flex-col h-full bg-[#0b0f17]">
      {/* Panel Header */}
      <div className="px-4 py-3 glass-panel border-b border-dark-border flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-brand-500 animate-pulse" />
          <h3 className="text-sm font-semibold text-gray-200">Grounded RAG Assistant</h3>
        </div>
        <span className="text-[10px] bg-brand-500/20 text-brand-400 border border-brand-500/30 px-2 py-0.5 rounded-full font-mono">
          FlashRank Hybrid RRF
        </span>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${
              msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                msg.role === 'user'
                  ? 'bg-brand-600 text-white'
                  : 'bg-dark-card border border-dark-border text-brand-400'
              }`}
            >
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Message Bubble */}
            <div className="flex-1 max-w-[85%]">
              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-brand-600 text-white rounded-tr-none'
                    : 'glass-panel text-gray-200 border border-dark-border rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>

                {/* Grounded Citation Cards */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-white/10 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-brand-400 tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Grounded Source Citations ({msg.citations.length})
                    </span>

                    {msg.citations.map((cit, idx) => (
                      <button
                        key={idx}
                        onClick={() => onSelectCitation(cit.boundingBox, cit.pageNumber)}
                        className="w-full text-left p-2 rounded-lg bg-dark-card/90 hover:bg-brand-500/20 border border-dark-border hover:border-brand-500/50 transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center space-x-2 truncate">
                          <MapPin className="w-3.5 h-3.5 text-yellow-400 group-hover:scale-110 transition-transform shrink-0" />
                          <span className="text-[11px] text-gray-300 font-medium truncate">
                            Page {cit.pageNumber} — <span className="italic text-gray-400">"{cit.snippet.substring(0, 60)}..."</span>
                          </span>
                        </div>
                        <span className="text-[10px] text-brand-400 font-mono underline shrink-0 ml-2">
                          Highlight Box
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-[9px] text-gray-500 mt-1 block px-1 font-mono">{msg.timestamp}</span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-gray-400 text-xs p-3 glass-panel rounded-xl w-fit">
            <Sparkles className="w-4 h-4 text-brand-500 animate-spin" />
            <span>Retrieving hybrid RRF chunks & reranking via FlashRank...</span>
          </div>
        )}
      </div>

      {/* Input Query Bar */}
      <form onSubmit={handleSendMessage} className="p-3 glass-panel border-t border-dark-border">
        <div className="flex items-center bg-dark-card border border-dark-border rounded-xl px-3 py-2 focus-within:border-brand-500 transition-colors">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask a question about equations, metrics, or limitations..."
            className="flex-1 bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="p-1.5 bg-brand-600 hover:bg-brand-500 disabled:opacity-40 text-white rounded-lg transition-colors ml-2"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
