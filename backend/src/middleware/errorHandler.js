const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error('[Error Handler]:', err);
  } else {
    console.error('[Error Handler]:', err.message || err);
  }

  // Mongoose CastError (invalid ObjectId)
  // FIX (MEDIUM): Removed err.value from the message — it echoed the raw
  // user-supplied string back in the response, which is information disclosure
  // and could expose path-traversal attempts or injection payloads in logs/responses.
  if (err.name === 'CastError') {
    return res.status(404).json({ success: false, message: 'Resource not found.' });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({ success: false, message: `Duplicate value for ${field}. Value already exists.`, field });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(v => v.message);
    return res.status(400).json({ success: false, message: 'Validation failed.', errors: messages });
  }

  // Multer errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE')
      return res.status(400).json({ success: false, message: 'File size exceeds the upload limit.' });
    return res.status(400).json({ success: false, message: `File upload error: ${err.message}` });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError')
    return res.status(401).json({ success: false, message: 'Invalid authorization token.' });

  const statusCode = err.statusCode || err.status || 500;
  // Never expose raw error messages or stack traces in production
  const message = process.env.NODE_ENV === 'production' && statusCode === 500
    ? 'An internal server error occurred.'
    : (err.message || 'Internal Server Error');

  res.status(statusCode).json({ success: false, message });
};

export default errorHandler;
