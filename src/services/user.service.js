import Axios from "axios"

const baseUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:3030'}/api/auth`
const axios = Axios.create({
    withCredentials: true, xsrfCookieName: 'XSRF-TOKEN',
})

export const userService = {
    login,
    getLoggedInUser,
    logout,
    signup
}

function login(username, password) {
    try {
        return axios.post(`${baseUrl}/login`, { username, password });
    } catch (error) {
        console.log(error);
    }
}

function getLoggedInUser() {
    try {
        return axios.post(`${baseUrl}/validate`);
    } catch (error) {
        console.log(error);
    }
}

function logout() {
    try {
        return axios.post(`${baseUrl}/logout`);
    } catch (error) {
        console.log(error);
    }
}

function signup({ username, password, fullname }) {
    console.log(username, password, fullname);
    try {
        return axios.post(`${baseUrl}/signup`, { username, password, fullname });
    } catch (error) {
        console.log(error);
    }
}