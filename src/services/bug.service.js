
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import axios from 'axios'

const baseUrl = 'http://localhost:3030/api/bug'

const STORAGE_KEY = 'bugDB'

export const bugService = {
    query,
    getById,
    save,
    remove,
}


async function query() {
    const res = await axios.get(baseUrl).then(res => res.data)
    return res
}

async function getById(bugId) {
    const res = await axios.get(`${baseUrl}/${bugId}`).then(res => res.data)
    return res
}

async function remove(bugId) {
    const res = await axios.get(`${baseUrl}/${bugId}/remove`).then(res => res.data)
    return res
}

async function save(bug) {
    const queryParams = new URLSearchParams(bug).toString();
    const res = await axios.get(`${baseUrl}/save?${queryParams}`).then(res => res.data);
    return res;
}