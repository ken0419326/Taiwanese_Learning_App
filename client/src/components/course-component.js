import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import CourseService from "../services/course.service";
import "../styles/course-style.css";

const CourseComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const handleTakeToLogin = () => {
    navigate("/login");
  };

  const [themeData, setThemeData] = useState([]);
  useEffect(() => {
    // Fetch theme data from your service
    CourseService.getCourseTheme()
      .then((response) => {
        setThemeData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching theme data: ", error);
      });
  }, []);

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
              <Link
                to={`/course/content/${theme.ch}/1`}
                className="nav-link vertical-btn"
                key={theme._id}
              >
                {theme.theme}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseComponent;
