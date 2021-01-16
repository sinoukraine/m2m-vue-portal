<template>
  <div class="message-box dialog-mask">
    <div class="dialog-content">
      <header class="popup-title">{{ title }}</header>
      <div class="dialog-body py-20">
        <input type="text" v-model="content" class="el-input__inner">
      </div>
      <footer>
        <el-button v-waves slot="append" class="button-custom dark-btn" type="primary" @click="$close(content)">Yes</el-button>
        <!--<el-button type="text" size="mini" @click="$close(false)">No</el-button>-->
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: 'confirm',
  data() {
    return {      
      content: '',
    }
  }
}
</script>

<style scoped>
  .popup-title{
    font-size: 14px;
    color: rgb(96, 98, 104);
  }
  
.py-20{
  padding-top: 20px;
  padding-bottom: 20px;
}
</style>