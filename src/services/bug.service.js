import Axios from "axios";
import { utilService } from "./util.service";
import { httpService } from "./http.service";
const baseUrl =
  import.meta.env.VITE_ENV === "development"
    ? "http://localhost:3030/api/bug"
    : "/api/bug";

const axios = Axios.create({
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
});

const STORAGE_KEY = "bugDB";

axios.interceptors.response.use((response) => {
  return response;
});

export const bugService = {
  query,
  getById,
  save,
  remove,
};

async function query(filterBy = {}) {
  console.log("service filter: ", filterBy);
  try {
    return await httpService.get(`bug`, filterBy);
  } catch (e) {
    throw Error("Error fetching bugs");
  }
}

async function getById(bugId) {
  try {
    const res = await httpService.get(`bug/${bugId}`);
    return res;
  } catch (error) {
    if (error.response && error.response.status === 403) {
      // Handle the specific 403 error for too many bug visits
      console.error("Too many bug visits:", error.response.data);
      throw new Error(
        "You have visited 3 bugs in the last 3 hours. Please wait before visiting more bugs."
      );
    } else {
      // Handle other errors
      console.error("Error fetching bug:", error);
      throw error;
    }
  }
}

async function remove(bugId) {
  const url = `${baseUrl}/${bugId}`;
  const res = await httpService.delete(`bug/${bugId}`);
  return res;
}

async function save(bug) {
  if (bug._id) {
    const res = await httpService.put(`bug/${bug._id}`, bug);
    return res.data;
  } else {
    const res = await axios.post(`${baseUrl}`, bug);
    console.log("bugService save", res);

    return res.data;
  }
}
