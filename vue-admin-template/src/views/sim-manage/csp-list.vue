<template>
  <div v-if="Permission['CSP_MANAGE']>0" class="app-container csp-page">
    <div class="filter-container">
      <div class="display-flex justify-content-between">
          <div class="buttons-row">
          </div>
          <div class="buttons-row white-space-nowrap">
          <!--<el-button v-if="Permission['CSP_ADD']>1" class="filter-item button-custom blue-btn" type="primary" @click="handleCreate">
          <item :icon="'create-white'"/> 
          </el-button>-->
          </div>
      </div>
      <!--<div class="buttons-row">
        <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
          New
        </el-button>
        <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
          Export
        </el-button>
       !-- <el-tooltip :content="showAdditionalInfo ? 'Hide Additional info' : 'Show Additional info'" placement="top">
          <el-switch
            v-model="showAdditionalInfo"
            active-text="Additional info"
            @change="tableKey=tableKey+1"
          />
        </el-tooltip>--

      </div>-->

      <!--<el-form ref="listQuery" :model="listQuery" label-position="top" class="form-padding" @submit.native.prevent="handleFilter">
        <input type="submit" class="display-none">
        <el-row :gutter="16">
          <el-col :xs="24" :sm="8" :md="6" :lg="5">
            <el-form-item label="" prop="title">
              <el-input v-model="listQuery.Name" placeholder="Name" class="filter-item" @keyup.enter.native="handleFilter" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8" :md="6" :lg="5">
            <el-form-item label="" prop="title">
              <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
                {{ $t('TEXT_COMMON_SEARCH') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>-->


    </div>
    <div class="table-wrapper">
      <el-table
        :key="tableKey"
        v-loading="isListLoading"
        :data="searchData"
        :default-sort = "{prop: 'Name', order: 'ascending'}"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        
        
        <el-table-column label="Name" prop="Name"  align="center" min-width="180px" sortable>
          <template slot-scope="{row}">
            <span>{{ row.Name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Code" prop="Code" min-width="180px" align="center" sortable>
          <template slot-scope="{row}">
            <span>{{row.Code }}</span>
          </template>
        </el-table-column><!--
        <el-table-column label="Number" width="160px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.Number }}</span>
          </template>
        </el-table-column>-->
        <el-table-column label="Actions" align="center" width="100" class-name="small-padding fixed-width" >
          <template slot-scope="{row,$index}">
            <el-button  v-if="Permission['CSP_EDIT']>1" type="primary" size="mini" class="blue-btn" @click="handleUpdate(row)">
              {{ $t('TEXT_COMMON_EDIT') }}
            </el-button>
          <!--<el-button  v-if="Permission['CSP_REMOVE']>1" size="mini" type="danger" @click="handleDelete(row,$index)">
              {{ $t('TEXT_COMMON_DELETE') }}
            </el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination class="full-size-pagination" v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="isDialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="top" label-width="70px" @submit.native.prevent="onEditFormSubmit">
        <input id="submitEditForm" type="submit" class="display-none" >
        <el-row :gutter="16">
          <el-col :xs="24" :sm="12">
            <el-form-item label="Name" prop="Name">
              <el-input v-model="temp.Name" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="Code" prop="Code">
              <el-input disabled v-model="temp.Code" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isDialogFormVisible = false">
          {{ $t('TEXT_COMMON_CANCEL') }}
        </el-button>
        <el-button :loading="isFormLoading" type="primary"  class="blue-btn" @click="onEditFormSubmit()">
          {{ $t('TEXT_COMMON_SAVE') }}
        </el-button>
      </div>
    </el-dialog>

  </div>
<div v-else class="no-data-info">    
  <div class="py-20">
    Permission denied
  </div>
</div> 
</template>

<script>


import { fetchOSPList, fetchOSPAdditionalInfo, createOSP, updateOSP, deleteOSP } from '@/api/osp'
import waves from '@/directive/waves' // waves directive
import { StatusList } from '@/utils/dictionaries'
import { sortArrayByObjProps, toLowerCaseObjectKeys } from '@/utils/helpers'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { Permission } from '@/utils/role-permissions'


import { fetchServiceProfileOptionsAjax, updateSSPAjax } from "@/api/user";

import Item from '@/layout/components/Sidebar/Item'
export default {
  name: 'CSP',
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
    return {
      Permission,
      tableKey: 0,
      list: null,
      total: 0,
      isListLoading: true,
      isFormLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,

        Name: '',
       // sort: '+code'
      },
      statusTypeOptions: StatusList,
      roleTypeOptions: [],
      subRoleTypeOptions: [],
      subOrganizeServiceProfileOptions: [],
      showAdditionalInfo: false,
      temp: {
        Code: undefined,
        Name: undefined,
        Number: null,
      },
      isDialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        Name: [{ required: true, message: 'Name is required', trigger: 'blur' }],
        Code: [{ required: true, message: 'Code is required', trigger: 'blur' }],
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.getOSPAdditionalInfo()

  },
  computed: {
    searchData(){
      return this.list.filter(data => !this.listQuery.Name || data.Name.toLowerCase().includes(this.listQuery.Name.toLowerCase()))
    }
  },
  methods: {
    async getList() {
      this.isListLoading = true

      fetchServiceProfileOptionsAjax().then(response => {        
        console.log('csp', response)
        
        this.isListLoading = false

        this.total = response.Data.length
        this.list = response.Data
      })
    },
    async getOSPAdditionalInfo(){
      let additionalInfo = await fetchOSPAdditionalInfo()
      if(!additionalInfo){
        return
      }
      if(additionalInfo.SubRoles && additionalInfo.SubRoles.length){
        additionalInfo.SubRoles = sortArrayByObjProps(additionalInfo.SubRoles, [{prop:'Name', direction: 1}])
        this.roleTypeOptions = [...additionalInfo.SubRoles]
        this.subRoleTypeOptions = [...additionalInfo.SubRoles]
      }
      if(additionalInfo.SubOrganizeServiceProfiles && additionalInfo.SubOrganizeServiceProfiles.length){
        additionalInfo.SubOrganizeServiceProfiles = sortArrayByObjProps(additionalInfo.SubOrganizeServiceProfiles, [{prop:'Name', direction: 1}])
        this.subOrganizeServiceProfileOptions = [...additionalInfo.SubOrganizeServiceProfiles]
      }
    },
    handleFilter() {
      /*this.listQuery.page = 1
      this.getList()*/
      //console.log(this.onSearchData(this.list, this.listQuery.Name))
    },
    resetTemp() {
      this.temp = {
        Name: undefined,
        Number: null,
        Code: undefined,
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
      /*this.SubRoleCodes = this.SubRoles
      this.SubOrganizeServiceProfileCodes = this.SubOrganizeServiceProfiles*/

      this.dialogStatus = 'update'
      this.isDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    async handleDelete(row) {
      let response = await deleteOSP(row)
      if(!response){
        return
      }
      this.getList()
      this.getOSPAdditionalInfo()
      this.$notify({
        title: 'Success',
        message: 'Deleted Successfully',
        type: 'success',
        duration: 2000
      })
    },
    /*onEditFormSubmit(){
      //this.dialogStatus === 'create' ? this.createData() : this.updateData()
      let tempData = Object.assign({}, this.temp)
      this.$refs['dataForm'].validate(async (valid) => {
        if (!valid){
          return false
        }
        this.isFormLoading = true;
        let response = this.dialogStatus === 'create' ? await createOSP(tempData) : await updateOSP(tempData)
        if(!response){
          return
        }
        this.isFormLoading = false;
        this.getOSPAdditionalInfo()
        this.getList()
        this.resetTemp()
        this.isDialogFormVisible = false
        this.$notify({
          title: 'Success',
          message: this.dialogStatus === 'create' ? 'Created Successfully' : 'Updated Successfully',
          type: 'success',
          duration: 2000
        })
      })
    },*/

    onEditFormSubmit(){
      let tempData = Object.assign({}, this.temp)
      this.$refs['dataForm'].validate(async (valid) => {
        if (!valid){
          return false
        }
        
        this.isFormLoading = true
        //let response = this.dialogStatus === 'create' ? await createCustomer(tempData) : await updateCustomer(tempData)
       
        
        if(this.dialogStatus === 'create'){ 
         /* createCustomerAjax(tempData).then(response => {            
            this.resetTemp()
            this.getList()
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          }) */
        }else{
          updateSSPAjax(tempData).then(response => {            
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

    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['Name', 'Role', 'Number', 'Status', 'description']
        const filterVal = ['Name', 'Role', 'Number', 'Status', 'description']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
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


    getStatusText(status){
      return this.$t(this.statusTypeOptions.find( itm => itm.Code === parseInt(status)).Translation)
    },
    getRoleName(code){
      let ret = this.$t('TEXT_COMMON_UNKNOWN');
      if (!code && !this.roleTypeOptions.length){
        return ret
      }
      let index = this.roleTypeOptions.findIndex(itm => itm.Code === code)
      if (index === -1){
        return ret
      }
      return this.roleTypeOptions[index].Name ? this.roleTypeOptions[index].Name : ret
    }
  }
}
</script>

<style>
  .csp-page .el-checkbox__input.is-checked+.el-checkbox__label {
    color: #32aee8;
}
</style>
