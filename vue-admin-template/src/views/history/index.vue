<template>
  <el-container v-if="Permission['HISTORY']>1" class="with-panel-wrapper history-page" :class="{'panel-opened': isRightPanelVisible}">
    <loading :active.sync="isLoading" 
        :can-cancel="true" 
        :is-full-page="fullPage">
    </loading>

    <el-container class="page-fixed-height padding-vertical-x2">
      <el-main  class="no-padding">        
         <div class="commands " id="commands">
            <el-button v-if="commandList.length&&isShowNow" type="info" class="blue-btn timebutton-now mt-25">Now</el-button>
            <div v-else class="no-data-info">No data for this time period</div>
          <div
            v-for="(command, index) in commandList"
            :key="index"
            class="display-flex"
            :class="commandClass(command)"
          >
            <slot>
            <div class="time-title command-time" v-show="isShowcommand(command)">
              <div class="command-time-div">
                {{command.timestamp}} 
              </div>               
              <img :src="'time-dot.png'" class="time-dot">
            </div>
              <div class="command-content" v-show="isShowcommand(command)">
                <div class="command-bubble">
                <div class="command-icon">
                    <item :icon="command.type === 'sent'?'arrow-send':'arrow-received'"/>                                       
                </div>
                  <div class="command-text">
                    <b>                      
                      {{command.type === 'sent'?'Sending a command':'Reply to command'}}
                    <br>                  
                      Who 
                    </b>                      
                    {{command.from}}
                    <br>
                    <b>                  
                      Description 
                    </b>      
                    {{command.text}}
                  </div>
                </div>
              </div>
            </slot>            
          </div>
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
        
        <el-form class="commands-form" ref="simListQuery" :model="simListQuery" label-position="top" @submit.native.prevent="handleFilter">
          <input :id="filterSubmitId" type="submit" class="display-none">   
            <div class="padding-horizontal-x2 pt-10 pb-10">
              <el-row :gutter="16" style="">
                <el-col :xs="100" :sm="100" :md="100" :lg="100">
                  <el-form-item label="Start date" prop="title" class="mb-0">
                    <el-date-picker v-model="listHistoryQuery.date1" value-format="yyyy-MM-dd" type="date" placeholder="Pick a date" style="width: 100%;" />
                  </el-form-item>                  
                  <el-form-item label="End date" prop="title" class="mb-0">
                    <el-date-picker v-model="listHistoryQuery.date2" value-format="yyyy-MM-dd" type="date" placeholder="Pick a date" style="width: 100%;" />
                  </el-form-item>
                </el-col>
              </el-row>  
            </div>
            <div class="content-divider"></div>
            <div class="padding-horizontal-x2 pt-10 pb-20">
              <el-row :gutter="16" style="">
                <el-col :xs="100">       
                  <el-form-item :label="$t('IMSI')" prop="imsi" class="no-margin-bottom">
                    <el-select
                      ref="imsiSearchSelect"
                      v-model="searchedIMSI"
                      :remote-method="querySearchIMSI"
                      filterable
                      default-first-option
                      remote
                      placeholder="Search by IMSI"
                      class="imsi-search-select"
                      @change="changeIMSI"
                    >
                      <el-option v-for="item in imsiArr" :key="item.code" :value="item" :label="item.title" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>     
            </div>        
            <div class="content-divider"></div>
            <div class="padding-horizontal-x2 pt-10">
              <el-row :gutter="16" style="">
                <el-col :xs="100">
                  <el-form-item :label="$t('SMS/Command')" prop="title" class="">
                    <el-checkbox v-model="checkboxSent">Sent</el-checkbox>
                    <el-checkbox v-model="checkboxReceived">Received</el-checkbox>
                  </el-form-item>
                </el-col>
              </el-row>
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
import { parseTime } from '@/utils'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import Item from '@/layout/components/Sidebar/Item'
import waves from '@/directive/waves'
import { getSIMList, getSMSHistoryAsync } from '@/api/sim'
import { fetchSIMListAjax, getHistoryAjax } from "@/api/user";
import moment from 'moment'
import { Permission } from '@/utils/role-permissions'

