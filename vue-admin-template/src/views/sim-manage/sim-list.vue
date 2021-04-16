<template>
<el-container v-if="Permission['SIM_LIST']>0" class="with-panel-wrapper sim-list-page" :class="{'panel-opened': isRightPanelVisible}">
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
  

  
  <el-dialog title="Move SIMs to" :visible.sync="moveFormVisible" width="70%" class="bg-white" >
      <el-form ref="dataFormMove" :rules="rulesMove" :model="tempMove" label-position="top" label-width="70px"><!-- @submit.native.prevent="onMoveFormSubmit"-->
        <input type="submit" class="display-none" >

        <el-row :gutter="16">
          
          <el-col :xs="24" :sm="12">
            <el-form-item :label="$t('ORGANIZE')" prop="Organize" class="">
              <el-select
                ref="organizeSearchSelect"
                v-model="searchedOrganizeName"
                :remote-method="querySearchOrganize"
                filterable
                default-first-option
                clearable
                remote
                placeholder="Organize Name"
                class="organize-search-select"
                @change="changeOrganize"
              >
                <el-option v-for="item in organizeArr" :key="item.Code" :value="item" :label="item.Name" />
              </el-select>
            </el-form-item>
            <!--<el-form-item :label="'Organize'" prop="Organize">
            <el-select v-model="tempMove.Organize" :placeholder="$t('ORGANIZE')" class="">
              <el-option v-for="item in organizeOptions" :key="item.Code" :label="item.Name" :value="item.Code" />
            </el-select>
            </el-form-item>-->
        </el-col>
        <el-col :xs="24" :sm="12">            
            
            <el-form-item :label="'Send To'" prop="SendWay">
            <el-select v-model="tempMove.sendWay" :placeholder="'Send To'" class="">
              <el-option v-for="item in sendWayOptions" :key="item.Code" :label="item.Name" :value="item.Code" />
            </el-select>
            </el-form-item>
        </el-col>
          <el-col v-if="tempMove.sendWay==1" :xs="24" :sm="12">            
              <el-form-item :label="'From IMSI'" prop="FromIMSI">
                <el-input v-model="tempMove.FromIMSI"  :placeholder="'From IMSI'"/>
              </el-form-item>
          </el-col>
          <el-col v-if="tempMove.sendWay==1" :xs="24" :sm="12">            
              <el-form-item :label="'To IMSI'" prop="ToIMSI">
                <el-input v-model="tempMove.ToIMSI"  :placeholder="'To IMSI'"/>
              </el-form-item>
          </el-col>
          <el-col v-if="tempMove.sendWay==2" :xs="24" :sm="12">            
              <el-form-item :label="'From ICCID'" prop="FromICCID">
                <el-input v-model="tempMove.FromICCID"  :placeholder="'From ICCID'"/>
              </el-form-item>
          </el-col>
          <el-col v-if="tempMove.sendWay==2" :xs="24" :sm="12">            
              <el-form-item :label="'To ICCID'" prop="ToICCID">
                <el-input v-model="tempMove.ToICCID"  :placeholder="'To ICCID'"/>
              </el-form-item>
          </el-col>
          <el-col v-if="tempMove.sendWay==3" :xs="24" :sm="24">            
              <el-form-item :label="'To IMSI List'" prop="ToIMSIs">                
                <el-input type="textarea" v-model="mIMSIs" placeholder="IMSIs" class="filter-item" />
              </el-form-item>
          </el-col>
          <el-col v-if="tempMove.sendWay==4" :xs="24" :sm="24">            
              <el-form-item :label="'To ICCID List'" prop="ToICCIDs">                
                <el-input type="textarea" v-model="mICCIDs" placeholder="ICCIDs" class="filter-item" />
              </el-form-item>
          </el-col>
        
        <el-col :xs="24" :sm="12">            
            <el-form-item :label="'Number'" prop="Number">
              <el-input v-model="tempMove.Number"  :placeholder="'Number'"/>
            </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12">            
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
              <el-option  v-for="item in stateOptions" :key="item.Code" :label="item.Name" :value="item.Code" />
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
                    <div v-if="Permission['SIM_LIST']>1">
                      <el-button v-if="Permission['SIM_ACTIVATE']>1" v-waves class="button-custom" @click="acctivateSIM"><item :icon="'activation'"/> {{ $t('ACTIVATION') }}</el-button>
                      <el-button  v-if="Permission['SIM_SUSPEND_RESUME']>1||Permission['SIM_TERMINATE']>1" v-waves class="button-custom" @click="showStateForm"><item :icon="'state'"/> {{ $t('STATE') }}</el-button>
                      <el-button  v-if="Permission['SIM_MOVE']>1" v-waves class="button-custom" @click="showMoveForm"><item :icon="'sim-blue'"/> {{ $t('MOVE_SIM') }}</el-button>
                      <el-button v-if="Permission['SIM_CHANGE_CSP']>1" v-waves class="button-custom" @click="showCSPForm"><item :icon="'csp-blue'"/> {{ $t('SERVICEPROFILE') }}</el-button>
                      <!--<el-button v-waves class="button-custom"><item :icon="'profile-blue'"/> {{ $t('CUSTOM') }}</el-button>
                      <el-button v-waves class="button-custom"><item :icon="'solution-blue'"/> {{ $t('SOLUTION') }}</el-button>-->
                    </div>
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
                :default-sort = "{prop: 'IMSI', order: 'ascending'}"
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
                <el-table-column :label="$t('IMSI')"  sortable :class-name="getSortClass('IMSI')" prop="IMSI" align="left" width="130px">
                  <template slot-scope="{row}">
                    <router-link class="link" :to="{ path: `/sim-list/${row.IMSI}` }">
                      {{ row.IMSI }}
                    </router-link>
                  </template>
                </el-table-column>
                <el-table-column v-if="checkboxICCID" sortable :label="$t('ICCID')"  :class-name="getSortClass('ICCID')" prop="ICCID" align="left" width="160px">
                  <template slot-scope="{row}">
                    <span>{{ row.ICCID }}</span>
                  </template>
                </el-table-column>
                <el-table-column v-if="checkboxMSISDN" sortable :label="$t('MSISDN')"  :class-name="getSortClass('MSISDN')" prop="MSISDN" align="left" width="140px">
                  <template slot-scope="{row}">
                    <span>{{ row.MSISDN }}</span>
                  </template>
                </el-table-column>
                <el-table-column v-if="checkboxServiceProfile" sortable :label="$t('SERVICEPROFILE')" :class-name="getSortClass('ServiceProfileCode')" prop="ServiceProfileCode" align="left" min-width="130px">
                  <template slot-scope="{row}">
                    <span>{{ row.ServiceProfile }}</span>
                  </template>
                </el-table-column>
                <el-table-column v-if="checkboxState" sortable :class-name="getSortClass('State')" prop="State" label="State" width="90px" >
                  <template slot-scope="{row}">
                    <span>{{ row.State }}</span>
                  </template>
                </el-table-column>
                <el-table-column v-if="checkboxRAG" sortable :class-name="getSortClass('RAG')" prop="RAG" :label="$t('RAG')" align="center" min-width="60px">
                  <template slot-scope="{row}" align="center">
                    <div class="square" :class="row.rag"></div>
                  </template>
                </el-table-column>
                <el-table-column v-if="checkboxOrganize" sortable :class-name="getSortClass('OrganizeName')" prop="OrganizeName" :label="$t('CUSTOMER')" align="left" min-width="100px">
                  <template slot-scope="{row}">
                    <span>{{ row.OrganizeName }}</span>
                  </template>
                </el-table-column>
                <el-table-column v-if="checkboxDataSession" sortable :class-name="getSortClass('SessionDay')" prop="SessionDay" :label="'Session'" align="left" min-width="70px">
                  <template slot-scope="{row}">
                    <span>{{ row.dataSession }}</span>
                  </template>
                </el-table-column>
                <el-table-column v-if="checkboxDataUsage" :label="'Data'" sortable :class-name="getSortClass('DataDay')" prop="DataDay" align="left" min-width="70px">
                  <template slot-scope="{row}">
                    <span>{{ row.DataUsage }}</span>
                  </template>
                </el-table-column>
                <el-table-column v-if="checkboxSMSUsage" :label="'SMS'" sortable  :class-name="getSortClass('SMSMtDay')" prop="SMSMtDay" align="left" min-width="70px">
                  <template slot-scope="{row}">
                    <span>{{ row.smsUsage }}</span>
                  </template>
                </el-table-column>
                <el-table-column v-if="checkboxPayPlan" :label="$t('PAYPLAN')" sortable :class-name="getSortClass('PayPlanCode')" prop="PayPlanCode" align="left" min-width="100px">
                  <template slot-scope="{row}">
                    <span>{{ row.PayPlan }}</span>
                  </template>
                </el-table-column>
                <el-table-column v-if="checkboxIPAddress" :label="$t('IPADDRESS')"  sortable :class-name="getSortClass('IPAddress')" prop="IPAddress" align="left" min-width="100px">
                  <template slot-scope="{row}">
                    <span>{{ row.IPAddress }}</span>
                  </template>
                </el-table-column>
                <el-table-column v-if="checkboxCustomField1" :label="$t('CUSTOMFIELD1')" sortable :class-name="getSortClass('CustomField1')" prop="SuctomField1" align="left" min-width="120px">
                  <template slot-scope="{row}">
                    <span>{{ row.CustomField1 }}</span>
                  </template>
                </el-table-column>
                <el-table-column v-if="checkboxCustomField2" :label="$t('CUSTOMFIELD2')" sortable :class-name="getSortClass('CustomField2')" prop="SuctomField2" align="left" min-width="120px">
                  <template slot-scope="{row}">
                    <span>{{ row.CustomField2 }}</span>
                  </template>
                </el-table-column>
                <el-table-column v-if="checkboxCustomField3" :label="$t('CUSTOMFIELD3')" sortable :class-name="getSortClass('CustomField3')" prop="SuctomField3" align="left" min-width="120px">
                  <template slot-scope="{row}">
                    <span>{{ row.CustomField3 }}</span>
                  </template>
                </el-table-column>
                <el-table-column v-if="checkboxCustomField4" :label="$t('CUSTOMFIELD4')" sortable :class-name="getSortClass('CustomField4')"  prop="SuctomField4" align="left" min-width="120px">
                  <template slot-scope="{row}">
                    <span>{{ row.CustomField4 }}</span>
                  </template>
                </el-table-column>
                <el-table-column v-if="checkboxCustomField5" :label="$t('CUSTOMFIELD5')" sortable :class-name="getSortClass('CustomField5')"  prop="SuctomField5" align="left" min-width="120px">
                  <template slot-scope="{row}">
                    <span>{{ row.CustomField5 }}</span>
                  </template>
                </el-table-column>
                <el-table-column :label="'Update time (UTC)'" sortable :class-name="getSortClass('DataUpdateTime')" prop="DataUpdateTime" align="left" min-width="90px">
                  <template slot-scope="{row}">
                    <span>{{ row.update }}</span>
                  </template>
                </el-table-column>
                <el-table-column v-if="Permission['SIM_LIST']>1&&Permission['SIM_EDIT']>1" label="Actions" align="center" width="100" class-name="small-padding fixed-width" fixed="right">
                <template slot-scope="{row,$index}">
                    <el-button type="primary" class="blue-btn" size="mini" @click="handleUpdate(row)">
                    {{ $t('TEXT_COMMON_EDIT') }}
                    </el-button>
                </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total>0" :total="total" :page.sync="listQuery.Page" :limit.sync="listQuery.Rows" @pagination="getList" />
            
            </div>


            <el-dialog :title="textMap[dialogStatus]" :visible.sync="isDialogFormVisible" >
            <el-form ref="dataForm" :rules="rules" :model="temp" label-position="top"  label-width="70px" @submit.native.prevent="onEditFormSubmit">
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
        <el-form ref="listQuery"  :model="listQuery" label-position="top" class="" @submit.native.prevent="handleFilter" >
          <input :id="filterSubmitId" type="submit" class="display-none">
          <div class="padding-horizontal-x2  pb-10">                
                <input type="submit" class="display-none">
                <el-row :gutter="16" class="p-7">
                <el-col :xs="100" class="px-0">
                    <el-form-item label="Query" prop="fromimsi" class="">
                    <el-input v-model="listQuery.q" placeholder="Enter 5 symbols minimum" class="filter-item" />
                    </el-form-item>
                </el-col>
                <el-col :xs="100" class="px-0">
                   <el-form-item label="Organize" prop="OrganizeCode">
                    <!--<el-select v-model="listQuery.OrganizeCode">
                        <el-option v-for="item in organizeOptions" :key="item.Code" :label="item.Name" :value="item.Code" />
                    </el-select>-->
                    <el-select
                      ref="organizeSearchSelect2"
                      v-model="searchedFilterOrganizeName"
                      :remote-method="querySearchOrganize"
                      filterable
                      default-first-option
                      clearable
                      remote
                      placeholder="Organize Name"
                      class="organize-search-select"
                      @change="changeFilterOrganize"
                    >
                      <el-option v-for="item in organizeArr" :key="item.Code" :value="item" :label="item.Name" />
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
                </el-col>
                <el-col :xs="100" class="px-0">
                    <el-form-item label="IMSIs" prop="imsis" class="">
                    <el-input type="textarea" v-model="sIMSIs" placeholder="IMSIs" class="filter-item" />
                    </el-form-item>
                </el-col>
                <el-col :xs="100" class="px-0">
                    <el-form-item label="ICCIDs" prop="iccids" class="">
                    <el-input type="textarea" v-model="sICCIDs" placeholder="ICCIDs" class="filter-item" />
                    </el-form-item>
                </el-col>
                <el-col :xs="100" class="px-0">
                    <el-form-item label="MSISDNs" prop="msisdns" class="">
                    <el-input type="textarea" v-model="sMSISDNs" placeholder="MSISDNs" class="filter-item" />
                    </el-form-item>
                </el-col>
                </el-row>
            </div>
            
            <div class="content-divider"></div>
            <div class="padding-horizontal-x2 pt-10">
              <el-row :gutter="16" >
                <el-col :xs="100">
                  <el-form-item :label="$t('RAG')" prop="title" class="">
                    <el-checkbox v-model="checkboxSearchRAGr"><span class="rag bg-color-red"></span></el-checkbox>
                    <el-checkbox v-model="checkboxSearchRAGy"><span class="rag bg-color-yellow"></span></el-checkbox>
                    <el-checkbox v-model="checkboxSearchRAGg"><span class="rag bg-color-green"></span></el-checkbox>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div class="content-divider"></div>
            <div class="padding-horizontal-x2 pt-10">
              <el-form-item :label="$t('STATE')" prop="title" class="">
                <el-row :gutter="16" style="">
                  <el-col :span="12">
                    <el-checkbox v-model="checkboxSearchStatusProductive" >{{ $t('PRODUCTIVE') }}</el-checkbox>
                  </el-col>
                  <el-col :span="12">
                    <el-checkbox v-model="checkboxSearchStatusOnStock" >{{ $t('ON_STOCK') }}</el-checkbox>
                  </el-col>
                  <el-col :span="12">
                    <el-checkbox v-model="checkboxSearchStatusSuspended">{{ $t('SUSPENDED') }}</el-checkbox>
                  </el-col>
                  <!--<el-col :span="12">
                    <el-checkbox v-model="checkboxSearchStatusActivated">{{ $t('ACTIVATED') }}</el-checkbox>
                  </el-col>
                  <el-col :span="12">
                    <el-checkbox v-model="checkboxSearchStatusOrdered">Ordered</el-checkbox>
                  </el-col>
                  <el-col :span="12">
                    <el-checkbox v-model="checkboxSearchStatusTest">{{ $t('TEST') }}</el-checkbox>
                  </el-col>
                  <el-col :span="12">
                    <el-checkbox v-model="checkboxSearchStatusTestEnd">{{ $t('TEST_END') }}</el-checkbox>
                  </el-col>-->
                  <el-col :span="12">
                    <el-checkbox v-model="checkboxSearchStatusTestProductive">{{ $t('TEST_PRODUCTIVE') }}</el-checkbox>
                  </el-col>
                  <!--<el-col :span="12">
                    <el-checkbox v-model="checkboxSearchStatusAutoSuspended">AutoSuspended</el-checkbox>
                  </el-col>
                  <el-col :span="12">
                    <el-checkbox v-model="checkboxSearchStatusReserved">Reserved</el-checkbox>
                  </el-col>-->
                  <el-col :span="12">
                    <el-checkbox v-model="checkboxSearchStatusDeleted">Deleted</el-checkbox>
                  </el-col>
                  <!--<el-col :span="12">
                    <el-checkbox v-model="checkboxSearchStatusPaused">Paused</el-checkbox>
                  </el-col>
                  <el-col :span="12">
                    <el-checkbox v-model="checkboxSearchStatusLost">Lost</el-checkbox>
                  </el-col>-->
                  <el-col :span="12">
                    <el-checkbox v-model="checkboxSearchStatusEuiccControl">EuiccControl</el-checkbox>
                  </el-col>
                  <!--<el-col :span="12">
                    <el-checkbox v-model="checkboxSearchStatusDeleting">Deleting</el-checkbox>
                  </el-col>
                  <el-col :span="12">
                    <el-checkbox v-model="checkboxSearchStatusPassive">Passive</el-checkbox>
                  </el-col>-->
                </el-row>
                
              </el-form-item>
            </div>   
            
            <div class="content-divider"></div>
            <div class="padding-horizontal-x2 pt-10">
              <el-form-item :label="$t('CSP')" prop="title" class="">
                <el-row :gutter="16" style="">
                  <el-col :span="12">
                    <el-checkbox v-model="checkboxSearchCSPM2MData" >M2M Data</el-checkbox>
                  </el-col>
                   <el-col :span="12">
                    <el-checkbox v-model="checkboxSearchCSPM2MDataHigh" >M2M Data High</el-checkbox>
                  </el-col> 
                  <el-col :span="12">
                    <el-checkbox v-model="checkboxSearchCSPM2MDataNormal" >M2M Data Normal</el-checkbox>
                  </el-col>
                 <el-col :span="12">
                    <el-checkbox v-model="checkboxSearchCSPM2MDataEmergency">M2M Data Emergency</el-checkbox>
                  </el-col>    
                  <el-col :span="24">
                    <el-checkbox v-model="checkboxSearchCSPM2MDataVodafoneAustralia" >M2M Data Vodafone Australia</el-checkbox>
                  </el-col>
                </el-row>
              </el-form-item>
            </div>
        </el-form>
      </div>
    </el-aside>
