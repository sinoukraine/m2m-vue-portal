import axios from 'axios'
import { resetRouter } from '@/router'
import { option } from 'runjs'

const getDefaultState = () => {
  return {
    imsi: '',
    period: 'monthly'
  }
}

const state = getDefaultState()

const mutations = {
  SET_IMSI: (state, imsi) => {
    state.imsi = imsi
  },
  SET_PERIOD: (state, period) => {
    state.period = period
  }
}

const actions = {
  setIMSI({ commit }, imsi) {
    return new Promise(resolve => {
      commit('SET_IMSI', imsi)
      resolve()
    })
  },
  setPeriod({ commit }, period) {
    return new Promise(resolve => {
      commit('SET_PERIOD', period)
      resolve()
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

