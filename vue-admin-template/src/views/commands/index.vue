<template>
    <el-container class="page-fixed-height padding-vertical-x2">
        <el-main  class="no-padding">
            <div class="filter-container ">
                <div class="display-flex justify-content-between">
                    <div class="buttons-row">
                    </div>
                    <div class="buttons-row white-space-nowrap">
                    <el-button class="filter-item button-custom blue-btn" type="primary">
                    <item :icon="'create-white'"/> 
                    </el-button>
                    </div>
                </div>
                <div class="buttons-row">
                    
                </div>
                </div>
            <div class="table-wrapper">
            <el-collapse v-model="activeCommandGroups"
               v-loading="listLoading"
               class="collapse-list"
               :class="listLoading?'bordered':''">
              <el-collapse-item           
                v-for="group in commandGroupList" 
                :key="group.ProductName"
                :title="group.ProductName + ' (' + group.CommandList.length + ')'" 
                :name="group.ProductName"
                class="collapse-item">
                <div>
                  <ul 
                       class="list">
                    <li v-for="command in group.CommandList" :key="command.Code" >
                      <div class="item-content" >
                        <div class="item-inner">
                          <div class="item-title">
                            {{command.Name}}
                          </div>
                          
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </el-collapse-item>            
            </el-collapse>  
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
                    <el-input v-model="temp.Account" />
                    </el-form-item>
                </el-col>
                <!--<el-col :xs="24" :sm="12">
                    <el-form-item label="Number" prop="Number">
                    <el-input v-model="temp.Number" />
                    </el-form-item>
                </el-col>-->
                <el-col :xs="24" :sm="12">
                    <el-form-item label="Organization" prop="OrganizeCode">
                    <el-select v-model="temp.OrganizeCode" class="filter-item w-100" placeholder="Please select" @change="onOrganizeCodeChange($event)">
                        <el-option v-for="item in organizeOptions" :key="item.Code" :label="item.Name" :value="item.Code" />
                    </el-select>
                    </el-form-item>
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
                    <el-input v-model="temp.FirstName" />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                    <el-form-item label="Last Name" prop="SubName">
                    <el-input v-model="temp.SubName" />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                    <el-form-item label="Email" prop="Email">
                    <el-input v-model="temp.Email" />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                    <el-form-item label="Mobile" prop="Mobile">
                    <el-input v-model="temp.Mobile" />
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
                <el-button type="warning" class="orange-btn" :loading="isResetLoading" @click="onResetPassword">
                    Reset Password
                </el-button>
                </el-tooltip>
                <el-button :loading="isFormLoading" type="primary" class="blue-btn" @click="onEditFormSubmit()">
                {{ $t('TEXT_COMMON_SAVE') }}
                </el-button>
            </div>
            </el-dialog>
        </el-main>
    </el-container>
</template>

<script>
String.prototype.format = function (e) { var t = this; if($.isArray(e)) {for (var i = 0; i < e.length; i++) if (e[i] != undefined) { var r = new RegExp("({)" + i + "(})", "g"); t = t.replace(r, e[i]) } return t }else if (arguments.length == 1 && typeof e == "object") { for (var n in e) if (e[n] != undefined) { var r = new RegExp("({" + n + "})", "g"); t = t.replace(r, e[n]) } } else for (var i = 0; i < arguments.length; i++) if (arguments[i] != undefined) { var r = new RegExp("({)" + i + "(})", "g"); t = t.replace(r, arguments[i]) } return t };


import waves from '@/directive/waves' // waves directive
import { mapGetters } from 'vuex'

import Pagination from '@/components/Pagination'
import { StatusList, LanguageList, TimeZoneList, DateTimeFormatList, CountyList } from "@/utils/dictionaries";
import { sortArrayByObjProps } from "@/utils/helpers";
import { createUser, updateUser, deleteUser, resetPassword } from "@/api/user";
import { getCommandsListAsync, getCommandParamsAsync } from "@/api/sim";
import { fetchRoleList } from "@/api/role-managment";
import Item from '@/layout/components/Sidebar/Item'


