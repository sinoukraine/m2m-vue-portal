<template>
  <div class="dashboard-editor-container">
<!--
      @handleSetLineChartData="handleSetLineChartData"-->
    <panel-group 
      :total="panelData"
      @change="searchTotalByPeriod" />

    <el-row class="chart-container bar-chart-container">
      <div class="w-100 d-flex">
        <div class="card-inline card-panel-left font-16 bold color-grey">
          {{chartReport}}
        </div>
        <div class="card-inline card-panel-right d-flex">
          
          <el-radio-group v-model="switchChartPeriod" v-on:input="handleChartPeriod" >
            <!--<el-radio-button label="Daily" type="outline"/>-->
            <el-radio-button label="Week" type="outline"/>
            <el-radio-button label="Month" type="outline"/>
          </el-radio-group>
          <el-dropdown class="menu-container right-menu-item hover-effect pointer" trigger="click" @command="handleChartReport">
            <div class="menu-wrapper">
              <img src="menu.svg" class="menu-dropdown">
            </div>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="Data Usage">Data Usage</el-dropdown-item>
                <el-dropdown-item command="SMS Usage">SMS Usage</el-dropdown-item>
                <el-dropdown-item command="Flow Usage">Flow Usage</el-dropdown-item>                
            </el-dropdown-menu>
          </el-dropdown>
          
        </div>
      </div>
      <line-chart :chart-data="datacollection" :styles="barStyles" :options="barOptions" 
            v-loading="listLoading"></line-chart>
    </el-row>

    <el-row :gutter="40">
      <el-col :xs="24" :sm="24" :lg="24" style="margin-bottom:30px;">
        <div class="w-100 d-flex" style="padding: 30px;background-color: #ffffff;border-top-left-radius: 5px;border-top-right-radius: 5px;">
        <div class="card-inline card-panel-left font-16 bold color-grey">
          Top 10 Metrics
        </div>
        <div class="card-inline card-panel-right d-flex">

          <el-radio-group v-model="switchTablePeriod" v-on:input="handleTablePeriod" >
            <el-radio-button label="Last day" type="outline"/>
            <el-radio-button label="Week" type="outline"/>
            <el-radio-button label="Month" type="outline"/>
          </el-radio-group>
        </div>
      </div>
      <el-table
            :key="tableKey"
            v-loading="listLoading"
            :data="list"
            fit
            border
            highlight-current-row
            style="width: 100%;"
          >
           <el-table-column label="№"   align="center" width="160px">
              <template slot-scope="{row}">
                <span>{{ row.num }}</span>
              </template>
            </el-table-column>
           <el-table-column label="IMSI"    align="center" width="180px">
              <template slot-scope="{row}">
                <span>{{ row.imsi }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Customer" sortable="custom"  width="180px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.customer }}</span>
              </template>
            </el-table-column>
            <!--<el-table-column label="User" sortable="custom"  width="180px" align="center">
              <template slot-scope="{row}">
                <span>m2madmin</span>
              </template>
            </el-table-column>
            <el-table-column label="State" width="160px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.state }}</span>
              </template>
            </el-table-column>
            <el-table-column label="RAG" width="160px" align="center">
              <template slot-scope="{row}">
                <span :style="'font-size:2em;color:'+row.rag">&#x025FC;</span>
              </template>
            </el-table-column>-->
            <el-table-column label="Data Usage"  min-width="160px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.total }}</span>
              </template>
            </el-table-column>
            <el-table-column label="SMS Usage"  min-width="160px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.sms }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Flow Usage"  min-width="160px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.flow }}</span>
              </template>
            </el-table-column>
          </el-table>
      </el-col>
    </el-row>
    
    <el-row :gutter="40" >
      <el-col :xs="24" :sm="24" :lg="12" style="margin-bottom:32px">
        
        <div key="key-vmap" class="card col-100 large-30 no-margin margin-bottom" style="background-color: #ffffff;border-radius: 5px;">
          <div class="w-100 d-flex" style="padding: 30px">
            <div class="card-inline card-panel-left font-16 bold color-grey">
              
            </div>
            <div class="card-inline card-panel-right d-flex">
              <span :style="'font-size:2em;color:rgb(46, 199, 201)'">&#11044;</span> 
              <span class="font-12 color-grey" style="padding: 0 15px">0 - 100</span>
              <span :style="'font-size:2em;color:rgb(254, 235, 129)'">&#11044;</span>
              <span class="font-12 color-grey" style="padding: 0 15px">100 - 500</span> 
              <span :style="'font-size:2em;color:rgb(255, 185, 128)'">&#11044;</span>
              <span class="font-12 color-grey" style="padding: 0 15px">500 - 2000</span> 
              <span :style="'font-size:2em;color:rgb(216, 122, 128)'">&#11044;</span>
              <span class="font-12 color-grey" style="padding: 0 15px">2000 +</span> 
