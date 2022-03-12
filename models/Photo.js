const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Photoschema = new Schema({
  title: String,
  description: String,
  image: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

const Photo = mongoose.model('Photo', Photoschema);
module.exports = Photo;
