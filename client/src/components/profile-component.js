import { useState, useEffect } from "react";
import AuthService from "../services/auth.service";
import "../styles/profile-style.css";
import trophyImage from "../icons/trophy.jpg";
import questionImage from "../icons/question.jpg";

const ProfileComponent = ({ currentUser, setCurrentUser }) => {
  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && <div>請先登入。</div>}
      {currentUser && (
        <div>
          {/* <div className="head">
            <a href="#" onclick="history.go(-1)">
              <i className="fa-solid fa-arrow-left"></i>
            </a>
            <h1>儀表板</h1>
          </div> */}
          <div className="main">
            <h2>成就</h2>
            <div className="achievement">
              <div className="finished">
                <div className="circle">
                  <img src={trophyImage} alt="trophy" />
                </div>
                <div className="text">
                  <button
                    type="button"
                    className="btn btn-custom1"
                    data-bs-toggle="modal"
                    data-bs-target="#obtainedModal"
                  >
                    <h3>萬事起頭難</h3>
                  </button>
                  <h4>完成頭一回課程</h4>
                </div>
              </div>
              <div className="unfinished">
                <div className="circle">
                  <img src={questionImage} alt="question" />
                </div>
                <div className="text">
                  <button
                    type="button"
                    className="btn btn-custom2"
                    data-bs-toggle="modal"
                    data-bs-target="#notYetModal"
                  >
                    <h3>恭喜發財</h3>
                  </button>
                  <h4>解答五條題目</h4>
                </div>
              </div>
            </div>
            <h2>學習紀錄</h2>
            <div className="record">
              <div className="stat">
                <div className="day-number-container">
                  <div className="day">
                    <h4>一</h4>
                  </div>
                  <div className="number">
                    <h4>0</h4>
                  </div>
                </div>
                <div className="day-number-container">
                  <div className="day">
                    <h4>二</h4>
                  </div>
                  <div className="number">
                    <h4>3</h4>
                  </div>
                </div>
                <div className="day-number-container">
                  <div className="day">
                    <h4>三</h4>
                  </div>
                  <div className="number">
                    <h4>0</h4>
                  </div>
                </div>
                <div className="day-number-container">
                  <div className="day">
                    <h4>四</h4>
                  </div>
                  <div className="number">
                    <h4>2</h4>
                  </div>
                </div>
                <div className="day-number-container">
                  <div className="day">
                    <h4>五</h4>
                  </div>
                  <div className="number">
                    <h4>1</h4>
                  </div>
                </div>
                <div className="day-number-container">
                  <div className="day">
                    <h4>六</h4>
                  </div>
                  <div className="number">
                    <h4>2</h4>
                  </div>
                </div>
                <div className="day-number-container">
                  <div className="day">
                    <h4>日</h4>
                  </div>
                  <div className="number">
                    <h4>0</h4>
                  </div>
                </div>
              </div>
              <div className="pro">
                <h3>
                  你已經連紲學習
                  <span style={{ color: "#99c891" }}> 3 </span>
                  工囉！連紲學習 7 天會有新的成就喔！
                </h3>
                <div
                  className="progress"
                  role="progressbar"
                  aria-label="Basic example"
                  aria-valuenow="3"
                  aria-valuemin="0"
                  aria-valuemax="7"
                >
                  <div
                    className="progress-bar progress-bar-striped bg-success"
                    style={{ width: "42%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="modal fade"
            id="notYetModal"
            // tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">恭喜發財</h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <p>你已經解答 3 條題目矣！</p>
                  <p>閣解答 2 條題目就會當得到這號成就！</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                  >
                    確定
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            className="modal fade"
            id="obtainedModal"
            // tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">萬事起頭難</h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <p>你佇 2024/05/01 得到這號成就！</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                  >
                    確定
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

export default ProfileComponent;
