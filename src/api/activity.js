import request from '@/utils/request'
import axios from '@/utils/http'

export function fetchAssignment(query) {
    return axios({
      url: '/api/getAssignment/',
      method: 'get',
      params: query
  })
}

export function fetchExecution(query) {
    return axios({
      url: '/api/getExecution/',
      method: 'get',
      params: query
  })
}

export function fetchUncheckExecutionCount(query) {
    return axios({
      url: '/api/getUncheckExecutionCount/',
      method: 'get',
      params: query
  })
}

export function updateExecution(data) {
    return axios({
        url: '/api/updateExecution/',
        method: 'put',
        data
    })
}

export function fetchExecutionImage(query) {
    return axios({
      url: '/api/getExecutionImage/',
      method: 'get',
      params: query
  })
}


export function fetchExecutionHomework(query) {
    return axios({
      url: '/api/getExecutionHomework/',
      method: 'get',
      params: query
  })
}

export function createAssignment(query) {
    return axios({
      url: '/api/createAssignment/',
      method: 'post',
      params: query
  })
}

export function fetchExecutions(query) {
    return axios({
      url: '/api/getExecutions/',
      method: 'get',
      params: query
  })
}


export function fetchExecutionMedias(query) {
    return axios({
      url: '/api/getExecutionImage/',
      method: 'get',
      params: query
  })
}


export function updateAssignment(query) {
    return axios({
      url: '/api/updateAssignment/',
      method: 'put',
      params: query
  })
}

export function deleteAssignmnet(query) {
    return axios({
      url: '/api/deleteAssignmnet/',
      method: 'delete',
      params: query
  })
}

export function fetchExecutionStatusCount(query) {
    return axios({
      url: '/api/getExecutionStatusCount/',
      method: 'get',
      params: query
  })
}

export function fetchActivityLog(query) {
    return axios({
      url: '/api/getActivityLog/',
      method: 'get',
      params: query
  })
}
