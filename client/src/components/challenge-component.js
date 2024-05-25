import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course.service";
import KautianService from "../services/kautian.service";
import "../styles/challenge-style.css";

const ChallengeComponent = ({ currentUser, setCurrentUser }) => {
  const [flashcardsData, setFlashcardsData] = useState([
    {
      front: "點擊空白鍵或是字卡可以翻頁",
      back: "左右鍵可以用來表示單字的熟悉與否<br/>準備開始囉！",
    },
    { front: "第一個單字", back: "First Word" },
    { front: "第二個單字", back: "Second Word" },
    { front: "第三個單字", back: "Third Word" },
    {
      front: "伊上愛食炕肉。",
      back: "伊上愛食炕肉。\n I sion̄g ài tsia̍h khoǹg-bah. \n 他最喜歡吃炕肉。 ",
    },
    {
      front: "多謝你！",
      back: "多謝你！\nTo-siā--lí! \n 謝謝你！ ",
    },
    {
      front: "按呢好！",
      back: "按呢好！\nÁn-ne hó! \n這樣好！ ",
    },
    {
      front: "我伨你。",
      back: "我伨你。\nGuá-thīn--lí!\n 我支持你。 ",
    },
    {
      front: "你講啥？",
      back: "你講啥？\nLí końg siánn?\n 你說什麼？ ",
    },
    {
      front: "著來呢！",
      back: "著來呢！\nTio̍h lâi--neh! \n 要來喔！ ",
    },
    {
      front: "最後一頁",
      back: "最後背面",
    },
    // 添加更多的單字卡數據
  ]);

  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [position, setPosition] = useState("top"); //top or bottom or
  const [animationClass, setAnimationClass] = useState(""); //left or right

  const [lastIndex, setLastIndex] = useState(-1);
  const [lastPosition, setLastPostion] = useState("bottom");

  const [lastAnimation, setLastAnimation] = useState(""); // 0 means currentIndex is 0;
  const [isAnimating, setIsAnimating] = useState(false);

  const [flippedCards, setFlippedCards] = useState("");

  //for logic
  const [familiar, setFamiliar] = useState([]);
  const [unfamiliar, setUnfamiliar] = useState([]);
  const [unfamiliarIndex, setUnfamiliarIndex] = useState(0);
  const [round, setRound] = useState(0);
  const [upLimit, setUpLimit] = useState(0);

  const [buttonsDisabled, setButtonsDisabled] = useState(true);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (isAnimating) return;
      if (event.key === " ") {
        flipCard(currentIndex);
      } else if (event.key === "ArrowLeft") {
        // Handle left arrow key press
        handleLeft();
      } else if (event.key === "ArrowRight") {
        // Handle right arrow key press
        handleRight();
      } else if (event.key === "ArrowUp") {
        // Handle up arrow key press
        handleUp();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [
    currentIndex,
    isAnimating,
    flippedCards,
    flashcardsData,
    buttonsDisabled,
  ]);

  const handleTakeToLogin = () => {
    navigate("/login");
  };

  const flipCard = (index) => {
    setFlippedCards(flippedCards === "flipped" ? "" : "flipped");

    if (flippedCards === "flipped") {
      setButtonsDisabled(true);
    } else {
      setButtonsDisabled(false);
    }
  };

  const cards = document.querySelectorAll(".flashcard");

  const handleLeft = async (event) => {
    if (
      isAnimating ||
      currentIndex >= flashcardsData.length - 1 ||
      flippedCards == "" ||
      currentIndex === 0
    )
      return;

    setIsAnimating(true);

    setAnimationClass("discard-left");
    console.log("discard-left here");

    if (round % 3 == 1 && unfamiliarIndex <= unfamiliar.length - 1) {
      // Insert new unfamiliar card to flashcard
      setFlashcardsData([
        ...flashcardsData.slice(0, currentIndex + 1), //insert spot
        unfamiliar[unfamiliarIndex],
        ...flashcardsData.slice(currentIndex + 1),
      ]);
      setUnfamiliarIndex(unfamiliarIndex + 1);
      console.log("here is the logic");
    }

    setUnfamiliar(unfamiliar.concat(flashcardsData[currentIndex]));
    console.log("unfamiliar is", unfamiliar);
    setRound(round + 1);
    console.log("round is ", round);

    await new Promise((resolve) => setTimeout(resolve, 700));

    setAnimationClass("");
    setFlippedCards("");

    if (currentIndex > 1) {
      setUpLimit(currentIndex - 2);
    }
    setCurrentIndex(currentIndex + 1);
    setLastIndex(currentIndex);
    setLastPostion("buttom");

    setIsAnimating(false);
    if (flippedCards == "") {
      setButtonsDisabled(false);
    } else {
      setButtonsDisabled(true);
    }

    document.body.focus();
  };

  const handleRight = async (event) => {
    if (
      isAnimating ||
      currentIndex >= flashcardsData.length - 1 ||
      flippedCards == ""
    )
      return;

    setIsAnimating(true);
    setAnimationClass("discard-right");

    if (round % 3 == 1 && unfamiliarIndex <= unfamiliar.length - 1) {
      //Insert new unfamiliar card to flashcard
      setFlashcardsData([
        ...flashcardsData.slice(0, currentIndex + 1), //insert spot
        unfamiliar[unfamiliarIndex],
        ...flashcardsData.slice(currentIndex + 1),
      ]);
      setUnfamiliarIndex(unfamiliarIndex + 1);
      console.log("here is the logic");
    }

    setRound(round + 1);
    console.log("round is ", round);

    await new Promise((resolve) => setTimeout(resolve, 700));
    setAnimationClass("");
    setFlippedCards("");

    if (currentIndex > 1) {
      setUpLimit(currentIndex - 2);
    }
    setCurrentIndex(currentIndex + 1);
    setLastIndex(currentIndex);
    setLastPostion("buttom");

    setIsAnimating(false);
    if (flippedCards == "") {
      setButtonsDisabled(false);
    } else {
      setButtonsDisabled(true);
    }
    document.body.focus();
  };

  const handleUp = async () => {
    if (currentIndex <= upLimit || isAnimating) {
      return;
    }
    setFlippedCards("");

    setLastAnimation("last");

    if (currentIndex >= 0) {
      await new Promise((resolve) => setTimeout(resolve, 700));
      setLastAnimation("");

      setPosition("");

      setPosition("next");

      cards[lastIndex].style.transform = "translate(-300px, 0)";

      setLastAnimation("lastAnimation");
      setLastPostion("top");

      await new Promise((resolve) => setTimeout(resolve, 700));
      setLastAnimation("");
      setCurrentIndex(lastIndex);
      setPosition("top");

      cards[lastIndex].style.transform = "translate(0, 0)";

      if (lastIndex >= 0) {
        setLastIndex(lastIndex - 1);
        setLastPostion("buttom");
      }
    }

    setIsAnimating(false);
  };

  const renderFlashcard = () => {
    return flashcardsData.map((data, index) => (
      <div
        className={`flashcard 
        ${index === lastIndex ? lastPosition : ""} 
        ${index === lastIndex ? lastAnimation : ""} 

        ${index === currentIndex ? position : ""} 
        ${index === currentIndex ? flippedCards : ""} 
        ${index === currentIndex ? animationClass : ""}
        ${index === currentIndex + 1 ? "next" : ""} 
        `}
        key={index}
        id={`flashcard-${index}`}
      >
        <h2 className="reword"></h2>
        <div className="front" onClick={() => flipCard(index)}>
          <i className="icon fa-solid fa-play"></i>
          {data.front}
        </div>
        <div
          className="back"
          onClick={() => flipCard(index)}
          style={{ whiteSpace: "pre-wrap" }}
        >
          {data.back}
        </div>
      </div>
    ));
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
          <div className="main">
            <h2>題目</h2>

            <div className="flashcard-container " id="flashcard-container">
              {renderFlashcard(currentIndex)}
            </div>
          </div>

          <footer>
            <button className="footer-button" id="arrow-up" onClick={handleUp}>
              轉頂一條<i className="fa-solid fa-arrow-up"></i>
            </button>

            <button
              className="footer-button"
              id="arrow-left"
              disabled={buttonsDisabled}
              onClick={handleLeft}
            >
              著閣複習<i className="fa-solid fa-arrow-left"></i>
            </button>
            <button
              className="footer-button"
              id="arrow-right"
              disabled={buttonsDisabled}
              onClick={handleRight}
            >
              我會曉矣<i className="fa-solid fa-arrow-right"></i>
            </button>
          </footer>
        </div>
      )}
    </div>
  );
};

export default ChallengeComponent;
