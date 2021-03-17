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
            <div>{{ node.label.sort }}</div>
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
            <el-form-item label="Parent" prop="parentcode">
              <el-select v-model="temp.parentcode" class="filter-item" placeholder="Please select">
                <el-option v-for="item in parentCodeOptions" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="Type" prop="category">
              <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
                <el-option v-for="item in typeOptions" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="Lang" prop="languagecode">
              <el-select v-model="temp.languagecode" class="filter-item" placeholder="Please select">
                <el-option v-for="item in languageCodeOptions" :key="item.code" :label="item.name" :value="item.code" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
          <el-form-item label="Key" prop="key">
            <el-input v-model="temp.key" />
          </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="Value" prop="value">
              <el-input v-model="temp.value" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="Status" prop="status">
              <el-input v-model="temp.status" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12">
            <el-form-item label="Order" prop="order">
              <el-input v-model="temp.order" />
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
      list: null,
      isListLoading: true,
      manageForm: 'Permissions',
      typeOptions,
      parentCodeOptions,
      languageCodeOptions,
      // sortOptions: [{ label: 'ID Ascending', code: '+code' }, { label: 'ID Descending', code: '-code' }],
      // statusOptions: ['A', 'V'],
      temp: {
        code: undefined,
        key: undefined,
        order: undefined,
        value: undefined,
        parentcode: '00000000-0000-0000-0000-000000000000',
        languagecode: '',
        type: '',
        status: 0
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
        Type: [{ required: true, message: 'type is required', trigger: 'change' }]
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
          sort: 'Status',
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
          //this.parentCodeOptions.push({ code: element1.code, name: element1.key })

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
              status: element1.Status
            }
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
            sort: element.Status,
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
          sort: response[0].Status,
          parent: response[0].ParentCode,
          language: response[0].LanguageCode,
          status: response[0].Status
        },
        children: firstLevelTree
      })

      /*fetchPermissionList(this.listQuery).then(response => {
        this.total = response.total
        setTimeout(() => {
          this.isListLoading = false
        }, 1.5 * 1000)

        this.data.length = 0
        this.data.push({
          code: '0',
          label: {
            name: 'Name',
            type: 'Type',
            key: 'Key',
            value: 'Value',
            sort: 'Status',
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
            //this.parentCodeOptions.push({ code: element1.code, name: element1.key })

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
                status: element1.Status
              }
            })
          })

          this.parentCodeOptions.push({code: element.Code, name: element.Key})
          firstLevelTree.push({
            code: element.code,
            label: {
              name: element.Key,
              type: element.Type,
              key: element.Key,
              value: element.Value,
              sort: element.Status,
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
            sort: response[0].Status,
            parent: response[0].ParentCode,
            language: response[0].LanguageCode,
            status: response[0].Status
          },
          children: firstLevelTree
        })
      })*/
    },
    resetTemp() {
      this.temp = {
        code: undefined,
        key: undefined,
        order: undefined,
        value: undefined,
        parentcode: '00000000-0000-0000-0000-000000000000',
        languagecode: '',
        type: '',
        status: 0
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
      this.temp.order = row.label.sort
      this.temp.value = row.label.value
      this.temp.parentcode = row.label.parent
      this.temp.languagecode = row.label.language
      this.temp.type = row.label.type
      this.temp.status = row.label.status
      // this.temp = Object.assign({}, row) // copy obj
      // this.temp.timestamp = new Date(this.temp.timestamp)
      this.temp.token = token//'00000000-0000-0000-0000-000000000000'
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
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
      this.form.sort = data.label.sort
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
