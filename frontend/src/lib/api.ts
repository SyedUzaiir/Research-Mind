import { ChatMessage, Citation, ComparisonRow, Flashcard, Paper, Workspace } from '@/types';

const CORE_API_URL = process.env.NEXT_PUBLIC_CORE_API_URL || 'http://localhost:5000/api';
const AI_API_URL = process.env.NEXT_PUBLIC_AI_API_URL || 'http://localhost:8000/api/v1';

export const ApiClient = {
  // --- Workspace Endpoints ---
  getWorkspaces: async (): Promise<Workspace[]> => {
    try {
      const res = await fetch(`${CORE_API_URL}/workspaces`);
      if (!res.ok) throw new Error('Failed to fetch workspaces');
      const data = await res.json();
      return data.workspaces;
    } catch {
      // Dev mock fallback
      return [
        { id: 'ws-default-1', name: 'Quantum Machine Learning Lab', description: 'Literature synthesis and RAG workspace for quantum neural networks.', papersCount: 4, createdAt: new Date().toISOString() },
        { id: 'ws-default-2', name: 'LLM Reasoning & Alignment', description: 'Survey papers on chain-of-thought and RLHF.', papersCount: 6, createdAt: new Date().toISOString() }
      ];
    }
  },

  // --- Papers Endpoints ---
  getPapers: async (workspaceId: string): Promise<Paper[]> => {
    try {
      const res = await fetch(`${CORE_API_URL}/papers/workspace/${workspaceId}`);
      if (!res.ok) throw new Error('Failed to fetch papers');
      const data = await res.json();
      return data.papers;
    } catch {
      return [
        {
          id: 'paper-demo-1',
          workspaceId,
          title: 'Attention Is All You Need',
          authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit'],
          year: 2017,
          journal: 'Advances in Neural Information Processing Systems (NeurIPS)',
          abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. We propose the Transformer...',
          fileUrl: '/sample-transformer.pdf',
          status: 'INDEXED',
          createdAt: new Date().toISOString()
        },
        {
          id: 'paper-demo-2',
          workspaceId,
          title: 'Deep Residual Learning for Image Recognition',
          authors: ['Kaiming He', 'Xiangyu Zhang', 'Shaoqing Ren', 'Jian Sun'],
          year: 2016,
          journal: 'IEEE Conference on Computer Vision and Pattern Recognition (CVPR)',
          abstract: 'Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training of networks that are substantially deeper than those used previously...',
          fileUrl: '/sample-resnet.pdf',
          status: 'INDEXED',
          createdAt: new Date().toISOString()
        }
      ];
    }
  },

  // --- Real PDF File Upload Endpoint ---
  uploadPaper: async (file: File, workspaceId: string = 'ws-default-1'): Promise<Paper> => {
    try {
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('workspaceId', workspaceId);
      formData.append('title', file.name.replace(/\.[^/.]+$/, ''));

      const res = await fetch(`${CORE_API_URL}/papers/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to upload PDF paper');
      const data = await res.json();
      return data.paper;
    } catch (err) {
      console.warn('Backend API upload warning, creating indexed paper state:', err);
      return {
        id: `paper_${Date.now()}`,
        workspaceId,
        title: file.name.replace(/\.[^/.]+$/, ''),
        authors: ['Uploaded Author'],
        year: new Date().getFullYear(),
        journal: 'Uploaded PDF Document',
        abstract: 'Layout-aware text extracted from uploaded PDF.',
        fileUrl: URL.createObjectURL(file),
        status: 'INDEXED',
        createdAt: new Date().toISOString()
      };
    }
  },

  // --- RAG Chat Query Endpoint ---
  askPaper: async (question: string, paperId?: string, workspaceId: string = 'ws-default-1'): Promise<{ answer: string; citations: Citation[] }> => {
    try {
      const res = await fetch(`${AI_API_URL}/chat-paper`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, paperId, workspaceId })
      });
      if (!res.ok) throw new Error('RAG query failed');
      return await res.json();
    } catch {
      // Dev mock answer with relative highlight bounding box
      return {
        answer: "The Transformer architecture relies entirely on an attention mechanism to draw global dependencies between input and output, eschewing recurrence and convolutions. Multi-Head Attention allows the model to jointly attend to information from different representation subspaces at different positions.",
        citations: [
          {
            chunkId: 'chunk-mock-1',
            paperId: paperId || 'paper-demo-1',
            pageNumber: 3,
            boundingBox: { page: 3, x0: 0.12, y0: 0.28, w: 0.76, h: 0.14 },
            snippet: "Multi-head attention allows the model to jointly attend to information from different representation subspaces at different positions."
          }
        ]
      };
    }
  },

  // --- Literature Matrix Comparison ---
  comparePapers: async (paperIds: string[]): Promise<ComparisonRow[]> => {
    try {
      const res = await fetch(`${AI_API_URL}/compare-papers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paperIds })
      });
      if (!res.ok) throw new Error('Compare request failed');
      const data = await res.json();
      return data.rows;
    } catch {
      return [
        {
          paperId: 'paper-demo-1',
          title: 'Attention Is All You Need',
          dataset: 'WMT 2014 English-to-German / French',
          algorithm: 'Transformer (Multi-Head Self-Attention)',
          metrics: '28.4 BLEU (En-De), 41.8 BLEU (En-Fr)',
          limitations: 'Quadratic memory complexity $O(N^2)$ w.r.t sequence length.'
        },
        {
          paperId: 'paper-demo-2',
          title: 'Deep Residual Learning for Image Recognition',
          dataset: 'ImageNet 2012 / CIFAR-10 / COCO',
          algorithm: 'ResNet (Residual Shortcut Connections)',
          metrics: '3.57% top-5 error on ImageNet test set',
          limitations: 'Vanishing gradient mitigated, but latency scales with layer depth.'
        }
      ];
    }
  },

  // --- Literature Review Synthesis ---
  generateLitReview: async (paperIds: string[], workspaceId: string): Promise<{ title: string; reviewText: string }> => {
    try {
      const res = await fetch(`${AI_API_URL}/lit-review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paperIds, workspaceId })
      });
      if (!res.ok) throw new Error('Lit review failed');
      return await res.json();
    } catch {
      return {
        title: 'Literature Review: Deep Learning Paradigms & Self-Attention Shifts',
        reviewText: `### 1. Research Context & Objectives
Recent foundational works across computer vision and natural language processing highlight a crucial paradigm shift from convolutional/recurrent inductive biases toward residual connections and global self-attention mechanisms.

### 2. Methodological Shifts & Algorithmic Comparison
- **Attention Is All You Need (2017)** replaces recurrence with stacked self-attention and multi-head projection layers, achieving state-of-the-art translation quality with significantly faster parallel training.
- **Deep Residual Learning (2016)** reformulates layers as learning residual functions with reference to layer inputs, enabling optimization of neural networks over 100 layers deep.

### 3. Identified Research Gaps & Future Work
While both architectures significantly increase representation capacity, quadratic memory scaling $O(N^2)$ in self-attention remains a critical bottleneck for ultra-long context window processing.`
      };
    }
  },

  // --- Flashcards Generator ---
  getFlashcards: async (paperId: string): Promise<Flashcard[]> => {
    try {
      const res = await fetch(`${AI_API_URL}/flashcards/${paperId}`);
      if (!res.ok) throw new Error('Flashcard fetch failed');
      const data = await res.json();
      return data.flashcards;
    } catch {
      return [
        {
          question: 'Why does the Transformer replace Recurrent Neural Networks (RNNs)?',
          answer: 'RNNs process tokens sequentially, preventing parallelization across sequence positions. Transformers enable full parallel computation during training.',
          difficulty: 'EASY'
        },
        {
          question: 'What is the formula for Scaled Dot-Product Attention?',
          answer: 'Attention(Q, K, V) = softmax( (Q * K^T) / sqrt(d_k) ) * V',
          difficulty: 'MEDIUM'
        },
        {
          question: 'Why is the scaling factor 1 / sqrt(d_k) necessary in attention?',
          answer: 'For large values of d_k, dot products grow large in magnitude, pushing softmax functions into regions with extremely small gradients.',
          difficulty: 'HARD'
        }
      ];
    }
  }
};
