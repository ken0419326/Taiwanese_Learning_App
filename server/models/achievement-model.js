const mongoose = require("mongoose");
const { Schema } = mongoose;

const achievementSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  criterion: {
    type: Number,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Achievement", achievementSchema);
