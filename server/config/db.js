const mongoose = require('mongoose');

/**
 * Connect to MongoDB Atlas
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(
      `✅ MongoDB connected: ${conn.connection.host}`
    );
    return conn;
  } catch (error) {
  console.error("❌ FULL MongoDB ERROR:");
  console.error(error); // 👈 THIS LINE is the key
  process.exit(1);
    }
};

module.exports = { connectDB };
