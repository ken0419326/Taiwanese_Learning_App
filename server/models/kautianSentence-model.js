const mongoose = require("mongoose");
const { Schema } = mongoose;

const kautianSentenceSchema = new Schema({
  sementics_id: {
    type: String,
    required: true,
  },
  sentence_id: {
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
  madarin: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("KautianSentence", kautianSentenceSchema);
