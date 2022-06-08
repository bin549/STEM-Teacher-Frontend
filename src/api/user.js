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
export function fetchStudent(query) {
  return axios({
    url: '/api/student/list/',
    method: 'get',
    params: query
  })
}
export function fetchStudents(query) {
  return axios({
    url: '/api/user/list/',
    method: 'get',
    params: query
  })
}
export function fetchStudentCount(query) {
  return axios({
    url: '/api/user/count/',
    method: 'get',
    params: query
  })
}
