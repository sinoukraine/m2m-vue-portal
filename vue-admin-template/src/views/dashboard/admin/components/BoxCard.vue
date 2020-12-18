<template>
  <el-card class="box-card-component mb-30" >
    <div class="w-100 d-flex box-header" >
            <div class="card-inline card-panel-left font-16 bold color-grey " >
              Data Sessions
            </div>
            <div class="card-inline card-panel-right d-flex">
              <el-dropdown class="menu-container right-menu-item hover-effect pointer" trigger="click">
                <div class="menu-wrapper">
                  <img src="menu.svg" class="menu-dropdown">
                </div>
                <el-dropdown-menu slot="dropdown">
                </el-dropdown-menu>
              </el-dropdown>
            </div>
        </div>
    
      <div class="progress-item">
        <span>Data Sessions this year</span>
        <el-progress :percentage="box.year/1400000"  :format="format"/>
        <div class="percent-compare" style="color:rgb(64, 191, 162)"><i class="el-icon-top"/>32.8%</div>
      </div>
      <div class="progress-item">
        <span>Data Sessions this month</span>
        <el-progress :percentage="box.month/1400000"  :format="format"/>
        <div class="percent-compare"  style="color:rgb(64, 191, 162)"><i class="el-icon-top" />4.4%</div>
      </div>
      <div class="progress-item">
        <span>Data Sessions this day</span>
        <el-progress :percentage="box.day/1400000"  :format="format"/>
        <div class="percent-compare" style="color:rgb(212, 121, 128)"><i class="el-icon-bottom" />2.4%</div>
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
    ])
  },
  methods: {
    format(percentage) {
      return (percentage*1400000).toFixed(0)
    }
  }
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
      width: 100px;
      right: 0px;
      margin-top: -15px;
      position: absolute;
    }
    .percent-compare i{
      font-size: 14px;
      font-weight: 600;
    }
</style>
