<template>
  <el-container class="with-panel-wrapper " :class="{'panel-opened': isRightPanelVisible}">
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
              <el-button v-waves class="button-custom blue-btn" type="primary" @click="handleCreate"><item :icon="'create-white'"/></el-button>
              <el-button v-waves class="button-custom blue-btn" type="primary" @click="handleDownload"><item :icon="'save-white'"/></el-button>
            </div>
          </div>
          <div class="buttons-row">
            <el-checkbox v-model="checkboxAgents">{{ $t('AGENTS') }}</el-checkbox>
            <el-checkbox v-model="checkboxContacts">{{ $t('CONTACTS') }}</el-checkbox>
            <el-checkbox v-model="checkboxDescription">{{ $t('DESCRIPTION') }}</el-checkbox>
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
          >
            <el-table-column :label="'№'" align="center" width="60px">
              <template slot-scope="{row}">
                <span>{{ row.number }}</span>  
              </template>
            </el-table-column>
            <el-table-column :label="$t('CUSTOMER')"  align="left" min-width="140px">
              <template slot-scope="{row}">
                <span>{{ row.customer }}</span>
              </template>
            </el-table-column><!--index==1?$t('AGENT'):$t('SUBAGENT')-->
            <el-table-column v-for="(a, index) in agentItems" :key="a.code" :label="$t('AGENT')+ ' ' +(index+1)" align="left" min-width="160px">
              <template slot-scope="{row}">
                <span>{{ row.agent.length>(index)?row.agent[index].info.name:'' }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="checkboxContacts" :label="$t('ACCOUNT')"  align="left" min-width="160px">
              <template>
                <span>m2madmin</span>
              </template>
            </el-table-column>
            <el-table-column v-if="checkboxContacts" :label="$t('EMAIL')"  align="left" min-width="140px">
              <template slot-scope="{row}">
                <span>{{ row.email }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="checkboxContacts" :label="$t('COUNTRY')"  align="left" min-width="120px">
              <template slot-scope="{row}">                
                <span>{{ row.country }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="checkboxDescription" :label="$t('REMARK')"  align="left" min-width="120px">
              <template slot-scope="{row}">                
                <span>{{ row.remark }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('AUTHORITY')" align="left" min-width="180px">
              <template >
                <span></span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('STATE')"  align="left" min-width="80px">
              <template slot-scope="{row}">                
                <el-tag :type="row.state | statusFilter">
                {{ getStatusText(row.state) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column :label="$t('ACTIONS')" fixed="right" align="center" width="160" class-name="small-padding fixed-width">
              <template slot-scope="{row}">
                <el-button type="primary blue-btn" size="mini" @click="handleUpdate(row)">
                  Edit
                </el-button>
                <el-button  size="mini" type="danger" @click="handleDelete(row,$index)">
                  Delete
                </el-button>
              </template>
            </el-table-column>
          </el-table> 
          
          <!--<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />
          -->

          <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form ref="dataForm" :rules="rules" :model="temp" label-position="top" label-width="70px" @submit.native.prevent="onEditFormSubmit">
                <input id="submitEditForm" type="submit" class="display-none" >
                <el-row :gutter="16">
                <el-col :xs="24" :sm="12">
                    <el-form-item label="Name" prop="name">
                    <el-input v-model="temp.name" />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                    <el-form-item label="Master" prop="master">
                    <el-select v-model="temp.master" class="filter-item w-100" placeholder="Please select">
                        <el-option v-for="item in masterOptions" :key="item.code" :label="item.name" :value="item.code" />
                    </el-select>
                    </el-form-item>
                </el-col>
                </el-row>
                <el-row :gutter="16">
                <el-col :xs="24" :sm="12">
                    <el-form-item label="E-mail" prop="email">
                    <el-input v-model="temp.email" />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                    <el-form-item label="Country" prop="country">
                    <el-input v-model="temp.country" />
                    </el-form-item>
                </el-col>
                </el-row>
                <el-row :gutter="16">
                <el-col :xs="24" :sm="12">
                    <el-form-item label="Remark" prop="remark">
                    <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
                    </el-form-item>
                </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <!--<el-button @click="dialogFormVisible = false">
                {{ $t('TEXT_COMMON_CANCEL') }}
                </el-button>-->
                <label v-waves for="submitEditForm" class="el-button el-button--primary  blue-btn ">
                <span>{{ $t('TEXT_COMMON_SAVE') }}</span>
                </label>
                <!--<button v-waves type="submit" class="el-button el-button&#45;&#45;primary ">{{ $t('SAVE') }}</button>-->
                <!--<el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
                Confirm
                </el-button>-->
            </div>
            </el-dialog>
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
          <div class="padding-horizontal-x2" >
            <el-row :gutter="16" style="">
              <el-col :xs="100">
                <!--<el-form-item :label="$t('CUSTOMER')" prop="title" class="no-margin-bottom">
                  <el-input v-model="listQuery.sample" placeholder="" class="filter-item" />
                </el-form-item>-->
                <el-form-item :label="$t('SCOPE')" prop="title" class="">
                  <el-select v-model="selectedScope" :placeholder="$t('SCOPE')">
                    <el-option v-for="item in scopeArr" :key="item.code" :label="item.name" :value="item.code" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
      </div>
    </el-aside>
  </el-container>
</template>

<script>
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Item from '@/layout/components/Sidebar/Item'
import { createCustomerAsync, getCustomerListAsync, updateCustomerAsync } from '@/api/sim'
import moment from 'moment'

export default {
  components: {
    Pagination,
    Item,
    Loading,
  },
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
      isLoading: false,
      fullPage: true,
      agentItems: [],
      checkboxAgents: false,
      checkboxContacts: true,
      checkboxDescription: true,
      isRightPanelVisible: true,
      rules: {
        name: [{ required: true, message: 'Name is required', trigger: 'input' }],
        master: [{ required: true, message: 'Master field is required', trigger: 'change' }],
      },
      filterSubmitId: Date.now(),
      masterOptions: [
        { code: '5f7f74ada71a973d558205b3', name: 'M2MData' },
      ],
      scopeArr: [
        { code: 'base', name: 'Only my customers' },
        { code: 'one', name: 'Only my sub\'s customers' },
        { code: 'sub', name: 'All customers' }
      ],
      selectedScope: 'sub',
      tableKey: 0,
      total: 0,
      listLoading: true,
      locationList: [],
      maxAgentItems: 0,
      list: [],
      listQuery: {
        sample: undefined,
        scope: 'sub',
      },
      multipleSelection: [],
      temp: {
        code: undefined,
        name: '',
        master: '5f7f74ada71a973d558205b3',
        email: '',
        country: '',
        remark: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Customer Profile',
        create: 'Create Customer'
      },
    }
  },
  created() {
    this.getList()
  },
  watch: {
    checkboxAgents: function(val) {
    this.agentItems = []
      if(val==true) {
        for(let i = 0; i < this.maxAgentItems; i++){
            this.agentItems.push({code: i})
        }
      }
    },
  },
  methods: {
    resetTemp() {
      this.temp = {
        code: undefined,
        name: '',
        master: '5f7f74ada71a973d558205b3',
        email: '',
        country: '',
        remark: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      const tempData = Object.assign({}, this.temp)
      this.$refs['dataForm'].validate(async (valid) => {
        if (!valid){
          return false
        }

        delete tempData.code

        let obj = { 
            'info' : {
                'address': {},
                'contacts': [],
                'pictures': [],
            },
            'instances': [],
            'settings' : {
                'locale': "en_US.UTF-8",
                'origins': [],
                'timezone': "UTC"
            },
            'ancestors' : [],
            'tags' : []					
        }
        
        obj.info.name = tempData.name
        obj.info.description = tempData.remark
        obj.info.address.country = tempData.country
        obj.info.contacts.push({'email': tempData.email })
        obj.ancestors.push({'info': {'name': this.masterOptions.find(el=>el.code==tempData.master).name}, '_id': tempData.master})

        /*
        let response = await createCustomerAsync(obj)
        if(!response){
          return
        }
        
        this.temp.Code = response.Data.Code
        this.list.unshift(this.temp)*/
        this.dialogFormVisible = false
        this.$notify({
          title: 'Success',
          message: 'Customer created successfully',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleUpdate(row) {
      const tempObj = Object.assign({}, row) // copy obj
      console.log('iddd', row)
      this.temp = {
          code: tempObj.id,
          ancestors: tempObj.agent,
          name: tempObj.customer,
          master: tempObj.master,
          email:tempObj.email,
          country: tempObj.country,
          remark: tempObj.remark
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate( async (valid) => {
        if (!valid){
          return false
        }
        const tempData = Object.assign({}, this.temp)
        console.log(tempData)
        let obj = { 
            'info' : {
                'address': {},
                'contacts': [],
                'pictures': [],
            },
            'instances': [],
            'settings' : {
                'locale': "en_US.UTF-8",
                'origins': [],
                'timezone': "UTC"
            },
            'tags' : []					
        }
        
        obj.info.name = tempData.name
        obj.info.description = tempData.remark
        obj.info.address.country = tempData.country
        obj.info.contacts.push({'email': tempData.email })
        obj.ancestors = tempData.ancestors
        obj._id = tempData.code

        /*console.log(tempData.code, obj)
        let response = await updateCustomerAsync(tempData.code, obj)
        if(!response){
          return
        }*/
        /*const index = this.list.findIndex(v => v.code === this.temp.code)
        this.list.splice(index, 1, this.temp)*/

        this.dialogFormVisible = false
        this.$notify({
          title: 'Success',
          message: 'Customer updated successfully',
          type: 'success',
          duration: 2000
        })
      })
    },
    async handleDelete(row, index) {
      /*let response = await deleteCustomerAsync(row)
      if(!response){
        return
      }*/
      this.list.splice(index, 1)
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['№', 'Customer', 'Master', 'Email', 'Country', 'Remark', 'State']
        const filterVal = ['number', 'customer', 'master', 'email', 'country', 'remark', 'state']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'customer-list'
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
    async getList() {
      const arr = []
      this.masterOptions = [
        { code: '5f7f74ada71a973d558205b3', name: 'M2MData' },
      ]
      const response = await getCustomerListAsync(this.listQuery)
      console.log(response)
      this.maxAgentItems = 0
      response.data.forEach(async (element, index) => {    
        this.masterOptions.push({ code: element._id, name: element.info.name })        
        let obj = {
          number: (index+1),
          id: element._id,
          customer: element.info.name,
          agent: element.ancestors,
          master: element.ancestors[element.ancestors.length-1].info.name,
          remark: element.info.description,
          country: element.info.address?.country,
          email: element.info.address?.country,
          contacts: element.info.contacts?.email,
          state: 1,
        }
        arr.push(obj)  
        this.maxAgentItems = this.maxAgentItems < obj.agent.length?obj.agent.length:this.maxAgentItems        
      })    
      
      /*for(let i = 0; i < this.maxAgentItems; i++){
        this.agentItems.push({code: i})
      }*/

      this.total = response.data.length   
      setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000) 

      this.$nextTick(() => {
        this.list = arr
      })
    },
    sortChange(data) {

    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleFilter() {
      this.listQuery.scope = this.selectedScope
      this.getList()
    },
    getStatusText(status){
      return 'On'//this.$t(this.statusTypeOptions.find( itm => itm.Code === parseInt(status)).Translation)
    },
    onEditFormSubmit(){
      this.dialogStatus === 'create' ? this.createData() : this.updateData()
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