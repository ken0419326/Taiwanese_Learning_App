import axios from "axios";
const API_URL = "http://localhost:8080/api/course";

function getToken() {
  if (localStorage.getItem("user")) {
    return JSON.parse(localStorage.getItem("user")).token;
  } else {
    return "";
  }
}

class CourseService {
  getCourseTheme() {
    let token = getToken();
    return axios.get(API_URL, {
      headers: {
        Authorization: token,
      },
    });
  }

  getCourseContent(ch, no) {
    let token = getToken();
    return axios.get(API_URL + "/content/" + ch + "/" + no, {
      headers: {
        Authorization: token,
      },
    });
  }

  getCourseContentLength(ch) {
    let token = getToken();
    return axios.get(API_URL + "/length/content/" + ch, {
      headers: {
        Authorization: token,
      },
    });
  }

  getCourseQuiz(ch, no) {
    let token = getToken();
    return axios.get(API_URL + "/quiz/" + ch + "/" + no, {
      headers: {
        Authorization: token,
      },
    });
  }

  getCourseQuizLength(ch) {
    let token = getToken();
    return axios.get(API_URL + "/length/quiz/" + ch, {
      headers: {
        Authorization: token,
      },
    });
  }

  setMaxCourseCompleted(ch, no) {
    let token = getToken();
    return axios.get(API_URL + "/completed/" + ch + "/" + no, {
      headers: {
        Authorization: token,
      },
    });
  }

  getProgress(ch) {
    let token = getToken();
    return axios.get(API_URL + "/progress/" + ch, {
      headers: {
        Authorization: token,
      },
    });
  }
}
export default new CourseService();
