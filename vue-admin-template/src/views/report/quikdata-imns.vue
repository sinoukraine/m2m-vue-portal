<template>
  <el-container class="with-panel-wrapper quikdata-imns-container panel-opened quikdata-imns-page">
     <loading :active.sync="isLoading" 
        :can-cancel="true" 
        :is-full-page="fullPage">
    </loading><!--
        :on-cancel="onCancel"-->

    <el-dialog title="SIM Details" :visible.sync="simFormVisible" width="70%" >
      <el-row :gutter="16">
        <el-col :xs="12" :sm="12" class="pr-0">          
          <div class="table-container">
            <el-table
            :data="simDetailslistLeft"
            fit
            :show-header="false"
            class="modal-info-table"
          >
           <el-table-column label="" align="left">
              <template slot-scope="{row}">
                <span class="table-title">{{row.title}}</span>
              </template>
            </el-table-column>
           <el-table-column label="" align="right">
              <template slot-scope="{row}">
                <span class="table-value">{{row.value}}</span>
              </template>
            </el-table-column>
          </el-table>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" class="pl-0">
          <div class="table-container">            
          <el-table
            :data="simDetailslistRight"
            fit
            :show-header="false"
            class="modal-info-table"
          >
           <el-table-column label="" align="left" >
              <template slot-scope="{row}">
                <span class="table-title">{{row.title}}</span>
              </template>
            </el-table-column>
           <el-table-column label="" align="right" >
              <template slot-scope="{row}">
                <span class="table-value">{{row.value}}</span>
              </template>
            </el-table-column>
          </el-table>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" class="lg-pr-0">
          <div class="chart-container line-chart-container mt-30"
              style="height: 400px;margin-top:30px;">
              <div style="display:flex">
                <div style="display:flex">
                  <div class="square" :style="'background-color:rgb(182, 162, 222);'"></div>
                  <div class="font-12" style="padding: 0 15px;color:#606268">Data MB</div>
                </div> 
                <div style="display:flex">
                    <div class="square" :style="'background-color:#ffb880;'"></div>
                    <div class="font-12" style="padding: 0 15px;color:#606268">Average (MB/day)</div>
                </div> 
                <div style="display:flex">
                    <div class="square" :style="'background-color:#d77980;'"></div>
                    <div class="font-12" style="padding: 0 15px;color:#606268">Limit (MB/day)</div>
                </div> 
              </div>
            <!--<line-chart
              :chart-data="lineCollection"
              :options="lineOptions"
              max-height="250px"
            ></line-chart>-->
            <div id="chart" class="sim-container">
              <apexchart type="line" :height="350" :options="chartOptions" :series="series" />
            </div>
          </div>
          
        </el-col>        
      </el-row>
      <el-row>
        <div class="card-flex">
          <div class="card-inline card-panel-left">
          </div>
          <div class="card-inline card-panel-right">
            <el-button type="info" class="dark-btn mt-25" @click="closeSIMDetails" >Close</el-button>
          </div>
        </div>
      </el-row>
    </el-dialog>

    <el-container>
      <el-main>
        <div class="filter-container">
          <div class="display-flex justify-content-between">
            <div class="buttons-row">
            </div>
            <div class="buttons-row white-space-nowrap">
              <el-button v-waves :loading="downloadLoading" class="button-custom blue-btn" type="primary" @click="handleDownload"><item :icon="'save-white'"/></el-button>
            </div>
          </div>
        </div>

        <!--<el-row style="background:#fff;margin:16px 16px 0;padding:16px 16px 0;margin-bottom:32px;" class="bar-chart-container">
          !--<line-chart :chart-data="lineChartData" />
          <apexchart type="bar" height="350" :options="chartOptions" :series="series"></apexchart>
          <line-chart :chart-data="datacollection" horizontal :styles="barStyles" :options="barOptions" />--

          <div v-if="isChartShown" id="chart">
            <apexchart type="bar" :height="350" :options="chartOptions" :series="series" />
          </div>
        </el-row>-->

        <div class="table-wrapper">
          <el-table
            :key="tableKey"
            v-loading="listLoading"
            :data="displayData"

            fit
            highlight-current-row
            style="width: 100%;border-radius:5px"
            @sort-change="sortChange"
          >
            <!--<el-table-column label="ID" prop="id" align="center" width="180px">
          <template slot-scope="{row}">
            <span>{{ row.code }}</span>
          </template>
        </el-table-column>-->

            <el-table-column label="IMSI" fixed="left"  :class-name="getSortClass('imsi')" align="center" min-width="180px">
              <template slot-scope="{row}">
                <span class="sim-table-icon" @click="showSIMDetails(row)">{{ row.imsi }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Customer" :class-name="getSortClass('customer')" width="180px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.customer }}</span>
              </template>
            </el-table-column>            
            <el-table-column label="Service Profile" width="160px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.csp }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Data Usage(Daily)" width="160px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.totald }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Data Usage(Weekly)" width="160px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.totalw }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Data Usage(Monthly)" width="160px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.totalm }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Data Usage(Yearly)" width="160px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.totaly }}</span>
              </template>
            </el-table-column>
            <el-table-column label="SMS Usage(Daily)" width="160px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.smsd }}</span>
              </template>
            </el-table-column>
            <el-table-column label="SMS Usage(Weekly)" width="160px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.smsw }}</span>
              </template>
            </el-table-column>
            <el-table-column label="SMS Usage(Monthly)" width="160px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.smsm }}</span>
              </template>
            </el-table-column>
            <el-table-column label="SMS Usage(Yearly)" width="160px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.smsy }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Sessions (Daily)" width="160px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.sessionsd }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Sessions (Weekly)" width="160px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.sessionsw }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Sessions (Monthly)" width="160px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.sessionsm }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Sessions (Yearly)" width="160px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.sessionsy }}</span>
              </template>
            </el-table-column>
            <el-table-column label="LastUpdate" width="160px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.lastUpdate }}</span>
              </template>
            </el-table-column>
            <!--<el-table-column label="Actions" align="center" width="200" class-name="small-padding fixed-width">
              <template slot-scope="{row,$index}">
                <el-button type="primary" size="mini" @click="handleUpdate(row)">
                  Edit
                </el-button>
                <el-button v-if="row.Status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
                  Delete
                </el-button>
              </template>
            </el-table-column> @current-change="handleCurrentChange"-->
          </el-table>
        </div>

        <!--<pagination v-show="total>0" 
          :total="total" 
          :page.sync="page"           
        :page-size="limit"
        />-->

      </el-main>

    </el-container>
    <el-aside width="250px" style="" class="chat-sidebar panel panel-right">
      <div class="panel-toolbar panel-toolbar-bottom padding-x2">
        <el-row :gutter="16">
          <el-col :xs="100">
            <label v-waves :for="filterSubmitId" class="el-button el-button--primary width-100 blue-btn">
              <item :icon="'search-white'"/> <span>{{ $t('SEARCH') }}</span>
            </label>
          </el-col>
        </el-row>
      </div>
      
      <div class="panel-container">
        <el-form ref="listQuery" :model="listQuery" label-position="top" class="form-padding" @submit.native.prevent="handleFilter">
          <input :id="filterSubmitId" type="submit" class="display-none">
          <el-row :gutter="16" style="border-bottom: 1px solid #e3e3e3">
            <el-col :xs="100" :sm="100" :md="100" :lg="100">
              <el-form-item label="" prop="title">                
                <span class="label-span">Customer</span>
                <el-select v-model="selectedCustomer" placeholder="Report"  class="filter-item w-100" style="width: 100%;">
                  <el-option v-for="item in customerListOption" :key="item.code" :label="item.name" :value="item.code" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!--<el-row :gutter="16" style="border-bottom: 1px solid #e3e3e3">
            <el-col :xs="100" :sm="100" :md="100" :lg="100">
              <el-form-item label="" prop="title">
                <span class="label-span">Start date</span>
                <el-date-picker v-model="listQuery.date1" value-format="yyyy-MM-dd" type="date" placeholder="Pick a date" style="width: 100%;" />
                <span class="label-span">End date</span>
                <el-date-picker v-model="listQuery.date2" value-format="yyyy-MM-dd" type="date" placeholder="Pick a date" style="width: 100%;" />
              </el-form-item>
            </el-col>
          </el-row>-->
          <el-row :gutter="16" style="">
            <el-col :xs="100" :sm="100" :md="100" :lg="100">
              <!--<el-form-item label="" prop="title">
                
              </el-form-item>-->
              <el-form-item label="" prop="title">
                <span class="label-span">Sorting type</span>
                <el-select v-model="selectedOrder" placeholder="SIM"  class="filter-item w-100" style="width: 100%;">
                  <el-option v-for="item in orderOptions" :key="item.code" :label="item.name" :value="item.code" />
                </el-select>
                <span class="label-span">Period</span>
                <el-select v-model="selectedPeriod" placeholder="Period" clearable class="filter-item w-100" style="width: 100%;">
                  <el-option v-for="item in periodOptions" :key="item.code" :label="item.name" :value="item.code" />
                </el-select>
                <span class="label-span">Ordering by</span>
                <el-select v-model="selectedType" placeholder="Order"  class="filter-item w-100" style="width: 100%;">
                  <el-option v-for="item in typeOptions" :key="item.code" :label="item.name" :value="item.code" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

    </el-aside>
  </el-container>

