<template>
  <el-container class="chat-container">

    <el-container>
      <el-main>
        <div class="filter-container">
          <div class="buttons-row">
            <el-button v-waves :loading="downloadLoading" class="filter-item" type="outline" icon="el-icon-download"  @click="handleDownload" />

          </div>

          <!--<el-select v-model="listQuery.importance" placeholder="Type" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>-->
          <!--
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>-->

        </div>

        <el-row style="background:#fff;margin:16px 16px 0;padding:16px 16px 0;margin-bottom:32px;" class="bar-chart-container">
          <!--<line-chart :chart-data="lineChartData" />
          <apexchart type="bar" height="350" :options="chartOptions" :series="series"></apexchart>
          <line-chart :chart-data="datacollection" horizontal :styles="barStyles" :options="barOptions" />-->

          <div v-if="isChartShown" id="chart">
            <apexchart type="bar" :height="350" :options="chartOptions" :series="series" />
          </div>
        </el-row>

        <div class="table-wrapper">
          <el-table
            :key="tableKey"
            v-loading="listLoading"
            :data="list"

            fit
            highlight-current-row
            style="width: 100%;border-radius:5px"
            @sort-change="sortChange"
          >
            <!--<el-table-column label="ID" prop="id" align="center" width="180px">
          <template slot-scope="{row}">
            <span>{{ row.code }}</span>
          </template>
        </el-table-column>-->

            <el-table-column label="IMSI" fixed="left" sortable="custom" :class-name="getSortClass('imsi')" align="center" min-width="180px">
              <template slot-scope="{row}">
                <span>{{ row.imsi }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Customer" sortable="custom" :class-name="getSortClass('customer')" width="180px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.customer }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Data Usage(MB)" width="160px" align="center">
              <template slot-scope="{row}">
                <span>{{ (row.totalDataUsage/1000000).toFixed(3) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Flow Usage" width="160px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.totalFlowUsage }}</span>
              </template>
            </el-table-column>
            <el-table-column label="SMS Usage" width="160px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.totalSmsUsage }}</span>
              </template>
            </el-table-column>
            <el-table-column label="Days" width="160px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.days }}</span>
              </template>
            </el-table-column>
            <el-table-column label="LastUpdate" width="160px" align="center">
              <template slot-scope="{row}">
                <span>{{ row.lastUpdate.slice(0, 10) }}</span>
              </template>
            </el-table-column>
            <!--<el-table-column label="Actions" align="center" width="200" class-name="small-padding fixed-width">
              <template slot-scope="{row,$index}">
                <el-button type="primary" size="mini" @click="handleUpdate(row)">
                  Edit
                </el-button>
                <el-button v-if="row.Status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
                  Delete
                </el-button>
              </template>
            </el-table-column>-->
          </el-table>
        </div>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
          <el-form ref="dataForm" :rules="rules" :model="temp" label-position="top" label-width="70px">
            <el-row :gutter="16">
              <el-col :xs="24" :sm="12">
                <el-form-item label="Type" prop="category">
                  <el-select v-model="temp.Category" class="filter-item w-100" placeholder="Please select">
                    <el-option v-for="item in categoryTypeOptions" :key="item.code" :label="item.name" :value="item.code" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12">
                <el-form-item label="Key" prop="key">
                  <el-input v-model="temp.Key" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="16">
              <el-col :xs="24" :sm="12">
                <el-form-item label="En" prop="en">
                  <el-input v-model="temp.EN" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12">
                <el-form-item label="Es" prop="es">
                  <el-input v-model="temp.ES" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="16">
              <el-col :xs="24" :sm="12">
                <el-form-item label="Ru" prop="ru">
                  <el-input v-model="temp.RU" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12">
                <el-form-item label="De" prop="de">
                  <el-input v-model="temp.DE" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="16">
              <el-col :xs="24" :sm="12">
                <el-form-item label="Zh" prop="zh">
                  <el-input v-model="temp.ZH" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12">
                <el-form-item label="Pl" prop="pl">
                  <el-input v-model="temp.PL" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="16">
              <el-col :xs="24" :sm="12">
                <el-form-item label="Uk" prop="uk">
                  <el-input v-model="temp.UK" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12">
                <el-form-item label="Fr" prop="fr">
                  <el-input v-model="temp.FR" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="16">
              <el-col :xs="24" :sm="12">
                <el-form-item label="Pt" prop="pt">
                  <el-input v-model="temp.PT" />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12">
                <el-form-item label="Ar" prop="ar">
                  <el-input v-model="temp.AR" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="16">
              <el-col :xs="24" :sm="12">
                <el-form-item label="Be" prop="be">
                  <el-input v-model="temp.BE" />
                </el-form-item>
              </el-col>

            </el-row>

            <!--<el-row :gutter="16">
          <el-col :xs="24" :sm="12">
        <el-form-item label="Status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        </el-col>
        </el-row>-->
            <!--<el-row :gutter="16">
          <el-col :xs="24" :sm="12">
        <el-form-item label="Imp">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item>
        </el-col>
        </el-row>-->
            <el-row :gutter="16">
              <el-col :xs="24" :sm="12">
                <el-form-item label="Status" prop="status">
                  <el-select v-model="temp.Status" class="filter-item w-100" placeholder="Please select">
                    <el-option v-for="item in statusOptions" :key="item.code" :label="item.name" :value="item.code" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12">
                <el-form-item label="Remark">
                  <el-input v-model="temp.Description" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
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

        <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
          <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
            <el-table-column prop="key" label="Channel" />
            <el-table-column prop="pv" label="Pv" />
          </el-table>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
          </span>
        </el-dialog>
      </el-main>

    </el-container>
    <el-aside width="250px" style="" class="chat-sidebar">
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-form ref="listQuery" :model="listQuery" label-position="top" class="form-padding">
          <el-row :gutter="16" style="border-bottom: 1px solid #e3e3e3">
            <el-col :xs="100" :sm="100" :md="100" :lg="100">
              <el-form-item label="" prop="title">
                <span class="label-span">Report</span>
                <el-select v-model="categoryTypeOptions[0]" placeholder="Report" clearable class="filter-item w-100" style="width: 100%;">
                  <el-option v-for="item in categoryTypeOptions" :key="item.code" :label="item.name" :value="item.code" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16" style="border-bottom: 1px solid #e3e3e3">
            <el-col :xs="100" :sm="100" :md="100" :lg="100">
              <el-form-item label="" prop="title">
                <span class="label-span">Start date</span>
                <el-date-picker v-model="listQuery.date1" value-format="yyyy-MM-dd" type="date" placeholder="Pick a date" style="width: 100%;" />
                <span class="label-span">End date</span>
                <el-date-picker v-model="listQuery.date2" value-format="yyyy-MM-dd" type="date" placeholder="Pick a date" style="width: 100%;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16" style="">
            <el-col :xs="100" :sm="100" :md="100" :lg="100">
              <el-form-item label="" prop="title">
                <span class="label-span">Master</span>
                <el-select v-model="categoryTypeOptions1[0]" placeholder="Report" clearable class="filter-item w-100" style="width: 100%;">
                  <el-option v-for="item in categoryTypeOptions1" :key="item.code" :label="item.name" :value="item.code" />
                </el-select>
                <span class="label-span">Customer</span>
                <el-select v-model="selectedCustomer" placeholder="Report" clearable class="filter-item w-100" style="width: 100%;">
                  <el-option v-for="item in categoryTypeOptions2" :key="item.code" :label="item.name" :value="item.code" />
                </el-select>
                <span class="label-span">IMSI</span>
                <el-input placeholder="" class="filter-item" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16" style="padding: 10px 0px 20px;">
            <el-col :xs="100" :sm="100" :md="100" :lg="100">
              <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" style="width:100%" @click="handleFilter">
                Search
              </el-button>
            </el-col>
          </el-row>
        </el-form>
        <!--<el-form ref="listQuery" :model="listQuery" label-position="top" class="form-padding">
          <el-row :gutter="16">
            <el-col :xs="100" :sm="100" :md="100" :lg="100">
              <el-form-item label="Minimize panel" prop="title">
                <span class="label-span">Report</span>
                <el-select v-model="listQuery.category" placeholder="Report" clearable class="filter-item w-100">
                  <el-option v-for="item in categoryTypeOptions" :key="item.code" :label="item.name" :value="item.code" />
                </el-select>
              </el-form-item>
            </el-col>

          </el-row>
          <el-row :gutter="16">
            <el-col :xs="100" :sm="100" :md="100" :lg="100">
              <el-form-item label="" prop="title">
                <el-input v-model="listQuery.key" placeholder="IMSI" class="filter-item" @keyup.enter.native="handleFilter" />
              </el-form-item>
            </el-col>

          </el-row>
          <el-row :gutter="16">

            <el-col :xs="100" :sm="100" :md="100" :lg="100">
              <el-form-item label="" prop="title">
                <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
                  Search
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>-->
      </el-scrollbar>
      <el-footer>
        <!--<el-input v-model="inputCommand" placeholder="Command" class="input-with-select">

          <el-dropdown slot="prepend" trigger="click">
            <i class="el-icon-menu" />
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>Option 1</el-dropdown-item>
              <el-dropdown-item>Option 2</el-dropdown-item>
              <el-dropdown-item>Option 3</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button slot="append" icon="el-icon-s-promotion" />
        </el-input>-->
      </el-footer>

    </el-aside>
  </el-container>

