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
                   <!-- <el-button v-waves :loading="downloadLoading" class="button-custom blue-btn" type="primary" @click="getList"><item :icon="'save-white'"/></el-button>
                  --></div>
                 </div>
                 <div class="buttons-row">
                </div>
            </div>
                
            <div class="table-wrapper">
            <el-table
                :key="tableKey"
                v-loading="isListLoading"
                :data="displayData"
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
                <el-table-column v-if="listQueryGroupBy=='IMSI'" :label="$t('IMSI')"  sortable :class-name="getSortClass('IMSI')" prop="IMSI" align="left" width="130px">
                  <template slot-scope="{row}">
                    <router-link class="link" :to="{ path: `/sim-list/${row.IMSI}` }">
                      {{ row.IMSI }}
                    </router-link>
                  </template>
                </el-table-column>
                <el-table-column v-if="listQueryGroupBy=='IMSI'" sortable :label="$t('ICCID')"  :class-name="getSortClass('ICCID')" prop="ICCID" align="left" width="160px">
                  <template slot-scope="{row}">
                    <span>{{ row.ICCID }}</span>
                  </template>
                </el-table-column>
                <el-table-column v-if="listQueryGroupBy=='ORG'||listQueryGroupBy=='IMSI'" sortable :class-name="getSortClass('OrganizeName')" prop="OrganizeName" :label="$t('CUSTOMER')" align="left" min-width="100px">
                  <template slot-scope="{row}">
                    <span>{{ row.OrganizeName }}</span>
                  </template>
                </el-table-column>
                <el-table-column v-if="listQueryGroupBy=='SERVICE_PROFILE'" sortable :class-name="getSortClass('OrganizeName')" prop="OrganizeName" :label="'Service Profile'" align="left" min-width="100px">
                  <template slot-scope="{row}">
                    <span>{{ row.ServiceProfile }}</span>
                  </template>
                </el-table-column>
                <el-table-column  v-if="(listQueryType=='ALL'||listQueryType=='DATA')&&(listQueryGroupBy=='IMSI'||listQueryGroupBy=='SERVICE_PROFILE'||listQueryGroupBy=='ORG')" sortable :class-name="getSortClass('SessionDay')" prop="SessionDay" :label="'Session'" align="left" min-width="70px">
                  <template slot-scope="{row}">
                    <span>{{ row.dataSession }}</span>
                  </template>
                </el-table-column>
                <el-table-column  v-if="(listQueryType=='ALL'||listQueryType=='DATA')&&(listQueryGroupBy=='IMSI'||listQueryGroupBy=='SERVICE_PROFILE'||listQueryGroupBy=='ORG')" :label="'Data'" sortable :class-name="getSortClass('DataDay')" prop="DataDay" align="left" min-width="70px">
                  <template slot-scope="{row}">
                    <span>{{ row.DataUsage }}</span>
                  </template>
                </el-table-column>
                <el-table-column  v-if="(listQueryType=='ALL'||listQueryType=='SMS')&&listQueryGroupBy=='IMSI'" :label="'SMS MO'" sortable  :class-name="getSortClass('SMSMO')" prop="SMSMO" align="left" min-width="70px">
                  <template slot-scope="{row}">
                    <span>{{ row.smsMoUsage }}</span>
                  </template>
                </el-table-column>
                <el-table-column  v-if="(listQueryType=='ALL'||listQueryType=='SMS')&&listQueryGroupBy=='IMSI'" :label="'SMS MT'" sortable  :class-name="getSortClass('SMSMT')" prop="SMSMT" align="left" min-width="70px">
                  <template slot-scope="{row}">
                    <span>{{ row.smsMtUsage }}</span>
                  </template>
                </el-table-column>
                <el-table-column :label="'Update'" sortable :class-name="getSortClass('DataUpdateTime')" prop="DataUpdateTime" align="left" min-width="90px">
                  <template slot-scope="{row}">
                    <span>{{ row.update }}</span>
                  </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total>0" 
              :total="total" 
              :page.sync="page"           
              :page-size="limit"
            />
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

                <el-col v-if="listQuery.Date=='BETWEEN'||listQuery.Date=='THIS_MONTH'||listQuery.Date=='LAST_MONTH'" :xs="100" :sm="100" :md="100" :lg="100" class="px-0">
                    <el-form-item label="Start date" prop="title" class="mb-0">
                        <el-date-picker v-model="listQuery.startDate" value-format="yyyy-MM-dd" type="date" placeholder="Pick a date" style="width: 100%;" />
                    </el-form-item>                  
                    <el-form-item label="End date" prop="title" class="mb-0">
                        <el-date-picker v-model="listQuery.endDate" value-format="yyyy-MM-dd" type="date" placeholder="Pick a date" style="width: 100%;" />
                    </el-form-item>
                </el-col>
                <el-col v-if="listQuery.Date=='DATE'" :xs="100" :sm="100" :md="100" :lg="100" class="px-0">
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

                <el-col v-if="listQuery.SearchBy=='CUSTOMER'" :xs="100" class="px-0">
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
                <el-col  v-if="listQuery.SearchBy=='SERVICE_PROFILE'" :xs="100" class="px-0">
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
import { getUsageReportAjax, fetchSIMListAjax, fetchCustomersListAjax, setActivateStateAjax, setSuspendStateAjax, setResumeStateAjax, setTerminateStateAjax, setServiceProfileOptionsAjax, fetchServiceProfileOptionsAjax, createSIMAjax, updateSIMAjax, moveSIMsAjax } from "@/api/user";
import Item from '@/layout/components/Sidebar/Item'
import { getSIMListAsync, getSIM, getSIMAsync, getCustomerList, getSIMCoordinates, getSIMCountry, forceReconnectAsync } from '@/api/sim'
import moment from 'moment'
import { Permission } from '@/utils/role-permissions'

