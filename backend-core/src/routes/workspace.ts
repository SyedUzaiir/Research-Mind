import { Router, Response } from 'express';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// In-memory workspace state for dev
const WORKSPACES: any[] = [
  {
    id: 'ws-default-1',
    name: 'Quantum Machine Learning Lab',
    description: 'Literature synthesis and RAG workspace for quantum neural networks and hybrid optimization.',
    ownerId: 'dev-user-id',
    createdAt: new Date().toISOString(),
    papersCount: 4
  },
  {
    id: 'ws-default-2',
    name: 'LLM Reasoning & Alignment',
    description: 'Survey papers on chain-of-thought, RLHF, and constitutional AI alignment.',
    ownerId: 'dev-user-id',
    createdAt: new Date().toISOString(),
    papersCount: 6
  }
];

router.get('/', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  res.json({ workspaces: WORKSPACES });
});

router.post('/', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Workspace name is required.' });
  }

  const newWorkspace = {
    id: `ws_${Date.now()}`,
    name,
    description: description || '',
    ownerId: req.user?.id || 'dev-user-id',
    createdAt: new Date().toISOString(),
    papersCount: 0
  };

  WORKSPACES.push(newWorkspace);
  res.status(201).json({ workspace: newWorkspace });
});

router.get('/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const ws = WORKSPACES.find(w => w.id === req.params.id);
  if (!ws) {
    return res.status(404).json({ error: 'Workspace not found' });
  }
  res.json({ workspace: ws });
});

export default router;
