import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import KautianService from "../services/kautian.service";
import "../styles/vocab-style.css";
import $ from "jquery";

const VocabComponent = ({ currentUser, setCurrentUser }) => {
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
          <div className="main">
            <header>
              <div className="title">
                <h1>學臺文</h1>
              </div>
            </header>
            <main>
              <h2>
                <i className="fa-solid fa-tag"></i>標籤管理
              </h2>
              <div className="add">
                <button
                  id="add"
                  type="button"
                  className="btn"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                  data-bs-whatever="@mdo"
                >
                  增添
                </button>
              </div>
              <ul></ul>
            </main>
          </div>

          <div
            className="modal fade"
            id="exampleModal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">
                    增添標籤
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="mb-3">
                      <label for="tag-name" className="col-form-label">
                        標籤名稱
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="tag-name"
                      />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    關起來
                  </button>
                  <button
                    id="enter"
                    type="button"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    data-bs-whatever="@mdo"
                  >
                    增添標籤
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VocabComponent;