</template>

<script>
import { getCDRSListAsync, getSIMAsync, getCDRSAsync, getCustomerList, fetchPv, createArticle, updateArticle, deleteArticle } from '@/api/sim'
import { fetchSIMListAjax } from '@/api/user'

import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import LineChart from './components/LineChart.js'
//import LineChart from '../dashboard/admin/components/LineChart.js'
import Item from '@/layout/components/Sidebar/Item'
import VueApexCharts from 'vue-apexcharts'
import moment from 'moment'

const categoryTypeOptions = [
  { code: 'Event', name: 'Data Usage' }
]
const periodOptions = [
  { code: 'D', name: 'Today' },
  { code: 'W', name: 'Week' },
  { code: 'M', name: 'Month' },
  { code: 'Y', name: 'Year' }
]
const limitOptions = [
  { code: '10', name: 'TOP 10' },
  { code: '50', name: 'TOP 50' },
  { code: 'all', name: 'All Sims' }
]
const customerListOption = [
  { code: '0', name: 'All' }
]

const statusOptions = [
  { code: 'A', name: 'A' },
  { code: 'V', name: 'V' }
]

const typeOptions = [
  { code: 'D', name: 'Data' },
  { code: 'S', name: 'SMS' }
]

const orderOptions = [
  { code: 'DataDay', name: 'Data Daily' },
  { code: 'DataMonth', name: 'Data Monthly' },
  { code: 'DataWeek', name: 'Data Weekly' },
  { code: 'DataYear', name: 'Data Yearly' },
  { code: 'SMSMODay', name: 'SMS Daily' },
  { code: 'SessionDay', name: 'Session Daily' },
]

