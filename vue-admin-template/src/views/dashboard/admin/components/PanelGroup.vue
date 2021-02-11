<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="24" :sm="12" :md="12" :lg="lg" class="card-panel-col">
      <div class="card-panel justify-content-between bg-green">
        <div class="card-panel-icon-wrapper card-top">
          <div class="card-inline card-panel-left font-16">
            Data Sessions
          </div>
          <div class="card-inline card-panel-right">
            <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click" @command="handlePeriod">
              <div class="avatar-wrapper">
                <img src="menu_white.svg" class="menu-dropdown">
              </div>
              <el-dropdown-menu slot="dropdown" >
                  <el-dropdown-item command="daily">Daily</el-dropdown-item>
                  <el-dropdown-item command="weekly">Weekly</el-dropdown-item>
                  <el-dropdown-item command="monthly">Monthly</el-dropdown-item>   
                  <el-dropdown-item command="yearly">Yearly</el-dropdown-item>                
              </el-dropdown-menu>
            </el-dropdown>
            <!--<el-radio-group v-model="switchPeriod" v-on:input="handlePeriod" >
              <el-radio-button label="daily" type="outline"/>
              <el-radio-button label="weekly" type="outline"/>
              <el-radio-button label="monthly" type="outline"/>
            </el-radio-group>-->
          </div>
          <!--<i class="el-icon-s-cooperation card-panel-icon" />-->
        </div>
        <div class="card-panel-icon-wrapper display-flex card-bottom">
          <div class="card-inline card-panel-left">
            <div v-if="loading">
              <img src="loading.gif" width="50">
            </div>
            <div v-else>
              <count-to :start-val="0" :end-val="+total.totalDataSessions" :duration="2600" class="card-panel-num" />  
              
            </div>
          </div>
          <div class="card-inline card-panel-right">
            <!--<svg-icon class-name="data-session" icon-class="data-session" />-->
          </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :md="12" :lg="lg" class="card-panel-col">
    <div class="card-panel justify-content-between bg-violet" >
        <div class="card-panel-icon-wrapper card-top">
          <div class="card-inline card-panel-left font-16">
            Data Usage
          </div>
          <div class="card-inline card-panel-right">
            <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click" @command="handlePeriod">
              <div class="avatar-wrapper">
                <img src="menu_white.svg" class="menu-dropdown">
              </div>
              <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="daily">Daily</el-dropdown-item>
                  <el-dropdown-item command="weekly">Weekly</el-dropdown-item>
                  <el-dropdown-item command="monthly">Monthly</el-dropdown-item>      
                  <el-dropdown-item command="yearly">Yearly</el-dropdown-item>            
              </el-dropdown-menu>
            </el-dropdown>
            <!--<el-radio-group v-model="switchPeriod" v-on:input="handlePeriod" >
              <el-radio-button label="daily" type="outline"/>
              <el-radio-button label="weekly" type="outline"/>
              <el-radio-button label="monthly" type="outline"/>
            </el-radio-group>-->
          </div>
          <!--<i class="el-icon-s-cooperation card-panel-icon" />-->
        </div>
        <div class="card-panel-icon-wrapper display-flex card-bottom">
          <div class="card-inline card-panel-left">
            <div v-if="loading">
              <img src="loading.gif" width="50">
            </div>
            <div v-else>
              <count-to :start-val="0" :end-val="+total.totalDataUsage" :duration="2600" class="card-panel-num" />
           
            </div>
          </div>
          <div class="card-inline card-panel-right">
            <!--<svg-icon class-name="data-usage" icon-class="data-usage" />-->
          </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :md="12" :lg="lg" class="card-panel-col">
    <div class="card-panel justify-content-between bg-orange" >
        <div class="card-panel-icon-wrapper card-top">
          <div class="card-inline card-panel-left font-16">
            SMS Usage
          </div>
          <div class="card-inline card-panel-right">
            <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click" @command="handlePeriod">
              <div class="avatar-wrapper">
                <img src="menu_white.svg" class="menu-dropdown">
              </div>
              <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="daily">Daily</el-dropdown-item>
                  <el-dropdown-item command="weekly">Weekly</el-dropdown-item>
                  <el-dropdown-item command="monthly">Monthly</el-dropdown-item>    
                  <el-dropdown-item command="yearly">Yearly</el-dropdown-item>              
              </el-dropdown-menu>
            </el-dropdown>
            <!--<el-radio-group v-model="switchPeriod" v-on:input="handlePeriod" >
              <el-radio-button label="daily" type="outline"/>
              <el-radio-button label="weekly" type="outline"/>
              <el-radio-button label="monthly" type="outline"/>
            </el-radio-group>-->
          </div>
          <!--<i class="el-icon-s-cooperation card-panel-icon" />-->
        </div>
        <div class="card-panel-icon-wrapper display-flex card-bottom">
          <div class="card-inline card-panel-left">
            <div v-if="loading">
              <img src="loading.gif" width="50">
            </div>
            <div v-else>
              <count-to :start-val="0" :end-val="+total.totalSMSUsage" :duration="2600" class="card-panel-num" />
            </div>
          </div>
          <div class="card-inline card-panel-right">
            <!--<svg-icon class-name="sms-usage" icon-class="sms-usage" />-->
          </div>
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :md="12" :lg="lg" class="card-panel-col">
    <div class="card-panel justify-content-between bg-red" >
        <div class="card-panel-icon-wrapper card-top">
          <div class="card-inline card-panel-left font-16">
            Online Numbers
          </div>
          <div class="card-inline card-panel-right">
            <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click" @command="handlePeriod">
              <div class="avatar-wrapper">
                <img src="menu_white.svg" class="menu-dropdown">
              </div>
              <el-dropdown-menu slot="dropdown" >
                  <el-dropdown-item command="daily">Daily</el-dropdown-item>
                  <el-dropdown-item command="weekly">Weekly</el-dropdown-item>
                  <el-dropdown-item command="monthly">Monthly</el-dropdown-item>    
                  <el-dropdown-item command="yearly">Yearly</el-dropdown-item>              
              </el-dropdown-menu>
            </el-dropdown>
            <!--<el-radio-group v-model="switchPeriod" v-on:input="handlePeriod" >
              <el-radio-button label="daily" type="outline"/>
              <el-radio-button label="weekly" type="outline"/>
              <el-radio-button label="monthly" type="outline"/>
            </el-radio-group>-->
          </div>
          <!--<i class="el-icon-s-cooperation card-panel-icon" />-->
        </div>
        <div class="card-panel-icon-wrapper display-flex card-bottom">
          <div class="card-inline card-panel-left">
            <div v-if="loading">
              <img src="loading.gif" width="50">
            </div>
            <div v-else>
              <count-to :start-val="0" :end-val="+total.totalDuration" :duration="2600" class="card-panel-num" />
              
            </div>
          </div>
          <div class="card-inline card-panel-right">
            <!--<svg-icon class-name="flow-usage" icon-class="flow-usage" />-->
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  props: ['lg','total'],
  data() {
    return {
      loading: true,
      //switchPeriod: 'weekly'
    }
  },
  methods: {
    handlePeriod(val){
      this.loading = true
      this.$emit('change', val)
      //this.$store.dispatch('dashboard/setPeriod', val)
    }
  },
  /*created() {
    this.$store.watch(
      (state)=>{
        return this.$store.state.dashboard.period // could also put a Getter here
      },
      (newValue, oldValue)=>{
        this.switchPeriod = newValue
      },
      {
        deep:true
      }
    )
  },*/
  watch: {
    total: function(val) {
      if(val.loaded==true) {
        //console.log('issss', val.totalDataUsage)
        this.loading = false
      }else{
        this.loading = true
      }
    },
  },
  /*computed: {
    switchPeriod: {
      get() {
        console.log(this.period)
        return this.period
      },
      set(val) {
        this.$store.dispatch('dashboard/setPeriod', val)
      }
    }
  }*/
}
</script>