const today = new Date()

export default {
  components: {
    Item,
    Loading,
  },
  directives: { waves },
  data() {
    return {
      Permission,
      oldHistoryArray: [],
      page: 1,
      checkboxSent: true,
      checkboxReceived: true, 
      isShowNow: false,
      searchedIMSI: '',
      isLoading: false,
      fullPage: true,      
      listLoading: true,
      isRightPanelVisible: true,
      isCommandsPanelVisible: false,
      checkedAll: '',
      checkedCommandsAll: '',
      deviceList: {},
      commandGroupList: [],
      activeCommandGroups: [],
      newcommand: '',
      commandList: [
      ],
      imsiArr: [
      ],
      agentsArr: [
        { code: '1', name: 'Agent' }
      ],
      customersArr: [
        { code: '1', name: 'Customer' }
      ],    
      simListQuery: {
        limit: 5,
        sample: ''
      },
      listHistoryQuery: {
        imsi: '',
        date1: moment(today, 'YYYY-MM-DD').add(-90, 'days').format('YYYY-MM-DD'),
        date2: moment(today, 'YYYY-MM-DD').format('YYYY-MM-DD'),
      },
      filterSubmitId: Date.now(),
      intervalForReply: null,
      smsQuery: {
      },
      loadedSMS: [],      
			monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    
    }
  },
  created() {
    /*const query = {
      limit: 5,
      sample: query
    }
    getSIMList(null).then(response => {
      response.data.forEach(element => {
        this.imsiArr.length = 0
        this.imsiArr.push({ code: '0', name: 'All' })
        response.data.forEach(element => {
          this.imsiArr.push({ code: element._id, name: element.info.imsi })
        })
      })
    })*/
  },
  mounted(){
    //this.$alert('Choose SIM card to see its Commands history', 'M2M Data Message', {type: 'message'})
      this.isShowNow = false
      this.getHistory()
  },
  methods: {
    handleFilter() {
      this.isShowNow = false
      this.commandList = []
      this.loadedSMS = []      
      this.oldHistoryArray = []
      this.page = 1
      this.getHistory()
    },
    isShowcommand(command){
      const isShow = command.datetime>=new Date(this.listHistoryQuery.date1).getTime()
                  &&command.datetime<=new Date(this.listHistoryQuery.date2).getTime()
                  &&(command.type=='sent'&&this.checkboxSent||command.type=='received'&&this.checkboxReceived)
      if(isShow){
        this.isShowNow = true
      }else{}
      return isShow
      //command.timestamp>=new Date(listHistoryQuery.date1).getTime()&&command.timestamp<=new Date(listHistoryQuery.date2).getTime()
    },
    changeIMSI(val) {
      this.imsiArr = []
      this.searchedIMSI = val.title
      this.listHistoryQuery.imsi = val.title
      console.log('val',this.listHistoryQuery.imsi)
    },
    async searchIMSI(query) {
      const arr = []      
      this.imsiArr = []
      
      this.simListQuery = {
        Rows: 5,
        q: query,
      }
      fetchSIMListAjax(this.simListQuery).then(response => {
      
        response.rows.forEach(element => {
          arr.push({
            code: element.IMSI,
            title: element.IMSI
          })
        })
        this.imsiArr = arr
      })
          
    },
    querySearchIMSI(query) {
      if (query !== '') {        
        if(query.length > 4) {
          this.searchIMSI(query)
        }      
      } else {
        this.imsiArr = []
      }
    },
    getHistory(){     
      if(this.listHistoryQuery.imsi.toString().length == 15){
        //this.isLoading = true
        this.commandList = []
        let concatArr = []
          
          
          let self = this

          getHistoryAjax({
						"IMSI":  this.listHistoryQuery.imsi,
						"PAGE": this.page,
						"pagesize": "100",
					  }).then(response => {
					//$.ajax(settings).done(function (response) {     
            //concatArr = response.Data
            //console.log(response)
             
              
          if (response.MajorCode == '000') {
						if (response.Data.length) {
              let historyArray = response.Data
              
              if(self.page > 1){
									self.oldHistoryArray= self.oldHistoryArray.concat(historyArray);
								}else{
                  self.isLoading = true
									self.oldHistoryArray= historyArray;													
								}
									let incr = self.page + 1;
									
									self.page = incr
									
									self.getHistory()
              }else{
								if(self.oldHistoryArray.length > 0){
									self.oldHistoryArray.sort(function(a,b){
										var c = new Date(a.CreateTime);
										var d = new Date(b.CreateTime);
										return d-c;
									});
									self.setHistory(self.oldHistoryArray)
								}else{
									//self.requestCommandOldHistory([])
								}
              }
          }else{

          }

              /*let sortedArr = concatArr.sort(function(a,b){
                var c = new Date(a.CreateTime)
                var d = new Date(b.CreateTime)
                return d-c
              })
              self.setHistory(sortedArr) */      
              
          }).fail(function (e){
            return
          })









        

      }else{
        this.$alert('Please choose a SIM', 'M2M Data command', {type: 'command'})
      } 
    },
    setHistory(arr){
      let newArr = []
      arr.forEach(value => {
        let obj = {}

        if (this.loadedSMS.indexOf( value.CenterNumber + ' ' + value.CreateTime + value.Message[0] ) == -1){
          
          this.loadedSMS.push(value.CenterNumber + ' ' + value.CreateTime + value.Message[0])
          const datetime = moment.utc(value.CreateTime).toDate()						
					//const time = datetime.getDate() + ' ' + this.monthNames[datetime.getMonth()] + ' ' + ('0' + datetime.getHours()).slice(-2) + ':' + ('0' + datetime.getMinutes()).slice(-2) + ':' + ('0' + datetime.getSeconds()).slice(-2)
          obj.datetime = new Date(datetime).getTime()
          
          const time = datetime.getDate() + ' ' + this.monthNames[datetime.getMonth()]+ ' ' + datetime.getFullYear() + ' ' + ('0' + datetime.getHours()).slice(-2) + ':' + ('0' + datetime.getMinutes()).slice(-2) + ':' + ('0' + datetime.getSeconds()).slice(-2)
                 
          obj.timestamp = time    
          obj.from = value.CenterNumber
          obj.to = ''

          if (value.Message) {
            obj.text = value.Message.replace(/</g, "&lt;").replace(/>/g, "&gt;")
          }
							
          if (value.Direction == 2) {      
            obj.type = 'sent'
            if(value.State == 3 || value.State == 2 || value.State == 1 || value.State == 0){
              
              const elToRemove = []
              newArr.map((el, i) => {
                if(el.text === obj.text && el.hasOwnProperty('new')){
                  elToRemove.push(i)
                }
              })
              elToRemove.forEach(element => {
                newArr.splice(element, 1)                
              })
            }
          }else if(value.Direction == 1){
            obj.type = 'received'
          }

          
          newArr.push(obj)
          
        }
      })
      this.$nextTick(() => {     
        this.commandList = newArr
        /*if(!this.isShowNow && this.commandList.length){
          this.$alert('No data for this time period', 'M2M Data command', {type: 'command'})
        }*/
        const el = this.$el.getElementsByClassName('unreaded')[0];
      
        if (el) {
          el.scrollIntoView({behavior: 'smooth'});
        }
        
        this.isLoading = false     
      })
    },
    commandClass: function (command) {
      return {
        'commands-title': command.type === 'title',
        'command': command.type !== 'title',
        'command-sent': command.type === 'sent',
        'command-received': command.type === 'received',
      }
    }

  }
}
</script>


