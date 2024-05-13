import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course.service";
import KautianService from "../services/kautian.service";
import "../styles/challenge-style.css";

const ChallengeComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const handleTakeToLogin = () => {
    navigate("/login");
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
          <header>
            <nav>
              <a href="index.html">
                <i className="fa-solid fa-arrow-left"></i>
              </a>
              <h1>字詞挑戰</h1>
            </nav>
          </header>

          <main>
            <h2>題目</h2>
            <div className="slidecard">
              <div
                className="flashcard-container"
                id="flashcard-container"
              ></div>
            </div>
          </main>

          <footer>
            <button className="footer-button">轉頂一步</button>
            <button className="footer-button">著閣複習</button>
          </footer>
        </div>
      )}
    </div>
  );
};

export default ChallengeComponent;
