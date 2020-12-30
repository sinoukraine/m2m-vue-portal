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
  const data1 = {
    account: 'root',
    password: '888888'
  }
  let data = getFormDataFromObject(data1)
  
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
