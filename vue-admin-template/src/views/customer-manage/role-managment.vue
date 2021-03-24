<template>
  <div class="app-container role-managment-page">
    <div class="filter-container">
      <div class="display-flex justify-content-between">
          <div class="buttons-row">
            <el-checkbox v-model="showAdditionalInfo"
            @change="tableKey=tableKey+1">Show Additional info</el-checkbox>
          </div>
          <div class="buttons-row white-space-nowrap">
          <el-button class="filter-item button-custom blue-btn" type="primary" @click="handleCreate">
          <item :icon="'create-white'"/> 
          </el-button>
          </div>
      </div>
      </div>
    <!--<div class="filter-container">
      <div class="buttons-row">
        <el-button class="filter-item" type="primary" icon="el-icon-circle-plus-outline" @click="handleCreate">
          New
        </el-button>
        <el-tooltip :content="showAdditionalInfo ? 'Hide Additional info' : 'Show Additional info'" placement="top">
          <el-switch
            v-model="showAdditionalInfo"
            active-text="Additional info"
            @change="tableKey=tableKey+1"
          />
        </el-tooltip>

      </div>

      <el-form ref="listQuery" :model="listQuery" label-position="top" class="form-padding">
        <el-row :gutter="16">
          <el-col :xs="24" :sm="8" :md="6" :lg="5">
            <el-form-item label="" prop="title">
              <el-input v-model="listQuery.Key" placeholder="Key" class="filter-item" @keyup.enter.native="handleFilter" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8" :md="6" :lg="5">
            <el-form-item label="" prop="title">
              <el-select v-model="listQuery.State" placeholder="State" clearable class="filter-item w-100">
                <el-option v-for="item in stateOptions" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="8" :md="6" :lg="5">
            <el-form-item label="" prop="title">
              <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
                Search
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>


    </div>-->
    <div class="table-wrapper">
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @sort-change="sortChange"
      >

        <el-table-column label="Name" fixed="left"  align="center" min-width="180px">
          <template slot-scope="{row}">
            <span>{{ row.Name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="State"  width="180px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.State }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="showAdditionalInfo" label="Remark" width="160px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.Remark }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Order"  class-name="status-col" width="100">
          <template slot-scope="{row}">
            
              {{ row.Order }}
          </template>
        </el-table-column>
        <el-table-column label="Actions" align="center" width="160" class-name="small-padding fixed-width" fixed="right">
          <template slot-scope="{row,$index}">
             <el-tooltip effect="dark" :content="'Manage'" placement="top-end">
              <el-button type="primary" class="blue-btn" size="mini" @click="handleManage(row)">
                {{ $t('TEXT_COMMON_EDIT') }}
              </el-button>
            </el-tooltip>
            <el-button  size="mini" type="danger" @click="handleDelete(row,$index)">
                    {{ $t('TEXT_COMMON_DELETE') }}
                    </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <!-- -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="top" label-width="70px">
        <el-row :gutter="16">
          <el-col :xs="24" :sm="12">
            <el-form-item label="State" prop="state">
              <el-select v-model="temp.State" class="filter-item w-100" placeholder="Please select">
                <el-option v-for="item in stateOptions" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="Name" prop="name">
              <el-input v-model="temp.Name" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :xs="24" :sm="12">
            <el-form-item label="Order" prop="order">
              <el-input v-model="temp.Order" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="Remark" prop="remark">
              <el-input v-model="temp.Remark" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :xs="24" :sm="24">
            <el-tree
              v-show="dialogStatus==='manage'"
              :data="tree"
              node-key="id2"
              default-expand-all
              :expand-on-click-node="false"
              class="modal-tree"
            >
              <span slot-scope="{ node, data }" class="custom-tree-node">
                <span>{{ node.label.name }}</span>
                <span class="flex">
                  <div v-if="node.label.parent!='None'" class="actions-div">
                    <el-select
                      v-model="node.label.permissionStatus"
                      @change="checkSelected(data.code, node.label.roleCode, node.label.permissionStatus)"
                    >
                      <el-option label="N" value="0" />
                      <el-option label="R" value="1" />
                      <el-option label="W" value="2" />
                      <el-option label="WR" value="3" />
                    </el-select>
                  </div>
                  <div v-else class="actions-title">
                    Actions
                  </div>
                </span>
              </span>
            </el-tree>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='manage'?manageData():dialogStatus==='create'?createData():updateData()"><!--@click="dialogStatus==='create'?createData():updateData()"-->
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchPermissionList } from '@/api/role'
import { fetchRoleListAjax, getRolesPermissionsAjax, manageRoleAjax, createRoleAjax, deleteRoleAjax } from '@/api/role-managment'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Item from '@/layout/components/Sidebar/Item'
import { getToken } from '@/utils/auth' // get token from cookie

