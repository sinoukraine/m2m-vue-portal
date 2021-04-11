<template>
<el-container v-if="Permission['CUSTOMER_MANAGE']>0&&Permission['USER_LIST']>0" class="with-panel-wrapper " :class="{'panel-opened': isRightPanelVisible}">
    <el-container class="page-fixed-height padding-vertical-x2">
        <el-main  class="no-padding">
            <div class="filter-container ">
                <div class="display-flex justify-content-between">
                    <div class="buttons-row">
                    </div>
                    <div class="buttons-row white-space-nowrap">
                    <el-button v-if="Permission['CUSTOMER_MANAGE']>1&&Permission['USER_LIST']>1&&Permission['USER_ADD']>1" class="filter-item button-custom blue-btn" type="primary" @click="handleCreate">
                    <item :icon="'create-white'"/> 
                    </el-button>
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
                :default-sort = "{prop: 'Account', order: 'ascending'}"
                border
                fit
                highlight-current-row
                style="width: 100%;"
                @sort-change="sortChange"
            >
                <!--<el-table-column :label="'№'" align="center" width="60px">
                <template >
                    <span></span>  
                </template>
                </el-table-column>-->
                <el-table-column label="Account" min-width="100px" align="center" sortable="custom" prop="Account">
                <template slot-scope="{row}">
                    <span>{{ row.Account }}</span>
                </template>
                </el-table-column>
                <el-table-column label="Organization" min-width="120px" align="center" sortable="custom" prop="OrganizeName">
                <template slot-scope="{row}">
                    <span>{{ row.OrganizeName }}</span>
                </template>
                </el-table-column>
                <el-table-column label="Role" min-width="100px" align="center" sortable="custom" prop="RoleName">
                <template slot-scope="{row}">
                    <span>{{ row.RoleName }}</span>
                </template>
                </el-table-column>

                <el-table-column label="First Name" min-width="120px" align="center" sortable="custom" prop="FirstName">
                <template slot-scope="{row}">
                    <span>{{ row.FirstName ? row.FirstName : $t('TEXT_COMMON_NA') }}</span>
                </template>
                </el-table-column>
                <el-table-column label="Last Name" min-width="120px" align="center" sortable="custom" prop="SubName">
                <template slot-scope="{row}">
                    <span>{{ row.SubName ? row.SubName : $t('TEXT_COMMON_NA') }}</span>
                </template>
                </el-table-column>
                <el-table-column label="Email" min-width="180px" align="center" sortable="custom" prop="Email">
                <template slot-scope="{row}">
                    <span>{{ row.Email }}</span>
                </template>
                </el-table-column>
                <el-table-column label="Mobile" min-width="120px" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.Mobile ? row.Mobile : $t('TEXT_COMMON_NA') }}</span>
                </template>
                </el-table-column>

                <el-table-column label="State" min-width="100px" align="center">
                <template slot-scope="{row}">
                    <el-tag :type="row.State | statusFilter">
                    {{ getStatusText(row.State) }}
                    </el-tag>
                </template>
                </el-table-column>

                <el-table-column label="Actions" align="center" width="200" class-name="small-padding fixed-width" fixed="right">
                <template slot-scope="{row,$index}">
                    <el-button v-if="Permission['CUSTOMER_MANAGE']>1&&Permission['USER_LIST']>1&&Permission['USER_EDIT']>1" type="primary" class="blue-btn" size="mini" @click="handleUpdate(row)">
                    {{ $t('TEXT_COMMON_EDIT') }}
                    </el-button>
                <!--v-if="row.Status!='deleted'"-->    <el-button v-if="Permission['CUSTOMER_MANAGE']>1&&Permission['USER_LIST']>1" size="mini" type="danger" @click="handleDelete(row,$index)">
                    {{ $t('TEXT_COMMON_DELETE') }}
                    </el-button><!--
                    <el-button type="primary" class="violet-btn" size="mini" @click="remoteAccess(row.Token)">
                    Remote 
                    </el-button>-->
                </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total>0" :total="total" :page.sync="listQuery.Page" :limit.sync="listQuery.Rows" @pagination="getList" />
            
            </div>


            <el-dialog :title="textMap[dialogStatus]" :visible.sync="isDialogFormVisible" >
            <el-form ref="dataForm" :rules="rules" :model="temp" label-position="top" label-width="70px" @submit.native.prevent="onEditFormSubmit">
                <input type="submit" class="display-none" >

                <el-row v-if="dialogStatus !== 'create'" :gutter="16" >
                <el-col :xs="24" :sm="24" class="text-right">
                    <!--<el-popconfirm
                    title="Are you sure to reset password?"
                    :confirm-button-text = " $t('TEXT_COMMON_YES') "
                    :cancel-button-text = " $t('TEXT_COMMON_CANCEL') "
                    @Confirm = "console.log('ddsf')"
                    >
                    <el-tooltip slot="reference" effect="dark" content="Default password(123456) will be set for user" placement="top-end">
                        <el-button type="warning" :loading="isResetLoading">
                        Reset Password
                        </el-button>
                    </el-tooltip>
                    </el-popconfirm>-->


                </el-col>
                </el-row>

                <el-row :gutter="16">
                <el-col :xs="24" :sm="12">
                    <el-form-item label="Account(Login name)" prop="Account">
                    <el-input v-model="temp.Account"  placeholder="Account"/>
                    </el-form-item>
                </el-col>
                <!--<el-col :xs="24" :sm="12">
                    <el-form-item label="Number" prop="Number">
                    <el-input v-model="temp.Number" />
                    </el-form-item>
                </el-col>-->
                <el-col :xs="24" :sm="12">
                   <el-form-item v-if="dialogStatus === 'update'" label="Organization" prop="OrganizeName">   
                      <el-input :value="temp.OrganizeName" disabled placeholder="Organization"/>
                    </el-form-item>
                      <el-form-item v-else :label="$t('ORGANIZE')" prop="OrganizeCode" class="w-100">
                        <input type="hidden" :value="temp.OrganizeCode" >
                        <el-select
                          ref="organizeSearchSelect"
                          v-model="searchedOrganizeName"
                          :remote-method="querySearchOrganizeCreate"
                          filterable
                          default-first-option
                          clearable
                          remote
                          placeholder="Organization"
                          class="organize-search-select w-100"
                          @change="changeOrganizeCreate"
                        >
                          <el-option v-for="item in organizeCreateArr" :key="item.Code" :value="item" :label="item.Name" />
                        </el-select>
                      </el-form-item>
                    <!--<el-form-item label="Organization" prop="OrganizeCode">                    
                    <el-select v-model="temp.Organize" class="filter-item w-100" placeholder="Please select" @change="onOrganizeCodeChange($event)">
                        <el-option v-for="item in organizeOptions" :key="item.Code" :label="item.Name" :value="item.Code" />
                    </el-select>
                    </el-form-item>-->
                </el-col>
                <el-col :xs="24" :sm="12">
                    <el-form-item label="User Role" prop="RoleCode">
                    <el-select v-model="temp.RoleCode" class="filter-item w-100" placeholder="Please select">
                        <el-option v-for="item in roleTypeOptions" :key="item.Code" :label="item.Name" :value="item.Code" />
                    </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                    <el-form-item label="First Name" prop="FirstName">
                    <el-input v-model="temp.FirstName"  placeholder="First Name"/>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                    <el-form-item label="Last Name" prop="SubName" >
                    <el-input v-model="temp.SubName"  placeholder="Sub Namee"/>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                    <el-form-item label="Email" prop="Email">
                    <el-input v-model="temp.Email"  placeholder="Email"/>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                    <el-form-item label="Mobile" prop="Mobile">
                    <el-input v-model="temp.Mobile"  placeholder="Mobile" />
                    </el-form-item>
                </el-col>

                <el-col v-if="dialogStatus !== 'create'" :xs="24" :sm="12">
                    <el-form-item label="Status" prop="Status">
                    <el-select v-model="temp.State" class="filter-item w-100" placeholder="Please select">
                        <el-option v-for="item in statusTypeOptions" :key="item.Code" :label="$t(item.Translation)" :value="item.Code" />
                    </el-select>
                    </el-form-item>
                </el-col>

                <!--<el-col :xs="24" :sm="12" >
                    <el-form-item label="Remark" prop="Remark">
                    <el-input v-model="temp.Remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Some notes" />
                    </el-form-item>
                </el-col>-->
                </el-row>

            </el-form>
            <div slot="footer" class="dialog-footer">                
                
                <el-tooltip v-if="dialogStatus !== 'create'" effect="dark" content="Default password(123456) will be set for user" placement="top-end">
                <el-button v-if="Permission['USER_RESET_PASSWORD']>1" type="warning" class="orange-btn" :loading="isResetLoading" @click="onResetPassword">
                    Reset Password
                </el-button>
                </el-tooltip>
                <el-button  :loading="isFormLoading" type="primary" class="blue-btn" @click="onEditFormSubmit()">
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
        <el-row v-if="Permission['USER_SRCH']>0" :gutter="16">
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
        

        <el-form ref="listQuery"  :model="listQuery" label-position="top" class="form-padding" @submit.native.prevent="handleFilter" >
          <input :id="filterSubmitId" type="submit" class="display-none">
          <div class="padding-horizontal-x2">
                
                <input type="submit" class="display-none">
                <el-row :gutter="16">
                <el-col :xs="100" class="px-0">
                    <el-form-item label="Account" prop="account" class="no-margin-bottom">
                    <el-input v-model="listQuery.Account" placeholder="Account(Login Name)" class="filter-item" />
                    </el-form-item>
                </el-col>

                <el-col :xs="100"  class="px-0">
                    <el-form-item label="E-mail" prop="Email" class="no-margin-bottom">
                    <el-input v-model="listQuery.Email" placeholder="Email" class="filter-item" />
                    </el-form-item>
                </el-col>
                <el-col :xs="100" class="px-0" >
                    <el-form-item label="First Name" prop="FirstName" class="no-margin-bottom">
                    <el-input v-model="listQuery.FirstName" placeholder="First Name" class="filter-item" />
                    </el-form-item>
                </el-col>
                <el-col :xs="100" class="px-0" >
                    <el-form-item label="Sub Name" prop="SubName">
                    <el-input v-model="listQuery.SubName" placeholder="Last Name" class="filter-item" />
                    </el-form-item>
                </el-col>
                </el-row>
          </div>
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

