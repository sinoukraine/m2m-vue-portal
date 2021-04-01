<template>
  <el-form>
    <el-form-item label="Current Passoword">
      <el-input type="password" v-model.trim="temp.CurrentPassoword" />
    </el-form-item>
    <el-form-item label="New Passoword">
      <el-input type="password" v-model.trim="temp.Password" />
    </el-form-item>
    <el-form-item label="Confirm New Password">
      <el-input type="password" v-model.trim="temp.RePassword" />
    </el-form-item>
    <el-form-item class="pt-20">
      <el-button type="primary" @click="submit">Update</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { resetMyPasswordAjax } from "@/api/user";
import { fetchRoleListAjax } from "@/api/role-managment";

export default {
  data() {
    return {
      temp: {
        CurrentPassoword:'',
        Password:'',
        RePassword:'',
      }
    }
  },
  created(){    
    //const {Account, FirstName, SubName, Email, Mobile, Code, RoleCode} = this.$store.getters.userInfo
    //this.temp = {Account, FirstName, SubName, Email, Mobile, Code, RoleCode}
  },
  methods: {
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    submit() {
        if(this.temp.Password.length && this.temp.Password === this.temp.RePassword){
            //delete this.temp.RePassword
            resetMyPasswordAjax(this.temp).then(response => {    
                console.log(response) 
                if(response.MajorCode === '000'){
                    //this.$store.commit('user/SET_QT_USERINFO', response)
                    //this.$store.commit('user/SET_TOKEN', response.Token)

                    this.$notify({
                        title: 'Success',
                        message: 'Password has been updated successfully',
                        type: 'success',
                        duration: 2000
                    })    
                    
                    this.logout()      
                }else{
                    this.$notify({
                        title: 'Error',
                        message: 'Password was not updated',
                        type: 'error',
                        duration: 2000
                    })  
                }
            }).catch(e=>{
                this.$notify({
                title: 'Error',
                message: 'Something wrong',
                type: 'error',
                duration: 2000
                })  
            })
        }else{        
            this.$notify({
                title: 'Error',
                message: 'Passwords do not match',
                type: 'error',
                duration: 2000
            })  
        }   
    }
  }
}
</script>