const today = new Date()
const current = moment() 

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
      isFiltered: true,
      Permission,
      isLoading: false,
      fullPage: true,      
      organizeOptions: [],
      isRightPanelVisible: true,
      filterSubmitId: Date.now(),
      tableKey: 0,
      page: 1,
      list: null,
      total: 0,
      limit: 10,
      isListLoading: true,
      typeOptions: [{Name: 'ALL', Code: 'ALL'}, {Name: 'DATA', Code: 'DATA'}, {Name: 'SMS', Code: 'SMS'}],
      groupByOptions: [{Name: 'IMSI', Code: 'IMSI'}, {Name: 'SERVICE_PROFILE', Code: 'SERVICE_PROFILE'}, {Name: 'ORG', Code: 'ORG'}],
      groupByPeriodOptions: [{Name: 'DAY', Code: 'DAY'}, {Name: 'MONTH', Code: 'MONTH'}, {Name: 'YEAR', Code: 'YEAR'}],
      dateOptions: [ {Name: 'DATE', Code: 'DATE'}, {Name: 'TODAY', Code: 'TODAY'}, {Name: 'YESTERDAY', Code: 'YESTERDAY'}, {Name: 'BETWEEN', Code: 'BETWEEN'}],//, {Name: 'THIS_MONTH', Code: 'THIS_MONTH'}, {Name: 'LAST_MONTH', Code: 'LAST_MONTH'}, {Name: 'THIS_YEAR', Code: 'THIS_YEAR'}, {Name: 'LAST_YEAR', Code: 'LAST_YEAR'}
      searchByOptions: [{Name: 'ALL', Code: 'ALL'}, {Name: 'CUSTOMER', Code: 'CUSTOMER'}, {Name: 'SERVICE_PROFILE', Code: 'SERVICE_PROFILE'}],
      serviceProfileOptions: [
          {Name: 'M2M Data', Code: 'M2M Data'},
          {Name: 'M2M Data Emergency CSP Z1- 9', Code: 'M2M Data Emergency CSP Z1- 9'},
          {Name: 'M2M Data Normal CSP Z1 &2', Code: 'M2M Data Normal CSP Z1 &2'},
          {Name: 'M2M Data High CSP Z1-3', Code: 'M2M Data High CSP Z1-3'},
          {Name: 'M2M Data Custom Network Profile Australia', Code: 'M2M Data Custom Network Profile Australia'},
      ],
      listQueryGroupBy: 'IMSI',
      listQueryType: 'DATA',
      listQuery: {
        //Page: 1,
        //Rows: 10,
        //Order: 'DESC',
        //Sort: 'DataDay',
        Type: 'DATA',
        GroupBy: 'IMSI',
        GroupByPeriod: 'DAY',
        Date: 'TODAY',
        startDate: moment(today, 'YYYY-MM-DD').add(-7, 'days').format('YYYY-MM-DD'),
        endDate: moment(today, 'YYYY-MM-DD').format('YYYY-MM-DD'),
        selectedDate: moment(today, 'YYYY-MM-DD').format('YYYY-MM-DD'),
        SearchBy: 'ALL',
        ServiceProfile: '',
        searchedOrganize: ''
      },
      isDialogFormVisible: false,
      isFormLoading: false,
      downloadLoading: false,
      organizeArr: [],
      searchedFilterOrganizeName: '',
      searchedOrganizeName: '',
      month_names_short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      
    }
  },
  created() {
    this.getList()
  },
  computed: {
    displayData() {
        if (!this.list || this.list.length === 0) return []
        return this.list.slice(this.limit * this.page - this.limit, this.limit * this.page)
    },
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
    changeFilterOrganize(val) {
      this.organizeArr = []
      this.searchedOrganizeName = val.Name
      console.log('so',val)
      this.listQuery.searchedOrganize = val.Code
    },
    async getList() {
      let self = this
      this.list = []
      this.isListLoading = true      
        
      const query = {
          Type: this.listQuery.Type,
          GroupBy: this.listQuery.GroupBy,
          GroupByTime: this.listQuery.GroupByPeriod,
          DataRange: this.listQuery.Date,
          SearchType: this.listQuery.SearchBy,
        }
console.log('s', this.listQuery.SearchBy, this.listQuery?.ServiceProfile)
        if(this.listQuery.SearchBy == 'SERVICE_PROFILE' && this.listQuery?.ServiceProfile?.length){
          query.SearchValue = this.listQuery.ServiceProfile
        }else if(this.listQuery.SearchBy == 'CUSTOMER' && this.listQuery?.searchedOrganize?.length){
          query.SearchValue = this.listQuery.searchedOrganize
        }else{
          query.SearchType = 'ALL'
        }

        if(this.listQuery.Date == 'TODAY'){
          query.Date = moment(today, 'YYYY-MM-DD').format('YYYY-MM-DD')
        }else if(this.listQuery.Date == 'DATE'){
          query.Date = this.listQuery.selectedDate
        }else if(this.listQuery.Date == 'BETWEEN'){
          query.From = this.listQuery.startDate
          query.To = this.listQuery.endDate
        }else if(this.listQuery.Date == 'YESTERDAY'){          
          query.Date = moment(today, 'YYYY-MM-DD').add(-1, 'days').format('YYYY-MM-DD')
        }/*else if(this.listQuery.Date == 'THIS_MONTH'){                    
          query.From = current.clone().startOf('month').format('YYYY-MM-DD') 
          query.To = moment(today, 'YYYY-MM-DD').format('YYYY-MM-DD')
        }else if(this.listQuery.Date == 'LAST_MONTH'){          
          query.From = moment(today, 'YYYY-MM-DD').add(-30, 'days').format('YYYY-MM-DD')
          query.To = moment(today, 'YYYY-MM-DD').format('YYYY-MM-DD')
        }*/

        console.log(query, this.listQuery)

        getUsageReportAjax(query).then(response => { 
          let rows = response.Data.Rows
          let columns = response.Data.Columns
          const arrTable = []

          let paramUsage = columns.indexOf('Usage')
          let paramIMSI = columns.indexOf('IMSI')
          let paramICCID = columns.indexOf('ICCID')
          let paramUpdate = columns.indexOf('Day')!=-1?columns.indexOf('Day'):columns.indexOf('Month')!=-1?columns.indexOf('Month'):columns.indexOf('Year')
          let paramOrg = columns.indexOf('Organize')
          let paramSession = columns.indexOf('Session')
          let paramSMSMo = columns.indexOf('SMSMO')
          let paramSMSMt = columns.indexOf('SMSMT')
          let paramServiceProfile = columns.indexOf('ServiceProfile')

          rows.forEach((element, index) => {
            arrTable.push({
              IMSI: element[paramIMSI],
              ICCID: element[paramICCID],
              update: element[paramUpdate],
              OrganizeName: element[paramOrg],
              ServiceProfile: element[paramServiceProfile],                    
              dataSession: element[paramSession],         
              smsMoUsage: element[paramSMSMo],    
              smsMtUsage: element[paramSMSMt],    
              DataUsage: element[paramUsage], 
            })     
          })       
          this.total = response.Data.Rows.length
          setTimeout(() => {
            this.isListLoading = false
          }, 1.5 * 1000)

          this.list = arrTable          
        }).catch(e=>{
          console.log(e)
        })
    },
    async getServiceProfileOptions(){      
      fetchServiceProfileOptionsAjax().then(response => {        
        this.serviceProfileOptions = response.Data
        this.selectedServiceProfile = this.serviceProfileOptions[0].Code
      })
    },    
    handleFilter() {
      this.listQuery.Page = 1
      this.listQueryGroupBy = this.listQuery.GroupBy
      this.listQueryType = this.listQuery.Type
      
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
