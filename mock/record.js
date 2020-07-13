const Mock = require('mockjs')

const record = []
const recent = []
const count = 50

for (let i = 0; i < count; i++) {
  record.push(Mock.mock({
    id: '@increment',
    time: +Mock.Random.date('T'),
    temperature: '@integer(37, 39)',
    resident_id: '@increment',
    inspector_id: '@increment'
  }))
}

for (let i = 0; i < 10; i++) {
  recent.push(Mock.mock({
    id: '@increment',
    username: '@first',
    time: +Mock.Random.date('T'),
    temperature: '@integer(37, 39)',
    user_id: '@increment',
    inspector_id: '@increment'
  }))
}

module.exports = [
  {
    url: '/record/recent',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          rcData: recent
        }
      }
    }
  },

  {
    url: '/record/list',
    type: 'get',
    response: config => {
      const { id, resident_id, inspector_id, date_query, health_query, page = 1, limit = 20, sort } = config.query

      let mockList = record.filter(item => {
        if (id && item.id.toString() !== id) return false
        if (resident_id && item.resident_id.toString() !== resident_id) return false
        if (inspector_id && item.inspector_id.toString() !== inspector_id) return false
        if (health_query === 'healthy') {
          if (item.temperature >= 38) return false
        }
        if (health_query === 'unhealthy') {
          if (item.temperature < 38) return false
        }
        if (date_query) {
          if (item.time < date_query[0] || item.time > date_query[1]) return false
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
  }
]

