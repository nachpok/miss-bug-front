import Axios from "axios"
import { showErrorMsg } from "../services/event-bus.service";
//TODO replace env var name

const baseUrl = import.meta.env.VITE_ENV === 'development' ? 'http://localhost:3030/api' : '/api'


const axios = Axios.create({
    withCredentials: true, xsrfCookieName: 'XSRF-TOKEN',
})

export const userService = {
    login,
    getLoggedInUser,
    logout,
    signup,
    query,
    remove
}

function login(username, password) {
    try {
        return axios.post(baseUrl + `/auth/login`, { username, password });
    } catch (error) {
        console.log(error);
    }
}

function getLoggedInUser() {
    try {
        return axios.post(baseUrl + `/auth/validate`);
    } catch (error) {
        console.log(error);
    }
}

function logout() {
    try {
        sessionStorage.clear()
        return axios.post(baseUrl + `/auth/logout`);
    } catch (error) {
        console.log(error);
    }
}

async function signup({ username, password, fullname }) {
    try {
        const singupRes = await axios.post(baseUrl + `/auth/signup`, { username, password, fullname });
        return singupRes
    } catch (error) {
        if (error?.response?.status === 409) {
            showErrorMsg("Username already exists");
        }
        console.log(error);
    }
}

function query() {
    try {
        return axios.get(baseUrl + `/user`);
    } catch (error) {
        console.log(error);
    }
}

function remove(userId) {
    console.log(userId);
    try {
        return axios.delete(baseUrl + `/user/${userId}`);
    } catch (error) {
        console.log(error);
    }
}