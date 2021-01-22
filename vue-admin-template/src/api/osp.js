import axios from 'axios'
import { API_METHODS, getFormDataFromObject } from "@/utils/helpers"
import store from "@/store";

export async function fetchOSPList(query) {
  let data = getFormDataFromObject(query)

  try {
    const response = await axios.post(API_METHODS.OSP_GET_LIST, data );
    if(!response.data.MajorCode){
      return response.data
    }else{
      response.data.method = 'fetchOSPList';
      store.commit('app/SET_API_VALIDATION_ERROR', response.data)
      return false
    }
  }catch (e) {
    console.log(e)
    store.commit('app/SET_ERROR', e)
    return false
  }
}

export async function fetchOSPAdditionalInfo(query) {
  let data = getFormDataFromObject(query)

  try {
    const response = await axios.post(API_METHODS.OSP_GET_LIST_MYSELF, data );
    if(!response.data.MajorCode){
      return response.data
    }else{
      response.data.method = 'fetchOSPAdditionalInfo';
      store.commit('app/SET_API_VALIDATION_ERROR', response.data)
      return false
    }
  }catch (e) {
    console.log(e)
    store.commit('app/SET_ERROR', e)
    return false
  }
}


export async function createOSP(query) {
  let data = getFormDataFromObject(query)

  try {
    const response = await axios.post(API_METHODS.OSP_CREATE, data );
    if(response.data.MajorCode === '000'){
      return response.data
    }else{
      response.data.method = 'createOSP';
      store.commit('app/SET_API_VALIDATION_ERROR', response.data)
      return false
    }
  }catch (e) {
    console.log(e)
    store.commit('app/SET_ERROR', e)
    return false
  }
}


export async function updateOSP(query) {
  let data = getFormDataFromObject(query)

  try {
    //const response = await axios.post(API_METHODS.OSP_EDIT+`token=${query.token}`, data );
    const response = await axios.post(API_METHODS.OSP_EDIT, data );
    if(response.data.MajorCode === '000'){
      return response.data
    }else{
      response.data.method = 'updateOSP';
      store.commit('app/SET_API_VALIDATION_ERROR', response.data)
      return false
    }

  }catch (e) {
    console.log(e)
    store.commit('app/SET_ERROR', e)
    return false
  }
}


export async function deleteOSP(query) {
  let data = getFormDataFromObject(query)

  try {
    const response = await axios.post(API_METHODS.OSP_DELETE, data );
    if(response.data.MajorCode === '000'){
      return response.data
    }else{
      response.data.method = 'deleteOSP';
      store.commit('app/SET_API_VALIDATION_ERROR', response.data)
      return false
    }
  }catch (e) {
    console.log(e)
    store.commit('app/SET_ERROR', e)
    return false
  }
}
