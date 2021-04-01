import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { getRolesPermissionsAjax, getPermissionListAjax } from '@/api/role-managment'
import { Permission, getPermissionStatus } from '@/utils/role-permissions'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

async function emitLogin(to, from, next) {
  if (to.path === '/login') {
    // if is logged in, redirect to the home page
    next({ path: '/' })
    NProgress.done()
  } else {
    
    const hasGetUserInfo = store.getters.name
    if (hasGetUserInfo) {
      next()
    } else {
      try {
        // get user info
        await store.dispatch('user/login')

        next()
      } catch (error) {
        // remove token and go to login page to re-login
        await store.dispatch('user/resetToken')
        Message.error(error || 'Has Error')
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  }
}

async function failLogin(to, from, next) {
  if (whiteList.indexOf(to.path) !== -1) {
    // in the free login whitelist, go directly
    next()
  } else {
    // other pages that do not have permission to access are redirected to the login page.
    next(`/login?redirect=${to.path}`)
    NProgress.done()
  }
}

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken) {

    let code = store.getters.userInfo.RoleCode
    if(code != '00000000-0000-0000-0000-000000000000'){
      getRolesPermissionsAjax({code}).then(response => {
        getPermissionListAjax(null).then(async response_1 => {
          console.log('debug code',response, response_1[0])
          Permission.ROOT = getPermissionStatus(response, response_1[0].Code)
          
          const firstLevelArray = response_1[0].Children
          firstLevelArray.forEach((element, index) => {
            Permission[element.Value] = getPermissionStatus(response, element.Code)
            
            const secondLevelArray = element.Children
            secondLevelArray.forEach((element1, index) => {
              Permission[element1.Value] = getPermissionStatus(response, element1.Code)

              const thirdLevelArray = element1.Children
              thirdLevelArray.forEach((element2, index) => {
                Permission[element2.Value] = getPermissionStatus(response, element2.Code)

                const forthLevelArray = element2.Children
                forthLevelArray.forEach((element3, index) => {
                  Permission[element3.Value] = getPermissionStatus(response, element3.Code)

                  const fivesLevelArray = element3.Children
                  fivesLevelArray.forEach((element4, index) => {
                    Permission[element4.Value] = getPermissionStatus(response, element4.Code)
                  })
                })
              })
            })
          })
          console.log(Permission)
          if(Permission.ROOT){
            emitLogin(to, from, next)
          }else{
            failLogin(to, from, next)
          }       
        })
      })
    } else {      
      getPermissionListAjax(null).then(async response_1 => {
        Permission.ROOT = 3
        
        const firstLevelArray = response_1[0].Children
        firstLevelArray.forEach((element, index) => {
          Permission[element.Value] = 3
          
          const secondLevelArray = element.Children
          secondLevelArray.forEach((element1, index) => {
            Permission[element1.Value] = 3

            const thirdLevelArray = element1.Children
            thirdLevelArray.forEach((element2, index) => {
              Permission[element2.Value] = 3

              const forthLevelArray = element2.Children
              forthLevelArray.forEach((element3, index) => {
                Permission[element3.Value] = 3

                const fivesLevelArray = element3.Children
                fivesLevelArray.forEach((element4, index) => {
                  Permission[element4.Value] = 3
                })
              })
            })
          })
        })
        console.log(Permission)
        emitLogin(to, from, next)
      })      
    }
  } else {
    /* has no token*/

    failLogin(to, from, next)
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
