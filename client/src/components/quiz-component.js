import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import CourseService from "../services/course.service";
import "../styles/courseQuiz-style.css";

const QuizComponent = () => {
  const { ch, no } = useParams();
  const [quizData, setQuizData] = useState([]);
  const [quizLength, setQuizLength] = useState();
  const [contentLength, setContentLength] = useState();
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [buttonStyles, setButtonStyles] = useState({});
  const [status, setStatus] = useState();
  const Navigate = useNavigate();

  useEffect(() => {
    // Fetch quiz data
    CourseService.getCourseQuiz(ch, no)
      .then((response) => {
        setQuizData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching quiz data: ", error);
      });

    // Fetch content length
    CourseService.getCourseContentLength(ch)
      .then((response) => {
        setContentLength(response.data.length);
      })
      .catch((error) => {
        console.error("Error fetching content length:", error);
      });

    // Fetch quiz length
    CourseService.getCourseQuizLength(ch)
      .then((response) => {
        setQuizLength(response.data.length);
      })
      .catch((error) => {
        console.error("Error fetching quiz length:", error);
      });

    // Reset selected answer and button styles
    setSelectedAnswer(null);
    setButtonStyles({});
    setStatus("unfinished");
  }, [ch, no]);

  const handleAnswerClick = (id) => {
    const updatedStyles = { ...buttonStyles };

    // Update button styles
    if (id === quizData.ans) {
      updatedStyles[id] = { backgroundColor: "rgb(46, 204, 113)" };
      setButtonStyles(updatedStyles);
      setStatus("done");
    } else {
      updatedStyles[id] = { backgroundColor: "rgb(231, 76, 60)" };
      setButtonStyles(updatedStyles);
      // After 1000 ms, update button styles
      setTimeout(() => {
        updatedStyles[id] = {
          backgroundColor: "rgb(189, 195, 199)",
          color: "rgb(127, 140, 141)",
        };
        setButtonStyles({ ...updatedStyles }); // Update button styles after timeout
      }, 250);
    }

    // Update selected answer
    setSelectedAnswer(id);
  };

  return (
    <div>
      <div className="card-container">
        <div className="card">
          <div className="card-content">
            <p>{quizData.que}</p>
          </div>
        </div>
      </div>
      <div className="options-bar">
        <button
          id="A"
          className="option-btn"
          onClick={() => handleAnswerClick("A")}
          style={buttonStyles["A"]}
          disabled={status === "done" && selectedAnswer !== "A"}
        >
          A. {quizData.A}
        </button>
        <button
          id="B"
          className="option-btn"
          onClick={() => handleAnswerClick("B")}
          style={buttonStyles["B"]}
          disabled={status === "done" && selectedAnswer !== "B"}
        >
          B. {quizData.B}
        </button>
        <button
          id="C"
          className="option-btn"
          onClick={() => handleAnswerClick("C")}
          style={buttonStyles["C"]}
          disabled={status === "done" && selectedAnswer !== "C"}
        >
          C. {quizData.C}
        </button>
        <button
          id="D"
          className="option-btn"
          onClick={() => handleAnswerClick("D")}
          style={buttonStyles["D"]}
          disabled={status === "done" && selectedAnswer !== "D"}
        >
          D. {quizData.D}
        </button>
        {no != 1 && (
          <Link
            to={`/course/quiz/${ch}/${parseInt(no) - 1}`}
            id="previous-btn"
            className="nav-link previous-btn"
          >
            頂一个
          </Link>
        )}
        {status === "done" && no != quizLength && (
          <Link
            to={`/course/quiz/${ch}/${parseInt(no) + 1}`}
            id="next-btn"
            className="nav-link next-btn"
          >
            後一个
          </Link>
        )}
        {no == 1 && (
          <Link
            to={`/course/content/${ch}/${contentLength}`}
            id="leave-test-btn"
            className="nav-link leave-test-btn"
          >
            轉去課文
          </Link>
        )}
        {status === "done" && no == quizLength && (
          <button
            className="nav-link next-btn"
            onClick={() => {
              alert(`恭喜完成第 ${ch} 單元！`);
              Navigate(`/course`);
            }}
          >
            完成！
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizComponent;
