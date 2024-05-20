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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await AuthService.fetchUserData();
        localStorage.setItem("user", JSON.stringify(response.data));
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    fetchUserData();

    // Fetch theme data from your service
    CourseService.getCourseTheme()
      .then((response) => {
        setThemeData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching theme data: ", error);
      });
  }, []);

  const getProgress = async (ch) => {
    try {
      const response = await CourseService.getProgress(ch);
      return response.data;
    } catch (error) {
      console.error(`Error fetching progress data for chapter ${ch}: `, error);
      return null;
    }
  };

  const handleLinkClick = async (theme) => {
    let sec, no;
    const maxContent = (await CourseService.getCourseContentLength(theme.ch))
      .data.length;
    const maxQuiz = (await CourseService.getCourseQuizLength(theme.ch)).data
      .length;
    // Check progress only when the link is clicked
    const progress = await getProgress(theme.ch);
    if (progress.maxContentViewed !== maxContent) {
      sec = "content";
      no = progress.maxContentViewed + 1;
    } else if (
      progress.maxQuizViewed !== maxQuiz ||
      (progress.maxContentViewed === maxContent && progress.maxQuizViewed === 0)
    ) {
      sec = "quiz";
      no = progress.maxQuizViewed + 1;
    } else {
      sec = "content";
      no = 1;
    }

    // Navigate to the appropriate link
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
            {themeData.map((theme) => (
              <div key={theme.ch}>
                <Link
                  to="#"
                  className="nav-link vertical-btn"
                  onClick={() => handleLinkClick(theme)}
                >
                  {theme.theme}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseComponent;
