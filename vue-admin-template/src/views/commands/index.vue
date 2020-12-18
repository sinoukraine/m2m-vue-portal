<template>
  <el-container class="chat-container">
    <el-container class="p-20">
      <el-main class="messages-container">
        <div class="messages">
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
                    <div class="message-status">Delivered</div>
                    <div class="message-time">12:12:21</div>
                    <div v-show="message.type === 'sent'">
                        <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
                    </div>
                </div>
                <div class="message-bubble">
                  <div class="message-text">
                    {{message.text}}
                  </div>
                </div>
              </div>
            </slot>
          </div>
        </div>
      </el-main>

      <el-footer class="messagebar-container">
        <div class="display-flex justify-content-between">
            <el-input placeholder="Command" v-model="inputCommand" class="input-with-select">
            </el-input>
            <div class="buttons-row white-space-nowrap">
            <el-button slot="append" class="button-custom blue-btn" type="primary" ><item :icon="'send-white'" /> Send</el-button>
            </div>
        </div>
      </el-footer>
    </el-container>

    
    <el-aside width="250px" style="" class="chat-sidebar">
    <div class="panel-right padding-horizontal-x2 display-flex justify-content-between align-items-center" @click="isRightPanelVisible = !isRightPanelVisible">
        <item :icon="'commands-grey'" />
        <p class="">Select command</p>
        <i class="el-icon-arrow-right" />
    </div>
    <el-form class="commands-form" ref="listQuery" :model="listQuery" label-position="top" @submit.native.prevent="handleFilter">
          <div class="padding-horizontal-x2">
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
          <div class="content-divider"></div>
          <div class="padding-horizontal-x2">
            <el-row :gutter="16" style="">
              <el-col :xs="100">
                <el-form-item :label="$t('IMSI')" prop="title" class="no-margin-bottom">
                  <el-input  placeholder="" class="filter-item" />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-form>
      <el-scrollbar wrap-class="scrollbar-wrapper">        
        <div class="sidebar-header">
          <el-checkbox v-model="checkedAll">All</el-checkbox>
        </div>
        <ul class="list">
          <li v-for="device in deviceList" :key="device.id">
            <div class="item-content" >
              <div class="item-append">
                <el-checkbox v-model="device.checkboxState"></el-checkbox>
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

    </el-aside>
  </el-container>
</template>

<script>

import { mapGetters } from 'vuex'
import Item from '@/layout/components/Sidebar/Item'

export default {
  name: 'App',
  data() {
    return {
      inputCommand: '',
      checkedAll: '',
      deviceList: {},
      messageList: [],
      agentsArr: [
        { code: '1', name: 'Agent' }
      ],
      customersArr: [
        { code: '1', name: 'Customer' }
      ],
    }
  },
  components: {
      Item
  },
  watch: {
    checkedAll(state){
      for (let i = 0; i < this.deviceList.length; i++) {
        this.deviceList[i].checkboxState = state;
      }
    }
  },
  computed: {
    ...mapGetters([
      'avatar'
    ])
  },
  methods: {
    messageClass: function (message) {
      return {
        'messages-title': message.type === 'title',
        'message': message.type !== 'title',
        'message-sent': message.type === 'sent',
        'message-received': message.type === 'received',
      }
    }
  },
  mounted() {
    this.deviceList = [
      {
        id: '1',
        name: '123456789012345',
        checkboxState: false,
      },
      {
        id: '2',
        name: '123456789012346',
        checkboxState: false,
      },
      {
        id: '3',
        name: '123456789012347',
        checkboxState: false,
      }
    ];

    this.messageList = [
      {
        type: 'title',
        text: 'Today',
      },
      {
        type: 'sent',
        text: 'some text that was sent',
        from: 'me',
        timestamp: '2020-07-16 14:25:43',
      },
      {
        type: 'received',
        from: '123456789012345',
        text: 'reply that was received',
        timestamp: '2020-07-16 14:26:10'
      },
    ]
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
      background-color: rgb(238, 241, 246);
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


</style>

<style >
.p-20{
    padding: 20px;
}
.panel-right p{
    padding-right: 25px;
}
.messages-container {
    background-color: #ffffff;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
}

.messagebar-container{
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
.message-time {
    padding: 5px;
    color: rgb(96, 98, 104);
    line-height: 1.144;
    font-size: 14px;
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
</style>