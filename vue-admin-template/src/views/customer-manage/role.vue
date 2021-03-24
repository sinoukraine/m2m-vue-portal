<template>
  <div class="app-container role-page">

    <modal name="role-modal" height="auto" :scrollable="true">
      <!--<el-tree
        :data="data"
        node-key="id2"
        default-expand-all
        :expand-on-click-node="false"
        class="modal-tree"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span>{{ node.label.name }}</span>
          <span class="flex">
            <el-select v-model="modal.role.permission" placeholder="N">
              <el-option label="R" value="R" />
              <el-option label="W" value="W" />
              <el-option label="N" value="N" />
            </el-select>
          </span>
        </span>
      </el-tree>-->
    </modal>

    <div class="no-padding">
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
    </div>

    <div v-if="manageForm=='Permissions'" class="block table-wrapper">

      <!---->
      <!--show-checkbox

        draggable
        :allow-drop="allowDrop"
        :allow-drag="allowDrag"
        @node-drag-start="handleDragStart"
        @node-drag-enter="handleDragEnter"
        @node-drag-leave="handleDragLeave"
        @node-drag-over="handleDragOver"
        @node-drag-end="handleDragEnd"
        @node-drop="handleDrop"-->

      <!--<el-tree
      ref="tree2"
      :data="data2"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
    />
        :expand-on-click-node="false"-->
      <el-tree
        ref="tree"
        :data="data"
        :filter-node-method="filterNode"
        node-key="code"
        default-expand-all
        class="table-tree"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span>{{ node.label.name }}</span>
          <span class="flex">
            <div>{{ node.label.type }}</div>
            <div>{{ node.label.key }}</div>
            <div>{{ node.label.value }}</div>
            <div>{{ node.label.order }}</div>
            <div v-if="node.label.parent!='None'" class="actions-div">
              <el-tooltip effect="dark" :content="$t('TEXT_COMMON_EDIT')" placement="top-end">
                <el-button type="primary" class="blue-btn" size="mini" @click="handleUpdate(data)">
                    {{ $t('TEXT_COMMON_EDIT') }}
                    </el-button>
              </el-tooltip>
              <el-tooltip effect="dark" :content="$t('TEXT_COMMON_DELETE')" placement="top-end">
                <el-button size="mini" type="danger" @click="handleDelete(data.code)">
                    {{ $t('TEXT_COMMON_DELETE') }}
                </el-button>
              </el-tooltip>
            </div>
            <div v-else class="actions-title">
              Actions
            </div>
            <!--<el-button
              type="text"
              size="mini"
              @click="() => remove(node, data)"
            >
              Delete
            </el-button>
            <div>info</div>-->
          </span>
        </span>
      </el-tree>
    </div>
    <div v-else>
      <el-table
        v-loading="isListLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="ID" width="95">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column label="Title">
          <template slot-scope="scope">
            {{ scope.row.order }}
          </template>
        </el-table-column>
        <el-table-column label="" :width="'87px'">
          <template>
            <el-button
              type="success"
              size="medium"
              @click.stop="sayHello"
            >
              Edit
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="top" label-width="70px">
        <el-row :gutter="16" >
          <el-col :xs="24" :sm="12">
            <!--<el-form-item label="Parent" prop="parentcode">-->
              <el-form-item v-if="dialogStatus === 'update'" label="Parent" prop="ParentName">   
                <el-input :value="temp.parentname" disabled placeholder="Parent"/>
              </el-form-item>
              <el-form-item v-else :label="'Parent'" prop="ParentCode" class="w-100">
                <input type="hidden" :value="temp.parentcode" >
                <el-select
                  ref="parentSearchSelect"
                  v-model="searchedParentName"
                  :remote-method="querySearchParentCreate"
                  filterable
                  default-first-option
                  clearable
                  remote
                  placeholder="Parent"
                  class="parent-search-select w-100"
                  @change="changeParentCreate"
                >
                  <el-option v-for="item in parentCreateArr" :key="item.code" :value="item" :label="item.name" />
                </el-select>
              <!--<el-select v-model="temp.parentcode" :disabled="dialogStatus==='create'?false:true" class="filter-item" placeholder="Please select">
                <el-option v-for="item in parentCodeOptions" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>-->
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="Type" prop="category">
              <!--<el-select v-model="temp.type" class="filter-item" placeholder="Please select">
                <el-option v-for="item in typeOptions" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>-->
              <el-input v-model="temp.type"  placeholder="Type"/>
            </el-form-item>
          </el-col>
          <!--<el-col :xs="24" :sm="12">
            <el-form-item label="Lang" prop="languagecode">
              <el-select v-model="temp.languagecode" class="filter-item" placeholder="Please select">
                <el-option v-for="item in languageCodeOptions" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
          </el-col>-->
          <el-col :xs="24" :sm="12">
          <el-form-item label="Key" prop="key">
            <el-input v-model="temp.key"  placeholder="Key" />
          </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="Value" prop="value">
              <el-input v-model="temp.value"  placeholder="Value" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="Status" prop="status">
              <!--<el-input v-model="temp.status" />-->
              <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
                <el-option v-for="item in statusOptions" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="Order" prop="order">
              <el-input v-model="temp.order"  placeholder="Oredr"/>
            </el-form-item>       
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchPermissionList, addPermission, deletePermission, updatePermission } from '@/api/role'
import Item from '@/layout/components/Sidebar/Item'
import { getToken } from '@/utils/auth' // get token from cookie