<!--
              <el-radio-group v-model="switchChartPeriod" v-on:input="handleChartPeriod" >
                <el-radio-button label="Daily" type="outline"/>
                <el-radio-button label="Weekly" type="outline"/>
                <el-radio-button label="Monthly" type="outline"/>
              </el-radio-group>
              <el-dropdown class="menu-container right-menu-item hover-effect pointer" trigger="click">
                <div class="menu-wrapper">
                  <img src="menu.svg" class="menu-dropdown">
                </div>
                <el-dropdown-menu slot="dropdown" @command="handleChartReport">
                    <el-dropdown-item command="datachart">Data Usage</el-dropdown-item>
                    <el-dropdown-item command="smschart">SMS Usage</el-dropdown-item>
                    <el-dropdown-item command="flowchart">Flow Usage</el-dropdown-item>                
                </el-dropdown-menu>
              </el-dropdown>
              -->
            </div>
          </div>
          <div class="card-content center">
            <div id="vmap" class="margin-top radius-5" style="height: 320px;" data-plugin="vectorMap" data-map="world_en"></div>
            <!--<ejs-toast ref='defaultRef' title='File Downloading' content='<div class="progress"><span style="width: 80%"></span></div>' :position='position' showCloseButton=true target='#toast_target' newestOnTop=true showProgressBar=true></ejs-toast>
            <br/><br/>
            <div id='toast_target'></div>-->
          </div>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <div class="w-100 d-flex">
            <div class="card-inline card-panel-left font-16 bold color-grey" style="margin: 4px;margin-left: -20px;">
              SIM Inventory
            </div>
          </div>
          <pie-chart />
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { getCDRSList, getSIM, getCDRS, getSIMCountry, getSIMCoordinates } from '@/api/sim'
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
      chartReport: 'Data Usage',
      chartDays: 30,
      chartArray: {},
      switchChartPeriod: 'Month',
      switchTablePeriod: 'Month',
      position: { X: 'Center' },
      msgTooltip: '',
      mapLoading: true,
      countriesHARD: [],
      imsi: '',
      countries: [],
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

      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        date1: '2020-10-29',
        date2: '2020-11-09',
        customer: '0',
        sort: '+code'
      },

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
        legend: {
            display: false
        },
        tooltips: {
            callbacks: {
              label: function(tooltipItem) {
                      return tooltipItem.yLabel;
              }
            }
        },
        responsive: true,
        maintainAspectRatio: false
      },
    }
  },
  methods: {   
    handleChartPeriod(val){
      this.searchChartByPeriod(val)
      //this.$emit('change', val)
      //this.$store.dispatch('dashboard/setPeriod', val)
    },
    handleChartReport(val){
      this.searchChartByReport(val)
    },
    handleTablePeriod(val){
      console.log('ta', val)
      this.searchTableByPeriod(val)
       
      //this.$emit('change', val)
      //this.$store.dispatch('dashboard/setPeriod', val)
    },
    clearData(){      
      this.total = {
        totalDataUsage: 0,
        totalSMSUsage: 0,
        totalFlowUsage: 0,
        totalDataSessions: 0,
        loaded: false
      }
    },
    searchTotalByPeriod(period) {     
      this.clearData()
      let days = 0
      const today = new Date()
      this.cdrsListQuery.date2 = moment(today, 'YYYY-MM-DD').format('YYYY-MM-DD')

      switch(period){
        case 'daily':          
          days = 1               
        break
        case 'weekly':   
          days = 7 
        break
        case 'monthly': 
          days = 30     
        break
      }
      this.cdrsListQuery.date1 = moment(today, 'YYYY-MM-DD').add(-days, 'days').format('YYYY-MM-DD')
      
      if(this.imsi.length){
        this.fillIMSIData(days)
      }else{
        this.fillIMSIListData(days)
      }
    },
    searchChartByReport(report) {     
      //this.clearData()
      const days = this.chartDays
      this.chartReport = report  
      let data = []
      switch(report){
        case 'SMS Usage':          
          data = this.chartArray.sms.map(a => a)
        break
        case 'Flow Usage':           
          data = this.chartArray.flow.map(a => a)    
        break
        default:         
          data = this.chartArray.data.map(a => a)
      }    
      let labels = this.chartArray.labels.map(a => a)
      const newChartArrayCount = 30 - days
      for(let i = 0; i < newChartArrayCount; i++) {          
        labels.pop()
        data.pop()
      }
      
      this.fillChartData({labels: labels, dataUsage: data})
    },
    searchTableByPeriod(period) {
      let days = 0
      this.listLoading = true
      const today = new Date()
      switch(period){
        case 'Last day':   
          days = 1 
        break
        case 'Week':   
          days = 7 
        break
        case 'Month': 
          days = 30     
        break
      }

      const query = {
        page: 1,
        limit: 10,
        date1: moment(today, 'YYYY-MM-DD').add(-days, 'days').format('YYYY-MM-DD'),
        date2: moment(today, 'YYYY-MM-DD').format('YYYY-MM-DD'),
        imsi: '',
        customer: '0',
      }
    
      getCDRSList(query).then(response => {
        let totalDataUsage = 0, 
            totalSMSUsage = 0,
            totalFlowUsage = 0
            
        const arrTable = []
        
        response.data.forEach((element, index) => {   
            const tableDataUsageTotal = (+element.totalDataUsage / 1000000)
            const tableSMSUsageTotal = element.totalSmsUsage=='undefined'?0:(+element.totalSmsUsage)
            const tableFlowUsageTotal = (+element.totalFlowUsage)
            arrTable.push({
              num: index + 1,
              imsi: element.imsi,
              customer: element.customer,
              //state: '',
              //rag: '',
              total: tableDataUsageTotal,
              sms: tableSMSUsageTotal,
              flow: tableFlowUsageTotal
            }) 
        })     
        
        
        this.list = arrTable
        this.listLoading = false   
      })
    },
    searchChartByPeriod(period) {     
      //this.clearData()
      let days = 0
      switch(period){
        case 'Week':   
          days = 7 
        break
        case 'Month': 
          days = 30     
        break
      }
      this.chartDays = days  
      let data = []
      switch(this.chartReport){
        case 'SMS Usage':          
          data = this.chartArray.sms.map(a => a)
        break
        case 'Flow Usage':           
          data = this.chartArray.flow.map(a => a)    
        break
        default:         
          data = this.chartArray.data.map(a => a)
      }    
      let labels = this.chartArray.labels.map(a => a)
      const newChartArrayCount = 30 - days
      for(let i = 0; i < newChartArrayCount; i++) {          
        labels.pop()
        data.pop()
      }
      
      this.fillChartData({labels: labels, dataUsage: data})
    },
    searchByIMSI(imsi) { 
      this.clearData()
      
      this.simQuery.imsi = imsi
      /*

const query_1 = {
              imsi: imsi,
              states: false,
              activity: false,
            }
            getSIM(query_1).then(response_1 => {
              const query_2 = {
                id: response_1.data._id
              }
              getSIMCoordinates(query_2).then(response_2 => {
                const query_3 = {
                  lat: response_2.data.geometry.coordinates[1],
                  lon: response_2.data.geometry.coordinates[0]
                }
                getSIMCountry(query_3).then(response_3 => {
                  const country = response_3.data.address.country
                  console.log(country)
                })
              })
            })
     

     */
      this.fillIMSIData()
    },
    /*fillTableData(){
      getCDRSList(this.cdrsListQuery).then(response => {
        let totalDataUsage = 0, 
            totalSMSUsage = 0,
            totalFlowUsage = 0
            
        const arrLabel = []
        const arrData = []

        response.data.forEach(element => {
          totalDataUsage += +element.totalDataUsage
        })
      })
    },*/
    fillIMSIListData(period = 1){      
      let gdpData = {}
      let TooltipStatData = {}
      this.countries = []
      let keys = [
          //["id", "001"],
          //["pg", "002"],
          //["mx", "003"],
          //["ee", "004"],
          //["dz", "005"],
          //["au", "British Virgin Islands"],
          ["au", "Australia"],
          ["za", "South Africa"],
          ["gd", "Grenada"],
          ["us", "United States of America"],
          ["gb", "United Kingdom"],
          ["do", "Dominican Republic"],
          ["cl", "Chile"],
          ["ua", "Ukraine"],
          ["cn", "China"],
          ["ca", "Canada"],
          ["zm", "Zambia"],
          ["ru", "Russian Federation"],
          ["es", "Spain"]

      ]
      getCDRSList(this.cdrsListQuery).then(response => {
        let totalDataUsage = 0, 
            totalSMSUsage = 0,
            totalFlowUsage = 0
            
        const arrLabel = []
        const arrData = []
        const arrSMS = []
        const arrFlow = []
        const arrTable = []
        
        
        if(!this.chartArray.hasOwnProperty('data')){
          const today = new Date()
          const todayDate = moment(today, 'YYYY-MM-DD').format('YYYY-MM-DD')

          for(let i = 30; i >=0 ; i--) {
            const emptyDate = moment(today, 'YYYY-MM-DD').add(-(i.toString()), 'days').format('YYYY-MM-DD')            
            arrLabel.unshift(emptyDate)
            arrData.unshift(0)
            arrSMS.unshift(0)
            arrFlow.unshift(0)
          }
        }
                
        response.data.forEach((element, index) => {
          if(arrTable.length < 10){     
            const tableDataUsageTotal = (+element.totalDataUsage / 1000000)
            const tableSMSUsageTotal = element.totalSmsUsage=='undefined'?0:(+element.totalSmsUsage)
            const tableFlowUsageTotal = (+element.totalFlowUsage)
            arrTable.push({
              num: index + 1,
              imsi: element.imsi,
              customer: element.customer,
              //state: '',
              //rag: '',
              total: tableDataUsageTotal,
              sms: tableSMSUsageTotal,
              flow: tableFlowUsageTotal
            })  
            /*const query = {
              imsi: element.imsi,
              states: true,
              activity: true,
            }
            getSIM(query).then(response_1 => {
              const tableState = response_1.data.extra.states.current
              let rag = ''
              arrTable[index].state = tableState

              var currentTime = moment();
              var oneDayAgo = moment(currentTime, 'YYYY-MM-DD').add(-1, 'days').format('YYYY-MM-DD'); 
              var threeDayAgo = moment(currentTime, 'YYYY-MM-DD').add(-3, 'days').format('YYYY-MM-DD');
                
              const activityArr = response_1.data.extra.activity.samples;
              if(typeof activityArr == 'undefined'){					
                  rag = 'rgb(204,204,204)'							
              }else{														
                const simActivityTime = moment(activityArr[activityArr.length - 1].endTime, 'YYYY-MM-DD').format('YYYY-MM-DD');													
                if(simActivityTime >= oneDayAgo){														
                  rag = 'rgb(57,181,74)'
                }else if(simActivityTime >= threeDayAgo){														
                  rag = '#ff8c00'												
                }else{								
                  rag = '#CD3333'
                }                
                arrTable[index].rag = rag													
              }
              
              if((index == 5 && response.data.length > 5) || (index == response.data.length && response.data.length < 5)){                
                this.listLoading = false
                this.list = arrTable
              }
            })*/      
            if((index == 6 && response.data.length > 6) || (index == response.data.length && response.data.length < 6)){                
              this.listLoading = false
              this.list = arrTable
            }    
          }

          //vmap

          if(+element.totalDataUsage>0){
            const countryHARDIndex = this.countriesHARD.findIndex( ({ name }) => name === element.customer )
            if(countryHARDIndex != -1){              
              const country = this.countriesHARD[countryHARDIndex].country
              const countryIndex = this.countries.findIndex( ({ Key }) => Key === country )     

              if(countryIndex != -1){
                this.countries[countryIndex].Count ++
              }else{
                this.countries.push({
                  Key: country,
                  Count: 1
                })
              }
            }
            
          }else if(this.mapLoading){
                this.mapLoading = false
                  
                for (let i = 0; i <keys.length ; i++) {
                  let country = this.countries.find( ({ Key }) => Key === keys[i][1] );
                  if(country){
                    gdpData[keys[i][0]] = country.Count
                    TooltipStatData[keys[i][0]]= country.Count
                  }
                }       
                
                var max = 0,
                    min = Number.MAX_VALUE,
                    cc,
                    startColor = [248, 142, 134],//76, 175, 80
                    endColor = [122, 33, 27],
                    colors = {},
                    hex;

                //find maximum and minimum values
                for (cc in gdpData)
                {
                    if (parseFloat(gdpData[cc]) > max)
                    {
                        max = parseFloat(gdpData[cc]);
                    }
                    if (parseFloat(gdpData[cc]) < min)
                    {
                        min = parseFloat(gdpData[cc]);
                    }
                }
   
                //set colors according to values of GDP
                for (cc in gdpData)
                {             
                    if (gdpData[cc] > 0 && gdpData[cc] <= 100)
                    {
                      colors[cc] = 'rgb(46, 199, 201)'; //'#28a4df';
                    } else if (gdpData[cc] > 100 && gdpData[cc] <= 500)
                    {
                      colors[cc] = 'rgb(254, 235, 129)';
                    } else if (gdpData[cc] > 500 && gdpData[cc] <= 2000)
                    {
                      colors[cc] = 'rgb(255, 185, 128)';
                    } else if (gdpData[cc] > 2000)
                    {
                      colors[cc] = 'rgb(216, 122, 128)';
                        /*colors[cc] = '#';
                        for (var i = 0; i<3; i++)
                        {
                            hex = Math.round(startColor[i]
                                + (endColor[i]
                                - startColor[i])
                                * (gdpData[cc] / (max - min))).toString(16);

                            if (hex.length == 1)
                            {
                                hex = '0'+hex;
                            }

                            colors[cc] += (hex.length == 1 ? '0' : '') + hex;
                        }*/
                    }else{
                      colors[cc] = '#e2e8f3';
                    }
                }

                /*let infoTooltip = this.$app.tooltip.create({
                  targetEl: '#vmap',
                  trigger: 'click'
                })*/
                
                this.VectorMap = jQuery('#vmap').vectorMap({
                    map: 'world_en',
                    backgroundColor: '#fff',
                    enableZoom: true,
                    showTooltip: true,
                    colors: colors,
                    hoverOpacity: 0.7,
                    hoverColor: false,
                    selectedColor: false,
                    onRegionOver: function (element, code, region) {
                        //console.log(element)
                        /*let textTemplate = `
                            <p class="no-margin-top size-16">${region}</p>
                            <p class="no-margin-bottom size-12">-1: ${TooltipStatData[code][0]}</p>
                            <p class="no-margin-bottom size-12">_2: ${TooltipStatData[code][1]}</p>
                            <p class="no-margin-bottom size-12">-3: ${TooltipStatData[code][2]}</p>
                            <p class="no-margin-bottom size-12">-4: ${TooltipStatData[code][3]}</p>
                            <p class="no-margin-bottom size-12">_5: ${TooltipStatData[code][4]}</p>
                        `;*/
                        this.msgTooltip = "777"
                        //this.$refs.defaultRef.show();
                        //alert(7)
                        //infoTooltip.show().setText(textTemplate).show();
                    },
                    onRegionOut: function (element, code, region) {
                        //infoTooltip.hide();
                    },
                    onLabelShow: function(event, label, code){
                        event.preventDefault();
                    },

                });
            }
            if(index < 50){
              /*   
            const query_1 = {
              imsi: element.imsi,
              states: false,
              activity: false,
            }
            getSIM(query_1).then(response_1 => {
              const query_2 = {
                id: response_1.data._id
              }
              getSIMCoordinates(query_2).then(response_2 => {
                const query_3 = {
                  lat: response_2.data.geometry.coordinates[1],
                  lon: response_2.data.geometry.coordinates[0]
                }
                getSIMCountry(query_3).then(response_3 => {
                  const country = response_3.data.address.country
                  const countryIndex = this.countries.findIndex( ({ Key }) => Key === country )
                  
                  if(countryIndex != -1){
                    this.countries[countryIndex].Count ++
                  }else{
                    this.countries.push({
                      Key: country,
                      Count: 1
                    })
                  }
                  if((index == 49 && response.data.length > 49) || (index == response.data.length && response.data.length < 49)){
                  }  
                })
              })
            })*/
          }

          totalDataUsage += +element.totalDataUsage
          totalSMSUsage += +element.totalSmsUsage          
          totalFlowUsage += +element.totalFlowUsage

          if(!this.chartArray.hasOwnProperty('data')){
            const current = new Date(element.lastUpdate)
            const currentDate = moment(current, 'YYYY-MM-DD').format('YYYY-MM-DD')   
            const daysUsageCount = +element.days

            for(let i = 0; i < daysUsageCount; i++) {
              const averageDate = moment(current, 'YYYY-MM-DD').add(-(i.toString()), 'days').format('YYYY-MM-DD')            
              const averageData = ((+element.totalDataUsage / 1000000)/daysUsageCount).toFixed(3)  
              const averageSMS = (+element.totalSmsUsage)/daysUsageCount  
              const averageFlow = (+element.totalFlowUsage)/daysUsageCount      
              //const labelDate = averageDate //element.lastUpdate.slice(0,10)
              const indexLabel = arrLabel.indexOf(averageDate)
              if(indexLabel !== -1) {            
                const concatData = +arrData[indexLabel]
                const concatSMS = +arrSMS[indexLabel]
                const concatFlow = +arrFlow[indexLabel]
                arrData[indexLabel] = (+concatData + (+averageData)).toFixed(3) 
                arrSMS[indexLabel] = (+concatSMS + (+averageSMS))
                arrFlow[indexLabel] = (+concatFlow + (+averageFlow))
              }
            }

            if(index == (response.data.length - 1)){            
              if(period !== 1) {
                
                //const emptyDateCount = period - arrLabel.length
                this.chartArray = {
                  labels: arrLabel,
                  data: arrData,
                  sms: arrSMS,
                  flow: arrFlow
                }
                this.fillChartData({labels: arrLabel, dataUsage: arrData})
              }
              //console.log(arrData)
            }
          }
          
        })
  

                
        this.panelData = {
          totalDataUsage: (totalDataUsage/1000000).toFixed(0),
          totalSMSUsage: totalSMSUsage,
          totalFlowUsage: totalFlowUsage,          
          loaded: true
        }        
        
      })    
    },
    fillIMSIData(period = 1){
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
                    
          if(period !== 1) {
            this.fillChartData({labels: arrLabel, dataUsage: arrData})
          }
        })  
      })      
    },    
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'code') {
        this.sortByID(order)
      }
    },
    handleSetLineChartData(type) {
      //this.lineChartData = lineChartData[type]
    },
    fillChartData (data) {      
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
    this.imsi = this.$store.state.dashboard.imsi
    this.searchTotalByPeriod('monthly')
/*
    let gdpData = {};
    let TooltipStatData = {};
    let keys = [
        ["id", "001"],
        ["pg", "002"],
        ["mx", "003"],
        ["ee", "004"],
        ["dz", "005"],
        ["au", "Australia"],
        ["za", "South Africa"],
    ];
    for (let i = 0; i <keys.length ; i++) {
                    let country = this.countries.find( ({ Key }) => Key === keys[i][1] );
                    if(country){
                        gdpData[keys[i][0]] = country.Count[0];
                        TooltipStatData[keys[i][0]]= country.Count;
                    }
                }
                
                for (let i = 0; i <keys.length ; i++) {
                    let province = summData[0].Subs.find( ({ Key }) => Key === keys[i][1] );
                    if(province){
                        gdpData[keys[i][0]] = province.Stats[0];
                        TooltipStatData[keys[i][0]]= province.Stats;
                    }
                }
                gdpData[keys[0][0]] = 70;
                gdpData[keys[1][0]] = 0;
                gdpData[keys[2][0]] = 0;
                gdpData[keys[3][0]] = 0;
                gdpData[keys[4][0]] = 0;

                TooltipStatData[keys[0][0]]= '8';*/

    
  },
  created() {
    this.$store.watch(
      (state)=>{
        return this.$store.state.dashboard.period // could also put a Getter here
      },
      (newValue, oldValue)=>{
        this.switchChartPeriod = newValue
        this.switchTablePeriod = newValue
      },
      {
        deep:true
      }
    )
  
    this.countriesHARD = [
      {name: "ATGA - TEMP SUSPENSION", country: "Australia"},
      {name: "ATGA Admin", country: "Australia"},
      {name: "ATGA LIVE", country: "Australia"},
      {name: "ATGA LOC8", country: "Australia"},
      {name: "ATGA PROTECT", country: "Australia"},
      {name: "Acp global ", country: ""},
      {name: "Agile Tracking Solutions", country: ""},
      {name: "Autoline Ukraine", country: "Ukraine"},
      {name: "Automotive integration", country: "Australia"},
      {name: "Autoz TAC", country: "China"},
      {name: "BSRN Holdings", country: ""},
      {name: "BoatFix", country: "United States of America"},
      {name: "Borderless", country: "Zambia"},
      {name: "CA All customer", country: ""},
      {name: "CUBEVOICE", country: "Australia"},
      {name: "Charged Install Live", country: "Canada"},
      {name: "Charged Install Loc8", country: "Canada"},
      {name: "Charged Install Services", country: "Canada"},
      {name: "Cloudnet", country: "Australia"},
      {name: "Ctrack", country: ""},
      {name: "DSPERFORMANCE", country: ""},
      {name: "Datamobile AG", country: ""},
      {name: "DoBuyDirect", country: "United States of America"},
      {name: "Fox Electronics", country: "Zambia"},
      {name: "GPS TRACKING WA", country: "Australia"},
      {name: "ISPYGPS", country: "Australia"},
      {name: "Jacob Pallister", country: ""},
      {name: "Jet-Xpress", country: ""},
      {name: "Jimmy", country: ""},
      {name: "LisandroSaez", country: ""},
      {name: "M2MDATA API", country: ""},
      {name: "MARINE TG LOC8", country: ""},
      {name: "MARINETG TRACK", country: ""},
      {name: "Marine TG", country: ""},
      {name: "Marks Account", country: ""},
      {name: "Michael Gemmoll", country: ""},
      {name: "NZ Quiktrak", country: ""},
      {name: "Nutech", country: "Canada"},
      {name: "Oryx Systems", country: ""},
      {name: "Oryx cctv", country: "South Africa"},
      {name: "PVS", country: "United Kingdom"},
      {name: "Private APN", country: ""},
      {name: "QTrak", country: ""},
      {name: "Quiktrak Latino America SpA", country: ""},
      {name: "QuiktrakZambia", country: "Zambia"},
      {name: "Russia Quiktrak", country: "Russia"},
      {name: "Scymyn", country: ""},
      {name: "Secure2Go", country: ""},
      {name: "Seguratainer", country: ""},
      {name: "Selftrack", country: ""},
      {name: "SelftrackChile", country: "Chile"},
      {name: "Siguelo", country: ""},
      {name: "Sinopacific Admin", country: ""},
      {name: "Sinopacific Africa", country: ""},
      {name: "Staywired Solutions", country: ""},
      {name: "Stolen Emergency", country: ""},
      {name: "Sub account", country: ""},
      {name: "TERMINATED", country: ""},
      {name: "THETRACKINGCENTRE", country: "Australia"},
      {name: "Tekamo Inc", country: "Canada"},
      {name: "The Tracking Centre Live", country: "Australia"},
      {name: "Thomas Faherty", country: ""},
      {name: "UFind Live", country: "Australia"},
      {name: "UFind Protect", country: "Australia"},
      {name: "Ufind easy park", country: "Australia"},
      {name: "Veetrac", country: "South Africa"},
      {name: "Vehicle Fleet Solutions", country: ""},
      {name: "Vitalgps", country: ""},
      {name: "WardenGPS", country: "United States of America"},
      {name: "albertspain", country: "Spain"},
      {name: "anzac marine", country: ""},
      {name: "autofidelity", country: "Australia"},
      {name: "cartrackcanada", country: "Canada"},
      {name: "dobuydirect-QL8", country: ""},
      {name: "innoveq", country: ""},
      {name: "isstrack", country: "Australia"},
      {name: "m2mdata", country: ""}
    ]
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
        height: '50vh',
        marginTop: '30px',
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
    padding: 40px 50px 0;
    margin-bottom: 32px;    
  }

  .bar-chart-container .chart-wrapper{
    min-height: 70vh;
  }

  .radius-5{
    border-radius: 5px;
  }
}

