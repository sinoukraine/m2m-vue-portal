<template>
  <el-container class="">
    <loading :active.sync="isLoading" 
        :can-cancel="true" 
        :on-cancel="onCancel"
        :is-full-page="fullPage"></loading>
    <el-dialog class="dialog-download" title="Session Data" :visible.sync="sessionFormVisible" width="100%" >
      <div class="display-flex justify-content-between">
        <div class="buttons-row">
        </div>
        <div class="buttons-row white-space-nowrap">
         <el-button v-waves :loading="downloadLoading" class="button-custom blue-btn" type="primary"  @click="handleSessionsDownload"><item :icon="'save-white'" /></el-button>
        </div>
      </div>
      <el-table
        :data="sessionList"
        fit            
        border
        class="session-table"
      >
        <el-table-column label="Start Date" align="center" >
          <template slot-scope="{row}">
            <span>{{row.startTime.slice(0,19).replace('T', ' ')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="Update Date" align="center">
          <template slot-scope="{row}">
            <span>{{row.updateDate.slice(0,10)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="End Date" align="center">
          <template slot-scope="{row}">
            <span>{{row.endTime.slice(0,19).replace('T', ' ')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="Total Bytes" align="center">
          <template slot-scope="{row}">
            <span>{{row.originalUnits}}</span>
          </template>
        </el-table-column>
        <el-table-column label="Operator" align="center">
          <template slot-scope="{row}">
            <span>{{row.network}}</span>
          </template>
        </el-table-column>
        <el-table-column label="Cell Info" align="center">
          <template >
            <span></span>
          </template>
        </el-table-column>
        <el-table-column label="IMEI" align="center">
          <template >
            <span></span>
          </template>
        </el-table-column>
      </el-table>       
    </el-dialog>

    <el-dialog class="dialog-download" title="SMS Usage Data" :visible.sync="smsFormVisible" width="100%" >
      <div class="display-flex justify-content-between">
        <div class="buttons-row">
        </div>
        <div class="buttons-row white-space-nowrap">
         <el-button v-waves :loading="downloadLoading" class="button-custom blue-btn" type="primary"  @click="handleSMSUsageDownload"><item :icon="'save-white'" /></el-button>
        </div>
      </div>
      <el-table
        :key="tableKey"
        :data="smsUsageList"
        fit            
        border
        class="sms-table"
      >
        <el-table-column label="Date" align="center" min-width="100px" >
          <template slot-scope="{row}">
            <span>{{row.insertedDate.slice(0,19).replace('T', ' ')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="Direction" align="center">
          <template slot-scope="{row}">
            <span>{{row.direction}}</span>
          </template>
        </el-table-column>
        <el-table-column label="Sender" align="center">
          <template slot-scope="{row}">
            <span>{{row.from}}</span>
          </template>
        </el-table-column>
        <el-table-column label="Message" align="center">
          <template slot-scope="{row}">
            <span>{{row.message}}</span>
          </template>
        </el-table-column>
        <el-table-column label="Status" align="center">
          <template slot-scope="{row}">
            <span>{{row.status}}</span>
          </template>
        </el-table-column>
        <el-table-column label="Reference" align="center">
          <template >
            <span></span>
          </template>
        </el-table-column>
      </el-table>       
    </el-dialog>

    <el-dialog title="View Map" :visible.sync="mapFormVisible" width="70%" >
      <el-row :gutter="16">
        <el-col :xs="24" :sm="12" class="lg-pr-0">
          <div class="map-container">
            <l-map
              ref="map"
              :zoom="zoom"
              :center="center"
              style="height: 100%"
              @ready="doSomethingOnReady()"
            >
              <l-tile-layer
                v-for="tileProvider in tileProviders"
                :key="tileProvider.name"
                :name="tileProvider.name"
                :visible="tileProvider.visible"
                :url="tileProvider.url"
                :subdomains="tileProvider.subdomains"
                layer-type="base"/>
              <l-marker
                :lat-lng="markerLatLng"
                :icon="markerIcon"
              >
              </l-marker>
              <!--<l-circle 
                 :color="'rgb(249,104,104)'"
                  :fill-color="'rgb(249,104,104)'"
                  :lat-lng="markerLatLng" 
                  :radius="'10'" >
                </l-circle>-->
            </l-map>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" class="lg-pl-0">
          <el-table
            :data="locationList"
            fit
            :show-header="false"
            class="location-table"
          >
           <el-table-column label="Device Offer" align="left" >
              <template slot-scope="{row}">
                <span>{{row.title}}</span>
              </template>
            </el-table-column>
           <el-table-column label="SIM Numbers" align="right">
              <template slot-scope="{row}">
                <span>{{row.value}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row>
        <div class="card-flex">
          <div class="card-inline card-panel-left">
          </div>
          <div class="card-inline card-panel-right">
            <el-button type="info" class="dark-btn mt-25" @click="forceReconnect">Force reconnect</el-button>
          </div>
        </div>
      </el-row>
    </el-dialog>
    <el-main  class="no-padding">
      <div class="mixin-components-container">
        <el-row style="margin: 30px">
          <div>
            <panel-group            
              :lg="'6'"
              :total="panelData"
            />
          </div>
          <el-card class="box-card footer-border">
            <div>
              <el-form ref="dataForm"  label-position="top" label-width="70px">
                <el-row :gutter="16">
                  <el-col :xs="24" :sm="12">
                    <el-form-item label="IMSI" prop="imsi">
                      <el-input v-model="temp.imsi" />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="12">
                    <el-form-item label="ICCID" prop="iccid">
                      <el-input v-model="temp.iccid" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="16">
                  <el-col :xs="24" :sm="12">
                    <el-form-item label="MSISDN" prop="msisdn">
                      <el-input v-model="temp.msisdn" />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="12">
                    <el-form-item label="IMEI" prop="imei">
                      <el-input  />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="16">
                  <el-col :xs="24" :sm="12">
                    <el-form-item label="Bussiness Unit" prop="businessUnit">
                      <el-select v-model="temp.businessUnit" class="filter-item w-100" placeholder="Please select">
                        <el-option v-for="item in businessUnitOptions" :key="item.code" :label="item.name" :value="item.code" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="12">
                    <el-form-item label="CSP" prop="csp">
                      <el-select v-model="temp.csp" class="filter-item w-100" placeholder="Please select">
                        <el-option v-for="item in cspOptions" :key="item.code" :label="item.name" :value="item.code" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="16">
                  <el-col :xs="24" :sm="12">
                    <el-form-item label="State" prop="state">
                      <el-select class="filter-item w-100" placeholder="Please select">
                        <el-select v-model="temp.state" class="filter-item w-100" placeholder="Please select">
                          <el-option v-for="item in stateOptions" :key="item.code" :label="item.name" :value="item.code" />
                        </el-select>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="12">
                    <el-form-item label="Solution" prop="solution">
                      <el-select v-model="temp.solution" class="filter-item w-100" placeholder="Please select">
                        <el-option v-for="item in solutionOptions" :key="item.code" :label="item.name" :value="item.code" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="16">
                  <el-col :xs="24" :sm="12">
                    <el-form-item label="Agent" prop="category">
                      <el-select class="filter-item w-100" placeholder="Please select">

                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="12">
                    <el-form-item label="Customer" prop="key">
                      <el-select class="filter-item w-100" placeholder="Please select">

                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <div class="el-card__footer w-100" >
              <el-button class="blue-btn" type="primary">Save</el-button>
            </div>
          </el-card>
          <el-card class="box-card mt-30">
            <div class="lg-card-flex">
              <div class="card-inline card-panel-left font-16">
                <div class=" font-16 bold color-grey">Data Details</div>
                <p class=" font-14 color-grey">Click on the button to open a popup with info.</p>
              </div>
              <div class="card-inline card-panel-right">
                <el-button type="primary" class="green-btn" @click="showSessions"><item :icon="'csp'"/> Session Data</el-button> 
                <el-button type="primary" class="violet-btn" @click="showSMSUsage"><item :icon="'sms-white'"/> SMS Usage</el-button>
                <el-button type="primary" class="blue-btn" @click="showLocation"><item :icon="'map-white'"/> View Map</el-button>
                <el-button type="primary" class="orange-btn" @click="sendSMS"><item :icon="'sms-white'"/> Send SMS</el-button>
              </div>
            </div>
          </el-card>
          <div class="chart-container line-chart-container mt-30">
            <line-chart
              :chart-data="lineCollection"
              :styles="lineStyles"
              :options="lineOptions"
            ></line-chart>
          </div>
        </el-row>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import L from 'leaflet'
import { LMap, LTileLayer, LMarker, LControlLayers, LPolyline, LFeatureGroup, LPopup } from 'vue2-leaflet'
import { latLng, Icon, icon } from 'leaflet'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import moment from 'moment'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import PanelGroup from '../dashboard/admin/components/PanelGroup'
import LineChart from '../dashboard/admin/components/LineChart.js'
import Item from '@/layout/components/Sidebar/Item'
import { getSIMAsync, getCDRSAsync, getSIMCoordinates, getSIMCountry, forceReconnectAsync, getSMSHistoryAsync } from '@/api/sim'

export default {
  name: 'SIMProfile',
  components: {
    waves,
    Item,
    Loading,
    PanelGroup,
    LineChart,
    LMap, LTileLayer, LMarker, LControlLayers, LPolyline, LFeatureGroup, LPopup
  },
  data() {

    let customicon = icon(Object.assign({},
        Icon.Default.prototype.options,
        {
          iconUrl:'map-blue.svg',
          iconRetinaUrl:'map-blue.svg',
          shadowUrl:''
        }
      ))

    return {
      tableKey: 0,
      downloadLoading: false,
      isLoading: false,
      fullPage: true,
      simQuery: {
        id: undefined,
        activity: true
      },
      cdrsQuery: {
      },
      smsQuery: {
      },
      temp: {
        imsi: undefined,
        iccid: undefined,
        msisdn: undefined
      },
      businessUnitOptions: [
        { code: '1', name: 'World' }
      ],
      cspOptions: [
        { code: '1', name: 'M2M Data' },
        { code: '2', name: 'M2M Data Custom Network Profile Australia' },
        { code: '3', name: 'M2M Data Emergency CSP Z1- 9' },
        { code: '4', name: 'M2M Data High CSP Z1-3' },
        { code: '5', name: 'M2M Data Normal CSP Z1 &2' }
      ],
      stateOptions: [
        { code: '1', name: 'Productive' },
        { code: '2', name: 'Suspended' },
        { code: '3', name: 'Terminated' },
        { code: '4', name: 'OnStock' }
      ],
      solutionOptions: [
        { code: '1', name: 'Protect' }
      ],
      agentOptions: [
        { code: '1', name: 'M2M Data' }
      ],
      customersOptions: [
        { code: '1', name: 'M2M Data' }
      ],
      panelData: {
        totalDataUsage: 0,
        totalSMSUsage: 0,
        totalDuration: 0,
        totalDataSessions: 0,
        loaded: false
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
      mapFormVisible: false,      
      sessionFormVisible: false,
      smsFormVisible: false,
      zoom: 13,
      center: L.latLng(0, 0),
      map: '',
      tileProviders: [
        {
          name: 'Map',
          visible: true,
          url: 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
          subdomains: ['mt0','mt1','mt2','mt3']
        },
        {
          name: 'OpenStreetMap',
          visible: false,
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        },
        {
          name: 'Satelitte',
          visible: false,
          url: 'https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
          subdomains: ['mt0','mt1','mt2','mt3']
        },
        /*{
          name: 'OpenStreetMap',
          visible: true,
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        },*/
      ],
      markerIcon: customicon,
      locationList: [],
      markerLatLng: [0, 0],//47.413220, -1.219482
      sessionList: [],
      smsUsageList: []
    }
  },
  created() {
    const today = new Date()
    const current = moment()
    this.cdrsQuery = {
      id: this.$route.params.id,
      date1: current.clone().startOf('month').format('YYYY-MM-DD'),
      date2: moment(today, 'YYYY-MM-DD').format('YYYY-MM-DD')
    }
    this.simQuery.id = this.$route.params.id
    this.getProfile()
  },
  computed: {
    lineStyles() {
      return {
        position: 'relative',
        height: '50vh',
        marginTop: '30px'
      }
    }
  },
  methods: {
    async getProfile() {
      const response = await getSIMAsync(this.simQuery)
      this.smsQuery = {
        imsi: response.data.info.imsi,
      }
      this.temp = {
        imsi: response.data.info.imsi,
        iccid: response.data.info.iccid,
        msisdn: response.data.info.msisdn,
      }
      this.panelData = {
        totalDataUsage: 23,
        totalSMSUsage: 2,
        totalDuration: 20,
        totalDataSessions: 300,
        loaded: true
      }

      let network = '', endTime = ''
      if(response.data.extra.activity.hasOwnProperty('samples')){
        this.sessionList = response.data.extra.activity.samples.map(el => ({...el, updateDate: response.data.extra.activity.date}))
        let {network, endTime} = response.data.extra.activity.samples[response.data.extra.activity.samples.length - 1]
      }
      
      this.locationList.push(
        {title: 'IMSI', value: response.data.info.imsi},
        {title: 'Network Operator', value: network},
        {title: 'Area', value: ''},
        {title: 'Cell', value: ''},
        {title: 'Cell Range', value: ''},
        {title: 'Current Session Date', value: endTime.slice(0,19).replace('T', ' ')},
        {title: 'Current Usage', value: response.data.extra.activity?.totals?.totalDataUsage}
      )
      
      const response_1 = await getCDRSAsync(this.cdrsQuery)      
      const usageLabels = [], usageData = []
      response_1.data.forEach(element => {
          usageLabels.push(element.date.slice(0, 10))          
          usageData.push(element.totals?.data.originalUnits/1048576)
      })
      this.lineCollection = {
        labels: usageLabels,
        datasets: [
          {
            label: 'Data Usage',
            backgroundColor: 'rgb(53, 165, 228)',
            data: usageData
          }
        ]}
    },    
    async forceReconnect(){      
      this.isLoading = true
      const response = await forceReconnectAsync(this.simQuery)          
      this.isLoading = false
      this.$alert('Sim connection refreshed', 'M2M Data Message', {type: 'message'})
      this.mapFormVisible = false
    },
    async showSMSUsage(){
      this.isLoading = true
      const response = await getSMSHistoryAsync(this.smsQuery)
      this.smsUsageList = response.data
     setTimeout(() => {
        this.smsFormVisible = true
        this.isLoading = false
      },5000)
    },
    showSessions(){
      this.isLoading = true
      setTimeout(() => {
        this.sessionFormVisible = true
        this.isLoading = false
      },5000)
    },
    doSomethingOnReady() {
        this.map = this.$refs.map.mapObject
        this.map.invalidateSize()
    },
    showLocation(){
      this.isLoading = true
      //country by coords
      this.locationList.length = 10
      const query = {
        id: this.simQuery.id
      }
      getSIMCoordinates(query).then(response => {
        const query_1 = {
          lat: response.data.geometry.coordinates[1],
          lon: response.data.geometry.coordinates[0]
        }
        this.markerLatLng = [query_1.lat, query_1.lon]
        this.center = L.latLng(query_1.lat, query_1.lon)
        this.locationList.push(
          {title: 'Longitude', value: query_1.lat},
          {title: 'Latitude', value: query_1.lon}
        )        
        getSIMCountry(query_1).then(response_1 => {
          const country = response_1.data.address.country
          this.locationList.push({
            title: 'Country',
            value: country
          })          
          this.mapFormVisible = true
          this.isLoading = false
        })
      }).catch(e=>{
        this.locationList.push(
          {title: 'Country', value: ''},
          {title: 'Longitude', value: '0'},
          {title: 'Latitude', value: '0'})
        this.mapFormVisible = true
        this.isLoading = false
      })
    },
    handleSessionsDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['Start Date', 'Update Date', 'End Date', 'Total Bytes', 'Operator', 'Cell Info', 'IMEI']
        const filterVal = ['startTime', 'updateDate', 'endTime', 'originalUnits', 'network', '', '']
        const data = this.formatJson(this.sessionList, filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'sessions'
        })
        this.downloadLoading = false
      })
    },
    handleSMSUsageDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['Date', 'Direction', 'Sender', 'Message', 'Status', 'Reference']
        const filterVal = ['insertedDate', 'direction', 'from', 'message', 'status', 'reference']
        const data = this.formatJson(this.smsUsageList, filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'sms-usage'
        })
        this.downloadLoading = false
      })
    },
    formatJson(arr, filterVal) {
      console.log(arr)
      return arr.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    sendSMS(){
      this.$router.push({ path: `/commands/index` })
    },    
  }
}

</script>


<style >
  .bold {
    font-weight: 600;
  }
  .font-14{
    font-size: 14px;
  }
  .color-grey{
    color: #606266;
  }

  .map-container{
    overflow: hidden;
    width: 100%;
    height: 439px;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  
  .w-100{
    width: 100%;
  }
  .mt-25{
    margin-top: 25px;
  }
  .mt-30{
    margin-top: 30px;
  }
  .mb-30{
    margin-bottom: 30px;
  }
  .el-form-item {
    margin-bottom: 20px;
  }
  .el-form-item__label{
    color: #97a8be;
    line-height: 2em;
  }
  .footer-border .el-card__body{
    border-bottom: 1px solid #ebeef5;
    margin-bottom: 100px;
    padding-bottom: 10px;
  }
  .el-card__footer button{
    float: right;
    margin-top: 38px;
  }
  
  .chart-container{
    background:#fff;
    padding: 30px;
    border-radius: 5px;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  }
  /*map*/
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
  .location-table{
    width: 100%;
    background-color:#ffffff;
    box-shadow: none;
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
  }
  .location-table td{
    background-color: initial !important;
  }
  .el-table td{
    padding: 10px 0;
    font-size: 12px;
  }
  .location-table td .cell{
    white-space: nowrap; /* Запрещаем перенос строк */
    overflow: hidden; /* Обрезаем все, что не помещается в область */
    text-overflow: ellipsis; /* Добавляем многоточие */
  }
  .leaflet-control-zoom, .leaflet-control-attribution{
    display: none;
  }
  /*buttons*/
  .dark-btn{
    border-color: #304257;
    background-color: #304257;
  }
  .dark-btn:hover,.dark-btn:active,.dark-btn:focus{
    border-color: #35475c;
    background-color: #35475c;
  }
  .green-btn{
    border-color: #34bfa3;
    background-color: #34bfa3;
  }
  .green-btn:hover,.green-btn:active,.green-btn:focus{
    border-color: #3ec8ac;
    background-color: #3ec8ac;
  }
  .blue-btn{
    border-color: #28a5e0;
    background-color: #28a5e0;
  }
  .blue-btn:hover,.blue-btn:active,.blue-btn:focus{
    border-color: #32aee8;
    background-color: #32aee8;
  }
  .violet-btn{
    border-color: rgb(182, 162, 222);
    background-color: rgb(182, 162, 222);
  }
  .violet-btn:hover,.violet-btn:active,.violet-btn:focus{
    border-color: rgb(196, 180, 228);
    background-color: rgb(196, 180, 228);
  }
  .orange-btn{
    border-color: #ffb880;
    background-color: #ffb880;
  }
  .orange-btn:hover,.orange-btn:active,.orange-btn:focus{
    border-color: #ffc496;
    background-color: #ffc496;
  }
  .dialog-download .el-dialog__body {
    padding: 0 30px 20px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
  }
  @media (min-width: 768px){
    .lg-pr-0{
      padding-right: 0 !important;
    }
    .lg-pl-0{
      padding-left: 0 !important;
    }
    .lg-card-flex{
      display: flex;
      -webkit-box-pack: justify;
      -ms-flex-pack: justify;
      justify-content: space-between;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
    }
  }
</style>
