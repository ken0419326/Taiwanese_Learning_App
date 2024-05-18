import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import CourseService from "../services/course.service";
import KautianService from "../services/kautian.service";
import ForbiddenPageService from "../services/forbiddenPage.service";
import axios from "axios";
import "../styles/courseContent-style.css";

const ContentComponent = () => {
  const { ch, no } = useParams();
  const Navigate = useNavigate();

  const [contentData, setContentData] = useState([]);
  const [audioElement, setAudioElement] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [contentLength, setContentLength] = useState();
  const [selectedText, setSelectedText] = useState("");
  const [definitions, setDefinitions] = useState([]);
  const alertShownRef = useRef(false);

  CourseService.getCourseContentLength(ch)
    .then((response) => {
      setContentLength(response.data.length);
    })
    .catch((error) => {
      console.error("Error fetching content length:", error);
    });

  useEffect(() => {
    const interceptorObject = ForbiddenPageService.startInterceptor();
    // Handle interceptor errors by updating errorMessage state
    const handleError = (error) => {
      if (!alertShownRef.current) {
        alertShownRef.current = true;
        window.alert(error);
        Navigate(-1);
      }
    };
    // Attach the handleError function as an error callback for the interceptor
    interceptorObject.interceptor = axios.interceptors.response.use(
      (response) => response,
      handleError
    );

    CourseService.getCourseContent(ch, no)
      .then((response) => {
        setContentData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching content data: ", error);
      });

    const audio = document.getElementById("audio");
    setAudioElement(audio);
    audio.addEventListener("ended", handleAudioEnded);
    setIsPlaying(false);
    setSelectedText("");
    setDefinitions([]);

    return () => {
      axios.interceptors.response.eject(interceptorObject.interceptor);

      if (audio) {
        audio.removeEventListener("ended", handleAudioEnded);
        audio.pause();
      }
    };
  }, [ch, no]);

  const handlePlayAudio = () => {
    if (audioElement) {
      if (!isPlaying) {
        audioElement.currentTime = 0;
        const playPromise = audioElement.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((error) => {
              console.error("Error playing audio: ", error);
            });
        }
      } else {
        audioElement.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    if (text) {
      setSelectedText(text);
      KautianService.getVocab(text)
        .then((response) => {
          setDefinitions(response.data);
        })
        .catch((error) => {
          console.error("Error fetching definition: ", error);
        });
    }
  };

  // const handleOutsideClick = () => {
  //   setSelectedText("");
  //   setDefinitions([]);
  // };

  return (
    <div>
      <div id="card-container" className="card-container">
        <div className="card">
          <div className="card-content">
            <div className="basic">
              <audio id="audio" src={contentData.audio}></audio>
              <button
                id="play-btn"
                className="play-btn"
                onClick={handlePlayAudio}
              >
                {isPlaying ? "停止" : "放送"}
              </button>
              <div className="card-text">
                <p className="hanji" onMouseUp={handleTextSelection}>
                  {contentData.hanji}
                </p>
                <p>{contentData.lomaji}</p>
                <p>華語：{contentData.mandarin}</p>
              </div>
            </div>
            <div className="detailed">
              {definitions.map((definition, index) => (
                <div key={index} className="definition">
                  {definition.vocab && (
                    <strong>
                      {definition.vocab.hanji} {definition.vocab.lomaji}
                    </strong>
                  )}
                  {definition.semantics &&
                    definition.semantics.map((sem, semIndex) => (
                      <div key={semIndex}>
                        {sem.pos && sem.explanation && (
                          <p>
                            【{sem.pos}】{sem.explanation}
                          </p>
                        )}
                        {sem.sentences &&
                          sem.sentences.map((sentence, sentIndex) => (
                            <p key={sentIndex}>
                              例：{sentence.hanji} {sentence.lomaji}
                            </p>
                          ))}
                      </div>
                    ))}
                </div>
              ))}
            </div>

            {!(no == 1) && (
              <Link
                to={`/course/content/${ch}/${parseInt(no) - 1}`}
                id="previous-btn"
                className="nav-link previous-btn"
              >
                頂一个
              </Link>
            )}
            {!(no == contentLength) && (
              <Link
                to={`/course/content/${ch}/${parseInt(no) + 1}`}
                id="next-btn"
                className="nav-link next-btn"
              >
                後一个
              </Link>
            )}
            {no == contentLength && (
              <Link
                to={`/course/quiz/${ch}/1`}
                id="enter-test-btn"
                className="nav-link enter-test-btn"
              >
                試看覓咧
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentComponent;
