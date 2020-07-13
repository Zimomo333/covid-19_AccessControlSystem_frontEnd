const health_count = [100, 50]
const access_dates = ['2018-06-01', '2018-06-02', '2018-06-03', '2018-06-04', '2018-06-05', '2018-06-06', '2018-06-07']
const access_times = [1, 2, 3, 4, 5, 6, 7]

const access_dates2 = ['2018-06-01', '2018-06-02', '2018-06-03', '2018-06-04', '2018-06-05', '2018-06-06', '2018-06-07', '2018-06-08', '2018-06-09', '2018-06-10',
  '2018-06-01', '2018-06-02', '2018-06-03', '2018-06-04', '2018-06-05', '2018-06-06', '2018-06-07', '2018-06-08', '2018-06-09', '2018-06-10',
  '2018-06-01', '2018-06-02', '2018-06-03', '2018-06-04', '2018-06-05', '2018-06-06', '2018-06-07', '2018-06-08', '2018-06-09', '2018-06-30']
const access_times2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  1, 2, 3, 4, 5, 6, 7, 8, 9, 30]

module.exports = [
  {
    url: '/analysis/health',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          health_count: health_count
        }
      }
    }
  },
  {
    url: '/analysis/record',
    type: 'get',
    response: config => {
      const { option } = config.query
      if (option === '7') {
        return {
          code: 20000,
          data: {
            access_dates: access_dates,
            access_times: access_times,
            test: option
          }
        }
      } else {
        return {
          code: 20000,
          data: {
            access_dates: access_dates2,
            access_times: access_times2,
            test: option
          }
        }
      }
    }
  }
]