import waves from '@/directive/waves' // waves directive
import { mapGetters } from 'vuex'

import Pagination from '@/components/Pagination'
import { StatusList, LanguageList, TimeZoneList, DateTimeFormatList, CountyList } from "@/utils/dictionaries";
import { sortArrayByObjProps } from "@/utils/helpers";
import { fetchCustomersListAjax, fetchUsersListAjax, createUserAjax, updateUserAjax, deleteUserAjax, resetPasswordAjax } from "@/api/user";
import { fetchRoleListAjax } from "@/api/role-managment";
import { getToken } from '@/utils/auth' // get token from cookie
import Item from '@/layout/components/Sidebar/Item'
import { Permission } from '@/utils/role-permissions'


export default {
  name: 'Customers',
  components: { Pagination, Item },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'danger'
      }
      return statusMap[status]
    },
  },
  data() {
    //console.log(this.$store.getters.userInfo.OrganizeCode)
    return {
      Permission,
      searchedOrganizeName: '',
      searchedOrganizeCreate: null,
      isRightPanelVisible: true,
      filterSubmitId: Date.now(),
      tableKey: 0,
      list: null,
      total: 0,
      isListLoading: true,
      listQuery: {
        Page: 1,
        Rows: 20,
        Order: 'ASC',
        Sort: 'Account',
        Email: '',
        FirstName: '',
        SubName: '',
        Mobile: '',
        Account: '',
        IncludeSelf: true
      },
      //importanceOptions: ['Event'],
      //calendarTypeOptions,
      //sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      //statusOptions: ['published', 'draft', 'deleted'],
      //showReviewer: false,
      statusTypeOptions: StatusList,
      languageOptions: LanguageList,
      timeZoneOptions: TimeZoneList,
      dateTimeFormatOptions: DateTimeFormatList,
      countyOptions: CountyList,
      //subOrganizeServiceProfileOptions: [],
      roleTypeOptions: [],
      organizeOptions: [],
      temp: {
        //GroupCode: '',
        Organize: null,
        OrganizeCode: '',//this.$store.getters.userInfo.OrganizeCode,
        //id: undefined,
        //importance: 1,
        //Remark: '',
        //timestamp: new Date(),
        //title: '',
        //type: '',
        //status: 'published'
      },
      isDialogFormVisible: false,
      isFormLoading: false,
      isResetLoading: false,
      isSearchExpanded: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      //dialogPvVisible: false,
      //pvData: [],
      rules: {
        Account: [{ required: true, message: 'Account is required', trigger: 'blur' }],
        FirstName: [{ required: true, message: 'First Name is required', trigger: 'blur' }],
        SubName: [{ required: true, message: 'Last Name is required', trigger: 'blur' }],
        Email: [
          { required: true, message: 'Email is required', trigger: 'blur' },
          { type: 'email', message: 'Please input correct email address', trigger: ['blur'] }
        ],
        //Mobile: [{ type: 'number', message: 'Only digits please', trigger: 'blur' }],
        RoleCode: [{ required: true, message: 'Role is required', trigger: 'change' }],
        OrganizeCode: [{ required: true, message: 'Organize is required', trigger: 'change' }],

      },
      downloadLoading: false,
      organizeCreateArr: [],
    }
  },
  created() {
    //this.getOSPAdditionalInfo()
    this.getList()
    //this.getOrganisationsList()
    //this.getOrganisationRoles()

  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    
    querySearchOrganizeCreate(query) {
      if (query !== '') {        
        if(query.length > 1) {
          this.searchOrganizeCreate(query)
        }      
      } else {
        this.organizeCreateArr = []
      }
    },
    async searchOrganizeCreate(query) {
      const self = this
      const arr = []      
      this.organizeCreateArr = []
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
        self.$nextTick(() => {
          self.organizeCreateArr = arr
        })
      })
    },
    changeOrganizeCreate(val) {
      this.organizeCreateArr = []
      this.searchedOrganizeCreate = val
      this.searchedOrganizeName = val.Name
      this.temp.OrganizeCode = val.Code
      
      //this.temp.RoleCode = ''
      this.getOrganisationRoles()
    },


     async remoteAccess(token) {  
      
          //this.loading = true
          const loginForm = {
            token,
          }
          /*let response = await qtRemoteLogin(loginForm)
          console.log('rem',response)
          //this.loading = false
          if(!response){
            return
          }

          localStorage.Account = loginForm.Account;
          localStorage.Password = loginForm.Password;*/
          let response = {
            FirstName: 'Vlad',
              SubName: 'Bill',
              Language: 'en',
              Login: 'quiktrakukraine',
              Token: '5b41ecfc-f8a5-4421-b4a8-61eb21f04ef5'
          }
          this.$store.commit('user/SET_QT_USERINFO', response)
          this.$store.commit('user/SET_NAME', response.FirstName + ' ' + response.SubName)
          this.$store.commit('user/SET_LOGIN', response.Login)
          this.$store.commit('user/SET_AVATAR', 'avatar-user.png')
          this.$store.commit('user/SET_LANGUAGE', response.Language)
          
          this.$router.push({ path: '/' })
    },
    async getList() {
      this.isListLoading = true

      fetchUsersListAjax(this.listQuery).then(response => {
        this.isListLoading = false
        this.total = response.total
        this.list = response.rows
      })
    },
    async getOrganisationRoles(){
      const token = getToken()
      console.log('set roles?')
      fetchCustomersListAjax({Code:this.temp.OrganizeCode}).then(response => {
        let maxRole = response.rows[0].ServiceProfileCode
        fetchRoleListAjax({token}).then(response_1 => {  
          let filteredOptions = response_1.filter(el=>el.Code>=maxRole)      
          this.roleTypeOptions = sortArrayByObjProps(filteredOptions, [{prop:'Name', direction: 1}])
        })
      })      
    },
    /*async getOrganisationsList(){
      let query = {
        Page: 1,
        Rows: 1000,
      }
      let response = await fetchCustomersList()
      
      if(!response){
        return
      }
      let list = response.rows
      this.organizeOptions = [{
        Name: this.userInfo.OrganizeName,
        Code: this.userInfo.OrganizeCode
      }].concat(list)
      console.log('custlist', list)
    },*/
    handleFilter() {
      this.listQuery.Page = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      this.listQuery.Order = order === 'ascending' ? 'ASC' : (order === 'descending') ? 'DESC' : ''
      //this.listQuery.Order = order === 'ascending' ? 'ASC' : 'DESC'
      this.listQuery.Sort = prop
      this.getList()
      /*if (prop === 'id') {
        this.sortByID(order)
      }*/
    },
    /*sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },*/
    resetTemp() {
      this.roleTypeOptions = []
      this.searchedOrganizeCreate = null
      this.temp = {
        //GroupCode: '',
        OrganizeCode: '',//this.userInfo.OrganizeCode,
        Organize: null,//this.organizeOptions.find(el=>el.Code = this.userInfo.OrganizeCode)
        //id: undefined,
        //importance: 1,
        //Remark: '',
        //timestamp: new Date(),
        //title: '',
        //type: '',
        //status: 'published'
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.Organize = this.organizeOptions.find(el=>el.Code = this.temp.OrganizeCode)
     // this.temp.timestamp = new Date(this.temp.timestamp)

     this.getOrganisationRoles()

      this.dialogStatus = 'update'
      this.isDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    async handleDelete(row, index) {
      deleteUserAjax({ Code: row.Code }).then(response => {        
        this.$notify({
          title: 'Success',
          message: 'Deleted Successfully',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      })
      
    },
    onEditFormSubmit(){
        let tempData = Object.assign({}, this.temp)
        this.$refs['dataForm'].validate(async (valid) => {
        if (!valid){
          return false
        }
        this.searchedOrganizeName = ''
        
        console.log(tempData)
        this.isFormLoading = true;
        //let response = this.dialogStatus === 'create' ? await createUser(tempData) : await updateUser(tempData)

        if(this.dialogStatus === 'create'){ 
          createUserAjax(tempData).then(response => {            
            this.resetTemp()
            this.getList()
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          }) 
        }else{
          updateUserAjax(tempData).then(response => {            
            this.resetTemp()
            this.getList()
            this.$notify({
              title: 'Success',
              message: 'Updated Successfully',
              type: 'success',
              duration: 2000
            })          
          })
        }
        
        this.isFormLoading = false
        this.isDialogFormVisible = false  
      })
    },
    /*onOrganizeCodeChange(value){
      this.getOrganisationRoles(value)
      //console.log(event)
    },*/
    async onResetPassword(){
      this.isResetLoading = true;
      resetPasswordAjax({ Code: this.temp.Code }).then(response => {
        this.isResetLoading = false
        this.$notify({
          title: 'Success',
          message: 'Password Resetted Successfully',
          type: 'success',
          duration: 2000
        })
      })
      
    },
   /* handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['key', 'type', 'zn', 'en', 'fr', 'pt', 'description']
        const filterVal = ['key', 'type', 'zn', 'en', 'fr', 'pt', 'description']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },*/
    /*formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },*/
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    getStatusText(status){
      return this.$t(this.statusTypeOptions.find( itm => itm.Code === parseInt(status)).Translation)
    },
  }
}
</script>


<style>
/*map

  .map-container{
    overflow: hidden;
    width: 100%;
    height: 439px;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
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
  
.el-dialog__body{
    padding: 20px;
}
.el-dialog__header{
    padding: 20px;
    border-bottom: 1px solid #e3e3e3;
}
.el-dialog__body{    
    border-bottom: 1px solid #e3e3e3;
}
.el-dialog__footer{    
    padding: 20px;
}
.el-button{
    overflow: inherit !important;
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
    padding: 7px 0;
    font-size: 12px;
  }
 
  .leaflet-control-zoom, .leaflet-control-attribution{
    display: none;
  }
  .card-panel-right {
    text-align: right;
  }
 
.dark-btn{
  border-color: #304257;
  background-color: #304257;
}
.dark-btn:hover,.dark-btn:active,.dark-btn:focus{
  border-color: #35475c;
  background-color: #35475c;
}

  .violet-btn{
    border-color: rgb(182, 162, 222);
    background-color: rgb(182, 162, 222);
  }
  .violet-btn:hover,.violet-btn:active,.violet-btn:focus{
    border-color: rgb(196, 180, 228);
    background-color: rgb(196, 180, 228);
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
    margin-bottom: 10px;
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
.el-table td, .el-table th {
    padding: 12px 0;
}
.el-table {
    width: 100%;
    border-radius: 5px;
    -webkit-box-shadow: 0px 0px 4.9px 0.1px rgba(151, 164, 193, 0.2);
    box-shadow: 0px 0px 4.9px 0.1px rgba(151, 164, 193, 0.2);
}
.el-aside{    
    overflow-x: hidden;
}
.px-0{
    padding-left: 0 !important;
    padding-right: 0 !important;
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
  .orange-btn{
    border-color: #ffb880;
    background-color: #ffb880;
  }
  .orange-btn:hover,.orange-btn:active,.orange-btn:focus{
    border-color: #ffc496;
    background-color: #ffc496;
  }*/
</style>
