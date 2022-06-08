import request from '@/utils/request'
import axios from '@/utils/http'

export function createCourse(data) {
    return axios({
        url: '/api/course/create/',
        method: 'post',
        data
    })
}
export function deleteCourse(data) {
    return axios({
        url: '/api/course/delete/',
        method: 'delete',
        data
    })
}
export function updateCourse(data) {
    return axios({
        url: '/api/course/update/',
        method: 'put',
        data
    })
}
export function fetchCourses(query) {
    return axios({
        url: '/api/course/list/',
        method: 'get',
        params: query
    })
}
export function fetchCourse(query) {
    return axios({
        url: '/api/course/get/',
        method: 'get',
        params: query
    })
}
export function createLecture(data) {
    return axios({
        url: '/api/lecture/create/',
        method: 'post',
        data
    })
}
export function deleteLecture(data) {
    return axios({
        url: '/api/lecture/delete/',
        method: 'delete',
        data
    })
}
export function setPreviewLecture(data) {
    return axios({
        url: '/api/lecture/update/',
        method: 'put',
        data
    })
}
export function fetchLectures(query) {
    return axios({
        url: '/api/lecture/list/',
        method: 'get',
        params: query
    })
}
export function fetchLecture(query) {
    return axios({
        url: '/api/lecture/get/',
        method: 'get',
        params: query
    })
} export function fetchLectureCount(query) {
    return axios({
        url: '/api/lecture/count/',
        method: 'get',
        params: query
    })
}
export function createSelection(data) {
    return axios({
        url: '/api/selection/create/',
        method: 'post',
        data
    })
}
export function deleteSelection(data) {
    return axios({
        url: '/api/selection/delete/',
        method: 'delete',
        data
    })
}
export function fetchGenres(query) {
    return axios({
        url: '/api/genre/list/',
        method: 'get',
        params: query
    })
}
export function fetchFormats(query) {
    return axios({
        url: '/api/format/list/',
        method: 'get',
        params: query
    })
}
export function deleteComments(data) {
    return axios({
        url: '/api/comment/delete/',
        method: 'delete',
        data
    })
}
export function updateComment(data) {
    return axios({
        url: '/api/comment/update/',
        method: 'put',
        data
    })
}
export function fetchComments(query) {
    return axios({
        url: '/api/comment/list/',
        method: 'get',
        params: query
    })
}
