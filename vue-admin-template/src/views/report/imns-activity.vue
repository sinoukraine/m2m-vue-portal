<template>
  <el-container v-if="Permission['REPORTS']>0" class="with-panel-wrapper quikdata-imns-container panel-opened imns-activity-page">
     <loading :active.sync="isLoading" 
        :can-cancel="true" 
        :is-full-page="fullPage">
    </loading><!--
        :on-cancel="onCancel"-->

    <el-container>

      <el-main>
          
        <!--<el-row :gutter="16" style="background:#fff;margin:16px 16px;padding:16px;margin-bottom:32px;" class="bar-chart-container">
            <el-col :xs="24" :sm="24" class="pr-0"> 
                <div id="chart" class="">
                <apexchart type="line" :height="350" :options="chartOptions" :series="series" />
                </div>
            </el-col>
        </el-row>-->
        
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

            <el-table-column label="Date"  align="center" min-width="120px">
              <template slot-scope="{row}">
                <span>{{ row.Date }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Sessions" width="160px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.Session }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Data Usage(MB)" width="160px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.Usage }}</span>
              </template>
            </el-table-column>
            <el-table-column label="SMS Usage" width="160px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.SMS }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Duration" width="160px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.Duration }}</span>
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

        <pagination v-show="total>0" 
          :total="total" 
          :page.sync="page"           
        :page-size="limit"
        />

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
          <el-row :gutter="16" style="margin-top:10px;border-bottom: 0px solid #e3e3e3">
            <el-col :xs="100" :sm="100" :md="100" :lg="100">
                <el-form-item :label="$t('IMSI')" prop="imsi" class="">
                    <el-select
                      ref="imsiSearchSelect"
                      v-model="searchedIMSI"
                      :remote-method="querySearchIMSI"
                      filterable
                      default-first-option
                      remote
                      placeholder="Search by IMSI"
                      class="imsi-search-select"
                      @change="changeIMSI"
                    >
                      <el-option v-for="item in imsiArr" :key="item.code" :value="item" :label="item.title" />
                    </el-select>
                </el-form-item>

              <!--<el-form-item label="" prop="title">                
                <span class="label-span">Customer</span>
                <el-select v-model="selectedCustomer" placeholder="Report"  class="filter-item w-100" style="width: 100%;">
                  <el-option v-for="item in customerListOption" :key="item.code" :label="item.name" :value="item.code" />
                </el-select>
              </el-form-item>-->
            </el-col>
          </el-row>
          <el-row :gutter="16" style="border-bottom: 0px solid #e3e3e3">
            <el-col :xs="100" :sm="100" :md="100" :lg="100">
              <el-form-item label="" prop="title">
                <span class="label-span">Start date</span>
                <el-date-picker v-model="listQuery.date1" value-format="yyyy-MM-dd" type="date" placeholder="Pick a date" style="width: 100%;" />
                <span class="label-span">End date</span>
                <el-date-picker v-model="listQuery.date2" value-format="yyyy-MM-dd" type="date" placeholder="Pick a date" style="width: 100%;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16" style="">
            <el-col :xs="100" :sm="100" :md="100" :lg="100">
              <!--<el-form-item label="" prop="title">
                <span class="label-span">Period</span>
                <el-select v-model="selectedPeriod" placeholder="Period" clearable class="filter-item w-100" style="width: 100%;">
                  <el-option v-for="item in periodOptions" :key="item.code" :label="item.name" :value="item.code" />
                </el-select>
              </el-form-item>
              <el-form-item label="" prop="title">
                <span class="label-span">SIM</span>
                <el-select v-model="selectedSIMLimit" placeholder="SIM"  class="filter-item w-100" style="width: 100%;">
                  <el-option v-for="item in limitOptions" :key="item.code" :label="item.name" :value="item.code" />
                </el-select>
              </el-form-item>-->
            </el-col>
          </el-row>
        </el-form>
      </div>

    </el-aside>
  </el-container>
<div v-else class="no-data-info">    
  <div class="py-20">
    Permission denied
  </div>
</div>  

</template>

<script>
import { getSIMList, getCDRSListAsync, getSIMAsync, getCDRSAsync, getCustomerList, fetchPv, createArticle, updateArticle, deleteArticle } from '@/api/sim'
import { fetchSIMListAjax } from "@/api/user";
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
import { Permission } from '@/utils/role-permissions'

