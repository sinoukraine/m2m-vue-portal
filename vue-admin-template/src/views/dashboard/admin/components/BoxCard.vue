<template>
  <el-card class="box-card-component mb-30" >
    <div class="w-100 d-flex box-header" >
            <div class="card-inline card-panel-left font-16 bold color-grey " >
              {{box.report}}
            </div>
            <div class="card-inline card-panel-right d-flex">
              <el-dropdown class="menu-container right-menu-item hover-effect pointer" trigger="click"  @command="handleBox">
                <div class="menu-wrapper">
                  <img src="menu.svg" class="menu-dropdown">
                </div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="Data Sessions">Data Sessions</el-dropdown-item>
                  <el-dropdown-item command="Data Usage">Data Usage</el-dropdown-item>
                  <el-dropdown-item command="SMS Usage">SMS Usage</el-dropdown-item> 
                  <el-dropdown-item command="Online Numbers">Online Numbers</el-dropdown-item>   
                </el-dropdown-menu>
              </el-dropdown>
            </div>
        </div>
    
      <div class="progress-item">
        <span>{{box.report}} this year</span>
        <el-progress :color="compareFrom(box.year, box.preYear)>0?'#28a5e0':'rgb(212, 121, 128)'" :percentage="percentFrom(box.year, box.preYear,'year')"  :format="format"/>
        <div class="percent-compare" >{{box.year!=undefined?box.year.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","):''}} <span class="" :style="{color: compareFrom(box.year, box.preYear)>=0?'rgb(64, 191, 162)':'rgb(212, 121, 128)'}"  style="margin-left:5px;"><i  :class="compareFrom(box.year, box.preYear)>=0?'el-icon-top':'el-icon-bottom'"/>{{compareFrom(box.year, box.preYear)}}%</span></div>
      </div>
      <div class="progress-item">
        <span>{{box.report}} this month</span>
        <el-progress :color="compareFrom(box.month, box.preMonth)>0?'#28a5e0':'rgb(212, 121, 128)'" :percentage="percentFrom(box.month, box.preMonth,'month')"  :format="format"/>
        <div class="percent-compare" >{{box.month!=undefined?box.month.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","):''}} <span class="" :style="{color: compareFrom(box.month, box.preMonth)>=0?'rgb(64, 191, 162)':'rgb(212, 121, 128)'}"  style="margin-left:5px;"><i  :class="compareFrom(box.month, box.preMonth)>=0?'el-icon-top':'el-icon-bottom'"/>{{compareFrom(box.month, box.preMonth)}}%</span></div>
      </div>
      <div class="progress-item">
        <span>{{box.report}} this day</span>
        <el-progress :color="compareFrom(box.day, box.preDay)>0?'#28a5e0':'rgb(212, 121, 128)'" :percentage="percentFrom(box.day, box.preDay,'day')"  :format="format"/>
        <div class="percent-compare" >{{box.day!=undefined?box.day.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","):''}} <span class="" :style="{color: compareFrom(box.day, box.preDay)>=0?'rgb(64, 191, 162)':'rgb(212, 121, 128)'}" style="margin-left:5px;"><i :class="compareFrom(box.day, box.preDay)>=0?'el-icon-top':'el-icon-bottom'" />{{compareFrom(box.day, box.preDay)}}%</span></div>
      </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
import PanThumb from '@/components/PanThumb'
import Mallki from '@/components/TextHoverEffect/Mallki'

export default {
  components: { PanThumb, Mallki },
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
        boxer: {
          day: 0,
          month: 0,
          year: 0
        },
      statisticsData: {
        article_count: 1024,
        pageviews_count: 1024
      }
    }
  },
  props: ['box'],
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles'
    ]),
  },
  methods: {
    percentFrom(data, pre, cur){
      console.log('prop', data, pre)
      
            let perc = ((data-pre)*100/data)
      switch (this.$props['box'].report){        
          case 'Data Sessions':
            if(perc < 0) perc = -perc
            return perc
          break
          case 'Data Usage':
            if(perc < 0) perc = -perc
            return perc
          break
          case 'SMS Usage':            
            if(perc < 0) perc = -perc
            return perc
          break
          case 'Online Numbers':
            if(perc < 0) perc = -perc
            return perc
          break
        }     
    },    
    compareFrom(data, pre){
      switch (this.$props['box'].report){
          case 'Data Sessions':
            return ((data-pre)*100/data).toFixed(2)
          break
          case 'Data Usage':
            return ((data-pre)*100/data).toFixed(2)
          break
          case 'SMS Usage':
            return ((data-pre)*100/data).toFixed(2)
          break
          case 'Online Numbers':
            return ((data-pre)*100/data).toFixed(2)
          break
        }     
    },  
    format(percentage) {
      switch (this.$props['box'].report){
          case 'Data Sessions':
            return (percentage).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          break
          case 'Data Usage':
            return (percentage*11000).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          break
          case 'SMS Usage':
            return (percentage*200).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          break
          case 'Online Numbers':
            return (percentage*1000).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          break
        }   
    },
    handleBox(val){
      this.loading = true
      this.report = val
      this.$emit('change', val)
      //this.$store.dispatch('dashboard/setPeriod', val)
    }
  },
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
}
</script>

<style lang="scss" >
.box-card-component{
  .el-card__header {
    padding: 0px!important;
  }
}
</style>
<style lang="scss" scoped>
.box-card-component {
  .box-card-header {
    position: relative;
    height: 220px;
    img {
      width: 100%;
      height: 100%;
      transition: all 0.2s linear;
      &:hover {
        transform: scale(1.1, 1.1);
        filter: contrast(130%);
      }
    }
  }
  .mallki-text {
    position: absolute;
    top: 0px;
    right: 0px;
    font-size: 20px;
    font-weight: bold;
  }
  .panThumb {
    z-index: 100;
    height: 70px!important;
    width: 70px!important;
    position: absolute!important;
    top: -45px;
    left: 0px;
    border: 5px solid #ffffff;
    background-color: #fff;
    margin: auto;
    box-shadow: none!important;
    ::v-deep .pan-info {
      box-shadow: none!important;
    }
  }
  .progress-item {
    margin-bottom: 10px;
    font-size: 14px;
  }
  @media only screen and (max-width: 1510px){
    .mallki-text{
      display: none;
    }
  }
}
</style>

<style scoped>
  .el-card.is-always-shadow, .el-card.is-hover-shadow:focus, .el-card.is-hover-shadow:hover{
    -webkit-box-shadow: none;
    box-shadow: none;
    border: none;
  }
  
    
</style>

<style  scoped>
  .box-card-component .progress-item{
      margin-bottom: 30px;
    }
    .el-card{
      height: 301px;
    }
    .percent-compare{
      width: 200px;
      right: 35px;
      margin-top: -15px;
      position: absolute;
      text-align: right;
    }
    .percent-compare i{
      font-size: 14px;
      font-weight: 600;
    }
</style>
