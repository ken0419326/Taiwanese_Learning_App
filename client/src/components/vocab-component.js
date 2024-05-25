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
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await VocabService.getVocabTags();
      const tagsWithCounts = await Promise.all(
        response.data.map(async (tag) => {
          const countResponse = await VocabService.getVocabCount(tag);
          return { tag, count: countResponse.data.count };
        })
      );
      setTagsData(tagsWithCounts);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleTagRename = (oldTag, newTag) => {
    VocabService.renameTag(oldTag, newTag)
      .then(() => {
        setTagsData((prevTagsData) =>
          prevTagsData.map((tagData) =>
            tagData.tag === oldTag ? { ...tagData, tag: newTag } : tagData
          )
        );
      })
      .catch((error) => {
        console.error("Error renaming tag: ", error);
        alert(error.response.data);
      });
  };

  const handleTagDelete = async (tagToDelete) => {
    const confirmDelete = window.confirm(`你敢確定欲刪除 "${tagToDelete}"？`);
    if (confirmDelete) {
      try {
        await VocabService.deleteTag(tagToDelete);
        // Remove the tag from the tagsData state
        setTagsData((prevTagsData) =>
          prevTagsData.filter((tag) => tag.tag !== tagToDelete)
        );
      } catch (error) {
        console.error("Error deleting tag: ", error);
        alert("Failed to delete tag. Please try again.");
      }
    }
  };

  const handleRenameClick = (tag) => {
    const newTag = prompt("新的標籤名稱：", tag);
    if (newTag && newTag.trim() !== "" && newTag !== tag) {
      handleTagRename(tag, newTag);
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
            {tagsData.map((tagData, index) => (
              <div className="tag-container" key={index}>
                <Link
                  to={`/vocab/${tagData.tag}`}
                  className="nav-link vertical-btn"
                >
                  <div className="tag-text">{`${tagData.tag} (${tagData.count})`}</div>
                </Link>
                <div className="actions">
                  <button
                    className="pen-btn"
                    onClick={() => handleRenameClick(tagData.tag)}
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                  <button
                    className="remove-btn"
                    onClick={() => handleTagDelete(tagData.tag)}
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
