import axios from "axios";

const API_URL = "http://localhost:8080/api/profile";

function getToken() {
  if (localStorage.getItem("user")) {
    return JSON.parse(localStorage.getItem("user")).token;
  } else {
    return "";
  }
}

class ProfileService {
  getBestAchievement(type) {
    let token = getToken();
    return axios.get(API_URL + "/achievement/" + type, {
      headers: {
        Authorization: token,
      },
    });
  }

  getNextAchievement(type) {
    let token = getToken();
    return axios.get(API_URL + "/next-achievement/" + type, {
      headers: {
        Authorization: token,
      },
    });
  }

  getUserProgress() {
    let token = getToken();
    return axios.get(API_URL + "/user-progress", {
      headers: {
        Authorization: token,
      },
    });
  }
}

export default new ProfileService();
