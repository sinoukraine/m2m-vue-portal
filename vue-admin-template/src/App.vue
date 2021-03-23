<template>
  <div id="app" >
    <router-view />
  </div>
</template>

<script>
import { loadLanguageAsync } from "@/utils/i18n";
import { FieldsEnum, MinorCodeEnum } from "@/utils/dictionaries"

export default {
  name: 'App',
  async mounted(){
    //get default language pack
    loadLanguageAsync('en')
  },
  computed: {
    error() {
      return this.$store.getters['app/ERROR'];
    },
    apiValidationError() {
      return this.$store.getters['app/API_VALIDATION_ERROR'];
    },
  },
  watch: {
    error(err) {
      if(err && err.code === 'ECONNABORTED'){
        this.$message.error('Connection Timeout Error. Please, try again later');
      }else{
        this.$message.error('Connection Error. Please, try again later');
      }
    },
    apiValidationError(err){
      console.log(err)
      let title = 'Error'
      let message = 'An issue has been detected, please try again later or contact our support team';

      //001 validation issue
      //003 token issue

      switch (err.MajorCode){
        case '001':
          title = 'Validation Error'
          if(err.Data && err.Data.length){
            message = ''
            for (const errField of err.Data){console.log(errField)
              if(errField.Messages && errField.Messages.length){
                if(message) message += '</br>'
                message += `${ FieldsEnum[errField.Key] } - `
                errField.Messages.forEach((item) => { message += MinorCodeEnum[item] + ', ' });
                message = message.slice(0, -2);
              }
            }
          }
          break
      }

      this.$alert(message, title, {type: 'error'})
    }
  }
}
</script>
