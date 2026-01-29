const http = require('http');
require('./config/env');
const app = require('./app');
const { connectToDb } = require('./config/db');

const PORT = process.env.PORT || 5000;

async function start() {
  await connectToDb(process.env.MONGO_URI);

  const server = http.createServer(app);
  server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on port ${PORT}`);
  });
}

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', err);
  process.exit(1);
});


