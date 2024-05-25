const router = require("express").Router();
const CourseContent = require("../models").courseContent;
const CourseQuiz = require("../models").courseQuiz;
const CourseTheme = require("../models").courseTheme;
const User = require("../models").user;

router.use((req, res, next) => {
  console.log("Course route received a request...");
  next();
});

router.get("/", async (req, res) => {
  try {
    let themeFound = await CourseTheme.find({}).exec();
    res.send(themeFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

router.get("/length/:sec/:ch", async (req, res) => {
  let { sec, ch } = req.params;
  try {
    if (sec === "content") {
      let contentFound = await CourseContent.find({ ch: ch }).exec();
      if (!contentFound) {
        return res.status(404).send("Content not found");
      }
      return res.send({ length: contentFound.length });
    } else if (sec === "quiz") {
      let quizFound = await CourseQuiz.find({ ch: ch }).exec();
      if (!quizFound) {
        return res.status(404).send("Quiz not found");
      }
      return res.send({ length: quizFound.length });
    } else {
      return res.status(400).send("Invalid section");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

// Middleware to check access and update progress
const checkAndUpdateProgress = async (req, res, next) => {
  const { sec, ch, no } = req.params;
  const _id = req.user._id;

  try {
    const user = await User.findOne({ _id: _id }).exec();
    if (!user) {
      return res.status(404).send("User not found");
    }
    let progress = user.progress.find((p) => p.ch === parseInt(ch));
    if (!progress) {
      progress = {
        ch: parseInt(ch),
        maxContentViewed: 0,
        maxQuizViewed: 0,
        maxQuizCompleted: 0,
      };
      user.progress.push(progress);
    }

    let maxContent = (await CourseContent.find({ ch: ch }).exec()).length;
    let maxQuiz = (await CourseQuiz.find({ ch: ch }).exec()).length;
    let contentDone = progress.maxContentViewed == maxContent;

    if (sec === "completed") {
      if (no > progress.maxQuizCompleted) {
        progress.maxQuizCompleted = no;
      }
    } else if (sec === "content" && no <= maxContent) {
      // Content access logic
      if (no == progress.maxContentViewed + 1) {
        progress.maxContentViewed = no;
      } else if (no > progress.maxContentViewed) {
        return res.status(403).send("課程猶未進展到遮喔！");
      }
    } else if (sec === "quiz" && no <= maxQuiz) {
      // Quiz access logic
      let x = progress.maxQuizViewed + 1;
      if (no == progress.maxQuizViewed + 1 && contentDone) {
        progress.maxQuizViewed = no;
      } else if (no > progress.maxQuizViewed || !contentDone) {
        return res.status(403).send("課程猶未進展到遮喔！");
      }
    } else {
      return res.status(400).send("遮無你欲揣的物件喔！");
    }

    await user.save();
    next();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

router.use("/:sec/:ch/:no", checkAndUpdateProgress);

router.get("/:sec/:ch/:no", async (req, res) => {
  let { sec, ch, no } = req.params;
  try {
    if (sec === "content") {
      // Use findOne to get a single document matching the criteria
      let contentFound = await CourseContent.findOne({ ch: ch, no: no }).exec();
      if (!contentFound) {
        return res.status(404).send("Content not found");
      }
      return res.send(contentFound);
    } else if (sec === "quiz") {
      // Use findOne for consistency
      let quizFound = await CourseQuiz.findOne({ ch: ch, no: no }).exec();
      if (!quizFound) {
        return res.status(404).send("Quiz not found");
      }
      return res.send(quizFound);
    } else if (sec === "completed") {
      let quizFound = await CourseQuiz.findOne({ ch: ch, no: no }).exec();
      if (!quizFound) {
        return res.status(404).send("Quiz not found");
      }
      return res.send(quizFound);
    } else {
      return res.status(400).send("Invalid section");
    }
  } catch (e) {
    console.error("Error:", e);
    return res.status(500).send("Internal server error");
  }
});

router.get("/progress/:ch", async (req, res) => {
  const { ch } = req.params;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Find progress for the provided chapter
    let chapterProgress = user.progress.find((progress) => progress.ch == ch);
    if (!chapterProgress) {
      // If progress for the chapter is not found, create a new progress entry
      chapterProgress = {
        ch: ch,
        maxContentViewed: 0,
        maxQuizViewed: 0,
        maxQuizCompleted: 0,
      };
      // Add the new progress entry to the user's progress array
      user.progress.push(chapterProgress);
      // Save the updated user document
      await user.save();
    }

    // Return the progress for the chapter
    res.status(200).json(chapterProgress);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send("Internal server error");
  }
});

module.exports = router;
