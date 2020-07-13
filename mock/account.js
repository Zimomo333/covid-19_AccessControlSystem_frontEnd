const Mock = require('mockjs')

const adminList = []
const inspectorList = []
const residentList = []
const count = 50
const info = []

for (let i = 0; i < count; i++) {
  adminList.push(Mock.mock({
    id: '@increment',
    username: '@first'
  }))
  inspectorList.push(Mock.mock({
    id: '@increment',
    'open_id|1000000000-9000000000': 0,
    username: '@first',
    'password|1000000-9000000': 0
  }))
  residentList.push(Mock.mock({
    id: '@increment',
    'open_id|1000000000-9000000000': 0,
    username: '@first',
    'password|1000000-9000000': 0,
    name: '@first',
    sex: '@integer(0, 2)',
    'identity_card|440181000000000000-440182000000000000': 0,
    photo: '@image',
    'house_no|100-399': 0,
    'health_status|0-10': 0,
    'access_times|50-100': 0,
    is_locked: '@boolean'
  }))
}

info.push(Mock.mock({
  id: '@increment',
  'open_id|1000000000-9000000000': 0,
  username: '@first',
  'password|1000000-9000000': 0,
  name: '@first',
  sex: '@integer(0, 2)',
  'identity_card|440181000000000000-440182000000000000': 0,
  photo: '@image',
  'house_no|100-399': 0,
  'health_status|0-10': 0,
  'access_times|50-100': 0,
  is_locked: '@boolean'
}))

module.exports = [
  {
    url: '/account/admin/list',
    type: 'get',
    response: config => {
      const { id, username, page = 1, limit = 20, sort } = config.query

      let mockList = adminList.filter(item => {
        if (id && item.id.toString() !== id) return false
        if (username && item.username !== username) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          list: pageList
        }
      }
    }
  },

  {
    url: '/account/admin/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: {
          id: 777,
          result: 0
        }
      }
    }
  },

  {
    url: '/account/admin/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: {
          result: 0
        }
      }
    }
  },

  {
    url: '/account/admin/delete',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: {
          result: 0
        }
      }
    }
  },

  {
    url: '/account/inspector/list',
    type: 'get',
    response: config => {
      const { id, username, page = 1, limit = 20, sort } = config.query

      let mockList = inspectorList.filter(item => {
        if (id && item.id.toString() !== id) return false
        if (username && item.username !== username) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          list: pageList
        }
      }
    }
  },

  {
    url: '/account/inspector/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/account/inspector/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/account/inspector/reset-openid',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/account/resident/list',
    type: 'get',
    response: config => {
      const { id, name, locked_query, health_query, page = 1, limit = 20, sort } = config.query

      let mockList = residentList.filter(item => {
        if (id && item.id.toString() !== id) return false
        if (name && item.name !== name) return false
        if (locked_query === 'locked') {
          if (item.is_locked === false) return false
        }
        if (locked_query === 'unlocked') {
          if (item.is_locked === true) return false
        }
        if (health_query === 'healthy') {
          if (item.health_status > 5) return false
        }
        if (health_query === 'unhealthy') {
          if (item.health_status <= 5) return false
        }
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          list: pageList
        }
      }
    }
  },

  {
    url: '/account/resident/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/account/resident/info',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          info: info
        }
      }
    }
  },
]

