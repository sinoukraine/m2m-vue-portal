import request from '@/utils/request'
import axios from 'axios'

import { API_METHODS, getFormDataFromObject } from "@/utils/helpers"
import store from "@/store";

export function logout() {
  localStorage.clear();
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
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
     //url: 'http://test.m2mdata.co/service/User/ReAuth?token=00000000-0000-0000-0000-000000000000',
     // data: formData,
      /*headers: { 
        'token': '00000000-0000-0000-0000-000000000000', 
        'Content-Type': 'application/x-www-form-urlencoded'
      },*/
    }
    fetch('http://test.m2mdata.co/service/User/ReAuth?token=00000000-0000-0000-0000-000000000000')
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
  /*var qs = require('qs')

  var formData = qs.stringify({
    'SystemType': '1',
    'AppID': 'm2mdata.co'
  })
  var config = {
     method: 'get',
     url: 'http://test.m2mdata.co/service/User/ReAuth',
     headers: { 
       'token': query.token, 
       'Content-Type': 'application/x-www-form-urlencoded'
     },
     data : formData
  }

  try {    
    
    const response = await fetch(`http://test.m2mdata.co/service/User/ReAuth`, config)
    //const response = await axios(config)
    //const response = await axios.get(API_METHODS.REMOTE_LOGIN + '?token=' + query.token, formData );
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
  }*/
}


export async function fetchUsersList(query) {
  let data = getFormDataFromObject(query)

  try {
    const response = await axios.post(API_METHODS.USER_GET_LIST, data );
    if(!response.data.MajorCode){
      return response.data
    }else{
      response.data.method = 'fetchUsersList';
      store.commit('app/SET_API_VALIDATION_ERROR', response.data)
      return false
    }
  }catch (e) {
    console.log(e)
    store.commit('app/SET_ERROR', e)
    return false
  }
}

export async function createUser(query) {
  let data = getFormDataFromObject(query)

  try {
    const response = await axios.post(API_METHODS.USER_CREATE, data );
    if(response.data.MajorCode === '000'){
      return response.data
    }else{
      response.data.method = 'createUser';
      store.commit('app/SET_API_VALIDATION_ERROR', response.data)
      return false
    }
  }catch (e) {
    console.log(e)
    store.commit('app/SET_ERROR', e)
    return false
  }
}


export async function updateUser(query) {
  let data = getFormDataFromObject(query)

  try {
    //const response = await axios.post(API_METHODS.OSP_EDIT+`token=${query.token}`, data );
    const response = await axios.post(API_METHODS.USER_EDIT, data );
    if(response.data.MajorCode === '000'){
      return response.data
    }else{
      response.data.method = 'updateUser';
      store.commit('app/SET_API_VALIDATION_ERROR', response.data)
      return false
    }

  }catch (e) {
    console.log(e)
    store.commit('app/SET_ERROR', e)
    return false
  }
}


export async function deleteUser(query) {
  let data = getFormDataFromObject(query)

  try {
    const response = await axios.post(API_METHODS.USER_DELETE, data );
    if(response.data.MajorCode === '000'){
      return response.data
    }else{
      response.data.method = 'deleteUser';
      store.commit('app/SET_API_VALIDATION_ERROR', response.data)
      return false
    }
  }catch (e) {
    console.log(e)
    store.commit('app/SET_ERROR', e)
    return false
  }
}

