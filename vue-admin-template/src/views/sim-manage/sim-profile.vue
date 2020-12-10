<template>
  <el-container class="">      
    <el-dialog v-loading="mapLoading" :visible.sync="dialogFormVisible" width="70%">
        
    </el-dialog>
    <el-main  class="no-padding">
      <div class="mixin-components-container">
        <el-row style="margin: 30px">
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
              <el-button class="btn-primary-pos" type="primary">Save</el-button>                
            </div>
          </el-card>
          <div class="mt-30">
            <panel-group
              :total="panelData"
              @change="searchTotalByPeriod"
            />
          </div>
          <el-card class="box-card">     
            <div class="card-flex">
              <div class="card-inline card-panel-left font-16">
                <b>Data Details</b>
                <p>Click on the button to open a popup with info.</p>
              </div>
              <div class="card-inline card-panel-right">
                <el-button type="success" icon="el-icon-menu">Session Data</el-button> 
                <el-button type="warning" icon="el-icon-mail">SMS Usage</el-button> 
                <el-button type="primary" icon="el-icon-location" @click="showMap">View Map</el-button> 
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
import L from 'leaflet';
import { LMap, LTileLayer, LMarker, LControlLayers, LPolyline, LFeatureGroup, LPopup } from 'vue2-leaflet';
import PanelGroup from '../dashboard/admin/components/PanelGroup'
import LineChart from '../dashboard/admin/components/LineChart.js'
import { getSIMAsync } from '@/api/sim'

export default {
  name: 'SIMProfile',
  components: {
    PanelGroup,
    LineChart,
    
    LMap, LTileLayer, LMarker, LControlLayers, LPolyline, LFeatureGroup, LPopup
  },
  data() {
    return {
      profileQuery: {
        id: undefined
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
      dialogFormVisible: false,
      mapLoading: true,
      zoom: 13,
      center: L.latLng(47.41322, -1.219482),
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
    }
  },
  created() {
    this.profileQuery.id = this.$route.params.id
    this.getProfile()
  },
  mounted() {    
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
      const response = await getSIMAsync(this.profileQuery)    
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
      this.lineCollection = {
        labels: ['02.12', '03.12', '04.12', '05.12', '06.12', '07.12', '08.12', '09.12', '10.12'],
        datasets: [
          {
            label: 'Data Usage',
            backgroundColor: 'rgb(53, 165, 228)', 
            data: [200, 230, 233, 190, 150, 210, 208, 201, 117]
          }
        ]}

      console.log(this.temp.imsi)
    },
    async searchTotalByPeriod(period) {
    
    },
    showMap(){
      this.dialogFormVisible = true
    }
  }
}

</script>


<style >

  .map-container{
    width: 100%;height: 300px;
  }
  .w-100{
    width: 100%;
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
  .card-flex{
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }
  .chart-container{
    background:#fff;
    padding: 30px;
    border-radius: 5px;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  }
  
</style>