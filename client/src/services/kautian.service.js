import axios from "axios";
const API_URL = "http://localhost:8080/api/kautian";

function getToken() {
  if (localStorage.getItem("user")) {
    return JSON.parse(localStorage.getItem("user")).token;
  } else {
    return "";
  }
}

class KautianService {
  getVocab(hanji) {
    let token = getToken();
    return axios.get(API_URL + "/" + hanji, {
      headers: {
        Authorization: token,
      },
    });
  }
}

export default new KautianService();
