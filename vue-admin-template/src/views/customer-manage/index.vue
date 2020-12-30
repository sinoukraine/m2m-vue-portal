<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="buttons-row">
        <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="handleCreate">
          New
        </el-button>
        <!--<el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
          Export
        </el-button>-->
        <!--<el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
          show description
        </el-checkbox>-->
      </div>
      <el-form ref="listQuery"  :model="listQuery" label-position="top" class="form-padding" @submit.native.prevent="handleFilter">
        <input type="submit" class="display-none">
        <el-row :gutter="16">
          <!--<el-col :xs="24" :sm="8" :md="6" :xl="4">
            <el-form-item label="" prop="Name">
              <el-input v-model="listQuery.Name" placeholder="Customer Name" class="filter-item" />
            </el-form-item>
          </el-col>-->
          <el-col :xs="24" :sm="8" :md="6" :xl="4">
            <el-form-item label="" prop="Account">
              <el-input v-model="listQuery.Account" placeholder="Account(Login Name)" class="filter-item" />
            </el-form-item>
          </el-col>

          <el-col v-if="isSearchExpanded" :xs="24" :sm="8" :md="6" :xl="4">
            <el-form-item label="" prop="Email">
              <el-input v-model="listQuery.Email" placeholder="Email" class="filter-item" />
            </el-form-item>
          </el-col>
          <el-col v-if="isSearchExpanded" :xs="24" :sm="8" :md="6" :xl="4">
            <el-form-item label="" prop="FirstName">
              <el-input v-model="listQuery.FirstName" placeholder="First Name" class="filter-item" />
            </el-form-item>
          </el-col>
          <el-col v-if="isSearchExpanded" :xs="24" :sm="8" :md="6" :xl="4">
            <el-form-item label="" prop="SubName">
              <el-input v-model="listQuery.SubName" placeholder="Last Name" class="filter-item" />
            </el-form-item>
          </el-col>
          <!--<el-col v-if="isSearchExpanded" :xs="24" :sm="8" :md="6" :xl="4">
            <el-form-item label="" prop="Mobile">
              <el-input v-model="listQuery.Mobile" placeholder="Mobile" class="filter-item" />
            </el-form-item>
          </el-col>-->
          <el-col :xs="24" :sm="8" :md="6" :xl="4">
            <el-row :gutter="16">
              <el-col :span="12">
                <el-form-item>
                  <el-button v-waves class="filter-item width-100" type="primary" icon="el-icon-search" @click="handleFilter">
                    {{ $t('TEXT_COMMON_SEARCH') }}
                  </el-button>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item>
                  <el-button v-waves type="text" @click="isSearchExpanded = !isSearchExpanded">
                    <span v-if="isSearchExpanded">Collapse Search</span><span v-else>Expand Search</span>
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="table-wrapper">
      <el-table
        :key="tableKey"
        v-loading="isListLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @sort-change="sortChange"
      >
        <!--<el-table-column label="User Name" align="center" fixed="left" min-width="180px">
          <template slot-scope="{row}">
            <span>{{ row.Name }}</span>
          </template>
        </el-table-column>-->
        <el-table-column label="Account(Login name)" fixed="left" align="left" min-width="180px">
          <template slot-scope="{row}">
            <span>{{ row.Account }}</span>
          </template>
        </el-table-column>
        <el-table-column label="First Name" width="160px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.FirstName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Last Name" width="160px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.SubName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Email" width="160px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.Email }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Mobile" width="160px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.Mobile }}</span>
          </template>
        </el-table-column>

        <el-table-column label="State" width="180px" align="center">
          <template slot-scope="{row}">
            <el-tag :type="row.State | statusFilter">
              {{ getStatusText(row.State) }}
            </el-tag>
          </template>
        </el-table-column>



        <el-table-column label="Actions" align="center" width="200" class-name="small-padding fixed-width" fixed="right">
          <template slot-scope="{row,$index}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              {{ $t('TEXT_COMMON_EDIT') }}
            </el-button>
            <el-button v-if="row.Status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
              {{ $t('TEXT_COMMON_DELETE') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>


    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="isDialogFormVisible" >
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="top" label-width="70px" @submit.native.prevent="onEditFormSubmit">
        <input type="submit" class="display-none" >
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

          <el-col :xs="24" :sm="12" >
            <el-form-item label="Remark" prop="Remark">
              <el-input v-model="temp.Remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Some notes" />
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isDialogFormVisible = false">
          {{ $t('TEXT_COMMON_CANCEL') }}
        </el-button>
        <el-button :loading="isFormLoading" type="primary" @click="onEditFormSubmit()">
          {{ $t('TEXT_COMMON_SAVE') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import waves from '@/directive/waves' // waves directive
import { mapGetters } from 'vuex'

import Pagination from '@/components/Pagination'
import { StatusList, LanguageList, TimeZoneList, DateTimeFormatList, CountyList } from "@/utils/dictionaries";
import { sortArrayByObjProps } from "@/utils/helpers";
import { fetchUsersList, createUser, updateUser, deleteUser } from "@/api/user";
import { fetchRoleList } from "@/api/role-managment";


export default {
  name: 'Customers',
  components: { Pagination },
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
      tableKey: 0,
      list: null,
      total: 0,
      isListLoading: true,
      listQuery: {
        Page: 1,
        //Limit: 20,
        Rows: 20,
        Sort: 'ASC',
        Order: 'Account',
        //importance: undefined,
       // title: undefined,
        //type: undefined,
        //sort: '+id'
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
          { type: 'email', message: 'Please input correct email address', trigger: ['blur','change'] }
        ],
        Mobile: [{ type: 'number', message: 'Only digits please', trigger: 'blur' }],
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
      this.isListLoading = true
      //console.log('start')
      /*fetchList(this.listQuery).then(response => {

      })*/

      //response.data.items
     /* let query = {
        Page: this.listQuery.page,
        Rows: this.listQuery.limit,
      }*/
      let response = await fetchUsersList(this.listQuery)
      this.isListLoading = false
      //console.log(response)
      if(!response){
        return
      }
      //console.log(response)
      this.total = response.total
      this.list = response.rows



    },
    async getOrganisationRoles(token){
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
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
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

<style scoped lang="scss">



</style>
