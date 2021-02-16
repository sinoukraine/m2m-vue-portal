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
        <el-table-column label="Start Date" width="90" align="center" >
          <template slot-scope="{row}">
            <span>{{row.startTime.slice(0,19).replace('T', ' ')}}</span>
          </template>
        </el-table-column>
        <el-table-column label="Update Date" align="center">
          <template slot-scope="{row}">
            <span>{{row.updateDate.slice(0,10)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="End Date" width="90" align="center">
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

    <el-dialog class="dialog-download" title="HLR Info" :visible.sync="hlrFormVisible" width="100%" >
      <div class="display-flex justify-content-between">
        <div class="buttons-row">
        </div>
        <div class="buttons-row white-space-nowrap">
         <!--<el-button v-waves :loading="downloadLoading" class="button-custom blue-btn" type="primary"  @click="handleSessionsDownload"><item :icon="'save-white'" /></el-button>
        -->
        </div>
      </div>

      <el-row :gutter="16" >
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
      </el-row>
      <el-table
        :data="hlrList"
        fit            
        border
        class="session-table mt-30"
      >
        <el-table-column label="Key" min-width="180px" align="left" >
          <template slot-scope="{row}">
            <span>{{row.keyField}}</span>
          </template>
        </el-table-column>
        <el-table-column label="Value" min-width="180px" align="left">
          <template slot-scope="{row}">
            <span>{{row.valueField}}</span>
          </template>
        </el-table-column>
        <el-table-column label="Changed" width="90px" align="left">
          <template slot-scope="{row}">
            <span>{{row.propertyChanged}}</span>
          </template>
        </el-table-column>
      </el-table>       
    </el-dialog>

    <el-dialog class="dialog-download" title="SMS History" :visible.sync="smsFormVisible" width="100%" >
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
      <el-card class="box-card m-30">
            <div class="vertical-middle px-5">
              <div class="card-inline card-panel-left font-16">
                <div class=" font-16 bold color-grey">SIM Session State</div>
              </div>
              <div class="card-inline card-panel-right display-flex">
                <div class="big-round" :class="currentStateColor"></div >
                <div class="font-14 pl-15 color-grey vertical-middle">{{currentState}} {{lastUpdateTime?'(last update: '+lastUpdateTime+')':''}}</div>
                
              </div>
            </div>
          </el-card>
      <div class="mixin-components-container">
        <el-row style="margin: 30px">
          <div>
            <panel-group            
              :lg="'6'"
              :total="panelData"
              @change="searchTotalByPeriod"
            />
          </div>
          <el-card class="box-card footer-border">
            <div>
              <el-form ref="dataForm"  label-position="top" label-width="70px">
                <el-row :gutter="16">
                  <el-col :xs="24" :sm="12">
                    <el-form-item label="IMSI" prop="imsi">
                      <el-input v-model="temp.imsi" disabled/>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="12">
                    <el-form-item label="ICCID" prop="iccid">
                      <el-input v-model="temp.iccid" disabled />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="16">
                  <el-col :xs="24" :sm="12">
                    <el-form-item label="MSISDN" prop="msisdn">
                      <el-input v-model="temp.msisdn" disabled/>
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
            <div class="">
              <div class="card-panel-left font-16">
                <div class=" font-16 bold color-grey">Data Details</div>
              </div>
              <div class="card-panel-left pt-10">
                <el-button type="primary" class="green-btn" @click="showSessions"><item :icon="'csp'"/> Session Data</el-button> 
                <el-button type="primary" class="violet-btn" @click="showSMSUsage"><item :icon="'sms-white'"/> SMS History</el-button>
                <el-button type="primary" class="blue-btn" @click="showLocation"><item :icon="'map-white'"/> View Map</el-button>
                <el-button type="primary" class="orange-btn" @click="sendSMS"><item :icon="'sms-white'"/> Send SMS</el-button>
                <el-button type="primary" class="red-btn" @click="showHLR"><item :icon="'csp'"/> HLR</el-button>
              </div>
            </div>
          </el-card>
          <div id="chart" class="sim-container">
              
            </div>
          <div class="chart-container line-chart-container mt-30">
            <div style="display:flex;justify-content: center;">
                <div style="display:flex">
                  <div class="square" :style="'background-color:rgb(182, 162, 222);'"></div>
                  <div class="font-14" style="padding: 0 15px;color:#606268">Data MB</div>
                </div> 
                <div style="display:flex">
                    <div class="square" :style="'background-color:#ffb880;'"></div>
                    <div class="font-14" style="padding: 0 15px;color:#606268">Average (MB/day)</div>
                </div> 
                <div style="display:flex">
                    <div class="square" :style="'background-color:#d77980;'"></div>
                    <div class="font-14" style="padding: 0 15px;color:#606268">Total SMS</div>
                </div> 
              </div>
            <apexchart type="line" :height="350" :options="chartOptions" :series="series" />
            <!--<line-chart
              :chart-data="lineCollection"
              :styles="lineStyles"
              :options="lineOptions"
            ></line-chart>-->
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
import { getSIMAsync, getCDRS, getCDRSAsync, getSIMCoordinates, getSIMCountry, forceReconnectAsync, getSMSHistoryAsync, getDemoOwerview } from '@/api/sim'
import VueApexCharts from 'vue-apexcharts'

const curday = new Date()

export default {
  name: 'SIMProfile',
  components: {
    waves,
    Item,
    Loading,
    PanelGroup,
    LineChart,
    LMap, LTileLayer, LMarker, LControlLayers, LPolyline, LFeatureGroup, LPopup,
    apexchart: VueApexCharts
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
      simDetailslistLeft: [],
      simDetailslistRight: [],
      isLoading: false,
      fullPage: true,
      simQuery: {
        id: undefined,
        imsi: undefined,
        //activity: true
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
      currentState: 'No Data',
      currentStateColor: 'bg-color-grey',
      lastUpdateTime: '',
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
      series: [],
      chartOptions: {
      },
      mapFormVisible: false,      
      sessionFormVisible: false,
      hlrFormVisible: false,
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
      hlrList: [],
      smsUsageList: []
    }
  },
  created() {
    this.searchTotalByPeriod('daily')
    const current = moment()
    this.cdrsQuery = {
      //id: this.$route.params.id,
      date1: current.clone().startOf('month').format('YYYY-MM-DD'),
      date2: moment(curday, 'YYYY-MM-DD').format('YYYY-MM-DD')
    }
    //this.simQuery.id = this.$route.params.id
    this.simQuery.imsi = this.$route.params.id
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
    async searchTotalByPeriod(period) {
        const imsi =  this.$route.params.id
        await getDemoOwerview(this.$store.state.user.login, imsi).then(response => {
            switch (period){
                case 'daily':
                    this.panelData = {
                        totalDataUsage: response.Table3.length ? response.Table3[0].JTOV_DATA_DAY/1048576 : 0,
                        totalSMSUsage: response.Table3.length ? response.Table3[0].JTOV_SMS_MO_DAY : 0,
                        totalDuration: response.Table3.length ? response.Table3[0].JTOV_DATA_NUMS_DAY : 0,//(3600*response.Table3[0].JTOV_DATA_DAY)/(response.Table3[0].JTOV_DURATION_DAY*1048576),
                        totalDataSessions: response.Table3.length ? response.Table3[0].JTOV_SESSION_DAY : 0,
                        loaded: true
                    }
                break
                case 'weekly':
                    this.panelData = {
                        totalDataUsage: response.Table3.length ? response.Table3[0].JTOV_DATA_WEEK/1048576 : 0,
                        totalSMSUsage: response.Table3.length ? response.Table3[0].JTOV_SMS_MO_WEEK : 0,
                        totalDuration: response.Table3.length ? response.Table3[0].JTOV_DATA_NUMS_WEEK : 0,//(3600*response.Table3[0].JTOV_DATA_WEEK)/(response.Table3[0].JTOV_DURATION_WEEK*1024),
                        totalDataSessions: response.Table3.length ? response.Table3[0].JTOV_SESSION_WEEK : 0,
                        loaded: true
                    }
                break
                case 'monthly':
                    this.panelData = {
                        totalDataUsage: response.Table3.length ? response.Table3[0].JTOV_DATA_MONTH/1048576 : 0,
                        totalSMSUsage: response.Table3.length ? response.Table3[0].JTOV_SMS_MO_MONTH : 0,
                        totalDuration: response.Table3.length ? response.Table3[0].JTOV_DATA_NUMS_MONTH : 0,//(3600*response.Table3[0].JTOV_DATA_MONTH)/(response.Table3[0].JTOV_DURATION_MONTH*1024),
                        totalDataSessions: response.Table3.length ? response.Table3[0].JTOV_SESSION_MONTH : 0,
                        loaded: true
                    }
                break
                case 'yearly':
                    this.panelData = {
                        totalDataUsage: response.Table3.length ? response.Table3[0].JTOV_DATA_YEAR/1048576 : 0,
                        totalSMSUsage: response.Table3.length ? response.Table3[0].JTOV_SMS_MO_YEAR : 0,
                        totalDuration: response.Table3.length ? response.Table3[0].JTOV_DATA_NUMS_YEAR : 0,//(3600*response.Table3[0].JTOV_DATA_YEAR)/(response.Table3[0].JTOV_DURATION_YEAR*1024),
                        totalDataSessions: response.Table3.length ? response.Table3[0].JTOV_SESSION_YEAR : 0,
                        loaded: true
                    }
                break
            } 
        })
    },
    async getProfile() {
      let self = this
      var query = {
				  IMSIs: [this.$route.params.id]
				}
				
				var settings = {
				  "url": "https://test.m2mdata.co/JT/Sim/Query",
				  "method": "POST",
				  "timeout": 0,
				  "headers": {
					"token": "00000000-0000-0000-0000-000000000000",
					"Content-Type": "application/x-www-form-urlencoded"
				  },
				  "data": query
				};

        const oneDayAgo = moment(curday, 'YYYY-MM-DD').add(-1, 'days').format('YYYY-MM-DD')
        const threeDayAgo = moment(curday, 'YYYY-MM-DD').add(-3, 'days').format('YYYY-MM-DD')
        const weekAgo = moment(curday, 'YYYY-MM-DD').add(-7, 'days').format('YYYY-MM-DD')
        
				/*$.ajax(settings).done(function (result) {
          
          
        })*/


        const token = "00000000-0000-0000-0000-000000000000"
        const responseActiveSession = await fetch(`https://m2mdata.co/jt/GetActiveSession?imsi=${query.IMSIs}`)
        let resActiveSession = await responseActiveSession.json()
        
        if(resActiveSession.Data){
        self.lastUpdateTime = resActiveSession.Data.startDateField.replace("T", " ").replace("Z", "")

        const simActivityTime = moment(self.DataUpdateTime, 'YYYY-MM-DD').format('YYYY-MM-DD')
          if(simActivityTime < oneDayAgo){
            self.currentState = 'Productive'
            self.currentStateColor = 'bg-color-blue'
          }else if(simActivityTime >= oneDayAgo && simActivityTime < threeDayAgo){
            self.currentState = 'Active'
            self.currentStateColor = 'bg-color-green'
          }else if(simActivityTime >= threeDayAgo){            
            self.currentState = 'Suspended'
            self.currentStateColor = 'bg-color-yellow'
          }else{
            self.currentState = 'No Data'
            self.currentStateColor = 'bg-color-grey'
          }
        }else{
					self.currentState = 'Productive, but no current data session'
					self.currentStateColor = 'bg-color-blue'					
				}
      
        const responseHLR = await fetch(`https://m2mdata.co/jt/GetGetHlrInfo?imsi=${query.IMSIs}`)
        let resHLR = await responseHLR.json()
        
        this.hlrList = resHLR.Data.dataMapField

        let hlrDate1 = resHLR.Data.hlrInfoFieldsField[1].valueField
        let hlrDate2 = resHLR.Data.hlrInfoFieldsField[3].valueField
        this.simDetailslistLeft = [{
          title: resHLR.Data.hlrInfoFieldsField[0].nameField,
          value: resHLR.Data.hlrInfoFieldsField[0].valueField,
        },{
          title: resHLR.Data.hlrInfoFieldsField[2].nameField,
          value: resHLR.Data.hlrInfoFieldsField[2].valueField,
        }]

        this.simDetailslistRight = [{
          title: resHLR.Data.hlrInfoFieldsField[1].nameField,
          value: hlrDate1=='00000000000000'?'':hlrDate1.slice(0,4) + '-' + hlrDate1.slice(4,6) + '-' + hlrDate1.slice(6,8) + ' ' + hlrDate1.slice(8,10) + ':' + hlrDate1.slice(10,12) + ':' + hlrDate1.slice(12,14),
        },{
          title: resHLR.Data.hlrInfoFieldsField[3].nameField,
          value: hlrDate2=='00000000000000'?'':hlrDate2.slice(0,4) + '-' + hlrDate2.slice(4,6) + '-' + hlrDate2.slice(6,8) + ' ' + hlrDate2.slice(8,10) + ':' + hlrDate2.slice(10,12) + ':' + hlrDate2.slice(12,14),
        }]

        /*
        var settings = {
				  "url": "https://m2mdata.co/jt/GetGetHlrInfo?imsi=" + query.IMSIs,
				  "method": "GET",
				  "timeout": 0,
				  "headers": {
					"token": "00000000-0000-0000-0000-000000000000",
					"Content-Type": "application/x-www-form-urlencoded"
				  },
				};

				$.ajax(settings).done(function (result) {
					console.log('hlr',JSON.parse(result));
				})*/
         

      const response = await getSIMAsync(this.simQuery)
      this.smsQuery = {
        imsi: response.data.info.imsi,
      }
      this.cdrsQuery.id = response.data._id
      this.temp = {
        imsi: response.data.info.imsi,
        iccid: response.data.info.iccid,
        msisdn: response.data.info.msisdn,
      }
      this.simQuery.id = response.data._id
      /*this.panelData = {
        totalDataUsage: 23,
        totalSMSUsage: 2,
        totalDuration: 20,
        totalDataSessions: 300,
        loaded: true
      }*/

      let network = '', endTime = ''
      
      /*if(response.data.extra.activity.hasOwnProperty('samples')){
        let sessionArr = response.data.extra.activity.samples.map(el => ({...el, updateDate: response.data.extra.activity.date}))
        
        let sortedArr = sessionArr
        this.sessionList = sortedArr.reverse()

        let {network, endTime} = response.data.extra.activity.samples[response.data.extra.activity.samples.length - 1]
      }*/
      
      this.locationList.push(
        {title: 'IMSI', value: response.data.info.imsi},
        {title: 'Network Operator', value: network},
        {title: 'Area', value: ''},
        {title: 'Cell', value: ''},
        {title: 'Cell Range', value: ''},
        {title: 'Current Session Date', value: endTime.slice(0,19).replace('T', ' ')},
        {title: 'Current Usage', value: response.data?.extra?.activity?.totals?.totalDataUsage}
      )
      
      const response_1 = await getCDRSAsync(this.cdrsQuery)      
      const arrLabel = [], arrData = []
      let sessionArr = []
      let totalData = 0
      let totalSMS = 0
      response_1.data.forEach(element => {
          //usageLabels.push(element.date.slice(0, 10))          
          //usageData.push(element.totals?.data.originalUnits/1048576)

          arrLabel.push(element.date.slice(0, 10))   
          let chartData = isNaN(parseFloat(element.totals?.data.originalUnits/1048576))?0:element.totals?.data.originalUnits/1048576
          arrData.push((+chartData).toFixed(1))
          totalData += +chartData
          let chartSMS = isNaN(parseFloat(element.totals?.sms?.originalUnits))?0:element.totals?.sms?.originalUnits
          totalSMS += +chartSMS
            if(element.hasOwnProperty('samples')){
              if(element.samples !== null){
                sessionArr = (element.samples.map(el => ({...el, updateDate: element.date}))).concat(sessionArr)
           
              }
            }
            

           // let {network, endTime} = response.data.extra.activity.samples[response.data.extra.activity.samples.length - 1]
          

      })

        const averageData = totalData/response_1.data.length

      let sortedArr = sessionArr.sort(function(a,b){
        var c = new Date(a.startTime)
        var d = new Date(b.startTime)
        return d-c
      })

      this.sessionList = sortedArr
     
      
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
          data: arrData.map(el=>el=totalSMS)
        }]

      /*this.lineCollection = {
        labels: usageLabels,
        datasets: [
          {
            label: 'Data Usage',
            backgroundColor: 'rgb(53, 165, 228)',
            data: usageData
          }
        ]}*/
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
      if(!response){        
        this.smsFormVisible = false
        this.isLoading = false
        return
      }
      let sortedArr = response.data.sort(function(a,b){
        var c = new Date(a.insertedDate)
        var d = new Date(b.insertedDate)
        return d-c
      })
      this.smsUsageList = sortedArr
     setTimeout(() => {
        this.smsFormVisible = true
        this.isLoading = false
      },5000)
    },
    showHLR(){
      this.isLoading = true
      setTimeout(() => {
        this.hlrFormVisible = true
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
          lat: response.data.geometry.coordinates[0],
          lon: response.data.geometry.coordinates[1]
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
        const imsi = this.$route.params.id
        this.$router.push({ path: `/sms/index` })
        this.$store.dispatch('dashboard/setIMSI', imsi)
        //this.$route.params.newimsi = `${imsi}`
      
    },    
  }
}

</script>


<style >
 .apexcharts-toolbar {
    display: none !important;
}
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
  
  .red-btn{
    border-color: #d47980;
    background-color: #d47980;
  }
  .red-btn:hover,.red-btn:active,.red-btn:focus{
    border-color: #e48990;
    background-color: #e48990;
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

.font-14{
  font-size: 14px;
}
 
 .m-30{
  margin: 30px;
}
.pt-10{
  padding-top:10px;
}
.pl-15{
  padding-left: 15px;
}
.px-5{
  padding: 0 5px;
}
.big-round{
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.vertical-middle{
  display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
}

.bg-color-grey{
  background-color: #e3e3e3;
}

.bg-color-blue{
  background-color: rgb(92, 174, 230);
}

</style>
