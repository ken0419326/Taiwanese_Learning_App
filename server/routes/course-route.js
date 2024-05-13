const router = require("express").Router();
const CourseContent = require("../models").courseContent;
const CourseQuiz = require("../models").courseQuiz;
const CourseTheme = require("../models").courseTheme;

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
    } else {
      return res.status(400).send("Invalid section");
    }
  } catch (e) {
    console.error("Error:", e);
    return res.status(500).send("Internal server error");
  }
});

module.exports = router;
