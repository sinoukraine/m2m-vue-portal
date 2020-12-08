<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import {getCDRSList} from '@/api/sim'
import moment from 'moment'

export default {
  name: 'App',  
  data() {
    return {
    }
  },
  async mounted() {
    
  }
}
</script>
