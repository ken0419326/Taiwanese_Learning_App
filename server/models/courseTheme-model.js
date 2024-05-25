const mongoose = require("mongoose");
const { Schema } = mongoose;

const courseThemeSchema = new Schema({
  ch: {
    type: String,
    required: true,
  },
  theme: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("CourseTheme", courseThemeSchema);
