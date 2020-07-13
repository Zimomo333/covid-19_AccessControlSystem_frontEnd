import request from '@/utils/request'

export function fetchRecord(id) {
  return request({
    url: '/record/recent',
    method: 'get',
    params: id
  })
}

export function fetchRecordList(query) {
  return request({
    url: '/record/list',
    method: 'get',
    params: query
  })
}
