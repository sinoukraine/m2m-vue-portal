<template>
  <el-container class="with-panel-wrapper " :class="{'panel-opened': isRightPanelVisible}">    
    <el-container class="page-fixed-height padding-vertical-x2">
      <el-main v-if="isProfile" class="no-padding">
        <div class="mixin-components-container" style="padding: 0 20px">
          <el-row>
            <el-card class="box-card">              
              <div style="margin-bottom:50px;">
                <el-form ref="dataForm"  label-position="top" label-width="70px">
                  <el-row :gutter="16">
                    <el-col :xs="24" :sm="12">
                      <el-form-item label="IMSI" prop="category">
                        <el-select class="filter-item w-100" placeholder="Please select">
                          <el-input  />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12">
                      <el-form-item label="ICCID" prop="key">
                        <el-input  />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="16">
                    <el-col :xs="24" :sm="12">
                      <el-form-item label="MSISDN" prop="category">
                        <el-select class="filter-item w-100" placeholder="Please select">
                          <el-input  />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12">
                      <el-form-item label="IMEI" prop="key">
                        <el-input  />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="16">
                    <el-col :xs="24" :sm="12">
                      <el-form-item label="Bussiness Unit" prop="category">
                        <el-select class="filter-item w-100" placeholder="Please select">
                          <el-option  />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12">
                      <el-form-item label="CSP" prop="key">
                        <el-select class="filter-item w-100" placeholder="Please select">
                          <el-option  />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="16">
                    <el-col :xs="24" :sm="12">
                      <el-form-item label="State" prop="category">
                        <el-select class="filter-item w-100" placeholder="Please select">
                          <el-option  />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12">
                      <el-form-item label="Solution" prop="key">
                        <el-select class="filter-item w-100" placeholder="Please select">
                          <el-option  />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row :gutter="16">
                    <el-col :xs="24" :sm="12">
                      <el-form-item label="Agent" prop="category">
                        <el-select class="filter-item w-100" placeholder="Please select">
                          <el-option  />
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :xs="24" :sm="12">
                      <el-form-item label="Customer" prop="key">
                        <el-select class="filter-item w-100" placeholder="Please select">
                          <el-option  />
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
            </el-card>
          </el-row>
        </div>
      </el-main>
      <el-main  v-else class="no-padding">
        <div class="filter-container ">
          <div class="display-flex justify-content-between">
            <div class="buttons-row">
              <el-button v-waves class="button-custom" icon="el-icon-switch-button">{{ $t('ACTIVATION') }}</el-button>
              <el-button v-waves class="button-custom" icon="el-icon-set-up">{{ $t('STATE') }}</el-button>
              <el-button v-waves class="button-custom" icon="el-icon-rank">{{ $t('MOVE_SIM') }}</el-button>
              <el-button v-waves class="button-custom" icon="el-icon-collection-tag">{{ $t('CSP') }}</el-button>
              <el-button v-waves class="button-custom" icon="el-icon-user">{{ $t('AGENT') }}</el-button>
              <el-button v-waves class="button-custom" icon="el-icon-link">{{ $t('SOLUTION') }}</el-button>
            </div>
            <div class="buttons-row white-space-nowrap">
              <el-button v-waves class="button-custom" type="primary" icon="el-icon-refresh-right" />
              <el-button v-waves class="button-custom" type="primary" icon="el-icon-download" />
            </div>
          </div>
          <div class="buttons-row">
            <el-checkbox v-model="checkboxICCID">{{ $t('ICCID') }}</el-checkbox>
            <el-checkbox v-model="checkboxMSSDN">{{ $t('MSISDN') }}</el-checkbox>
            <el-checkbox v-model="checkboxBusinessUnit">{{ $t('BUSINESS_UNIT') }}</el-checkbox>
            <el-checkbox v-model="checkboxCSP">{{ $t('CSP') }}</el-checkbox>
            <el-checkbox v-model="checkboxState">{{ $t('STATE') }}</el-checkbox>
            <el-checkbox v-model="checkboxRAG">{{ $t('RAG') }}</el-checkbox>
            <el-checkbox v-model="checkboxSolution">{{ $t('SOLUTION') }}</el-checkbox>
            <el-checkbox v-model="checkboxAgent">{{ $t('AGENT') }}</el-checkbox>
            <el-checkbox v-model="checkboxCustomer">{{ $t('CUSTOMER') }}</el-checkbox>
            <el-checkbox v-model="checkboxDataSession">{{ $t('DATA_SESSION') }}</el-checkbox>
            <el-checkbox v-model="checkboxDataUsage">{{ $t('DATA_USAGE') }}</el-checkbox>
            <el-checkbox v-model="checkboxSMSUsage">{{ $t('SMS_USAGE') }}</el-checkbox>
            <el-checkbox v-model="checkboxZeroSession">{{ $t('ZERO_SESSION') }}</el-checkbox>
          </div>
        </div>
        <div class="table-wrapper">
          <el-table
            :key="tableKey"
            v-loading="listLoading"
            :data="list"

            fit
            @sort-change="sortChange"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column :label="$t('IMSI')"  fixed="left" sortable="custom" :class-name="getSortClass('imsi')" align="left" min-width="180px">
              <template slot-scope="{row}">
                <span>{{ row.imsi }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="checkboxICCID" :label="$t('ICCID')" sortable="custom" :class-name="getSortClass('iccid')" align="left" min-width="180px">
              <template slot-scope="{row}">
                <span>{{ row.iccid }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="checkboxMSSDN" :label="$t('MSISDN')" sortable="custom" :class-name="getSortClass('msisdn')" align="left" min-width="180px">
              <template slot-scope="{row}">
                <span>{{ row.msisdn }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="checkboxBusinessUnit" :label="$t('BUSINESS_UNIT')" sortable="custom" :class-name="getSortClass('businessUnit')" align="left" min-width="180px">
              <template slot-scope="{row}">
                <span>{{ row.businessUnit }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="checkboxCSP" :label="$t('CSP')" sortable="custom" :class-name="getSortClass('csp')" align="left" min-width="180px">
              <template slot-scope="{row}">
                <span>{{ row.csp }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="checkboxState" :label="$t('STATE')" sortable="custom" :class-name="getSortClass('state')" align="left" min-width="180px">
              <template slot-scope="{row}">
                <span>{{ row.state }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="checkboxRAG" :label="$t('RAG')" sortable="custom" :class-name="getSortClass('rag')" align="left" min-width="180px">
              <template slot-scope="{row}">
                <span :style="'font-size:2em;color:'+row.rag">&#x025FC;</span>
              </template>
            </el-table-column>
            <el-table-column v-if="checkboxSolution" :label="$t('SOLUTION')" sortable="custom" :class-name="getSortClass('solution')" align="left" min-width="180px">
              <template slot-scope="{row}">
                <span>{{ row.solution }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="checkboxAgent" :label="$t('AGENT')" sortable="custom" :class-name="getSortClass('agent')" align="left" min-width="180px">
              <template slot-scope="{row}">
                <span>{{ row.agent }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="checkboxCustomer" :label="$t('CUSTOMER')" sortable="custom" :class-name="getSortClass('customer')" align="left" min-width="180px">
              <template slot-scope="{row}">
                <span>{{ row.customer }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="checkboxDataSession" :label="$t('DATA_SESSION')" sortable="custom" :class-name="getSortClass('dataSession')" align="left" min-width="180px">
              <template slot-scope="{row}">
                <span>{{ row.dataSession }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="checkboxDataUsage" :label="$t('DATA_USAGE')" sortable="custom" :class-name="getSortClass('dataUsage')" align="left" min-width="180px">
              <template slot-scope="{row}">
                <span>{{ row.dataUsage }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="checkboxSMSUsage" :label="$t('SMS_USAGE')" sortable="custom" :class-name="getSortClass('smsUsage')" align="left" min-width="180px">
              <template slot-scope="{row}">
                <span>{{ row.smsUsage }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="checkboxZeroSession" :label="$t('ZERO_SESSION')" sortable="custom" :class-name="getSortClass('zeroSession')" align="left" min-width="180px">
              <template slot-scope="{row}">
                <span>{{ row.zeroSession }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="checkboxICCID" :label="$t('ACTIONS')" fixed="right" align="center" width="100" class-name="small-padding fixed-width">
              <template slot-scope="{row}">
                <el-button type="primary" size="mini" @click="handleUpdate(row)">
                  Edit
                </el-button>
                <!--<el-button v-if="row.Status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
                  Delete
                </el-button>-->
              </template>
            </el-table-column>
          </el-table> 
          
          <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.pageSize" @pagination="getList" />
   
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
            <label v-waves :for="filterSubmitId" class="el-button el-button--primary width-100 ">
              <i class="el-icon-search"></i>
              <span>{{ $t('SEARCH') }}</span>
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
          <div class="padding-horizontal-x2">
            <el-row :gutter="16" style="">
              <el-col :xs="100">
                <el-form-item :label="$t('IMSI')" prop="title" class="no-margin-bottom">
                  <el-input placeholder="" class="filter-item" />
                </el-form-item>
                <el-form-item :label="$t('MSISDN')" prop="title" class="no-margin-bottom">
                  <el-input placeholder="" class="filter-item" />
                </el-form-item>
                <el-form-item :label="$t('ICCID')" prop="title" class="no-margin-bottom">
                  <el-input placeholder="" class="filter-item" />
                </el-form-item>
                <el-form-item :label="$t('SOLUTION')" prop="title" class="no-margin-bottom">
                  <el-select v-model="solutionsArr[0]" :placeholder="$t('SOLUTION')" class="">
                    <el-option v-for="item in solutionsArr" :key="item.code" :label="item.name" :value="item.code" />
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('AGENT')" prop="title" class="no-margin-bottom">
                  <el-select v-model="agentsArr[0]" :placeholder="$t('AGENT')" class="">
                    <el-option v-for="item in agentsArr" :key="item.code" :label="item.name" :value="item.code" />
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('CUSTOMER')" prop="title" class="">
                  <el-select v-model="customersArr[0]" :placeholder="$t('CUSTOMER')" class="">
                    <el-option v-for="item in customersArr" :key="item.code" :label="item.name" :value="item.code" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="content-divider"></div>
          <div class="padding-horizontal-x2">
            <el-row :gutter="16" style="">
              <el-col :xs="100">
                <el-form-item :label="$t('RAG')" prop="title" class="">
                  <el-checkbox><span class="rag bg-color-red"></span></el-checkbox>
                  <el-checkbox><span class="rag bg-color-yellow"></span></el-checkbox>
                  <el-checkbox><span class="rag bg-color-green"></span></el-checkbox>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="content-divider"></div>
          <div class="padding-horizontal-x2">
            <el-form-item :label="$t('STATE')" prop="title" class="">
              <el-row :gutter="16" style="">
                <el-col :span="12">
                  <el-checkbox>{{ $t('DELETED') }}</el-checkbox>
                </el-col>
                <el-col :span="12">
                  <el-checkbox>{{ $t('DELETING') }}</el-checkbox>
                </el-col>
                <el-col :span="12">
                  <el-checkbox>{{ $t('ON_STOCK') }}</el-checkbox>
                </el-col>
                <el-col :span="12">
                  <el-checkbox>{{ $t('PRODUCTIVE') }}</el-checkbox>
                </el-col>
                <el-col :span="12">
                  <el-checkbox>{{ $t('SUSPENDED') }}</el-checkbox>
                </el-col>
                <el-col :span="12">
                  <el-checkbox>{{ $t('TEST') }}</el-checkbox>
                </el-col>
                <el-col :span="12">
                  <el-checkbox>{{ $t('TEST_END') }}</el-checkbox>
                </el-col>
                <el-col :span="12">
                  <el-checkbox>{{ $t('TEST_PRODUCTIVE') }}</el-checkbox>
                </el-col>
              </el-row>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </el-aside>
  </el-container>

</template>

<script>
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

import { getSIMListAsync, getSIMAsync } from '@/api/sim'
import moment from 'moment'

export default {
  components: {
    Pagination
  },
  directives: { waves },
  data() {
    return {
      checkboxICCID: false,
      checkboxMSSDN: false,
      checkboxBusinessUnit: false,
      checkboxCSP: true,
      checkboxState: true,
      checkboxRAG: true,
      checkboxSolution: false,
      checkboxAgent: false,
      checkboxCustomer: true,
      checkboxDataSession: true,
      checkboxDataUsage: true,
      checkboxSMSUsage: true,
      checkboxZeroSession: false,
      isProfile: false,
      isRightPanelVisible: true,
      filterSubmitId: Date.now(),
      solutionsArr: [
        { code: '1', name: 'Track' }
      ],
      agentsArr: [
        { code: '1', name: 'Agent' }
      ],
      customersArr: [
        { code: '1', name: 'Customer' }
      ],
      tableKey: 0,
      total: 0,
      listLoading: true,
      list: [],
      listQuery: {
        page: 1,
        pageSize: 10,
        date1: '2020-10-29',
        date2: '2020-11-09',
        customer: undefined,
        sort: '+code'
      },
      multipleSelection: [],
    }
  },
  created() {
    this.isProfile = this.$route.params.id ? true : false
    if(this.isProfile){
      this.isRightPanelVisible = false
    }else{
      this.getList()
    }
  },
/*  mounted(){

  },*/
  methods: {
    async getList() {
      const arr = []
      const currentTime = moment()
      const oneDayAgo = moment(currentTime, 'YYYY-MM-DD').add(-1, 'days').format('YYYY-MM-DD')
      const threeDayAgo = moment(currentTime, 'YYYY-MM-DD').add(-3, 'days').format('YYYY-MM-DD')

      const response = await getSIMListAsync(this.listQuery)
      response.data.rows.forEach(async element => {    
        const query = {
          id: element._id,
          activity: true,
          states: true,
          ancestors: true 
        }
        const response_1 = await getSIMAsync(query)  
        let flowField = 0
        let smsField = 0
        let totalField = 0
        let dataSessions = 0

        console.log(response_1)
        const customer = response_1.data.ancestors[0].info.name
        const state = response_1.data.extra.states.current
        const csp = response_1.data.extra.states.csp
        const activityArr = response_1.data.extra.activity.samples
        let rag = ''
        /*if (response_1.data.extra.activity.totals != null && response_1.data.extra.activity.totals.flow != null){
          flowField += +response_1.data.extra.activity.totals.flow.originalUnits
        }*/
        if (response_1.data.extra.activity.totals != null && response_1.data.extra.activity.totals.sms != null){
          smsField += +response_1.data.extra.activity.totals.sms.originalUnits
        }
        if (response_1.data.extra.activity.totals != null && response_1.data.extra.activity.totals.data != null && response_1.data.extra.activity.totals.data.originalUnits != null){
          totalField += +response_1.data.extra.activity.totals.data.originalUnits
        }
        if(typeof activityArr == 'undefined'){
            rag = 'rgb(204,204,204)'
        }else{
          activityArr.forEach(element_1 => {
            if(element_1.hasOwnProperty('originalUnits')){
              dataSessions += +element_1.originalUnits
            }
          })
          const simActivityTime = moment(activityArr[activityArr.length - 1].endTime, 'YYYY-MM-DD').format('YYYY-MM-DD');
          if(simActivityTime >= oneDayAgo){
            rag = 'rgb(57,181,74)'
          }else if(simActivityTime >= threeDayAgo){
            rag = '#ff8c00'
          }else{
            rag = '#CD3333'
          }
        }
        
        arr.push({
          imsi: element.info.imsi,
          iccid: element.info.iccid,
          msisdn: element.info.msisdn,
          businessUnit: 'aus',
          csp,
          state,
          rag,
          solution: 'Track',
          agent: 'M2M Data',
          customer,
          dataSession: dataSessions,
          dataUsage: totalField,
          smsUsage: smsField,
          zeroSession: '0',
        })
      })
      
      this.total = response.data.total     
      setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000) 
      this.list = arr
    },

    sortChange(data) {
      /*const { prop, order } = data
      if (prop === 'code') {
        this.sortByID(order)
      }*/
    },
    /*sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+code'
      } else {
        this.listQuery.sort = '-code'
      }
      this.handleFilter()
    },*/
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    },
    handleUpdate(row) {

    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleFilter() {
      console.log('submitted')
    }
  }
}
</script>
