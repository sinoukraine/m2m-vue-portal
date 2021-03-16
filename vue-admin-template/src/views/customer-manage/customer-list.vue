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
                <el-table-column label="Parent" min-width="120px" align="center" sortable="custom" prop="ParentName">
                <template slot-scope="{row}">
                    <span>{{ row.ParentName }}</span>
                </template>
                </el-table-column>

                <el-table-column label="Admin" min-width="120px" align="center" sortable="custom" prop="FirstName">
                <template slot-scope="{row}">
                    <span>{{ row.FirstName ? row.FirstName + ' ' + row.SubName : $t('TEXT_COMMON_NA') }}</span>
                </template>
                </el-table-column>
                <!--<el-table-column label="Last Name" min-width="120px" align="center" sortable="custom" prop="SubName">
                <template slot-scope="{row}">
                    <span>{{ row.SubName ? row.SubName : $t('TEXT_COMMON_NA') }}</span>
                </template>
                </el-table-column>-->
                <el-table-column label="Email" min-width="180px" align="center" sortable="custom" prop="Email">
                <template slot-scope="{row}">
                    <span>{{ row.Email }}</span>
                </template>
                </el-table-column>
                <el-table-column label="Mobile" min-width="120px" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.Mobile ? row.Mobile : $t('TEXT_COMMON_NA') }}</span>
                </template>
                </el-table-column>
                
                <el-table-column label="Service Profile" min-width="140px" align="center" sortable="custom" prop="ServiceProfileName">
                <template slot-scope="{row}">
                    <span>{{ row.ServiceProfileName }}</span>
                </template>
                </el-table-column>
                <el-table-column label="Number" min-width="100px" align="center" sortable="custom" prop="Number">
                <template slot-scope="{row}">
                    <span>{{ row.Number }}</span>
                </template>
                </el-table-column><!--
                <el-table-column label="Language" min-width="120px" align="center" sortable="custom" prop="Language">
                <template slot-scope="{row}">
                    <span>{{ row.Language }}</span>
                </template>
                </el-table-column>
                <el-table-column label="Country" min-width="100px" align="center" sortable="custom" prop="CountryCode">
                <template slot-scope="{row}">
                    <span>{{ row.CountryCode }}</span>
                </template>
                </el-table-column>
                <el-table-column label="Province" min-width="100px" align="center" sortable="custom" prop="ProvinceCode">
                <template slot-scope="{row}">
                    <span>{{ row.ProvinceCode }}</span>
                </template>
                </el-table-column>
                <el-table-column label="City" min-width="100px" align="center" sortable="custom" prop="CityCode">
                <template slot-scope="{row}">
                    <span>{{ row.CityCode }}</span>
                </template>
                </el-table-column>
                <el-table-column label="Address" min-width="100px" align="center" sortable="custom" prop="Address">
                <template slot-scope="{row}">
                    <span>{{ row.Address }}</span>
                </template>
                </el-table-column>
                <el-table-column label="ZIPCode" min-width="100px" align="center" sortable="custom" prop="ZIPCode">
                <template slot-scope="{row}">
                    <span>{{ row.AddressCode }}</span>
                </template>
                </el-table-column>-->
                <el-table-column label="State" min-width="100px" align="center">
                <template slot-scope="{row}">
                    <el-tag :type="row.State | statusFilter">
                    {{ getStatusText(row.State) }}
                    </el-tag>
                </template>
                </el-table-column>
                <el-table-column label="Actions" align="center" width="200" class-name="small-padding fixed-width" fixed="right">
                <template slot-scope="{row,$index}">
                    <el-button type="primary" class="blue-btn" size="mini" @click="handleUpdate(row)">
                    {{ $t('TEXT_COMMON_EDIT') }}
                    </el-button>
                    <el-button v-if="row.Status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
                    {{ $t('TEXT_COMMON_DELETE') }}
                    </el-button><!--
                    <el-button type="primary" class="violet-btn" size="mini" @click="remoteAccess(row.Token)">
                    Remote 
                    </el-button>-->
                </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total>0" :total="total" :page.sync="listQuery.Page" :limit.sync="listQuery.Rows" @pagination="getList" />
            
            </div>


            <el-dialog :title="textMap[dialogStatus]" :visible.sync="isDialogFormVisible" >
            <el-form ref="dataForm" :rules="rules" :model="temp" label-position="top" label-width="70px" @submit.native.prevent="onEditFormSubmit">
                <input type="submit" class="display-none" >

                <el-row v-if="dialogStatus !== 'create'" :gutter="16" >
                <el-col :xs="24" :sm="24" class="text-right">
                </el-col>
                </el-row>

                <el-row :gutter="16">
                <el-col :xs="24" :sm="12">
                    <el-form-item label="Name" prop="Name">
                    <el-input v-model="temp.Name" placeholder="Name"/>
                    </el-form-item>
                </el-col>                
                <el-col :xs="24" :sm="12">
                    <el-form-item v-if="dialogStatus === 'update'" label="Parent" prop="ParentName">   
                      <el-input :value="temp.ParentName" disabled placeholder="Parent"/>
                    </el-form-item>
                      <el-form-item v-else :label="'Parent'" prop="ParentCode" class="w-100">
                        <input type="hidden" :value="temp.ParentCode" >
                        <el-select
                          ref="parentSearchSelect"
                          v-model="searchedParentCreate"
                          :remote-method="querySearchParentCreate"
                          filterable
                          default-first-option
                          clearable
                          remote
                          placeholder="Parent"
                          class="parent-search-select w-100"
                          @change="changeParentCreate"
                        >
                          <el-option v-for="item in parentCreateArr" :key="item.Code" :value="item" :label="item.Name" />
                        </el-select>
                      </el-form-item>
                    <!--<el-form-item label="Parent" prop="ParentCode">
                    <el-select v-model="temp.ParentCode" :disabled="dialogStatus=='create'?false:true" class="filter-item w-100" placeholder="Please select">
                        <el-option v-for="item in parentOptions" :key="item.Code" :label="item.Name" :value="item.Code" />
                    </el-select>
                    </el-form-item>-->

                </el-col>
                <el-col :xs="24" :sm="12">
                    <el-form-item label="First Name" prop="FirstName"  >
                    <el-input v-model="temp.FirstName" placeholder="First Name" />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                    <el-form-item label="Sub Name" prop="SubName">
                    <el-input v-model="temp.SubName"  placeholder="Sub Name" />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                    <el-form-item label="Email" prop="Email"  >
                    <el-input v-model="temp.Email" placeholder="Email" />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                    <el-form-item label="Mobile" prop="Mobile"  >
                    <el-input v-model="temp.Mobile" placeholder="Mobile" />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                    <el-form-item label="Number" prop="Number" >
                    <el-input v-model="temp.Number" placeholder="Number" />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                    <el-form-item label="Account" prop="Account" >
                    <el-input v-model="temp.Account" placeholder="Account" />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                    <el-form-item label="Country" prop="CountryCode">
                    <el-select v-model="temp.CountryCode" class="filter-item w-100" placeholder="Please select">
                        <el-option v-for="item in countryOptions" :key="item.Code" :label="item.Name" :value="item.Code" />
                    </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                    <el-form-item label="State / Province" prop="ProvinceCode" >
                    <el-input v-model="temp.ProvinceCode"  placeholder="State / Province" />
                    <!--<el-select v-model="temp.ProvinceCode" class="filter-item w-100" placeholder="Please select">
                        <el-option v-for="item in provinceOptions" :key="item.Code" :label="item.Name" :value="item.Code" />
                    </el-select>-->
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                    <el-form-item label="City" prop="CityCode" >
                    <el-input v-model="temp.CityCode" placeholder="City Code" />
                    <!--<el-select v-model="temp.CityCode" class="filter-item w-100" placeholder="Please select">
                        <el-option v-for="item in cityOptions" :key="item.Code" :label="item.Name" :value="item.Code" />
                    </el-select>-->
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                    <el-form-item label="Service Profile" prop="ServiceProfileCode">
                    <el-select v-model="temp.ServiceProfileCode" class="filter-item w-100" placeholder="Please select">
                        <el-option v-for="item in serviceProfileOptions" :key="item.Code" :label="item.Name" :value="item.Code" />
                    </el-select>
                    </el-form-item>
                </el-col>
                <!--<el-col :xs="24" :sm="12">
                    <el-form-item label="Web Site" prop="WebSiteCode">
                    <el-select v-model="temp.WebSiteCode" class="filter-item w-100" placeholder="Please select">
                        <el-option v-for="item in webSiteOptions" :key="item.Code" :label="item.Name" :value="item.Code" />
                    </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                    <el-form-item label="Language" prop="Language">
                    <el-select v-model="temp.Language" class="filter-item w-100" placeholder="Please select">
                        <el-option v-for="item in languageOptions" :key="item.Code" :label="item.Name" :value="item.Code" />
                    </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                    <el-form-item label="TimeZone" prop="TimeZoneCode">
                    <el-select v-model="temp.TimeZoneCode" class="filter-item w-100" placeholder="Please select">
                        <el-option v-for="item in timeZoneOptions" :key="item.Code" :label="item.Name" :value="item.Code" />
                    </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                    <el-form-item label="DateTimeFormat" prop="DateTimeFormat">
                    <el-select v-model="temp.DateTimeFormat" class="filter-item w-100" placeholder="Please select">
                        <el-option v-for="item in dateTimeFormatOptions" :key="item.Code" :label="item.Name" :value="item.Code" />
                    </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" v-show="dialogStatus=='create'">
                    <el-form-item label="DistanceUnit" prop="DistanceUnit">
                    <el-select v-model="temp.DistanceUnit" class="filter-item w-100" placeholder="Please select">
                        <el-option v-for="item in distanceUnitOptions" :key="item.Code" :label="item.Name" :value="item.Code" />
                    </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" v-show="dialogStatus=='create'">
                    <el-form-item label="VolumeUnit" prop="VolumeUnit">
                    <el-select v-model="temp.VolumeUnit" class="filter-item w-100" placeholder="Please select">
                        <el-option v-for="item in volumeUnitOptions" :key="item.Code" :label="item.Name" :value="item.Code" />
                    </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" v-show="dialogStatus=='create'">
                    <el-form-item label="EconomyUnit" prop="EconomyUnit">
                    <el-select v-model="temp.EconomyUnit" class="filter-item w-100" placeholder="Please select">
                        <el-option v-for="item in economyUnitOptions" :key="item.Code" :label="item.Name" :value="item.Code" />
                    </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" v-show="dialogStatus=='create'">
                    <el-form-item label="PressureUnit" prop="PressureUnit">
                    <el-select v-model="temp.PressureUnit" class="filter-item w-100" placeholder="Please select">
                        <el-option v-for="item in pressureUnitOptions" :key="item.Code" :label="item.Name" :value="item.Code" />
                    </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12" v-show="dialogStatus=='create'">
                    <el-form-item label="TemperatureUnit" prop="TemperatureUnit">
                    <el-select v-model="temp.TemperatureUnit" class="filter-item w-100" placeholder="Please select">
                        <el-option v-for="item in temperatureUnitOptions" :key="item.Code" :label="item.Name" :value="item.Code" />
                    </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                    <el-form-item label="ZIP Code" prop="AddressCode">
                    <el-input v-model="temp.AddressCode" />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="12">
                    <el-form-item label="Address" prop="Address">
                    <el-input v-model="temp.Address" />
                    </el-form-item>
                </el-col>-->
                </el-row>

            </el-form>
            <div slot="footer" class="dialog-footer">                
                
                <el-button v-show="dialogStatus !== 'create'" v-if="temp.State==2" class="green-btn" :loading="isChangeStateLoading" @click="onChangeState(1)">
                    {{'Enable'}}
                </el-button>
                <el-button v-show="dialogStatus !== 'create'" v-else type="danger" :loading="isChangeStateLoading" @click="onChangeState(2)">
                    {{'Disable'}}
                </el-button>

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
                <el-row :gutter="16">
                <el-col :xs="100" class="px-0">
                    <el-form-item label="Fuzzy query" prop="q" class="no-margin-bottom">
                    <el-input v-model="listQuery.q" placeholder="Type something" class="filter-item" />
                    </el-form-item>
                </el-col>
                <el-col :xs="100" class="px-0">
                    <el-form-item label="Code" prop="code" class="no-margin-bottom">
                    <el-input v-model="listQuery.Code" placeholder="Organize Code" class="filter-item" />
                    </el-form-item>
                </el-col>
                <el-col :xs="100" class="px-0">
                    <el-form-item label="Name" prop="name" class="no-margin-bottom">
                    <el-input v-model="listQuery.Name" placeholder="Name" class="filter-item" />
                    </el-form-item>
                </el-col>
                <el-col :xs="100"  class="px-0">
                    <el-form-item label="Number" prop="number" class="no-margin-bottom">
                    <el-input v-model="listQuery.Number" placeholder="Number" class="filter-item" />
                    </el-form-item>
                </el-col>                
                <el-col :xs="100"  class="px-0">
                    <!--<el-form-item label="Parent" prop="parent" class="no-margin-bottom">
                    <el-select v-model="listQuery.ParentCode" placeholder="Parent Code">
                      <el-option v-for="item in parentOptions" :key="item.Code" :label="item.Name" :value="item.Code" />
                    </el-select>
                    </el-form-item>-->
                    <el-form-item label="Parent" prop="parent" class="">
                      <el-select
                        ref="parentSearchSelect"
                        v-model="searchedParent"
                        :remote-method="querySearchParent"
                        filterable
                        default-first-option
                        remote
                        clearable
                        placeholder="Parent"
                        class="imsi-search-select"
                        @change="changeParent"
                      >
                        <el-option v-for="item in parentArr" :key="item.code" :value="item" :label="item.title" />
                      </el-select>
                  </el-form-item>
                </el-col>
                <el-col :xs="100"  class="px-0">
                    <el-form-item label="Service Profile" prop="serviceProfile" class="no-margin-bottom">
                    <el-select v-model="listQuery.ServiceProfileCode" placeholder="Service Profile">
                      <el-option v-for="item in serviceProfileOptions" :key="item.Code" :label="item.Name" :value="item.Code" />
                    </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="100"  class="px-0">
                    <el-form-item label="Country" prop="country" class="no-margin-bottom">
                    <el-select v-model="listQuery.CountryCode" :placeholder="$t('COUNTRY')">
                      <el-option v-for="item in countryOptions" :key="item.Code" :label="item.Name" :value="item.Code" />
                    </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="100" class="px-0">
                    <el-form-item label="State / Province" prop="province" class="no-margin-bottom">
                    <el-input v-model="listQuery.ProvinceCode" placeholder="Province" class="filter-item" />
                    </el-form-item>
                </el-col>
                <el-col :xs="100" class="px-0">
                    <el-form-item label="City" prop="city" class="no-margin-bottom">
                    <el-input v-model="listQuery.CityCode" placeholder="City" class="filter-item" />
                    </el-form-item>
                </el-col>
                </el-row>
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
import { StatusList, LanguageList, TimeZoneList, DateTimeFormatList, CountyList, DistanceUnitList, EconomyUnitList, VolumeUnitList, TemperatureUnitList, PressureUnitList } from "@/utils/dictionaries";
//import { sortArrayByObjProps } from "@/utils/helpers";
import { fetchCustomersListAjax, createCustomerAjax, updateCustomerAjax, deleteCustomerAjax, fetchServiceProfileListAjax, changeOrgStateAjax } from "@/api/user";
//import { fetchRoleList } from "@/api/role-managment";
import Item from '@/layout/components/Sidebar/Item'