.menu-container{
  padding-left: 30px;
}


@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>

<style>

.el-radio-button__inner{
  background: transparent;
  color: #606266;
}

.el-radio-button__inner:hover{
  background: rgba(255, 255, 255, .1);
  color: #606266;
}

.el-radio-button__orig-radio:checked+.el-radio-button__inner {
    background-color: #28a5e0;
    -webkit-box-shadow: -1px 0 0 0 #fff;
    box-shadow: -1px 0 0 0 #fff;
}

.is-active .el-radio-button__inner{
  background: #28a5e0;
  border: 1px solid #28a5e0;
  color: #ffffff;
}

.chart-container{
  background:#fff;
  padding: 30px;
  margin-bottom:32px;
}
.jqvmap-zoomin, .jqvmap-zoomout {
    background: #fff !important;
    width: 18px !important;
    height: 18px !important;
}
  .bar-chart-container{
    border-radius: 5px;
  }

  .chart-wrapper{
    border-radius: 5px;
  }

  .w-100{
    width: 100%;
  }

  .d-flex{
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }

  .pointer{
    cursor: pointer;
  }

  .bold {
    font-weight: 600; 
  }

  .color-grey{
    color: #606266;
  }

  .el-radio-button__inner{
    padding: 6px 8px 8px !important;
  }

  .el-table {
    width: 100%;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    -webkit-box-shadow: none;
    box-shadow: none;
  }

  .font-12{
    font-size: 12px;
  }
</style>
