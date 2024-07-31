
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import Axios from "axios"
const axios = Axios.create({
    withCredentials: true
})

const baseUrl = 'http://localhost:3030/api/bug'

const STORAGE_KEY = 'bugDB'



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
    const res = await axios.get(`${baseUrl}/${bugId}`)
    return res.data
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