<template>
  <div v-if="Permission['HOME']>0" class="dashboard-editor-container">
    <el-row :gutter="40" >
      <el-col :xs="24" :sm="24" :lg="12" style="">
        <panel-group
          :all="true" 
          :lg="12"
          :total="panelData"
          @change="searchTotalByPeriod"
        />
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12" style="">
        <box-card :box="boxData"
          @change="searchComparing"
            v-loading="listLoadingBox"
        />
      </el-col>
    </el-row>
      
    <el-row :gutter="40">
      <el-col :xs="24" :sm="24" :lg="24" style="margin-bottom:30px;">
        <div class="w-100 d-flex" style="padding: 20px 30px;background-color: #ffffff;border-top-left-radius: 5px;border-top-right-radius: 5px;">
            <div class="card-inline card-panel-left font-16 bold color-grey">
            Top 10 Metrics
            </div>
            <div class="card-inline card-panel-right d-flex">
            <el-radio-group v-model="switchTablePeriod" @input="handleTablePeriod" >
                <el-radio-button label="Today" type="outline"/>
                <el-radio-button label="Week" type="outline"/>
                <el-radio-button label="Month" type="outline"/>
            </el-radio-group>
            <el-dropdown class="menu-container right-menu-item hover-effect pointer" trigger="click" @command="handleTableData">
              <div class="menu-wrapper">
                <img src="menu.svg" class="menu-dropdown">
              </div>
              <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="Data Usage">Data Usage</el-dropdown-item>
                  <el-dropdown-item command="SMS Usage">SMS Usage</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            </div>
        </div><!--:key="tableKey"-->
        <el-table
            
            v-loading="listLoading"
            :data="list"
            fit
            border
            highlight-current-row
            style="width: 100%;"
          >
           <el-table-column label="№" align="center" width="60px">
              <template slot-scope="{row}">
                <span>{{ row.num }}</span>
              </template>
            </el-table-column>
           <el-table-column label="IMSI" align="center" width="160px">
              <template slot-scope="{row}">
                 <router-link class="link" :to="{ path: `/sim-list/${row.imsi}` }">
                    {{ row.imsi }}
                  </router-link>
              </template>
            </el-table-column>
            <el-table-column label="Customer"  min-width="120px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.customer }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Service Profile" width="160px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.csp }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Data Usage(MB)" width="100px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.total }}</span>
              </template>
            </el-table-column>
            <el-table-column label="SMS Usage" width="58px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.sms }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Sessions" width="75px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.sessions }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Last Update" width="120px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.lastUpdate }}</span>
              </template>
            </el-table-column>
          </el-table>
      </el-col>
    </el-row>

    <el-row :gutter="40" >
      <el-col :xs="24" :sm="24" :lg="12" style="">
        <div class="chart-wrapper">
        <div class="w-100 d-flex" >
            <div class="card-inline card-panel-left font-16 bold color-grey" style="margin: 0px;margin-left: -20px;">
              Service
            </div>
            <div class="card-inline card-panel-right d-flex">
            </div>
        </div>
        
          <pie-chart :pie="cspData"/>
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="chart-wrapper">
          <div class="w-100 d-flex">
            <div class="card-inline card-panel-left font-16 bold color-grey" style="margin: 0px;margin-left: -20px;">
              SIM Inventory
            </div>
          </div>
          <pie-chart :pie="stateData"/>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="40">
      <el-col :xs="24" :sm="24" :lg="24" style="">
        <div key="key-vmap" class="card col-100 large-30 no-margin margin-bottom" style="border: none;background-color: #ffffff;border-radius: 5px;">
            <div class="w-100 d-flex" style="padding: 37px 30px">
                <div class="card-inline card-panel-left font-16 bold color-grey">
                    SIMs
                </div>
            </div>
            <div class="card-content center">
                <div id="vmap" class="margin-top radius-5" style="height: 320px;" data-plugin="vectorMap" data-map="world_en"></div>
            </div>
            <div class="w-100  center" style="padding: 30px;text-align: center">  
                <div style="display:flex">
                    <div style="display:flex">
                        <div class="square" :style="'background-color:#41bea2;'"></div>
                        <div class="font-12 color-grey" style="padding: 0 15px">0 - 100</div>
                    </div>           
                    <div style="display:flex">
                        <div class="square" :style="'background-color:#feec81;'"></div>
                        <div class="font-12 color-grey" style="padding: 0 15px">101 - 500</div>
                    </div>          
                    <div style="display:flex">
                        <div class="square" :style="'background-color:#ffb880;'"></div>
                        <div class="font-12 color-grey" style="padding: 0 15px">501 - 2000</div>
                    </div>         
                    <div style="display:flex">
                        <div class="square" :style="'background-color:#d77980;'"></div>
                        <div class="font-12 color-grey" style="padding: 0 15px">2000 +</div>
                    </div>                   
                </div>   
            </div>
        </div>
      </el-col>
    </el-row>
  </div>
  <div v-else class="no-data-info">    
    <div class="py-20">
      Permission denied
    </div>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import PieChart from './components/PieChart'
