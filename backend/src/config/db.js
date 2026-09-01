import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.warn('[Database Warning] MONGODB_URI is not set in environment. Database operations will require MongoDB Atlas or local MongoDB.');
      return;
    }

    const conn = await mongoose.connect(mongoUri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000
    });

    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[Database Error] Connection attempt failed: ${error.message}`);
    console.warn('[Database] Running in fallback mode. Ensure MongoDB is running and MONGODB_URI is correctly configured in .env.');
  }
};

export default connectDB;