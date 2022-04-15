import request from '@/utils/request'
import axios from '@/utils/http'

export function fetchList(query) {
    return axios({
      url: '/api/getCourseByUserId/',
      method: 'get',
      params: query
  })
}

export function fetchCourseDetail(query) {
    console.log(query);
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

export function fetchCourseLectures(query) {
    return axios({
        url: '/api/getLecturesByCourseId/',
        method: 'get',
        params: query
    })
}
