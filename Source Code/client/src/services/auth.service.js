import axios from "axios";
const API_URL = "http://localhost:8080/api/user";

function getToken() {
  if (localStorage.getItem("user")) {
    return JSON.parse(localStorage.getItem("user")).token;
  } else {
    return "";
  }
}

class AuthService {
  login(email, password) {
    return axios.post(API_URL + "/login", {
      email,
      password,
    });
  }
  logout() {
    localStorage.removeItem("user");
  }
  register(username, email, password) {
    return axios.post(API_URL + "/register", {
      username,
      email,
      password,
    });
  }
  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
  fetchUserData() {
    const token = getToken();
    return axios.get(API_URL + "/info", {
      headers: {
        Authorization: token,
      },
    });
  }
}

export default new AuthService();
