const mongoose = require('mongoose');

async function connectToDb(mongoUri) {
  if (!mongoUri) {
    throw new Error('MONGO_URI is missing');
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri);
}

module.exports = { connectToDb };


