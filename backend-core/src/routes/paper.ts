import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Setup Multer storage
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

// In-memory Papers registry
const PAPERS: any[] = [
  {
    id: 'paper-demo-1',
    workspaceId: 'ws-default-1',
    title: 'Attention Is All You Need',
    authors: ['Ashish Vaswani', 'Noam Shazeer', 'Niki Parmar', 'Jakob Uszkoreit'],
    year: 2017,
    journal: 'Advances in Neural Information Processing Systems (NeurIPS)',
    abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks...',
    fileUrl: '/uploads/sample-transformer.pdf',
    status: 'INDEXED',
    createdAt: new Date().toISOString()
  },
  {
    id: 'paper-demo-2',
    workspaceId: 'ws-default-1',
    title: 'Deep Residual Learning for Image Recognition',
    authors: ['Kaiming He', 'Xiangyu Zhang', 'Shaoqing Ren', 'Jian Sun'],
    year: 2016,
    journal: 'CVPR',
    abstract: 'Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training of networks that are substantially deeper...',
    fileUrl: '/uploads/sample-resnet.pdf',
    status: 'INDEXED',
    createdAt: new Date().toISOString()
  }
];

// Annotations store
const ANNOTATIONS: any[] = [];

// Get papers in workspace
router.get('/workspace/:workspaceId', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const workspacePapers = PAPERS.filter(p => p.workspaceId === req.params.workspaceId);
  res.json({ papers: workspacePapers });
});

// Get single paper details
router.get('/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const paper = PAPERS.find(p => p.id === req.params.id);
  if (!paper) {
    return res.status(404).json({ error: 'Paper not found' });
  }
  res.json({ paper });
});

// Upload paper PDF
router.post('/upload', authenticateToken, upload.single('pdf'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file provided.' });
    }

    const { workspaceId, title, year, journal } = req.body;
    const paperId = `paper_${Date.now()}`;

    const newPaper = {
      id: paperId,
      workspaceId: workspaceId || 'ws-default-1',
      title: title || req.file.originalname,
      authors: ['Research Author'],
      year: year ? parseInt(year, 10) : new Date().getFullYear(),
      journal: journal || 'Academic Publication',
      abstract: 'Abstract under extraction...',
      fileUrl: `/uploads/${req.file.filename}`,
      filePath: req.file.path,
      status: 'PROCESSING',
      createdAt: new Date().toISOString()
    };

    PAPERS.push(newPaper);

    // Trigger AI Backend ingestion asynchronously
    const aiApiUrl = process.env.AI_API_URL || 'http://localhost:8000/api/v1';
    fetch(`${aiApiUrl}/ingest-paper`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paperId: newPaper.id,
        filePath: req.file.path,
        title: newPaper.title,
        authors: newPaper.authors,
        year: newPaper.year,
      })
    })
      .then(async (aiRes) => {
        if (aiRes.ok) {
          const data = await aiRes.json();
          newPaper.status = 'INDEXED';
          console.log(`✅ Paper ${newPaper.id} indexed by AI engine (${data.totalChunks} chunks).`);
        } else {
          console.error(`⚠️ AI ingestion returned status ${aiRes.status}`);
          newPaper.status = 'INDEXED'; // Allow viewing PDF even if AI ingestion warning
        }
      })
      .catch((err) => {
        console.error(`⚠️ Could not reach AI engine for ingestion: ${err.message}`);
        newPaper.status = 'INDEXED';
      });

    res.status(201).json({
      message: 'Paper uploaded successfully. Processing started.',
      paper: newPaper
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Save annotation highlight
router.post('/annotations', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { paperId, pageNumber, highlightText, userNote, color, boundingBox } = req.body;
  const annotation = {
    id: `ann_${Date.now()}`,
    paperId,
    userId: req.user?.id || 'dev-user-id',
    pageNumber,
    highlightText,
    userNote: userNote || '',
    color: color || '#FFD166',
    boundingBox: boundingBox || {},
    createdAt: new Date().toISOString()
  };

  ANNOTATIONS.push(annotation);
  res.status(201).json({ annotation });
});

// Get annotations for a paper
router.get('/annotations/:paperId', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const paperAnnotations = ANNOTATIONS.filter(a => a.paperId === req.params.paperId);
  res.json({ annotations: paperAnnotations });
});

export default router;
