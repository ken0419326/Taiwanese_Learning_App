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
  const Navigate = useNavigate();

  const [contentData, setContentData] = useState([]);
  const [audioElement, setAudioElement] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [contentLength, setContentLength] = useState();
  const [selectedText, setSelectedText] = useState("");
  const [definitions, setDefinitions] = useState([]);
  const alertShownRef = useRef(false);

  const [show, setShow] = useState(false);
  const [allTags, setAllTags] = useState();
  const [currentTags, setCurrentTags] = useState();
  const [availableTags, setAvailableTags] = useState();
  const [newTags, setNewTags] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

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
      setCurrentTags([...new Set([...currentTags, ...newTagsArray])]);
      setNewTags("");
      e.preventDefault(); // Prevent form submission or other default behavior
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

              <>
                <Button className="add-btn" onClick={handleShow}>
                  +
                </Button>

                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>增添標籤</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <Form.Group controlId="formTag">
                        <p className="modal-p">創建新的標籤</p>
                        <Form.Control
                          type="text"
                          placeholder="Type your new tag here"
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
                    <p className="modal-p">其他標籤</p>
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
                      確定
                    </Button>
                  </Modal.Footer>
                </Modal>
              </>
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
