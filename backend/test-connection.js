const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('🔍 Testing MongoDB Atlas connection...');
    
    const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoURI) {
      console.log('❌ MONGO_URI not found in environment variables');
      console.log('📝 Please create a .env file with your MongoDB Atlas connection string');
      return;
    }
    
    if (mongoURI.includes('localhost')) {
      console.log('⚠️  Using local MongoDB instead of Atlas');
    } else {
      console.log('🌐 Connecting to MongoDB Atlas...');
    }
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB connection successful!');
    console.log(`   Database: ${mongoose.connection.name}`);
    console.log(`   Host: ${mongoose.connection.host}`);
    console.log(`   Port: ${mongoose.connection.port}`);
    
    // Test creating a collection
    const testCollection = mongoose.connection.collection('test');
    await testCollection.insertOne({ test: 'connection', timestamp: new Date() });
    console.log('✅ Database write test successful!');
    
    // Clean up test data
    await testCollection.deleteOne({ test: 'connection' });
    console.log('✅ Database cleanup successful!');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check if MONGO_URI is correct in .env file');
    console.log('2. Verify username and password in connection string');
    console.log('3. Ensure your IP is whitelisted in MongoDB Atlas');
    console.log('4. Check if cluster is running and accessible');
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('🔌 Disconnected from MongoDB');
    }
    process.exit(0);
  }
}

testConnection();
