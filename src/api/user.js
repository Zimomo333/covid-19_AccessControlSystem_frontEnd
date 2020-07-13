import request from '@/utils/request'

export function login(query) {
  return request({
    url: '/admin/login',
    method: 'post',
    params: query
  })
}

export function waterCheck(data) {
  return request({
    url: '/waterCheck',
    method: 'post',
    params: data
  })
}

export function getInfo(token) {
  return request({
    url: '/admin/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/admin/logout',
    method: 'post'
  })
}
