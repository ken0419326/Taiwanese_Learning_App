import axios from "axios";

const API_URL = "http://localhost:8080/api/vocab";

function getToken() {
  if (localStorage.getItem("user")) {
    return JSON.parse(localStorage.getItem("user")).token;
  } else {
    return "";
  }
}

class VocabService {
  saveCollection(ch, no, tags) {
    let token = getToken();
    return axios.post(
      API_URL + "/save/" + ch + "/" + no,
      { tags },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }
}

export default new VocabService();
