<template>
  <div class="dashboard-editor-container">
<!--
      @handleSetLineChartData="handleSetLineChartData"-->
    <panel-group 
      :total="panelData"
      @change="searchByPeriod" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;" class="bar-chart-container">
      <line-chart :chart-data="datacollection" :styles="barStyles" :options="barOptions"></line-chart>
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <div class="card-panel card-panel-description">
          <div class="card-panel-text">
            <!--Data Sessions-->
          </div>
        </div>
         <!-- <transaction-table />
         <box-card />-->
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { getCDRSList, getSIM, getCDRS } from '@/api/sim'
/*
import LineChart from './components/LineChart'
import RaddarChart from './components/RaddarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import TransactionTable from './components/TransactionTable'
import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'*/
import PanelGroup from './components/PanelGroup'
import PieChart from './components/PieChart'
//import { Bar } from 'vue-chartjs'
import LineChart from './components/LineChart.js'
//import TransactionTable from './components/TransactionTable'
//import BoxCard from './components/BoxCard'
//import { loadLanguageAsync } from "../../../utils/i18n"
import moment from 'moment'

export default {
  name: 'DashboardAdmin',
  components: {
    /*
    RaddarChart,
    LineChart,
    PieChart,
    BarChart,
    TransactionTable,
    TodoList,*/
    //BoxCard,
    //TransactionTable,
    PieChart,
    PanelGroup,
    LineChart
  },
  data() {
    return {
      simQuery: {
        imsi: ''
      },
      cdrsQuery: {
        id: ''
      },
      cdrsListQuery: {
        page: 1,
        limit: 0,
        date1: '2020-10-29',
        date2: '2020-11-09',
        imsi: '',
        customer: '0',
      },
      panelData: {
        totalDataUsage: 0,
        totalSMSUsage: 0,
        totalFlowUsage: 0,
        totalDataSessions: 0,
        loaded: false
      },
      datacollection: null,
      series: [44, 51, 41, 11, 10, 5, 4, 2, 1],
      pieOptions: {
        chart: {
          type: 'donut',
        },
        labels: ["Deleted", "Deleting", "OnStock", "Ordered", "Productive", "Suspended", "Test", "Test Productive", "Tested"],
        dataLabels: {
          enabled: false
        },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            labels: ["Deleted", "Deleting", "OnStock", "Ordered", "Productive", "Suspended", "Test", "Test Productive", "Tested"],
            legend: {
              position: 'bottom'
            }
          }
        }]
      },
      barOptions: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }]
        },
        responsive: true,
        maintainAspectRatio: false
      },
    }
  },
  watch: {
    
  },
  methods: {
    clearData(){      
      this.total = {
        totalDataUsage: 0,
        totalSMSUsage: 0,
        totalFlowUsage: 0,
        totalDataSessions: 0,
        loaded: false
      }
    },
    searchByPeriod(period) {     
      this.clearData()
      const today = new Date()
      this.cdrsListQuery.date2 = moment(today, 'YYYY-MM-DD').format('YYYY-MM-DD')

      switch(period){
        case 'daily':   
          this.cdrsListQuery.date1 = moment(today, 'YYYY-MM-DD').add(-1, 'days').format('YYYY-MM-DD')     
        break
        case 'weekly':   
          this.cdrsListQuery.date1 = moment(today, 'YYYY-MM-DD').add(-7, 'days').format('YYYY-MM-DD')     
        break
        case 'monthly':   
          this.cdrsListQuery.date1 = moment(today, 'YYYY-MM-DD').add(-18, 'days').format('YYYY-MM-DD')     
        break
      }
      
      if(this.simQuery.imsi.length){
        this.fillIMSIData()
      }else{
        this.fillPanelData()
      }
    },
    searchByIMSI(imsi) { 
      this.clearData()
      
      this.simQuery.imsi = imsi
      this.fillIMSIData()
    },
    fillPanelData(){
      getCDRSList(this.cdrsListQuery).then(response => {
        let totalDataUsage = 0, 
            totalSMSUsage = 0,
            totalFlowUsage = 0
            
        const arrLabel = []
        const arrData = []

        response.data.forEach(element => {
          totalDataUsage += +element.totalDataUsage
          totalSMSUsage += +element.totalSmsUsage          
          totalFlowUsage += +element.totalFlowUsage
          
          const labelDate = element.lastUpdate.slice(0,10)
          const indexLabel = arrLabel.indexOf(labelDate)
          if(indexLabel == -1) {
            arrLabel.push(labelDate)
            arrData.push((+element.totalDataUsage / 1000000))
          }else{            
            arrData[indexLabel] = +arrData[indexLabel] + (+element.totalDataUsage / 1000000)
          }
        })

        this.panelData = {
          totalDataUsage: (totalDataUsage/1000000).toFixed(0),
          totalSMSUsage: totalSMSUsage,
          totalFlowUsage: totalFlowUsage,          
          loaded: true
        }        
        
        this.fillData({labels: arrLabel, dataUsage: arrData})
      })      
    },
    fillIMSIData(){
      getSIM(this.simQuery).then(response => {
        this.cdrsQuery = {
          id: response.data._id,
          date1: this.cdrsListQuery.date1,
          date2: this.cdrsListQuery.date2
        }
        getCDRS(this.cdrsQuery).then(response_1 => {
          let totalDataUsage = 0, 
            totalSMSUsage = 0,
            totalFlowUsage = 0
            
          const arrLabel = []
          const arrData = []

          response_1.data.forEach(element => {
            let flowField = 0
            let smsField = 0
            let totalField = 0
            
            if(element.totals != null  && element.totals.flow != null){
              flowField = element.totals.flow.originalUnits
            }
            if(element.totals != null && element.totals.sms != null){
              smsField = element.totals.sms.originalUnits
            }
            if(element.totals != null && element.totals.data != null && element.totals.data.originalUnits != null){
              totalField = element.totals.data.originalUnits
            }
            totalDataUsage += +totalField
            totalSMSUsage += +smsField          
            totalFlowUsage += +flowField
            
            const labelDate = element.date.slice(0,10)
            const indexLabel = arrLabel.indexOf(labelDate)
            if(indexLabel == -1) {
              arrLabel.push(labelDate)
              arrData.push(+totalField / 1000000)
            }else{            
              arrData[indexLabel] = +arrData[indexLabel] + (+totalField / 1000000)
            }
          })

          this.panelData = {
            totalDataUsage: (totalDataUsage/1000000).toFixed(0),
            totalSMSUsage: totalSMSUsage,
            totalFlowUsage: totalFlowUsage,
            loaded: true
          }        
          
          this.fillData({labels: arrLabel, dataUsage: arrData})
        })  
      })      
    },
    handleSetLineChartData(type) {
      //this.lineChartData = lineChartData[type]
    },
    fillData (data) {      
        this.datacollection = {
          labels: data.labels, //['04.11', '05.11', '06.11', '07.11', '08.11', '09.11', '10.11', '11.11', '12.11', '13.11', '14.10', '15.11', '16.11', '17.11'],
          datasets: [
            {
              label: 'Data Usage',
              backgroundColor: 'rgb(53, 165, 228)',
              data: data.dataUsage //[100, 120, 161, 134, 105, 160, 165, 105, 100, 181, 114, 115, 169, 165]
            }/*, {
              label: 'Data Volume',
              backgroundColor: '#f87979',
              data: [this.getRandomInt(), this.getRandomInt()]
            }*/
          ]
        }
      },
      getRandomInt () {
        return Math.floor(Math.random() * (50 - 5 + 1)) + 5
      },
  },
  mounted () {    
    this.searchByPeriod('weekly')
    //this.fillPanelData()
    //this.fillData()

    //var chart = new ApexCharts(document.querySelector("#chart"), options);

    //chart.render();
  },
  created () {   
    this.$store.watch(
      (state)=>{
        return this.$store.state.dashboard.imsi // could also put a Getter here
      },
      (newValue, oldValue)=>{
        //something changed do something
        this.searchByIMSI(newValue)
      },
      {
        deep:true
      }
    )
  },
  computed: {
    barStyles () {
      return {
        position: 'relative',
        height: '50vh'
      }
    }
  }
}
</script>

<style lang="scss" scoped>

.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 50px 50px 0;
    margin-bottom: 32px;
    
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>

<style>
  .bar-chart-container{
    border-radius: 5px;
  }

  .chart-wrapper{
    border-radius: 5px;
  }
</style>
