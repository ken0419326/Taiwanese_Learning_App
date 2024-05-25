import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button, Modal, Form, ListGroup } from "react-bootstrap";
import AuthService from "../services/auth.service";
import CourseService from "../services/course.service";
import KautianService from "../services/kautian.service";
import VocabService from "../services/vocab.service";
import ForbiddenPageService from "../services/forbiddenPage.service";
import axios from "axios";
import "../styles/courseContent-style.css";

const ContentComponent = () => {
  const { ch, no } = useParams();
  const navigate = useNavigate();

  const [contentData, setContentData] = useState([]);
  const [audioElement, setAudioElement] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [contentLength, setContentLength] = useState();
  const [selectedText, setSelectedText] = useState("");
  const [definitions, setDefinitions] = useState([]);
  const alertShownRef = useRef(false);

  const [show, setShow] = useState(false);
  const [allTags, setAllTags] = useState([]);
  const [currentTags, setCurrentTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [newTags, setNewTags] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const modalRef = useRef(null); // Add a ref for the modal

  const handleShow = () => {
    setShow(true);
    setAvailableTags(
      allTags.filter((tag) => !currentTags.includes(tag)).sort()
    );
  };

  const handleClose = () => {
    setShow(false);
    setNewTags([]);
    setSelectedTags([]);
  };

  const handleTagChange = (e) => {
    setNewTags(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && newTags.trim()) {
      const newTagsArray = newTags.trim().split(" ");
      const updatedAvailableTags = availableTags.filter(
        (tag) => !newTagsArray.includes(tag)
      );
      setCurrentTags([...new Set([...currentTags, ...newTagsArray])].sort());
      setAvailableTags(updatedAvailableTags);
      setNewTags("");
      if (e.preventDefault) {
        e.preventDefault(); // Prevent form submission or other default behavior
      }
    }
  };

  const handleAddTag = (tagToAdd) => {
    setCurrentTags([...currentTags, tagToAdd].sort());
    setAvailableTags(availableTags.filter((tag) => tag !== tagToAdd).sort());
  };

  const handleRemoveTag = (tagToRemove) => {
    setCurrentTags(currentTags.filter((tag) => tag !== tagToRemove));
    if (allTags.includes(tagToRemove)) {
      setAvailableTags([...availableTags, tagToRemove].sort());
    }
  };

  const handleSave = async () => {
    try {
      await VocabService.saveCollection(ch, no, currentTags);
      handleClose();
      const response = await AuthService.fetchUserData();
      localStorage.setItem("user", JSON.stringify(response.data));

      const user = JSON.parse(localStorage.getItem("user")).user;
      setAllTags(user.tags);
      const collection = user.collections.find(
        (collection) => collection.ch == ch && collection.no == no
      );
      setCurrentTags(collection ? collection.tags.sort() : []);
    } catch (error) {
      console.error("Error saving collection:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const interceptorObject = ForbiddenPageService.startInterceptor();
        // Handle interceptor errors by updating errorMessage state
        const handleError = (error) => {
          if (!alertShownRef.current) {
            alertShownRef.current = true;
            window.alert(error);
            navigate(-1);
          }
        };
        // Attach the handleError function as an error callback for the interceptor
        interceptorObject.interceptor = axios.interceptors.response.use(
          (response) => response,
          handleError
        );

        const contentLengthResponse =
          await CourseService.getCourseContentLength(ch);
        setContentLength(contentLengthResponse.data.length);

        const contentResponse = await CourseService.getCourseContent(ch, no);
        setContentData(contentResponse.data);

        const audio = document.getElementById("audio");
        setAudioElement(audio);
        audio.addEventListener("ended", handleAudioEnded);
        setIsPlaying(false);
        setSelectedText("");
        setDefinitions([]);

        const response = await AuthService.fetchUserData();
        localStorage.setItem("user", JSON.stringify(response.data));
        const user = JSON.parse(localStorage.getItem("user")).user;
        setAllTags(user.tags);
        const collection = user.collections.find(
          (collection) => collection.ch == ch && collection.no == no
        );
        setCurrentTags(collection ? collection.tags.sort() : []);

        return () => {
          axios.interceptors.response.eject(interceptorObject.interceptor);

          if (audio) {
            audio.removeEventListener("ended", handleAudioEnded);
            audio.pause();
          }
        };
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [ch, no]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        String(newTags).trim() &&
        modalRef.current &&
        !modalRef.current.contains(event.target)
      ) {
        handleKeyPress({ key: "Enter" });
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [newTags]);

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

              <>
                <Button className="add-btn" onClick={handleShow}>
                  +
                </Button>

                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>增添標籤</Modal.Title>
                  </Modal.Header>
                  <Modal.Body ref={modalRef}>
                    <Form>
                      <Form.Group controlId="formTag">
                        <div className="form-group">
                          <p className="modal-p">創建新的標籤 </p>

                          <a
                            className="d-inline-block"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="若有毋但一个標籤，會當用 space 分開，才揤 Enter。"
                          >
                            <div className="help"></div>
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
                        </div>
                        <Form.Control
                          type="text"
                          placeholder="新的標籤"
                          value={newTags}
                          onChange={handleTagChange}
                          onKeyPress={handleKeyPress}
                        />
                      </Form.Group>
                    </Form>
                    <p className="modal-p">屬於...</p>
                    {currentTags && (
                      <ListGroup>
                        {currentTags.map((tag, index) => (
                          <ListGroup.Item
                            key={index}
                            variant="light"
                            className="tag-item"
                          >
                            {tag}
                            <Button
                              variant="none"
                              size="sm"
                              className="remove-btn"
                              onClick={() => handleRemoveTag(tag)}
                            >
                              x
                            </Button>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    )}
                    <Form.Label>已經存在的其他標籤</Form.Label>
                    {availableTags && (
                      <ListGroup>
                        {availableTags.map((tag, index) => (
                          <ListGroup.Item
                            key={index}
                            action
                            active={selectedTags.includes(tag)}
                            onClick={() => handleAddTag(tag)}
                          >
                            {tag}
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    )}
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      取消
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                      完成
                    </Button>
                  </Modal.Footer>
                </Modal>
              </>
            </div>
            <div className="detailed">
              {definitions.map((definition, index) => (
                <div key={index} className="definition">
                  {definition.vocab && (
                    <strong style={{ fontSize: "17px" }}>
                      <br />
                      {definition.vocab.hanji} {definition.vocab.lomaji}
                    </strong>
                  )}
                  {definition.semantics &&
                    definition.semantics.map((sem, semIndex) => (
                      <div key={semIndex}>
                        {sem.pos && sem.explanation && (
                          <p style={{ marginTop: "7px" }}>
                            <strong>【{sem.pos}】</strong>
                            {sem.explanation}
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
