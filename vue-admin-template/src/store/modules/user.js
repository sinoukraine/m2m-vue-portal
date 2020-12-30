import axios from 'axios'
import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { option } from 'runjs'

const API_DOMIAN = 'https://m2mdata03.sinopacific.com.ua/api/v3/'
const PRELOGIN = API_DOMIAN + 'consumers/tokens'
const LOGIN = API_DOMIAN + 'people/tokens'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    language: 'en',

    qtUserInfo: {}
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_LANGUAGE: (state, lang) => {
    state.language = lang
  },

  SET_QT_USERINFO: (state, info) => {
    state.qtUserInfo = info
    axios.defaults.headers.common['token'] = info.Token;
  }
}

function getRequestOptions(options) {
  const axiosRequestOptions = {
    url: options.url,
    method: options.method,
    timeout: 25000
  }

  if (options.hasOwnProperty('userAuth')) {
    axiosRequestOptions.data = {
      login: options.userAuth.login,
      password: options.userAuth.password
    }

    axiosRequestOptions.headers = {
      'content-type': 'application/json',
      'authorization': 'Bearer ' + options.userAuth.consumerToken
    }
  } else {
    axiosRequestOptions.headers = {
      'content-type': 'application/json'
    }
  }

  return axiosRequestOptions
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const options = {
      url: PRELOGIN,
      method: 'post'
    }
    return new Promise((resolve, reject) => {
      axios.request(getRequestOptions(options)).then(
        (result) => {
          const { consumerToken } = result.data

          const options = {
            url: LOGIN,
            method: 'post',
            userAuth: {
              consumerToken,
              login: userInfo.username,
              password: userInfo.password
            }
          }

          return new Promise(() => {
            axios.request(getRequestOptions(options)).then(
              (result) => {
                const { accessToken } = result.data

                commit('SET_TOKEN', accessToken)
                /*commit('SET_NAME', 'James Sipson')
                commit('SET_AVATAR', 'avatar.png')
                commit('SET_LANGUAGE', 'en')*/

                setToken(accessToken)

                

                resolve()
              }).catch(e => {
              reject(e)
            })
          })
        }).catch(e => {
        reject(e)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { Data } = response

        if (!Data) {
          reject('Verification failed, please Login again.')
        }

        commit('SET_NAME', 'James Sipson')
        commit('SET_AVATAR', 'avatar.png')
        commit('SET_LANGUAGE', 'en')

        resolve(Data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