<style lang="scss">
  
  .history-page .chat-container{
    position: relative;
    height: calc(100vh - 0px);
    width: 100%;
  }
    .history-page .chat-sidebar{
      background-color: #ffffff;
      color: #333;

      -webkit-box-shadow: 0 1px 4px rgba(0,21,41,0.08);
      box-shadow: 0 1px 4px rgba(0,21,41,0.08);
    }
      .history-page .sidebar-header{
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
  .history-page .list{
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
  .history-page .commands{
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

    .commands-title{
      text-align: center;
      width: 100%;
      line-height: 1;

      font-size: 12px;
      color: rgba(0,0,0,.51);
    }
    .command {
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      /*-webkit-box-align: end;
      -webkit-align-items: flex-end;
      -ms-flex-align: end;
      align-items: flex-end;*/
      position: relative;
      z-index: 1;
      -webkit-transform: translate3d(0,0,0);
      transform: translate3d(0,0,0);

      &.command-sent {
        /*text-align: right;
        -webkit-box-orient: horizontal;
        -webkit-box-direction: reverse;
        -webkit-flex-direction: row-reverse;
        -ms-flex-direction: row-reverse;
        flex-direction: row-reverse;
        -webkit-align-self: flex-end;
        -ms-flex-item-align: end;
        align-self: flex-end;

        margin-right: 8px;*/

        .command-content {
            padding: 0 20px;
          -webkit-box-align: end;
          -webkit-align-items: flex-end;
          -ms-flex-align: end;
          align-items: flex-end;
        }
        .command-from+.command-content {
          margin-right: 8px;
        }

        .command-bubble {
            margin-top: 20px;
          color: #606266;
          background: #ffffff;
        }
        &.command-tail .command-bubble:before {
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

      &.command-received {
        -webkit-box-orient: horizontal;
        -webkit-box-direction: normal;
        -webkit-flex-direction: row;
        -ms-flex-direction: row;
        flex-direction: row;


        .command-content {
    padding: 0 20px;
    -webkit-box-align: end;
    -ms-flex-align: end;
    align-items: flex-end;

    position: relative;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -ms-flex-direction: column;
    flex-direction: column;

        }

        .command-from+.command-content {
          margin-left: 8px;
        }

        .command-bubble {
            margin-top: 20px;
          color: #606266;
          background: #ffffff;
        }
        &.command-tail .command-bubble:before {
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

      .command-from {
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

      .command-content {
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

        .command-footer, .command-header {
          line-height: 1;
          font-size: 12px;

          color: rgba(0,0,0,.51);
        }
        .command-header{
          margin-bottom: 2px;
          display: flex;
          align-items: center;
        }
        .command-footer {
          font-size: 11px;
          margin-bottom: -1em;

          margin-top: 2px;
        }

        .command-bubble {
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          word-break: break-word;
          display: -webkit-box;
          display: -webkit-flex;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-orient: vertical;
          -webkit-box-direction: normal;
          /*-webkit-flex-direction: column;
          -ms-flex-direction: column;
          flex-direction: column;*/
          position: relative;
          line-height: 1.6;
          font-size: 16px;
          border-radius: 5px;
          padding: 20px 15px;
          min-height: 32px;

          .command-text-footer, .command-text-header {
            font-size: 12px;
            line-height: 1;

            color: rgba(0,0,0,.51);
          }
          .command-text-header {
            margin-bottom: 4px;
          }
          .command-text-footer {
            margin-top: 4px;
          }
          .command-text {
              padding-left: 10px;
            text-align: left;
          }

        
          
        }
      }
    }
  }


</style>


<style >
.history-page .panel-right p{
    padding-right: 25px;
}
.history-page .panel-right{
    background-color: rgb(238, 241, 246)
}
.history-page .commands-container {
    background-color: #ffffff;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
}

.history-page .commandbar-container{
    border-top: 1px solid #e3e3e3;
    background-color: #ffffff;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
}
.history-page .user-avatar {
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 20px;
    vertical-align: middle;
}
.history-page .command-header {
    padding: 5px 0;
}
.history-page .command-status {
    padding: 5px;
    color: rgb(65, 190, 162);
    line-height: 1.144;
    font-size: 14px;
}
.history-page .command-status-new{
  padding: 5px;
    color: #ffc496;
    line-height: 1.144;
    font-size: 14px;
}
.history-page .command-time {
    padding: 5px;
    color: rgb(96, 98, 104);
    line-height: 1.144;
    font-size: 14px;
}
 
 .history-page  .commands-form{
      background-color: #ffffff;
      border-top: 1px solid #e3e3e3;
      height: -webkit-fill-available;
  }

  .history-page .el-checkbox__input.is-checked+.el-checkbox__label {
    color: #32aee8;
}

  .history-page  .group-btn{
    padding: 12px 0;
  }
  .history-page .no-sim-info{
    text-align: center;
    background-color: #ffffff;
    padding: 15px;
    font-size: 12px;
    color: grey;
  }
  .history-page .el-footer{
    padding: 20px 10px 20px 20px;
    height: 80px !important;
  }
  .history-page .scrollbar-loading .collapse-list{
    padding: 25px 0;
  }
  .history-page .scrollbar-loading{
    padding-top: calc(50vh - 0px);
  }
  .history-page .scrollbar-loading .el-collapse{
    border: none;
  }
  .history-page .scrollbar-loading .el-scrollbar__wrap{
    overflow: hidden;
    margin: 0 !important;
  }
 .history-page  .collapse-item .el-collapse-item__header{
    font-size: 12px;
    padding: 0 12px 0 20px;
    font-weight: 600;
    color: rgb(96, 98, 104);
  }
  .history-page .right-column-header{
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    color: rgb(96, 98, 104);
  }
  .history-page .right-column-header:hover{
    background-color: rgb(238, 241, 246);
  }
  .history-page .collapse-item .item-content{
    font-size: 12px;
    border-top: 1px solid #e3e3e3;
    color: rgb(96, 98, 104);
  }
  .history-page .el-collapse-item__content{
    padding-bottom: 0;
  }
  .history-page .el-collapse-item__content .list .item-content{
    cursor: pointer;
  }

  .history-page .dialog-mask {
    position: fixed;
    z-index: 2;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: center;
    align-items: center;
    -ms-flex-pack: center;
    justify-content: center;
    background-color: rgba(0,0,0,.33);
  }
  .history-page .command-box .dialog-content {
    min-width: 240px;
    text-align: center;
    font-size: 16px;
}
.history-page .dialog-content {
    margin: 0 20px;
    padding: 20px 30px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    color: #303133;
}
</style>


<style>
/*map

  .map-container{
    overflow: hidden;
    width: 100%;
    height: 439px;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  .el-dialog{
    background-color:#f2f5fb;
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
  .el-table td{
    padding: 10px 0;
    font-size: 12px;
  }
  .leaflet-control-zoom, .leaflet-control-attribution{
    display: none;
  }
  .card-panel-right {
    text-align: right;
  }
.dark-btn{
  border-color: #304257;
  background-color: #304257;
}
.dark-btn:hover,.dark-btn:active,.dark-btn:focus{
  border-color: #35475c;
  background-color: #35475c;
}
.blue-btn{
  border-color: #28a5e0;
  background-color: #28a5e0;
}
.blue-btn:hover,.blue-btn:active,.blue-btn:focus{
  border-color: #32aee8;
  background-color: #32aee8;
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
    margin-bottom: 20px;
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
}*/

.history-page .time-title{
    padding: 50px 0px 50px 20px;
    border-right: 5px solid #28a5e0;
    width: 145px;
    min-width: 145px;
}

.history-page .command-time-div{
  display: inline-block;
  width: 102px;
  height: 20px; 
}

.history-page .time-dot{
    margin-left: 16px;
    position: absolute;
    width: 10px;
}

.history-page .timebutton-now{
    width: 80px;
    margin: 0 103px;
}
.panel-hide{
  background-color: #ffffff;
}
/*
  .el-select-dropdown__item.selected {
    color: #606266;
    font-weight: 500;
}


.el-aside {
    overflow: hidden !important;
}*/
</style>