export default {
  name: 'Customers',
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
      parentCreateArr: [],
      searchedParentCreate: null,
      searchedParent: '',
      parentArr: [],
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
      distanceUnitOptions: DistanceUnitList,
      economyUnitOptions: EconomyUnitList,
      volumeUnitOptions: VolumeUnitList,
      temperatureUnitOptions: TemperatureUnitList,
      pressureUnitOptions: PressureUnitList,
      roleTypeOptions: [],
      parentOptions: [],
      countryOptions: [],
      //provinceOptions: [],
      //cityOptions: [],
      serviceProfileOptions: [],
      webSiteOptions: [],
      temp: {       
        Language: LanguageList.find(e=>e.Code==='EN'),
        TimeZoneCode: TimeZoneList[0],
        DateTimeFormat: DateTimeFormatList[0],
        DistanceUnit: DistanceUnitList[0],
        EconomyUnit: EconomyUnitList[0],
        VolumeUnit: VolumeUnitList[0],
        TemperatureUnit: TemperatureUnitList[0],
        PressureUnit: PressureUnitList[0],
        ParentCode: '',
        WebSiteCode: '_',
        AddressCode: '_',
        Address: '_',
      },
      isDialogFormVisible: false,
      isFormLoading: false,
      isChangeStateLoading: false,
      isSearchExpanded: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      //dialogPvVisible: false,
      //pvData: [],
      rules: {
        Name: [{ required: true, message: 'Name is required', trigger: 'blur' }],
        FirstName: [{ required: true, message: 'First Name is required', trigger: 'blur' }],
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
        ServiceProfileCode: [{ required: true, message: 'Service Profile is required', trigger: 'change' }],
        WebSiteCode: [{ required: true, message: 'Web Site is required', trigger: 'change' }],
      },
      downloadLoading: false

    }
  },
  created() {
    this.getList()
    //this.getParentsList()
    //this.getCityOptions()
    //this.getProvinceOptions()
    this.getCountryOptions()
    this.getServiceProfileOptions()
    this.getWebSiteOptions()
    this.getLanguageOptions()
    this.getTimeZoneOptions()
    this.getDateTimeFormatOptions()
    //this.getParentRoles()
  },
  computed: {
    ...mapGetters(['userInfo'])
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
      let listQuery = {
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
      })
      
    },
    changeParentCreate(val) {
      this.parentCreateArr = []
      this.searchedParentCreate = val
      this.temp.ParentCode = val.Code
    },


    querySearchParent(query) {
      if (query !== '') {        
        if(query.length > 1) {
          this.searchParent(query)
        }      
      } else {
        this.parentArr = []
      }
    },
    async searchParent(query) {
      const arr = []      
      this.parentArr = []
      this.parentListQuery = {
        Name: query
      }
      
      fetchCustomersListAjax(this.parentListQuery).then(response => {
        response.rows.forEach(element => {
          arr.push({
            code: element.Code,
            title: element.Name
          })
        })
        this.parentArr = arr
      }) 
    },
    changeParent(val) {
      this.parentArr = []
      this.searchedParent = val.title
      this.listQuery.Parent = val.code
    },
    async remoteAccess(token) {  
      const loginForm = {
            token,
          }
        await qtRemoteLogin(loginForm).then(response => {
          console.log('ok',response)
        })
          //this.loading = true
          /*const loginForm = {
            token,
          }
          let response = await qtRemoteLogin(loginForm)
          console.log('rem',response)
          //this.loading = false
          if(!response){
            return
          }

          localStorage.Account = loginForm.Account;
          localStorage.Password = loginForm.Password;
          let response = {
            FirstName: 'Vlad',
              SubName: 'Bill',
              Language: 'en',
              Login: 'quiktrakukraine',
              Token: '5b41ecfc-f8a5-4421-b4a8-61eb21f04ef5'
          }
          this.$store.commit('user/SET_QT_USERINFO', response)
          this.$store.commit('user/SET_NAME', response.FirstName + ' ' + response.SubName)
          this.$store.commit('user/SET_LOGIN', response.Login)
          this.$store.commit('user/SET_AVATAR', 'avatar-user.png')
          this.$store.commit('user/SET_LANGUAGE', response.Language)
          
          this.$router.push({ path: '/' })*/
    },
    async getList() {
      this.isListLoading = true
      fetchCustomersListAjax(this.listQuery).then(response =>{
        this.isListLoading = false
      
        this.total = response.total
        this.list = response.rows
        this.parentOptions = [{
          Name: this.userInfo.OrganizeName,
          Code: this.userInfo.OrganizeCode
        }].concat(this.list)
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
    async getCountryOptions(){
      this.countryOptions = CountyList
    },
    /*async getProvinceOptions(){
      this.provinceOptions = [{
        Name: 'Kyv',
        Code: 'Kyv'
      }]
    },
    async getCityOptions(){
      this.cityOptions = [{
        Name: 'Kyiv',
        Code: '000'
      }]
    },*/
    async getWebSiteOptions(){
      this.webSiteOptions = [{
        Name: 'new.m2mdata.co',
        Code: '1'
      }]
    },
    async getServiceProfileOptions(){
      fetchServiceProfileListAjax().then(response => {
        this.serviceProfileOptions = response
      })
     
    },    
    async getLanguageOptions(){      
      this.languageOptions = LanguageList
    },
    async getTimeZoneOptions(){      
      this.timeZoneOptions = TimeZoneList
    },
    async getDateTimeFormatOptions(){      
      this.dateTimeFormatOptions = DateTimeFormatList
    },
    handleFilter() {
      this.listQuery.Page = 1
      this.getList()
    },
    sortChange(data) {
      const { prop, order } = data
      this.listQuery.Order = order === 'ascending' ? 'ASC' : (order === 'descending') ? 'DESC' : ''
      //this.listQuery.Order = order === 'ascending' ? 'ASC' : 'DESC'
      this.listQuery.Sort = prop
      this.getList()
      /*if (prop === 'id') {
        this.sortByID(order)
      }*/
    },
    /*sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },*/
    resetTemp() {
      this.searchedParentCreate = null
      this.temp = {        
        Language: LanguageList.find(e=>e.Code==='EN'),
        TimeZoneCode: TimeZoneList[0],
        DateTimeFormat: DateTimeFormatList[0],
        DistanceUnit: DistanceUnitList[0],
        EconomyUnit: EconomyUnitList[0],
        VolumeUnit: VolumeUnitList[0],
        TemperatureUnit: TemperatureUnitList[0],
        PressureUnit: PressureUnitList[0],
        ParentCode: '',
        WebSiteCode: '_',
        AddressCode: '_',
        Address: '_',
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
      this.dialogStatus = 'update'
      this.isDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    async handleDelete(row, index) {
      deleteCustomerAjax({ Code: row.Code }).then(response => {
        this.$notify({
          title: 'Success',
          message: 'Deleted Successfully',
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)

        this.parentOptions = [{
          Name: this.userInfo.OrganizeName,
          Code: this.userInfo.OrganizeCode
        }].concat(this.list)
      })
      
    },
    onEditFormSubmit(){
      let tempData = Object.assign({}, this.temp)
      this.$refs['dataForm'].validate(async (valid) => {
        if (!valid){
          return false
        }
        

        this.isFormLoading = true
        //let response = this.dialogStatus === 'create' ? await createCustomer(tempData) : await updateCustomer(tempData)
       
        
        if(this.dialogStatus === 'create'){ 
          createCustomerAjax(tempData).then(response => {            
            this.resetTemp()
            this.getList()
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          }) 
        }else{
          updateCustomerAjax(tempData).then(response => {            
            this.resetTemp()
            this.getList()
            this.$notify({
              title: 'Success',
              message: 'Updated Successfully',
              type: 'success',
              duration: 2000
            })          
          })
        }
        
        this.isFormLoading = false
        this.isDialogFormVisible = false  
      })
    },
    async onChangeState(state){
      this.isChangeStateLoading = true;
      changeOrgStateAjax({ Code: this.temp.Code, State: state }).then(response => {
        this.isChangeStateLoading = false;
        this.$notify({
          title: 'Success',
          message: 'State Changed Successfully',
          type: 'success',
          duration: 2000
        })
      })
      
    },
    /*onParentCodeChange(value){
      this.getParentRoles(value)
      //console.log(event)
    },
    onServiceProfileChange(value){ 
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


<style>
/*map*/

  .map-container{
    overflow: hidden;
    width: 100%;
    height: 439px;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  .el-dialog__title{
    color: #606268;
    font-weight: 600;
    font-size: 14px;
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #909399;
    font-weight: bold;
    font-size: 14px;
  }
  
.el-dialog__body{
    padding: 20px;
}
.el-dialog__header{
    padding: 20px;
    border-bottom: 1px solid #e3e3e3;
}
.el-dialog__body{    
    border-bottom: 1px solid #e3e3e3;
}
.el-dialog__footer{    
    padding: 20px;
}
.el-button{
    overflow: inherit !important;
}
  .location-table{
    width: 100%;
    background-color:#ffffff;
    box-shadow: none;
    border-top-left-radius: 0px;
    border-bottom-left-radius: 0px;
  }
  .location-table td{
    background-color: initial !important;
  }
  .el-table td, .el-table th {
    padding: 7px 0 !important;
}
  .el-table td{
    padding: 7px 0;
    font-size: 12px;
  }
  .location-table td .cell{
    white-space: nowrap; /* Запрещаем перенос строк */
    overflow: hidden; /* Обрезаем все, что не помещается в область */
    text-overflow: ellipsis; /* Добавляем многоточие */
  }
  .leaflet-control-zoom, .leaflet-control-attribution{
    display: none;
  }
  .card-panel-right {
    text-align: right;
  }
 /*buttons*/
.dark-btn{
  border-color: #304257;
  background-color: #304257;
}
.dark-btn:hover,.dark-btn:active,.dark-btn:focus{
  border-color: #35475c;
  background-color: #35475c;
}
.green-btn{
    border-color: #34bfa3;
    background-color: #34bfa3;
  }
  .green-btn:hover,.green-btn:active,.green-btn:focus{
    border-color: #3ec8ac;
    background-color: #3ec8ac;
  }
.blue-btn{
  border-color: #28a5e0;
  background-color: #28a5e0;
}
.blue-btn:hover,.blue-btn:active,.blue-btn:focus{
  border-color: #32aee8;
  background-color: #32aee8;
}

  .violet-btn{
    border-color: rgb(182, 162, 222);
    background-color: rgb(182, 162, 222);
  }
  .violet-btn:hover,.violet-btn:active,.violet-btn:focus{
    border-color: rgb(196, 180, 228);
    background-color: rgb(196, 180, 228);
  }

  .w-100{
    width: 100%;
  }
  .mt-25{
    margin-top: 25px;
  }
  .mt-30{
    margin-top: 30px;
  }
  .mb-30{
    margin-bottom: 30px;
  }
  .el-form-item {
    margin-bottom: 10px;
  }
  .el-form-item__label{
    color: #97a8be;
    line-height: 2em;
  }
  .footer-border .el-card__body{
    border-bottom: 1px solid #ebeef5;
    margin-bottom: 100px;
    padding-bottom: 10px;
  }
  .el-card__footer button{
    float: right;
    margin-top: 38px;
  }
.el-table {
    font-size: 12px;
}
.el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #28a5e0;
}
.el-pagination.is-background .el-pager li:not(.disabled):hover {
    color: #28a5e0;
}
.cell a{
  color: #28a5e0;
}
.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #28a5e0;
    border-color: #28a5e0;
}
div.square {
  border-radius: 3px;
  margin: 0 14px;
  width: 10px;
  height: 10px;
}
.pagination-container{
  margin-top: 30px;
  border-radius: 5px;
}

.map-table-icon{
  width: 16px;
  cursor: pointer;
}
.el-table td, .el-table th {
    padding: 12px 0;
}
.el-select{
  width: 100%;
}
.el-table {
    width: 100%;
    border-radius: 5px;
    -webkit-box-shadow: 0px 0px 4.9px 0.1px rgba(151, 164, 193, 0.2);
    box-shadow: 0px 0px 4.9px 0.1px rgba(151, 164, 193, 0.2);
}
.el-aside{    
    overflow: hidden;
}
.px-0{
    padding-left: 0 !important;
    padding-right: 0 !important;
}
.pb-3{
  padding-bottom: 30px;
}
@media (min-width: 768px){
    .lg-pr-0{
      padding-right: 0 !important;
    }
    .lg-pl-0{
      padding-left: 0 !important;
    }
    .lg-card-flex{
      display: flex;
      -webkit-box-pack: justify;
      -ms-flex-pack: justify;
      justify-content: space-between;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
    }
  }
  .orange-btn{
    border-color: #ffb880;
    background-color: #ffb880;
  }
  .orange-btn:hover,.orange-btn:active,.orange-btn:focus{
    border-color: #ffc496;
    background-color: #ffc496;
  }
</style>

<style scoped lang="scss">



</style>