import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import VocabService from "../services/vocab.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTimes } from "@fortawesome/free-solid-svg-icons";
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

  const handleTagRename = (oldTag, newTag) => {
    VocabService.renameTag(oldTag, newTag)
      .then(() => {
        setTagsData(tagsData.map((tag) => (tag === oldTag ? newTag : tag)));
      })
      .catch((error) => {
        console.error("Error renaming tag: ", error);
        alert(error.response.data);
      });
  };

  const handleTagDelete = async (tagToDelete) => {
    const confirmDelete = window.confirm(`你確定要刪除 "${tagToDelete}" 嗎？`);
    if (confirmDelete) {
      try {
        await VocabService.deleteTag(tagToDelete);
        // Update the tags data in state to reflect the deletion
        setTagsData((prevTagsData) =>
          prevTagsData.filter((tag) => tag !== tagToDelete)
        );
      } catch (error) {
        console.error("Error deleting tag: ", error);
        alert("Failed to delete tag. Please try again.");
      }
    }
  };

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
              <div className="tag-container" key={tag}>
                <Link to={`/vocab/${tag}`} className="nav-link vertical-btn">
                  <div className="tag-text">{tag}</div>
                </Link>
                <div className="actions">
                  <button
                    className="pen-btn"
                    onClick={() =>
                      handleTagRename(tag, prompt("新的標籤名稱："))
                    }
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                  <button
                    className="remove-btn"
                    onClick={() => handleTagDelete(tag)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VocabComponent;
