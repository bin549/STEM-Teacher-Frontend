import request from '@/utils/request'
import axios from '@/utils/http'

export function login(data) {
  return request({
    url: '/api/token/login/',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function getInfo(token) {
  return axios({
    url: '/api/getUserByToken/',
    method: 'get',
    params: { token }
  })
}

export function fetchList(query) {
    return axios({
      url: '/api/getStudentByOwnerId/',
      method: 'get',
      params: query
  })
}

export function fetchStudent(query) {
    return axios({
      url: '/api/getStudents/',
      method: 'get',
      params: query
  })
}

export function fetchStudents(query) {
    return axios({
      url: '/api/getStudents/',
      method: 'get',
      params: query
  })
}

export function fetchStudentCount(query) {
    return axios({
      url: '/api/getStudentCount/',
      method: 'get',
      params: query
  })
}