export default {
  name: 'Commands',
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
         
      listLoading: true,
        isRightPanelVisible: true,
      filterSubmitId: Date.now(),
      
      activeCommandGroups: [],      
      commandGroupList: [],

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
        OrganizeCode: this.$store.getters.userInfo.OrganizeCode,
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
      downloadLoading: false

    }
  },
  created() {
    //this.getOSPAdditionalInfo()
    this.getList()
    this.getOrganisationsList()
    this.getOrganisationRoles()

  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    async getList() {
      const response = await getCommandsListAsync()
      console.log('8',response)
      if(response.length)
      {	
        this.commandGroupList = response        
        this.$nextTick(()=>{
          this.listLoading = false
        })
      }
    },
    async chooseCommand(val){
			let smsFormat = val.Format
      let arr = eval(val.Params)
      let params = []							
      let count=arr.length
      if(count){        
        for(var i=0; i<arr.length; i++) {		
          let curPar = await confirm(arr[i].Name, arr[i].Prams).transition()//self.$app.dialog.prompt(arr[i].Name, function (name) {
          params.push(curPar)
          this.newMessage = smsFormat.format(params)
        }
      }else{
        this.newMessage = val.Format
      }
      
    },
    async getOrganisationRoles(token){
      if(!token) token = this.$store.getters.userInfo.Token
      let response = await fetchRoleList({token})
      if(!response){
        return
      }
      this.roleTypeOptions = sortArrayByObjProps(response, [{prop:'Name', direction: 1}])

      //console.log(response)
    },
    async getOrganisationsList(){
      this.organizeOptions = [{
        Name: this.userInfo.OrganizeName,
        Code: this.userInfo.OrganizeCode
      }]
    },
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
      this.temp = {
        //GroupCode: '',
        OrganizeCode: this.userInfo.OrganizeCode,
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
     // this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.isDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    async handleDelete(row, index) {
      let response = await deleteUser({ Code: row.Code })
      if(!response){
        return
      }
      this.$notify({
        title: 'Success',
        message: 'Deleted Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    onEditFormSubmit(){
      //this.dialogStatus === 'create' ? this.createData() : this.updateData()
      let tempData = Object.assign({}, this.temp)
      this.$refs['dataForm'].validate(async (valid) => {
        if (!valid){
          return false
        }
        //console.log(tempData)
        //return;
        this.isFormLoading = true;
        let response = this.dialogStatus === 'create' ? await createUser(tempData) : await updateUser(tempData)
        this.isFormLoading = false;
        if(!response){
          return
        }

        this.resetTemp()
        this.getList()
        this.isDialogFormVisible = false
        this.$notify({
          title: 'Success',
          message: this.dialogStatus === 'create' ? 'Created Successfully' : 'Updated Successfully',
          type: 'success',
          duration: 2000
        })
      })
    },
    onOrganizeCodeChange(value){
      this.getOrganisationRoles(value)
      //console.log(event)
    },
    async onResetPassword(){
      this.isResetLoading = true;
      let response = await resetPassword({ Code: this.temp.Code })
      this.isResetLoading = false;
      if(!response){
        return
      }
      this.$notify({
        title: 'Success',
        message: 'Password Resetted Successfully',
        type: 'success',
        duration: 2000
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
  .el-table td, .el-table th {
    padding: 7px 0 !important;
}
  .el-table td{
    padding: 7px 0;
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
.el-table td, .el-table th {
    padding: 12px 0;
}
.el-table {
    width: 100%;
    border-radius: 5px;
    -webkit-box-shadow: 0px 0px 4.9px 0.1px rgba(151, 164, 193, 0.2);
    box-shadow: 0px 0px 4.9px 0.1px rgba(151, 164, 193, 0.2);
}
.el-asside{    
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
  }


.bordered{
  border: none;
}
  
  .scrollbar-loading .collapse-list{
    padding: 25px 0;
  }
  .scrollbar-loading{
    padding-top: calc(50vh - 110px);
  }
  .scrollbar-loading .el-collapse{
    border: none;
  }
  .scrollbar-loading .el-scrollbar__wrap{
    overflow: hidden;
    margin: 0 !important;
  }
  .collapse-item .el-collapse-item__header{
    font-size: 12px;
    padding: 0 12px 0 20px;
    font-weight: 600;
    color: rgb(96, 98, 104);
  }
  .right-column-header{
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    color: rgb(96, 98, 104);
  }
  .right-column-header:hover{
    background-color: rgb(238, 241, 246);
  }
  .collapse-item .item-content{
    font-size: 12px;
    border-top: 1px solid #e3e3e3;
    color: rgb(96, 98, 104);
  }
  .el-collapse-item__content{
    padding-bottom: 0;
  }
  .el-collapse-item__content .list .item-content{
    cursor: pointer;
  }

.list {
  list-style-type: none;
  padding: 0;
}
.list .item-title{
  padding: 10px 20px;
}
</style>

<style scoped lang="scss">



</style>