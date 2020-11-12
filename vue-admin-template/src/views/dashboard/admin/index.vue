<template>
  <div class="dashboard-editor-container">

    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;" class="bar-chart-container">
      <!--<line-chart :chart-data="lineChartData" />-->
      <line-chart :chart-data="datacollection" :styles="barStyles" :options="barOptions"></line-chart>
    </el-row>
{{$t('FINISH')}}
    <el-row :gutter="32">
      <!--<el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>-->
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <div class="card-panel card-panel-description">
          <div class="card-panel-text">
            <!--Data Sessions-->
          </div>
        </div>
          <!--<div id="chart">
            <apexchart type="donut" :options="pieOptions" :series="series"></apexchart>
          </div>-->
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="16">
        <div class="chart-wrapper">
          <!--<bar-chart />-->
          <transaction-table />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <!--<transaction-table />-->
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <!--<todo-list />-->
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <!--<box-card />-->
      </el-col>
    </el-row>
  </div>
</template>

<script>
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
import TransactionTable from './components/TransactionTable'
import { loadLanguageAsync } from "../../../utils/i18n"

export default {
  name: 'DashboardAdmin',
  components: {
    /*
    RaddarChart,
    LineChart,
    PieChart,
    BarChart,
    TransactionTable,
    TodoList,
    BoxCard*/
    TransactionTable,
    PieChart,
    PanelGroup,
    LineChart
  },
  data() {
    return {
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
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    fillData () {
        this.datacollection = {
          labels: ['jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec', 'jan', 'fab', 'mar', 'apr', 'may', 'jun', 'jul'],
          datasets: [
            {
              label: 'Activations',
              backgroundColor: '#f87979',
              data: [100, 120, 161, 134, 105, 160, 165, 105, 100, 181, 114, 115, 169, 165]
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
      }
  },
  mounted () {
    this.fillData()
    var chart = new ApexCharts(document.querySelector("#chart"), options);

    chart.render();
  },
  computed: {
    barStyles () {
      return {
        position: 'relative',
        height: '30vh'
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
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