const parentCodeOptions = [
]

const stateOptions = [
  { code: '0', name: '0' }
]

const statusOptions = [
  { code: 'A', name: 'A' },
  { code: 'V', name: 'V' }
]

// arr to obj, such as { CN : "China", US : "USA" }
/* const stateKeyValue = stateOptions.reduce((acc, cur) => {
  acc[cur.code] = cur.name
  return acc
}, {})*/

export default {
  name: 'ComplexTable',
  components: { Pagination, Item },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
    /* typeFilter(type) {
      return categoryTypeKeyValue[type]
    }*/
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      tree: [],
      permissionArray: [],
      parentCodeOptions,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        Importance: undefined,
        Title: undefined,
        Type: undefined,
        Sort: '+code'
      },
      stateOptions,
      statusOptions,
      // sortOptions: [{ label: 'ID Ascending', code: '+code' }, { label: 'ID Descending', code: '-code' }],
      // statusOptions: ['A', 'V'],
      showAdditionalInfo: false,
      temp: {
        Code: undefined,
        Name: undefined,
        Order: undefined,
        Remark: undefined,
        State: '0'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create',
        manage: 'Manage permissions'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        State: [{ required: true, message: 'state is required', trigger: 'change' }]
        // timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        // title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  computed: {
    /* selectedSatus: {
      get: function(data) {
        console.log('selected',data)
        //return this.$store.state.selectedPickupLocation
      },
      set: function(newValue) {
        //this.$store.commit('setPickupLocation', newValue)
      }
    }*/
  },
  created() {
    this.getList()
  },
  methods: {
    checkSelected(permission, role, status) { 
      const permissionCode = this.permissionArray.findIndex(item => item.PermissionCode === permission && item.Code === role)
      if (permissionCode !== -1) {
        if (status === '0') {
          this.permissionArray.splice(permissionCode, 1)
        } else {
          this.permissionArray[permissionCode].Status = status
        }
      } else {
        this.permissionArray.push({
          Code: role,
          PermissionCode: permission,
          Status: status
        })
      }
    },
    async getList() {
      this.listLoading = true
      const token = getToken()

      const query = {
        page: this.listQuery.page,
        Rows: this.listQuery.limit,
        Status: 'A',
        token
      }
      fetchRoleListAjax(query).then(response => {
      
        this.listLoading = false
      
        this.total = response.length // response.total
        this.list = response
      })
    },
    getTreeList(data = null) {
      const self = this

      getRolesPermissionsAjax({
          'code': data
        }).then(response1 => {

        self.permissionArray = response1
        fetchPermissionList(null).then(response => {
          self.tree.length = 0
          self.parentCodeOptions.length = 0
          self.parentCodeOptions.push({ code: '00000000-0000-0000-0000-000000000000', name: 'ROOT' })

          const firstLevelTree = []
          const firstLevelArray = response[0].Children
          firstLevelArray.forEach((element, index) => {
            
            const secondLevelTree = []
            const secondLevelArray = element.Children
            secondLevelArray.forEach((element1, index1) => {

              const thirdLevelTree = []
              const thirdLevelArray = element1.Children
              thirdLevelArray.forEach((element2, index2) => {

                const forthLevelTree = []
                const forthLevelArray = element2.Children
                forthLevelArray.forEach((element3, index3) => {

                  const fivesLevelTree = []
                  const fivesLevelArray = element3.Children
                  fivesLevelArray.forEach((element4, index4) => {

                    
                    let permissionStatus = '0'
                    let permissionCode = -1
                    if (response1.length){
                      permissionCode = response1.findIndex(item => item.PermissionCode === element4.Code)
                    }
                    if (permissionCode !== -1) permissionStatus = response1[permissionCode].Status.toString()

                    fivesLevelTree.push({
                      code: element4.Code,
                      label: {
                        name: element4.Key,
                        type: element4.Type,
                        key: element4.Key,
                        value: element4.Value,
                        sort: element4.Status,
                        parent: element4.ParentCode,
                        language: element4.LanguageCode,
                        status: element4.Status,
                        permissionStatus: permissionStatus,
                        roleCode: data
                      },
                      //children: forthLevelTree
                    })
                  })
                  /** */
                  
                  let permissionStatus = '0'
                  let permissionCode = -1
                  if (response1.length){
                    permissionCode = response1.findIndex(item => item.PermissionCode === element3.Code)
                  }
                  if (permissionCode !== -1) permissionStatus = response1[permissionCode].Status.toString()

                  forthLevelTree.push({
                    code: element3.Code,
                    label: {
                      name: element3.Key,
                      type: element3.Type,
                      key: element3.Key,
                      value: element3.Value,
                      sort: element3.Status,
                      parent: element3.ParentCode,
                      language: element3.LanguageCode,
                      status: element3.Status,
                      permissionStatus: permissionStatus,
                      roleCode: data
                    },
                    children: fivesLevelTree
                  })
                })
                /** */
                
                let permissionStatus = '0'
                let permissionCode = -1
                if (response1.length){
                  permissionCode = response1.findIndex(item => item.PermissionCode === element2.Code)
                }
                if (permissionCode !== -1) permissionStatus = response1[permissionCode].Status.toString()

                thirdLevelTree.push({
                  code: element2.Code,
                  label: {
                    name: element2.Key,
                    type: element2.Type,
                    key: element2.Key,
                    value: element2.Value,
                    sort: element2.Status,
                    parent: element2.ParentCode,
                    language: element2.LanguageCode,
                    status: element2.Status,
                    permissionStatus: permissionStatus,
                    roleCode: data
                  },
                  children: forthLevelTree
                })
              })
              /** */
              
              let permissionStatus = '0'
              let permissionCode = -1
              if (response1.length){
                permissionCode = response1.findIndex(item => item.PermissionCode === element1.Code)
              }
              if (permissionCode !== -1) permissionStatus = response1[permissionCode].Status.toString()

              secondLevelTree.push({
                code: element1.Code,
                label: {
                  name: element1.Key,
                  type: element1.Type,
                  key: element1.Key,
                  value: element1.Value,
                  sort: element1.Status,
                  parent: element1.ParentCode,
                  language: element1.LanguageCode,
                  status: element1.Status,
                  permissionStatus: permissionStatus,
                  roleCode: data
                },
                children: thirdLevelTree
              })
            })
            //** */
            let permissionStatus = '0'
            let permissionCode = -1
            if (response1.length){
              permissionCode = response1.findIndex(item => item.PermissionCode === element.Code)
            }
            if (permissionCode !== -1) permissionStatus = response1[permissionCode].Status.toString()
            self.parentCodeOptions.push({ code: element.Code, name: element.Key })
            firstLevelTree.push({
              code: element.Code,
              label: {
                name: element.Key,
                type: element.Type,
                key: element.Key,
                value: element.Value,
                sort: element.Status,
                parent: element.ParentCode,
                language: element.LanguageCode,
                status: element.Status,
                permissionStatus: permissionStatus,
                roleCode: data
              },
              children: secondLevelTree
            })
          })

          let permissionStatus = '0'
          let permissionCode = -1
          if (response1.length){
            permissionCode = response1.findIndex(item => item.PermissionCode === response[0].Code)
          }
          if (permissionCode !== -1) permissionStatus = response1[permissionCode].Status.toString()

          self.tree.push({
            code: response[0].Code,
            label: {
              name: response[0].Key,
              type: response[0].Type,
              key: response[0].Key,
              value: response[0].Value ? response[0].Value : 'NULL',
              sort: response[0].Status,
              parent: response[0].ParentCode,
              language: response[0].LanguageCode,
              status: response[0].Status,
              permissionStatus: permissionStatus,
              roleCode: data
            },
            children: firstLevelTree
          })

          /* setTimeout(() => {
            self.listLoading = false
          }, 1.5 * 1000)*/
        })
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: 'Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'code') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+code'
      } else {
        this.listQuery.sort = '-code'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        code: undefined,
        Name: undefined,
        Order: undefined,
        Remark: undefined,
        State: '0'
      }
    },
    handleCreate() {
      this.resetTemp()
      // this.temp = Object.assign({}, row)
      // this.temp.token = '00000000-0000-0000-0000-000000000000'
      this.getTreeList()

      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      const self = this
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          delete tempData.code

          createRoleAjax(tempData).then(response1 => {
          
            self.getList()
            // this.temp.code = response.data.code
            // this.list.unshift(this.temp)
            self.dialogFormVisible = false
            self.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleManage(row) {
      this.temp = Object.assign({}, row)
      
      const token = getToken()
      this.temp.token = token
      this.getTreeList(this.temp.Code)
      //this.permissionArray = []
      this.dialogStatus = 'manage'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    manageData() {
      const self = this
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {

           
          //this.temp.permissions = this.permissionArray
          const tempData = Object.assign({}, this.temp)

          tempData.permissions = this.permissionArray.filter(item => item.Code === tempData.Code)
          /* const params = new URLSearchParams()

          const arr = Object.keys(tempData)
          arr.forEach(element => {
            if (element === 'permissions') {
              params.append('permissions[]', JSON.stringify(tempData[element][0]))
            } else {
              params.append(element, tempData[element])
            }
          })*/

          var permins = []
          tempData.permissions.forEach(_val=>{ permins.push(JSON.stringify(_val)) })
          tempData.permissions = permins
          //console.log(tempData.permissions, permins)

          manageRoleAjax(tempData).then(response => {
            self.dialogFormVisible = false
            self.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      const token = getToken()
      this.temp.token = token
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      console.log('this method removed')
    },
    async handleDelete(row, index) {
      deleteRoleAjax({ Code: row.Code }).then(response => {        
        this.$notify({
          title: 'Success',
          message: 'Deleted Successfully',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      })
      
    },
    /*
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.code === this.temp.code)
            this.list.splice(index, 1, this.temp)

            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      row.token = '00000000-0000-0000-0000-000000000000'
      deleteArticle(row).then(() => {
        this.$notify({
          title: 'Success',
          message: 'Delete Successfully',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      })
    },*/
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
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
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>

<style >


.role-managment-page .custom-tree-node span:last-child div {
    font-size: 12px;
    padding: 24px 0;
}

.role-managment-page .custom-tree-node span:first-child{
  font-size: 12px;
}

.role-managment-page .el-tree-node__content {
    height: 40px;
    overflow: hidden;
}

.role-managment-page .el-tree .el-tree-node[tabindex="-1"] .actions-title {
    padding: 24px 0px;
}


@media only screen and (max-width: 1100px){
  .role-managment-page .el-tree-node__children div[tabindex="-1"] span:first-child {
      width: 25px;
  }
  .role-managment-page .el-tree-node__children div[tabindex="-1"] .el-tree-node__children div[tabindex="-1"] span:first-child {
      width: 25px;
  }
  .role-managment-page .el-tree-node__children div[tabindex="-1"] .el-tree-node__children div[tabindex="-1"] .el-tree-node__children div[tabindex="-1"] span:first-child {
      width: 25px;
  }
  .role-managment-page .el-tree-node__children div[tabindex="-1"] .el-tree-node__children div[tabindex="-1"] .el-tree-node__children div[tabindex="-1"] .el-tree-node__children div[tabindex="-1"] span:first-child {
      width: 25px;
  }
  .role-managment-page .el-tree-node__children div[tabindex="-1"] .el-tree-node__children div[tabindex="-1"] .el-tree-node__children div[tabindex="-1"] .el-tree-node__children div[tabindex="-1"] .el-tree-node__children div[tabindex="-1"] span:first-child {
      width: 25px;
  }
}


  .pagination-container{
    margin: 20px;
  }  

.align-center{
  text-align: center;
}

.header-permission{
  display: flex;
  width: 100%;
}

.left, .right {
    display: inline-block;
    //display: inline;
    //zoom: 1;
    width: 100%;
    margin-right: -100%;
    vertical-align: bottom;
}
.right {
    text-align: right;
}
.left a, .right a { display: inline-block; position: relative; }
.left a { width: 200px; height: 100px; background: green; }
.right a { width: 100px; height: 200px; background: pink; }

.table-tree{
  border: 1px solid #EBEEF5;
  border-bottom: 0px;
}

.modal-tree{
  margin: 0px;
}

.el-select-dropdown{
  margin-top:-5px !important;
}

.el-input__suffix{
  padding: 0 !important;
}

.el-tree-node__content{
  height: 54px;
}

.block{
  padding-top: 20px;
}

.bottom-line {
    display: flex;
    flex: 0 1 auto;
    width: 100%;
    border-top: 1px solid #EBEEF5;
}

.el-form-item__label{
  line-height: 15px;
}

.form-content{
  padding: 20px;
}

.flex{
    display: flex;
}

/*.el-tree .el-tree-node:first-child .custom-tree-node{
  font-weight: bold;
    color: rgba(0,0,0,0.45);
}*/

.el-tree-node__children div[tabindex="-1"]  .custom-tree-node span{
  font-weight: 400;
  color: #606266;
}






.el-tree-node__children div[tabindex="-1"]  .actions-div span{
  color: #ffffff;
}

.el-tree .el-tree-node[tabindex="-1"] .actions-title{
  padding:18px 0px;
}

.el-tree .el-tree-node[tabindex="0"] .el-tree-node__expand-icon{
  cursor:inherit;
  opacity:0;
}

.custom-tree-node span:last-child div{
  width: 160px;
  height: 100%;
  padding: 19px 0;
  text-align: center;
}

.custom-tree-node span:last-child div:last-child{
  padding: 12px 0px;
}

.table-tree .custom-tree-node span:last-child div{
  border-left: 1px solid #EBEEF5;
}

.table-tree .custom-tree-node span:last-child .edit-button{
  border-left: 1px solid #EBEEF5;
}

.table-tree .custom-tree-node span:last-child .delete-button{
  border-left: 1px solid #EBEEF5;
}

.el-tree-node__content{
  border-bottom: 1px solid #EBEEF5;
}

.modal-tree .el-tree-node__content{
  border: none;
}

.el-table__body tr td:last-child{
  width: 100px;
}
.el-button--mini{
  padding: 7px 15px;
}

.actions-div{
  margin-top:4px;
}
/*
@media only screen and (max-width: 1100px) {
  .custom-tree-node span:first-child{
    width: 100px;
  }

  .el-tree-node__children div[tabindex="-1"]  span:first-child{
    width: 82px;
  }

  .el-tree-node__children div[tabindex="-1"] .el-tree-node__children div[tabindex="-1"] span:first-child{
    width: 64px;
  }
}*/

.el-input__inner{
  height: 36px;
}

.el-tree-node__content {
  height: 50px;
}

/*@import url("//unpkg.com/element-ui@2.13.2/lib/theme-chalk/index.css");*/
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    /*padding-right: 8px;*/
  }
/*.el-table{
  margin-top: 20px;
}
.el-dialog{
  min-width: 400px;
}
@media (max-width: 991px){
  .el-form{
    width: 100% !important;
    margin-left: 0px !important;
  }
  .el-dialog{
    width: 90%;
  }
}*/

.el-dialog__body{
  padding-top: 10px;
}

.custom-tree-node input{
  width: 100px;
}

.custom-tree-node .el-input__suffix {
    right: 35px;
}
</style>
