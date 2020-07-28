<template>
  <div>
    <div id="main" style="width: 850px;height:600px;margin-top:30px;float: left" />
    <div style="float: left;font-size:50px;margin-top:200px;text-align: center">今日出入次数
      <br>
      <br>
      <div>{{access_times[0]}}</div>
    </div>
  </div>
</template>

<script>
import { analysisHealth, analysisRecord } from '@/api/analysis'

export default {
  data() {
    return {
      access_times: ''
    }
  },
  mounted() {
    analysisHealth().then(res => {
      var myChart = this.$echarts.init(document.getElementById('main'))
      var option = {
        title: {
          left: 'center',
          text: '健康统计'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 10,
          data: ['健康', '危险']
        },
        series: [
          {
            name: '健康状况',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: res.data.health_count[1], name: '危险' },
              { value: 0, name: '' },
              { value: 0, name: '' },
              { value: 0, name: '' },
              { value: res.data.health_count[0], name: '健康' }
            ]
          }
        ]
      }
      myChart.setOption(option)
    })
    analysisRecord({ option: 1 }).then(res => {
      this.access_times = res.data.access_times
    })
  }
}
</script>
