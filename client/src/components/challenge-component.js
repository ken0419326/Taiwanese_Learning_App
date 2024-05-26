import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChallengeService from "../services/challenge.service";
import "../styles/challenge-style.css";

const ChallengeComponent = ({ currentUser, setCurrentUser }) => {
  const [flashcardsData, setFlashcardsData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [position, setPosition] = useState("top");
  const [animationClass, setAnimationClass] = useState("");
  const [lastIndex, setLastIndex] = useState(-1);
  const [lastPosition, setLastPosition] = useState("bottom");
  const [lastAnimation, setLastAnimation] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [flippedCards, setFlippedCards] = useState("");
  const [unfamiliar, setUnfamiliar] = useState([]);
  const [cardsDisplayed, setCardsDisplayed] = useState(0);

  const [round, setRound] = useState(0);
  const [upLimit, setUpLimit] = useState(0);
  const [returnDisabled, setReturnDisabled] = useState(true);
  const [buttonsDisabled, setButtonsDisabled] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserCollections();
  }, [currentUser]);

  const fetchUserCollections = async () => {
    try {
      const response = await ChallengeService.getUserCollections();
      const collections = response.data;
      if (collections) {
        const flashcards = await Promise.all(
          collections.map(async ({ ch, no }) => {
            const response = await ChallengeService.getCardData(ch, no);
            const { hanji, lomaji, mandarin, audio } = response.data;
            const noteResponse = await ChallengeService.getNote(ch, no);
            const note = noteResponse.data;
            return {
              front: `「${mandarin}」的臺語是啥物？`,
              back: `${hanji}\n${lomaji}\n華語：${mandarin}${
                note ? `\n筆記：${note}` : ""
              }`,
              audio,
            };
          })
        );
        setFlashcardsData(flashcards);
      }
    } catch (error) {
      console.error("Error fetching user collections: ", error);
    }
  };

  const handlePlayAudio = (audioUrl, e) => {
    e.stopPropagation();
    const audioElement = new Audio(audioUrl);
    audioElement.play();

    document.activeElement.blur();
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (isAnimating) return;
      if (event.key === " ") {
        flipCard();
        renderFooter();
      } else if (event.key === "ArrowLeft") {
        handleLeft();
      } else if (event.key === "ArrowRight") {
        handleRight();
      } else if (event.key === "ArrowUp") {
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

  const flipCard = () => {
    setFlippedCards(flippedCards === "flipped" ? "" : "flipped");
    setButtonsDisabled(flippedCards === "flipped");
  };

  const handleLeft = async () => {
    if (isAnimating || flippedCards === "") return;

    setIsAnimating(true);
    setAnimationClass("discard-left");

    let nextIndex = (currentIndex + 1) % flashcardsData.length;

    if (cardsDisplayed >= 3 && unfamiliar.length > 0) {
      // Show the first unfamiliar card
      const unfamiliarCard = unfamiliar[0];
      setFlashcardsData((prevData) => [
        ...prevData.slice(0, nextIndex),
        unfamiliarCard,
        ...prevData.slice(nextIndex),
      ]);
      setUnfamiliar((prevUnfamiliar) => prevUnfamiliar.slice(1)); // Remove the shown unfamiliar card
      setCardsDisplayed(0); // Reset the counter
    } else {
      setCardsDisplayed(cardsDisplayed + 1);
    }

    setUnfamiliar([...unfamiliar, flashcardsData[currentIndex]]);
    setRound(round + 1);

    await new Promise((resolve) => setTimeout(resolve, 700));
    setAnimationClass("");
    setFlippedCards("");

    nextIndex = (currentIndex + 1) % flashcardsData.length;

    setCurrentIndex(nextIndex);
    setLastIndex(currentIndex);
    setLastPosition("bottom");
    setIsAnimating(false);
    setReturnDisabled(false);
    setButtonsDisabled(true);
  };

  const handleRight = async () => {
    if (isAnimating || flippedCards === "") return;

    setIsAnimating(true);
    setAnimationClass("discard-right");

    let nextIndex = (currentIndex + 1) % flashcardsData.length;

    if (cardsDisplayed >= 3 && unfamiliar.length > 0) {
      // Show the first unfamiliar card
      const unfamiliarCard = unfamiliar[0];
      setFlashcardsData((prevData) => [
        ...prevData.slice(0, nextIndex),
        unfamiliarCard,
        ...prevData.slice(nextIndex),
      ]);
      setUnfamiliar((prevUnfamiliar) => prevUnfamiliar.slice(1)); // Remove the shown unfamiliar card
      setCardsDisplayed(0); // Reset the counter
    } else {
      setCardsDisplayed(cardsDisplayed + 1);
    }

    setRound(round + 1);

    await new Promise((resolve) => setTimeout(resolve, 700));
    setAnimationClass("");
    setFlippedCards("");

    nextIndex = (currentIndex + 1) % flashcardsData.length;

    setCurrentIndex(nextIndex);
    setLastIndex(currentIndex);
    setLastPosition("bottom");
    setIsAnimating(false);
    setReturnDisabled(false);
    setButtonsDisabled(true);
  };

  const handleUp = async () => {
    if (currentIndex <= upLimit + 1) {
      setReturnDisabled(true);
    }
    if (currentIndex <= upLimit || isAnimating) return;

    setFlippedCards("");
    setLastAnimation("last");

    if (currentIndex >= 0) {
      await new Promise((resolve) => setTimeout(resolve, 700));
      setLastAnimation("");
      setPosition("next");

      const cards = document.querySelectorAll(".flashcard");
      cards[lastIndex].style.transform = "translate(-300px, 0)";

      setLastAnimation("lastAnimation");
      setLastPosition("top");

      await new Promise((resolve) => setTimeout(resolve, 700));
      setLastAnimation("");
      setCurrentIndex(lastIndex);
      setPosition("top");

      cards[lastIndex].style.transform = "translate(0, 0)";
      setLastIndex(lastIndex >= 0 ? lastIndex - 1 : -1);
      setLastPosition("bottom");
    }

    setIsAnimating(false);
    setButtonsDisabled(true);
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
        ${index === currentIndex + 1 ? "next" : ""}`}
        key={index}
        id={`flashcard-${index}`}
      >
        <div className="front" onClick={flipCard}>
          {data.front}
        </div>
        <div
          className="back"
          style={{ whiteSpace: "pre-wrap" }}
          onClick={flipCard}
        >
          <button
            id="play-btn"
            className="play-btn"
            onClick={(event) => handlePlayAudio(data.audio, event)}
          >
            放送
          </button>
          <p>{data.back}</p>
        </div>
      </div>
    ));
  };

  const renderFooter = () => {
    return (
      <footer>
        <button
          className="footer-button"
          id="arrow-up"
          onClick={handleUp}
          disabled={returnDisabled}
          style={{ backgroundColor: returnDisabled ? "#777" : "#333" }}
        >
          轉頂一條<i className="fa-solid fa-arrow-up"></i>
        </button>
        <button
          className="footer-button"
          id="arrow-left"
          disabled={buttonsDisabled}
          onClick={handleLeft}
          style={{ backgroundColor: buttonsDisabled ? "#777" : "#333" }}
        >
          著閣複習<i className="fa-solid fa-arrow-left"></i>
        </button>
        <button
          className="footer-button"
          id="arrow-right"
          disabled={buttonsDisabled}
          onClick={handleRight}
          style={{ backgroundColor: buttonsDisabled ? "#777" : "#333" }}
        >
          我會曉矣<i className="fa-solid fa-arrow-right"></i>
        </button>
      </footer>
    );
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
      {currentUser && flashcardsData.length > 0 && (
        <>
          {flashcardsData.length < 5 ? (
            <div>
              <h2>這馬收藏的卡片猶傷少，無法度挑戰喔！</h2>
            </div>
          ) : (
            <div>
              <div className="main">
                <h2>
                  {flippedCards === "" ? "題目" : "解答"}
                  <a
                    className="d-inline-block"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="Space = 反頁，↑ = 轉頂一頁，← = 著閣複習，→ = 我會曉矣。"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-question-circle"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                      <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94" />
                    </svg>
                  </a>
                </h2>
                <p className="hint">
                  共卡片點落起抑是揤 space 著會當看
                  {flippedCards === "" ? "解答" : "題目"}！
                </p>
                <div className="flashcard-container" id="flashcard-container">
                  {renderFlashcard()}
                </div>
              </div>
              {renderFooter()}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ChallengeComponent;
