<template>
  <el-main >
    <el-row :gutter="16" type="flex">
      <el-col :xs="24">
        <el-form class="block padding-x2" :model="formQuery" label-position="top" @submit.native.prevent="handleFormSubmit">
          <el-row :gutter="16" align="bottom" type="flex">
            <el-col :xs="24" :sm="12" :lg="8" :xl="6">
              <el-form-item :label="$t('IMSI')" prop="title" class="no-margin-bottom" >
                <el-input placeholder="" class="filter-item" disabled/>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="8" :xl="6">
              <el-form-item :label="$t('ICCID')" prop="title" class="no-margin-bottom" >
                <el-input placeholder="" class="filter-item" disabled/>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="8" :xl="6">
              <el-form-item :label="$t('MSISDN')" prop="title" class="no-margin-bottom" >
                <el-input placeholder="" class="filter-item" disabled/>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="8" :xl="6">
              <el-form-item :label="$t('IMEI')" prop="title" class="no-margin-bottom" >
                <el-input placeholder="" class="filter-item" disabled/>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="8" :xl="6">
              <el-form-item :label="$t('BUSINESS_UNIT')" prop="title" class="no-margin-bottom">
                <el-select v-model="businessUnitArr[0]" :placeholder="$t('SOLUTION')" class="width-100">
                  <el-option v-for="item in businessUnitArr" :key="item.code" :label="item.name" :value="item.code" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="8" :xl="6">
              <el-form-item :label="$t('CSP')" prop="title" class="no-margin-bottom">
                <el-select v-model="cspArr[0]" :placeholder="$t('SOLUTION')" class="width-100">
                  <el-option v-for="item in cspArr" :key="item.code" :label="item.name" :value="item.code" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="8" :xl="6">
              <el-form-item :label="$t('STATE')" prop="title" class="no-margin-bottom">
                <el-select v-model="stateArr[0]" :placeholder="$t('SOLUTION')" class="width-100">
                  <el-option v-for="item in stateArr" :key="item.code" :label="item.name" :value="item.code" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="8" :xl="6">
              <el-form-item :label="$t('SOLUTION')" prop="title" class="no-margin-bottom">
                <el-select v-model="solutionsArr[0]" :placeholder="$t('SOLUTION')" class="width-100">
                  <el-option v-for="item in solutionsArr" :key="item.code" :label="item.name" :value="item.code" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="8" :xl="6">
              <el-form-item :label="$t('AGENT')" prop="title" class="no-margin-bottom">
                <el-select v-model="agentsArr[0]" :placeholder="$t('AGENT')" class="width-100">
                  <el-option v-for="item in agentsArr" :key="item.code" :label="item.name" :value="item.code" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="8" :xl="6">
              <el-form-item :label="$t('CUSTOMER')" prop="title" class="no-margin-bottom">
                <el-select v-model="customersArr[0]" :placeholder="$t('CUSTOMER')" class="width-100">
                  <el-option v-for="item in customersArr" :key="item.code" :label="item.name" :value="item.code" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="8" :xl="6">
              <el-form-item class="no-margin-bottom ">
                <button v-waves type="submit" class="el-button el-button--primary button-min-with-150 width-100 margin-top-x2">{{ $t('SAVE') }}</button>
              </el-form-item>
            </el-col>

          </el-row>
        </el-form>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
import waves from '@/directive/waves' // waves directive

export default {
  name: 'SimInfo',

  directives: { waves },

  data() {
    return {
      formQuery: {

      },
      solutionsArr: [
        { code: '1', name: 'Track' }
      ],
      agentsArr: [
        { code: '1', name: 'Agent' }
      ],
      customersArr: [
        { code: '1', name: 'Customer' }
      ],
      businessUnitArr: [
        { code: '1', name: 'Chile' }
      ],
      cspArr: [
        { code: '1', name: 'SP5_Chile' }
      ],
      stateArr: [
        { code: '1', name: 'Productive' }
      ],
    }
  },

  mounted() {

  },

  methods: {
    handleFormSubmit(){
      console.log('submitted')
    }
  }
}
</script>

<style scoped>

</style>
