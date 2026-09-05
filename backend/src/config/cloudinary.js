import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

const hasCredentials = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY   &&
  process.env.CLOUDINARY_API_SECRET
);

if (hasCredentials) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

const ALLOWED_MIME_TYPES = [
  'image/jpeg', 'image/png', 'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed: JPEG, PNG, WEBP, PDF, DOC, DOCX`), false);
  }
};

// ─── Storage backends ──────────────────────────────────────────────────────────
let evidenceStorage, resumeStorage;

if (hasCredentials) {
  evidenceStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
      folder: 'trusthire/fraud_evidence',
      resource_type: (file.mimetype === 'application/pdf' || file.mimetype.includes('word')) ? 'raw' : 'image',
      public_id: `evidence_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'doc', 'docx'],
    }),
  });

  resumeStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
      folder: 'trusthire/resumes',
      resource_type: 'raw',
      public_id: `resume_${req.user?._id || 'anon'}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      allowed_formats: ['pdf', 'doc', 'docx'],
    }),
  });
} else {
  evidenceStorage = multer.memoryStorage();
  resumeStorage   = multer.memoryStorage();
}

// Attach placeholder URLs when Cloudinary is not configured (dev mode)
const attachDevUrls = (req, _res, next) => {
  if (!hasCredentials) {
    if (req.file) {
      req.file.path = req.file.secure_url =
        `https://cdn.trusthire.in/dev/resumes/${Date.now()}_${encodeURIComponent(req.file.originalname)}`;
    }
    if (req.files?.length) {
      req.files.forEach(f => {
        f.path = f.secure_url =
          `https://cdn.trusthire.in/dev/evidence/${Date.now()}_${encodeURIComponent(f.originalname)}`;
      });
    }
  }
  next();
};

// ─── FIX: Export plain middleware functions, NOT objects with wrapped methods.
// Previously uploadEvidence.array() returned an array [multerMw, attachDevUrls]
// which Express cannot call as a function. Now we compose them into a single
// middleware via a wrapper so routes can use them directly without spreading.
// ─────────────────────────────────────────────────────────────────────────────

const baseEvidence = multer({
  storage: evidenceStorage,
  limits: { fileSize: 5 * 1024 * 1024, files: 4 },
  fileFilter,
});

const baseResume = multer({
  storage: resumeStorage,
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter,
});

// Single composed middleware — no more array-of-middlewares problem
export const uploadEvidenceMiddleware = (req, res, next) => {
  baseEvidence.array('evidence', 4)(req, res, (err) => {
    if (err) return next(err);
    attachDevUrls(req, res, next);
  });
};

export const uploadResumeMiddleware = (req, res, next) => {
  baseResume.single('resume')(req, res, (err) => {
    if (err) return next(err);
    attachDevUrls(req, res, next);
  });
};

// Keep old names as aliases so other imports still work
export const uploadEvidence = uploadEvidenceMiddleware;
export const uploadResume   = uploadResumeMiddleware;

export default cloudinary;
