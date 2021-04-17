<template>
<el-container class="with-panel-wrapper " :class="{'panel-opened': isRightPanelVisible}">
    <el-container class="page-fixed-height padding-vertical-x2">
        <el-main  class="no-padding">
            <div class="filter-container ">
                <div class="display-flex justify-content-between">
                    <div class="buttons-row">
                    </div>
                    <div class="buttons-row white-space-nowrap">
                    <el-button class="filter-item button-custom blue-btn" type="primary" @click="handleCreate">
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
                :default-sort = "{prop: 'Name', order: 'ascending'}"
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
                <el-table-column label="Name" min-width="160px" align="center" sortable="custom" prop="Name">
                <template slot-scope="{row}">
                    <span>{{ row.Name }}</span>
                </template>
                </el-table-column>
                <el-table-column label="Content" min-width="120px" align="center" sortable="custom" prop="Content">
                <template slot-scope="{row}">
                    <span>{{ row.Content }}</span>
                </template>
                </el-table-column>
                <el-table-column label="Organize Code" min-width="140px" align="center" sortable="custom" prop="OrganizeCode">
                <template slot-scope="{row}">
                    <span>{{ row.OrganizeCode }}</span>
                </template>
                </el-table-column>
                <el-table-column label="Actions" align="center" width="180" class-name="small-padding fixed-width" fixed="right">
                <template slot-scope="{row,$index}">
                    <el-button type="primary" class="violet-btn" size="mini" @click="handleUpdate(row)">
                    Manage
                    </el-button>
                    <el-button v-if="row.Status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
                    {{ $t('TEXT_COMMON_DELETE') }}
                    </el-button>
                </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total>0" :total="total" :page.sync="listQuery.Page" :limit.sync="listQuery.Rows" @pagination="getList" />
            
            </div>


            <el-dialog :title="textMap[dialogStatus]" :visible.sync="isDialogFormVisible"  width="50%">
            <el-form ref="dataForm" :rules="rules" :model="temp" label-position="top" label-width="70px" @submit.native.prevent="onEditFormSubmit">
                <input type="submit" class="display-none" >

                <el-row :gutter="16">
                    <el-col :xs="24" :sm="24">
                        <el-form-item label="Name" prop="Name">
                            <el-input v-model="temp.Name" />
                        </el-form-item>
                    </el-col>   
                    
                    <el-col :xs="24" :sm="24">            
                        <el-form-item :label="'Format'" prop="Content">                
                            <el-input type="textarea" v-model="temp.Content" placeholder="Format" class="filter-item" />
                        </el-form-item>
                    </el-col>

                    <el-col  :title="'Parameters'" :xs="24" :sm="24">
                      <div class="display-flex justify-content-between border-bottom">
                          <div class="buttons-row">
                          </div>
                          <div class="buttons-row white-space-nowrap">
                          <el-button v-if="manageType=='list'" class="filter-item button-custom blue-btn mt-10" type="primary" @click="handleCreateParam">
                              <item :icon="'create-white'"/> 
                          </el-button>
                          </div>
                      </div>
                                        
                      <el-table
                          v-loading="isListLoading"
                          :data="paramList"
                          :default-sort = "{prop: 'Name', order: 'ascending'}"                                
                          fit
                          style="width: 100%;box-shadow:none"
                      >
                          <el-table-column :label="'№'" align="left" min-width="50px">   
                            <template  slot-scope="{row,$index}">
                              <span>{{$index}}</span>                             
                            </template>
                          </el-table-column>
                          <el-table-column :label="'Name'" align="left" min-width="100px">                          
                          <template  slot-scope="{row}">
                              <el-input v-model="row.Name" class="edit-input" size="small" />  
                          </template>
                          </el-table-column>
                          <el-table-column :label="'Type'" align="right" min-width="60px">
                          <template  slot-scope="{row}">
                              <el-select size="small" v-model="row.Type" class="filter-item w-100" placeholder="Please select">
                                <el-option v-for="item in typeOptions" :key="item.code" :label="item.name" :value="item.code" />
                              </el-select>
                          </template>
                          </el-table-column>
                          <el-table-column :label="'Default'" align="right" min-width="60px">
                          <template  slot-scope="{row}">
                              <el-input v-model="row.Default" class="edit-input" size="small" /> 
                          </template>
                          </el-table-column>
                          <el-table-column :label="''"  align="right" width="70px">
                          <template  slot-scope="{row,$index}"> 
                              <el-button size="mini" type="danger" @click="handleDeleteParam(row,$index)">
                              <i class="el-dialog__close el-icon el-icon-close"></i>
                              </el-button>
                          </template>
                          </el-table-column>
                      </el-table>
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
        
        <el-form ref="listQuery"  :model="listQuery" label-position="top" class="form-padding" @submit.native.prevent="handleFilter" >
          <input :id="filterSubmitId" type="submit" class="display-none">
          <div class="padding-horizontal-x2 pb-3">
                
                <input type="submit" class="display-none">
                <!--<el-row :gutter="16">
                <el-col :xs="100" class="px-0">
                    <el-form-item label="Name" prop="q" class="no-margin-bottom">
                    <el-input v-model="listQuery.q" placeholder="Name" class="filter-item" />
                    </el-form-item>
                </el-col>
                <el-col :xs="100" class="px-0">
                    <el-form-item label="Content" prop="name" class="no-margin-bottom">
                    <el-input v-model="listQuery.Name" placeholder="Content" class="filter-item" />
                    </el-form-item>
                </el-col>
                <el-col :xs="100"  class="px-0">
                    <el-form-item label="Product" prop="number" class="no-margin-bottom">
                    <el-input v-model="listQuery.Number" placeholder="Product" class="filter-item" />
                    </el-form-item>
                </el-col>                
                </el-row>-->
            </div>
        </el-form>
      </div>
    </el-aside>
