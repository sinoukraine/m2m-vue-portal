<template>
  <el-container class="">
    <loading :active.sync="isLoading" 
        :can-cancel="true" 
        
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
            <span>{{row.start}}</span>
          </template>
        </el-table-column>
        <el-table-column label="End Date" width="90" align="center">
          <template slot-scope="{row}">
            <span>{{row.end}}</span>
          </template>
        </el-table-column>
        <el-table-column label="Total Bytes" align="center">
          <template slot-scope="{row}">
            <span>{{row.total}}</span>
          </template>
        </el-table-column>
        <el-table-column label="Operator" align="center">
          <template slot-scope="{row}">
            <span>{{row.operator}}</span>
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
      </el-row><!--
      <el-table
        :data="mapList"
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
      </el-table>       -->
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
            <span>{{row.CreateTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="Direction" align="center">
          <template slot-scope="{row}">
            <span>{{row.Direction}}</span>
          </template>
        </el-table-column>
        <el-table-column label="Sender" align="center">
          <template slot-scope="{row}">
            <span>{{row.CenterNumber}}</span>
          </template>
        </el-table-column>
        <el-table-column label="Message" align="center">
          <template slot-scope="{row}">
            <span>{{row.Message}}</span>
          </template>
        </el-table-column>
        <el-table-column label="Status" align="center">
          <template slot-scope="{row}">
            <span>{{row.State}}</span>
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
                <div class=" font-16 bold color-grey">Session Activity</div>
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
              :all="false"         
              :lg="6"
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
                    <el-form-item label="Country Code" prop="iccid">
                      <el-input v-model="temp.country" disabled />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="16">
                  <el-col :xs="24" :sm="12">
                    <el-form-item label="SMS Country Code" prop="iccid">
                      <el-input v-model="temp.smscountry" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="12">
                    <el-form-item label="Customer" prop="iccid">
                      <el-input v-model="temp.organize" disabled />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="16">
                  <el-col :xs="24" :sm="12">
                    <el-form-item label="Service Profile" prop="iccid">
                      <el-input v-model="temp.ssp" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="12">
                    <el-form-item label="State" prop="iccid">
                      <el-input v-model="temp.state" disabled />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="16">
                  <el-col :xs="24" :sm="12">
                    <el-form-item label="Threshold" prop="iccid">
                      <el-input v-model="temp.threshold" disabled />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="12">                    
                    <el-form-item label="IPAddress" prop="iccid">
                      <el-input v-model="temp.ip" disabled />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <div class="el-card__footer w-100" >
              <el-button type="primary" class="dark-btn" style="margin-left:10px" @click="refreshState">
                <item :icon="'update-white'"/> Refresh</el-button>               
              <el-button class="blue-btn" type="primary">Save</el-button>
                
            </div>
          </el-card>
          <el-card class="box-card mt-30 card-details">
            <div class="">
              <div class="card-panel-left font-16">
                <div class=" font-16 bold color-grey">Data Details</div>
              </div>
              <div class="card-panel-left pt-20">
                <el-button type="primary" class="green-btn" @click="showSessions"><item :icon="'csp'"/> Session Data</el-button> 
                <el-button type="primary" class="violet-btn" @click="showSMSUsage"><item :icon="'sms-white'"/> SMS History</el-button>
                <el-button type="primary" class="blue-btn" @click="showLocation"><item :icon="'map-white'"/> View Map</el-button>
                <el-button type="primary" class="orange-btn" @click="sendSMS"><item :icon="'sms-white'"/> Send SMS</el-button>
                <el-button type="primary" class="red-btn" @click="showHLR"><item :icon="'csp'"/> HLR</el-button>
              </div>
            </div>
          </el-card>
          <!--<div id="chart" class="sim-container">
              
            </div>-->
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
import { fetchSIMList } from '@/api/user'
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
      
        tablePeriod: 'Today',
        tableData: 'data',
      simDetailslistLeft: [{
        title: 'Imsi',
        value: '',
      },{
        title: 'MSISDN',
        value: '',
      },{
        title: 'Visitor Location Register',
        value: '',
      }],
      simDetailslistRight: [{
        title: 'Packet Switched Up Time',
        value: '',
      },{
        title: 'Circuit Switch Up Time',
        value: '',
      },{
        title: 'EPCMMERealm',
        value: '',
      }],
      tableKey: 0,
      downloadLoading: false,
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
      currentState: 'No data',
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
      locationList: [
        {title: 'IMSI', value: ''},
        {title: 'Network Operator', value: ''},
        {title: 'Area', value: ''},
        {title: 'Longitude', value: ''},
        {title: 'Latitude', value: ''},
        {title: 'Country', value: ''},
        {title: 'Cell', value: ''},
        {title: 'Time Update', value: ''},
        {title: 'Current Session Date', value: ''},
        {title: 'Current Usage', value: ''}
      ],
      markerLatLng: [0, 0],//47.413220, -1.219482
      sessionList: [],
      hlrList: [],
      mapList: [],
      smsUsageList: [],
			month_names_short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    }
  },
  created() {
    //this.searchTotalByPeriod('daily')
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
        
        let self = this
          var settings = {
					  "url": 'https://test4.m2mdata.co/JT/Sim/Query',
					  "method": "POST",
					  "timeout": 0,
					  "headers": {
						"token": "00000000-0000-0000-0000-000000000000",
						"Content-Type": "application/x-www-form-urlencoded"
					  },
					  "data": {
						  "imsis[]":  imsi,
						}
					};

					$.ajax(settings).done(function (response) { 
            console.log('total',response)
            if(response.rows.length){
              let total = response.rows[0]   
              console.log('total',total)           
              switch (period){
                case 'daily':
                    self.panelData = {
                        totalDataUsage: total.DataDay ? total.DataDay:0,///1048576 : 0,
                        totalSMSUsage: total.SMSMODay + total.SMSMTDay,
                        totalDuration: total.DurationDay,//(3600*response.Table3[0].JTOV_DATA_DAY)/(response.Table3[0].JTOV_DURATION_DAY*1048576),
                        totalDataSessions: total.SessionDay,
                        loaded: true
                    }
                break
                case 'weekly':
                    self.panelData = {
                        totalDataUsage: total.DataWeek ? total.DataWeek:0,///1048576 : 0,
                        totalSMSUsage: total.SMSMOWeek + total.SMSMTWeek,
                        totalDuration: total.DurationWeek,//(3600*response.Table3[0].JTOV_DATA_DAY)/(response.Table3[0].JTOV_DURATION_DAY*1048576),
                        totalDataSessions: total.SessionWeek,
                        loaded: true
                    }
                break
                case 'monthly':
                    self.panelData = {
                        totalDataUsage: total.DataMonth ? total.DataMonth:0,///1048576 : 0,
                        totalSMSUsage: total.SMSMOMonth + total.SMSMTMonth,
                        totalDuration: total.DurationMonth,//(3600*response.Table3[0].JTOV_DATA_DAY)/(response.Table3[0].JTOV_DURATION_DAY*1048576),
                        totalDataSessions: total.SessionMonth,
                        loaded: true
                    }
                break
                case 'yearly':
                    self.panelData = {
                        totalDataUsage: total.DataYear ? total.DataYear:0,///1048576 : 0,
                        totalSMSUsage: total.SMSMOYear + total.SMSMTYear,
                        totalDuration: total.DurationYear,//(3600*response.Table3[0].JTOV_DATA_DAY)/(response.Table3[0].JTOV_DURATION_DAY*1048576),
                        totalDataSessions: total.SessionYear,
                        loaded: true
                    }
                break
            }
          }            
        })

        /*await getDemoOwerview(this.$store.state.user.login, imsi).then(response => {
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
        })*/
    },

    /*
    async searchTable() {
      this.list = []
      let pref_1 = this.tableData === 'SMS Usage'?'S':'D'
      let sort = this.tableData === 'SMS Usage'?'DataDay':'DataDay'
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
        case 'Year':
            pref_2 = 'Y'
            break
      }

      const current = moment()          

      let self = this
      var settings = {
        "url": 'https://test.m2mdata.co/JT/Sim/Query',
        "method": "POST",
        "timeout": 0,
        "headers": {
        "token": "00000000-0000-0000-0000-000000000000",
        "Content-Type": "application/x-www-form-urlencoded"
        },
        "data": {
          'UsageReportType': pref_1 + pref_2,
          'sort': sort,
          'order': 'desc' 
        }
      };

      let totalSMS = 0;
      let totalData = 0;

      $.ajax(settings).done(function (response) { 
          let rows = response.rows   
          
          const arrTable = []

          rows.forEach((element, index) => {
           arrTable.push({
              num: index + 1,
              imsi: element.IMSI,
              customer: element.OrganizeName,
              total: (element.DataDay/1048576).toFixed(3),
              csp: element.ServiceProfileName,
              sms: element.TotalSMSMO + element.TotalSMSMT,
              sessions: element.SessionDay,
              lastUpdate: element.DataUpdateTime
          })
       
            arrLabel.push(element.date.slice(0, 10))   
            let chartData = isNaN(parseFloat(element.totals?.data.originalUnits/1048576))?0:element.totals?.data.originalUnits/1048576
            arrData.push((+chartData).toFixed(1))
            totalData += +chartData
            let chartSMS = isNaN(parseFloat(element.totals?.sms?.originalUnits))?0:element.totals?.sms?.originalUnits
            totalSMS += +chartSMS
              
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
            data: arrData.map(el=>el=totalSMS)
          }]
        
      })
    },*/

    async getProfile() {
      let self = this

     const imsi =  this.$route.params.id
        var settings = {
          "url": 'https://test4.m2mdata.co/JT/Report/DailyUsage?IMSI='+imsi,
          "method": "POST",
          "timeout": 0,
          "headers": {
          "token": "00000000-0000-0000-0000-000000000000",
          "Content-Type": "application/x-www-form-urlencoded"
          },
          "data": {
            "Since": moment(curday, 'YYYY-MM-DD').add(-10, 'days').format('YYYY-MM-DD'),
            "page": "1",
            "rows": "14"
          }
        };

        $.ajax(settings).done(function (response) {
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
          }
          })

      
      

      /*this.lineCollection = {
        labels: usageLabels,
        datasets: [
          {
            label: 'Data Usage',
            backgroundColor: 'rgb(53, 165, 228)',
            data: usageData
          }
        ]}*/




        let query = {
				  IMSIs: [this.$route.params.id]
				}
		 /*		
				var settings = {
				  "url": "https://test.m2mdata.co/JT/Sim/Query",
				  "method": "POST",
				  "timeout": 0,
				  "headers": {
					"token": "00000000-0000-0000-0000-000000000000",
					"Content-Type": "application/x-www-form-urlencoded"
				  },
				  "data": query
        };*/
      let responseProfile = await fetchSIMList(query) 
      if(responseProfile){        
        let objProfile = responseProfile.rows[0]

        
        this.panelData = {
            totalDataUsage: objProfile.DataDay ? objProfile.DataDay:0,///1048576 : 0,
            totalSMSUsage: objProfile.SMSMODay + objProfile.SMSMTDay,
            totalDuration: objProfile.DurationDay,//(3600*response.Table3[0].JTOV_DATA_DAY)/(response.Table3[0].JTOV_DURATION_DAY*1048576),
            totalDataSessions: objProfile.SessionDay,
            loaded: true
        }


        this.temp = {
          imsi: objProfile.IMSI,
          iccid: objProfile.ICCID,
          msisdn: objProfile.MSISDN,
          ip: objProfile.IPAddress,
          datacountry: objProfile.DataCountryCode,
          organize: objProfile.OrganizeName,
          ssp: objProfile.ServiceProfileName,
          state: objProfile.State,
          threshold: objProfile.ThresholdName,
          smscountry: objProfile.SMSCountryCode,
        }      
        
        let rag = 'bg-color-grey'
        let update = ''
        let jsonDataArr = []

         let currentTime = moment();
      let halfDayAgo = moment(currentTime, 'YYYY-MM-DD HH').add(-12, 'hours').format('YYYY-MM-DD HH'); 
      let oneDayAgo = moment(currentTime, 'YYYY-MM-DD HH').add(-1, 'days').format('YYYY-MM-DD HH'); 
      let threeDayAgo = moment(currentTime, 'YYYY-MM-DD HH').add(-3, 'days').format('YYYY-MM-DD HH');
          /*
        const oneDayAgo = moment(curday, 'YYYY-MM-DD').add(-1, 'days').format('YYYY-MM-DD')
        const threeDayAgo = moment(curday, 'YYYY-MM-DD').add(-3, 'days').format('YYYY-MM-DD')
        const weekAgo = moment(curday, 'YYYY-MM-DD').add(-7, 'days').format('YYYY-MM-DD')
        */

        self.currentState = this.temp.state
        let utcDate = ''
        if(objProfile.DataUpdateTime != null){
          const activityTime = objProfile.DataUpdateTime
          let utcActivityDate = moment.utc(activityTime).toDate()
          utcDate = utcActivityDate.getDate() + ' ' + self.month_names_short[utcActivityDate.getMonth()] + ' ' + utcActivityDate.getFullYear() + ' ' + ('0' + utcActivityDate.getHours()).slice(-2) + ':' + ('0' + utcActivityDate.getMinutes()).slice(-2) + ':' + ('0' + utcActivityDate.getSeconds()).slice(-2)
                      
          this.lastUpdateTime = utcDate
        }
        if(!utcDate.length){

        }
        else if(utcDate >= halfDayAgo){
            rag = 'bg-color-green'
          }else if(utcDate >= oneDayAgo && utcDate < halfDayAgo){
            rag = 'bg-color-yellow'
          }else {
            rag = 'bg-color-red'
          }
        
        
        /*~~const responseActiveSession = await fetch(`https://m2mdata.co/jt/GetActiveSession?imsi=${objProfile.IMSI}`)
        let resActiveSession = await responseActiveSession.json()
                        
        if(resActiveSession.Data){
          if(resActiveSession.Data.startDateField == null){
            
          //rag = 'bg-color-grey'
          }else if(resActiveSession.Data.lastInterimDateField == null){
            rag = 'bg-color-green'

            let startDate = moment.utc(resActiveSession.Data.startDateField).toDate()
            let utcDate = startDate.getDate() + ' ' + self.month_names_short[startDate.getMonth()] + ' ' + startDate.getFullYear() + ' ' + ('0' + startDate.getHours()).slice(-2) + ':' + ('0' + startDate.getMinutes()).slice(-2) + ':' + ('0' + startDate.getSeconds()).slice(-2)
              
            this.lastUpdateTime = utcDate
            //this.lastUpdateTime = resActiveSession.Data.startDateField
          
          }else{
            const simActivityTime = moment(resActiveSession.Data.lastInterimDateField, 'YYYY-MM-DD HH').format('YYYY-MM-DD HH')
          
            let startDate = moment.utc(resActiveSession.Data.lastInterimDateField).toDate()
						let utcDate = startDate.getDate() + ' ' + self.month_names_short[startDate.getMonth()] + ' ' + startDate.getFullYear() + ' ' + ('0' + startDate.getHours()).slice(-2) + ':' + ('0' + startDate.getMinutes()).slice(-2) + ':' + ('0' + startDate.getSeconds()).slice(-2)
										 
            this.lastUpdateTime = utcDate

          if(simActivityTime >= halfDayAgo){
              rag = 'bg-color-green'
            }else if(simActivityTime >= oneDayAgo && simActivityTime < halfDayAgo){
              rag = 'bg-color-yellow'
            }else {
              rag = 'bg-color-red'
            }
          }
        }*/
        

          var listQuery_1 = {
            imsi: objProfile.IMSI
        }
        
        var settings_1 = {
            "url": "https://test4.m2mdata.co/JT/Sim/GETSESSIONS",
            "method": "POST",
            "timeout": 0,
            "headers": {
            "token": "00000000-0000-0000-0000-000000000000",
            "Content-Type": "application/x-www-form-urlencoded"
            },
            "data": listQuery_1
        };
                            				
          	
          $.ajax(settings_1).done(  function (result_1) {           
            if(result_1.Data != null && result_1.Data.length){
              let dataArr = result_1.Data.split('\r\n')
              dataArr.pop()									
              dataArr.forEach((element, index) => {
                let dataJson = element.split(',')
                let startDate = moment.utc(dataJson[4]).toDate()
                let endDate = moment.utc(dataJson[5]).toDate()											
                
                let jsonDataObj = {
                  startUTC: startDate,
                  start: startDate.getDate() + ' ' + self.month_names_short[startDate.getMonth()] + ' ' + startDate.getFullYear() + ' ' + ('0' + startDate.getHours()).slice(-2) + ':' + ('0' + startDate.getMinutes()).slice(-2) + ':' + ('0' + startDate.getSeconds()).slice(-2),
                  end: endDate.getDate() + ' ' + self.month_names_short[endDate.getMonth()] + ' ' + endDate.getFullYear() + ' ' + ('0' + endDate.getHours()).slice(-2) + ':' + ('0' + endDate.getMinutes()).slice(-2) + ':' + ('0' + endDate.getSeconds()).slice(-2),
                  total: dataJson[3],
                  operator: dataJson[1]+dataJson[2]
                }
                jsonDataArr.push(jsonDataObj)
              })						


            let sortedArr = jsonDataArr.sort(function(a,b){
                var c = new Date(a.start)
                var d = new Date(b.start)
                return d-c
              })

          self.sessionList = sortedArr

          /*if(self.lastUpdateTime.length==0){           
              
              self.lastUpdateTime = sortedArr[0].end
              
              const simActivityTime = moment(self.lastUpdateTime, 'YYYY-MM-DD HH').format('YYYY-MM-DD HH')

              if(simActivityTime >= halfDayAgo){
                rag = 'bg-color-green'
              }else if(simActivityTime >= oneDayAgo && simActivityTime < halfDayAgo){
                rag = 'bg-color-yellow'
              }else {
                rag = 'bg-color-red'
              }									
            }*/
          }

        /*
        const responseHlr = await fetch(`https://m2mdata.co/jt/GetGetHlrInfo?imsi=${objProfile.IMSI}`)
        let resHlr = await responseHlr.json()
                        
        if(resHlr.Data){
          if(resHlr.Data?.hlrInfoFieldsField == undefined){		
          
            rag = 'bg-color-grey'
          }else{
            
            let chooseHlrDate = ''
            if(resHlr.Data.hlrInfoFieldsField.find(el=>el.nameField == 'Packet Switched Up Time').valueField != '00000000000000'){
              let hlrDate1 = resHlr.Data.hlrInfoFieldsField.find(el=>el.nameField == 'Packet Switched Up Time').valueField
              chooseHlrDate = hlrDate1.slice(0,4) + '-' + hlrDate1.slice(4,6) + '-' + hlrDate1.slice(6,8) + ' ' + hlrDate1.slice(8,10) + ':' + hlrDate1.slice(10,12)
            }else if(resHlr.Data.hlrInfoFieldsField.find(el=>el.nameField == 'Circuit Switch Up Time').valueField != '00000000000000'){
            
              let hlrDate1 = resHlr.Data.hlrInfoFieldsField.find(el=>el.nameField == 'Circuit Switch Up Time').valueField
              chooseHlrDate = hlrDate1.slice(0,4) + '-' + hlrDate1.slice(4,6) + '-' + hlrDate1.slice(6,8) + ' ' + hlrDate1.slice(8,10) + ':' + hlrDate1.slice(10,12)
              
            }
            
            if(chooseHlrDate.length){
              const simActivityTime = moment(chooseHlrDate, 'YYYY-MM-DD HH').format('YYYY-MM-DD HH')
              this.lastUpdateTime = chooseHlrDate
          
              if(simActivityTime >= halfDayAgo){
                rag = 'bg-color-green'
              }else if(simActivityTime >= oneDayAgo && simActivityTime < halfDayAgo){
                rag = 'bg-color-yellow'
              }else {
                rag = 'bg-color-red'
              }											
            }
          }
        }else{
          if(objProfile.SMSMOUpdateTime == null && objProfile.DataUpdateTime == null){
            rag = 'bg-color-grey'
          }else if(objProfile.DataUpdateTime == null){
            rag = 'bg-color-grey'
          }else{
            const simActivityTime = moment(objProfile.DataUpdateTime, 'YYYY-MM-DD HH').format('YYYY-MM-DD HH')
            this.lastUpdateTime = objProfile.DataUpdateTime.replace("T", " ").replace("Z", "")
          
            if(simActivityTime >= halfDayAgo){
              rag = 'bg-color-green'
            }else if(simActivityTime >= oneDayAgo && simActivityTime < halfDayAgo){
              rag = 'bg-color-yellow'
            }else {
              rag = 'bg-color-red'
            }
          }
        }*/

        self.currentStateColor = rag
        
        if(rag == 'bg-color-grey' && self.temp.state == 'Productive'){
          self.lastUpdateTime = ''
          self.currentState = self.temp.state + ', but no current data session'
        }

        })
      
    }
        
        
        /*~~~if(this.temp.state == 'Suspended'){
          self.currentStateColor = 'bg-color-yellow'
        }else if(objProfile.SMSMOUpdateTime == null && objProfile.DataUpdateTime == null){
          self.currentStateColor = 'bg-color-grey'
          if(this.temp.state == 'Productive' || this.temp.state == 'TestProductive'){
            self.currentStateColor = 'bg-color-blue'
            self.currentState = this.temp.state + ', but no current data session'
          }
        }else if(objProfile.DataUpdateTime == null){
          self.currentStateColor = 'bg-color-grey'
          if(this.temp.state == 'Productive' || this.temp.state == 'TestProductive'){
            self.currentStateColor = 'bg-color-blue'
            self.currentState = this.temp.state + ', but no current data session'
          }
        }else{
          const simActivityTime = moment(objProfile.DataUpdateTime, 'YYYY-MM-DD').format('YYYY-MM-DD')
          this.lastUpdateTime = objProfile.DataUpdateTime.replace("T", " ").replace("Z", "")
          
          if(simActivityTime >= oneDayAgo){
            self.currentStateColor = 'bg-color-green'
          }else {
            self.currentStateColor = 'bg-color-yellow'
          }
        }*/
      //}
      
        const responseHLR = await fetch(`https://m2mdata.co/jt/GetGetHlrInfo?imsi=${query.IMSIs}`)
        let resHLR = await responseHLR.json()
        
        let mapList = resHLR.Data.dataMapField
        let hlrList = resHLR.Data.hlrInfoFieldsField
        
        let hlrDate1 = hlrList.find(el=>el.nameField==this.simDetailslistRight[0].title).valueField
				let hlrDate2 = hlrList.find(el=>el.nameField==this.simDetailslistRight[1].title).valueField
          
        this.simDetailslistLeft[0].value = hlrList.find(el=>el.nameField==this.simDetailslistLeft[0].title).valueField
        this.simDetailslistLeft[1].value = mapList.find(el=>el.keyField==this.simDetailslistLeft[1].title)?.valueField	
        this.simDetailslistLeft[2].value = hlrList.find(el=>el.nameField==this.simDetailslistLeft[2].title).valueField	
        this.simDetailslistRight[0].value = hlrDate1=='00000000000000'?'':hlrDate1.slice(0,4) + '-' + hlrDate1.slice(4,6) + '-' + hlrDate1.slice(6,8) + ' ' + hlrDate1.slice(8,10) + ':' + hlrDate1.slice(10,12) + ':' + hlrDate1.slice(12,14)
        this.simDetailslistRight[0].title = 'Data Connect Up Time'
        this.simDetailslistRight[1].value = hlrDate2=='00000000000000'?'':hlrDate2.slice(0,4) + '-' + hlrDate2.slice(4,6) + '-' + hlrDate2.slice(6,8) + ' ' + hlrDate2.slice(8,10) + ':' + hlrDate2.slice(10,12) + ':' + hlrDate2.slice(12,14)
        this.simDetailslistRight[1].title = 'SMS Connect Up Time'
        this.simDetailslistRight[2].value = mapList.find(el=>el.keyField==this.simDetailslistRight[2].title)?.valueField	
        
        this.mapList = mapList
        let indexToRemove1 = this.mapList.findIndex(el=>el.keyField=='MSISDN')
        if(indexToRemove1!=-1){
          this.mapList.splice(indexToRemove1, 1)
        }
        let indexToRemove2 = this.mapList.findIndex(el=>el.keyField=='APN2')
        if(indexToRemove2!=-1){
          this.mapList.splice(indexToRemove2, 1)
        }
    },    
    refreshState(){
      this.isLoading = true
      let self = this
      //const response = await forceReconnectAsync(this.simQuery)     
      let queryLBS = {
				  imsis: [this.$route.params.id]
				}
				
				let settingsLBS = {
				  "url": "https://test4.m2mdata.co/JT/Sim/Refresh",
				  "method": "POST",
				  "timeout": 0,
				  "headers": {
					"token": "00000000-0000-0000-0000-000000000000",
					"Content-Type": "application/x-www-form-urlencoded"
				  },
				  "data": queryLBS
				};
    
				$.ajax(settingsLBS).done(function (result) {
            self.isLoading = false
					if(result.MajorCode == '000'){   
            //self.showLocation()
            self.$alert('Sim state refreshed', 'M2M Data Message', {type: 'message'})
          }else{
            self.$alert('Sim state was not refreshed', 'M2M Data Message', {type: 'message'})
          }
        }) 
    },
    forceReconnect(){      
      this.isLoading = true
      let self = this
      //const response = await forceReconnectAsync(this.simQuery)     
      let queryLBS = {
				  IMSIs: [this.$route.params.id]
				}
				
				let settingsLBS = {
				  "url": "https://test.m2mdata.co/JT/Sim/Reboot",
				  "method": "POST",
				  "timeout": 0,
				  "headers": {
					"token": "00000000-0000-0000-0000-000000000000",
					"Content-Type": "application/x-www-form-urlencoded"
				  },
				  "data": queryLBS
				};

				$.ajax(settingsLBS).done(function (result) {
            self.isLoading = false
					if(result.MajorCode == '000'){
            //self.$alert('Sim connection refreshed', 'M2M Data Message', {type: 'message'})
            
            self.mapFormVisible = false
            self.showLocation()
          }else{
            self.$alert('Sim connection was not refreshed', 'M2M Data Message', {type: 'message'})
          }
        })     
      
    },
    async showSMSUsage(){
      let self = this
      this.isLoading = true
      /*const query = {
        imsi: this.$route.params.id
      }*/

      var settings = {
					  "url": "https://test4.m2mdata.co/JT/SMS/History",
					  "method": "POST",
					  "timeout": 0,
					  "headers": {
						"token": "00000000-0000-0000-0000-000000000000",
						"Content-Type": "application/x-www-form-urlencoded"
					  },
					  "data": {
						"IMSI": this.$route.params.id,
						"PAGE": "1",
						"pagesize": "100",
					  }
					};

					$.ajax(settings).done(function (response) {           
            let sortedArr = response.Data.sort(function(a,b){
              let c = new Date(a.CreateTime)
              let d = new Date(b.CreateTime)
              return d-c
            })
            //let renderArr = sortedArr.map(el=>{el.CenterNumber.toString())
            let renderArr = sortedArr.map(el => ({...el, CreateTime: el.CreateTime.slice(0,19).replace('T', ' '), CenterNumber: el.CenterNumber.toString(), Direction: el.Direction==2?'Outbound':'Inbound', State: el.State==0?'Error':el.State==1?'Sent':el.State==2?'Submitted':el.State==3?'Delivered':'Received'}))
            
            self.smsUsageList = renderArr 
            console.log('OKKK-his',self.smsUsageList) 
            setTimeout(() => {
              self.smsFormVisible = true
              self.isLoading = false
            },5000)
          }).fail(function (e){
            self.smsFormVisible = false
            self.isLoading = false
            
            self.smsFormVisible = true
            self.smsUsageList = []
            return
          })
        /*const response = await getSMSHistoryAsync(query).catch(e=>{
        this.smsFormVisible = false
        this.isLoading = false
        
        this.smsFormVisible = true
        this.smsUsageList = []
        return
      })
      */
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
      let self = this
        /*var queryLBS = {
				  imsi: this.$route.params.id
				}
				
				var settingsLBS = {
				  "url": "https://test.m2mdata.co/JT/Sim/Refresh",
				  "method": "POST",
				  "timeout": 0,
				  "headers": {
					"token": "00000000-0000-0000-0000-000000000000",
					"Content-Type": "application/x-www-form-urlencoded"
				  },
				  "data": queryLBS
				};

				$.ajax(settingsLBS).done(function (result) {
					console.log('lbs',result)
				})*/

      //country by coords

       let queryLBS = {
				  imsi: [this.$route.params.id]
				}
				
				let settingsLBS = {
				  "url": "https://test4.m2mdata.co/JT/Sim/QueryLBSInfo",
				  "method": "POST",
				  "timeout": 0,
				  "headers": {
					"token": "00000000-0000-0000-0000-000000000000",
					"Content-Type": "application/x-www-form-urlencoded"
				  },
				  "data": queryLBS
				};

				$.ajax(settingsLBS).done(function (result) {
          const activityTime = result.Data.DataUpdateTime
          let utcActivityDate = moment.utc(activityTime).toDate()
          let utcDate = utcActivityDate.getDate() + ' ' + self.month_names_short[utcActivityDate.getMonth()] + ' ' + utcActivityDate.getFullYear() + ' ' + ('0' + utcActivityDate.getHours()).slice(-2) + ':' + ('0' + utcActivityDate.getMinutes()).slice(-2) + ':' + ('0' + utcActivityDate.getSeconds()).slice(-2)
                      
        
          self.locationList[0].value = result.Data.IMSI
          self.locationList[1].value = result.Data.LbsNetwork
          self.locationList[2].value = result.Data.LbsArea
          self.locationList[6].value = result.Data.LbsRadio + ' ' + result.Data.LbsRange
          self.locationList[7].value = utcDate
          self.locationList[8].value = result.Data.SessionDay
          self.locationList[9].value = (result.Data.DataDay/1048576).toFixed(3)
          const query_1 = {
            lat: result.Data.LbsLat,
            lon: result.Data.LbsLng
          }
          if(result.Data.LbsLat != null){
          self.markerLatLng = [query_1?.lat, query_1?.lon]
          self.center = L.latLng(query_1?.lat, query_1?.lon)
          self.locationList[3].value = query_1?.lat
          self.locationList[4].value = query_1?.lon       
            getSIMCountry(query_1).then(response_1 => {
              const country = response_1.data.address.country
              self.locationList[5].value = country
              self.mapFormVisible = true
              self.isLoading = false
            })
          }else{
            self.markerLatLng = [0, 0]
            self.center = L.latLng(0, 0)
            self.locationList[3].value = ''
            self.locationList[4].value = ''   
            self.locationList[5].value = ''
              self.mapFormVisible = true
              self.isLoading = false
          }
        })

      /*const query = {
        id: this.simQuery.id
      }
      getSIMCoordinates(query).then(response => {
       
      }).catch(e=>{
        this.locationList.push(
          {title: 'Country', value: ''},
          {title: 'Longitude', value: '0'},
          {title: 'Latitude', value: '0'})
        this.mapFormVisible = true
        this.isLoading = false
      })*/
    },
    handleSessionsDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['Start Date', 'End Date', 'Total Bytes', 'Operator']
        const filterVal = ['start',  'end', 'total', 'operator']
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
        const tHeader = ['Date', 'Direction', 'Sender', 'Message', 'Status']
        const filterVal = ['CreateTime', 'Direction', 'CenterNumber', 'Message', 'State']
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
.pt-20{
  padding-top:20px;
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

.bg-color-yellow{
  background-color: #ffb880;
}

.bg-color-green{
  background-color: #34bfa3;
}

.bg-color-red{
  background-color: #d47980;
}

.card-details .el-button {
    margin: 0px 10px 10px 0px;

}

</style>