const categoryTypeOptions = [
  { code: 'Event', name: 'Data Usage' }
]
const periodOptions = [
  { code: '0', name: '10 days' }
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
        Permission,
      searchedIMSI: '',
      filterSubmitId: Date.now(),
      isLoading: false,
      fullPage: true,
      simFormVisible: false,
      selectedCustomer: '0',
      selectedPeriod: '0',
      selectedSIMLimit: '10',
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
      imsiArr: [],
      tableKey: 0,
      list: null,
      page: 1,
      total: 0,
      limit: 10,
      listLoading: false,
      listQuery: {
        page: 1,
        //limit: 10,
        date1: moment(today, 'YYYY-MM-DD').add(-10, 'days').format('YYYY-MM-DD'),
        date2: moment(today, 'YYYY-MM-DD').format('YYYY-MM-DD'),
        //customer: undefined,
        sort: '+code'
      },
      categoryTypeOptions,
      periodOptions,
      limitOptions,
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
    
  },
  mounted() {
 
  },
  methods: {      
    querySearchIMSI(query) {
      if (query !== '') {        
        if(query.length > 4) {
          this.searchIMSI(query)
        }      
      } else {
        this.imsiArr = []
      }
    },
    async searchIMSI(query) {
      const arr = []      
      this.imsiArr = []
      
      this.simListQuery = {
        Rows: 5,
        q: query,
      }
      fetchSIMListAjax(this.simListQuery).then(response => { 
      
        response.rows.forEach(element => {
          arr.push({
            code: element.IMSI,
            title: element.IMSI
          })
        })
        this.imsiArr = arr  
      })  
    },
    changeIMSI(val) {
      this.imsiArr = []
      this.searchedIMSI = val.title
      //this.listHistoryQuery.imsi = val.title
    },
    async showSIMDetails(data){        
        this.isLoading = true 
        const query = {
          imsi: data.imsi,
          //activity: true
        }
        const response = await getSIMAsync(query)
        
        if(!response){          
          this.isLoading = false 
          return
        }

        this.simDetailslistLeft = [{
          title: 'IMSI',
          value: data.imsi,
        },{
          title: 'ICCID',
          value: response.data.info.iccid,
        },{
          title: 'MSISDN',
          value: response.data.info.msisdn,
        },{
          title: 'Description',
          value: response.data.info.description,      
        }]

        this.simDetailslistRight = [{
          title: 'Provider',
          value: response.data.info.provider,
        },{
          title: 'Data Usage Threshold (MB/month)',
          value: response.data.settings.dataUsageThresholds.daily?.name,
        },{
          title: 'Customer',
          value: data.customer,
        },{
          title: '.',
          value: '',      
        }]
        
        const query_1 = {
          id: response.data._id,
          date1: moment(today, 'YYYY-MM-DD').add(-10, 'days').format('YYYY-MM-DD'),
          date2: moment(today, 'YYYY-MM-DD').format('YYYY-MM-DD')
        }
        
        const response_1 = await getCDRSAsync(query_1)
        const arrLabel = [], arrData = []
        let totalData = 0
        response_1.data.forEach(element => {
          arrLabel.push(element.date.slice(0, 10))
          let chartData = element.totals?.data.originalUnits/1048576
          arrData.push((+chartData).toFixed(1))
          totalData += +chartData
        })
        const averageData = totalData/response_1.data.length

        this.chartOptions = {
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

        this.series = [{
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

        this.isChartShown = true

        this.simFormVisible = true  
        this.isLoading = false 
    },
    closeSIMDetails(){      
        this.simFormVisible = false  
    },
    handleCurrentChange(val) {
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
      this.list = []
      this.listLoading = true
    
       let self = this
        var settings = {
          "url": 'https://test4.m2mdata.co/JT/Report/DailyUsage?IMSI='+this.listQuery.imsi,
          "method": "POST",
          "timeout": 0,
          "headers": {
          "token": "00000000-0000-0000-0000-000000000000",
          "Content-Type": "application/x-www-form-urlencoded"
          },
          "data": {
            "From": this.listQuery.date1,
            "To": this.listQuery.date2,
            "page": "1",
            "rows": "100"
          }
        };

        $.ajax(settings).done(function (response) { 
          console.log(response)
          if(response.Data.length){

            self.total = response.Data.length
            self.list = response.Data.map(el => ({...el, Date: el.Date.slice(0, 10), Duration: el.Duration.toString(), Usage: (el.Usage/1048576).toFixed(3), SMS: el.SMSMOUsage + el.SMSMTUsage,  Session: el.Session }))
           
            //self.list = response.Data
          }else{

          }
          setTimeout(() => {
              self.listLoading = false
            }, 1.5 * 1000)

        })
        /*const query = {
          imsi: this.listQuery.imsi,
          //activity: true
        }
        const response = await getSIMAsync(query)
        
        if(!response){          
          this.isLoading = false 
          return
        }
        this.listQuery.id = response.data._id
        const response_1 = await getCDRSAsync(this.listQuery)
        if(!response_1){
          return
        }*/
        
    },
    handleFilter() {
      this.listQuery.page = 1
      //this.listQuery.customer = this.selectedCustomer==='0'?undefined:this.selectedCustomer
      //this.listQuery.limit = this.selectedSIMLimit==='all'?undefined:this.selectedSIMLimit   
      if(this.searchedIMSI){
        this.listQuery.imsi = this.searchedIMSI   
        this.getList()
      }else{        
      this.$alert('Please choose IMSI number', 'M2M Data Message', {type: 'message'})
      }
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
        const tHeader = ['date', 'duration', 'data usage', 'sms usage', 'session']
        const filterVal = ['Date', 'Duration', 'Usage', 'SMS', 'Session']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'imns-activity-report'
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

</style>

<style > 
.imns-activity-page .form-padding {
  padding: 0px 20px;
}
</style>
