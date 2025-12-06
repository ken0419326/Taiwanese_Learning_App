const mongoose = require("mongoose");
const { Schema } = mongoose;

const courseQuizSchema = new Schema({
  ch: {
    type: String,
    required: true,
  },
  no: {
    type: String,
    required: true,
  },
  que: {
    type: String,
    required: true,
  },
  que: {
    type: String,
    required: true,
  },
  A: {
    type: String,
    required: true,
  },
  B: {
    type: String,
    required: true,
  },
  C: {
    type: String,
    required: true,
  },
  D: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("CourseQuiz", courseQuizSchema);
