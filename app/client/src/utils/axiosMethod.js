import axios from 'axios'

const API_SERVER = '/api'

export const privateReq = axios.create({
    withCredentials: true,
    baseURL: API_SERVER
})

export const publicReq = axios.create({
    baseURL: API_SERVER
})

