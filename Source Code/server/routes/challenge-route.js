const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models").user;
const CourseContent = require("../models").courseContent; // Assuming this is defined

router.use((req, res, next) => {
  console.log("Challenge route received a request...");
  next();
});

const authMiddleware = async (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, process.env.PASSPORT_SECRET);
    req.user = await User.findById(decoded._id).select("-password");
    next();
  } catch (ex) {
    return res.status(400).send("Invalid token.");
  }
};

router.use(authMiddleware);

router.get("/user-collections", async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    let collectionFound = user.collections;
    res.send(collectionFound);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/content/:ch/:no", async (req, res) => {
  let { ch, no } = req.params;
  try {
    let contentFound = await CourseContent.findOne({ ch: ch, no: no }).exec();
    if (!contentFound) {
      return res.status(404).send("Content not found");
    }
    return res.send(contentFound);
  } catch (e) {
    console.error("Error:", e);
    return res.status(500).send("Internal server error");
  }
});

router.get("/note/:ch/:no", async (req, res) => {
  const { ch, no } = req.params;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    let collectionFound = user.collections.find(
      (collection) =>
        collection.ch === parseInt(ch) && collection.no === parseInt(no)
    );

    if (collectionFound) {
      res.send(collectionFound.note);
    } else {
      return res.status(404).send("Collection not found");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