// arr to obj, such as { CN : "China", US : "USA" }
const categoryTypeKeyValue = categoryTypeOptions.reduce((acc, cur) => {
  acc[cur.code] = cur.name
  return acc
}, {})


const today = new Date()

export default {
  name: 'ComplexTable',
  components: {
    Pagination,
    LineChart,
    Loading,
    Item,
    apexchart: VueApexCharts
  },
  
  lineCollection: null,
  lineOptions: {
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
          return tooltipItem.yLabel
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false
  },

  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return categoryTypeKeyValue[type]
    }
  },
  data() {
    return {      
      
        tablePeriod: 'Today',
        tableData: 'data',
      filterSubmitId: Date.now(),
      isLoading: false,
      fullPage: true,
      simFormVisible: false,
      selectedCustomer: '0',
      selectedPeriod: 'D',
      selectedSIMLimit: '10',
      selectedType: 'D',
      selectedOrder: 'DataDay',
      isChartShown: false,
      series: [{
        data: []
      }],
      chartOptions: {
      },
      datacollection: null,
      barOptions: {
        type: 'horizontalBar',
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
      simDetailslistLeft: [],
      simDetailslistRight: [],
      tableKey: 0,
      list: null,
      page: 1,
      total: 0,
      limit: 10,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        date1: moment(today, 'YYYY-MM-DD').add(-10, 'days').format('YYYY-MM-DD'),
        date2: moment(today, 'YYYY-MM-DD').format('YYYY-MM-DD'),
        customer: undefined,
        sort: '+code'
      },
      categoryTypeOptions,
      typeOptions,
      periodOptions,
      orderOptions,
      customerListOption,
      statusOptions,
      // sortOptions: [{ label: 'ID Ascending', code: '+code' }, { label: 'ID Descending', code: '-code' }],
      // statusOptions: ['A', 'V'],
      showAdditionalInfo: false,
      temp: {
        Code: undefined,
        Key: undefined,
        En: undefined,
        UK: undefined,
        ES: undefined,
        RU: undefined,
        PL: undefined,
        PT: undefined,
        FR: undefined,
        DE: undefined,
        BE: undefined,
        AR: undefined,
        Status: 'A',
        Category: 'Event'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        Category: [{ required: true, message: 'category type is required', trigger: 'change' }]
        // timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        // title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  computed: {    
    lineStyles() {
      return {
        position: 'relative',
        height: '200px',
        marginTop: '30px'
      }
    },
    displayData() {
        if (!this.list || this.list.length === 0) return []
        return this.list.slice(this.limit * this.page - this.limit, this.limit * this.page)
    },
    barTypes() {
      return {
        type: 'horizontalBar'
      }
    },
    barStyles() {
      return {

        type: 'horizontalBar',
        position: 'relative',
        height: '30vh'
      }
    }
  },
  created() {
    this.getList()
  },
  mounted() {
 
  },
  methods: {      
    async showSIMDetails(data){        
        this.isLoading = true 
        console.log('d', data)
        this.simDetailslistLeft = [{
              title: 'IMSI',
              value: data.imsi,
            },{
              title: 'ICCID',
              value: data.iccid,
            },{
              title: 'MSISDN',
              value: data.msisdn,
            },{
              title: 'State',
              value: data.state,      
            }]

            this.simDetailslistRight = [{
              title: 'Provider',
              value: data.LbsNetwork,
            },{
              title: 'Data Usage Threshold (MB/month)',
              value: data.Threshold,
            },{
              title: 'Customer',
              value: data.customer,
            },{
              title: 'Update Time',
              value: data.lastUpdate,      
            }]
        /*
        const response = await getSIMAsync(query)
        
        if(!response){          
          this.isLoading = false 
          return
        }*/

        let self = this
        var settings = {
          "url": 'https://test4.m2mdata.co/JT/Report/DailyUsage?IMSI='+data.imsi,
          "method": "POST",
          "timeout": 0,
          "headers": {
          "token": "00000000-0000-0000-0000-000000000000",
          "Content-Type": "application/x-www-form-urlencoded"
          },
          "data": {
            "Since": moment(today, 'YYYY-MM-DD').add(-10, 'days').format('YYYY-MM-DD'),
            "page": "1",
            "rows": "100"
          }
        };

        $.ajax(settings).done(function (response) { 
          console.log(response.Data)
          if(response.Data.length){

            const arrLabel = [], arrData = []
            let totalData = 0
            response.Data.forEach(element => {
              arrLabel.push(element.Date.slice(0, 10))
              let chartData = element.Usage/1048576
              arrData.push((+chartData).toFixed(1))
              totalData += +chartData
            })
            const averageData = totalData/response.Data.length

            self.chartOptions = {
              chart: {
                height: 350,
                offsetX: 0,
                type: 'line',
              },          
              stroke: {
                width: [0, 1, 1]
              },          
              markers: {
                size: [0, 4, 4]
              },
              colors: ['rgb(182, 162, 222)', '#ffb880', '#d77980'],
              dataLabels: {
                enabled: false
              },          
                legend: {
                  show: false
                },
              grid: {
                show: true,
                xaxis: {
                  categories: arrLabel,
                  lines: {
                    show: true
                  }
                },
                yaxis: {
                  lines: {
                    show: true
                  },
                }
              },
              yaxis: {            
                  labels: {
                    formatter: function(val, index) {
                      return val.toFixed(2)
                    }
                  }
              },
              xaxis: {
                categories: arrLabel
              }
            }

            self.series = [{
              name: 'Data Usage',
              data: arrData,
              type: 'column'
            },
            {
              name: 'Average',
              type: 'line',
              data: arrData.map(el=>el=averageData)
            },
            {
              name: 'Limit',
              type: 'line',
              data: arrData.map(el=>el=5)
            }]
            /*
            const query_1 = {
              id: response.data._id,
              date1: moment(today, 'YYYY-MM-DD').add(-10, 'days').format('YYYY-MM-DD'),
              date2: moment(today, 'YYYY-MM-DD').format('YYYY-MM-DD')
            }
            
            const response_1 = await getCDRSAsync(query_1)
           */

            self.isChartShown = true

            self.simFormVisible = true  
            self.isLoading = false 
            
          }
        })

        
    },
    closeSIMDetails(){      
        this.simFormVisible = false  
    },
    handleCurrentChange(val) {
        console.log(`current page: ${val}`);
        this.page = val;
    },
    fillData() {
      this.datacollection = {
        labels: ['jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec', 'jan', 'fab', 'mar', 'apr', 'may', 'jun', 'jul'],
        plotOptions: {
          bar: {
            //horizontal: true
          }
        },
        datasets: [
          {
            label: 'Activations',
            backgroundColor: '#f87979',
            data: [100, 120, 161, 134, 105, 160, 165, 105, 100, 181, 114, 115, 169, 165]
          }
          /*, {
              label: 'Data Volume',
              backgroundColor: '#f87979',
              data: [this.getRandomInt(), this.getRandomInt()]
            }*/
        ]
      }
    },
    getRandomInt() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5
    },
    async getList() {
      this.listLoading = true


      /*~~getCustomerList().then(response => {
        this.customerListOption.length = 0
        this.customerListOption.push({ code: '0', name: 'All' })
        response.data.forEach(element => {
          this.customerListOption.push({ code: element._id, name: element.info.name })
        })
      })*/

      this.list = []
      let pref_1 = this.selectedType
      let sort = this.selectedOrder
      let pref_2 = this.selectedPeriod    
      this.listLoading = true
      //const today = new Date()
      
      const current = moment()          

      let self = this

      fetchSIMListAjax({
          'UsageReportType': pref_1 + pref_2,
          'sort': sort,
          'order': 'desc' 
        }).then(response => {

      //$.ajax(settings).done(function (response) { 
          let rows = response.rows   
          
          const arrTable = []

          rows.forEach((element, index) => {
            //const tableDataUsageTotal = (+element.totalDataUsage / 1000000)
            //const tableSMSUsageTotal = element.totalSmsUsage == 'undefined' ? 0 : (+element.totalSmsUsage)
            //const tableFlowUsageTotal = element.totalFlowUsage == 'undefined' ? 0 : (+element.totalFlowUsage)
            arrTable.push({
              imsi: element.IMSI.toString(),
              iccid: element.ICCID.toString(),
              msisdn: element.MSISDN.toString(),
              customer: element.OrganizeName,
              csp: element.ServiceProfileName,              
              totald: (element.DataDay/1048576).toFixed(3),
              totalw: (element.DataWeek/1048576).toFixed(3),
              totalm: (element.DataMonth/1048576).toFixed(3),
              totaly: (element.DataYear/1048576).toFixed(3),
              smsd: element.SMSMODay + element.SMSMTDay,
              smsw: element.SMSMOWeek + element.SMSMTWeek,
              smsm: element.SMSMOMonth + element.SMSMTMonth,
              smsy: element.SMSMOYear + element.SMSMTYear,
              sessionsd: element.SessionDay,
              sessionsw: element.SessionWeek,
              sessionsm: element.SessionMonth,
              sessionsy: element.SessionYear,
              state: element.State,
              LbsNetwork: element.LbsNetwork,              
              Threshold: element.ThresholdName,      
              lastUpdate: element.DataUpdateTime!==null?element.DataUpdateTime.slice(0, 10):''
          })
        })

        self.list = arrTable
        self.listLoading = false
      })
      /*~~const response = await getCDRSListAsync(this.listQuery)
      if(!response){
        return
      }
      //.then(response => {
        this.total = response.data.length
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)

        this.list = response.data
      //})
      */
    },
    handleFilter() {
      this.listQuery.page = 1
      this.listQuery.customer = this.selectedCustomer==='0'?undefined:this.selectedCustomer
      this.listQuery.limit = this.selectedSIMLimit==='all'?undefined:this.selectedSIMLimit     
      console.log(this.selectedType) 
      this.listQuery.sms = this.selectedType === 'sms'?'sms':undefined
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: 'Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'code') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+code'
      } else {
        this.listQuery.sort = '-code'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        Code: undefined,
        Key: undefined,
        EN: undefined,
        UK: undefined,
        ES: undefined,
        RU: undefined,
        PL: undefined,
        PT: undefined,
        FR: undefined,
        DE: undefined,
        BE: undefined,
        AR: undefined,
        Status: 'A',
        Category: 'Event'
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      const tempData = Object.assign({}, this.temp)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          delete tempData.Code
          tempData.token = '00000000-0000-0000-0000-000000000000'
          createArticle(tempData).then((response) => {
            // console.log(response)
            this.temp.Code = response.Data.Code
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      // this.temp.timestamp = new Date(this.temp.timestamp)
      this.temp.token = '00000000-0000-0000-0000-000000000000'
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.code === this.temp.code)
            this.list.splice(index, 1, this.temp)

            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      row.token = '00000000-0000-0000-0000-000000000000'
      deleteArticle(row).then(() => {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      })
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['iccid', 'imsi','state', 'msisdn', 'customer', 'csp', 'Data Usage Day', 'Data Ussage Week', 'Data Ussage Month', 'Data Ussage Year', 'SMS Ussage Day', 'SMS Ussage Week', 'SMS Ussage Month', 'SMS Ussage Year', 'Session Day', 'Session Week', 'Session Month', 'Session Year', 'Last update']
        const filterVal = ['iccid', 'imsi','state', 'msisdn', 'customer', 'csp', 'totald', 'totalw', 'totalm', 'totaly', 'smsd', 'smsw', 'smsm', 'smsy', 'sessionsd', 'sessionsw', 'sessionsm', 'sessionsy', 'lastUpdate']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'data-usage-report'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>

<style lang="scss">
@import '../../styles/variables.scss';
  .rotate-90{
    transform: rotate(90deg);
  }
 
  .quikdata-imns-page .chat-sidebar{
    background-color: rgb(255, 255, 255);
    color: #333;

    -webkit-box-shadow: 0 1px 4px rgba(0,21,41,0.08);
    box-shadow: 0 1px 4px rgba(0,21,41,0.08);
  }
  .quikdata-imns-page .sidebar-header{
    height: 50px;
    line-height: 50px;
    overflow: hidden;
    position: relative;
    background: #fff;
    -webkit-box-shadow: 0 1px 4px rgba(0,21,41,0.08);
    box-shadow: 0 1px 4px rgba(0,21,41,0.08);
    z-index: 1;
    padding-left: 16px;
    padding-right: 16px;
  }
  .quikdata-imns-page .list{
    list-style: none;
    position: relative;
    margin: 0;
    padding-left: 0;
    background-color: #fff;
    border: none;
    height: 100%;
    width: 100%!important;
    font-size: 14px;

    .item-content{
      box-sizing: border-box;
      padding-left: 16px;
      min-height: 48px;
      display: -webkit-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      -webkit-box-pack: justify;
      -ms-flex-pack: justify;
      -webkit-justify-content: space-between;
      justify-content: space-between;
      -webkit-box-align: center;
      -ms-flex-align: center;
      -webkit-align-items: center;
      align-items: center;

      .item-append{
        display: -webkit-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -webkit-box-flex: 0;
        -webkit-flex-shrink: 0;
        -ms-flex: 0 0 auto;
        flex-shrink: 0;
        -webkit-box-lines: single;
        -moz-box-lines: single;
        -webkit-flex-wrap: nowrap;
        -ms-flex-wrap: none;
        -ms-flex-wrap: nowrap;
        flex-wrap: nowrap;
        -webkit-box-align: center;
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
        box-sizing: border-box;
        padding-top: 8px;
        padding-bottom: 8px;
        min-width: 40px;
      }
      .item-inner{
        padding-right: 16px;
        position: relative;
        width: 100%;
        padding-top: 8px;
        padding-bottom: 8px;
        min-height: 48px;
        box-sizing: border-box;
        -webkit-box-flex: 1;
        -ms-flex: 1;
        min-width: 0;
        display: -webkit-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        -webkit-justify-content: space-between;
        justify-content: space-between;
        -webkit-box-align: center;
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
        -ms-flex-item-align: stretch;
        -webkit-align-self: stretch;
        align-self: stretch;

        .item-title{
          min-width: 0;
          -webkit-box-flex: 1;
          -webkit-flex-shrink: 1;
          -ms-flex: 0 1 auto;
          flex-shrink: 1;
          white-space: nowrap;
          position: relative;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }

        .item-after{
          white-space: nowrap;
          color: #757575;
          -webkit-box-flex: 0;
          -webkit-flex-shrink: 0;
          -ms-flex: 0 0 auto;
          flex-shrink: 0;
          margin-left: 8px;
          display: -webkit-box;
          display: -ms-flexbox;
          display: -webkit-flex;
          display: flex;
          max-height: 28px;
          font-size: 14px;
        }
      }

    }

  }
  .messages{
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    min-height: 100%;
    position: relative;
    z-index: 1;

    .messages-title{
      text-align: center;
      width: 100%;
      line-height: 1;

      font-size: 12px;
      color: rgba(0,0,0,.51);
      margin-top: 16px;
    }
    .message {
      max-width: 70%;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: end;
      -webkit-align-items: flex-end;
      -ms-flex-align: end;
      align-items: flex-end;
      position: relative;
      z-index: 1;
      -webkit-transform: translate3d(0,0,0);
      transform: translate3d(0,0,0);

      margin-top: 16px;

      &.message-sent {
        text-align: right;
        -webkit-box-orient: horizontal;
        -webkit-box-direction: reverse;
        -webkit-flex-direction: row-reverse;
        -ms-flex-direction: row-reverse;
        flex-direction: row-reverse;
        -webkit-align-self: flex-end;
        -ms-flex-item-align: end;
        align-self: flex-end;

        margin-right: 8px;

        .message-content {
          -webkit-box-align: end;
          -webkit-align-items: flex-end;
          -ms-flex-align: end;
          align-items: flex-end;
        }
        .message-from+.message-content {
          margin-right: 8px;
        }

        .message-bubble {
          color: #333;
          background: #c8e6c9;
        }
        &.message-tail .message-bubble:before {
          position: absolute;
          content: '';
          border-right: 8px solid transparent;
          border-left: 0 solid transparent;
          border-bottom: 8px solid #c8e6c9;
          left: 100%;
          bottom: 0;
          width: 0;
          height: 0;
        }
      }

      &.message-received {
        -webkit-box-orient: horizontal;
        -webkit-box-direction: normal;
        -webkit-flex-direction: row;
        -ms-flex-direction: row;
        flex-direction: row;

        margin-left: 8px;

        .message-content {
          -webkit-box-align: start;
          -webkit-align-items: flex-start;
          -ms-flex-align: start;
          align-items: flex-start;
        }

        .message-from+.message-content {
          margin-left: 8px;
        }

        .message-bubble {
          color: #333;
          background: #ccc;
        }
        &.message-tail .message-bubble:before {
          position: absolute;
          content: '';
          border-left: 8px solid transparent;
          border-right: 0 solid transparent;
          border-bottom: 8px solid #ccc;
          right: 100%;
          bottom: 0;
          width: 0;
          height: 0;
        }
      }

      .message-from {
        /*border-radius: 50%;*/
        position: relative;
        background-size: cover;
        -webkit-align-self: flex-end;
        -ms-flex-item-align: end;
        align-self: flex-end;
        -webkit-flex-shrink: 0;
        -ms-flex-negative: 0;
        flex-shrink: 0;
      }

      .message-content {
        position: relative;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;

        .message-footer, .message-header {
          line-height: 1;
          font-size: 12px;

          color: rgba(0,0,0,.51);
        }
        .message-header{
          margin-bottom: 2px;
        }
        .message-footer {
          font-size: 11px;
          margin-bottom: -1em;

          margin-top: 2px;
        }

        .message-bubble {
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          word-break: break-word;
          display: -webkit-box;
          display: -webkit-flex;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-orient: vertical;
          -webkit-box-direction: normal;
          -webkit-flex-direction: column;
          -ms-flex-direction: column;
          flex-direction: column;
          position: relative;
          line-height: 1.2;

          font-size: 16px;
          border-radius: 2px;
          padding: 6px 8px;
          min-height: 32px;

          .message-text-footer, .message-text-header {
            font-size: 12px;
            line-height: 1;

            color: rgba(0,0,0,.51);
          }
          .message-text-header {
            margin-bottom: 4px;
          }
          .message-text-footer {
            margin-top: 4px;
          }
          .message-text {
            text-align: left;
          }
        }
      }
    }
  }

 

</style>

<style > 

  .chart-container{
    background:#fff;
    padding: 30px;
    border-radius: 5px;
  }

  .sim-container{
    overflow: hidden;
    width: 100%;
    height: 439px;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  .el-dialog{
    background-color:#f2f5fb;
  }
  .el-dialog__title{
    color: #606268;
    font-weight: 600;
    font-size: 14px;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #909399;
    font-weight: bold;
    font-size: 14px;
  }
  .modal-info-table{
    width: 100%;
    background-color:#ffffff;
    box-shadow: none;
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
  }
  .modal-info-table td{
    background-color: initial !important;
  }
  .el-table td{
    padding: 10px 0;
    font-size: 12px;
  }
  .modal-info-table td .cell{
    white-space: nowrap; /* Запрещаем перенос строк */
    overflow: hidden; /* Обрезаем все, что не помещается в область */
    text-overflow: ellipsis; /* Добавляем многоточие */
  }



.sim-table-icon{      
    cursor: pointer;
    color: #28a5e0;
  }
.label-span{
  color: #9a9a9a;
  font-size: 12px;
}
.el-container{
  background-color: #f2f5fb !important;
}

.el-button--outline{
  border: none;
      -webkit-box-shadow: 0 1px 1px rgba(0,11,5,0.08);
      box-shadow: 0 1px 1px rgba(0,11,5,0.08);
}

.blue-btn{
  border-color: #28a5e0;
  background-color: #28a5e0;
}
.blue-btn:hover,.blue-btn:active,.blue-btn:focus{
  border-color: #32aee8;
  background-color: #32aee8;
}
.pagination-container{
  margin: 20px;
  border-radius: 5px;
}

.el-footer{
    bottom: 0;
    position: absolute;
}

.bar-chart-container {
    border-radius: 5px;
}

.bar-chart-container .apexcharts-toolbar {
    display: none;
}

.table-title{  
    color: #97a8be;
}
.table-value {
  color: #606268;
}
.pr-0{
  padding-right: 0 !important;
}
.pl-0{
  padding-left: 0 !important;
}
.table-container{
  background-color:#fff;
  padding:0 10px
}
div.square {
    border-radius: 3px;
    width: 24px;
    height: 14px;
}
.apexcharts-toolbar{
  display: none;
}
.dark-btn{
    border-color: #304257;
    background-color: #304257;
  }
  .dark-btn:hover,.dark-btn:active,.dark-btn:focus{
    border-color: #35475c;
    background-color: #35475c;
  }

 .mt-25{
   margin-top:25px;
 }
 .card-panel-right{
   text-align:right;
 }
 
.el-aside {
    overflow: auto;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    -ms-flex-negative: 0;
    flex-shrink: 0;
}

.el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #28a5e0;
}
/*.el-table{
  margin-top: 20px;
}
.el-dialog{
  min-width: 400px;
}
@media (max-width: 991px){
  .el-form{
    width: 100% !important;
    margin-left: 0px !important;
  }
  .el-dialog{
    width: 90%;
  }
}*/
</style>
