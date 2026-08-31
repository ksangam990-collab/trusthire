import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const evidenceStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isDoc = file.mimetype === 'application/pdf' || 
                  file.mimetype.includes('word');
    return {
      folder: 'trusthire/fraud_evidence',
      resource_type: isDoc ? 'raw' : 'image',
      public_id: `evidence_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'doc', 'docx']
    };
  }
});

const resumeStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'trusthire/resumes',
      resource_type: 'raw',
      public_id: `resume_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      allowed_formats: ['pdf', 'doc', 'docx']
    };
  }
});

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed types: JPEG, PNG, WEBP, PDF, DOC, DOCX`), false);
  }
};

export const uploadEvidence = multer({
  storage: evidenceStorage,
  limits: { fileSize: 5 * 1024 * 1024, files: 4 },
  fileFilter
});

export const uploadResume = multer({
  storage: resumeStorage,
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter
});

export default cloudinary;