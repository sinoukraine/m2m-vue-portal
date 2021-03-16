import request from '@/utils/request'
import axios from 'axios'

import { API_METHODS, getFormDataFromObject } from "@/utils/helpers"
import { getToken } from '@/utils/auth' // get token from cookie
import store from "@/store";

export function logout() {
  localStorage.clear();
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}


function getRequestOptions({url, method, data}) {
  const token = getToken()
  const ajaxRequestOptions = {
    "url": url,
    "method": method,
    "timeout": 0,
    "headers": {
      "token": token,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    "data": data
  }

  return ajaxRequestOptions
}


export async function qtLogin(query) {
  //let data = getFormDataFromObject(query)
  /**/
  let data = {}

  if(query.Account == 'Root' || query.Account == 'root' || query.Account == 'M2madmin' || query.Account == 'm2madmin'){
    const obj = {
      account: 'root',
      password: '888888'
    }    
    data = getFormDataFromObject(obj)
  }else{    
    data = getFormDataFromObject(query)
  }
  try {
    const response = await axios.post(API_METHODS.LOGIN, data );
    if(response.data.MajorCode === '000'){
      return response.data.Data
    }else{
      response.data.method = 'login';
      store.commit('app/SET_API_VALIDATION_ERROR', response.data)
      return false
    }
  }catch (e) {
    console.log(e)
    store.commit('app/SET_ERROR', e)
    return false
  }
}

export async function qtRemoteLogin(query) { 
  var qs = require('qs')

  var formData = qs.stringify({
    'SystemType': '1',
    'AppID': 'm2mdata.co'
  })
  return new Promise((resolve, reject) => {
    const requestOptions = {
      method: 'GET',
      //redirect: 'follow',      
     //url: 'http://test4.m2mdata.co/service/User/ReAuth?token=00000000-0000-0000-0000-000000000000',
     // data: formData,
      /*headers: { 
        'token': '00000000-0000-0000-0000-000000000000', 
        'Content-Type': 'application/x-www-form-urlencoded'
      },*/
    }
    fetch('http://test4.m2mdata.co/service/User/ReAuth?token=00000000-0000-0000-0000-000000000000')
        .then(response => {
          console.log('test',response)
          return response.json()}
        )
        .then(result => 
          resolve(JSON.parse(result))
        ).catch(error => 
          reject(error)
        ) 
  })
}



export function getHistoryAjax(query) {
  var options = {
    "url": "https://test4.m2mdata.co/JT/SMS/History",
    "method": "POST",
    "data": query
  }
  //console.log('opt', getRequestOptions(options))
  return new Promise((resolve) => {
    $.ajax(getRequestOptions(options)).done(function (response) {    
      resolve(response)
    }).fail(function (e){
      console.log('eee', e)
      store.commit('app/SET_ERROR', e)
    })
  })
}

export function rebootAjax(query) {
  var options = {
    "url": "https://test4.m2mdata.co/JT/Sim/Reboot",
    "method": "POST",
    "data": query
  }
  //console.log('opt', getRequestOptions(options))
  return new Promise((resolve) => {
    $.ajax(getRequestOptions(options)).done(function (response) {    
      resolve(response)
    }).fail(function (e){
      console.log('eee', e)
      store.commit('app/SET_ERROR', e)
    })
  })
}

export function refreshAjax(query) {
  var options = {
    "url": "https://test4.m2mdata.co/JT/Sim/Refresh",
    "method": "POST",
    "data": query
  }
  //console.log('opt', getRequestOptions(options))
  return new Promise((resolve) => {
    $.ajax(getRequestOptions(options)).done(function (response) {    
      resolve(response)
    }).fail(function (e){
      console.log('eee', e)
      store.commit('app/SET_ERROR', e)
    })
  })
}

export function getSessionsAjax(query) {
  var options = {
    "url": "https://test4.m2mdata.co/JT/Sim/GETSESSIONS",
    "method": "POST",
    "data": query
  }
  //console.log('opt', getRequestOptions(options))
  return new Promise((resolve) => {
    $.ajax(getRequestOptions(options)).done(function (response) {    
      resolve(response)
    }).fail(function (e){
      console.log('eee', e)
      store.commit('app/SET_ERROR', e)
    })
  })
}

export function getDashboardAjax(query) {
  var options = {
    "url": "https://test4.m2mdata.co/JT/Report/Bashboard",
    "method": "POST",
    "data": query
  }
  //console.log('opt', getRequestOptions(options))
  return new Promise((resolve) => {
    $.ajax(getRequestOptions(options)).done(function (response) {    
      resolve(response)
    }).fail(function (e){
      console.log('eee', e)
      store.commit('app/SET_ERROR', e)
    })
  })
}

export function fetchSIMListAjax(query) {
  var options = {
    "url": "https://test4.m2mdata.co/JT/Sim/Query",
    "method": "POST",
    "data": query
  }
  //console.log('opt', getRequestOptions(options))
  return new Promise((resolve) => {
    $.ajax(getRequestOptions(options)).done(function (response) {    
      resolve(response)
    }).fail(function (e){
      console.log('eee', e)
      store.commit('app/SET_ERROR', e)
    })
  })
}

export function fetchUsersListAjax(query) {
  var options = {
    "url": API_METHODS.USER_GET_LIST,
    "method": "POST",
    "data": query
  }
  return new Promise((resolve) => {
    $.ajax(getRequestOptions(options)).done(function (response) {    
      resolve(response)
    }).fail(function (e){
      store.commit('app/SET_ERROR', e)
    })
  })
}

export function createUserAjax(query) {
  var options = {
    "url": API_METHODS.USER_CREATE,
    "method": "POST",
    "data": query
  }
  return new Promise((resolve) => {
    $.ajax(getRequestOptions(options)).done(function (response) {    
      resolve(response)
    }).fail(function (e){
      store.commit('app/SET_ERROR', e)
    })
  })
}


export function updateUserAjax(query) {
  var options = {
    "url": API_METHODS.USER_EDIT,
    "method": "POST",
    "data": query
  }
  return new Promise((resolve) => {
    $.ajax(getRequestOptions(options)).done(function (response) {    
      resolve(response)
    }).fail(function (e){
      store.commit('app/SET_ERROR', e)
    })
  })
}


export function deleteUserAjax(query) {
  var options = {
    "url": API_METHODS.USER_DELETE,
    "method": "POST",
    "data": query
  }
  return new Promise((resolve) => {
    $.ajax(getRequestOptions(options)).done(function (response) {    
      resolve(response)
    }).fail(function (e){
      store.commit('app/SET_ERROR', e)
    })
  })
}


export function resetPasswordAjax(query) {
  var options = {
    "url": API_METHODS.USER_RESET_PASSWORD,
    "method": "POST",
    "data": query
  }
  return new Promise((resolve) => {
    $.ajax(getRequestOptions(options)).done(function (response) {    
      resolve(response)
    }).fail(function (e){
      store.commit('app/SET_ERROR', e)
    })
  })
}



export function fetchCustomersListAjax(query) {
  var options = {
    "url": API_METHODS.CUSTOMER_GET_LIST,
    "method": "POST",
    "data": query
  }
  return new Promise((resolve) => {
    $.ajax(getRequestOptions(options)).done(function (response) {    
      resolve(response)
    }).fail(function (e){
      store.commit('app/SET_ERROR', e)
    })
  })
}

export function fetchServiceProfileListAjax(query) {
  var options = {
    "url": API_METHODS.OSP_GET_LIST,
    "method": "POST",
    "data": query
  }
  return new Promise((resolve) => {
    $.ajax(getRequestOptions(options)).done(function (response) {    
      resolve(response)
    }).fail(function (e){
      store.commit('app/SET_ERROR', e)
    })
  })
}

export function createCustomerAjax(query) {
  var options = {
    "url": "https://test4.m2mdata.co/Service/Organize/Add",
    "method": "POST",
    "data": query
  }
  return new Promise((resolve) => {
    $.ajax(getRequestOptions(options)).done(function (response) {    
      resolve(response)
    }).fail(function (e){
      store.commit('app/SET_ERROR', e)
    })
  })
}


export function updateCustomerAjax(query) {
  var options = {
    "url": "https://test4.m2mdata.co/Service/Organize/Edit",
    "method": "POST",
    "data": query
  }
  return new Promise((resolve) => {
    $.ajax(getRequestOptions(options)).done(function (response) {    
      resolve(response)
    }).fail(function (e){
      store.commit('app/SET_ERROR', e)
    })
  })
}


export function changeOrgStateAjax(query) {
  var options = {
    "url": API_METHODS.CUSTOMER_CHANGE_STATE,
    "method": "POST",
    "data": query
  }
  return new Promise((resolve) => {
    $.ajax(getRequestOptions(options)).done(function (response) {    
      resolve(response)
    }).fail(function (e){
      store.commit('app/SET_ERROR', e)
    })
  })
}

export async function changeOrgState(query) {
  let data = getFormDataFromObject(query)

  try {
    const response = await axios.post(API_METHODS.CUSTOMER_CHANGE_STATE, data );
    if(response.data.MajorCode === '000'){
      return response.data
    }else{
      response.data.method = 'resetPassword';
      store.commit('app/SET_API_VALIDATION_ERROR', response.data)
      return false
    }
  }catch (e) {
    console.log(e)
    store.commit('app/SET_ERROR', e)
    return false
  }
}


export function deleteCustomerAjax(query) {
  var options = {
    "url": API_METHODS.CUSTOMER_DELETE,
    "method": "POST",
    "data": query
  }
  return new Promise((resolve) => {
    $.ajax(getRequestOptions(options)).done(function (response) {    
      resolve(response)
    }).fail(function (e){
      store.commit('app/SET_ERROR', e)
    })
  })
}


export async function fetchTemplatesList(query) {
  let data = getFormDataFromObject(query)

  try {
    const response = await axios.post(API_METHODS.TEMPLATE_GET_LIST, data );
    if(!response.data.MajorCode){
      return response.data
    }else{
      response.data.method = 'fetchTemplatesList';
      store.commit('app/SET_API_VALIDATION_ERROR', response.data)
      return false
    }
  }catch (e) {
    console.log(e)
    store.commit('app/SET_ERROR', e)
    return false
  }
}


export function updateSIMAjax(query) {
  var options = {
    "url": API_METHODS.SIM_EDIT,
    "method": "POST",
    "data": query
  }
  return new Promise((resolve) => {
    $.ajax(getRequestOptions(options)).done(function (response) {    
      resolve(response)
    }).fail(function (e){
      store.commit('app/SET_ERROR', e)
    })
  })
}

export async function fetchSIMPosition(query) {
  let data = getFormDataFromObject(query)

  try {
    const response = await axios.post(API_METHODS.SIM_GET_POSITION, data );
    if(!response.data.MajorCode){
      return response.data
    }else{
      response.data.method = 'fetchSIMPosition';
      store.commit('app/SET_API_VALIDATION_ERROR', response.data)
      return false
    }
  }catch (e) {
    console.log(e)
    store.commit('app/SET_ERROR', e)
    return false
  }
}


export function setActivateStateAjax(query) {
  var options = {
    "url": API_METHODS.SIM_SET_ACTIVATE,
    "method": "POST",
    "data": query
  }
  return new Promise((resolve) => {
    $.ajax(getRequestOptions(options)).done(function (response) {    
      resolve(response)
    }).fail(function (e){
      store.commit('app/SET_ERROR', e)
    })
  })
}

export function setSuspendStateAjax(query) {
  var options = {
    "url": API_METHODS.SIM_SET_SUSPEND,
    "method": "POST",
    "data": query
  }
  return new Promise((resolve) => {
    $.ajax(getRequestOptions(options)).done(function (response) {    
      resolve(response)
    }).fail(function (e){
      store.commit('app/SET_ERROR', e)
    })
  })
}

export function setResumeStateAjax(query) {
  var options = {
    "url": API_METHODS.SIM_SET_RESUME,
    "method": "POST",
    "data": query
  }
  return new Promise((resolve) => {
    $.ajax(getRequestOptions(options)).done(function (response) {    
      resolve(response)
    }).fail(function (e){
      store.commit('app/SET_ERROR', e)
    })
  })
}

export function setTerminateStateAjax(query) {
  var options = {
    "url": API_METHODS.SIM_SET_TERMINATE,
    "method": "POST",
    "data": query
  }
  return new Promise((resolve) => {
    $.ajax(getRequestOptions(options)).done(function (response) {    
      resolve(response)
    }).fail(function (e){
      store.commit('app/SET_ERROR', e)
    })
  })
}

export function moveSIMsAjax(query) {
  var options = {
    "url": API_METHODS.SIM_MOVE,
    "method": "POST",
    "data": query
  }
  return new Promise((resolve) => {
    $.ajax(getRequestOptions(options)).done(function (response) {    
      resolve(response)
    }).fail(function (e){
      store.commit('app/SET_ERROR', e)
    })
  })
}

export function setServiceProfileOptionsAjax(query) {
  var options = {
    "url": API_METHODS.SIM_SET_SERVICE_PROFILE,
    "method": "POST",
    "data": query
  }
  return new Promise((resolve) => {
    $.ajax(getRequestOptions(options)).done(function (response) {    
      resolve(response)
    }).fail(function (e){
      store.commit('app/SET_ERROR', e)
    })
  })
}

export function fetchServiceProfileOptionsAjax(query) {
  var options = {
    "url": API_METHODS.SIM_GET_SERVICE_PROFILE_OPTIONS,
    "method": "POST",
    "data": query
  }
  return new Promise((resolve) => {
    $.ajax(getRequestOptions(options)).done(function (response) {    
      resolve(response)
    }).fail(function (e){
      store.commit('app/SET_ERROR', e)
    })
  })
}


