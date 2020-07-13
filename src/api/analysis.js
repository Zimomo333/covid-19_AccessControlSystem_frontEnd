import request from '@/utils/request'

export function analysisHealth() {
  return request({
    url: '/analysis/health',
    method: 'get'
  })
}

export function analysisRecord(query) {
  return request({
    url: '/analysis/record',
    method: 'get',
    params: query
  })
}
