<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu display-flex">
      <search id="header-search" class="right-menu-item" />
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/profile/index">
            <el-dropdown-item>Profile</el-dropdown-item>
          </router-link>
          <router-link to="/">
            <el-dropdown-item>
              Home
            </el-dropdown-item>
          </router-link>            
          <a target="_blank" href="http://android.app.quiktrak.eu/m2m-controller/">
            <el-dropdown-item>App</el-dropdown-item>
          </a>
          <a target="_blank" href="https://statistic.quiktrak.com.au/top-imsi-usage/">
            <el-dropdown-item>Reports</el-dropdown-item>
          </a>
          <a target="_blank" href="https://m2mdata.co/home/download/M2M%20Data%20Software%20User%20Guide.pdf">
            <el-dropdown-item>User Manual</el-dropdown-item>
          </a>
          <!--<el-dropdown-item divided @click.native="accessAdmin()">
            Back to Admin
          </el-dropdown-item>-->
          <el-dropdown-item @click.native="logout">
            <span style="display:block;">Log Out</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Search from '@/components/HeaderSearch'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Search
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  methods: {
    accessAdmin() { 
          //this.loading = true
          //let response = await qtLogin(this.loginForm)
          //this.loading = false
          /*if(!response){
            return
          }

          localStorage.Account = this.loginForm.Account;
          localStorage.Password = this.loginForm.Password;
*/let response = {
    FirstName: 'Vlad',
    SubName: 'Bill',
    Language: 'en',
    Login: 'Root',
    Token: '00000000-0000-0000-0000-000000000000'
}
          this.$store.commit('user/SET_QT_USERINFO', response)
          this.$store.commit('user/SET_NAME', response.FirstName + ' ' + response.SubName)
          this.$store.commit('user/SET_LOGIN', response.Login)
          this.$store.commit('user/SET_AVATAR', 'avatar.png')
          this.$store.commit('user/SET_LANGUAGE', response.Language)
          this.$router.push({ path: '/customer-manage/user-list' })
          
          //this.$route.params.imsi = `${imsi}`
          /*this.$store.commit('user/SET_TOKEN', response.Token)
          setToken(response.Token)
          this.$router.push({ path: this.redirect || '/' })*/
          /*
          let m2mLoginDetails = {
            username: 'm2madmin',
            password: '888888'
          }
          this.$store.dispatch('user/login', m2mLoginDetails).then(() => {
            this.$router.push({ path: this.redirect || '/report' })
            this.loading = false
          }).catch((e) => {
            this.loading = false
            Message({
              message: 'Incorrect login data',
              type: 'error',
              duration: 5 * 1000
            })
          })*/
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/variables.scss';
.navbar {
  height: $navbarHeight;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 71px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 75px;
    display: flex;
    align-items: center;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: top;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        /*margin-top: 15px;*/
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 50px;
          vertical-align: middle;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 12px;
        }
      }
    }
  }
}
</style>
