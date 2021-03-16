<template>
  <el-container class="chat-container sms-page">
    <loading :active.sync="isLoading" 
        :can-cancel="true" 
        :is-full-page="fullPage">
    </loading>    
    <confirm></confirm>
    <dialogs-wrapper transition-name="fade"></dialogs-wrapper>
    <el-container class="p-20">
      <el-main class="messages-container"
              >
        <div class="messages" id="messages">
          <div
            v-for="(message, index) in messageList"
            :key="index"
            :class="messageClass(message)"
          >
            <slot v-if="message.type === 'title'">
                <span class="time-border">                    
                    {{message.text}}
                </span>
            </slot>
            <slot v-else>
              <div class="message-content">
                <div class="message-header">
                    <div v-show="message.type === 'received'">
                        <img :src="'avatar-sim.png?imageView2/1/w/80/h/80'" class="user-avatar">
                    </div>
                    <div v-if="!message.new" class="message-status">{{message.status}}</div>
                    <div v-else class="message-status-new">Pending...</div>
                    <div class="message-time">{{message.timestamp}}</div>
                    <div v-show="message.type === 'sent'">
                        <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
                    </div>
                </div>
                <div class="message-bubble">
                  <div class="message-text">
                    <b>                      
                      {{message.from === 'me'?'me':message.from}}
                    </b>
                    <br>                    
                    <i v-show="message.to">to: {{message.to}}
                    <br>
                    </i>
                    {{message.text}}
                  </div>
                </div>
              </div>
            </slot>
          </div>
        </div>     
        <div class="unreaded">
        </div>
      </el-main>   

      <el-footer class="messagebar-container">
        <div class="display-flex justify-content-between">
          <el-input placeholder="Command" v-model="newMessage" class="input-with-select">
          </el-input>
          <div class="buttons-row white-space-nowrap">
            <el-button v-waves slot="append" class="button-custom blue-btn" type="primary" @click="sendMessage"><item :icon="'send-white'" /> Send</el-button>
          </div>
        </div>
      </el-footer>
    </el-container>

    
    <el-aside width="250px" style="" class="chat-sidebar">
      <div v-if="isCommandsPanelVisible">
        <div class="right-column-header panel-right  padding-horizontal-x2 display-flex justify-content-between align-items-center" @click="closeCommandsPanel">
          <p class="">Commands</p>
          <i class="el-icon-close" />
        </div>
        <el-scrollbar wrap-class="scrollbar-wrapper" 
          :class="listLoading?'scrollbar-loading':''">   
            <el-collapse v-model="activeCommandGroups"
               @change="handleChange"      
               v-loading="listLoading"
               class="collapse-list">
              <el-collapse-item           
                v-for="group in commandGroupList" 
                :key="group.ProductName"
                :title="group.ProductName + ' (' + group.CommandList.length + ')'" 
                :name="group.ProductName"
                class="collapse-item">
                <div>
                  <ul 
                       class="list">
                    <li v-for="command in group.CommandList" :key="command.Code" @click="chooseCommand(command)">
                      <div class="item-content" >
                        <div class="item-inner">
                          <div class="item-title">
                            {{command.Name}}
                          </div>
                          
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </el-collapse-item>            
            </el-collapse>    
            <!--<div v-show="commandsList.length" class="sidebar-header">
              <el-checkbox v-model="checkedCommandsAll">All</el-checkbox>
            </div>
            -->
          </el-scrollbar>
      </div>
      <div v-else>
        <div class="right-column-header panel-right padding-horizontal-x2 display-flex justify-content-between align-items-center" @click="showCommandsPanel">
          <item :icon="'commands-grey'" />
          <p class="">Select command</p>
          <i class="el-icon-arrow-right" />
        </div>
        <el-form class="commands-form" ref="simListQuery" :model="simListQuery" label-position="top" @submit.native.prevent="handleFilter">
          <input :id="filterSubmitId" type="submit" class="display-none">
            <!--<div class="padding-horizontal-x2">
              <el-row :gutter="16" style="">
                <el-col :xs="100">
                    <el-form-item :label="$t('AGENT')" prop="title" class="no-margin-bottom">
                    <el-select v-model="agentsArr[0]" :placeholder="$t('AGENT')" class="">
                      <el-option v-for="item in agentsArr" :key="item.code" :label="item.name" :value="item.code" />
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="$t('CUSTOMER')" prop="title" class="">
                    <el-select v-model="selectedCustomer" :placeholder="$t('CUSTOMER')">
                      <el-option v-for="item in customersArr" :key="item.code" :label="item.name" :value="item.code" />
                    </el-select>
                  </el-form-item>                
                </el-col>
              </el-row>
            </div>
            <div class="content-divider"></div>-->       
            <div class="padding-horizontal-x2 pb-20">
              <el-row :gutter="16" style="">
                <el-col :xs="100">
                  <el-form-item :label="$t('IMSI')" prop="title" class="no-margin-bottom">
                    <el-input  v-model="simListQuery.sample" placeholder="" class="filter-item" />
                  </el-form-item>
                </el-col>
              </el-row>     
            </div>        
            <div class="content-divider"></div>
            <div class="padding-horizontal-x2 py-20"> 
              <el-row :gutter="16">
                <el-col :xs="12" :sm="12" :md="12" :lg="12">
                  <label @click="clearFilter" class="el-button el-button--primary width-100 dark-btn group-btn">
                    <span>{{ $t('CLEAR') }}</span>
                  </label>
                </el-col>
                <el-col :xs="12" :sm="12" :md="12" :lg="12">
                  <label v-waves :for="filterSubmitId" class="el-button el-button--primary width-100 blue-btn group-btn">
                    <item :icon="'search-white'"/> <span>{{ $t('SEARCH') }}</span>
                  </label>
                </el-col>
              </el-row>
            </div>        
            <div class="content-divider"></div>    
          </el-form>
          <el-scrollbar wrap-class="scrollbar-wrapper">     
            <p v-show="!deviceList.length" class="no-sim-info">You can find the device by IMSI</p>   
            <div v-show="deviceList.length" class="sidebar-header">
              <el-checkbox v-model="checkedAll">All</el-checkbox>
            </div>
            <ul 
                v-show="deviceList.length" class="list">
              <li v-for="device in deviceList" :key="device.id">
                <div class="item-content" >
                  <div class="item-append">
                    <el-checkbox v-model="device.state" @input="handleChecked(device)"></el-checkbox>
                  </div>
                  <div class="item-inner">
                    <div class="item-title">
                      {{device.name}}
                    </div>
                    <div class="item-after">
                      <el-dropdown slot="prepend" trigger="click">
                        <i  class="el-icon-more rotate-90" style=""></i>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item>Option 1</el-dropdown-item>
                          <el-dropdown-item>Option 2</el-dropdown-item>
                          <el-dropdown-item>Option 3</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </el-scrollbar>
      </div>
    </el-aside>
  </el-container>
