import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import AuthService from "../services/auth.service";
import CourseService from "../services/course.service";
import KautianService from "../services/kautian.service";
import VocabService from "../services/vocab.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faX } from "@fortawesome/free-solid-svg-icons";
import "../styles/collection-style.css";

const CollectionComponent = () => {
  const { tag } = useParams();
  const [collections, setCollections] = useState([]);
  const [contentData, setContentData] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [selectedCardDetails, setSelectedCardDetails] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [note, setNote] = useState("");
  const [currentCardIndex, setCurrentCardIndex] = useState(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await AuthService.fetchUserData();
        const user = response.data.user;
        const filteredCollections = user.collections.filter((collection) =>
          collection.tags.includes(tag)
        );
        setCollections(filteredCollections);
      } catch (error) {
        console.error("Error fetching user collections:", error);
      }
    };

    fetchCollections();
  }, [tag]);

  useEffect(() => {
    const fetchContentData = async () => {
      try {
        const contentDataArray = [];
        for (const collection of collections) {
          const response = await CourseService.getCourseContent(
            collection.ch,
            collection.no
          );
          contentDataArray.push(response.data);
        }
        setContentData(contentDataArray);
        // Initialize selected card details for each card
        setSelectedCardDetails(
          contentDataArray.map(() => ({ text: "", definitions: [] }))
        );
      } catch (error) {
        console.error("Error fetching content data: ", error);
      }
    };

    fetchContentData();
  }, [collections]);

  const handlePlayAudio = (audioElement) => {
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

  const handleTextSelection = async (index) => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    if (text) {
      setSelectedText(text);
      try {
        const response = await KautianService.getVocab(text);
        const definitions = response.data;
        const updatedSelectedCardDetails = [...selectedCardDetails];
        updatedSelectedCardDetails[index] = {
          text: text,
          definitions: definitions,
        };
        setSelectedCardDetails(updatedSelectedCardDetails);
      } catch (error) {
        console.error("Error fetching definition: ", error);
      }
    }
  };

  const handleEditNote = (index) => {
    setCurrentCardIndex(index);
    setNote(collections[index]?.note || ""); // Ensure note is an empty string if undefined
    setShowModal(true);
  };

  const handleRemoveTag = async (index, tag) => {
    const updatedCollections = [...collections];
    const collection = updatedCollections[index];

    // Remove the tag from the collection
    collection.tags = collection.tags.filter((t) => t !== tag);

    try {
      // Attempt to remove the tag from the backend
      await VocabService.removeCollectionTag(collection.ch, collection.no, tag);

      // If successful, update the state to exclude the modified collection
      setCollections(updatedCollections.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error removing tag: ", error);
    }
  };

  const handleSaveNote = async () => {
    if (currentCardIndex !== null) {
      try {
        const updatedCollections = [...collections];
        updatedCollections[currentCardIndex].note = note;
        setCollections(updatedCollections);
        await VocabService.setCollectionNote(
          collections[currentCardIndex].ch,
          collections[currentCardIndex].no,
          note
        );
      } catch (error) {
        console.error("Error saving note: ", error);
      }
    }
    setShowModal(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveNote();
    }
  };

  return (
    <div className="card-container">
      {contentData.map((content, index) => (
        <div key={index} className="card">
          <div className="card-content">
            <div className="basic">
              <audio
                id={`audio-${content.ch}-${content.no}`}
                src={content.audio}
              ></audio>
              <button
                id={`play-btn-${content.ch}-${content.no}`}
                className="play-btn"
                onClick={() =>
                  handlePlayAudio(
                    document.getElementById(`audio-${content.ch}-${content.no}`)
                  )
                }
              >
                {isPlaying ? "停止" : "放送"}
              </button>
              <div className="card-text">
                <p
                  className="hanji"
                  onMouseUp={() => handleTextSelection(index)}
                >
                  {content.hanji}
                </p>
                <p>{content.lomaji}</p>
                <p>華語：{content.mandarin}</p>
                {collections[index]?.note && (
                  <p>筆記：{collections[index].note}</p>
                )}
              </div>
              <div className="actions">
                <button
                  className="pen-btn"
                  onClick={() => handleEditNote(index)}
                >
                  <FontAwesomeIcon icon={faPen} />
                </button>
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveTag(index, tag)}
                >
                  <FontAwesomeIcon icon={faX} />
                </button>
              </div>
            </div>
            <div className="detailed">
              {selectedCardDetails[index].text && (
                <div className="selected-card-details">
                  <div className="definitions">
                    {selectedCardDetails[index].definitions.map(
                      (definition, idx) => (
                        <div key={idx} className="definition">
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
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>做筆記</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onKeyDown={handleKeyDown}>
            <Form.Control
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            取消
          </Button>
          <Button variant="primary" onClick={handleSaveNote}>
            確定
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CollectionComponent;
