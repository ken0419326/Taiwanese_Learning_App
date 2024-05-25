const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const userProgressSchema = new Schema({
  ch: {
    type: Number,
    required: true,
  },
  maxContentViewed: {
    type: Number,
    required: true,
  },
  maxQuizViewed: {
    type: Number,
    required: true,
  },
  maxQuizCompleted: {
    type: Number,
    required: true,
  },
  lastViewed: {
    type: Date,
    default: "2000-01-01",
    required: true,
  },
});

const userCollectionSchema = new Schema({
  ch: {
    type: Number, // Assuming chapter should be a number
    required: true,
  },
  no: {
    type: Number, // Assuming number should be a number
    required: true,
  },
  tags: {
    type: [String], // Assuming tags should be an array of strings
    validate: {
      validator: function (v) {
        return Array.isArray(v);
      },
      message: (props) => `${props.value} is not a valid array of strings!`,
    },
  },
  note: {
    type: String,
    default: "",
  },
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
  tags: {
    type: [String],
  },
  collections: {
    type: [userCollectionSchema],
  },
  achievements: [{ type: Schema.Types.ObjectId, ref: "AchievementSchema" }],
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
