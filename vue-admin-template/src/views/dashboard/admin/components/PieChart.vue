<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import { getSIMStates } from '@/api/sim'

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
      default: '350px'
    },
    pie: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      chart: null,
    }
  },
  watch: {
    pie: function(val) {
      const arr = []
      val.forEach(element => {
        arr.push({
          value: element.JTOV_SIM_NUMBERS,
          name: element.DEVICE_STATUS_CODE
        })
      })
      this.initChart(arr)
    },
  },
  mounted() {    
      /*      
      getSIMStates(null).then(response => {
        let arr = []
        response.data.forEach(element => {
          arr.push({
            value: element.count,
            name: element.simStatus
          })
        })
        this.initChart({arr})
      })*/
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart(data) {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({                        
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
         // data: data.labels //['Suspended', 'Deleteing', 'OnStock', 'Productive', 'Deleted', 'Test', 'TestEnd', 'TestProductive'] //, 'Deleted'
        },       
        series: [
          {
            name: 'SIM Inventory',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: data, /*[
              { value: 320, name: 'Suspended' },
              { value: 240, name: 'Deleteing' },
              { value: 149, name: 'OnStock' },
              { value: 100, name: 'Productive' },
              { value: 70, name: 'Deleted' },
              { value: 40, name: 'Test' },
              { value: 29, name: 'TestEnd' },
              { value: 4, name: 'TestProductive' },
              { value: 59, name: 'Deleted' }
            ]*/ 
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
