const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;

// Connect mongoose to MongoDB database
mongoose.connect(uri ,{ useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'cnnection error:'));
db.once('open', () => {
  console.log('connection to db - successful');
})

module.exports = db;