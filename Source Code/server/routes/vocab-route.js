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

router.get("/", async (req, res) => {
  try {
    const _id = req.user._id;
    const userFound = await User.findOne({ _id }).exec();
    const tagsFound = userFound.tags;
    res.send(tagsFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

router.get("/count/:tag", async (req, res) => {
  const { tag } = req.params;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Count the number of cards with the specified tag
    const count = user.collections.reduce((total, collection) => {
      return total + (collection.tags.includes(tag) ? 1 : 0);
    }, 0);

    // Send the count as a response
    res.status(200).send({ count });
  } catch (error) {
    console.error("Error counting cards:", error);
    res.status(500).send("Internal server error");
  }
});

router.post("/save/:ch/:no", async (req, res) => {
  const { ch, no } = req.params;
  const { tags } = req.body;
  const userId = req.user._id;

  // Check if any tag exceeds 15 characters
  if (tags.some((tag) => tag.length > 15)) {
    return res.status(400).send("標籤名稱袂當超過 15 字喔！");
  }

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

router.delete("/save/:ch/:no", async (req, res) => {
  const { ch, no } = req.params;
  const { tag } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    let collectionIndex = user.collections.findIndex(
      (collection) =>
        collection.ch === parseInt(ch) && collection.no === parseInt(no)
    );

    if (collectionIndex !== -1) {
      // Remove the tag from the tags array
      let collectionEntry = user.collections[collectionIndex];
      collectionEntry.tags = collectionEntry.tags.filter((t) => t !== tag);

      // Remove the collection if its tags array is empty
      if (collectionEntry.tags.length === 0) {
        user.collections.splice(collectionIndex, 1);
      }

      // Check if the tag exists in any other collection
      const tagExistsInOtherCollections = user.collections.some((collection) =>
        collection.tags.includes(tag)
      );

      // If the tag does not exist in any other collection, remove it from user.tags
      if (!tagExistsInOtherCollections) {
        user.tags = user.tags.filter((t) => t !== tag);
      }

      await user.save(); // Save the updated user document
      res.send("Tag removed successfully");
    } else {
      return res.status(404).send("Collection not found");
    }
  } catch (error) {
    res.status(500).send(error);
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

router.post("/note/:ch/:no", async (req, res) => {
  const { ch, no } = req.params;
  const { note } = req.body;
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
      collectionFound.note = note;
      await user.save();
      res.send("Collection saved successfully");
    } else {
      return res.status(404).send("Collection not found");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch("/tag", async (req, res) => {
  let { oldTag, newTag } = req.body;
  const userId = req.user._id;

  newTag = String(newTag).trim();
  console.log(newTag);
  if (!newTag) {
    return res.status(400).send("標籤袂當是空的喔！");
  }
  if (newTag.length > 15) {
    return res.status(400).send("標籤名稱袂當超過 15 字喔！");
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Check if the new tag already exists in user's tags
    if (user.tags.includes(newTag)) {
      return res.status(400).send("這个標籤已經用過矣喔！");
    }

    // Update tags in User document
    const updatedTags = user.tags.map((tag) => (tag === oldTag ? newTag : tag));
    user.tags = updatedTags;

    // Update tags in User collections
    user.collections.forEach((collection) => {
      collection.tags = collection.tags.map((tag) =>
        tag === oldTag ? newTag : tag
      );
    });

    // Save changes to the user document
    await user.save();

    res.status(200).send("Tags updated successfully");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/tag", async (req, res) => {
  const { tag } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Remove tag from User.tags
    user.tags = user.tags.filter((t) => t !== tag);

    // Remove tag from User.collections
    user.collections.forEach((collection) => {
      collection.tags = collection.tags.filter((t) => t !== tag);
    });

    // Remove collections with empty tags
    user.collections = user.collections.filter(
      (collection) => collection.tags.length > 0
    );

    // Save changes to the user document
    await user.save();

    res.status(200).send("Tag removed successfully");
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
