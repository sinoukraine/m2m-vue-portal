<template>
  <div class="dashboard-editor-container">
    <panel-group
      :total="panelData"
      @change="searchTotalByPeriod"
    />
    <el-row :gutter="40">
      <el-col :xs="24" :sm="24" :lg="24" style="margin-bottom:30px;">
        <div class="w-100 d-flex" style="padding: 30px;background-color: #ffffff;border-top-left-radius: 5px;border-top-right-radius: 5px;">
            <div class="card-inline card-panel-left font-16 bold color-grey">
            Top 10 Metrics
            </div>
            <div class="card-inline card-panel-right d-flex">
            <el-radio-group v-model="switchTablePeriod" @input="handleTablePeriod" >
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
           <el-table-column label="№" align="center" width="160px">
              <template slot-scope="{row}">
                <span>{{ row.num }}</span>
              </template>
            </el-table-column>
           <el-table-column label="IMSI" align="center" width="180px">
              <template slot-scope="{row}">
                <span>
                {{ row.imsi }}
                </span>
              </template>
            </el-table-column>
            <el-table-column label="Customer" sortable="custom" width="180px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.customer }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Data Usage" min-width="160px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.total }}</span>
              </template>
            </el-table-column>
            <el-table-column label="SMS Usage" min-width="160px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.sms }}</span>
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
            CSP
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
                        <div class="font-12 color-grey" style="padding: 0 15px">0 - 1000</div>
                    </div>           
                    <div style="display:flex">
                        <div class="square" :style="'background-color:#feec81;'"></div>
                        <div class="font-12 color-grey" style="padding: 0 15px">1001 - 5000</div>
                    </div>          
                    <div style="display:flex">
                        <div class="square" :style="'background-color:#ffb880;'"></div>
                        <div class="font-12 color-grey" style="padding: 0 15px">5001 - 20000</div>
                    </div>         
                    <div style="display:flex">
                        <div class="square" :style="'background-color:#d77980;'"></div>
                        <div class="font-12 color-grey" style="padding: 0 15px">20000 +</div>
                    </div>                   
                </div>   
            </div>
        </div>
        
        <!--
        <el-table
            :key="tableKey"
            v-loading="listLoading"
            :data="cspData"
            fit
            border
            highlight-current-row
            style="width: 100%;"
          >
           <el-table-column label="Device Offer" align="center" >
              <template slot-scope="{row}">
                <span>{{ row.DEVICE_OFFER }}</span>
              </template>
            </el-table-column>
           <el-table-column label="SIM Numbers" align="center" width="160px">
              <template slot-scope="{row}">
                <span>{{ row.JTOV_SIM_NUMBERS }}</span>
              </template>
            </el-table-column>
          </el-table>-->
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import PieChart from './components/PieChart'
import LineChart from './components/LineChart.js'
import moment from 'moment'
import { getDemoOwerview, getDemoTopUsage, getCDRSList } from '@/api/sim'

export default {
  name: 'Dashboard',
  components: {
    PieChart,
    PanelGroup,
    LineChart
  },
  data() {
    return {
        panelData: {
            totalDataUsage: 0,
            totalSMSUsage: 0,
            totalDuration: 0,
            totalDataSessions: 0,
            loaded: false
        },
        mapLoading: true,
        listLoading: true,
        list: [],        
        switchTablePeriod: 'Week',
        stateData: [],
        cspData: []        
    }
  },
  methods: {
    async searchTotalByPeriod(period) {
        const gdpData = []
        const colors = []
        let cc 

        await getDemoTopUsage().then(response => {
          console.log('r',response)
        })
        await getDemoOwerview().then(response => {
            switch (period){
                case 'daily':
                    this.panelData = {
                        totalDataUsage: response.data.Table3[0].JTOV_DATA_DAY/1048576,
                        totalSMSUsage: response.data.Table3[0].JTOV_SMS_MO_DAY,
                        totalDuration: (3600*response.data.Table3[0].JTOV_DATA_DAY)/(response.data.Table3[0].JTOV_DURATION_DAY*1024),
                        totalDataSessions: response.data.Table3[0].JTOV_SESSION_DAY,
                        loaded: true
                    }
                break
                case 'weekly':
                    this.panelData = {
                        totalDataUsage: response.data.Table3[0].JTOV_DATA_WEEK/1048576,
                        totalSMSUsage: response.data.Table3[0].JTOV_SMS_MO_WEEK,
                        totalDuration: (3600*response.data.Table3[0].JTOV_DATA_WEEK)/(response.data.Table3[0].JTOV_DURATION_WEEK*1024),
                        totalDataSessions: response.data.Table3[0].JTOV_SESSION_WEEK,
                        loaded: true
                    }
                break
                case 'monthly':
                    this.panelData = {
                        totalDataUsage: response.data.Table3[0].JTOV_DATA_MONTH/1048576,
                        totalSMSUsage: response.data.Table3[0].JTOV_SMS_MO_MONTH,
                        totalDuration: (3600*response.data.Table3[0].JTOV_DATA_MONTH)/(response.data.Table3[0].JTOV_DURATION_MONTH*1024),
                        totalDataSessions: response.data.Table3[0].JTOV_SESSION_MONTH,
                        loaded: true
                    }
                break
                case 'yerly':
                    this.panelData = {
                        totalDataUsage: response.data.Table3[0].JTOV_DATA_YEAR/1048576,
                        totalSMSUsage: response.data.Table3[0].JTOV_SMS_MO_YEAR,
                        totalDuration: (3600*response.data.Table3[0].JTOV_DATA_YEAR)/(response.data.Table3[0].JTOV_DURATION_YEAR*1024),
                        totalDataSessions: response.data.Table3[0].JTOV_SESSION_YEAR,
                        loaded: true
                    }
                break
            }            
            console.log('arrr',response.data.Table2)
            this.stateData = response.data.Table1.map(element => {return {name: element.DEVICE_STATUS_CODE,value: element.JTOV_SIM_NUMBERS}})
            this.cspData = response.data.Table2.map(element => {return {name: element.DEVICE_OFFER,value: element.JTOV_SIM_NUMBERS}})
         

            if (this.mapLoading){
                this.mapLoading = false
                response.data.Table.forEach(element => {
                    gdpData[element.JTOV_DATA_COUNTRY_CODE] = element.JTOV_SIM_NUMBERS
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

                this.VectorMap = jQuery('#vmap').vectorMap({
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
    async searchTableByPeriod(period) {
      let days = 0
      this.listLoading = true
      const today = new Date()
      switch (period){
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
      }

      await getCDRSList(query).then(response => {
        const totalDataUsage = 0
        const totalSMSUsage = 0

        const arrTable = []

        response.data.forEach((element, index) => {
          const tableDataUsageTotal = (+element.totalDataUsage / 1000000)
          const tableSMSUsageTotal = element.totalSmsUsage == 'undefined' ? 0 : (+element.totalSmsUsage)
          arrTable.push({
            num: index + 1,
            imsi: element.imsi,
            customer: element.customer,
            total: tableDataUsageTotal,
            sms: tableSMSUsageTotal
          })
        })

        this.list = arrTable
        this.listLoading = false
      })
    },
    handleTablePeriod(val){
      this.searchTableByPeriod(val)
    }
  },
  async mounted() {
      await this.searchTotalByPeriod('daily')
      await this.searchTableByPeriod('Week')
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
    padding: 7px 0;
}

.cell a{
  color: #409EFF;
}
  .font-12{
    font-size: 12px;
  }

    div.square {
    border-radius: 3px;
    width: 24px;
    height: 14px;
    }
</style>
