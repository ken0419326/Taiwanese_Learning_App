const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const userProgressSchema = new Schema({
  ch: Number,
  maxContentViewed: Number,
  maxQuizViewed: Number,
});

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
  },
  progress: {
    type: [userProgressSchema],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// instance methods
userSchema.methods.comparePassword = async function (password, cb) {
  let result;
  try {
    result = await bcrypt.compare(password, this.password);
    return cb(null, result);
  } catch (e) {
    return cb(e, result);
  }
};

// mongoose middlewares
// if the user is new or is modifying password, then hash the password
userSchema.pre("save", async function (next) {
  // `this` is the document in MongoDB
  if (this.isNew || this.isModified("password")) {
    const hashValue = await bcrypt.hash(this.password, 10);
    this.password = hashValue;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
