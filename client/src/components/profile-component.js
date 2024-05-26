import { useState, useEffect } from "react";
import { Row, Col, Card } from "react-bootstrap";
import ProfileService from "../services/profile.service";
import "../styles/profile-style.css";

// Dynamically import all icons
const importAll = (r) => {
  let icons = {};
  r.keys().forEach((item) => {
    icons[item.replace("./", "")] = r(item);
  });
  return icons;
};

const icons = importAll(require.context("../icons", false, /\.(png|jpe?g)$/));

const ProfileComponent = ({ currentUser, setCurrentUser }) => {
  const [bestAchievement, setBestAchievement] = useState(null);
  const [icon, setIcon] = useState(null);
  const [nextAchievement, setNextAchievement] = useState(null);
  const [nextIcon, setNextIcon] = useState(null);
  const [userProgress, setUserProgress] = useState({
    contentsViewed: 0,
    quizzesCompleted: 0,
    completedCourses: 0,
  });

  useEffect(() => {
    if (currentUser) {
      ProfileService.getUserProgress()
        .then((response) => {
          setUserProgress(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user progress:", error);
        });

      fetchBestAchievement("course");
      fetchNextAchievement("course");
    }
  }, [currentUser]);

  const fetchBestAchievement = (type) => {
    ProfileService.getBestAchievement(type)
      .then((response) => {
        setBestAchievement(response.data);
        setIcon(icons[response.data.icon]);
      })
      .catch((error) => {
        console.error("Error fetching best achievement:", error);
      });
  };

  const fetchNextAchievement = (type) => {
    ProfileService.getNextAchievement(type)
      .then((response) => {
        setNextAchievement(response.data);
        setNextIcon(icons[response.data.icon]);
      })
      .catch((error) => {
        console.error("Error fetching next achievement:", error);
      });
  };

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && <div>請先登入。</div>}
      {currentUser && (
        <div>
          <div className="main">
            <h2>成就</h2>
            <div className="achievement">
              {bestAchievement && (
                <div className="finished">
                  <div className="circle">
                    <img src={icon} />
                  </div>
                  <div className="text">
                    <h3>{bestAchievement.title}</h3>
                    <h4>{`完成 ${bestAchievement.criterion} 課。`}</h4>
                  </div>
                </div>
              )}
              {nextAchievement && (
                <div className="unfinished">
                  <div className="circle">
                    <img src={nextIcon} />
                  </div>
                  <div className="text">
                    <h3>{nextAchievement.title}</h3>
                    <h4>{`完成 ${nextAchievement.criterion} 課。`}</h4>
                  </div>
                </div>
              )}
            </div>

            <h2>學習紀錄</h2>
            <Row className="justify-content-center">
              <Col xs={12} sm={6} md={4} lg={3}>
                <Card className="mb-4 text-center small-card">
                  <Card.Body>
                    <Card.Title>課程數</Card.Title>
                    <Card.Text className="large-bold-text">
                      {userProgress.completedCourses}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} sm={6} md={4} lg={3}>
                <Card className="mb-4 text-center small-card">
                  <Card.Body>
                    <Card.Title>句數</Card.Title>
                    <Card.Text className="large-bold-text">
                      {userProgress.contentsViewed}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col xs={12} sm={6} md={4} lg={3}>
                <Card className="mb-4 text-center small-card">
                  <Card.Body>
                    <Card.Title>題數</Card.Title>
                    <Card.Text className="large-bold-text">
                      {userProgress.quizzesCompleted}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileComponent;