export async function resetPassword(query) {
  let data = getFormDataFromObject(query)

  try {
    const response = await axios.post(API_METHODS.USER_RESET_PASSWORD, data );
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


export async function fetchCustomersList(query) {
  let data = getFormDataFromObject(query)

  try {
    const response = await axios.post(API_METHODS.CUSTOMER_GET_LIST, data );
    if(!response.data.MajorCode){
      return response.data
    }else{
      response.data.method = 'fetchCustomersList';
      store.commit('app/SET_API_VALIDATION_ERROR', response.data)
      return false
    }
  }catch (e) {
    console.log(e)
    store.commit('app/SET_ERROR', e)
    return false
  }
}

export async function fetchServiceProfileList(query) {
  let data = getFormDataFromObject(query)

  try {
    const response = await axios.post(API_METHODS.OSP_GET_LIST, data );//OSP_GET_LIST
    if(!response.data.MajorCode){
      return response.data
    }else{
      response.data.method = 'fetchServiceProfileList';
      store.commit('app/SET_API_VALIDATION_ERROR', response.data)
      return false
    }
  }catch (e) {
    console.log(e)
    store.commit('app/SET_ERROR', e)
    return false
  }
}


export async function createCustomer(query) {
  var qs = require('qs')
     
  var formData = qs.stringify(query)
   var config = {
     method: 'post',
     url: 'https://test.m2mdata.co/Service/Organize/Add',
     headers: { 
       'token': '00000000-0000-0000-0000-000000000000', 
       'Content-Type': 'application/x-www-form-urlencoded'
     },
     data : formData
   }

  try {
    /*axios(config)
    .then(await function (response) {
      console.log(JSON.stringify(response.data))
      return JSON.stringify(response.data)
    })
    .catch(await function (error) {
      console.log(error)
      return false
    })*/
    const response = await axios(config)
    if(response.data.MajorCode === '000'){
      console.log(JSON.stringify(response.data))
      return JSON.stringify(response.data)
    }else{
      response.data.method = 'createCustomer';
      store.commit('app/SET_API_VALIDATION_ERROR', response.data)
      return false
    }
  }catch (e) {
    console.log(e)
    store.commit('app/SET_ERROR', e)
    return false
  }
}

export async function updateCustomer(query) {
  var qs = require('qs')
     
  var formData = qs.stringify(query)
   var config = {
     method: 'post',
     url: 'https://test.m2mdata.co/Service/Organize/Edit',
     headers: { 
       'token': '00000000-0000-0000-0000-000000000000', 
       'Content-Type': 'application/x-www-form-urlencoded'
     },
     data : formData
   }

  try {
    const response = await axios(config)
    if(response.data.MajorCode === '000'){
      console.log(JSON.stringify(response.data))
      return JSON.stringify(response.data)
    }else{
      response.data.method = 'updateCustomer';
      store.commit('app/SET_API_VALIDATION_ERROR', response.data)
      return false
    }
  }catch (e) {
    console.log(e)
    store.commit('app/SET_ERROR', e)
    return false
  }
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


export async function deleteCustomer(query) {
  let data = getFormDataFromObject(query)

  try {
    const response = await axios.post(API_METHODS.CUSTOMER_DELETE, data );
    if(response.data.MajorCode === '000'){
      return response.data
    }else{
      response.data.method = 'deleteCustomer';
      store.commit('app/SET_API_VALIDATION_ERROR', response.data)
      return false
    }
  }catch (e) {
    console.log(e)
    store.commit('app/SET_ERROR', e)
    return false
  }
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

export async function fetchSIMList(query) {
  let data = getFormDataFromObject(query)

  try {
    const response = await axios.post(API_METHODS.SIM_GET_LIST, data );
    if(!response.data.MajorCode){
      return response.data
    }else{
      response.data.method = 'fetchSIMList';
      store.commit('app/SET_API_VALIDATION_ERROR', response.data)
      return false
    }
  }catch (e) {
    console.log(e)
    store.commit('app/SET_ERROR', e)
    return false
  }
}


export async function updateSIM(query) {
  var qs = require('qs')
     
  var formData = qs.stringify(query)
   var config = {
     method: 'post',
     url: 'https://test.m2mdata.co/Service/JTSim/Edit',
     headers: { 
       'token': '00000000-0000-0000-0000-000000000000', 
       'Content-Type': 'application/x-www-form-urlencoded'
     },
     data : formData
   }

  try {
    const response = await axios(config)
    if(response.data.MajorCode === '000'){
      console.log(JSON.stringify(response.data))
      return JSON.stringify(response.data)
    }else{
      response.data.method = 'updateSIM';
      store.commit('app/SET_API_VALIDATION_ERROR', response.data)
      return false
    }
  }catch (e) {
    console.log(e)
    store.commit('app/SET_ERROR', e)
    return false
  }
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


export async function setActivateState(query) {
  let data = getFormDataFromObject(query)

  try {
    const response = await axios.post(API_METHODS.SIM_SET_ACTIVATE, data )
    if(response.data.MajorCode){
      return response.data
    }else{
      response.data.method = 'setActivateState';
      store.commit('app/SET_API_VALIDATION_ERROR', response.data)
      return false
    }
  }catch (e) {
    console.log(e)
    store.commit('app/SET_ERROR', e)
    return false
  }
}

export async function setSuspendState(query) {
  let data = getFormDataFromObject(query)

  try {
    const response = await axios.post(API_METHODS.SIM_SET_SUSPEND, data )
    if(response.data.MajorCode){
      return response.data
    }else{
      response.data.method = 'setSuspendState';
      store.commit('app/SET_API_VALIDATION_ERROR', response.data)
      return false
    }
  }catch (e) {
    console.log(e)
    store.commit('app/SET_ERROR', e)
    return false
  }
}

export async function setResumeState(query) {
  let data = getFormDataFromObject(query)

  try {
    const response = await axios.post(API_METHODS.SIM_SET_RESUME, data )
    if(response.data.MajorCode){
      return response.data
    }else{
      response.data.method = 'setResumeState';
      store.commit('app/SET_API_VALIDATION_ERROR', response.data)
      return false
    }
  }catch (e) {
    console.log(e)
    store.commit('app/SET_ERROR', e)
    return false
  }
}

export async function setTerminateState(query) {
  let data = getFormDataFromObject(query)

  try {
    const response = await axios.post(API_METHODS.SIM_SET_TERMINATE, data )
    if(response.data.MajorCode){
      return response.data
    }else{
      response.data.method = 'setTerminateState';
      store.commit('app/SET_API_VALIDATION_ERROR', response.data)
      return false
    }
  }catch (e) {
    console.log(e)
    store.commit('app/SET_ERROR', e)
    return false
  }
}

export async function setServiceProfileOptions(query) {
  let data = getFormDataFromObject(query)

  try {
    const response = await axios.post(API_METHODS.SIM_SET_SERVICE_PROFILE, data )
    if(response.data.MajorCode){
      return response.data
    }else{
      response.data.method = 'setServiceProfileOptions';
      store.commit('app/SET_API_VALIDATION_ERROR', response.data)
      return false
    }
  }catch (e) {
    console.log(e)
    store.commit('app/SET_ERROR', e)
    return false
  }
}

export async function fetchServiceProfileOptions(query) {
  let data = getFormDataFromObject(query)

  try {
    const response = await axios.post(API_METHODS.SIM_GET_SERVICE_PROFILE_OPTIONS, data )
    if(response.data.MajorCode){
      return response.data
    }else{
      response.data.method = 'fetchServiceProfileOptions';
      store.commit('app/SET_API_VALIDATION_ERROR', response.data)
      return false
    }
  }catch (e) {
    console.log(e)
    store.commit('app/SET_ERROR', e)
    return false
  }
}



/*import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}*/
