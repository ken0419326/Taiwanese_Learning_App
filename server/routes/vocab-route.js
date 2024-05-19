const router = require("express").Router();
const User = require("../models").user;
const jwt = require("jsonwebtoken");

router.use((req, res, next) => {
  console.log("Vocab route received a request...");
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
    next(); // Call next() only if the token is valid and user is found
  } catch (ex) {
    return res.status(400).send("Invalid token.");
  }
};

router.use(authMiddleware);

router.post("/save/:ch/:no", async (req, res) => {
  const { ch, no } = req.params;
  const { tags } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    const progress = user.progress.find((p) => p.ch === parseInt(ch));
    if (!progress || progress.maxContentViewed < parseInt(no)) {
      return res.status(400).send("Not allowed to save this content");
    }

    let collectionEntry = user.collections.find(
      (collection) =>
        collection.ch === parseInt(ch) && collection.no === parseInt(no)
    );

    if (collectionEntry) {
      collectionEntry.tags = tags;
    } else {
      user.collections.push({ ch: parseInt(ch), no: parseInt(no), tags });
    }

    // Update user tags with new tags
    const updatedUserTags = [...new Set([...user.tags, ...tags])];
    user.tags = updatedUserTags;

    await user.save();
    res.send("Collection saved successfully");
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
