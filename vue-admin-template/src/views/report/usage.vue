<template>
<el-container v-if="Permission['REPORTS']>0" class="with-panel-wrapper usage-report-page" :class="{'panel-opened': isRightPanelVisible}">
  <loading :active.sync="isLoading" 
      :can-cancel="true" 
      :is-full-page="fullPage">
  </loading>
  
    <el-container class="page-fixed-height padding-vertical-x2">
        <el-main  class="no-padding">
            <div class="filter-container ">
                <div class="display-flex justify-content-between">                    
                  <div class="buttons-row">
                    </div>
                  <div class="buttons-row white-space-nowrap">
                    <el-button v-waves class="button-custom blue-btn" type="primary" @click="getList"><item :icon="'update-white'"/></el-button>
                    <el-button v-waves :loading="downloadLoading" class="button-custom blue-btn" type="primary" @click="getList"><item :icon="'save-white'"/></el-button>
                  </div>
                 </div>
                 <div class="buttons-row">
                </div>
            </div>
                
            <div class="table-wrapper">
            <el-table
                :key="tableKey"
                v-loading="isListLoading"
                :data="list"
                :default-sort = "{prop: 'IMSI', order: 'ascending'}"
                border
                fit
                highlight-current-row
                style="width: 100%;"
                @sort-change="sortChange" 
            >            
              <el-table-column :label="$t('№')" align="center" width="60px">
                <template slot-scope="{row,$index}">
                  {{$index+1}}         
                </template>
              </el-table-column>
                <el-table-column :label="$t('IMSI')"  sortable :class-name="getSortClass('IMSI')" prop="IMSI" align="left" width="130px">
                  <template slot-scope="{row}">
                    <router-link class="link" :to="{ path: `/sim-list/${row.IMSI}` }">
                      {{ row.IMSI }}
                    </router-link>
                  </template>
                </el-table-column>
                <el-table-column v-if="listQuery.Type=='All'&&listQuery.GroupBy=='IMSI/ICCID'" sortable :label="$t('ICCID')"  :class-name="getSortClass('ICCID')" prop="ICCID" align="left" width="160px">
                  <template slot-scope="{row}">
                    <span>{{ row.ICCID }}</span>
                  </template>
                </el-table-column>
                <el-table-column  sortable :class-name="getSortClass('OrganizeName')" prop="OrganizeName" :label="$t('CUSTOMER')" align="left" min-width="100px">
                  <template slot-scope="{row}">
                    <span>{{ row.OrganizeName }}</span>
                  </template>
                </el-table-column>
                <el-table-column  v-if="(listQuery.Type=='All'||listQuery.Type=='Data')&&listQuery.GroupBy=='IMSI/ICCID'" sortable :class-name="getSortClass('SessionDay')" prop="SessionDay" :label="'Session'" align="left" min-width="70px">
                  <template slot-scope="{row}">
                    <span>{{ row.dataSession }}</span>
                  </template>
                </el-table-column>
                <el-table-column  v-if="(listQuery.Type=='All'||listQuery.Type=='Data')&&listQuery.GroupBy=='IMSI/ICCID'" :label="'Data'" sortable :class-name="getSortClass('DataDay')" prop="DataDay" align="left" min-width="70px">
                  <template slot-scope="{row}">
                    <span>{{ row.DataUsage }}</span>
                  </template>
                </el-table-column>
                <el-table-column  v-if="(listQuery.Type=='All'||listQuery.Type=='SMS')&&listQuery.GroupBy=='IMSI/ICCID'" :label="'SMS MO'" sortable  :class-name="getSortClass('SMSMO')" prop="SMSMO" align="left" min-width="70px">
                  <template slot-scope="{row}">
                    <span>{{ row.smsMoUsage }}</span>
                  </template>
                </el-table-column>
                <el-table-column  v-if="(listQuery.Type=='All'||listQuery.Type=='SMS')&&listQuery.GroupBy=='IMSI/ICCID'" :label="'SMS MT'" sortable  :class-name="getSortClass('SMSMT')" prop="SMSMT" align="left" min-width="70px">
                  <template slot-scope="{row}">
                    <span>{{ row.smsMtUsage }}</span>
                  </template>
                </el-table-column>
                <el-table-column v-if="listQuery.Type=='All'&&listQuery.GroupBy=='IMSI/ICCID'" :label="'Month'" sortable :class-name="getSortClass('DataUpdateTime')" prop="DataUpdateTime" align="left" min-width="90px">
                  <template slot-scope="{row}">
                    <span>{{ row.update }}</span>
                  </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total>0" :total="total" :page.sync="listQuery.Page" :limit.sync="listQuery.Rows" @pagination="getList" />
            
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
        <el-form ref="listQuery" :model="listQuery" label-position="top" class="" @submit.native.prevent="handleFilter" >
          <input :id="filterSubmitId" type="submit" class="display-none">
          <div class="padding-horizontal-x2  pb-10">                
              <input type="submit" class="display-none">
              <el-row :gutter="16" class="p-7">
                <el-col :xs="100" class="px-0">
                   <el-form-item label="Type" prop="Type">
                    <el-select v-model="listQuery.Type">
                        <el-option v-for="item in typeOptions" :key="item.Code" :label="item.Name" :value="item.Code" />
                    </el-select>
                   </el-form-item>
                </el-col>

                <el-col :xs="100" class="px-0">
                   <el-form-item label="Group by" prop="GroupBy">
                    <el-select v-model="listQuery.GroupBy">
                        <el-option v-for="item in groupByOptions" :key="item.Code" :label="item.Name" :value="item.Code" />
                    </el-select>
                    <el-select v-model="listQuery.GroupByPeriod" class="mt-20">
                        <el-option v-for="item in groupByPeriodOptions" :key="item.Code" :label="item.Name" :value="item.Code" />
                    </el-select>
                   </el-form-item>
                </el-col>

                <el-col :xs="100" class="px-0">
                   <el-form-item label="Date range" prop="DateRange">
                    <el-select v-model="listQuery.Date">
                        <el-option v-for="item in dateOptions" :key="item.Code" :label="item.Name" :value="item.Code" />
                    </el-select>
                   </el-form-item>
                </el-col>

                <el-col v-if="listQuery.Date=='between'" :xs="100" :sm="100" :md="100" :lg="100" class="px-0">
                    <el-form-item label="Start date" prop="title" class="mb-0">
                        <el-date-picker v-model="listQuery.startDate" value-format="yyyy-MM-dd" type="date" placeholder="Pick a date" style="width: 100%;" />
                    </el-form-item>                  
                    <el-form-item label="End date" prop="title" class="mb-0">
                        <el-date-picker v-model="listQuery.endDate" value-format="yyyy-MM-dd" type="date" placeholder="Pick a date" style="width: 100%;" />
                    </el-form-item>
                </el-col>
                <el-col v-if="listQuery.Date=='date'" :xs="100" :sm="100" :md="100" :lg="100" class="px-0">
                    <el-form-item label="Date" prop="title" class="mb-0">
                        <el-date-picker v-model="listQuery.selectedDate" value-format="yyyy-MM-dd" type="date" placeholder="Pick a date" style="width: 100%;" />
                    </el-form-item>   
                </el-col>

                <el-col :xs="100" class="px-0">
                   <el-form-item label="Search by" prop="SearchBy">
                    <el-select v-model="listQuery.SearchBy">
                        <el-option v-for="item in searchByOptions" :key="item.Code" :label="item.Name" :value="item.Code" />
                    </el-select>
                   </el-form-item>
                </el-col>

                <el-col v-if="listQuery.SearchBy=='Customer'" :xs="100" class="px-0">
                   <el-form-item label="Customer" prop="OrganizeCode">
                    <el-select
                      ref="organizeSearchSelect2"
                      v-model="searchedFilterOrganizeName"
                      :remote-method="querySearchOrganize"
                      filterable
                      default-first-option
                      clearable
                      remote
                      placeholder="Organize Name"
                      class="organize-search-select"
                      @change="changeFilterOrganize"
                    >
                      <el-option v-for="item in organizeArr" :key="item.Code" :value="item" :label="item.Name" />
                    </el-select>
                    </el-form-item>
                </el-col>
                <el-col v-else :xs="100" class="px-0">
                    <el-form-item label="Service Profile" prop="ServiceProfile">
                    <el-select v-model="listQuery.ServiceProfile">
                        <el-option v-for="item in serviceProfileOptions" :key="item.Code" :label="item.Name" :value="item.Code" />
                    </el-select>
                   </el-form-item>
                </el-col>

                </el-row>
            </div>
            
            <!--<div class="content-divider"></div>
            <div class="padding-horizontal-x2 pt-10">
              <el-row :gutter="16" >
                <el-col :xs="100">
                  
                </el-col>
              </el-row>
            </div>-->
                        
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

