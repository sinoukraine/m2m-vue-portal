<template>
  <el-container class="with-panel-wrapper " :class="{'panel-opened': isRightPanelVisible}">
    <loading :active.sync="isLoading" 
        :can-cancel="true" 
        :is-full-page="fullPage">
    </loading><!--
        :on-cancel="onCancel"-->

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

    <el-container class="page-fixed-height padding-vertical-x2">
      <el-main  class="no-padding">
        <div class="filter-container ">
          <div class="display-flex justify-content-between">
            <div class="buttons-row">
              <el-button v-waves class="button-custom"><item :icon="'activation'"/> {{ $t('ACTIVATION') }}</el-button>
              <el-button v-waves class="button-custom"><item :icon="'state'"/> {{ $t('STATE') }}</el-button>
              <el-button v-waves class="button-custom"><item :icon="'sim-blue'"/> {{ $t('MOVE_SIM') }}</el-button>
              <el-button v-waves class="button-custom"><item :icon="'csp-blue'"/> {{ $t('CSP') }}</el-button>
              <el-button v-waves class="button-custom"><item :icon="'profile-blue'"/> {{ $t('AGENT') }}</el-button>
              <el-button v-waves class="button-custom"><item :icon="'solution-blue'"/> {{ $t('SOLUTION') }}</el-button>
            </div>
            <div class="buttons-row white-space-nowrap">
              <el-button v-waves class="button-custom blue-btn" type="primary"><item :icon="'update-white'"/></el-button>
              <el-button v-waves class="button-custom blue-btn" type="primary"><item :icon="'save-white'"/></el-button>
            </div>
          </div>
          <div class="buttons-row">
            <el-checkbox v-model="checkboxICCID">{{ $t('ICCID') }}</el-checkbox>
            <el-checkbox v-model="checkboxMSSDN">{{ $t('MSISDN') }}</el-checkbox>
            <el-checkbox v-model="checkboxBusinessUnit">{{ $t('BUSINESS_UNIT') }}</el-checkbox>
            <el-checkbox v-model="checkboxCSP">{{ $t('CSP') }}</el-checkbox>
            <el-checkbox v-model="checkboxState">{{ $t('STATE') }}</el-checkbox>
            <el-checkbox v-model="checkboxRAG">{{ $t('RAG') }}</el-checkbox>
            <el-checkbox v-model="checkboxSolution">{{ $t('SOLUTION') }}</el-checkbox>
            <el-checkbox v-model="checkboxAgent">{{ $t('AGENT') }}</el-checkbox>
            <el-checkbox v-model="checkboxCustomer">{{ $t('CUSTOMER') }}</el-checkbox>
            <el-checkbox v-model="checkboxDataSession">{{ $t('DATA_SESSION') }}</el-checkbox>
            <el-checkbox v-model="checkboxDataUsage">{{ $t('DATA_USAGE') }}</el-checkbox>
            <el-checkbox v-model="checkboxSMSUsage">{{ $t('SMS_USAGE') }}</el-checkbox>
            <el-checkbox v-model="checkboxZeroSession">{{ $t('ZERO_SESSION') }}</el-checkbox>
          </div>
        </div>
        <div class="table-wrapper">
          <el-table
            :key="tableKey"
            v-loading="listLoading"
            :data="list"
            border
            fit
            @sort-change="sortChange"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              align="center"
              type="selection"
              width="40">
            </el-table-column>
            <el-table-column :label="$t('MAP')" align="center" width="60px">
              <template slot-scope="{row}">
                <img src="map-blue.svg" class="map-table-icon" @click="showLocation(row)"/>              
              </template>
            </el-table-column>
            <el-table-column :label="$t('IMSI')"   :class-name="getSortClass('imsi')" align="left" min-width="140px">
              <template slot-scope="{row}">
                <router-link class="link" :to="{ path: `/sim-list/${row.id}` }">
                  {{ row.imsi }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column v-if="checkboxICCID" :label="$t('ICCID')"  :class-name="getSortClass('iccid')" align="left" min-width="160px">
              <template slot-scope="{row}">
                <span>{{ row.iccid }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="checkboxMSSDN" :label="$t('MSISDN')"  :class-name="getSortClass('msisdn')" align="left" min-width="160px">
              <template slot-scope="{row}">
                <span>{{ row.msisdn }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="checkboxBusinessUnit" :label="$t('BUSINESS_UNIT')"  :class-name="getSortClass('businessUnit')" align="left" min-width="140px">
              <template slot-scope="{row}">
                <span>{{ row.businessUnit }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="checkboxCSP" :label="$t('CSP')" :class-name="getSortClass('csp')" align="left" min-width="180px">
              <template slot-scope="{row}">
                <span>{{ row.csp }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="checkboxState" :label="$t('STATE')"  :class-name="getSortClass('state')" align="left" min-width="80px">
              <template slot-scope="{row}">
                <span>{{ row.state }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="checkboxRAG" :label="$t('RAG')" align="center" min-width="60px">
              <template slot-scope="{row}" align="center">
                <div class="square" :style="'background-color:'+row.rag+';'"></div>
              </template>
            </el-table-column>
            <el-table-column v-if="checkboxSolution" :label="$t('SOLUTION')"  :class-name="getSortClass('solution')" align="left" min-width="100px">
              <template slot-scope="{row}">
                <span>{{ row.solution }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="checkboxAgent" :label="$t('AGENT')" :class-name="getSortClass('agent')" align="left" min-width="120px">
              <template slot-scope="{row}">
                <span>{{ row.agent }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="checkboxCustomer" :label="$t('CUSTOMER')" :class-name="getSortClass('customer')" align="left" min-width="120px">
              <template slot-scope="{row}">
                <span>{{ row.customer }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="checkboxDataSession" :label="$t('DATA_SESSION')"  :class-name="getSortClass('dataSession')" align="left" min-width="130px">
              <template slot-scope="{row}">
                <span>{{ row.dataSession }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="checkboxDataUsage" :label="$t('DATA_USAGE')+'(Mb)'" :class-name="getSortClass('dataUsage')" align="left" min-width="120px">
              <template slot-scope="{row}">
                <span>{{ row.dataUsage/1000000 }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="checkboxSMSUsage" :label="$t('SMS_USAGE')"  :class-name="getSortClass('smsUsage')" align="left" min-width="120px">
              <template slot-scope="{row}">
                <span>{{ row.smsUsage }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="checkboxZeroSession" :label="$t('ZERO_SESSION')"  :class-name="getSortClass('zeroSession')" align="left" min-width="120px">
              <template slot-scope="{row}">
                <span>{{ row.zeroSession }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="false" :label="$t('ACTIONS')" fixed="right" align="center" width="100" class-name="small-padding fixed-width">
              <template slot-scope="{row}">
                <el-button type="primary blue-btn" size="mini" @click="handleUpdate(row)">
                  Edit
                </el-button>
                <!--<el-button  v-if="row.Status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
                  Delete
                </el-button>-->
              </template>
            </el-table-column>
          </el-table> 
          
          <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />
   
        </div>

        
      </el-main>
    </el-container>
    <el-aside class="panel panel-right"> 
      <div class="panel-open display-flex justify-content-between align-items-center" @click="isRightPanelVisible = !isRightPanelVisible">
        <i class="el-icon-arrow-left" />
      </div>
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
        <el-row :gutter="0">
          <el-col :xs="100">
            <div class="panel-hide padding-horizontal-x2 display-flex justify-content-between align-items-center" @click="isRightPanelVisible = !isRightPanelVisible">
              <p class="">{{ $t('MINIMIZE_PANEL') }}</p>
              <i class="el-icon-arrow-right" />
            </div>
          </el-col>
        </el-row>

        <div class="content-divider"></div>
        <el-form ref="listQuery" :model="listQuery" label-position="top" @submit.native.prevent="handleFilter">
          <input :id="filterSubmitId" type="submit" class="display-none">
          <div class="padding-horizontal-x2">
            <el-row :gutter="16" style="">
              <el-col :xs="100">
                <el-form-item :label="$t('IMSI')" prop="title" class="no-margin-bottom">
                  <el-input v-model="listQuery.imsi" placeholder="" class="filter-item" />
                </el-form-item>
                <el-form-item :label="$t('MSISDN')" prop="title" class="no-margin-bottom">
                  <el-input v-model="listQuery.msisdn" placeholder="" class="filter-item" />
                </el-form-item>
                <el-form-item :label="$t('ICCID')" prop="title" class="no-margin-bottom">
                  <el-input v-model="listQuery.iccid" placeholder="" class="filter-item" />
                </el-form-item>
                <el-form-item :label="$t('SOLUTION')" prop="title" class="no-margin-bottom">
                  <el-select v-model="solutionsArr[0]" :placeholder="$t('SOLUTION')" class="">
                    <el-option v-for="item in solutionsArr" :key="item.code" :label="item.name" :value="item.code" />
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('AGENT')" prop="title" class="no-margin-bottom">
                  <el-select v-model="agentsArr[0]" :placeholder="$t('AGENT')" class="">
                    <el-option v-for="item in agentsArr" :key="item.code" :label="item.name" :value="item.code" />
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('CUSTOMER')" prop="title" class="">
                  <el-select v-model="selectedCustomer" :placeholder="$t('CUSTOMER')">
                    <el-option v-for="item in customersArr" :key="item.code" :label="item.name" :value="item.code" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="content-divider"></div>
          <div class="padding-horizontal-x2">
            <el-row :gutter="16" style="">
              <el-col :xs="100">
                <el-form-item :label="$t('RAG')" prop="title" class="">
                  <el-checkbox><span class="rag bg-color-red"></span></el-checkbox>
                  <el-checkbox><span class="rag bg-color-yellow"></span></el-checkbox>
                  <el-checkbox><span class="rag bg-color-green"></span></el-checkbox>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="content-divider"></div>
          <div class="padding-horizontal-x2">
            <el-form-item :label="$t('STATE')" prop="title" class="">
              <el-row :gutter="16" style="">
                <el-col :span="12">
                  <el-checkbox>{{ $t('DELETED') }}</el-checkbox>
                </el-col>
                <el-col :span="12">
                  <el-checkbox>{{ $t('DELETING') }}</el-checkbox>
                </el-col>
                <el-col :span="12">
                  <el-checkbox>{{ $t('ON_STOCK') }}</el-checkbox>
                </el-col>
                <el-col :span="12">
                  <el-checkbox>{{ $t('PRODUCTIVE') }}</el-checkbox>
                </el-col>
                <el-col :span="12">
                  <el-checkbox>{{ $t('SUSPENDED') }}</el-checkbox>
                </el-col>
                <el-col :span="12">
                  <el-checkbox>{{ $t('TEST') }}</el-checkbox>
                </el-col>
                <el-col :span="12">
                  <el-checkbox>{{ $t('TEST_END') }}</el-checkbox>
                </el-col>
                <el-col :span="12">
                  <el-checkbox>{{ $t('TEST_PRODUCTIVE') }}</el-checkbox>
                </el-col>
              </el-row>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </el-aside>
  </el-container>
</template>

<script>
import L from 'leaflet'
import { LMap, LTileLayer, LMarker, LControlLayers, LPolyline, LFeatureGroup, LPopup } from 'vue2-leaflet'
import { latLng, Icon, icon } from 'leaflet'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Item from '@/layout/components/Sidebar/Item'
import { getSIMListAsync, getSIMAsync, getCustomerList, getSIMCoordinates, getSIMCountry, forceReconnectAsync } from '@/api/sim'
import moment from 'moment'

export default {
  components: {
    Pagination,
    Item,
    Loading,
    LMap, 
    LTileLayer, 
    LMarker, 
    LControlLayers, 
    LPolyline, 
    LFeatureGroup, 
    LPopup
  },
  directives: { waves },
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
      isLoading: false,
      fullPage: true,
      mapFormVisible: false,
      checkboxICCID: false,
      checkboxMSSDN: false,
      checkboxBusinessUnit: false,
      checkboxCSP: true,
      checkboxState: true,
      checkboxRAG: true,
      checkboxSolution: false,
      checkboxAgent: false,
      checkboxCustomer: true,
      checkboxDataSession: true,
      checkboxDataUsage: true,
      checkboxSMSUsage: true,
      checkboxZeroSession: false,
      isRightPanelVisible: true,
      filterSubmitId: Date.now(),
      solutionsArr: [
        { code: '1', name: 'Track' }
      ],
      agentsArr: [
        { code: '1', name: 'Agent' }
      ],
      customersArr: [
        { code: '1', name: 'Customer' }
      ],
      selectedCustomer: '0',
      tableKey: 0,
      total: 0,
      listLoading: true,
      locationList: [],

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

      list: [],
      listQuery: {
        page: 1,
        pageSize: 10,
        date1: '2020-10-29',
        date2: '2020-11-09',
        customer: undefined,
        sort: '+code',
        sample: '',
        imsi: '',
        iccid: '',
        msisdn: ''
      },
      multipleSelection: [],
    }
  },
  created() {
    this.getList()
    
  },
  /*mounted(){

  },*/
  methods: {    
    doSomethingOnReady() {
        this.map = this.$refs.map.mapObject
        this.map.invalidateSize()
    },
    async getList() {
      const arr = []
      const currentTime = moment()
      const oneDayAgo = moment(currentTime, 'YYYY-MM-DD').add(-1, 'days').format('YYYY-MM-DD')
      const threeDayAgo = moment(currentTime, 'YYYY-MM-DD').add(-3, 'days').format('YYYY-MM-DD')

      const response = await getSIMListAsync(this.listQuery)
      response.data.rows.forEach(async element => {    
        const query = {
          id: element._id,
          activity: true,
          states: true,
          ancestors: true 
        }
        const response_1 = await getSIMAsync(query)  
        let flowField = 0
        let smsField = 0
        let totalField = 0
        //let dataSessions = 0

        const customer = response_1.data.ancestors[0].info.name
        const state = response_1.data.extra.states.current
        const csp = response_1.data.extra.states.csp
        const activityArr = response_1.data.extra.activity.samples
        console.log(response_1)
        const sessions = response_1.data.extra.activity.totals.data.sessions
        let rag = ''
        /*if (response_1.data.extra.activity.totals != null && response_1.data.extra.activity.totals.flow != null){
          flowField += +response_1.data.extra.activity.totals.flow.originalUnits
        }*/
        if (response_1.data.extra.activity.totals != null && response_1.data.extra.activity.totals.sms != null){
          const smsCount = response_1.data.extra.activity.totals.sms.originalUnits == null ? 0 : response_1.data.extra.activity.totals.sms.originalUnits 
          smsField += +smsCount
        }
        if (response_1.data.extra.activity.totals != null && response_1.data.extra.activity.totals.data != null && response_1.data.extra.activity.totals.data.originalUnits != null){
          totalField += +response_1.data.extra.activity.totals.data.originalUnits
        }
        if(typeof activityArr == 'undefined'){
            rag = 'rgb(204,204,204)'
        }else{
          activityArr.forEach(element_1 => {
           /* if(element_1.hasOwnProperty('originalUnits')){
              dataSessions += +element_1.originalUnits
            }*/
          })
          const simActivityTime = moment(activityArr[activityArr.length - 1].endTime, 'YYYY-MM-DD').format('YYYY-MM-DD');
          if(simActivityTime >= oneDayAgo){
            rag = '#41bea2'
          }else if(simActivityTime >= threeDayAgo){
            rag = '#ffb880'
          }else{
            rag = '#d77980'
          }
        }
        
        arr.push({
          id: element._id,
          imsi: element.info.imsi,
          iccid: element.info.iccid,
          msisdn: element.info.msisdn,
          businessUnit: 'aus',
          csp,
          state,
          rag,
          solution: 'Track',
          agent: 'M2M Data',
          customer,
          dataSession: sessions,
          dataUsage: totalField,
          smsUsage: smsField,
          zeroSession: '0',
        })
      })
      
      this.total = response.data.total   
      setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000) 

      this.$nextTick(() => {
        this.list = arr
      })

      getCustomerList().then(response => {
        this.customersArr.length = 0
        this.customersArr.push({ code: '0', name: 'All' })
        response.data.forEach(element => {
          this.customersArr.push({ code: element._id, name: element.info.name })
        })
      })
    },

    sortChange(data) {
      /*const { prop, order } = data
      if (prop === 'code') {
        this.sortByID(order)
      }*/
    },
    /*sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+code'
      } else {
        this.listQuery.sort = '-code'
      }
      this.handleFilter()
    },*/
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    handleUpdate(row) {

    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleFilter() {
      console.log('submitted')
      this.listQuery.page = 1
      this.listQuery.customer = this.selectedCustomer
      this.getList()
    },
    showLocation(data){
      this.isLoading = true      
      this.locationList.length = 10

      this.locationList.push(
        {title: 'IMSI', value: data.imsi},
        {title: 'Network Operator', value: ''},
        {title: 'Area', value: ''},
        {title: 'Cell', value: ''},
        {title: 'Cell Range', value: ''},
        {title: 'Current Session Date', value: ''},
        {title: 'Current Usage', value: data.dataUsage}
      )

      //country by coords
      const query = {
        id: data.id
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
    async forceReconnect(){      
      this.isLoading = true
      const response = await forceReconnectAsync(this.simQuery)          
      this.isLoading = false
      this.$alert('Sim connection refreshed', 'M2M Data Message', {type: 'message'})
      this.mapFormVisible = false
    },
  }
}
</script>

<style>
/*map*/

  .map-container{
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
  .card-panel-right {
    text-align: right;
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
.blue-btn{
  border-color: #28a5e0;
  background-color: #28a5e0;
}
.blue-btn:hover,.blue-btn:active,.blue-btn:focus{
  border-color: #32aee8;
  background-color: #32aee8;
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
.el-table {
    font-size: 12px;
}
.el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #28a5e0;
}
.el-pagination.is-background .el-pager li:not(.disabled):hover {
    color: #28a5e0;
}
.cell a{
  color: #28a5e0;
}
.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #28a5e0;
    border-color: #28a5e0;
}
div.square {
  border-radius: 3px;
  margin: 0 14px;
  width: 10px;
  height: 10px;
}
.pagination-container{
  margin-top: 30px;
  border-radius: 5px;
}

.map-table-icon{
  width: 16px;
  cursor: pointer;
}


.el-aside{    
    overflow: hidden;
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