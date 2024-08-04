import Axios from "axios"

const baseUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:3030'}/api`
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
        return axios.post(`${baseUrl}/auth/login`, { username, password });
    } catch (error) {
        console.log(error);
    }
}

function getLoggedInUser() {
    try {
        return axios.post(`${baseUrl}/auth/validate`);
    } catch (error) {
        console.log(error);
    }
}

function logout() {
    try {
        sessionStorage.clear()
        return axios.post(`${baseUrl}/auth/logout`);
    } catch (error) {
        console.log(error);
    }
}

function signup({ username, password, fullname }) {
    console.log(username, password, fullname);
    try {
        return axios.post(`${baseUrl}/auth/signup`, { username, password, fullname });
    } catch (error) {
        console.log(error);
    }
}

function query() {
    try {
        return axios.get(`${baseUrl}/user`);
    } catch (error) {
        console.log(error);
    }
}

function remove(userId) {
    console.log(userId);
    try {
        return axios.delete(`${baseUrl}/user/${userId}`);
    } catch (error) {
        console.log(error);
    }
}