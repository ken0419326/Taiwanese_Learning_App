import React from "react";
// import { useNavigate } from "react-router-dom";

const HomeComponent = () => {
  // const Navigate = useNavigate();
  return (
    <main>
      <div className="container py-4">
        <div className="p-5 mb-4 bg-light rounded-3">
          <div className="container-fluid py-5">
            <h1 className="display-5 fw-bold">學臺文</h1>
            <p className="col-md-8 fs-4">
              這是一款專為學習臺文而設計的應用程式，透過豐富的學習資源和互動功能，讓您學習從拼音和詞彙到日常對話和文化常識的各個面向。立即使用學臺文，開始您的臺語學習之旅吧！
            </p>
            {/* <button
              className="btn btn-primary btn-lg"
              type="button"
              onClick={Navigate(`/login`)}
            >
              這馬就試看覓！
            </button> */}
          </div>
        </div>

        <footer className="pt-3 mt-4 text-muted border-top">
          &copy; EatTheBugs 2024
        </footer>
      </div>
    </main>
  );
};

export default HomeComponent;
