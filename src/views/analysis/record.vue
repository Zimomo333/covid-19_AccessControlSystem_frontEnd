<template>
  <div class="app-container">
    <div class="filter-container">
      最近
      <el-select v-model="option" placeholder="7" style="width: 70px" class="filter-item">
        <el-option :key="7" :label="7" :value="7" />
        <el-option :key="30" :label="30" :value="30" />
      </el-select>
      天
    </div>
    <div id="main" style="width: 1300px;height:500px;margin-top:30px;" />
  </div>
</template>

<script>
import { analysisRecord } from '@/api/analysis'

export default {
  name: 'RecordAnalysis',
  data() {
    return {
      query: {
        option: 7
      },
      option: 7
    }
  },
  watch: {
    option() {
      this.query.option = this.option
      analysisRecord(this.query).then(res => {
        var myChart = this.$echarts.init(document.getElementById('main'))
        var option = {
          title: {
            left: 'center',
            text: '出入统计'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: res.data.access_dates
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '出入次数',
              type: 'line',
              areaStyle: {},
              data: res.data.access_times
            }
          ]
        }
        myChart.setOption(option)
      })
    }
  },
  mounted() {
    analysisRecord(this.query).then(res => {
      var myChart = this.$echarts.init(document.getElementById('main'))
      var option = {
        title: {
          left: 'center',
          text: '出入统计'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: res.data.access_dates
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '出入次数',
            type: 'line',
            areaStyle: {},
            data: res.data.access_times
          }
        ]
      }
      myChart.setOption(option)
    })
  }
}
</script>
