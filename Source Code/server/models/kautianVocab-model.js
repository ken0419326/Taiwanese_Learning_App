const mongoose = require("mongoose");
const { Schema } = mongoose;

const kautianVocabSchema = new Schema({
  vocab_id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  hanji: {
    type: String,
    required: true,
  },
  lomaji: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("KautianVocab", kautianVocabSchema);