const typeOptions = [
  { code: 'Event', name: 'Event' },
  { code: 'Test', name: 'Test' }
]

const statusOptions = [
  { code: "0", name: "Disable" },
  { code: "1", name: "Enable" }
]

const parentCodeOptions = [
  //{ code: '00000000-0000-0000-0000-000000000000', name: 'ROOT' }
]

const languageCodeOptions = [
  { code: 'ROOT', name: 'ROOT' }
]

export default {
  name: 'RoleTree',
  components: { Item },
  data() {
    const data = []
    return {      
      searchedParentName: '',
      parentCreateArr: [],
      searchedParentCreate: null,
      searchedParent: '',
      parentArr: [],
      list: null,
      isListLoading: true,
      manageForm: 'Permissions',
      typeOptions,
      parentCodeOptions,
      languageCodeOptions,
      statusOptions,
      // sortOptions: [{ label: 'ID Ascending', code: '+code' }, { label: 'ID Descending', code: '-code' }],
      // statusOptions: ['A', 'V'],
      temp: {
        code: undefined,
        key: undefined,
        order: undefined,
        value: undefined,
        parentcode: '00000000-0000-0000-0000-000000000000',
        languagecode: 'ROOT',
        type: '',
        status: ''
      },
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      modal: {
        role: {
          permission: 'N'
        }
      },
      filterText: '',
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        //Type: [{ required: true, message: 'type is required', trigger: 'change' }]
        // timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        // title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      data: JSON.parse(JSON.stringify(data))
    }
  },
  watch: {
    filterText(val) {
      console.log(val)
      this.$refs.tree.filter(val)

      // this.show()
    } /*
    manageForm(val) {
      this.$router.replace('/form/index')
    }*/
  },
  created() {
    this.getList()
  },
  methods: {
    
    
    querySearchParentCreate(query) {
      if (query !== '') {        
        if(query.length > 1) {
          this.searchParentCreate(query)
        }      
      } else {
        this.parentCreateArr = []
      }
    },
    async searchParentCreate(query) {
      const arr = []      
      this.parentCreateArr = []
      /*let listQuery = {
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
        this.parentCreateArr = arr
      })*/
      
      this.parentCreateArr = this.parentCodeOptions.filter(el=>el.name.includes(query))
      
    },
    changeParentCreate(val) {
      this.parentCreateArr = []
      this.searchedParentCreate = val
      this.temp.parentcode = val.code
      this.searchedParentName = val.name
    },

    async getList() {
      this.isListLoading = true
      let response = await fetchPermissionList()
      this.isListLoading = false
      //console.log(response)
      if (!response) {
        return
      }

      this.total = response.total

      this.data.length = 0
      this.data.push({
        code: '0',
        label: {
          name: 'Name',
          type: 'Type',
          key: 'Key',
          value: 'Value',
          //sort: 'Status',
          order: 'Order',
          parent: 'None',
          language: 'Language',
          status: 'Status'
        }
      })

      this.parentCodeOptions.length = 0
      this.parentCodeOptions.push({code: '00000000-0000-0000-0000-000000000000', name: 'ROOT'})

      const firstLevelTree = []
      const firstLevelArray = response[0].Children
      firstLevelArray.forEach((element, index) => {
        const secondLevelTree = []
        const secondLevelArray = element.Children
        secondLevelArray.forEach((element1, index1) => {
          this.parentCodeOptions.push({ code: element1.Code, name: element1.Key })

          const thirdLevelTree = []
          const thirdLevelArray = element1.Children
          thirdLevelArray.forEach((element2, index2) => {
            this.parentCodeOptions.push({ code: element2.Code, name: element2.Key })


            const forthLevelTree = []
            const forthLevelArray = element2.Children
            forthLevelArray.forEach((element3, index3) => {
              this.parentCodeOptions.push({ code: element3.Code, name: element3.Key })


              const fivesLevelTree = []
              const fivesLevelArray = element3.Children
              fivesLevelArray.forEach((element4, index4) => {
                //this.parentCodeOptions.push({ code: element1.code, name: element1.key })




                fivesLevelTree.push({
                  code: element4.Code,
                  label: {
                    name: element4.Key,
                    type: element4.Type,
                    key: element4.Key,
                    value: element4.Value,
                    //sort: element1.Status,
                    order: element4.Order,
                    parent: element4.ParentCode,
                    language: element4.LanguageCode,
                    status: element4.Status
                  },
                  //children: thirdLevelTree

                })
              })

              forthLevelTree.push({
                code: element3.Code,
                label: {
                  name: element3.Key,
                  type: element3.Type,
                  key: element3.Key,
                  value: element3.Value,
                  //sort: element1.Status,
                  order: element3.Order,
                  parent: element3.ParentCode,
                  language: element3.LanguageCode,
                  status: element3.Status
                },
                children: fivesLevelTree

              })
            })

            thirdLevelTree.push({
              code: element2.Code,
              label: {
                name: element2.Key,
                type: element2.Type,
                key: element2.Key,
                value: element2.Value,
                //sort: element1.Status,
                order: element2.Order,
                parent: element2.ParentCode,
                language: element2.LanguageCode,
                status: element2.Status
              },
              children: forthLevelTree

            })
          })
          secondLevelTree.push({
            code: element1.Code,
            label: {
              name: element1.Key,
              type: element1.Type,
              key: element1.Key,
              value: element1.Value,
              //sort: element1.Status,
              order: element1.Order,
              parent: element1.ParentCode,
              language: element1.LanguageCode,
              status: element1.Status
            },
            children: thirdLevelTree

          })
        })

        this.parentCodeOptions.push({code: element.Code, name: element.Key})
        firstLevelTree.push({
          code: element.Code,
          label: {
            name: element.Key,
            type: element.Type,
            key: element.Key,
            value: element.Value,
            //sort: element.Status,
            order: element.Order,
            parent: element.ParentCode,
            language: element.LanguageCode,
            status: element.Status
          },
          children: secondLevelTree
        })
      })

      this.data.push({
        code: response[0].Code,
        label: {
          name: response[0].Key,
          type: response[0].Type,
          key: response[0].Key,
          value: response[0].Value ? response[0].Value : 'NULL',
          //sort: response[0].Status,
          order: response[0].Order,
          parent: response[0].ParentCode,
          language: response[0].LanguageCode,
          status: response[0].Status
        },
        children: firstLevelTree
      })

    },
    resetTemp() {
      this.temp = {
        code: undefined,
        key: undefined,
        order: undefined,
        value: undefined,
        parentcode: '00000000-0000-0000-0000-000000000000',
        languagecode: 'ROOT',
        type: '',
        status: ''
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
      const token = getToken()
      const tempData = Object.assign({}, this.temp)
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid) {
          delete tempData.code
          tempData.token = token//'00000000-0000-0000-0000-000000000000'
          let response = await addPermission(tempData)

          if (!response) {
            return
          }

          this.getList()
          this.dialogFormVisible = false

          this.$notify({
            title: 'Success',
            message: 'Created Successfully',
            type: 'success',
            duration: 2000
          })
          /*createArticle(tempData).then((response) => {

            this.getList()
            this.dialogFormVisible = false

            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })*/
        }
      })
    },
    handleUpdate(row) {      
      const token = getToken()
      this.temp.code = row.code
      this.temp.key = row.label.key
      this.temp.order = row.label.order
      this.temp.value = row.label.value
      this.temp.parentname = this.parentCodeOptions.find(el=>el.code==row.label.parent).name
      this.temp.parentcode = row.label.parent
      this.temp.languagecode = row.label.language
      this.temp.type = row.label.type
      this.temp.status = this.statusOptions.find(el=>el.code==row.label.status).name
       
      // this.temp = Object.assign({}, row) // copy obj
      // this.temp.timestamp = new Date(this.temp.timestamp)
      this.temp.token = token//'00000000-0000-0000-0000-000000000000'
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    async updateData() {
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid) {
          this.searchedParentName = ''
          const tempData = Object.assign({}, this.temp)
          const obj = this.statusOptions.find(el=>el.name==this.temp.status)
          if(obj === undefined){
            tempData.status = this.temp.status
          }else{
            tempData.status = obj.code
          }
          
          
            console.log(tempData)
          let response = await updatePermission(tempData)
          if (!response) {
            return
          }
          this.getList()
          this.dialogFormVisible = false

          this.$notify({
            title: 'Success',
            message: 'Update Successfully',
            type: 'success',
            duration: 2000
          })
          /*updateArticle(tempData).then(() => {

            this.getList()
            this.dialogFormVisible = false

            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })*/
        }
      })
    },
    handleDelete(code) {
      this.$confirm('Confirm to remove the role?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async() => {
          let response = await deletePermission({Code: code})
          if (!response) {
            return
          }
          this.getList()
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
        })
        .catch(err => { console.error(err) })
    },
    /* fetchData() {
      this.isListLoading = true
      getList().then(response => {
        console.log(response.data.items)
        // this.list = response.data.items
        this.list = [
          { id: 1, title: 'Admin', order: '1000' },
          { id: 2, title: 'Agent', order: '2000' },
          { id: 3, title: 'Sub', order: '3000' },
          { id: 4, title: 'Customer', order: '4000' },
          { id: 5, title: 'Demo', order: '5000' }]
        this.isListLoading = false
      })
    },*/
    filterNode(value, data) {
      if (!value) return true
      return data.label.name.indexOf(value) !== -1
    },
    show(data) {
      this.form.name = data.label.name
      this.form.type = data.label.type
      this.form.key = data.label.key
      this.form.value = data.label.value
      //this.form.sort = data.label.sort
      this.form.order = data.label.order
      this.$modal.show('edit-permission-modal')
    },
    showPermissions(data) {
      this.$modal.show('role-modal')
    },
    addPermission(data) {
      this.$modal.show('add-permission-modal')
    }
  }
}
</script>

