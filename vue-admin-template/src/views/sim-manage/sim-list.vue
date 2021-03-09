<template>
<el-container class="with-panel-wrapper sim-list-page" :class="{'panel-opened': isRightPanelVisible}">
  <loading :active.sync="isLoading" 
      :can-cancel="true" 
      :is-full-page="fullPage">
  </loading>
  
  <el-dialog title="View Map" :visible.sync="mapFormVisible" width="70%" class="bg-blue" >
    <el-row :gutter="16">
      <el-col :xs="24" :sm="12" class="lg-pr-0">
        <div class="map-container">
          <l-map
            ref="map"
            :zoom="zoom"
            :center="center"
            style="height: 100%"
            @ready="doSomethingOnReady()"
          >
            <l-tile-layer
              v-for="tileProvider in tileProviders"
              :key="tileProvider.name"
              :name="tileProvider.name"
              :visible="tileProvider.visible"
              :url="tileProvider.url"
              :subdomains="tileProvider.subdomains"
              layer-type="base"/>
            <l-marker
              :lat-lng="markerLatLng"
              :icon="markerIcon"
            >
            </l-marker>
            <!--<l-circle 
                :color="'rgb(249,104,104)'"
                :fill-color="'rgb(249,104,104)'"
                :lat-lng="markerLatLng" 
                :radius="'10'" >
              </l-circle>-->
          </l-map>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" class="lg-pl-0">
        <el-table
          :data="locationList"
          fit
          :show-header="false"
          class="location-table"
        >
          <el-table-column label="Device Offer" align="left" >
            <template slot-scope="{row}">
              <span>{{row.title}}</span>
            </template>
          </el-table-column>
          <el-table-column label="SIM Numbers" align="right">
            <template slot-scope="{row}">
              <span>{{row.value}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <div class="card-flex">
        <div class="card-inline card-panel-left">
        </div>
        <div class="card-inline card-panel-right">
          <el-button type="info" class="dark-btn mt-25" @click="forceReconnect">Force reconnect</el-button>
        </div>
      </div>
    </el-row>
  </el-dialog>
  

  
  <el-dialog title="Move SIMs to" :visible.sync="moveFormVisible" width="30%" class="bg-white" >
      <el-form ref="dataFormMove" :rules="rulesMove" :model="tempMove" label-position="top" label-width="70px" @submit.native.prevent="onMoveFormSubmit">
        <input type="submit" class="display-none" >

        <el-row :gutter="16">
        <el-col :xs="24" :sm="24" class="lg-pr-0">   
            <el-form-item :label="'Organize'" prop="Organize">
            <el-select v-model="tempMove.Organize" :placeholder="$t('ORGANIZE')" class="">
              <el-option v-for="item in organizeOptions" :key="item.Code" :label="item.Name" :value="item.Code" />
            </el-select>
            </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" class="lg-pr-0">            
            <el-form-item :label="'Number'" prop="Number">
              <el-input v-model="tempMove.Number"  :placeholder="'Number'"/>
            </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" class="lg-pr-0">            
            <el-form-item :label="$t('REMARK')" prop="Remark">
            <el-input v-model="tempMove.Remark"  :placeholder="$t('REMARK')"/>
            </el-form-item>
        </el-col>
      </el-row>      
      <el-row>
        <div class="card-flex">
          <div class="card-inline card-panel-left">
          </div>
          <div class="card-inline card-panel-right">
            <el-button type="info" class="blue-btn mt-25" @click="handleMoveSIMs">Save</el-button>
          </div>
        </div>
      </el-row>
      </el-form>
  </el-dialog>


  <el-dialog title="Set Service Profile" :visible.sync="sspFormVisible" width="30%" class="bg-white" >
      <el-row :gutter="16">
        <el-col :xs="24" :sm="24" class="lg-pr-0">
            <el-select v-model="selectedServiceProfile" :placeholder="$t('SERVICEPROFILE')" class="">
              <el-option v-for="item in serviceProfileOptions" :key="item.Code" :label="item.Name" :value="item.Code" />
            </el-select>
        </el-col>
      </el-row>      
      <el-row>
        <div class="card-flex">
          <div class="card-inline card-panel-left">
          </div>
          <div class="card-inline card-panel-right">
            <el-button type="info" class="blue-btn mt-25" @click="saveServiceProfile">Save</el-button>
          </div>
        </div>
      </el-row>
  </el-dialog>

  <el-dialog title="Set State" :visible.sync="stateFormVisible" width="30%" class="bg-white" >
     <el-row :gutter="16">
        <el-col :xs="24" :sm="24" class="lg-pr-0">
            <el-select v-model="selectedState" :placeholder="$t('STATE')" class="">
              <el-option v-for="item in stateOptions" :key="item.Code" :label="item.Name" :value="item.Code" />
            </el-select>
        </el-col>
      </el-row>      
      <el-row>
        <div class="card-flex">
          <div class="card-inline card-panel-left">
          </div>
          <div class="card-inline card-panel-right">
            <el-button type="info" class="blue-btn mt-25"  @click="saveState">Save</el-button>
          </div>
        </div>
      </el-row>
  </el-dialog>


    <el-container class="page-fixed-height padding-vertical-x2">
        <el-main  class="no-padding">
            <div class="filter-container ">
                <div class="display-flex justify-content-between">                    
                  <div class="buttons-row">
                      <el-button v-waves class="button-custom" @click="acctivateSIM"><item :icon="'activation'"/> {{ $t('ACTIVATION') }}</el-button>
                      <el-button v-waves class="button-custom" @click="showStateForm"><item :icon="'state'"/> {{ $t('STATE') }}</el-button>
                      <el-button v-waves class="button-custom" @click="showMoveForm"><item :icon="'sim-blue'"/> {{ $t('MOVE_SIM') }}</el-button>
                      <el-button v-waves class="button-custom" @click="showCSPForm"><item :icon="'csp-blue'"/> {{ $t('SERVICEPROFILE') }}</el-button>
                      <!--<el-button v-waves class="button-custom"><item :icon="'profile-blue'"/> {{ $t('CUSTOM') }}</el-button>
                      <el-button v-waves class="button-custom"><item :icon="'solution-blue'"/> {{ $t('SOLUTION') }}</el-button>-->
                  </div>
                  <div class="buttons-row white-space-nowrap">
                    <el-button v-waves class="button-custom blue-btn" type="primary" @click="getList"><item :icon="'update-white'"/></el-button>
                    <el-button v-waves :loading="downloadLoading" class="button-custom blue-btn" type="primary" @click="handleDownload"><item :icon="'save-white'"/></el-button>
                  </div>
                 </div>
                 <div class="buttons-row">
                  <el-checkbox v-model="checkboxICCID">{{ $t('ICCID') }}</el-checkbox>
                  <el-checkbox v-model="checkboxMSISDN">{{ $t('MSISDN') }}</el-checkbox>
                  <!--<el-checkbox v-model="checkboxBusinessUnit">{{ $t('BUSINESS_UNIT') }}</el-checkbox>-->
                  <el-checkbox v-model="checkboxServiceProfile">{{ $t('SERVICEPROFILE') }}</el-checkbox>
                  <el-checkbox v-model="checkboxState">{{ $t('STATE') }}</el-checkbox>
                  <el-checkbox v-model="checkboxOrganize">{{ $t('CUSTOMER') }}</el-checkbox>
                  <el-checkbox v-model="checkboxPayPlan">{{ $t('PAYPLAN') }}</el-checkbox>
                  <el-checkbox v-model="checkboxIPAddress">{{ $t('IPADDRESS') }}</el-checkbox>                  
                  <el-checkbox v-model="checkboxRAG">{{ $t('RAG') }}</el-checkbox>
                  <el-checkbox v-model="checkboxDataSession">{{ $t('DATA_SESSION') }}</el-checkbox>
                  <el-checkbox v-model="checkboxDataUsage">{{ $t('DATA_USAGE') }}</el-checkbox>
                  <el-checkbox v-model="checkboxSMSUsage">{{ $t('SMS_USAGE') }}</el-checkbox>
                  <!--
                  <el-checkbox v-model="checkboxSolution">{{ $t('SOLUTION') }}</el-checkbox>
                  <el-checkbox v-model="checkboxAgent">{{ $t('AGENT') }}</el-checkbox>
                  <el-checkbox v-model="checkboxCustomer">{{ $t('CUSTOMER') }}</el-checkbox>
                  <el-checkbox v-model="checkboxZeroSession">{{ $t('ZERO_SESSION') }}</el-checkbox>-->
                  <el-checkbox v-model="checkboxCustomField1">{{ $t('CUSTOMFIELD1') }}</el-checkbox>
                  <el-checkbox v-model="checkboxCustomField2">{{ $t('CUSTOMFIELD2') }}</el-checkbox>
                  <el-checkbox v-model="checkboxCustomField3">{{ $t('CUSTOMFIELD3') }}</el-checkbox>
                  <el-checkbox v-model="checkboxCustomField4">{{ $t('CUSTOMFIELD4') }}</el-checkbox>
                  <el-checkbox v-model="checkboxCustomField5">{{ $t('CUSTOMFIELD5') }}</el-checkbox>
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
                @selection-change="handleSelectionChange"
            >            
              <el-table-column
                align="center"
                type="selection"
                width="40">
              </el-table-column>
              <el-table-column :label="$t('MAP')" align="center" width="60px">
                <template slot-scope="{row}">
                  <img src="map-blue.svg" class="map-table-icon" @click="showLocation(row)"/>              
                </template>
              </el-table-column>
                <el-table-column :label="$t('IMSI')"   :class-name="getSortClass('imsi')" align="left" width="130px">
                  <template slot-scope="{row}">
                    <router-link class="link" :to="{ path: `/sim-list/${row.IMSI}` }">
                      {{ row.IMSI }}
                    </router-link>
                  </template>
                </el-table-column>
                <el-table-column v-if="checkboxICCID" :label="$t('ICCID')"  :class-name="getSortClass('ICCID')" align="left" width="160px">
                  <template slot-scope="{row}">
                    <span>{{ row.ICCID }}</span>
                  </template>
                </el-table-column>
                <el-table-column v-if="checkboxMSISDN" :label="$t('MSISDN')"  :class-name="getSortClass('MSISDN')" align="left" width="140px">
                  <template slot-scope="{row}">
                    <span>{{ row.MSISDN }}</span>
                  </template>
                </el-table-column>
                <el-table-column v-if="checkboxServiceProfile" :label="$t('SERVICEPROFILE')" :class-name="getSortClass('ServiceProfileCode')" align="left" min-width="180px">
                  <template slot-scope="{row}">
                    <span>{{ row.ServiceProfile }}</span>
                  </template>
                </el-table-column>
                <el-table-column v-if="checkboxState" label="State" width="90px" >
                  <template slot-scope="{row}">
                    <span>{{ row.State }}</span>
                  </template>
                </el-table-column>
                <el-table-column v-if="checkboxRAG" :label="$t('RAG')" align="center" min-width="60px">
                  <template slot-scope="{row}" align="center">
                    <div class="square" :class="row.rag"></div>
                  </template>
                </el-table-column>
                <el-table-column v-if="checkboxOrganize" :label="$t('CUSTOMER')" align="left" min-width="100px">
                  <template slot-scope="{row}">
                    <span>{{ row.OrganizeName }}</span>
                  </template>
                </el-table-column>
                <el-table-column v-if="checkboxDataSession" :label="$t('DATA_SESSION')" align="left" min-width="130px">
                  <template slot-scope="{row}">
                    <span>{{ row.dataSession }}</span>
                  </template>
                </el-table-column>
                <el-table-column v-if="checkboxDataUsage" :label="$t('DATA_USAGE')+'(Mb)'" :class-name="getSortClass('dataUsage')" align="left" min-width="120px">
                  <template slot-scope="{row}">
                    <span>{{ row.DataUsage }}</span>
                  </template>
                </el-table-column>
                <el-table-column v-if="checkboxSMSUsage" :label="$t('SMS_USAGE')"  :class-name="getSortClass('smsUsage')" align="left" min-width="120px">
                  <template slot-scope="{row}">
                    <span>{{ row.smsUsage }}</span>
                  </template>
                </el-table-column>
                <el-table-column v-if="checkboxPayPlan" :label="$t('PAYPLAN')"  :class-name="getSortClass('PayPlanCode')" align="left" min-width="100px">
                  <template slot-scope="{row}">
                    <span>{{ row.PayPlan }}</span>
                  </template>
                </el-table-column>
                <el-table-column v-if="checkboxIPAddress" :label="$t('IPADDRESS')"  align="left" min-width="100px">
                  <template slot-scope="{row}">
                    <span>{{ row.IPAddress }}</span>
                  </template>
                </el-table-column>
                <el-table-column v-if="checkboxCustomField1" :label="$t('CUSTOMFIELD1')"   align="left" min-width="120px">
                  <template slot-scope="{row}">
                    <span>{{ row.CustomField1 }}</span>
                  </template>
                </el-table-column>
                <el-table-column v-if="checkboxCustomField2" :label="$t('CUSTOMFIELD2')"  align="left" min-width="120px">
                  <template slot-scope="{row}">
                    <span>{{ row.CustomField2 }}</span>
                  </template>
                </el-table-column>
                <el-table-column v-if="checkboxCustomField3" :label="$t('CUSTOMFIELD3')"  align="left" min-width="120px">
                  <template slot-scope="{row}">
                    <span>{{ row.CustomField3 }}</span>
                  </template>
                </el-table-column>
                <el-table-column v-if="checkboxCustomField4" :label="$t('CUSTOMFIELD4')"  align="left" min-width="120px">
                  <template slot-scope="{row}">
                    <span>{{ row.CustomField4 }}</span>
                  </template>
                </el-table-column>
                <el-table-column v-if="checkboxCustomField5" :label="$t('CUSTOMFIELD5')"  align="left" min-width="120px">
                  <template slot-scope="{row}">
                    <span>{{ row.CustomField5 }}</span>
                  </template>
                </el-table-column>
                <el-table-column :label="'Update time'"  align="left" min-width="90px">
                  <template slot-scope="{row}">
                    <span>{{ row.update }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="Actions" align="center" width="100" class-name="small-padding fixed-width" fixed="right">
                <template slot-scope="{row,$index}">
                    <el-button type="primary" class="blue-btn" size="mini" @click="handleUpdate(row)">
                    {{ $t('TEXT_COMMON_EDIT') }}
                    </el-button>
                    <!--<el-button type="primary" class="violet-btn" size="mini" @click="remoteAccess(row.Token)">
                    Custom 
                    </el-button>
                    <el-button v-if="row.Status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
                    {{ $t('TEXT_COMMON_DELETE') }}
                    </el-button>
                    -->
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
                <el-col :xs="24" :sm="24">
                    <el-form-item :label="$t('CUSTOMFIELD1')" prop="CustomField1">
                    <el-input v-model="temp.CustomField1" />
                    </el-form-item>
                </el-col>         
                <el-col :xs="24" :sm="24">
                    <el-form-item :label="$t('CUSTOMFIELD2')" prop="CustomField2">
                    <el-input v-model="temp.CustomField2" />
                    </el-form-item>
                </el-col>    
                <el-col :xs="24" :sm="24">
                    <el-form-item :label="$t('CUSTOMFIELD3')" prop="CustomField3">
                    <el-input v-model="temp.CustomField3" />
                    </el-form-item>
                </el-col>    
                <el-col :xs="24" :sm="24">
                    <el-form-item :label="$t('CUSTOMFIELD4')" prop="CustomField4">
                    <el-input v-model="temp.CustomField4" />
                    </el-form-item>
                </el-col>    
                <el-col :xs="24" :sm="24">
                    <el-form-item :label="$t('CUSTOMFIELD5')" prop="CustomField5">
                    <el-input v-model="temp.CustomField5" />
                    </el-form-item>
                </el-col>                
                </el-row>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <!--<el-button v-show="dialogStatus !== 'create'" v-if="temp.State==2" class="green-btn" :loading="isChangeStateLoading" @click="onChangeState(1)">
                    {{'Enable'}}
                </el-button>
                <el-button v-show="dialogStatus !== 'create'" v-else type="danger" :loading="isChangeStateLoading" @click="onChangeState(2)">
                    {{'Disable'}}
                </el-button>-->
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
                    <el-form-item label="Query" prop="fromimsi" class="">
                    <el-input v-model="listQuery.q" placeholder="IMSI, ICCID, MSISDN..." class="filter-item" />
                    </el-form-item>
                </el-col>
                <el-col :xs="100" class="px-0">
                   <el-form-item label="Organize" prop="OrganizeCode">
                    <el-select v-model="listQuery.OrganizeCode">
                        <el-option v-for="item in organizeOptions" :key="item.Code" :label="item.Name" :value="item.Code" />
                    </el-select>
                    </el-form-item>
                </el-col>
                <el-col :xs="100" class="px-0">
                    <el-form-item label="From IMSI" prop="fromimsi" class="">
                    <el-input v-model="listQuery.FromIMSI" placeholder="From IMSI" class="filter-item" />
                    </el-form-item>
                </el-col>
                <el-col :xs="100" class="px-0">
                    <el-form-item label="To IMSI" prop="toimsi" class="">
                    <el-input v-model="listQuery.ToIMSI" placeholder="To IMSI" class="filter-item" />
                    </el-form-item>
                </el-col>
                <el-col :xs="100" class="px-0">
                    <el-form-item label="From ICCID" prop="fromiccid" class="">
                    <el-input v-model="listQuery.FromICCID" placeholder="From ICCID" class="filter-item" />
                    </el-form-item>
                </el-col>
                <el-col :xs="100" class="px-0">
                    <el-form-item label="To ICCID" prop="toiccid" class="">
                    <el-input v-model="listQuery.ToICCID" placeholder="To ICCID" class="filter-item" />
                    </el-form-item>
                </el-col><!--
                <el-col :xs="100" class="px-0">
                    <el-form-item label="IMSIs" prop="imsis" class="no-margin-bottom">
                    <el-input type="textarea" v-model="listQuery.IMSIs" placeholder="IMSIs" class="filter-item" />
                    </el-form-item>
                </el-col>
                <el-col :xs="100" class="px-0">
                    <el-form-item label="ICCIDs" prop="iccids" class="no-margin-bottom">
                    <el-input type="textarea" v-model="listQuery.ICCIDs" placeholder="ICCIDs" class="filter-item" />
                    </el-form-item>
                </el-col>
                <el-col :xs="100" class="px-0">
                    <el-form-item label="MSISDNs" prop="msisdns" class="no-margin-bottom">
                    <el-input type="textarea" v-model="listQuery.MSISDNs" placeholder="MSISDNs" class="filter-item" />
                    </el-form-item>
                </el-col>-->
                </el-row>
            </div>
            <!--
          <div class="content-divider"></div>
          <div class="padding-horizontal-x2">
            <el-row :gutter="16" style="">
              <el-col :xs="100">
                <el-form-item :label="$t('RAG')" prop="title" class="">
                  <el-checkbox @input="handleRAGChecked(0)"><span class="rag bg-color-red"></span></el-checkbox>
                  <el-checkbox @input="handleRAGChecked(1)"><span class="rag bg-color-yellow"></span></el-checkbox>
                  <el-checkbox @input="handleRAGChecked(2)"><span class="rag bg-color-green"></span></el-checkbox>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="content-divider"></div>
          <div class="padding-horizontal-x2">
            <el-form-item :label="$t('STATE')" prop="title" class="">
              <el-row :gutter="16" style="">
                <el-col :span="12">
                  <el-checkbox  v-model="searchedStates.Productive">{{ $t('PRODUCTIVE') }}</el-checkbox>
                </el-col>
                <el-col :span="12">
                  <el-checkbox  v-model="searchedStates.OnStock">{{ $t('ON_STOCK') }}</el-checkbox>
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
          </div>       -->   
        </el-form>
      </div>
    </el-aside>
</el-container>  
</template>

<script>
import L from 'leaflet'
import { LMap, LTileLayer, LMarker, LControlLayers, LPolyline, LFeatureGroup, LPopup } from 'vue2-leaflet'
import { latLng, Icon, icon } from 'leaflet'

import { parseTime } from '@/utils'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'

import waves from '@/directive/waves' // waves directive
import { mapGetters } from 'vuex'

import { qtRemoteLogin } from '@/api/user'
import Pagination from '@/components/Pagination'
import { SIMStatusList, LanguageList, TimeZoneList, DateTimeFormatList, CountyList, DistanceUnitList, EconomyUnitList, VolumeUnitList, TemperatureUnitList, PressureUnitList } from "@/utils/dictionaries";
//import { sortArrayByObjProps } from "@/utils/helpers";
import { fetchSIMPosition, fetchCustomersList, setActivateState, setSuspendState, setResumeState, setTerminateState, setServiceProfileOptions, fetchServiceProfileOptions, fetchSIMList, createSIM, updateSIM, deleteCustomer, fetchServiceProfileList, changeOrgState, moveSIMs } from "@/api/user";
//import { fetchRoleList } from "@/api/role-managment";
import Item from '@/layout/components/Sidebar/Item'
import { getSIMListAsync, getSIM, getSIMAsync, getCustomerList, getSIMCoordinates, getSIMCountry, forceReconnectAsync } from '@/api/sim'
import moment from 'moment'

export default {
  name: 'Customers',
  components: { Pagination, 
  Item,
  Loading, 
    LMap, 
    LTileLayer, 
    LMarker, 
    LControlLayers, 
    LPolyline, 
    LFeatureGroup, 
    LPopup
     },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        'Activated': 'success',
        'OnStock': 'default',
        'Ordered': 'primary',
        'Test': 'info',
        'TestProductive': 'info',
        'TestEnd': 'info',
        'Productive': 'primary',
        'Suspended': 'warning',
        'AutoSuspended': 'warning',
        'Deleted': 'danger',
        'Paused': 'warning',
        'Lost': 'danger',
        'Reserved': 'primary',
        'Deleting': 'danger',
        'EuiccControl': 'info',
        'Passive': 'warning'
      }
      return statusMap[status]
    },
  },
  data() {
    let customicon = icon(Object.assign({},
        Icon.Default.prototype.options,
        {
          iconUrl:'map-blue.svg',
          iconRetinaUrl:'map-blue.svg',
          shadowUrl:''
        }
      ))

    return {
      queryLBS: {
        imsi: ''
      },
      locationList: [
        {title: 'IMSI', value: ''},
        {title: 'Network Operator', value: ''},
        {title: 'Area', value: ''},
        {title: 'Longitude', value: ''},
        {title: 'Latitude', value: ''},
        {title: 'Country', value: ''},
        {title: 'Cell', value: ''},        
        {title: 'Time Update', value: ''},
        {title: 'Current Session Date', value: ''},
        {title: 'Current Usage', value: ''}
      ],
      isLoading: false,
      fullPage: true,      
      mapFormVisible: false,
      moveFormVisible: false,
      stateFormVisible: false,
      sspFormVisible: false,
      checkboxICCID: false,
      checkboxMSISDN: false,
      checkboxServiceProfile: true,
      checkboxOrganize: true,
      checkboxICCID: false,
      checkboxMSSDN: false,
      checkboxPayPlan: false,
      checkboxState: true,
      checkboxIPAddress: false,
      checkboxRAG: true,
      checkboxCustomField1: false,
      checkboxCustomField2: false,
      checkboxCustomField3: false,
      checkboxCustomField4: false,
      checkboxCustomField5: false, 
      checkboxDataSession: true,
      checkboxDataUsage: true,
      checkboxSMSUsage: true,
      searchedParent: '',
      selectedNumber: '',
      selectedRemark: '',
      organizeOptions: [],
      tempMove: {        
        Organize: null,
        Remark: '',
        Number: ''
      },
      selectedState: 0,
      isRightPanelVisible: true,
      filterSubmitId: Date.now(),
      tableKey: 0,
      list: null,
      total: 0,
      isListLoading: true,
      listQuery: {
        Page: 1,
        Rows: 10,
        Order: 'ASC',
        Sort: 'IMSI',
      },
      //searchedStates: {
        //Productive: true,
        //OnStock: true
      //},
      //importanceOptions: ['Event'],
      //calendarTypeOptions,
      //sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      //statusOptions: ['published', 'draft', 'deleted'],
      //showReviewer: false,
      statusTypeOptions: SIMStatusList,
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
			month_names_short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      //provinceOptions: [],
      //cityOptions: [],
      serviceProfileOptions: [],
      stateOptions: [],
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
       rulesMove: {
        Remark: [{ required: false, message: 'Remark cannot be longer than 100 characters', max: 100 }],
        Number: [{ required: false, message: 'Number cannot be longer than 50 characters', max: 50 }],
        Organize: [{ required: true, message: 'Organize is required', trigger: 'change' }],
       },
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
        ServiceProfileCode: [{ required: true, message: 'Parent is required', trigger: 'change' }],
        WebSiteCode: [{ required: true, message: 'Parent is required', trigger: 'change' }],
      },
      downloadLoading: false,
      multipleSIMSelection: [],
      selectedServiceProfile: 0,

      zoom: 13,
      center: L.latLng(0, 0),
      map: '',
      tileProviders: [
        {
          name: 'Map',
          visible: true,
          url: 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
          subdomains: ['mt0','mt1','mt2','mt3']
        },
        {
          name: 'OpenStreetMap',
          visible: false,
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        },
        {
          name: 'Satelitte',
          visible: false,
          url: 'https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
          subdomains: ['mt0','mt1','mt2','mt3']
        },
        /*{
          name: 'OpenStreetMap',
          visible: true,
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        },*/
      ],
      markerIcon: customicon,
      markerLatLng: [0, 0],//47.413220, -1.219482
    }
  },
  created() {
    this.getList()
    //this.getCSPOptions()
    this.getServiceProfileOptions()
    this.getStateOptions()
    this.getOrganizeOptions()
    /*this.getCountryOptions()
    this.getWebSiteOptions()
    this.getLanguageOptions()
    this.getTimeZoneOptions()
    this.getDateTimeFormatOptions()*/
    //this.getParentRoles()
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {    
    /*handleRAGChecked(val){
      console.log('rag', val)
    },
    handleStateChecked(val){
      console.log('state', val)
      this.listQuery[val]=!this.listQuery[val]
    },*/
    
    doSomethingOnReady() {
        this.map = this.$refs.map.mapObject
        this.map.invalidateSize()
    },
    showLocation(data){
      this.isLoading = true      
      let self = this

      this.queryLBS = {
				  imsi: [data.IMSI]
				}
				
				let settingsLBS = {
				  "url": "https://test4.m2mdata.co/JT/Sim/QueryLBSInfo",
				  "method": "POST",
				  "timeout": 0,
				  "headers": {
					"token": "00000000-0000-0000-0000-000000000000",
					"Content-Type": "application/x-www-form-urlencoded"
				  },
				  "data": this.queryLBS
				};

				$.ajax(settingsLBS).done(function (result) {
          const activityTime = result.Data.DataUpdateTime
          let utcActivityDate = moment.utc(activityTime).toDate()
          let utcDate = utcActivityDate.getDate() + ' ' + self.month_names_short[utcActivityDate.getMonth()] + ' ' + utcActivityDate.getFullYear() + ' ' + ('0' + utcActivityDate.getHours()).slice(-2) + ':' + ('0' + utcActivityDate.getMinutes()).slice(-2) + ':' + ('0' + utcActivityDate.getSeconds()).slice(-2)
                      
        
          self.locationList[0].value = result.Data.IMSI
          self.locationList[1].value = result.Data.LbsNetwork
          self.locationList[2].value = result.Data.LbsArea
          self.locationList[6].value = result.Data.LbsRadio + ' ' + result.Data.LbsRange
          self.locationList[7].value = utcDate
          self.locationList[8].value = result.Data.SessionDay
          self.locationList[9].value = (result.Data.DataDay/1048576).toFixed(3)
          const query_1 = {
            lat: result.Data.LbsLat,
            lon: result.Data.LbsLng
          }
             
          if(result.Data.LbsLat != null){
          self.markerLatLng = [query_1?.lat, query_1?.lon]
          self.center = L.latLng(query_1?.lat, query_1?.lon)
          self.locationList[3].value = query_1?.lat
          self.locationList[4].value = query_1?.lon       
            getSIMCountry(query_1).then(response_1 => {
              const country = response_1.data.address.country
              self.locationList[5].value = country
              self.mapFormVisible = true
              self.isLoading = false
            })
          }else{
            self.markerLatLng = [0, 0]
            self.center = L.latLng(0, 0)
            self.locationList[3].value = ''
            self.locationList[4].value = ''   
            self.locationList[5].value = ''
              self.mapFormVisible = true
              self.isLoading = false
          }
          
        })
    },
    showStateForm(){
      this.isLoading = true    
      
      this.stateFormVisible = true
      this.isLoading = false 
    },
    showMoveForm(){
      this.isLoading = true    
      
      this.moveFormVisible = true
      this.isLoading = false     
    },
    showCSPForm(){
      this.isLoading = true    
      
      this.sspFormVisible = true
      this.isLoading = false 
    },    
    async acctivateSIM(){
      let checkSIM = true
      const arr = []
      for (let i = 0; i < this.multipleSIMSelection.length; i++) {
        if(this.multipleSIMSelection[i].State == 'OnStock' || this.multipleSIMSelection[i].State == 'TestProductive'){
          arr.push(this.multipleSIMSelection[i].IMSI)
        }else{
          checkSIM = false
        }
      }

      if(!checkSIM || this.multipleSIMSelection.length == 0){
        this.$alert('Only support the sim state in OnStock / TestProductive', 'M2M Data Message', {type: 'message'}) 
            
      }else{
        
        const query = {
          IMSIs: arr,
          ServiceProfileCode: this.selectedServiceProfile
        }   

        const response = await setActivateState(query).then(r=>{
          if(r.MajorCode == '000'){            
          this.$alert('Activated', 'M2M Data Message', {type: 'message'})
          this.getList()
          }else{
            this.$alert('State was not submitted', 'M2M Data Message', {type: 'message'})
          }
        }).catch(e=>{
          this.$alert('SIM/s can not be activated', 'M2M Data Message', {type: 'message'})
        })
      }
    },
    async saveState(){
      let checkSIM = true
      const arr = []
      for (let i = 0; i < this.multipleSIMSelection.length; i++) {        
        switch(this.selectedState){
          case '0':
            if(this.multipleSIMSelection[i].State == 'Productive' || this.multipleSIMSelection[i].State == 'TestProductive'){
              arr.push(this.multipleSIMSelection[i].IMSI)
              
            }else{
              checkSIM = false 
            }  
            break;
          case '1':
            if(this.multipleSIMSelection[i].State == 'Suspended'){
              arr.push(this.multipleSIMSelection[i].IMSI)
            }else{
              checkSIM = false 
            }  
            break;
          case '2':
            if(this.multipleSIMSelection[i].State == 'Productive' || this.multipleSIMSelection[i].State == 'TestProductive'  || this.multipleSIMSelection[i].State == 'Suspended'){
              arr.push(this.multipleSIMSelection[i].IMSI)
             }else{
              checkSIM = false 
            }  
            break;
        }               
      }
      if(!checkSIM || this.multipleSIMSelection.length == 0){
        switch(this.selectedState){
          case '0':
            this.$alert('Only support the sim state in Productive / TestProductive', 'M2M Data Message', {type: 'message'})
            break;
          case '1':
             this.$alert('Only support the sim state in Suspended', 'M2M Data Message', {type: 'message'})
            
            break;
          case '2':
             this.$alert('Only support the sim state in Productive / TestProductive / Suspended', 'M2M Data Message', {type: 'message'})
            
            break;
        }
         
        this.stateFormVisible = false
      }else{
         const query = {
          IMSIs: arr
        }   
        switch(this.selectedState){
          case '0':
            const response1 = await setSuspendState(query).then(r=>{
              if(r.MajorCode == '000'){            
          this.$alert('Set suspend successfuly', 'M2M Data Message', {type: 'message'})
              this.stateFormVisible = false
              this.getList()
              }else{
                this.$alert('State was not submitted', 'M2M Data Message', {type: 'message'})
              }
            }).catch(e=>{
              this.$alert('SIM/s can not be suspended', 'M2M Data Message', {type: 'message'})
            })
            break;
          case '1':
            const response2 = await setResumeState(query).then(r=>{
              if(r.MajorCode == '000'){            
          this.$alert('Set resume successfuly', 'M2M Data Message', {type: 'message'})
              this.stateFormVisible = false
              this.getList()
              }else{
              this.$alert('State was not submitted', 'M2M Data Message', {type: 'message'})
            }
            }).catch(e=>{
              this.$alert('SIM/s can not resume', 'M2M Data Message', {type: 'message'})
            })
            break;
          case '2':
            const response3 = await setTerminateState(query).then(r=>{
              if(r.MajorCode == '000'){            
          this.$alert('SIM/s terminated', 'M2M Data Message', {type: 'message'})
              this.stateFormVisible = false
              this.getList()
              }else{
              this.$alert('State was not submitted', 'M2M Data Message', {type: 'message'})
            }
            }).catch(e=>{
              this.$alert('SIM/s can not be terminated', 'M2M Data Message', {type: 'message'})
            })
            break;
        }
      }            
    },
    async saveServiceProfile(){
      let checkSIM = false
      const arr = []
      for (let i = 0; i < this.multipleSIMSelection.length; i++) {        
        arr.push(this.multipleSIMSelection[i].IMSI)
        checkSIM = true 
      }
      if(!checkSIM){
        this.$alert('There are no SIM to Set Service Profile', 'M2M Data Message', {type: 'message'}) 
        this.sspFormVisible = false
      }else{
        const query = {
          IMSIs: arr,
          ServiceProfileCode: this.selectedServiceProfile
        }   
        const response = await setServiceProfileOptions(query).then(r=>{
          if(r.MajorCode == '000'){            
            this.$alert('Service Profile was set successfully', 'M2M Data Message', {type: 'message'})
            this.sspFormVisible = false
            this.getList()
          }else{
            this.$alert('CSP was not submitted', 'M2M Data Message', {type: 'message'})
          }
        }).catch(e=>{
          this.$alert('Something wrong...', 'M2M Data Message', {type: 'message'})
        })
      }            
    },
    async handleMoveSIMs(){
       this.$refs['dataFormMove'].validate(async (valid) => {
        if (!valid){
          return false
        }

      let checkSIM = false
      const arr = []
      for (let i = 0; i < this.multipleSIMSelection.length; i++) {        
        arr.push(this.multipleSIMSelection[i].IMSI)
        checkSIM = true 
      }
      if(!checkSIM){
        this.$alert('There are no SIM to move', 'M2M Data Message', {type: 'message'}) 
        this.moveFormVisible = false
      }else{
        const query = {
          IMSIs: arr,
          toorganizecode: this.tempMove.Organize,
          Number: this.tempMove.selectedNumber,
          Remark: this.tempMove.selectedRemark
        }   
        const response = await moveSIMs(query).then(r=>{
          if(r.MajorCode == '000'){            
            this.$alert('SIMs was moved successfully', 'M2M Data Message', {type: 'message'})
            this.moveFormVisible = false
            this.getList()
          }else{
            this.$alert('SIMs was not moved', 'M2M Data Message', {type: 'message'})
          }
        }).catch(e=>{
          this.$alert('Something wrong...', 'M2M Data Message', {type: 'message'})
        })
      }            
       })
    },
    handleSelectionChange(val) {
      this.multipleSIMSelection = val
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
    /*async searchParent(query) {
      const arr = []      
      this.parentArr = []
      this.parentListQuery = {
        Name: query
      }
      
      let response = await fetchSIMList(this.parentListQuery)
      //getSIMList(this.simListQuery).then(response => {
        response.rows.forEach(element => {
          arr.push({
            code: element.Code,
            title: element.Name
          })
        })
        this.parentArr = arr
      //})      
    },*/
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
          //console.log('ok',response)
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
      let self = this
      const arr = []
      let currentTime = moment();
      let halfDayAgo = moment(currentTime, 'YYYY-MM-DD HH').add(-12, 'hours').format('YYYY-MM-DD HH'); 
      let oneDayAgo = moment(currentTime, 'YYYY-MM-DD HH').add(-1, 'days').format('YYYY-MM-DD HH'); 
      let threeDayAgo = moment(currentTime, 'YYYY-MM-DD HH').add(-3, 'days').format('YYYY-MM-DD HH');
          
      this.isListLoading = true         
      
      let response = await fetchSIMList(this.listQuery) 
       if(!response){
        return
      }
      response.rows.forEach(async element_1 => {
        const activityTime = element_1.DataUpdateTime;
        let rag = 'bg-color-grey'
        let jsonDataArr = []
        let dataSession = 0
        let totalSumm = 0
        let simActivityTime = moment(activityTime, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
            
        if(activityTime){
          if(simActivityTime >= halfDayAgo){
            rag = 'bg-color-green'
          }else if(simActivityTime >= oneDayAgo && simActivityTime < halfDayAgo){
            rag = 'bg-color-yellow'
          }else {
            rag = 'bg-color-red'
          }
        }else{

        }
            
/*
        const responseActiveSession = await fetch(`https://m2mdata.co/jt/GetActiveSession?imsi=${element_1.IMSI}`)
        let resActiveSession = await responseActiveSession.json()
                        
        if(resActiveSession.Data){
          if(resActiveSession.Data.startDateField == null){
            
          
          }else if(resActiveSession.Data.lastInterimDateField == null){
            rag = 'bg-color-green'
            let startDate = moment.utc(resActiveSession.Data.startDateField).toDate()
            let utcDate = startDate.getDate() + ' ' + self.month_names_short[startDate.getMonth()] + ' ' + startDate.getFullYear() + ' ' + ('0' + startDate.getHours()).slice(-2) + ':' + ('0' + startDate.getMinutes()).slice(-2) + ':' + ('0' + startDate.getSeconds()).slice(-2)
              
            update = utcDate
          }else{
            const simActivityTime = moment(resActiveSession.Data.lastInterimDateField, 'YYYY-MM-DD HH').format('YYYY-MM-DD HH')
            let startDate = moment.utc(resActiveSession.Data.lastInterimDateField).toDate()
						let utcDate = startDate.getDate() + ' ' + self.month_names_short[startDate.getMonth()] + ' ' + startDate.getFullYear() + ' ' + ('0' + startDate.getHours()).slice(-2) + ':' + ('0' + startDate.getMinutes()).slice(-2) + ':' + ('0' + startDate.getSeconds()).slice(-2)
										 
            update = utcDate
                    
          if(simActivityTime >= halfDayAgo){
              rag = 'bg-color-green'
            }else if(simActivityTime >= oneDayAgo && simActivityTime < halfDayAgo){
              rag = 'bg-color-yellow'
            }else {
              console.log('red1', simActivityTime, oneDayAgo, halfDayAgo)
              rag = 'bg-color-red'
            }
          }
        } 
        
        var listQuery_1 = {
            imsi: element_1.IMSI
        }
        
        var settings_1 = {
            "url": "https://test4.m2mdata.co/JT/Sim/GETSESSIONS",
            "method": "POST",
            "timeout": 0,
            "headers": {
            "token": "00000000-0000-0000-0000-000000000000",
            "Content-Type": "application/x-www-form-urlencoded"
            },
            "data": listQuery_1
        };
                            				
          	
          $.ajax(settings_1).done(  function (result_1) {           
            if(result_1.Data != null && result_1.Data.length){
              let dataArr = result_1.Data.split('\r\n')
              dataArr.pop()									
              dataArr.forEach((element, index) => {
                let dataJson = element.split(',')
                let startDate = moment.utc(dataJson[4]).toDate()
                let endDate = moment.utc(dataJson[5]).toDate()											
                
                let jsonDataObj = {
                  startUTC: startDate,
                  start: startDate.getDate() + ' ' + self.month_names_short[startDate.getMonth()] + ' ' + startDate.getFullYear() + ' ' + ('0' + startDate.getHours()).slice(-2) + ':' + ('0' + startDate.getMinutes()).slice(-2) + ':' + ('0' + startDate.getSeconds()).slice(-2),
                  end: endDate.getDate() + ' ' + self.month_names_short[endDate.getMonth()] + ' ' + endDate.getFullYear() + ' ' + ('0' + endDate.getHours()).slice(-2) + ':' + ('0' + endDate.getMinutes()).slice(-2) + ':' + ('0' + endDate.getSeconds()).slice(-2),
                  total: dataJson[3],
                  operator: dataJson[1]+dataJson[2]
                }
                jsonDataArr.push(jsonDataObj)
              })								
                         
              dataSession = jsonDataArr.filter(el=>{
                let isTrue = moment(el.startUTC, 'YYYY-MM-DD').format('YYYY-MM-DD')>=moment(halfDayAgo, 'YYYY-MM-DD').format('YYYY-MM-DD')
                if(isTrue){
                  totalSumm += +el.total
                }
                return isTrue
              }).length
              //console.log(dataSessionArr)//.length

              
          if(update.length==0){		
            let sortedArr = jsonDataArr.sort(function(a,b){
                var c = new Date(a.start)
                var d = new Date(b.start)
                return d-c
              })
              
              update = sortedArr[0].end
              const simActivityTime = moment(update, 'YYYY-MM-DD HH').format('YYYY-MM-DD HH')

              if(simActivityTime >= halfDayAgo){
                rag = 'bg-color-green'
              }else if(simActivityTime >= oneDayAgo && simActivityTime < halfDayAgo){
                rag = 'bg-color-yellow'
              }else {
              console.log('red2', simActivityTime, oneDayAgo, halfDayAgo)
                rag = 'bg-color-red'
              }									
            }
          }*/
        
          arr.push({
            IMSI: element_1.IMSI.toString(),
            ICCID: element_1.ICCID.toString(),
            MSISDN: element_1.MSISDN.toString(),
            ServiceProfile: element_1.ServiceProfileCode,
            State: element_1.State,
            rag,
            update: simActivityTime!='Invalid date'?simActivityTime:'',
            OrganizeName: element_1.OrganizeName,          
            dataSession: element_1.SessionDay.toString(),         
            smsUsage: (element_1.SMSMODay + element_1.SMSMTDay).toString(),    
            DataUsage: element_1.DataDay?(element_1.DataDay/1048576).toFixed(3).toString():0,     
            PayPlan: element_1.PayPlanCode,
            IPAddress: element_1.IPAddress,
            CustomField1: element_1.CustomField1,
            CustomField2: element_1.CustomField2,
            CustomField3: element_1.CustomField3,
            CustomField4: element_1.CustomField4,
            CustomField5: element_1.CustomField5,
          })
        
          self.isListLoading = false
          self.total = response.total
          self.list = arr
        //})
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
    },*/
    async getOrganizeOptions(){      
      //this.listQuery.OrganizeCode = this.$store.getters.userInfo.OrganizeCode
      const arr = []
      let response = await fetchCustomersList()
      console.log('cust', response)
      response.rows.forEach(element => {
        arr.push({
          Code: element.Code,
          Name: element.Name
        })
      })
       
      this.organizeOptions = [{
        Name: this.userInfo.OrganizeName,
        Code: this.userInfo.OrganizeCode
      }].concat(arr)
    },    
    getStateOptions(){
      this.stateOptions = [
        /*{'Code': '0', 'Name': 'Activate'},*/
        {'Code': '0', 'Name': 'Suspend'},
        {'Code': '1', 'Name': 'Resume'},
        {'Code': '2', 'Name': 'Terminate'}
      ]
      this.selectedState = this.stateOptions[0].Code
    },
    async getServiceProfileOptions(){      
      const response = await fetchServiceProfileOptions()
      if(!response){
        return
      }
      this.serviceProfileOptions = response.Data
      this.selectedServiceProfile = this.serviceProfileOptions[0].Code
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
            
      //this.listQuery.IMSIs = this.listQuery.IMSIs.split('\n')
      /*let tofilter = this.listQuery.IMSIs.split('\n')
      let filtered = tofilter.filter(function (el) {
        return el != null
      })
      this.listQuery.IMSIs = filtered*/

     // this.listQuery.ICCIDs = this.listQuery.ICCIDs.split('\n')
     // this.listQuery.MSISDNs = this.listQuery.MSISDNs.split('\n')
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
      this.temp = {        
        Language: LanguageList.find(e=>e.Code==='EN'),
        TimeZoneCode: TimeZoneList[0],
        DateTimeFormat: DateTimeFormatList[0],
        DistanceUnit: DistanceUnitList[0],
        EconomyUnit: EconomyUnitList[0],
        VolumeUnit: VolumeUnitList[0],
        TemperatureUnit: TemperatureUnitList[0],
        PressureUnit: PressureUnitList[0],
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
      let response = await deleteCustomer({ Code: row.Code })
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

      this.parentOptions = [{
        Name: this.userInfo.OrganizeName,
        Code: this.userInfo.OrganizeCode
      }].concat(this.list)
    },
    onEditFormSubmit(){
      //let tempData = Object.assign({}, this.temp)
      
      this.$refs['dataForm'].validate(async (valid) => {
        if (!valid){
          return false
        }
        
        this.isFormLoading = true
        
        const {IMSI, CustomField1, CustomField2, CustomField3, CustomField4, CustomField5} = this.temp
        const tempData = {IMSI, CustomField1, CustomField2, CustomField3, CustomField4, CustomField5}
        let response = this.dialogStatus === 'create' ? await createSIM(tempData) : await updateSIM(tempData)
       
        this.isFormLoading = false
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
    async onChangeState(state){
      this.isChangeStateLoading = true;
      let response = await changeOrgState({ Code: this.temp.Code, State: state })
      this.isChangeStateLoading = false;
      if(!response){
        return
      }
      this.$notify({
        title: 'Success',
        message: 'State Changed Successfully',
        type: 'success',
        duration: 2000
      })
    },
    /*onParentCodeChange(value){
      this.getParentRoles(value)
      //console.log(event)
    },
    onServiceProfileChange(value){ 
    },
    */
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['IMSI', 'ICCID', 'MSISDN', 'Service Profile', 'State', 'Customer', 'Session', 'Usage', 'SMS Usage', 'Update time', 'IPAddress','Pay Plan']
        const filterVal = ['IMSI', 'ICCID', 'MSISDN', 'ServiceProfile', 'State', 'OrganizeName', 'dataSession', 'DataUsage', 'smsUsage', 'update', 'IPAddress','PayPlan']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'sim-list'
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
    },
    async forceReconnect(){      
      this.isLoading = true
      let self = this
      //const response = await forceReconnectAsync(this.simQuery)     
      let queryLBS = {
				  IMSIs: [this.queryLBS.imsi]
				}
				
				let settingsLBS = {
				  "url": "https://test4.m2mdata.co/JT/Sim/Reboot",
				  "method": "POST",
				  "timeout": 0,
				  "headers": {
					"token": "00000000-0000-0000-0000-000000000000",
					"Content-Type": "application/x-www-form-urlencoded"
				  },
				  "data": queryLBS
				};

				$.ajax(settingsLBS).done(function (result) {
            self.isLoading = false
					if(result.MajorCode == '000'){            
            self.mapFormVisible = false
            //self.showLocation()
            self.$alert('Sim connection refreshed', 'M2M Data Message', {type: 'message'})
          }else{
            self.$alert('Sim connection was not refreshed', 'M2M Data Message', {type: 'message'})
          }
        })    
    },
    /*getStatusText(status){
      return this.$t(this.statusTypeOptions.find( itm => itm.Code === parseInt(status)).Translation)
    },*/
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
    font-size: 12px;
}
.location-table td, .location-table th {
    padding: 10px 0 !important;
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
    border-color: #d9ebf3;
}
.sim-list-page div.square {
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
.bg-white .el-dialog {
    background-color: #ffffff !important;
}
 .bg-blue .el-dialog {
    background-color: #f2f5fb !important;
}


.el-dialog__body{
    padding: 20px;
}
.el-dialog__header{
    padding: 20px;
}
.el-dialog__footer{    
    padding: 20px;
}

.bg-white .el-dialog__header{
    border-bottom: 1px solid #e3e3e3;
}


.bg-color-grey{
  background-color: #e3e3e3;
}

.bg-color-blue{
  background-color: rgb(92, 174, 230);
}

.bg-color-yellow{
  background-color: #ffb880;
}

.bg-color-green{
  background-color: #34bfa3;
}
.bg-color-red{
  background-color: #d47980;
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

  .mt-10{
    margin-top: 10px;
  }

</style>

<style scoped lang="scss">



</style>