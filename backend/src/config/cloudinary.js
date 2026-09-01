import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

const hasCloudinaryCredentials = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (hasCloudinaryCredentials) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
}

const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

let evidenceStorage;
let resumeStorage;

if (hasCloudinaryCredentials) {
  evidenceStorage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
      const isDoc = file.mimetype === 'application/pdf' || file.mimetype.includes('word');
      return {
        folder: 'trusthire/fraud_evidence',
        resource_type: isDoc ? 'raw' : 'image',
        public_id: `evidence_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'doc', 'docx']
      };
    }
  });

  resumeStorage = new CloudinaryStorage({
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
} else {
  // Graceful local fallback for development/testing without external Cloudinary setup
  const memoryStorage = multer.memoryStorage();
  evidenceStorage = memoryStorage;
  resumeStorage = memoryStorage;
}

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}. Allowed types: JPEG, PNG, WEBP, PDF, DOC, DOCX`), false);
  }
};

const attachMockUrlsMiddleware = (req, res, next) => {
  if (!hasCloudinaryCredentials) {
    if (req.file) {
      req.file.secure_url = `https://storage.trusthire.dev/uploads/resumes/${Date.now()}_${req.file.originalname}`;
      req.file.path = req.file.secure_url;
    }
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach(file => {
        file.secure_url = `https://storage.trusthire.dev/uploads/evidence/${Date.now()}_${file.originalname}`;
        file.path = file.secure_url;
      });
    }
  }
  next();
};

const baseUploadEvidence = multer({
  storage: evidenceStorage,
  limits: { fileSize: 5 * 1024 * 1024, files: 4 },
  fileFilter
});

const baseUploadResume = multer({
  storage: resumeStorage,
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter
});

export const uploadEvidence = {
  array: (fieldName, maxCount) => [
    baseUploadEvidence.array(fieldName, maxCount),
    attachMockUrlsMiddleware
  ]
};

export const uploadResume = {
  single: (fieldName) => [
    baseUploadResume.single(fieldName),
    attachMockUrlsMiddleware
  ]
};

export default cloudinary;