<style lang="scss" scoped>
.panel-group {

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    min-height: 135px;
    cursor: pointer;
    padding: 5px 15px 10px 12px;
    font-weight:  600;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    border-radius: 5px;

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
     /* float: left;*/
      /*margin: 14px 0 0 14px;*/
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-panel-icon {
     /* float: left;*/
      font-size: 48px;
      margin-top: 12px;
    }

    .card-panel-description {
      /*float: right;*/
      font-weight: bold;
      margin: 14px 26px 14px 0;
      text-align: right;

      .card-panel-sub{

        margin-left: 8px;

        .label{
          color: rgba(0,0,0,0.45);
        }
      }
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}


.bg-green {
  background-color: rgb(64, 191, 162);
}

.bg-orange {
  background-color: rgb(253, 181, 131);
}

.bg-red {
  background-color: rgb(212, 121, 128);
}

.bg-violet {
  background-color: rgb(181, 163, 221);
}

.el-radio-button__inner{
  padding: 6px 4px;
  background: transparent;
  border: 1px solid #fff;
  color: #fff;
}

.el-radio-button__inner:hover{
  background: rgba(255, 255, 255, .1);
  border: 1px solid #fff;
  color: #fff;
}

.el-radio-button__orig-radio:checked+.el-radio-button__inner {
    background-color: #fff;
    border-color: #fff;
    -webkit-box-shadow: -1px 0 0 0 #fff;
    box-shadow: -1px 0 0 0 #fff;
}

.bg-green .el-radio-button__orig-radio:checked+.el-radio-button__inner {
  color: rgb(64, 191, 162);
}

.bg-red .el-radio-button__orig-radio:checked+.el-radio-button__inner {
  color: rgb(212, 121, 128);
}

.bg-orange .el-radio-button__orig-radio:checked+.el-radio-button__inner {
  color: rgb(253, 181, 131);
}

.bg-violet .el-radio-button__orig-radio:checked+.el-radio-button__inner {
  color: rgb(181, 163, 221);
}

.is-active .el-radio-button__inner{
  background: #fff;
  border: 1px solid #fff;
  color: rgb(64, 191, 162);
}
</style>

<style>

/* custom */

.menu-dropdown{
  width: 20px;
}

.el-radio-group {
  min-width: 140px;
}

.card-inline {
  /*display: inline-block;
  min-width: calc(50% - 0px);*/
}

.card-panel-left {
  text-align: left;
}

.font-16{  
  font-size: 16px;
}

.card-panel-right {
  text-align: right;
  white-space: nowrap;
}

.card-top .card-panel-left {
  /*padding-bottom: 20px;*/
}

.card-bottom .card-panel-left {

}

.card-bottom .svg-icon{
  width: 30px;
  height: 30px;
  opacity: 0.7;
}

.card-panel-num {
  font-size: 28px;
  font-weight: 600;
}

.display-flex {
  display: flex;
}

</style>