</template>

<script>

String.prototype.format = function (e) { var t = this; if($.isArray(e)) {for (var i = 0; i < e.length; i++) if (e[i] != undefined) { var r = new RegExp("({)" + i + "(})", "g"); t = t.replace(r, e[i]) } return t }else if (arguments.length == 1 && typeof e == "object") { for (var n in e) if (e[n] != undefined) { var r = new RegExp("({" + n + "})", "g"); t = t.replace(r, e[n]) } } else for (var i = 0; i < arguments.length; i++) if (arguments[i] != undefined) { var r = new RegExp("({)" + i + "(})", "g"); t = t.replace(r, arguments[i]) } return t };

import { mapGetters } from 'vuex'
import Item from '@/layout/components/Sidebar/Item'
import waves from '@/directive/waves' 
import moment from 'moment'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import Confirm from './message-box/confirm'
//import MessageBox from '/message-box/message'
import { create } from 'vue-modal-dialogs'
import { getSIMList, getSMSHistoryAsync, getCommandsListAsync, getCommandParamsAsync, sendCommandAsync } from '@/api/sim'

import { fetchSIMListAjax, getHistoryAjax } from "@/api/user";
const confirm = create(Confirm, 'title', 'content')

export default {
  name: 'App',
  data() {
    return {      
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
      newMessage: '',
      messageList: [
        {
          type: 'title',
          text: 'Today',
        },
      ],
      agentsArr: [
        { code: '1', name: 'Agent' }
      ],
      customersArr: [
        { code: '1', name: 'Customer' }
      ],    
      simListQuery: {
        limit: 1,
        sample: ''
      },
      filterSubmitId: Date.now(),
      intervalForReply: null,
      smsQuery: {
      },
      loadedSMS: [],      
			monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    }
  },
  directives: { waves },
  components: {
      Item,
      Loading
  },
  //props : ['imsi'],
  created() {
    /*this.$store.watch(
      (state) => {
        return this.$store.state.dashboard.imsi // could also put a Getter here
      },
      (newValue, oldValue) => {
        console.log('new',newValue)
        
      },
      {
        deep: true
      }
    )*/
  },
  watch: {
    /*'$route.params.newimsi': {
        handler: function(search) {           
          
        },
        deep: true,
        immediate: true
      },*/
    checkedAll(state){
      for (let i = 0; i < this.deviceList.length; i++) {
        this.deviceList[i].state = state
      }      
      this.loadedSMS = []
      this.messageList = [] 
      this.getHistory()
    },
  },
  computed: {
    ...mapGetters([
      'avatar'
    ])
  },
  mounted(){
    console.log('eee',this.$store.state.dashboard.imsi)
    if(this.$store.state.dashboard.imsi){
      this.simListQuery.sample = this.$store.state.dashboard.imsi    
      this.$store.dispatch('dashboard/setIMSI', '')      
      this.isLoading = true     
      this.searchSIMList()
    }
  },
  methods: {
    clearFilter() {
      this.isLoading = true     
      this.simListQuery.sample = ''      
      this.isLoading = false     
    },
    handleFilter() {
      this.isLoading = true     
      this.deviceList = []
      this.searchSIMList()
    },
    async searchSIMList() {
      const arr = []

      for (let i = 0; i < this.deviceList.length; i++) {
        this.deviceList[i].state = false
      }      
      this.loadedSMS = []
      this.messageList = [] 

      //console.log(this.simListQuery)
      if(this.simListQuery.sample!=undefined){
       
       this.simListQuery = {
          Rows: 5,
          IMSIs: [this.simListQuery.sample],
        }
        fetchSIMListAjax(this.simListQuery).then(response => {
           if(response.rows.length){

              console.log('all',response.rows)
              response.rows.forEach(element => {
                arr.push({
                  id: element.IMSI,
                  name: element.IMSI,
                  state: false,
                })
              })     
              this.isLoading = false     
              this.deviceList = arr
              
              this.deviceList[0].state = true
              this.getHistory()
            }else{
              this.isLoading = false 
              this.$alert('Can not find this SIM number', 'M2M Data Message', {type: 'message'})

            }
        }).catch(e => {
          this.isLoading = false 
          this.$alert('Can not find this SIM number', 'M2M Data Message', {type: 'message'})
      
        }) 
        
       } else{
         this.isLoading = false    
      }     
    },
    handleChecked({name, state}){
      this.loadedSMS = []
      this.messageList = [] 
      this.getHistory()
    },
    async sendMessage(){     
      let self = this 
      if(this.newMessage){
        if(this.deviceList.length) {
          const someArr = this.deviceList.some(el => el.state === true)   
          if(someArr) {
            //this.isLoading = true 
            const datetime = moment.utc().toDate()						
            const time = datetime.getDate() + ' ' + this.monthNames[datetime.getMonth()] + datetime.getFullYear() + ' ' + ('0' + datetime.getHours()).slice(-2) + ':' + ('0' + datetime.getMinutes()).slice(-2) + ':' + ('0' + datetime.getSeconds()).slice(-2)
 
            for (let i = 0; i < this.deviceList.length; i++) {
              if(this.deviceList[i].state) {
                
                
                var query = {
                  IMSI: this.deviceList[i].name,
                  SMS: this.newMessage
                }
				/*
                var settings = {
                  "url": "https://api.m2mglobaltech.com/QuikData/v1/SMS/SendSMS?deviceId="+query.IMSI+"&message="+query.SMS+"",
                  "method": "GET",
                  "timeout": 0,
                  "headers": {
                  "token": "00000000-0000-0000-0000-000000000000",
                  "Content-Type": "application/x-www-form-urlencoded"
                  },
                  //"data": query
                }*/
                
              const result = await fetch("https://api.m2mglobaltech.com/QuikData/v1/SMS/SendSMS?deviceId="+query.IMSI+"&message="+encodeURIComponent(query.SMS)).catch(e=>{
                console.log(e)
                   self.$alert('Command was not sent to IMSI ' + self.deviceList[i].name, 'M2M Data Message', {type: 'message'})
                 return
              })
                let jsonResult = await result.json()
                //$.ajax(settings).done(function (result) {
                console.log(jsonResult)
                if(jsonResult.MajorCode=='000'){
                    const obj = {
                      new: true,
                      timestamp: time,
                      from: 'me',
                      to: this.deviceList[i].name,
                      text: this.newMessage,
                      type: 'sent',
                    }
                    self.messageList.push(obj)
                  

                  this.newMessage = ''
                  this.$nextTick(() => {
                    const el = this.$el.getElementsByClassName('unreaded')[0];
                  
                    if (el) {
                      el.scrollIntoView({behavior: 'smooth'});
                    }
                      
                  })
                    
                     if(!self.intervalForReply){
                    self.intervalForReply = setInterval(function () {          
                      self.getHistory()
                    }, 30000)
                  }

                    }else{
                       self.$alert('Command was not sent to IMSI ' + self.deviceList[i].name, 'M2M Data Message', {type: 'message'})
                 
                    }
                  //this.isLoading = false  
                  
                 
                //}).fail(async function (e){
                  //console.log('err = '+e);
                //     self.$alert('Command was not sent to IMSI ' + self.deviceList[i].name, 'M2M Data Message', {type: 'message'})
                 
                
              
                //})
                
                /*~~~const query = {
                  imsi: this.deviceList[i].name,
                  content: this.newMessage
                }
                const response = await sendCommandAsync(query).catch(e=>{
                  this.$alert('Command was not sent to IMSI ' + this.deviceList[i].name, 'M2M Data Message', {type: 'message'})
                })
                if(response){
                  const obj = {
                    new: true,
                    timestamp: time,
                    from: 'me',
                    to: this.deviceList[i].name,
                    text: this.newMessage,
                    type: 'sent',
                  }
                  this.messageList.push(obj)
                }*/
              }
            }      
           
            
          }else{
            this.$alert('Please choose a SIM for sending command.', 'M2M Data Message', {type: 'message'})
        
          }
        }else{
          this.$alert('Please choose a SIM for sending command.', 'M2M Data Message', {type: 'message'})      
        }
      }      
    },
    getHistory(){     
      let i = 0
      let concatArr = []
      this.deviceList.forEach(async (element, index, arr) => {
        if(this.deviceList[index].state) {
          const query = {
            imsi: this.deviceList[index].name
          } 
          
          let self = this
          getHistoryAjax({
						"IMSI":  query.imsi,
						"PAGE": "1",
						"pagesize": "100",
					  }).then(response => {
					//$.ajax(settings).done(function (response) {           
            /*let sortedArr = response.Data.sort(function(a,b){
              let c = new Date(a.CreateTime)
              let d = new Date(b.CreateTime)
              return d-c
            })
            console.log('OKKK-his',sortedArr) */
            concatArr = concatArr.concat(response.Data)
            i++
            if(i == arr.length) {
              self.isLoading = true
              let sortedArr = concatArr.sort(function(a,b){
                var c = new Date(a.CreateTime)
                var d = new Date(b.CreateTime)
                return d-c
              })
              self.setHistory(sortedArr.reverse())       
            }
          })
          /*~~~const response = await getSMSHistoryAsync(query).catch(e=>[])
          if (response.data) {
            concatArr = concatArr.concat(response.data)          						
          }*/        
        }
      })
    },
    setHistory(arr){
      arr.forEach(value => {
        let obj = {}

        if (this.loadedSMS.indexOf( value.CenterNumber + ' ' + value.CreateTime + value.Message[0] ) == -1){
          
          this.loadedSMS.push(value.CenterNumber + ' ' + value.CreateTime + value.Message[0])
          const datetime = moment.utc(value.CreateTime).toDate()						
					const time = datetime.getDate() + ' ' + this.monthNames[datetime.getMonth()] + ' ' + ('0' + datetime.getHours()).slice(-2) + ':' + ('0' + datetime.getMinutes()).slice(-2) + ':' + ('0' + datetime.getSeconds()).slice(-2)
                 
          obj.timestamp = time   
          obj.from = value.CenterNumber
          obj.to = this.deviceList[0].name
          obj.status = value.State==0?'Error':value.State==1?'Sent':value.State==2?'Submitted':value.State==3?'Delivered':'Received'

          if (value.Message) {
            obj.text = value.Message.replace(/</g, "&lt;").replace(/>/g, "&gt;")
          }
							
          if (value.Direction == 2) {      
            obj.type = 'sent'
            if(value.State == 3 || value.State == 2 || value.State == 1 || value.State == 0){
              const elToRemove = []
              this.messageList.map((el, i) => {
                if(el.text === obj.text && el.hasOwnProperty('new')){
                  elToRemove.push(i)
                }
              })
             
              elToRemove.forEach(element => {
                this.messageList.splice(element, 1)                
              })

              /*$('.message-sent').each(function(i, ele) {
                if(replySMS === $(this).find('.message-text').text() && $(this).find('.message-bubble').find('.msg-status').text() != 'Delivered'){
                  $(this).remove();
                }
              })*/
            }
          }else if(value.Direction == 1){
            obj.type = 'received'
          }

          this.messageList.push(obj)
          
        }
      })
      this.$nextTick(() => {
        const el = this.$el.getElementsByClassName('unreaded')[0];
      
        if (el) {
          el.scrollIntoView({behavior: 'smooth'});
        }
        
        this.isLoading = false     
      })
    },
    handleChange(val) {
      
    },
    async chooseCommand(val){
			let smsFormat = val.Format
      let arr = eval(val.Params)
      let params = []							
      let count=arr.length
      if(count){        
        for(var i=0; i<arr.length; i++) {		
          let curPar = await confirm(arr[i].Name, arr[i].Prams).transition()//self.$app.dialog.prompt(arr[i].Name, function (name) {
          params.push(curPar)
          this.newMessage = smsFormat.format(params)
        }
      }else{
        this.newMessage = val.Format
      }
      
    },
    closeCommandsPanel(){
      this.isCommandsPanelVisible = false
    },
    async showCommandsPanel(){      
      this.isCommandsPanelVisible = true
      const response = await getCommandsListAsync()
      if(response)
      {	
        this.commandGroupList = response        
        this.$nextTick(()=>{
          this.listLoading = false
        })
      }
    },
    messageClass: function (message) {
      return {
        'messages-title': message.type === 'title',
        'message': message.type !== 'title',
        'message-sent': message.type === 'sent',
        'message-received': message.type === 'received',
      }
    }
  },
}
</script>

