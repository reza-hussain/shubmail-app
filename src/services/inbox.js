import axios from "axios";

// axios.defaults.baseURL =
//   "http://ec2-3-227-193-236.compute-1.amazonaws.com:8887/api";

axios.defaults.baseURL = "http://localhost:4000/api";

const fetchData = async (options) => {
  try {
    const response = await axios.request(options);
    return response?.data?.data;
  } catch (error) {
    return error;
  }
};

export const getRequest = async (options) => {
  return await fetchData({ ...options, method: "GET" });
};

export const postRequest = async (options) => {
  return await fetchData({ ...options, method: "POST" });
};

export const putRequest = async (options) => {
  return await fetchData({ ...options, method: "PUT" });
};

export const deleteRequest = async (options) => {
  return await fetchData({ ...options, method: "DELETE" });
};
