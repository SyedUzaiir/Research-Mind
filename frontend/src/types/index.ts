export interface BoundingBox {
  page: number;
  x0: number; // Normalized (0.0 to 1.0)
  y0: number;
  w: number;
  h: number;
  text?: string;
}

export interface Citation {
  chunkId: string;
  paperId: string;
  pageNumber: number;
  boundingBox: BoundingBox;
  snippet: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  timestamp: string;
}

export interface Paper {
  id: string;
  workspaceId: string;
  title: string;
  authors: string[];
  year?: number;
  journal?: string;
  abstract?: string;
  fileUrl: string;
  status: 'PENDING' | 'PROCESSING' | 'INDEXED' | 'FAILED';
  createdAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  papersCount: number;
  createdAt: string;
}

export interface ComparisonRow {
  paperId: string;
  title: string;
  dataset: string;
  algorithm: string;
  metrics: string;
  limitations: string;
}

export interface Flashcard {
  question: string;
  answer: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}
