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

export function updateStatus(data) {
    return axios({
        url: '/api/updateStatus/',
        method: 'put',
        data
    })
}
