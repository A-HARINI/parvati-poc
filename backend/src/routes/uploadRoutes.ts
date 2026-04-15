import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticateAdmin } from '../middleware/authMiddleware';

const router = Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, WebP, GIF) are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
    files: 10, // Max 10 files at once
  },
});

// POST /api/upload — upload multiple images (admin)
router.post(
  '/',
  authenticateAdmin,
  upload.array('images', 10),
  (req: Request, res: Response) => {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const files = req.files as Express.Multer.File[];
    const urls = files.map((file) => `/uploads/${file.filename}`);

    res.json({
      message: `${files.length} file(s) uploaded successfully`,
      urls,
    });
  }
);

// DELETE /api/upload — delete an uploaded image (admin)
router.delete('/', authenticateAdmin, (req: Request, res: Response) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ message: 'URL is required' });
  }

  const filename = path.basename(url);
  const filepath = path.join(uploadDir, filename);

  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
    return res.json({ message: 'File deleted' });
  }

  res.status(404).json({ message: 'File not found' });
});

export default router;
