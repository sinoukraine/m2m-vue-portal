<template>
<el-container v-if="Permission['REPORTS']>0" class="with-panel-wrapper subscription-report-page" :class="{'panel-opened': isRightPanelVisible}">
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
                      <el-button v-if="Permission['REPORTS']>1" class="filter-item button-custom blue-btn" type="primary" @click="handleCreate">
                        <item :icon="'create-white'"/> 
                      </el-button>
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
                <el-table-column :label="$t('Name')"  sortable :class-name="getSortClass('IMSI')" prop="IMSI" align="left" width="180px">
                  <template slot-scope="{row}">
                    <router-link class="link" to="#">
                      <item :icon="'csp-blue'" class="mr-10"/> {{ row.Name }}
                    </router-link>
                  </template>
                </el-table-column>
                <el-table-column sortable :label="$t('Interval type')"  :class-name="getSortClass('ICCID')" prop="ICCID" align="left" width="160px">
                  <template slot-scope="{row}">
                    <span>{{ row.IntervalType }}</span>
                  </template>
                </el-table-column>
                <el-table-column sortable :label="$t('Query type')"  :class-name="getSortClass('ICCID')" prop="ICCID" align="left" min-width="160px">
                  <template slot-scope="{row}">
                    <span>{{ row.QueryType }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="Actions" align="center" width="100" class-name="small-padding fixed-width" fixed="right">
                <template slot-scope="{row,$index}">                    
                    <el-button v-if="Permission['REPORTS']>1" size="mini" type="danger" @click="handleDelete(row,$index)">
                    {{ $t('TEXT_COMMON_DELETE') }}
                    </el-button>
                </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total>0" :total="total" :page.sync="listQuery.Page" :limit.sync="listQuery.Rows" @pagination="getList" />
            
            </div>

            
            <el-dialog :title="textMap[dialogStatus]" :visible.sync="isDialogFormVisible" >
            <el-form ref="dataForm" :rules="rules" :model="temp" label-position="top"  label-width="70px" @submit.native.prevent="onEditFormSubmit">
                <input type="submit" class="display-none" >

                <el-row :gutter="16">
                  <el-col :xs="24" :sm="12">
                  <el-form-item label="Name" prop="Name">
                    <el-input v-model="temp.Name" placeholder="Name" />
                  </el-form-item>
                </el-col> 
                  
                <el-col :xs="24" :sm="12">
                  <el-form-item label="Type" prop="type">
                    <el-select v-model="temp.type" class="filter-item w-100" placeholder="Please select">
                        <el-option v-for="item in typeOptions" :key="item.Code" :label="item.Name" :value="item.Code" />
                    </el-select>
                  </el-form-item>
                </el-col>       
                <el-col :xs="24" :sm="12">
                  <el-form-item label="Group By" prop="groupBy">
                    <el-select v-model="temp.groupBy" class="filter-item w-100" placeholder="Please select">
                        <el-option v-for="item in groupByOptions" :key="item.Code" :label="item.Name" :value="item.Code" />
                    </el-select>
                  </el-form-item>
                </el-col>      
                
                <el-col :xs="24" :sm="12">
                  <el-form-item label="Interval" prop="interval">
                    <el-select v-model="temp.interval" class="filter-item w-100" placeholder="Please select">
                        <el-option v-for="item in intervalTypeOptions" :key="item.Code" :label="item.Name" :value="item.Code" />
                    </el-select>
                  </el-form-item>
                </el-col>    

                <el-col v-if="temp.groupBy=='IMSI/ICCID'" :xs="24" :sm="12">            
                    <el-form-item :label="'From IMSI'" prop="FromIMSI">
                      <el-input v-model="temp.FromIMSI"  :placeholder="'From IMSI'"/>
                    </el-form-item>
                </el-col>
                <el-col v-if="temp.groupBy=='IMSI/ICCID'" :xs="24" :sm="12">            
                    <el-form-item :label="'To IMSI'" prop="ToIMSI">
                      <el-input v-model="temp.ToIMSI"  :placeholder="'To IMSI'"/>
                    </el-form-item>
                </el-col>
                <el-col v-if="temp.groupBy=='IMSI/ICCID'" :xs="24" :sm="12">            
                    <el-form-item :label="'From ICCID'" prop="FromICCID">
                      <el-input v-model="temp.FromICCID"  :placeholder="'From ICCID'"/>
                    </el-form-item>
                </el-col>
                <el-col v-if="temp.groupBy=='IMSI/ICCID'" :xs="24" :sm="12">            
                    <el-form-item :label="'To ICCID'" prop="ToICCID">
                      <el-input v-model="temp.ToICCID"  :placeholder="'To ICCID'"/>
                    </el-form-item>
                </el-col>

                <el-col v-if="temp.groupBy=='Customer'"  :xs="24" :sm="12">
                  <el-form-item :label="$t('CUSTOMER')" prop="Organize" class="">
                    <el-select
                      ref="organizeSearchSelect"
                      v-model="searchedOrganizeName"
                      :remote-method="querySearchOrganize"
                      filterable
                      default-first-option
                      clearable
                      remote
                      placeholder="Organize Name"
                      class="organize-search-select"
                      @change="changeOrganize"
                    >
                      <el-option v-for="item in organizeArr" :key="item.Code" :value="item" :label="item.Name" />
                    </el-select>
                  </el-form-item>
              </el-col>
              
              <el-col v-if="temp.groupBy=='Service Profile'"  :xs="24" :sm="12">
                <el-form-item label="Service Profile" prop="ServiceProfile">
                    <el-select v-model="temp.ServiceProfile">
                        <el-option v-for="item in serviceProfileOptions" :key="item.Code" :label="item.Name" :value="item.Code" />
                    </el-select>
                   </el-form-item>
              </el-col>
  
                
                <el-col :xs="24" :sm="12">
                  <el-form-item label="Notification" prop="Notification">
                    <el-input type="email" v-model="temp.Notification" placeholder="Enter e-mail address" />
                  </el-form-item>
                </el-col> 
                </el-row>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button :loading="isFormLoading" type="primary" class="blue-btn" @click="onEditFormSubmit()">
                {{ $t('TEXT_COMMON_SAVE') }}
                </el-button>
            </div>
            </el-dialog>
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
                   <el-form-item label="Name" prop="Name">
                      <el-input v-model="listQuery.Name" placeholder="Name" /> 
                   </el-form-item>
                </el-col>

                <el-col :xs="100" class="px-0">
                   <el-form-item label="Type" prop="Type">
                    <el-select v-model="listQuery.type">
                        <el-option v-for="item in typeOptions" :key="item.Code" :label="item.Name" :value="item.Code" />
                    </el-select>
                   </el-form-item>
                </el-col>
                
                <el-col :xs="100" class="px-0">
                   <el-form-item label="Interval Type" prop="IntervalType">
                    <el-select v-model="listQuery.IntervalType">
                        <el-option v-for="item in intervalTypeOptions" :key="item.Code" :label="item.Name" :value="item.Code" />
                    </el-select>
                   </el-form-item>
                </el-col>
                
                <!--<el-col :xs="100" class="px-0">
                   <el-form-item label="Group By" prop="GroupBy">
                    <el-select v-model="listQuery.groupBy">
                        <el-option v-for="item in groupByOptions" :key="item.Code" :label="item.Name" :value="item.Code" />
                    </el-select>
                   </el-form-item>
                </el-col>-->

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
      serviceProfileOptions: [
          {Name: 'M2M Data', Code: 'M2M Data'},
          {Name: 'M2M Data Emergency CSP Z1- 9', Code: 'M2M Data Emergency CSP Z1- 9'},
          {Name: 'M2M Data Normal CSP Z1 &2', Code: 'M2M Data Normal CSP Z1 &2'},
          {Name: 'M2M Data High CSP Z1-3', Code: 'M2M Data High CSP Z1-3'},
          {Name: 'M2M Data Custom Network Profile Australia', Code: 'M2M Data Custom Network Profile Australia'},
      ],
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      temp: {
        Name: '',
        Notification: '',
        type: 'All',
        groupBy: 'IMSI/ICCID',
        interval: 'daily'
      },
      rules: {
        Name: [{ required: true, message: 'Name is required', trigger: 'blur' }],
        type: [{ required: true, message: 'Type is required', trigger: 'change' }],
        groupBy: [{ required: true, message: 'Group By field is required', trigger: 'change' }],
        interval: [{ required: true, message: 'Interval field is required', trigger: 'change' }],
      },
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
      intervalTypeOptions: [{Name: 'daily', Code: 'daily'},{Name: 'monthly', Code: 'monthly'},{Name: 'yearly', Code: 'yearly'}],
      typeOptions: [{Name: 'All', Code: 'All'},{Name: 'Data', Code: 'Data'},{Name: 'SMS', Code: 'SMS'}],
      groupByOptions: [{Name: 'IMSI/ICCID', Code: 'IMSI/ICCID'}, {Name: 'Service Profile', Code: 'Service Profile'}, {Name: 'Customer', Code: 'Customer'}],
      listQuery: {
        Page: 1,
        Rows: 10,
        Order: 'DESC',
        type: 'All',
        groupBy: 'IMSI/ICCID',
        IntervalType: 'daily',
        Name: ''
      },
      isDialogFormVisible: false,
      isFormLoading: false,
      downloadLoading: false,
      organizeArr: [],
      searchedFilterOrganizeName: '',
      searchedOrganizeName:''
    }
  },
  created() {
    this.getList()
  },
  computed: {
    //...mapGetters(['userInfo'])
  },
  methods: {      
     resetTemp() {
      this.temp = {
        Name: '',
        Notification: ''
      }
    },   
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.isDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
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
      this.temp.searchedOrganize = val
    },
    async getList() {
        let self = this
        this.isListLoading = true      
        
        const arr = [{
            Name: 'Test usage report',
            type: 'Data',
            groupBy: 'IMSI/ICCID',
            IntervalType: 'daily',
            QueryType: '',
            
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
    onEditFormSubmit(){
      let tempData = Object.assign({}, this.temp)
      this.$refs['dataForm'].validate(async (valid) => {
        if (!valid){
          return false
        }
        
        this.searchedParentName = ''
        this.isFormLoading = true
        this.resetTemp()
        this.getList()
        this.$notify({
          title: 'Success',
          message: 'Created Successfully',
          type: 'success',
          duration: 2000
        })
        this.isFormLoading = false
        this.isDialogFormVisible = false  
      })
    },
    async handleDelete(row, index) {
        this.$notify({
          title: 'Success',
          message: 'Deleted Successfully',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)      
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
.subscription-report-page div.square {
  border-radius: 3px;
  margin: 0 14px;
  width: 10px;
  height: 10px;
}

.subscription-report-page .el-checkbox__label{
  font-size: 12px;
}

</style>
