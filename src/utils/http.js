import axios from 'axios'
import router from '../router'
import store from '../store/index'
import { localGet, localRemove, localSet } from './auth'


const instance = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 1000 * 12 }
)



export default instance