</el-container>
<div v-else class="no-data-info">    
  <div class="py-20">
    Permission denied
  </div>
</div> 
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
import { fetchSIMListAjax, fetchCustomersListAjax, setActivateStateAjax, setSuspendStateAjax, setResumeStateAjax, setTerminateStateAjax, setServiceProfileOptionsAjax, fetchServiceProfileOptionsAjax, createSIMAjax, updateSIMAjax, moveSIMsAjax } from "@/api/user";
import Item from '@/layout/components/Sidebar/Item'
import { getSIMListAsync, getSIM, getSIMAsync, getCustomerList, getSIMCoordinates, getSIMCountry, forceReconnectAsync } from '@/api/sim'
import moment from 'moment'
import { Permission } from '@/utils/role-permissions'

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
      checkboxSearchRAGg: false,
      checkboxSearchRAGy: false,
      checkboxSearchRAGr: false,
      checkboxSearchStatusOnStock: false,
      checkboxSearchStatusActivated: false,
      checkboxSearchStatusOrdered: false,
      checkboxSearchStatusTest: false,
      checkboxSearchStatusTestProductive: false,
      checkboxSearchStatusTestEnd: false,
      checkboxSearchStatusProductive: false,
      checkboxSearchStatusSuspended: false,
      checkboxSearchStatusAutoSuspended: false,      
      checkboxSearchStatusDeleted: false,
      checkboxSearchStatusPaused: false,
      checkboxSearchStatusLost: false,
      checkboxSearchStatusReserved: false,
      checkboxSearchStatusEuiccControl: false,
      checkboxSearchStatusDeleting: false,
      checkboxSearchStatusPassive: false,
      checkboxSearchCSPM2MData: false,
      checkboxSearchCSPM2MDataEmergency: false,
      checkboxSearchCSPM2MDataNormal: false,
      checkboxSearchCSPM2MDataHigh: false,
      checkboxSearchCSPM2MDataVodafoneAustralia: false,      
      Permission,
      searchedOrganizeName: '',
      searchedFilterOrganizeName: '',
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
        sendWay: '0',       
        searchedOrganize: null,
        Remark: '',
        Number: ''
      },
      sendWayOptions: [
        {Code:'0',Name:'Selected SIMs'},
        {Code:'1',Name:'IMSI range'},
        {Code:'2',Name:'ICCID range'},
        {Code:'3',Name:'IMSI list'},
        {Code:'4',Name:'ICCID list'}
      ],
      selectedState: 0,
      isRightPanelVisible: true,
      filterSubmitId: Date.now(),
      tableKey: 0,
      list: null,
      total: 0,
      isListLoading: true,
      mIMSIs: '',
      mICCIDs: '',
      sIMSIs: '',
      sICCIDs: '',
      sMSISDNs: '',
      listQuery: {
        Page: 1,
        Rows: 10,
        Order: 'DESC',
        Sort: 'DataDay',
        //ServiceprofileCodes: ['M2M Data High CSP Z1-3', 'M2M Data']
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
        FromIMSI: [{ required: true, message: 'From IMSI should be 15 characters long', min: 15, max: 15 }],
        ToIMSI: [{ required: true, message: 'To IMSI should be 15 characters long', min: 15, max: 15 }],
        FromICCID: [{ required: true, message: 'From ICCID should be 19 characters long', min: 19, max: 19 }],
        ToICCID: [{ required: true, message: 'TO ICCID should be 19 characters long', min: 19, max: 19 }],
        //Organize: [{ required: true, message: 'Organize is required', trigger: 'change' }],
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
      organizeArr: []
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
     
    querySearchOrganize(query) {
      if (query !== '') {        
        if(query.length > 1) {
          this.searchOrganize(query)
        }      
      } else {
        this.organizeArr = []
      }
    },
    async searchOrganize(query) {
      const arr = []      
      this.organizeArr = []
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
        this.organizeArr = arr
      })
    },
    changeOrganize(val) {
      this.organizeArr = []
      this.searchedOrganizeName = val.Name
      this.tempMove.searchedOrganize = val
    },
    changeFilterOrganize(val) {
      this.organizeArr = []
      this.searchedFilterOrganizeName = val.Name
      this.listQuery.OrganizeCode = val.Code     
    },    
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
          self.locationList[6].value = result.Data.LbsRadio?result.Data.LbsRadio + ' ' + result.Data.LbsRange:''
          self.locationList[7].value = activityTime?utcDate:''
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

        setActivateStateAjax(query).then(r=>{
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
            setSuspendStateAjax(query).then(r=>{
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
            setResumeStateAjax(query).then(r=>{
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
            setTerminateStateAjax(query).then(r=>{
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
        setServiceProfileOptionsAjax(query).then(r=>{
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
           
        let st = ''
        let ar = []
        
        if(this.tempMove.searchedOrganize?.Code != undefined){
          this.searchedOrganizeName = ''
          let checkSIM = false
          let query = {}

          if(this.tempMove.sendWay == '0'){        
            const arr = []
            for (let i = 0; i < this.multipleSIMSelection.length; i++) {        
              arr.push(this.multipleSIMSelection[i].IMSI)
              checkSIM = true 
            }
            query = {
              IMSIs: arr
            }
          }else if(this.tempMove.sendWay == '1'){   
            query = {
              FromIMSI: this.tempMove.FromIMSI,
              ToIMSI: this.tempMove.ToIMSI,
            }
          }else if(this.tempMove.sendWay == '2'){   
            query = {
              FromICCID: this.tempMove.FromICCID,
              ToICCID: this.tempMove.ToICCID,
            }
          }else if(this.tempMove.sendWay == '3'){
            if(this.mIMSIs.length){
              st = this.mIMSIs.replace(/</g, "&lt;").replace(/>/g, "&gt;")
              ar = this.mIMSIs.split('\n')
              if(ar.length == 1) ar = this.mIMSIs.split(',') 
              ar = ar.filter(function (el) {
                return el != null && el != ''
              })
              if(ar.length){
                query.IMSIs = ar.map(function (el) {
                  return el.replace(/\s/g, '').replace(',', '')
                })
              }
            } 
          }else if(this.tempMove.sendWay == '4'){   
            if(this.mICCIDs.length){
              st = this.mICCIDs.replace(/</g, "&lt;").replace(/>/g, "&gt;")
              ar = this.mICCIDs.split('\n')
              if(ar.length == 1) ar = this.mICCIDs.split(',') 
              ar = ar.filter(function (el) {
                return el != null && el != ''
              })
              if(ar.length){
                query.ICCIDs = ar.map(function (el) {
                  return el.replace(/\s/g, '').replace(',', '')
                })
              }
            } 
          }

          if(!checkSIM && this.tempMove.sendWay == '0'){
            this.$alert('There are no SIM to move', 'M2M Data Message', {type: 'message'}) 
          }else{
            query.toorganizecode = this.tempMove.searchedOrganize.Code
            query.Number = this.tempMove.Number
            query.Remark = this.tempMove.Remark
            
            moveSIMsAjax(query).then(r=>{
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
          }else{
            this.$alert('Select Organize to move SIMs', 'M2M Data Message', {type: 'message'})
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
      console.log(this.listQuery)
      fetchSIMListAjax(this.listQuery).then(response => { 
        if(!response.MajorCode){         
      console.log(response.rows)
          response.rows.forEach(async element_1 => {
            const activityTime = element_1.DataUpdateTime
            let rag = 'bg-color-grey'
            let jsonDataArr = []
            let dataSession = 0
            let totalSumm = 0
            let simActivityTime = moment(activityTime, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
                
            switch(element_1.RAG){
              case 'GREEN':
                rag = 'bg-color-green'
              break;
              case 'YELLOW':
                rag = 'bg-color-yellow'
              break;
              case 'RED':
                rag = 'bg-color-red'
              break;
            }
            /*if(activityTime){
              if(simActivityTime >= halfDayAgo){
                rag = 'bg-color-green'
              }else if(simActivityTime >= oneDayAgo && simActivityTime < halfDayAgo){
                rag = 'bg-color-yellow'
              }else {
                rag = 'bg-color-red'
              }
            }*/

            //item.CreateDateTime = moment.utc(item.CreateDateTime).toDate();
            //item.CreateDateTime = moment(item.CreateDateTime).format(window.COM_TIMEFORMAT);

            arr.push({
              IMSI: element_1.IMSI.toString(),
              ICCID: element_1.ICCID.toString(),
              MSISDN: element_1.MSISDN.toString(),
              ServiceProfile: element_1.ServiceProfileName,
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
          })
        }
        self.isListLoading = false
        self.total = response.total
        self.list = arr
      })    
    },
    async getOrganizeOptions(){      
      const arr = []
      
      fetchCustomersListAjax().then(response => {  
        response.rows.forEach(element => {
          arr.push({
            Code: element.Code,
            Name: element.Name
          })
        })
      })
       
      this.organizeOptions = [{
        Name: this.userInfo.OrganizeName,
        Code: this.userInfo.OrganizeCode
      }].concat(arr)
    },    
    getStateOptions(){
      if(Permission['SIM_SUSPEND_RESUME']>1){
        this.stateOptions = [
          {'Code': '0', 'Name': 'Suspend'},
          {'Code': '1', 'Name': 'Resume'}
        ]
      }
      if(Permission['SIM_TERMINATE']>1){
        this.stateOptions.push({'Code': '2', 'Name': 'Terminate'})
      }
      if(this.stateOptions.length){
        this.selectedState = this.stateOptions[0].Code
      }      
    },
    async getServiceProfileOptions(){      
      fetchServiceProfileOptionsAjax().then(response => {        
        this.serviceProfileOptions = response.Data
        this.selectedServiceProfile = this.serviceProfileOptions[0].Code
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

      let arr = []
      let str = ''
      this.listQuery.IMSIs = []
      this.listQuery.ICCIDs = []
      this.listQuery.MSISDNs = []
      this.listQuery.RAGs = []
      this.listQuery.Status = []
      this.listQuery.ServiceprofileCodes = []
      
      this.checkboxSearchRAGg?this.listQuery.RAGs.push('GREEN'):null
      this.checkboxSearchRAGr?this.listQuery.RAGs.push('RED'):null
      this.checkboxSearchRAGy?this.listQuery.RAGs.push('YELLOW'):null
      
      this.checkboxSearchStatusOnStock?this.listQuery.Status.push('OnStock'):null
      this.checkboxSearchStatusSuspended?this.listQuery.Status.push('Suspended'):null
      this.checkboxSearchStatusProductive?this.listQuery.Status.push('Productive'):null
      this.checkboxSearchStatusTest?this.listQuery.Status.push('Test'):null
      this.checkboxSearchStatusTestProductive?this.listQuery.Status.push('TestProductive'):null
      this.checkboxSearchStatusTestEnd?this.listQuery.Status.push('TestEnd'):null
      this.checkboxSearchStatusActivated?this.listQuery.Status.push('Activated'):null
      this.checkboxSearchStatusOrdered?this.listQuery.Status.push('Ordered'):null
      this.checkboxSearchStatusAutoSuspended?this.listQuery.Status.push('AutoSuspended'):null
      this.checkboxSearchStatusReserved?this.listQuery.Status.push('Reserved'):null
      this.checkboxSearchStatusDeleted?this.listQuery.Status.push('Deleted'):null
      this.checkboxSearchStatusPaused?this.listQuery.Status.push('Paused'):null
      this.checkboxSearchStatusLost?this.listQuery.Status.push('Lost'):null
      this.checkboxSearchStatusEuiccControl?this.listQuery.Status.push('EuiccControl'):null
      this.checkboxSearchStatusDeleting?this.listQuery.Status.push('Deleting'):null
      this.checkboxSearchStatusPassive?this.listQuery.Status.push('Passive'):null

      this.checkboxSearchCSPM2MData?this.listQuery.ServiceprofileCodes.push('M2M Data'):null
      this.checkboxSearchCSPM2MDataEmergency?this.listQuery.ServiceprofileCodes.push('M2M Data Emergency CSP Z1- 9'):null
      this.checkboxSearchCSPM2MDataNormal?this.listQuery.ServiceprofileCodes.push('M2M Data Normal CSP Z1 &2'):null
      this.checkboxSearchCSPM2MDataHigh?this.listQuery.ServiceprofileCodes.push('M2M Data High CSP Z1-3'):null
      this.checkboxSearchCSPM2MDataVodafoneAustralia?this.listQuery.ServiceprofileCodes.push('M2M Data Custom Network Profile Australia'):null
      
      if(this.sIMSIs.length){
        str = this.sIMSIs.replace(/</g, "&lt;").replace(/>/g, "&gt;")
        arr = this.sIMSIs.split('\n')
        if(arr.length == 1) arr = this.sIMSIs.split(',') 
        arr = arr.filter(function (el) {
          return el != null && el != ''
        })
        if(arr.length){
          this.listQuery.IMSIs = arr.map(function (el) {
            return el.replace(/\s/g, '').replace(',', '')
          })
        }
      }

      if(this.sICCIDs.length){
        str = this.sICCIDs.replace(/</g, "&lt;").replace(/>/g, "&gt;")
        arr = this.sICCIDs.split('\n')
        if(arr.length == 1) arr = this.sICCIDs.split(',') 
        arr = arr.filter(function (el) {
          return el != null && el != ''
        })
        if(arr.length){
          this.listQuery.ICCIDs = arr.map(function (el) {
            return el.replace(/\s/g, '').replace(',', '')
          })
        }
      }

      if(this.sMSISDNs.length){
        str = this.sMSISDNs.replace(/</g, "&lt;").replace(/>/g, "&gt;")
        arr = this.sMSISDNs.split('\n')
        if(arr.length == 1) arr = this.sMSISDNs.split(',') 
        arr = arr.filter(function (el) {
          return el != null && el != ''
        })
        if(arr.length){
          this.listQuery.MSISDNs = arr.map(function (el) {
            return el.replace(/\s/g, '').replace(',', '')
          })
        }
      }           
          
      this.getList()
    },
    sortChange(data) {console.log(data)
      const { prop, order } = data
      this.listQuery.Order = this.listQuery.Order === 'ASC' ? 'DESC' : this.listQuery.Order === 'DESC' ? 'ASC' : 'ASC' //order === 'ascending' ? 'ASC' : (order === 'descending') ? 'DESC' : 'ASC'
      this.listQuery.Sort = prop
      this.getList()
    },
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
      this.temp = Object.assign({}, row) 
      this.dialogStatus = 'update'
      this.isDialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
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
             
        /*if(this.dialogStatus === 'create'){ 
          createSIMAjax(tempData).then(response => {            
            this.resetTemp()
            this.getList()
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          }) 
        }else{*/
          updateSIMAjax(tempData).then(response => {            
            this.resetTemp()
            this.getList()
            this.$notify({
              title: 'Success',
              message: 'Updated Successfully',
              type: 'success',
              duration: 2000
            })
          }) 
        //}
        
        this.isFormLoading = false
        this.isDialogFormVisible = false        
      })
    },
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
      const order = this.listQuery.Order
      return order === `+${key}` ? 'ascending' : 'descending'
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
.sim-list-page div.square {
  border-radius: 3px;
  margin: 0 14px;
  width: 10px;
  height: 10px;
}

.sim-list-page .el-checkbox__label{
  font-size: 12px;
}
/*map sim-list-page*/
  
  /*
  
  .el-card__footer button{
    float: right;
    margin-top: 38px;
  }

.cell a{
  color: #28a5e0;
}
.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #28a5e0;
    border-color: #d9ebf3;
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



.el-dialog__body{
    padding: 20px;
}
.el-dialog__header{
    padding: 20px;
}
.el-dialog__footer{    
    padding: 20px;
}




*/

</style>
