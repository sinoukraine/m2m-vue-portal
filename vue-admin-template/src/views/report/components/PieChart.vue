<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['Protect', 'Loc8', 'Track', 'Watch'] //, 'Deleted'
        },
        series: [
          {
            name: 'Activated Solution',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['45%', '38%'],
            data: [
              { value: 320, name: 'Protect' },
              { value: 240, name: 'Loc8' },
              { value: 149, name: 'Track' },
              { value: 100, name: 'Watch' },
              /*{ value: 59, name: 'Deleted' }*/
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
