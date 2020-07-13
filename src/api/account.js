import request from '@/utils/request'

export function fetchAdmin(query) {
  return request({
    url: '/account/admin/list',
    method: 'get',
    params: query
  })
}

export function createAdmin(data) {
  return request({
    url: '/account/admin/create',
    method: 'post',
    params: data
  })
}

export function updateAdmin(data) {
  return request({
    url: '/account/admin/update',
    method: 'post',
    params: data
  })
}

export function deleteAdmin(id) {
  return request({
    url: '/account/admin/delete',
    method: 'post',
    params: { id: id }
  })
}

export function fetchInspector(query) {
  return request({
    url: '/account/inspector/list',
    method: 'get',
    params: query
  })
}

export function createInspector(data) {
  return request({
    url: '/account/inspector/create',
    method: 'post',
    params: data
  })
}

export function updateInspector(data) {
  return request({
    url: '/account/inspector/update',
    method: 'post',
    params: data
  })
}

export function deleteInspector(id) {
  return request({
    url: '/account/inspector/delete',
    method: 'post',
    params: { id: id }
  })
}

export function resetOpenId(id) {
  return request({
    url: '/account/inspector/reset-openid',
    method: 'post',
    params: { id: id }
  })
}

export function fetchResident(query) {
  return request({
    url: '/account/resident/list',
    method: 'get',
    params: query
  })
}

export function deleteResident(id) {
  return request({
    url: '/account/resident/delete',
    method: 'post',
    params: { id: id }
  })
}

export function lockResident(id) {
  return request({
    url: '/account/resident/lock',
    method: 'post',
    params: { id: id }
  })
}

export function unlockResident(id) {
  return request({
    url: '/account/resident/unlock',
    method: 'post',
    params: { id: id }
  })
}

export function fetchInfo(id) {
  return request({
    url: '/account/resident/info',
    method: 'get',
    params: { id: id }
  })
}