</template>

<script>
import { getCDRSList, getCustomerList, fetchPv, createArticle, updateArticle, deleteArticle } from '@/api/sim'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import LineChart from './components/LineChart.js'
import VueApexCharts from 'vue-apexcharts'

const categoryTypeOptions = [
  { code: 'Event', name: 'Data Usage' }
]
const categoryTypeOptions1 = [
  { code: 'Event', name: 'M2MData' }
]
const categoryTypeOptions2 = [
  { code: '0', name: 'All' }
]

const statusOptions = [
  { code: 'A', name: 'A' },
  { code: 'V', name: 'V' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const categoryTypeKeyValue = categoryTypeOptions.reduce((acc, cur) => {
  acc[cur.code] = cur.name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: {
    Pagination,
    LineChart,
    apexchart: VueApexCharts
  },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return categoryTypeKeyValue[type]
    }
  },  
  data() {
    return {
      selectedCustomer: '0',
      isChartShown: false,
      series: [{
        data: []
      }],
      chartOptions: {
      },
      datacollection: null,
      barOptions: {
        type: 'horizontalBar',
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }]
        },
        responsive: true,
        maintainAspectRatio: false
      },
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        date1: '2020-10-29',
        date2: '2020-11-09',
        customer: '0',
        sort: '+code'
      },
      categoryTypeOptions,
      categoryTypeOptions1,
      categoryTypeOptions2,
      statusOptions,
      // sortOptions: [{ label: 'ID Ascending', code: '+code' }, { label: 'ID Descending', code: '-code' }],
      // statusOptions: ['A', 'V'],
      showAdditionalInfo: false,
      temp: {
        Code: undefined,
        Key: undefined,
        En: undefined,
        UK: undefined,
        ES: undefined,
        RU: undefined,
        PL: undefined,
        PT: undefined,
        FR: undefined,
        DE: undefined,
        BE: undefined,
        AR: undefined,
        Status: 'A',
        Category: 'Event'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        Category: [{ required: true, message: 'category type is required', trigger: 'change' }]
        // timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        // title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  computed: {
    barTypes() {
      return {
        type: 'horizontalBar'
      }
    },
    barStyles() {
      return {

        type: 'horizontalBar',
        position: 'relative',
        height: '30vh'
      }
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.fillData()
    // var chart = new ApexCharts(document.querySelector("#chart"), options);

    // chart.render()
  },
  methods: {
    fillData() {
      this.datacollection = {
        labels: ['jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec', 'jan', 'fab', 'mar', 'apr', 'may', 'jun', 'jul'],
        plotOptions: {
          bar: {
            horizontal: true
          }
        },
        datasets: [
          {
            label: 'Activations',
            backgroundColor: '#f87979',
            data: [100, 120, 161, 134, 105, 160, 165, 105, 100, 181, 114, 115, 169, 165]
          }
          /*, {
              label: 'Data Volume',
              backgroundColor: '#f87979',
              data: [this.getRandomInt(), this.getRandomInt()]
            }*/
        ]
      }
    },
    getRandomInt() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5
    },
    getList() {
      this.listLoading = true

      getCustomerList().then(response => {
        this.categoryTypeOptions2.length = 0
        this.categoryTypeOptions2.push({ code: '0', name: 'All' })
        response.data.forEach(element => {
          this.categoryTypeOptions2.push({ code: element._id, name: element.info.name })
        })
      })

      getCDRSList(this.listQuery).then(response => {
        this.total = response.data.length
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)

        const arrLabel = []
        const arrData = []
        response.data.forEach(element => {
          arrLabel.push(element.imsi)
          arrData.push((element.totalDataUsage / 1000000).toFixed(3))
        })
        this.chartOptions = {
          chart: {
            type: 'bar',
            height: 350,
            offsetX: 0

          },
          plotOptions: {
            bar: {
              horizontal: true
            }
          },
          dataLabels: {
            enabled: false
          },
          grid: {
            show: false,
            xaxis: {
              categories: arrLabel,
              lines: {
                show: false
              }
            },
            yaxis: {
              lines: {
                show: false
              }
            }
          },
          xaxis: {
            categories: arrLabel
          }
        }

        this.series = [{
          data: arrData
        }]

        this.isChartShown = true

        this.list = response.data
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.listQuery.customer = this.selectedCustomer
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
        Code: undefined,
        Key: undefined,
        EN: undefined,
        UK: undefined,
        ES: undefined,
        RU: undefined,
        PL: undefined,
        PT: undefined,
        FR: undefined,
        DE: undefined,
        BE: undefined,
        AR: undefined,
        Status: 'A',
        Category: 'Event'
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
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          delete tempData.Code
          tempData.token = '00000000-0000-0000-0000-000000000000'
          createArticle(tempData).then((response) => {
            // console.log(response)
            this.temp.Code = response.Data.Code
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      // this.temp.timestamp = new Date(this.temp.timestamp)
      this.temp.token = '00000000-0000-0000-0000-000000000000'
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
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
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['imsi', 'customer', 'totalDataUsage', 'totalFlowUsage', 'totalSmsUsage', 'days', 'lastUpdate']
        const filterVal = ['imsi', 'customer', 'totalDataUsage', 'totalFlowUsage', 'totalSmsUsage', 'days', 'lastUpdate']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'data-usage-report'
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

<style lang="scss">
  .rotate-90{
    transform: rotate(90deg);
  }
  .chat-container{
    position: relative;
    height: calc(100vh - 50px);
    width: 100%;
  }
    .chat-sidebar{
      background-color: rgb(255, 255, 255);
      color: #333;

      -webkit-box-shadow: 0 1px 4px rgba(0,21,41,0.08);
      box-shadow: 0 1px 4px rgba(0,21,41,0.08);
    }
      .sidebar-header{
        height: 50px;
        line-height: 50px;
        overflow: hidden;
        position: relative;
        background: #fff;
        -webkit-box-shadow: 0 1px 4px rgba(0,21,41,0.08);
        box-shadow: 0 1px 4px rgba(0,21,41,0.08);
        z-index: 1;
        padding-left: 16px;
        padding-right: 16px;
      }
  .list{
    list-style: none;
    position: relative;
    margin: 0;
    padding-left: 0;
    background-color: #fff;
    border: none;
    height: 100%;
    width: 100%!important;
    font-size: 14px;

    .item-content{
      box-sizing: border-box;
      padding-left: 16px;
      min-height: 48px;
      display: -webkit-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      -webkit-box-pack: justify;
      -ms-flex-pack: justify;
      -webkit-justify-content: space-between;
      justify-content: space-between;
      -webkit-box-align: center;
      -ms-flex-align: center;
      -webkit-align-items: center;
      align-items: center;

      .item-append{
        display: -webkit-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -webkit-box-flex: 0;
        -webkit-flex-shrink: 0;
        -ms-flex: 0 0 auto;
        flex-shrink: 0;
        -webkit-box-lines: single;
        -moz-box-lines: single;
        -webkit-flex-wrap: nowrap;
        -ms-flex-wrap: none;
        -ms-flex-wrap: nowrap;
        flex-wrap: nowrap;
        -webkit-box-align: center;
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
        box-sizing: border-box;
        padding-top: 8px;
        padding-bottom: 8px;
        min-width: 40px;
      }
      .item-inner{
        padding-right: 16px;
        position: relative;
        width: 100%;
        padding-top: 8px;
        padding-bottom: 8px;
        min-height: 48px;
        box-sizing: border-box;
        -webkit-box-flex: 1;
        -ms-flex: 1;
        min-width: 0;
        display: -webkit-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        -webkit-justify-content: space-between;
        justify-content: space-between;
        -webkit-box-align: center;
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
        -ms-flex-item-align: stretch;
        -webkit-align-self: stretch;
        align-self: stretch;

        .item-title{
          min-width: 0;
          -webkit-box-flex: 1;
          -webkit-flex-shrink: 1;
          -ms-flex: 0 1 auto;
          flex-shrink: 1;
          white-space: nowrap;
          position: relative;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }

        .item-after{
          white-space: nowrap;
          color: #757575;
          -webkit-box-flex: 0;
          -webkit-flex-shrink: 0;
          -ms-flex: 0 0 auto;
          flex-shrink: 0;
          margin-left: 8px;
          display: -webkit-box;
          display: -ms-flexbox;
          display: -webkit-flex;
          display: flex;
          max-height: 28px;
          font-size: 14px;
        }
      }

    }

  }
  .messages{
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    min-height: 100%;
    position: relative;
    z-index: 1;

    .messages-title{
      text-align: center;
      width: 100%;
      line-height: 1;

      font-size: 12px;
      color: rgba(0,0,0,.51);
      margin-top: 16px;
    }
    .message {
      max-width: 70%;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: end;
      -webkit-align-items: flex-end;
      -ms-flex-align: end;
      align-items: flex-end;
      position: relative;
      z-index: 1;
      -webkit-transform: translate3d(0,0,0);
      transform: translate3d(0,0,0);

      margin-top: 16px;

      &.message-sent {
        text-align: right;
        -webkit-box-orient: horizontal;
        -webkit-box-direction: reverse;
        -webkit-flex-direction: row-reverse;
        -ms-flex-direction: row-reverse;
        flex-direction: row-reverse;
        -webkit-align-self: flex-end;
        -ms-flex-item-align: end;
        align-self: flex-end;

        margin-right: 8px;

        .message-content {
          -webkit-box-align: end;
          -webkit-align-items: flex-end;
          -ms-flex-align: end;
          align-items: flex-end;
        }
        .message-from+.message-content {
          margin-right: 8px;
        }

        .message-bubble {
          color: #333;
          background: #c8e6c9;
        }
        &.message-tail .message-bubble:before {
          position: absolute;
          content: '';
          border-right: 8px solid transparent;
          border-left: 0 solid transparent;
          border-bottom: 8px solid #c8e6c9;
          left: 100%;
          bottom: 0;
          width: 0;
          height: 0;
        }
      }

      &.message-received {
        -webkit-box-orient: horizontal;
        -webkit-box-direction: normal;
        -webkit-flex-direction: row;
        -ms-flex-direction: row;
        flex-direction: row;

        margin-left: 8px;

        .message-content {
          -webkit-box-align: start;
          -webkit-align-items: flex-start;
          -ms-flex-align: start;
          align-items: flex-start;
        }

        .message-from+.message-content {
          margin-left: 8px;
        }

        .message-bubble {
          color: #333;
          background: #ccc;
        }
        &.message-tail .message-bubble:before {
          position: absolute;
          content: '';
          border-left: 8px solid transparent;
          border-right: 0 solid transparent;
          border-bottom: 8px solid #ccc;
          right: 100%;
          bottom: 0;
          width: 0;
          height: 0;
        }
      }

      .message-from {
        /*border-radius: 50%;*/
        position: relative;
        background-size: cover;
        -webkit-align-self: flex-end;
        -ms-flex-item-align: end;
        align-self: flex-end;
        -webkit-flex-shrink: 0;
        -ms-flex-negative: 0;
        flex-shrink: 0;
      }

      .message-content {
        position: relative;
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -webkit-flex-direction: column;
        -ms-flex-direction: column;
        flex-direction: column;

        .message-footer, .message-header {
          line-height: 1;
          font-size: 12px;

          color: rgba(0,0,0,.51);
        }
        .message-header{
          margin-bottom: 2px;
        }
        .message-footer {
          font-size: 11px;
          margin-bottom: -1em;

          margin-top: 2px;
        }

        .message-bubble {
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          word-break: break-word;
          display: -webkit-box;
          display: -webkit-flex;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-orient: vertical;
          -webkit-box-direction: normal;
          -webkit-flex-direction: column;
          -ms-flex-direction: column;
          flex-direction: column;
          position: relative;
          line-height: 1.2;

          font-size: 16px;
          border-radius: 2px;
          padding: 6px 8px;
          min-height: 32px;

          .message-text-footer, .message-text-header {
            font-size: 12px;
            line-height: 1;

            color: rgba(0,0,0,.51);
          }
          .message-text-header {
            margin-bottom: 4px;
          }
          .message-text-footer {
            margin-top: 4px;
          }
          .message-text {
            text-align: left;
          }
        }
      }
    }
  }

</style>

<style scoped>
.label-span{
  color: #9a9a9a;
  font-size: 12px;
}
.el-container{
  background-color: #f2f5fb !important;
}

.el-button--outline{
  border: none;
      -webkit-box-shadow: 0 1px 1px rgba(0,11,5,0.08);
      box-shadow: 0 1px 1px rgba(0,11,5,0.08);
}

.pagination-container{
  margin: 15px;
  border-radius: 5px;
}

.el-footer{
    bottom: 0;
    position: absolute;
}

.bar-chart-container {
    border-radius: 5px;
}

.bar-chart-container .apexcharts-toolbar {
    display: none;
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
</style>
