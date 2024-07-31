

import Axios from "axios"
import { utilService } from "./util.service"

const baseUrl = 'http://localhost:3030/api/bug'
const axios = Axios.create({
    withCredentials: true, xsrfCookieName: 'XSRF-TOKEN',

})


const STORAGE_KEY = 'bugDB'

axios.interceptors.response.use(response => {

    return response
})

export const bugService = {
    query,
    getById,
    save,
    remove,
}

async function query(filterBy = {}) {
    const res = await axios.get(baseUrl, { params: filterBy })
    return res.data
}

async function getById(bugId) {
    try {
        const res = await axios.get(`${baseUrl}/${bugId}`)
        return res.data
    } catch (error) {
        if (error.response && error.response.status === 403) {
            // Handle the specific 403 error for too many bug visits
            console.error('Too many bug visits:', error.response.data)
            throw new Error('You have visited 3 bugs in the last 3 hours. Please wait before visiting more bugs.')
        } else {
            // Handle other errors
            console.error('Error fetching bug:', error)
            throw error
        }
    }
}

async function remove(bugId) {
    const res = await axios.delete(`${baseUrl}/${bugId}`)
    return res.data
}

async function save(bug) {
    if (bug._id) {
        const res = await axios.put(`${baseUrl}/${bug._id}`, bug)
        return res.data
    } else {
        const res = await axios.post(baseUrl, bug)
        return res.data
    }
}