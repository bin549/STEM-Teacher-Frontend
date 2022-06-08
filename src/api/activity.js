import request from '@/utils/request'
import axios from '@/utils/http'

export function createAssignment(data) {
  return axios({
    url: '/api/assignment/create/',
    method: 'post',
    data
  })
}
export function deleteAssignmnet(data) {
  return axios({
    url: '/api/assignmnet/delete/',
    method: 'delete',
    data
  })
}
export function updateAssignment(data) {
  return axios({
    url: '/api/assignment/update/',
    method: 'put',
    data
  })
}
export function fetchAssignment(query) {
  return axios({
    url: '/api/assignment/get/',
    method: 'get',
    params: query
  })
}
export function updateExecution(data) {
  return axios({
    url: '/api/execution/update/',
    method: 'put',
    data
  })
}
export function fetchExecutions(query) {
  return axios({
    url: '/api/execution/list/',
    method: 'get',
    params: query
  })
}
export function fetchExecution(query) {
  return axios({
    url: '/api/execution/get/',
    method: 'get',
    params: query
  })
}
export function fetchExecutionCount(query) {
  return axios({
    url: '/api/execution/count/',
    method: 'get',
    params: query
  })
}
export function fetchExecutionImage(query) {
  return axios({
    url: '/api/media/list/',
    method: 'get',
    params: query
  })
}
export function fetchExecutionMedias(query) {
  return axios({
    url: '/api/media/list/',
    method: 'get',
    params: query
  })
}

export function fetchActivityLog(query) {
  return axios({
    url: '/api/log/get/',
    method: 'get',
    params: query
  })
}
