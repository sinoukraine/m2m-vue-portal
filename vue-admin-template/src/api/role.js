import request from '@/utils/request'
import {API_METHODS, getFormDataFromObject} from "@/utils/helpers";
import axios from "axios";
import store from "@/store";


export async function fetchPermissionList(query) {
  let data = getFormDataFromObject(query)

  try {
    const response = await axios.post(API_METHODS.PERMISSIONS_GET_LIST, data );
    if(!response.data.MajorCode){
      return response.data
    }else{
      response.data.method = 'fetchPermissionList';
      store.commit('app/SET_API_VALIDATION_ERROR', response.data)
      return false
    }
  }catch (e) {
    console.log(e)
    store.commit('app/SET_ERROR', e)
    return false
  }
}

export async function addPermission(query) {
  let data = getFormDataFromObject(query)

  try {
    const response = await axios.post(API_METHODS.PERMISSIONS_CREATE, data );
    if(response.data.MajorCode === '000'){
      return response.data
    }else{
      response.data.method = 'addPermission';
      store.commit('app/SET_API_VALIDATION_ERROR', response.data)
      return false
    }
  }catch (e) {
    console.log(e)
    store.commit('app/SET_ERROR', e)
    return false
  }
}
export async function updatePermission(query) {
  let data = getFormDataFromObject(query)

  try {
    const response = await axios.post(API_METHODS.PERMISSIONS_EDIT, data );
    if(response.data.MajorCode === '000'){
      return response.data
    }else{
      response.data.method = 'updatePermission';
      store.commit('app/SET_API_VALIDATION_ERROR', response.data)
      return false
    }
  }catch (e) {
    console.log(e)
    store.commit('app/SET_ERROR', e)
    return false
  }
}

export async function deletePermission(query) {
  let data = getFormDataFromObject(query)

  try {
    const response = await axios.post(API_METHODS.PERMISSIONS_DELETE, data );
    if(response.data.MajorCode === '000'){
      return response.data
    }else{
      response.data.method = 'deletePermission';
      store.commit('app/SET_API_VALIDATION_ERROR', response.data)
      return false
    }
  }catch (e) {
    console.log(e)
    store.commit('app/SET_ERROR', e)
    return false
  }
}








export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createArticle(data) {
  var myHeaders = new Headers()
  var urlencoded = new URLSearchParams()

  const arr = Object.keys(data)
  arr.forEach(element => {
    urlencoded.append(element, data[element])
  })
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  }

  return new Promise((resolve, reject) => {
    fetch('https://test4.m2mdata.co/Service/Permission/Add', requestOptions)
      .then(response => response.json())
      .then(result => {
        resolve(result)
      })
      .catch(error => {
        console.log('er', error)
        reject(error)
      })
  })
  /* return request({
    url: '/vue-element-admin/article/create',
    method: 'post',
    data
  })*/
}

export function updateArticle(data) {
  var myHeaders = new Headers()
  var urlencoded = new URLSearchParams()

  const arr = Object.keys(data)
  arr.forEach(element => {
    urlencoded.append(element, data[element])
  })
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  }

  return new Promise((resolve, reject) => {
    fetch('https://test4.m2mdata.co/Service/Permission/Edit', requestOptions)
      .then(response => response.json())
      .then(result => {
        resolve()
      })
      .catch(error => {
        console.log('er', error)
        reject(error)
      })
  })
}

export function deleteRole(data) {

  var myHeaders = new Headers()
  var urlencoded = new URLSearchParams()

  const arr = Object.keys(data)
  arr.forEach(element => {
    urlencoded.append(element, data[element])
  })
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  }


  return new Promise((resolve, reject) => {
    fetch('https://test4.m2mdata.co/Service/Permission/Remove', requestOptions)
      .then(response => response.json())
      .then(result => {

        resolve()
      })
      .catch(error => {
        console.log('er', error)
        reject(error)
      })
  })
}
