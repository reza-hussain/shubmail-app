import axios from "axios";

axios.defaults.baseURL = "https://mail.taskauditor.com/api";

// axios.defaults.baseURL = "http://localhost:4000/api";

const fetchData = async (options) => {
  const response = await axios.request(options);
  return response?.data?.data;
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
