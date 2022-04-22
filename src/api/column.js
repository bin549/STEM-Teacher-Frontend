import request from '@/utils/request'
import axios from '@/utils/http'

export function fetchList(query) {
    return axios({
      url: '/api/getCourseByUserId/',
      method: 'get',
      params: query
  })
}

export function fetchGenresList(query) {
    return axios({
      url: '/api/getGenres/',
      method: 'get',
      params: query
  })
}


export function fetchCourseList(query) {
    return axios({
      url: '/api/getCourseByUserId/',
      method: 'get',
      params: query
  })
}

export function fetchCourseDetail(query) {
    return axios({
      url: '/api/getCourseById/',
      method: 'get',
      params: query
  })
}

export function createCourse(data) {
    return axios({
        url: '/api/createCourse/',
        method: 'post',
        data
    })
}

export function createLecture(data) {
    return axios({
        url: '/api/createLecture/',
        method: 'post',
        data
    })
}

export function updateCourse(data) {
    return axios({
        url: '/api/updateCourse/',
        method: 'put',
        data
    })
}

export function updateStatus(data) {
    return axios({
        url: '/api/updateStatus/',
        method: 'put',
        data
    })
}


export function deleteCourse(data) {
    return axios({
        url: '/api/deleteCourse/',
        method: 'delete',
        data
    })
}

export function deleteLecture(data) {
    return axios({
        url: '/api/deleteLecture/',
        method: 'delete',
        data
    })
}


export function fetchCourseLectures(query) {
    return axios({
        url: '/api/getLecturesByCourseId/',
        method: 'get',
        params: query
    })
}


export function createSelect(data) {
    return axios({
        url: '/api/createSelect/',
        method: 'post',
        data
    })
}

export function deleteSelection(data) {
    return axios({
        url: '/api/deleteSelection/',
        method: 'delete',
        data
    })
}

export function fetchFormatsList(query) {
    return axios({
      url: '/api/getFormats/',
      method: 'get',
      params: query
  })
}
