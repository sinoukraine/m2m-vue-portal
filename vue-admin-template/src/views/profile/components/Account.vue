<template>
  <el-form>
    <el-form-item label="Account">
      <el-input v-model.trim="temp.Account" />
    </el-form-item>
    <el-form-item label="First Name">
      <el-input v-model.trim="temp.FirstName" />
    </el-form-item>
    <el-form-item label="Last Name">
      <el-input v-model.trim="temp.SubName" />
    </el-form-item>
    <el-form-item label="Email">
      <el-input v-model.trim="temp.Email" />
    </el-form-item>
    <el-form-item label="Mobile">
      <el-input v-model.trim="temp.Mobile" />
    </el-form-item>
    <el-form-item class="pt-20">
      <el-button type="primary" @click="submit">Update</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { fetchUsersListAjax, updateUserAjax, deleteUserAjax, resetPasswordAjax } from "@/api/user";
import { fetchRoleListAjax } from "@/api/role-managment";

export default {
  data() {
    return {
      temp: {
        Account:'',
        FirstName:'',
        SubName:'',
        Email:'',
        Mobile:''
      }
    }
  },
  /*props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: ''
        }
      }
    }
  },*/
  created(){    
    const {Account, FirstName, SubName, Email, Mobile, Code, RoleCode} = this.$store.getters.userInfo
    this.temp = {Account, FirstName, SubName, Email, Mobile, Code, RoleCode}
  },
  methods: {
    submit() {
      console.log(this.temp)

      updateUserAjax(this.temp).then(response => {    
        console.log(response) 
        if(response.MajorCode === '000'){
          localStorage.Account = response.Account
          
          this.$store.commit('user/SET_QT_USERINFO', response)
          this.$store.commit('user/SET_NAME', response.FirstName + ' ' + response.SubName)
          //this.$store.commit('user/SET_LANGUAGE', response.Language)
          this.$store.commit('user/SET_LOGIN', response.Account)

          this.$notify({
            title: 'Success',
            message: 'User information has been updated successfully',
            type: 'success',
            duration: 2000
          })          
        }else{
          this.$notify({
            title: 'Error',
            message: 'User information was not updated',
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
    }
  }
}
</script>
