const mongoose = require("mongoose");
const { Schema } = mongoose;

const kautianSemanticsSchema = new Schema({
  vocab_id: {
    type: String,
    required: true,
  },
  semantics_id: {
    type: String,
    required: true,
  },
  pos: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("KautianSemantics", kautianSemanticsSchema);
