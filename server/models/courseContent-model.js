const mongoose = require("mongoose");
const { Schema } = mongoose;

const courseContentSchema = new Schema({
  ch: {
    type: String,
    required: true,
  },
  no: {
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
  mandarin: {
    type: String,
    required: true,
  },
  audio: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("CourseContent", courseContentSchema);
