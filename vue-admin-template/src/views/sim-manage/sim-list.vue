<template>
  <div class="app-container">
    <div class="filter-container">
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
        highlight-current-row
        @sort-change="sortChange"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column :label="$t('IMSI')" fixed="left" sortable="custom" :class-name="getSortClass('imsi')" align="left" min-width="180px">
          <template slot-scope="{row}">
            <span>{{ row.imsi }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('ICCID')" sortable="custom" :class-name="getSortClass('iccid')" align="left" min-width="180px">
          <template slot-scope="{row}">
            <span>{{ row.iccid }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('MSISDN')" sortable="custom" :class-name="getSortClass('msisdn')" align="left" min-width="180px">
          <template slot-scope="{row}">
            <span>{{ row.msisdn }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('BUSINESS_UNIT')" sortable="custom" :class-name="getSortClass('businessUnit')" align="left" min-width="180px">
          <template slot-scope="{row}">
            <span>{{ row.businessUnit }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('CSP')" sortable="custom" :class-name="getSortClass('csp')" align="left" min-width="180px">
          <template slot-scope="{row}">
            <span>{{ row.csp }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('STATE')" sortable="custom" :class-name="getSortClass('state')" align="left" min-width="180px">
          <template slot-scope="{row}">
            <span>{{ row.state }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('RAG')" sortable="custom" :class-name="getSortClass('rag')" align="left" min-width="180px">
          <template slot-scope="{row}">
            <span>{{ row.rag }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('SOLUTION')" sortable="custom" :class-name="getSortClass('solution')" align="left" min-width="180px">
          <template slot-scope="{row}">
            <span>{{ row.solution }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('AGENT')" sortable="custom" :class-name="getSortClass('agent')" align="left" min-width="180px">
          <template slot-scope="{row}">
            <span>{{ row.agent }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('CUSTOMER')" sortable="custom" :class-name="getSortClass('customer')" align="left" min-width="180px">
          <template slot-scope="{row}">
            <span>{{ row.customer }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('DATA_SESSION')" sortable="custom" :class-name="getSortClass('dataSession')" align="left" min-width="180px">
          <template slot-scope="{row}">
            <span>{{ row.dataSession }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('DATA_USAGE')" sortable="custom" :class-name="getSortClass('dataUsage')" align="left" min-width="180px">
          <template slot-scope="{row}">
            <span>{{ row.dataUsage }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('SMS_USAGE')" sortable="custom" :class-name="getSortClass('smsUsage')" align="left" min-width="180px">
          <template slot-scope="{row}">
            <span>{{ row.smsUsage }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('ZERO_SESSION')" sortable="custom" :class-name="getSortClass('zeroSession')" align="left" min-width="180px">
          <template slot-scope="{row}">
            <span>{{ row.zeroSession }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('ACTIONS')" fixed="right" align="center" width="100" class-name="small-padding fixed-width">
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
  </div>
</template>

<script>
export default {
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

      tableKey: 0,
      listLoading: true,
      list: null,
      listQuery: {
        page: 1,
        limit: 10,
        date1: '2020-10-29',
        date2: '2020-11-09',
        customer: '0',
        sort: '+code'
      },
      multipleSelection: []
    }
  },
  created() {
    this.getList()
  },
/*  mounted(){

  },*/
  methods: {
    getList() {
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
    }
  }
}
</script>


