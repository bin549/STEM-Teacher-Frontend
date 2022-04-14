import request from '@/utils/request'

export function fetchList(query) {
  return request({
      url: '/admin/s/column',
      method: 'get',
      params: query
  })
}
