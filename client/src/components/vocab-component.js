import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import CourseService from "../services/course.service";
import VocabService from "../services/vocab.service";
import "../styles/vocab-style.css";

const VocabComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const handleTakeToLogin = () => {
    navigate("/login");
  };

  const [tagsData, setTagsData] = useState([]);
  useEffect(() => {
    // Fetch theme data from your service
    VocabService.getVocabTags()
      .then((response) => {
        setTagsData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tags data: ", error);
      });
  }, []);

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>愛先登入才看會到卡片喔！</p>
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
            {tagsData.map((tag) => (
              <Link
                to={`/vocab/${tag}`}
                className="nav-link vertical-btn"
                key={tag}
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VocabComponent;
