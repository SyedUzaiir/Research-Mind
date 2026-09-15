'use client';

import React, { useState, useEffect } from 'react';
import { HelpCircle, RefreshCw, CheckCircle, RotateCw } from 'lucide-react';
import { Flashcard } from '@/types';
import { ApiClient } from '@/lib/api';

export const FlashcardQuiz: React.FC<{ paperId: string }> = ({ paperId }) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCards = async () => {
      setLoading(true);
      const cards = await ApiClient.getFlashcards(paperId);
      setFlashcards(cards);
      setLoading(false);
    };
    loadCards();
  }, [paperId]);

  if (loading || flashcards.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-xs text-gray-400">
        Generating active-recall flashcards...
      </div>
    );
  }

  const current = flashcards[currentIndex];

  return (
    <div className="flex flex-col h-full bg-[#0b0f17] p-6 items-center justify-center space-y-6 select-none">
      <div className="text-center max-w-md">
        <h2 className="text-lg font-bold text-white flex items-center justify-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-400" /> Active Recall Flashcard Suite
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Card {currentIndex + 1} of {flashcards.length} — Difficulty: <span className="font-mono text-amber-400">{current.difficulty}</span>
        </p>
      </div>

      {/* Flip Card Container */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full max-w-lg h-64 glass-panel rounded-2xl border border-dark-border p-8 cursor-pointer flex flex-col justify-between items-center text-center transition-all duration-300 hover:border-brand-500/50 glow-blue"
      >
        <span className="text-[10px] uppercase font-bold text-brand-400 tracking-widest flex items-center gap-1">
          <RotateCw className="w-3 h-3" /> Click card to flip ({isFlipped ? 'Answer' : 'Question'})
        </span>

        <div className="my-auto px-4">
          <p className="text-sm font-semibold text-gray-100 leading-relaxed">
            {isFlipped ? current.answer : current.question}
          </p>
        </div>

        <span className="text-[10px] text-gray-500 font-mono">
          {isFlipped ? 'Review Next Concept →' : 'Click to Reveal Active Answer'}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => {
            setIsFlipped(false);
            setCurrentIndex(i => (i - 1 + flashcards.length) % flashcards.length);
          }}
          className="px-4 py-2 bg-dark-card hover:bg-dark-hover text-gray-300 text-xs rounded-xl border border-dark-border"
        >
          Previous Card
        </button>

        <button
          onClick={() => {
            setIsFlipped(false);
            setCurrentIndex(i => (i + 1) % flashcards.length);
          }}
          className="px-6 py-2 bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs rounded-xl shadow transition-colors"
        >
          Next Card
        </button>
      </div>
    </div>
  );
};