import { parseTime } from '@/utils'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'

import waves from '@/directive/waves' // waves directive
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import { SIMStatusList, LanguageList, TimeZoneList, DateTimeFormatList, CountyList, DistanceUnitList, EconomyUnitList, VolumeUnitList, TemperatureUnitList, PressureUnitList } from "@/utils/dictionaries";
import { fetchSIMListAjax, fetchCustomersListAjax, setActivateStateAjax, setSuspendStateAjax, setResumeStateAjax, setTerminateStateAjax, setServiceProfileOptionsAjax, fetchServiceProfileOptionsAjax, createSIMAjax, updateSIMAjax, moveSIMsAjax } from "@/api/user";
import Item from '@/layout/components/Sidebar/Item'
import { getSIMListAsync, getSIM, getSIMAsync, getCustomerList, getSIMCoordinates, getSIMCountry, forceReconnectAsync } from '@/api/sim'
import moment from 'moment'
import { Permission } from '@/utils/role-permissions'

const today = new Date()

export default {
  name: 'Customers',
  
  components: { 
    Pagination, 
    Item,
    Loading, 
  }, 
  directives: { waves },
    
  data() {
    return {     
      Permission,
      isLoading: false,
      fullPage: true,      
      organizeOptions: [],
      isRightPanelVisible: true,
      filterSubmitId: Date.now(),
      tableKey: 0,
      list: null,
      total: 0,
      isListLoading: true,
      typeOptions: [{Name: 'All', Code: 'All'}, {Name: 'Data', Code: 'Data'}, {Name: 'SMS', Code: 'SMS'}],
      groupByOptions: [{Name: 'IMSI/ICCID', Code: 'IMSI/ICCID'}, {Name: 'Service Profile', Code: 'Service Profile'}, {Name: 'Customer', Code: 'Customer'}],
      groupByPeriodOptions: [{Name: 'Day', Code: 'Day'}, {Name: 'Month', Code: 'Month'}, {Name: 'Year', Code: 'Year'}],
      dateOptions: [{Name: 'between', Code: 'between'}, {Name: 'date', Code: 'date'}, {Name: 'today', Code: 'today'}, {Name: 'yesterday', Code: 'yesterday'}, {Name: 'this month', Code: 'this month'}, {Name: 'last month', Code: 'last month'}, {Name: 'this year', Code: 'this year'}, {Name: 'last year', Code: 'last year'}],
      searchByOptions: [{Name: 'Customer', Code: 'Customer'}, {Name: 'Service Profile', Code: 'Service Profile'}],
      serviceProfileOptions: [
          {Name: 'M2M Data', Code: 'M2M Data'},
          {Name: 'M2M Data Emergency CSP Z1- 9', Code: 'M2M Data Emergency CSP Z1- 9'},
          {Name: 'M2M Data Normal CSP Z1 &2', Code: 'M2M Data Normal CSP Z1 &2'},
          {Name: 'M2M Data High CSP Z1-3', Code: 'M2M Data High CSP Z1-3'},
          {Name: 'M2M Data Custom Network Profile Australia', Code: 'M2M Data Custom Network Profile Australia'},
      ],
      listQuery: {
        Page: 1,
        Rows: 10,
        Order: 'DESC',
        Sort: 'DataDay',
        Type: 'Data',
        GroupBy: 'IMSI/ICCID',
        GroupByPeriod: 'Day',
        Date: 'today',
        startDate: moment(today, 'YYYY-MM-DD').add(-90, 'days').format('YYYY-MM-DD'),
        endDate: moment(today, 'YYYY-MM-DD').format('YYYY-MM-DD'),
        selectedDate: moment(today, 'YYYY-MM-DD').format('YYYY-MM-DD'),
        SearchBy: 'Customer',
        ServiceProfile: 'M2M Data'
      },
      isDialogFormVisible: false,
      isFormLoading: false,
      downloadLoading: false,
      organizeArr: [],
      searchedFilterOrganizeName: '',
      searchedOrganizeName: ''
    }
  },
  created() {
    this.getList()
  },
  computed: {
    //...mapGetters(['userInfo'])
  },
  methods: {         
    changeFilterOrganize(val) {
      this.organizeArr = []
      this.searchedFilterOrganizeName = val.Name
      this.listQuery.OrganizeCode = val.Code     
    },    
    querySearchOrganize(query) {
      if (query !== '') {        
        if(query.length > 1) {
          this.searchOrganize(query)
        }      
      } else {
        this.organizeArr = []
      }
    },
    async searchOrganize(query) {
      const arr = []      
      this.organizeArr = []
      let listQuery = {
        q: query,
        IncludeSelf: true
      }
      fetchCustomersListAjax(listQuery).then(response => {   
        response.rows.forEach(element => {
          arr.push({
            Code: element.Code,
            Name: element.Name
          })
        })
        this.organizeArr = arr
      })
    },
    changeOrganize(val) {
      this.organizeArr = []
      this.searchedOrganizeName = val.Name
      this.tempMove.searchedOrganize = val
    },
    async getList() {
        let self = this
        this.isListLoading = true      
        
        const arr = [{
            IMSI: '234500010301469',
            ICCID: '8944501008183014693',
            update: '2021-04',
            OrganizeName: 'Boatfix',          
            dataSession: '5',         
            smsMoUsage: '0',    
            smsMtUsage: '5',    
            DataUsage: '1.042', 
        }]     
                  
        self.isListLoading = false
        self.total = 20
        self.list = arr
    },
    async getServiceProfileOptions(){      
      fetchServiceProfileOptionsAjax().then(response => {        
        this.serviceProfileOptions = response.Data
        this.selectedServiceProfile = this.serviceProfileOptions[0].Code
      })
    },    
    handleFilter() {
      this.listQuery.Page = 1

      this.getList()
    },
    sortChange(data) {console.log(data)
      const { prop, order } = data
      this.listQuery.Order = this.listQuery.Order === 'ASC' ? 'DESC' : this.listQuery.Order === 'DESC' ? 'ASC' : 'ASC' //order === 'ascending' ? 'ASC' : (order === 'descending') ? 'DESC' : 'ASC'
      this.listQuery.Sort = prop
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['IMSI', 'ICCID', 'MSISDN', 'Service Profile', 'State', 'Customer', 'Session', 'Usage', 'SMS Usage', 'Update time', 'IPAddress','Pay Plan']
        const filterVal = ['IMSI', 'ICCID', 'MSISDN', 'ServiceProfile', 'State', 'OrganizeName', 'dataSession', 'DataUsage', 'smsUsage', 'update', 'IPAddress','PayPlan']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'sim-list'
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
      const order = this.listQuery.Order
      return order === `+${key}` ? 'ascending' : 'descending'
    },
  }
}
</script>


<style>
.usage-report-page div.square {
  border-radius: 3px;
  margin: 0 14px;
  width: 10px;
  height: 10px;
}

.usage-report-page .el-checkbox__label{
  font-size: 12px;
}

</style>
