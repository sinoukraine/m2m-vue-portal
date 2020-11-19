import request from '@/utils/request'
import axios from 'axios'
axios.defaults.timeout = 360000 //2147483647

import { getToken } from '@/utils/auth' // get token from cookie

const API_DOMIAN = 'https://m2mdata03.sinopacific.com.ua/api/v3/'
const API_NOMINATIM = 'https://nominatim.sinopacific.com.ua/'
const SIM_COUNTRY = API_NOMINATIM + 'reverse.php?format=json&zoom=18&addressdetails=1'
const SIM_LIST = API_DOMIAN + 'sims'
const SIM_STATES = API_DOMIAN + 'sims/states'
const CDRS_LIST = API_DOMIAN + 'cdrs'
const CUSTOMER_LIST = API_DOMIAN + 'counterparties'

function getRequestOptions(options) {
  const token = getToken()
  const axiosRequestOptions = {
    url: options.url,
    method: options.method,
    timeout: 360000
  }
  axiosRequestOptions.headers = {
    'content-type': 'application/json',
    'Authorization': 'Bearer ' + token
  }

  return axiosRequestOptions
}

export async function getSIMCountry(query) {
  const options = {
     url: SIM_COUNTRY + '&lat=' + query.lat + '&lon=' + query.lon + '',
     method: 'get'
   }
   return new Promise((resolve, reject) => {
     axios.request(getRequestOptions(options)).then(
       (result) => {
         resolve(result)
       }).catch(e => {
       reject(e)
     })
   })
 }

export async function getSIMStates(query) {
 const options = {
    url: SIM_STATES,
    method: 'get'
  }
  return new Promise((resolve, reject) => {
    axios.request(getRequestOptions(options)).then(
      (result) => {
        resolve(result)
      }).catch(e => {
      reject(e)
    })
  })
}

export async function getSIM(query) {
  if (query.imsi !== '') {
    let addStates = '', addActivity = ''
    if (query.states) {
      addStates = '&extra[]=states'
    }
    if (query.activity) {
      addActivity = '&extra[]=activity'
    }
    const imsi = query.imsi
    const options = {
      url: SIM_LIST + '/' + imsi + '?simIdentifier=IMSI' + addStates + addActivity,
      method: 'get'
    }
    return new Promise((resolve, reject) => {
      axios.request(getRequestOptions(options)).then(
        (result) => {
          resolve(result)
        }).catch(e => {
        reject(e)
      })
    })
  }
}

export async function getSIMList(query) {
  let addLimit = '', addSample = ''
  if (query.limit !== 0) {
    addLimit = '&limit=' + query.limit
  }
  if (query.sample !== '') {
    addSample = '&sample=' + query.sample
  }
  const options = {
    url: SIM_LIST + '?scope=sub' + addLimit + '' + addSample + '',
    method: 'get'
  }
  return new Promise((resolve, reject) => {
    axios.request(getRequestOptions(options)).then(
      (result) => {
        resolve(result)
      }).catch(e => {
      reject(e)
    })
  })
}

export async function getCDRSList(query) {
  let addCustomer = '', addLimit = ''
  if (query.customer !== '0') {
    addCustomer = '&customerId=' + query.customer
  }
  if (query.imsi !== '') {
    //addIMSI = '&sample=' + query.imsi
  }
  if (query.limit !== 0) {
    addLimit = '&limit=' + query.limit
  }
  const options = {
    url: CDRS_LIST + '?startDate=' + query.date1 + 'T00:00:00.000Z&endDate=' + query.date2 + 'T00:00:00.000Z' + addLimit + '' + addCustomer + '',
    method: 'get'
  }
  return new Promise((resolve, reject) => {
    axios.request(getRequestOptions(options)).then(
      (result) => {
        resolve(result)
      }).catch(e => {
      reject(e)
    })
  })
}

export async function getSIMCoordinates(query) {
  if (query.id !== '') {
    const id = query.id
    const options = {
      url: SIM_LIST + '/' + id + '/coordinates',
      method: 'get'
    }
    return new Promise((resolve, reject) => {
      axios.request(getRequestOptions(options)).then(
        (result) => {
          resolve(result)
        }).catch(e => {
        reject(e)
      })
    })
  }
}

export async function getCDRS(query) {
  if (query.id !== '') {
    const id = query.id
    const options = {
      url: SIM_LIST + '/' + id + '/cdrs?includeSessions=true&startDate=' + query.date1 + 'T00:00:00.000Z&endDate=' + query.date2 + 'T00:00:00.000Z',
      method: 'get'
    }
    return new Promise((resolve, reject) => {
      axios.request(getRequestOptions(options)).then(
        (result) => {
          resolve(result)
        }).catch(e => {
        reject(e)
      })
    })
  }
}

export async function getCustomerList(query) {
  const options = {
    url: CUSTOMER_LIST + '?fields[]=_id&fields[]=info.name&scope=sub&sort=info.name',
    method: 'get'
  }
  return new Promise((resolve, reject) => {
    axios.request(getRequestOptions(options)).then(
      (result) => {
        resolve(result)
      }).catch(e => {
      reject(e)
    })
  })
}

export async function fetchList(query) {
  /* return request({
    url: '/vue-element-admin/article/list',
    method: 'get',
    params: query
  })*/
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

  console.log(data)

  return new Promise((resolve, reject) => {
    fetch('http://test.m2mdata.co/Service/Language/Edit', requestOptions)
      .then(response => response.json())
      .then(result => {
        /* const { data } = result

        console.log('res', data)*/

        resolve()
      })
      .catch(error => {
        console.log('er', error)
        reject(error)
      })
  })
  /* return request({
    url: '/vue-element-admin/article/update',
    method: 'post',
    data
  })*/
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

  console.log(data)

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
}
