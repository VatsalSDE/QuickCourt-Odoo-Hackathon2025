require('dotenv').config();
const app = require('./app');

const config = require('./config/config');

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`🚀 QuickCourt Backend Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
