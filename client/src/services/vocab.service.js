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
  getVocabTags() {
    let token = getToken();
    return axios.get(API_URL, {
      headers: {
        Authorization: token,
      },
    });
  }

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

  removeCollectionTag(ch, no, tag) {
    let token = getToken();
    return axios.delete(API_URL + "/save/" + ch + "/" + no, {
      data: { tag },
      headers: {
        Authorization: token,
      },
    });
  }

  getCollectionNote(ch, no) {
    let token = getToken();
    return axios.get(API_URL + "/note/" + ch + "/" + no, {
      headers: {
        Authorization: token,
      },
    });
  }

  setCollectionNote(ch, no, note) {
    let token = getToken();
    return axios.post(
      API_URL + "/note/" + ch + "/" + no,
      { note },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  renameTag(oldTag, newTag) {
    let token = getToken();
    return axios.patch(
      API_URL + "/tag",
      {
        oldTag: oldTag,
        newTag: newTag,
      },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  deleteTag(tag) {
    let token = getToken();
    return axios.delete(API_URL + "/tag", {
      data: {
        tag: tag,
      },
      headers: {
        Authorization: token,
      },
    });
  }
}

export default new VocabService();