import LineChart from './components/LineChart.js'
import BoxCard from './components/BoxCard'
import moment from 'moment'
import { addUser, getUserList, getDemoOwerview, getDemoTopUsage, getCDRSList } from '@/api/sim'
import { getDashboardAjax, fetchSIMListAjax } from '@/api/user'
import { Permission } from '@/utils/role-permissions'
//import { fetchPermissionList } from '@/api/role'

export default {
  name: 'Dashboard',
  components: {
    PieChart,
    PanelGroup,
    LineChart,
    BoxCard
  },
  data() {
    return {
        Permission,
        tablePeriod: 'Today',
        tableData: 'Data Usage',
        boxData: {
          day: 0,
          month: 0,
          year: 0
        },
        panelData: {
          totalDataUsage: 0,
          totalSMSUsage: 0,
          totalDuration: 0,
          totalDataSessions: 0,
          loaded: false
        },
        mapLoading: true,
        listLoading: true,
        listLoadingBox: true,
        list: [],        
        switchTablePeriod: 'Today',
        stateData: [],
        cspData: []        
    }
  },
  methods: {
    async initDasboard(){
      this.listLoadingBox = true
      let self = this

      
      getDashboardAjax().then(response => {
        if(response.MajorCode == '000'){
          let total = response.Data   
          self.boxData = {
            day: total.SessionDay,
            month: total.SessionMonth,
            year: total.SessionYear,
            preDay: total.PreSessionDay,
            preMonth: total.PreSessionMonth,
            preYear: total.PreSessionYear,
            loaded: true,
            report: 'Data Sessions'
          }     
          self.listLoadingBox = false    
          
          self.panelData = {
            totalDataUsage: total.DataDay ? total.DataDay/1048576 : 0,
            totalSMSUsage: total.SMSMODay + total.SMSMTDay,
            totalDuration: total.OnlineNumbersDay,//(3600*response.Table3[0].JTOV_DATA_DAY)/(response.Table3[0].JTOV_DURATION_DAY*1048576),
            totalDataSessions: total.SessionDay,
            loaded: true
          }

          const newCspArr = []         
          const cspArr = Object.keys(total.ServiceProfiles)
          cspArr.forEach(element => {
            newCspArr.push({
              name: element, 
              value: total.ServiceProfiles[element]
            })
          })
          self.cspData = newCspArr

          const newStateArr = []         
          const stateArr = Object.keys(total.Status)
          stateArr.forEach(element => {
            newStateArr.push({
              name: element, 
              value: total.Status[element]
            })
          })
          self.stateData = newStateArr

          self.searchTable()
         
          const gdpData = []
          const colors = []
          let cc 

          self.mapLoading = false
          /*total.Countries.forEach(element => {
              gdpData[element.JTOV_DATA_COUNTRY_CODE] = element.JTOV_SIM_NUMBERS
          })*/     
          const countryArr = Object.keys(total.Countries)
          countryArr.forEach(element => {
            gdpData[element] = total.Countries[element]
          })

          for (cc in gdpData) {
              if (gdpData[cc] > 0 && gdpData[cc] <= 100) {
                  colors[cc] = '#41bea2'
              } else if (gdpData[cc] > 100 && gdpData[cc] <= 500) {
                  colors[cc] = '#feec81'
              } else if (gdpData[cc] > 500 && gdpData[cc] <= 2000) {
                  colors[cc] = '#ffb880'
              } else if (gdpData[cc] > 2000) {                    
                  colors[cc] = '#d77980'
              }
          }

          self.VectorMap = jQuery('#vmap').vectorMap({
              map: 'world_en',
              backgroundColor: '#fff',
              enableZoom: true,
              showTooltip: true,
              colors: colors,
              hoverOpacity: 0.7,
              hoverColor: false,
              selectedColor: false,
              onRegionOver: function(element, code, region) {
              },
              onRegionOut: function(element, code, region) {
              },
              onLabelShow: function(event, label, code){
                  event.preventDefault()
              }
          })
          
        }
      })
    },
    async searchComparing(data){      
      this.listLoadingBox = true
      
       let self = this
          
          getDashboardAjax().then(response => {
            if(response.MajorCode == '000'){
              let total = response.Data   
              switch (data){
                case 'Data Sessions':
                  self.boxData = {
                      day: total.SessionDay,
                      month: total.SessionMonth,
                      year: total.SessionYear,
                      preDay: total.PreSessionDay,
                      preMonth: total.PreSessionMonth,
                      preYear: total.PreSessionYear,
                      loaded: true,
                      report: 'Data Sessions'
                    }                 
               break
               case 'Data Usage':
                  self.boxData = {
                      day: total.DataDay ? total.DataDay/1048576 : 0,
                      month: total.DataMonth ? total.DataMonth/1048576 : 0,
                      year: total.DataYear ? total.DataYear/1048576 : 0,
                      preDay: total.PreDataDay ? total.PreDataDay/1048576 : 0,
                      preMonth: total.PreDataMonth ? total.PreDataMonth/1048576 : 0,
                      preYear: total.PreDataYear ? total.PreDataYear/1048576 : 0,
                      loaded: true,
                      report: 'Data Usage'
                    }                 
               break
               case 'SMS Usage':
                  self.boxData = {
                      day: total.SMSMODay + total.SMSMTDay,
                      month: total.SMSMOMonth + total.SMSMTMonth,
                      year: total.SMSMOYear + total.SMSMTYear,
                      preDay: total.PreSMSMODay + total.PreSMSMTDay,
                      preMonth: total.PreSMSMOMonth + total.PreSMSMTMonth,
                      preYear: total.PreSMSMOYear + total.PreSMSMTYear,
                      loaded: true,
                      report: 'SMS Usage'
                    }                 
               break
               case 'Online Numbers':
                  self.boxData = {
                      day: total.OnlineNumbersDay,
                      month: total.OnlineNumbersMonth,
                      year: total.OnlineNumbersYear,
                      preDay: total.PreOnlineNumbersDay,
                      preMonth: total.PreOnlineNumbersMonth,
                      preYear: total.PreOnlineNumbersYear,
                      loaded: true,
                      report: 'Online Numbers'
                    }                 
               break
              }
              self.listLoadingBox = false
            }
          })

    },
    async searchTotalByPeriod(period) {
                
      let self = this
          getDashboardAjax().then(response => {            
					//$.ajax(settings).done(function (response) { 
            if(response.MajorCode == '000'){
              let total = response.Data              
              switch (period){
                case 'daily':
                    self.panelData = {
                        totalDataUsage: total.DataDay ? total.DataDay/1048576 : 0,
                        totalSMSUsage: total.SMSMODay + total.SMSMTDay,
                        totalDuration: total.OnlineNumbersDay,//(3600*response.Table3[0].JTOV_DATA_DAY)/(response.Table3[0].JTOV_DURATION_DAY*1048576),
                        totalDataSessions: total.SessionDay,
                        loaded: true
                    }
                break
                case 'weekly':
                    self.panelData = {
                        totalDataUsage: total.DataWeek ? total.DataWeek/1048576 : 0,
                        totalSMSUsage: total.SMSMOWeek + total.SMSMTWeek,
                        totalDuration: total.OnlineNumbersWeek,//(3600*response.Table3[0].JTOV_DATA_DAY)/(response.Table3[0].JTOV_DURATION_DAY*1048576),
                        totalDataSessions: total.SessionWeek,
                        loaded: true
                    }
                break
                case 'monthly':
                    self.panelData = {
                        totalDataUsage: total.DataMonth ? total.DataMonth/1048576 : 0,
                        totalSMSUsage: total.SMSMOMonth + total.SMSMTMonth,
                        totalDuration: total.OnlineNumbersMonth,//(3600*response.Table3[0].JTOV_DATA_DAY)/(response.Table3[0].JTOV_DURATION_DAY*1048576),
                        totalDataSessions: total.SessionMonth,
                        loaded: true
                    }
                break
                case 'yearly':
                    self.panelData = {
                        totalDataUsage: total.DataYear ? total.DataYear/1048576 : 0,
                        totalSMSUsage: total.SMSMOYear + total.SMSMTYear,
                        totalDuration: total.OnlineNumbersYear,//(3600*response.Table3[0].JTOV_DATA_DAY)/(response.Table3[0].JTOV_DURATION_DAY*1048576),
                        totalDataSessions: total.SessionYear,
                        loaded: true
                    }
                break
            }
          }            
        })
    },
    async searchTable() {
      this.list = []
      let pref_1 = this.tableData === 'SMS Usage'?'S':'D'
      let sort = 'DataDay'//this.tableData === 'SMS Usage'?'SMSMODay':'DataDay'
      let pref_2 = 'D'    
      this.listLoading = true
      const today = new Date()
      switch (this.tablePeriod){
        case 'Today':
            pref_2 = 'D'
            break
        case 'Week':
            pref_2 = 'W'
            break
        case 'Month':
            pref_2 = 'M'
            break
        /*case 'Year':
            pref_2 = 'Y'
            break*/
      }
      switch (pref_1 + pref_2){
        case 'DD':
            sort = 'DataDay'
            break
        case 'DW':
            sort = 'DataWeek'
            break
        case 'DM':
            sort = 'DataMonth'
            break
        case 'SD':
            sort = 'SMSMODay'
            break
        case 'SW':
            sort = 'SMSMOWeek'
            break
        case 'SM':
            sort = 'SMSMOMonth'
            break
      }

      const current = moment()          

      let self = this
      
      const query = {
        'UsageReportType': pref_1 + pref_2,
        'sort': sort,
        'order': 'desc' 
      }
      
      fetchSIMListAjax(query).then(response => {
      //$.ajax(settings).done(function (response) { 
          let rows = response.rows   
          
          const arrTable = []

          rows.forEach((element, index) => {
            //const tableDataUsageTotal = (+element.totalDataUsage / 1000000)
            //const tableSMSUsageTotal = element.totalSmsUsage == 'undefined' ? 0 : (+element.totalSmsUsage)
            //const tableFlowUsageTotal = element.totalFlowUsage == 'undefined' ? 0 : (+element.totalFlowUsage)
            arrTable.push({
              num: index + 1,
              imsi: element.IMSI,
              customer: element.OrganizeName,
              total: (element.DataDay/1048576).toFixed(3),
              csp: element.ServiceProfileName,
              sms: element.SMSMODay + element.SMSMTDay,
              sessions: element.SessionDay,
              lastUpdate: element.DataUpdateTime!==null?element.DataUpdateTime.slice(0, 10):''
          })
        })

        self.list = arrTable
        self.listLoading = false

        
      })
    },
    handleTableData(val){
      this.tableData = val
      this.searchTable()
    },
    handleTablePeriod(val){
      this.tablePeriod = val
      this.searchTable()
    },
  },
  created(){
  },
  async mounted() {    
    await this.initDasboard()
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
    padding: 37px 50px 40px 50px;
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

.el-loading-mask{
  z-index: 2 !important;
}

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
    font-size: 12px;
}

.el-table td, .el-table th {
    padding: 10px 0;
}


  .font-12{
    font-size: 12px;
  }

    div.square {
    border-radius: 3px;
    width: 24px;
    height: 14px;
    }
    
    .el-progress-bar{
      width: 75%;

    }
    .box-header{
      margin-top:10px;
      margin-bottom: 40px;
    }
  
  .mb-30{
    margin-bottom:30px;
  }
  
  .el-progress .el-progress__text{
      display: none
    }

    
.cell a{
  color: #28a5e0;
}
</style>
