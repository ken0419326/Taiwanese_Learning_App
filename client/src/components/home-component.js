import React from "react";

const HomeComponent = () => {
  return (
    <main>
      <div className="container py-4">
        <div className="p-5 mb-4 bg-light rounded-3">
          <div className="container-fluid py-5">
            <h1 className="display-5 fw-bold">學臺文</h1>
            <p className="col-md-8 fs-4">
              這是一款專為學習臺文而設計的應用程式，透過豐富的學習資源和互動功能，讓您學習從拼音和詞彙到日常對話和文化常識的各個面向。立即使用學臺文，開始您的臺語學習之旅吧！
            </p>
          </div>
        </div>

        <div className="row align-items-md-stretch">
          <div className="col-md-6">
            <div className="h-100 p-5 text-white bg-dark rounded-3">
              <h2>簡單上手</h2>
              <p>
                「課程頁面」例句中不懂的臺文漢字隨選隨查，自行為教材內容新增標籤，並在「我的收藏」一覽蒐集的卡片！
              </p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="h-100 p-5 bg-light border rounded-3">
              <h2>輔助學習的好幫手</h2>
              <p>
                在「自我挑戰」嘗試記憶加入「我的收藏」的教材內容，選擇「著閣複習」就可以在短時間內提高遇見該卡片的頻率！
              </p>
            </div>
          </div>
        </div>

        <footer className="pt-3 mt-4 text-muted border-top">
          &copy; Ohtaibun 2024
        </footer>
      </div>
    </main>
  );
};

export default HomeComponent;