<style>
.role-page .buttons-row .el-button {
  margin-bottom: 0px;
}

.role-page .block{
  background-color: transparent;
  -webkit-box-shadow: none;
  box-shadow: none;
}

.role-page .table-tree{
  border: none;
  border-radius: 5px;
    -webkit-box-shadow: 0px 0px 4.9px 0.1px rgb(151 164 193 / 20%);
    box-shadow: 0px 0px 4.9px 0.1px rgb(151 164 193 / 20%);
}

.role-page .custom-tree-node span:last-child div {
    font-size: 12px;
    padding: 24px 0;
}

.role-page .custom-tree-node span:first-child{
  font-size: 12px;
}

.role-page .el-tree-node__content {
    height: 40px;
    overflow: hidden;
}

.role-page .el-tree .el-tree-node[tabindex="-1"] .actions-title {
    padding: 24px 0px;
}

.role-page .el-select{
  width: 100%;
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
  margin: 10px 20px;
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

.el-tree .el-tree-node:first-child .custom-tree-node{
  font-weight: bold;
    color: rgba(0,0,0,0.45);
}

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

@media only screen and (max-width: 1100px) {
  .custom-tree-node span:first-child{
    width: 200px;
  }

  .el-tree-node__children div[tabindex="-1"]  span:first-child{
    width: 182px;
  }

  .el-tree-node__children div[tabindex="-1"] .el-tree-node__children div[tabindex="-1"] span:first-child{
    width: 164px;
  }

  .el-tree-node__children div[tabindex="-1"] .el-tree-node__children div[tabindex="-1"] .el-tree-node__children div[tabindex="-1"] span:first-child{
    width: 146px;
  }

  .el-tree-node__children div[tabindex="-1"] .el-tree-node__children div[tabindex="-1"] .el-tree-node__children div[tabindex="-1"] .el-tree-node__children div[tabindex="-1"] span:first-child{
    width: 128px;
  }

  .role-page .custom-tree-node span, .custom-tree-node div{
    overflow:hidden;
    text-overflow: ellipsis;    
  }

  .el-tree-node__children div[tabindex="-1"] .el-tree-node__children div[tabindex="-1"] .el-tree-node__children div[tabindex="-1"] .el-tree-node__children div[tabindex="-1"] .el-tree-node__children div[tabindex="-1"] span:first-child{
    width: 110px;
  }
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
</style>
