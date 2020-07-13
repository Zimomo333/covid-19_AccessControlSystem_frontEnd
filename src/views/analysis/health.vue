<template>
  <div id="main" style="width: 1300px;height:500px;margin-top:30px;" />
</template>

<script>
import { analysisHealth } from '@/api/analysis'

export default {
  name: 'HelathAnalysis',
  data() {
    return {
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
            name: '访问来源',
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
              { value: res.data.health_count[0], name: '危险' },
              { value: 0, name: '' },
              { value: 0, name: '' },
              { value: 0, name: '' },
              { value: res.data.health_count[1], name: '健康' }
            ]
          }
        ]
      }
      myChart.setOption(option)
    })
  }
}
</script>
