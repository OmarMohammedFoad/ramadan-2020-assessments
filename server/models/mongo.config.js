const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const mongodbUrl = 'mongodb://omarfouad15e:Omarfouad123@ac-x7p6sxs-shard-00-00.ak7vqjm.mongodb.net:27017,ac-x7p6sxs-shard-00-01.ak7vqjm.mongodb.net:27017,ac-x7p6sxs-shard-00-02.ak7vqjm.mongodb.net:27017/?ssl=true&replicaSet=atlas-v2i4l2-shard-0&authSource=admin&retryWrites=true&w=majority'; // TODO: PUT YOUR VALID MONGODB CONNECTION URL HERE <-

if (!mongodbUrl) {
  console.log('\x1b[33m%s\x1b[0m','Please set the mongodb connection first in -> "server/models/mongo.config.js"\n');
  return;
}

mongoose.connect(mongodbUrl,{useUnifiedTopology:true,  useNewUrlParser: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to Database Video Requests');
});

module.exports = mongoose;
