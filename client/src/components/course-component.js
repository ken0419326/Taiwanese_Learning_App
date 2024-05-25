import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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