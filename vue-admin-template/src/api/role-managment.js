import request from '@/utils/request'
import { API_METHODS } from "@/utils/helpers"
import store from "@/store"
import axios from 'axios'
import { getToken } from '@/utils/auth' // get token from cookie

const API_DOMIAN = 'https://test4.m2mdata.co/Service/'
const ROLE_QUERY = API_DOMIAN + 'Role/Query'
const ROLE_EDIT = API_DOMIAN + 'Role/Edit'
const ROLE_ADD = API_DOMIAN + 'Role/Add'



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

export function fetchRoleListAjax(query) {
  var options = {
    "url": ROLE_QUERY,
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

/*function getRequestOptions(body) {
  var headers = new Headers()
  body.append('token', '00000000-0000-0000-0000-000000000000')

  const requestOptions = {
    method: 'POST',
    headers,
    body,
    redirect: 'follow'
  }

  return requestOptions
}

export async function fetchRoleList(query) {
  const params = new FormData()


  if(query){
    const arr = Object.keys(query)
    arr.forEach(element => {
      params.append(element, query[element])
    })
  }


  try {
    const response = await axios.post(ROLE_QUERY, params)//API_METHODS.TRANSLATIONS_GET_LIST
    if (!response.data.MajorCode){
      return response.data
    } else {
      response.data.method = 'fetchRoleList'
      store.commit('app/SET_API_VALIDATION_ERROR', response.data)
      return false
    }
  } catch (e) {
    console.log(e)
    store.commit('app/SET_ERROR', e)
    return false
  }

}

export function createRole(query) {
  const params = new URLSearchParams()

  const arr = Object.keys(query)
  arr.forEach(element => {
    if (element === 'permissions') {
      params.append('permissions[]', JSON.stringify(query[element][0]))
    } else {
      params.append(element, query[element])
    }
  })
  return new Promise((resolve, reject) => {
    fetch(ROLE_ADD, getRequestOptions(params))
      .then(response => response.json())
      .then(result => {
        resolve(result)
      })
      .catch(error => {
        console.log('er', error)
        reject(error)
      })
  })
}

export function fetchTreeList(data) {
  var myHeaders = new Headers()
  var urlencoded = new URLSearchParams()
  urlencoded.append('Code', data)
  urlencoded.append('token', '00000000-0000-0000-0000-000000000000')

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  }

  return new Promise((resolve, reject) => {
    fetch('http://test.m2mdata.co/Service/Role/QueryPermissions', requestOptions)
      .then(response => response.json())
      .then(result => {
        // const { data } = result
        resolve(result)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function manageRole(data) {
  var myHeaders = new Headers()
  var urlencoded = new URLSearchParams()

  const arr = Object.keys(data)
  arr.forEach(element => {
    if (element === 'permissions') {
      urlencoded.append('permissions[]', JSON.stringify(data[element][0]))
    } else {
      urlencoded.append(element, data[element])
    }
  })
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  }

  return new Promise((resolve, reject) => {
    fetch('http://test.m2mdata.co/Service/Role/Edit', requestOptions)
      .then(response => response.json())
      .then(result => {
        resolve()
      })
      .catch(error => {
        console.log('er', error)
        reject(error)
      })
  })
}*/

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}
/*
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
    fetch('http://test.m2mdata.co/Service/Language/Add', requestOptions)
      .then(response => response.json())
      .then(result => {
        resolve(result)
      })
      .catch(error => {
        console.log('er', error)
        reject(error)
      })
  })
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
    fetch('http://test.m2mdata.co/Service/Language/Edit', requestOptions)
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

export function deleteArticle(data) {
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
    fetch('http://test.m2mdata.co/Service/Language/Remove', requestOptions)
      .then(response => response.json())
      .then(result => {
        resolve()
      })
      .catch(error => {
        console.log('er', error)
        reject(error)
      })
  })
}*/


export function getPermissionListAjax(query) {
  var options = {
    "url": API_METHODS.PERMISSIONS_GET_LIST,
    "method": "POST",
    "data": query
  }
  //console.log('opt', getRequestOptions(options))
  return new Promise((resolve) => {
    $.ajax(getRequestOptions(options)).done(function (response) {    
      resolve(response)
    }).fail(function (e){
      store.commit('app/SET_ERROR', e)
    })
  })
}


export function getRolesPermissionsAjax(query) {
  var options = {
    "url": "https://test4.m2mdata.co/service/role/QueryPermissions",
    "method": "POST",
    "data": query
  }
  //console.log('opt', getRequestOptions(options))
  return new Promise((resolve) => {
    $.ajax(getRequestOptions(options)).done(function (response) {    
      resolve(response)
    }).fail(function (e){
      store.commit('app/SET_ERROR', e)
    })
  })
}


export function createRoleAjax(query) {
  var options = {
    "url": "https://test4.m2mdata.co/service/role/Add",
    "method": "POST",
    "data": query
  }
  //console.log('opt', getRequestOptions(options))
  return new Promise((resolve) => {
    $.ajax(getRequestOptions(options)).done(function (response) {    
      resolve(response)
    }).fail(function (e){
      store.commit('app/SET_ERROR', e)
    })
  })
}



export function manageRoleAjax(query) {
  var options = {
    "url": "https://test4.m2mdata.co/service/role/Edit",
    "method": "POST",
    "data": query
  }
  //console.log('opt', getRequestOptions(options))
  return new Promise((resolve) => {
    $.ajax(getRequestOptions(options)).done(function (response) {    
      resolve(response)
    }).fail(function (e){
      store.commit('app/SET_ERROR', e)
    })
  })
}


export function deleteRoleAjax(query) {
  var options = {
    "url": "https://test4.m2mdata.co/service/role/Remove",
    "method": "POST",
    "data": query
  }
  //console.log('opt', getRequestOptions(options))
  return new Promise((resolve) => {
    $.ajax(getRequestOptions(options)).done(function (response) {    
      resolve(response)
    }).fail(function (e){
      store.commit('app/SET_ERROR', e)
    })
  })
}