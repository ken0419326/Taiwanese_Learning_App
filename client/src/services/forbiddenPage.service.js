import axios from "axios";

const forbiddenPageService = {
  startInterceptor: () => {
    let interceptor;
    try {
      interceptor = axios.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response && error.response.status === 403) {
            return Promise.reject(error.response.data);
          }
          return Promise.reject(error);
        }
      );
    } catch (error) {
      console.error("Error creating interceptor:", error);
    }

    // Ensure interceptor is returned as an object
    return { interceptor };
  },
};

export default forbiddenPageService;