</el-container>  
</template>

<script>

import waves from '@/directive/waves' // waves directive
import { mapGetters } from 'vuex'

import { qtRemoteLogin } from '@/api/user'
import Pagination from '@/components/Pagination'
import { StatusList, LanguageList, TimeZoneList, DateTimeContentList, CountyList, DistanceUnitList, EconomyUnitList, VolumeUnitList, TemperatureUnitList, PressureUnitList } from "@/utils/dictionaries";
//import { sortArrayByObjProps } from "@/utils/helpers";
import { getCommandsTemplatesListAsync, createTemplateAjax, updateTemplateAjax, deleteTemplateAjax } from "@/api/user";
//import { fetchRoleList } from "@/api/role-managment";
import Item from '@/layout/components/Sidebar/Item'

export default {
  name: 'Templates',
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
        manageType: 'list',
        paramList: [],//[{'Name':'Test Param1','Type':'Text', 'Default':'400'},{'Name':'Test Param2','Type':'Number', 'Default':'600'}],
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
        Sort: 'Name',
        Email: '',
        FirstName: '',
        SubName: '',
        Mobile: '',
        Name: '',
      },
      typeOptions: [
        {'code':'TEXT','name':'TEXT'},
        {'code':'NUMBER','name':'NUMBER'},
        /*{'code':'LIST','name':'LIST'}*/
      ],
      //importanceOptions: ['Event'],
      //calendarTypeOptions,
      //sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      //statusOptions: ['published', 'draft', 'deleted'],
      //showReviewer: false,
      statusTypeOptions: StatusList,
      languageOptions: LanguageList,
      timeZoneOptions: TimeZoneList,
      dateTimeContentOptions: DateTimeContentList,
      countyOptions: CountyList,
      distanceUnitOptions: DistanceUnitList,
      economyUnitOptions: EconomyUnitList,
      volumeUnitOptions: VolumeUnitList,
      temperatureUnitOptions: TemperatureUnitList,
      pressureUnitOptions: PressureUnitList,
      roleTypeOptions: [],
      temp: { 
        Name: '',
        Content: '',
        Parameters: ''
      },
      isDialogFormVisible: false,
      isFormLoading: false,
      isChangeStateLoading: false,
      isSearchExpanded: false,
      dialogStatus: '',
      textMap: {
        update: 'Manage',
        create: 'Create'
      },
      //dialogPvVisible: false,
      //pvData: [],
      rules: {
        Name: [{ required: true, message: 'Name is required', trigger: 'blur' }],
        Content: [{ required: true, message: 'Content is required', trigger: 'blur' }],
        SubName: [{ required: true, message: 'Last Name is required', trigger: 'blur' }],
        Account: [{ required: true, message: 'Account is required', trigger: 'blur' }],
        Email: [
          { required: true, message: 'Email is required', trigger: 'blur' },
          { type: 'email', message: 'Please input correct email address', trigger: ['blur'] }
        ],
        //Mobile: [{ type: 'number', message: 'Only digits please', trigger: 'blur' }],
        RoleCode: [{ required: true, message: 'Role is required', trigger: 'change' }],
        ProvinceCode: [{ required: true, message: 'State / Province is required', trigger: 'blur' }],
        CityCode: [{ required: true, message: 'City is required', trigger: 'blur' }],
        CountryCode: [{ required: true, message: 'Country is required', trigger: 'change' }],
        ParentCode: [{ required: true, message: 'Parent is required', trigger: 'change' }],
        ServiceProfileCode: [{ required: true, message: 'Parent is required', trigger: 'change' }],
        WebSiteCode: [{ required: true, message: 'Parent is required', trigger: 'change' }],
      },
      downloadLoading: false

    }
  },
  created() {
    this.getList()
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    async manageParams(params) {  
        
    },
    async getList() {
      /*this.total = 10
      this.list = [{
        Code: '0',
        Name: 'Location',
        Content: '\r\nSERVER,QUIKTRAK.CO,40500#\r\nAPN,M2MDATA,,#"',
        Parameters: [],
        CreateOrganizeCode: ''
      }]
      this.isListLoading = false*/
      getCommandsTemplatesListAsync().then(response => {
        if(response.length)
        {	
          const arr = []
          response.forEach(el => {
            //el.CommandList.forEach(el1 => {
            arr.push({
                Code: el.Code,
                Name: el.Name,
                Content: el.Content,
                Parameters: el.Parameters,
                OrganizeCode: el.OrganizeCode,
            })
            //})
          })

          this.total = 20
          this.list = arr
          this.$nextTick(()=>{
            this.isListLoading = false
          })
        }else{          
            this.isListLoading = false
        }
      }).catch(e=>{        
          this.isListLoading = false
          console.error(e)
      })
    },
    /*async getParentRoles(token){
      if(!token) token = this.$store.getters.userInfo.Token
      let response = await fetchRoleList({token})
      if(!response){
        return
      }
      this.roleTypeOptions = sortArrayByObjProps(response, [{prop:'Name', direction: 1}])

      //console.log(response)
    },
    async getParentsList(){
      this.parentOptions = this.list[{
        Name: this.userInfo.OrganizeName,
        Code: this.userInfo.OrganizeCode
      }]
    },*/
    handleFilter() {
      this.listQuery.Page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {        
        Name: '',
        Content: '',
        Parameters: ''
      }
    },    
    handleCreateParam() {
        this.paramList.push({'Name':'','Type':'TEXT', 'Default':''})        
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'

      this.paramList = []

      this.isDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      console.log('get',this.temp.Parameters)

      this.paramList = []
      this.temp.Parameters.forEach((element, index) => {
        let obj = {
          Index: element.Index,
          Name: element.Name,
          Default: element.DefaultValue,
          Type: element.Type === 1 ? 'TEXT' : 'NUMBER'
        }
        this.paramList.push(obj)   
      })

      console.log(this.paramList)
      //this.temp.Content = this.temp.Content.replace(/↵/g, '\\n')
      
      //{'Name':'Test Param1','Type':'TEXT', 'Default':'400'},
      //{'Name':'Test Param2','Type':'NUMBER', 'Default':'600'}
      
      this.isDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    async handleDeleteParam(row, index){
        this.paramList.splice(index, 1)
    },
    async handleDelete(row, index) {
      deleteTemplateAjax({ Code: row.Code }).then(response => {        
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
      let str = ''
      let isEmpty = false
      this.paramList.forEach((element, index) => {
        if(element.Name.length){
          let dflt = element.Type == 'NUMBER' ? +element.Default : '"' + element.Default + '"'
          str += '{"Index":' + index + ',"Name":"' + element.Name + '","DefaultValue":' + dflt + ',"Type":"' + element.Type + '"}'
          index < this.paramList.length - 1 ? str += ',':''
        }else{
          isEmpty = true
        }
      })
        
      if(isEmpty){
        this.$notify({
          title: 'Error',
          message: 'Please remove empty parameters',
          type: 'error',
          duration: 2000
        })
        return
      }

      if(str.length) this.temp.Parameters = `[${str}]`
      
      this.temp.Content = this.temp.Content.replace(/↵/g, '\\n')

      let tempData = Object.assign({}, this.temp)
      this.$refs['dataForm'].validate(async (valid) => {
        if (!valid){
          return false
        }      

        this.isFormLoading = true
        
        if(this.dialogStatus === 'create'){ 
          
          /*this.total = 10
          this.list = [{
            Code: '0',
            Name: 'Location',
            Content: '\r\nSERVER,QUIKTRAK.CO,40500#\r\nAPN,M2MDATA,,#"',
            Parameters: [],
            CreateOrganizeCode: ''
          }]
          this.isListLoading = false*/
          
          createTemplateAjax(tempData).then(response => {  
            if(response.MajorCode == '000') {
              this.resetTemp()
              this.getList()
              this.$notify({
                title: 'Success',
                message: 'Created Successfully',
                type: 'success',
                duration: 2000
              })            
              
              this.isDialogFormVisible = false
            }else{
              this.$notify({
                title: 'Error',
                message: 'Incorrect data format',
                type: 'error',
                duration: 2000
              })
            }      
          })
        }else{
          updateTemplateAjax(tempData).then(response => {  
            if(response.MajorCode == '000') {
              this.resetTemp()
              this.getList()
              this.$notify({
                title: 'Success',
                message: 'Updated Successfully',
                type: 'success',
                duration: 2000
              })             
              
              this.isDialogFormVisible = false
            }else{
              this.$notify({
                title: 'Error',
                message: 'Incorrect data format',
                type: 'error',
                duration: 2000
              })
            }      
          })
          
        }

        this.isFormLoading = false
      })
    },    
    sortChange(data) {
      const { prop, order } = data
      this.listQuery.Order = this.listQuery.Order === 'ASC' ? 'DESC' : this.listQuery.Order === 'DESC' ? 'ASC' : 'ASC' //order === 'ascending' ? 'ASC' : (order === 'descending') ? 'DESC' : 'ASC'
      this.listQuery.Sort = prop
      this.getList()
    },
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
</style>

<style scoped lang="scss">



</style>