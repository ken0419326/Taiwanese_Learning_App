import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import CourseService from "../services/course.service";
import "../styles/course-style.css";

const CourseComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const handleTakeToLogin = () => {
    navigate("/login");
  };

  const [themeData, setThemeData] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [contentLengths, setContentLengths] = useState({});
  const [quizLengths, setQuizLengths] = useState({});
  const [recommendedCourse, setRecommendedCourse] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await AuthService.fetchUserData();
        localStorage.setItem("user", JSON.stringify(response.data));
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    const fetchThemeData = async () => {
      try {
        const response = await CourseService.getCourseTheme();
        setThemeData(response.data);
      } catch (error) {
        console.error("Error fetching theme data: ", error);
      }
    };

    fetchUserData();
    fetchThemeData();
  }, []);

  useEffect(() => {
    const fetchProgressAndLengths = async () => {
      const progressPromises = themeData.map((theme) =>
        CourseService.getProgress(theme.ch).then((res) => res.data)
      );
      const contentLengthPromises = themeData.map((theme) =>
        CourseService.getCourseContentLength(theme.ch).then(
          (res) => res.data.length
        )
      );
      const quizLengthPromises = themeData.map((theme) =>
        CourseService.getCourseQuizLength(theme.ch).then(
          (res) => res.data.length
        )
      );

      const progressResults = await Promise.all(progressPromises);
      const contentLengthResults = await Promise.all(contentLengthPromises);
      const quizLengthResults = await Promise.all(quizLengthPromises);

      const progressData = {};
      const contentLengths = {};
      const quizLengths = {};

      themeData.forEach((theme, index) => {
        progressData[theme.ch] = progressResults[index];
        contentLengths[theme.ch] = contentLengthResults[index];
        quizLengths[theme.ch] = quizLengthResults[index];
      });

      setProgressData(progressData);
      setContentLengths(contentLengths);
      setQuizLengths(quizLengths);

      // Determine the recommended course
      let recommended = null;

      const unfinishedCourses = themeData
        .map((theme) => {
          const progress = progressData[theme.ch] || {
            maxQuizCompleted: 0,
            lastViewed: null,
          };
          const quizLength = quizLengths[theme.ch] || 0;

          return {
            theme,
            progress,
            quizLength,
          };
        })
        .filter(
          ({ progress, quizLength }) =>
            progress.maxContentViewed != 0 &&
            progress.maxQuizCompleted < quizLength
        )
        .sort(
          (a, b) =>
            new Date(b.progress.lastViewed) - new Date(a.progress.lastViewed)
        );

      if (unfinishedCourses.length > 0) {
        recommended = unfinishedCourses[0].theme;
      } else {
        // If no unfinished courses, recommend the not-started (progress.maxContentViewed == 0) course with the smallest ch number
        const notStartedCourses = themeData.filter((theme) => {
          const progress = progressData[theme.ch] || { maxContentViewed: 0 };
          return progress.maxContentViewed === 0;
        });

        recommended =
          notStartedCourses.sort((a, b) => a.ch - b.ch)[0] ||
          themeData.sort((a, b) => a.ch - b.ch)[0];
      }

      setRecommendedCourse(recommended);
    };

    if (themeData.length > 0) {
      fetchProgressAndLengths();
    }
  }, [themeData]);

  const handleLinkClick = async (theme) => {
    let sec, no;
    const maxContent = contentLengths[theme.ch];
    const maxQuiz = quizLengths[theme.ch];
    const progress = progressData[theme.ch];

    if (progress.maxContentViewed !== maxContent) {
      sec = "content";
      no = progress.maxContentViewed + 1;
    } else if (
      progress.maxQuizCompleted !== maxQuiz ||
      (progress.maxContentViewed === maxContent &&
        progress.maxQuizCompleted === 0)
    ) {
      sec = "quiz";
      no = progress.maxQuizCompleted + 1;
    } else {
      sec = "content";
      no = 1;
    }
    navigate(`/course/${sec}/${theme.ch}/${no}`);
  };

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>愛先登入才看會到課程喔！</p>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleTakeToLogin}
          >
            來去登入
          </button>
        </div>
      )}

      {currentUser && (
        <div>
          <div className="button-container">
            {currentUser && recommendedCourse && (
              <div className="welcome">
                <div className="welcome-msg">
                  <h2>歡迎轉來！</h2>
                  <p>咱來位上尾一擺猶未完成的開始！</p>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => handleLinkClick(recommendedCourse)}
                >
                  對　{recommendedCourse.theme}　開始
                </button>
              </div>
            )}
            {themeData.map((theme) => {
              const progress = progressData[theme.ch] || {};
              const maxCourseViewed = progress.maxContentViewed || 0;
              const maxQuizCompleted = progress.maxQuizCompleted || 0;
              const courseContentLength = contentLengths[theme.ch] || 0;
              const courseQuizLength = quizLengths[theme.ch] || 0;

              const isComplete =
                maxCourseViewed + maxQuizCompleted ===
                courseContentLength + courseQuizLength;

              return (
                <div key={theme.ch}>
                  <button
                    className="nav-link vertical-btn"
                    style={{ backgroundColor: isComplete ? "#888" : "#555" }}
                    onClick={() => handleLinkClick(theme)}
                  >
                    {theme.theme}
                    {"　"}
                    {`${maxCourseViewed + maxQuizCompleted}/${
                      courseContentLength + courseQuizLength
                    }`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseComponent;
