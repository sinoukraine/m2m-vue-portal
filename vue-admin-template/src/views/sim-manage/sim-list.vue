<template>
  <el-container class="with-panel-wrapper " :class="{'panel-opened': isRightPanelVisible}">
    <el-container class="page-fixed-height padding-vertical-x2">
      <el-main class="no-padding">
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
                <span>{{ row.rag }}</span>
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
        </div>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

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

export default {
  comments: {
    Pagination
  },
  directives: { waves },
  data() {
    return {
      checkboxICCID: true,
      checkboxMSSDN: true,
      checkboxBusinessUnit: true,
      checkboxCSP: true,
      checkboxState: true,
      checkboxRAG: true,
      checkboxSolution: true,
      checkboxAgent: true,
      checkboxCustomer: true,
      checkboxDataSession: true,
      checkboxDataUsage: true,
      checkboxSMSUsage: true,
      checkboxZeroSession: true,

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
        limit: 10,
        date1: '2020-10-29',
        date2: '2020-11-09',
        customer: '0',
        sort: '+code'
      },
      multipleSelection: [],



    }
  },
  created() {
    this.getList()
  },
/*  mounted(){

  },*/
  methods: {
    getList() {
      this.list = [
        {
          imsi: '123',
          iccid: '123',
          msisdn: '123',
          businessUnit: 'aus',
          csp: 'SP5',
          state: 'test',
          rag: 1,
          solution: 'Track',
          agent: 'atga',
          customer: 'atga',
          dataSession: '123',
          dataUsage: '123',
          smsUsage: '123',
          zeroSession: '123',
        },{
          imsi: '123',
          iccid: '123',
          msisdn: '123',
          businessUnit: 'aus',
          csp: 'SP5',
          state: 'test',
          rag: 1,
          solution: 'Track',
          agent: 'atga',
          customer: 'atga',
          dataSession: '123',
          dataUsage: '123',
          smsUsage: '123',
          zeroSession: '123',
        },
      ]
      this.listLoading = false;
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
