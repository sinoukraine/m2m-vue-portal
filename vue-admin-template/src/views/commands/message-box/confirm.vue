<template>
  <div class="message-box dialog-mask">
    <div class="dialog-content">
      <header>{{ title }}</header>
      <div class="dialog-body">
        <p>{{ content }}</p>
        <input type="text" v-model="value">
      </div>
      <footer>
        <el-button type="text" size="mini" @click="$close(value)">Yes</el-button>
        <!--<el-button type="text" size="mini" @click="$close(false)">No</el-button>-->
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {      
      value: '',
    }
  }
}
</script>