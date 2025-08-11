const fs = require('fs');
const path = require('path');

console.log('🚀 QuickCourt MongoDB Atlas Setup');
console.log('================================\n');

// Check if .env exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists');
  console.log('📝 Current MONGO_URI:', process.env.MONGO_URI ? 'Set' : 'Not set');
} else {
  console.log('❌ .env file not found');
  console.log('📝 Creating .env.example...');
  
  const envExample = `# MongoDB Atlas Connection
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/quickcourt?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production

# Server Configuration
PORT=5000
NODE_ENV=development

# Optional: Email service for OTP
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your_email@gmail.com
# SMTP_PASS=your_app_password
`;

  fs.writeFileSync(path.join(__dirname, '.env.example'), envExample);
  console.log('✅ .env.example created');
}

console.log('\n📋 Next Steps:');
console.log('1. Follow the guide in MONGODB_ATLAS_SETUP.md');
console.log('2. Create your MongoDB Atlas cluster');
console.log('3. Copy your connection string');
console.log('4. Create a .env file with your MONGO_URI');
console.log('5. Test connection: npm run test-db');
console.log('6. Start server: npm run dev');

console.log('\n🔗 MongoDB Atlas: https://www.mongodb.com/atlas');
console.log('📚 Documentation: https://docs.atlas.mongodb.com/');
