const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models").user;
const Achievement = require("../models").achievement;
const CourseContent = require("../models").courseContent; // Assuming this is defined
const CourseQuiz = require("../models").courseQuiz; // Assuming this is defined

router.use((req, res, next) => {
  console.log("Profile route received a request...");
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

const getCompletedCoursesCount = async (progress) => {
  let completedCourses = 0;

  for (let p of progress) {
    const maxContent = await CourseContent.countDocuments({ ch: p.ch }).exec();
    const maxQuiz = await CourseQuiz.countDocuments({ ch: p.ch }).exec();

    if (p.maxContentViewed + p.maxQuizViewed === maxContent + maxQuiz) {
      completedCourses++;
    }
  }

  return completedCourses;
};

const determineAchievements = async (type, progress) => {
  const achievements = [];
  const typeAchievements = await Achievement.find({ type }).exec();
  if (type === "course") {
    const completedCourses = await getCompletedCoursesCount(progress);
    typeAchievements.forEach((achievement) => {
      if (completedCourses >= parseInt(achievement.criterion)) {
        achievements.push({
          type: achievement.type,
          criterion: achievement.criterion,
          title: achievement.title,
          icon: achievement.icon,
        });
      }
    });
  }

  return achievements;
};

router.get("/achievement/:type", async (req, res) => {
  try {
    const userId = req.user._id;
    const { type } = req.params;

    const user = await User.findById(userId).exec();
    if (!user) {
      return res.status(404).send("User not found");
    }

    const achievements = await determineAchievements(type, user.progress);
    achievements.sort((a, b) => b.criterion - a.criterion);

    const bestAchievement = achievements[0];
    if (!bestAchievement) {
      return res.status(404).send("Best achievement not found");
    }

    res.send(bestAchievement);
  } catch (error) {
    console.error("Error fetching best achievement:", error);
    res.status(500).send("Internal server error");
  }
});

router.get("/next-achievement/:type", async (req, res) => {
  try {
    const userId = req.user._id;
    const { type } = req.params;

    const user = await User.findById(userId).exec();
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Assuming progress is an array of objects with the relevant progress info
    const currentProgress = await getCompletedCoursesCount(user.progress);

    const x = await Achievement.findOne({});
    // Find the next achievement
    const nextAchievement = await Achievement.findOne({
      type,
      criterion: { $gt: currentProgress },
    })
      .sort({ criterion: 1 })
      .exec();

    res.send(nextAchievement);
  } catch (error) {
    console.error("Error fetching next achievement:", error);
    res.status(500).send("Internal server error");
  }
});

router.get("/user-progress", async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).exec();
    if (!user) {
      return res.status(404).send("User not found");
    }

    const contentsViewed = user.progress.reduce(
      (sum, p) => sum + p.maxContentViewed,
      0
    );
    const quizzesCompleted = user.progress.reduce(
      (sum, p) => sum + p.maxQuizCompleted,
      0
    );
    const completedCourses = await getCompletedCoursesCount(user.progress);

    res.send({ contentsViewed, quizzesCompleted, completedCourses });
  } catch (error) {
    console.error("Error fetching user progress:", error);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
