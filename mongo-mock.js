const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;
let uri = process.env.MONGO_DB_CONNECTION_STRING;

async function start() {
  try {
    // Try connecting to real MongoDB first
    const mongoose = require('mongoose');
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      serverSelectionTimeoutMS: 3000
    });
    await mongoose.disconnect();
    console.log("Using real MongoDB at", uri);
    return uri;
  } catch (err) {
    console.log("Real MongoDB unavailable, starting in-memory server...");
    mongod = await MongoMemoryServer.create();
    uri = mongod.getUri();
    console.log("In-memory MongoDB running at", uri);
    return uri;
  }
}

module.exports = { start, getUri: () => uri };
