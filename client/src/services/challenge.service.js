import axios from "axios";
const API_URL = "http://localhost:8080/api/challenge";

function getToken() {
  if (localStorage.getItem("user")) {
    return JSON.parse(localStorage.getItem("user")).token;
  } else {
    return "";
  }
}

class ChallengeService {
  getUserCollections() {
    let token = getToken();
    return axios.get(API_URL + "/user-collections", {
      headers: {
        Authorization: token,
      },
    });
  }

  getCardData(ch, no) {
    let token = getToken();
    return axios.get(API_URL + "/content/" + ch + "/" + no, {
      headers: {
        Authorization: token,
      },
    });
  }

  getNote(ch, no) {
    let token = getToken();
    return axios.get(API_URL + "/note/" + ch + "/" + no, {
      headers: {
        Authorization: token,
      },
    });
  }
}
export default new ChallengeService();