<style lang="scss">

  .rotate-90{
    transform: rotate(90deg);
  }
  .sms-page.chat-container{
    position: relative;
    height: calc(100vh - 75px) !important;
    width: 100%;
    position: fixed;
  }
  .sms-page .chat-sidebar{
    background-color: #ffffff;
    color: #333;
    -webkit-box-shadow: 0 1px 4px rgba(0,21,41,0.08);
    box-shadow: 0 1px 4px rgba(0,21,41,0.08);
  }
  .sms-page .sidebar-header{
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
  .sms-page{
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
  }

  .sms-page{
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
          color: #fff;
          background: rgb(40, 165, 224);
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
          background: rgb(246, 248, 252);
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
          display: flex;
          align-items: center;
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
          border-radius: 5px;
          padding: 20px 15px;
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
}


.sms-page{
  .panel-right p{
    padding-right: 25px;
}
.panel-right{
    background-color: rgb(238, 241, 246)
}
.messages-container {
    background-color: #ffffff;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
}

.messagebar-container{
    border-top: 1px solid #e3e3e3;
    background-color: #ffffff;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
}
.time-border{
    border-radius: 50px;
    padding: 10px 30px;
    border: 1px solid #e3e3e3;
    color: rgb(96, 98, 104);
    font-weight: 500px;
}
.user-avatar {
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 20px;
    vertical-align: middle;
}
.message-header {
    padding: 5px 0;
}
.message-status {
    padding: 5px;
    color: rgb(65, 190, 162);
    line-height: 1.144;
    font-size: 14px;
}
.message-status-new{
  padding: 5px;
    color: #ffc496;
    line-height: 1.144;
    font-size: 14px;
}
.message-time {
    padding: 5px;
    color: rgb(96, 98, 104);
    line-height: 1.144;
    font-size: 14px;
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
.blue-btn{
    border-color: #28a5e0;
    background-color: #28a5e0;
  }
  .blue-btn:hover,.blue-btn:active,.blue-btn:focus{
    border-color: #32aee8;
    background-color: #32aee8;
  }
  .commands-form{
      background-color: #ffffff;
      border-top: 1px solid #e3e3e3;
  }

  .group-btn{
    padding: 12px 0;
  }
  .no-sim-info{
    text-align: center;
    background-color: #ffffff;
    padding: 15px;
    font-size: 12px;
    color: grey;
  }
  .el-footer{
    padding: 20px 10px 20px 20px;
    height: 80px !important;
    position: relative !important;
  }
  .scrollbar-loading .collapse-list{
    padding: 25px 0;
  }
  .scrollbar-loading{
    padding-top: calc(50vh - 110px);
  }
  .scrollbar-loading .el-collapse{
    border: none;
  }
  .scrollbar-loading .el-scrollbar__wrap{
    overflow: hidden;
    margin: 0 !important;
  }
  .collapse-item .el-collapse-item__header{
    font-size: 12px;
    padding: 0 12px 0 20px;
    font-weight: 600;
    color: rgb(96, 98, 104);
  }
  .right-column-header{
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    color: rgb(96, 98, 104);
  }
  .right-column-header:hover{
    background-color: rgb(238, 241, 246);
  }
  .collapse-item .item-content{
    font-size: 12px;
    border-top: 1px solid #e3e3e3;
    color: rgb(96, 98, 104);
  }
  .el-collapse-item__content{
    padding-bottom: 0;
  }
  .el-collapse-item__content .list .item-content{
    cursor: pointer;
  }

  .dialog-mask {
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
  .message-box .dialog-content {
    min-width: 240px;
    text-align: center;
    font-size: 16px;
}
.dialog-content {
    margin: 0 20px;
    padding: 20px 30px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    color: #303133;
}
.el-aside {
    overflow: hidden !important;
}
}

.app-main{
  overflow: inherit;
}

</style>

<style >


</style>