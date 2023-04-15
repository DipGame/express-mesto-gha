const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    require: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
  },
  likes: {
    type: Array,
    require: true,
  },
  createAt: {
    type: Date,
  },
});

module.exports = mongoose.model('card', cardSchema);
