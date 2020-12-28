import request from '@/utils/request'
import { API_METHODS } from "@/utils/helpers"
import axios from 'axios'
axios.defaults.timeout = 2147483647 //2147483647

import { getToken } from '@/utils/auth' // get token from cookie

const API_DOMIAN = 'https://m2mdata03.sinopacific.com.ua/api/v3/'
const API_NOMINATIM = 'https://nominatim.sinopacific.com.ua/'
const API_NOMAD = 'https://m2mdata03.sinopacific.com.ua/nomad/'
const DEMO_OWERVIEW = 'https://api.m2mglobaltech.com/QuikData/V1/SMS/Overview?login=m2mdataadmin'//'https://m2mdata.co/JT/Overview?login=m2mdataadmin'
const DEMO_TOP_USAGE = 'https://m2mdata.co/JT/TopUsage?type=sms&time=today'
const API_IMNS_DOMIAN = "https://api.m2mglobaltech.com/QuikData/V1/"
const SIM_COUNTRY = API_NOMINATIM + 'reverse.php?format=json&zoom=18&addressdetails=1'
const NOMAD_SIMS = API_NOMAD + 'sims'
const SIM_LIST = API_DOMIAN + 'sims'
const USER_LIST = API_DOMIAN + 'people'
const SIM_STATES = API_DOMIAN + 'sims/states'
const CDRS_LIST = API_DOMIAN + 'cdrs'
const CUSTOMER_LIST = API_DOMIAN + 'counterparties'
const COMMAND_LIST = API_IMNS_DOMIAN + "Command/GetLIst"
const COMMAND_TYPES = API_IMNS_DOMIAN + 'Command/GetTypes'


function getRequestOptions(options) {
  const token = getToken()
  const axiosRequestOptions = {
    url: options.url,
    method: options.method,
    timeout: 2147483647
  }
  axiosRequestOptions.headers = {
    'content-type': 'application/json',
    'Authorization': 'Bearer ' + token
  }

  return axiosRequestOptions
}


function postRequestOptions1(options) {
  const token = getToken()
  const axiosRequestOptions = {
    async: true,
    crossDomain: true,
    url: options.url,
    method: options.method,
    processData: false,
    timeout: 2147483647,
  }
  
  axiosRequestOptions.data = JSON.stringify(options.data)
  axiosRequestOptions.headers = {
    'content-type': 'application/json',
    'Authorization': 'Bearer ' + token
  }

  return axiosRequestOptions
}

function postRequestOptions(options) {
  const token = getToken()
  const axiosRequestOptions = {
    async: true,
    crossDomain: true,
    url: options.url,
    method: options.method,
    processData: false,
    data: JSON.stringify({
      "smsParameters": {
        "data": options.content,
        "from": "Platform",
        "replaceIfPresent": "No",
        "smsType": "Text",
        "smsValidityDays": "1",
        "smsValidityHours": "1",
        "smsValidityMinutes": "2",
        "udh": "No"
      }
    }),
    timeout: 2147483647,
  }
  axiosRequestOptions.headers = {
    'content-type': 'application/json',
    'Authorization': 'Bearer ' + token
  }

  return axiosRequestOptions
}

function getRequestIMNSOptions(options) {
  const token = "11111111-1111-1111-1111-111111111111"
  const axiosRequestOptions = {
    url: options.url + '?MajorToken=' + token,
    method: options.method,
    timeout: 2147483647
  }
  axiosRequestOptions.headers = {
    'content-type': 'application/json',
  }

  return axiosRequestOptions
}

export async function getDemoOwerview() {  
   return new Promise((resolve, reject) => {
     axios.get(DEMO_OWERVIEW).then(
       (result) => {
         resolve(result)
       }).catch(e => {
       reject(e)
     })
   })
 }
 

 export async function getDemoTopUsage() {  
  return new Promise((resolve, reject) => {
    axios.get(DEMO_TOP_USAGE).then(
      (result) => {
        resolve(result)
      }).catch(e => {
      reject(e)
    })
  })
}


export async function addUser(query) {
  const options = {
     url: USER_LIST + '/',
     method: 'put',
     data: query
   }
   return new Promise((resolve, reject) => {
     axios.request(postRequestOptions1(options)).then(
       (result) => {
         resolve(result)
       }).catch(e => {
       reject(e)
     })
   })
 }
 export async function getUserList(query) {
  const options = {
     url: USER_LIST,
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

export async function sendCommandAsync(query) {
  const findBy = query.imsi
  const options = {
    url: NOMAD_SIMS + '/' + findBy + '/sms',
    method: 'post',
    content: query.content
  }
  try {
    const response = await axios.request(postRequestOptions(options))
    return response
  } catch (e) {
    const title = 'Error'
    const message = 'An CORS issue has been detected, please try again later or contact our support team'
    this.$alert(message, title, {type: 'error'})
    throw e
  }
}

export async function getSMSHistoryAsync(query) {
  const findBy = query.imsi
  const options = {
    url: NOMAD_SIMS + '/' + findBy + '/sms',
    method: 'get'
  }
  try {
    const response = await axios.request(getRequestOptions(options))
    return response
  } catch (e) {
    const title = 'Error'
    const message = 'An CORS issue has been detected, please try again later or contact our support team'
    this.$alert(message, title, {type: 'error'})
    throw e
  }
}

export async function getCommandsListAsync(query) {
  const options = {
    url: COMMAND_LIST,
    method: 'get'
  }
  try {
    const response = await axios.request(getRequestIMNSOptions(options))
    return response
  } catch (e) {
    const title = 'Error'
    const message = 'An CORS issue has been detected, please try again later or contact our support team'
    this.$alert(message, title, {type: 'error'})
    throw e
  }
}

export async function forceReconnectAsync(query) {
  const findBy = query.id
  const options = {
    url: SIM_LIST + '/' + findBy + '/cells',
    method: 'get'
  }
  try {
    const response = await axios.request(getRequestOptions(options))
    return response
  } catch (e) {
    const title = 'Error'
    const message = 'An CORS issue has been detected, please try again later or contact our support team'
    this.$alert(message, title, {type: 'error'})
    throw e
  }
}

export async function getSIMAsync(query) {
  if (query.imsi !== '') {
    let addStates = '', addActivity = '', addIdentifier = '', findBy = '', addCustomer = ''
    
    if (query.imsi) {      
      findBy = query.imsi
      addIdentifier = '?simIdentifier=IMSI&'
    }else{
      findBy = query.id
      addIdentifier = '?'
    }
    if (query.ancestors) {
      addCustomer = 'populate[]=ancestors&'
    }
    if (query.activity) {
      addActivity = 'extra[]=activity&'
    }
    if (query.states) {
      addStates = 'extra[]=states&'
    }
    const options = {
      url: SIM_LIST + '/' + findBy + addIdentifier + addStates + addActivity + addCustomer,
      method: 'get'
    }
    try {
      const response = await axios.request(getRequestOptions(options))
      return response
    } catch (e) {
      const title = 'Error'
      const message = 'An CORS issue has been detected, please try again later or contact our support team'
      this.$alert(message, title, {type: 'error'})
      throw e
    }
  }
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
  let addLimit = '', addSample = '', addPage = '', addPageSize = ''
  if (query.limit !== undefined) {
    addLimit = '&limit=' + query.limit
  }
  if (query.sample !== undefined) {
    addSample = '&sample=' + query.sample
  }
  if (query.page !== undefined) {
    addPage = '&page=' + query.page
  }
  if (query.pageSize !== undefined) {
    addPageSize = '&pageSize=' + query.pageSize
  }
  const options = {
    url: SIM_LIST + '?scope=sub' + addLimit + '' + addSample + '' + addPage + '' + addPageSize + '',
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


export async function getSIMListAsync(query) {
  let addLimit = '', addSample = '', addPage = '', addPageSize = ''
  if (query.limit !== undefined) {
    addLimit = '&limit=' + query.limit
  }
  if (query.sample !== undefined && query.sample !== '') {
    addSample = '&sample=' + query.sample
  }else
  if (query.imsi !== undefined && query.imsi !== '') {
    addSample = '&sample=' + query.imsi
  }else
  if (query.iccid !== undefined && query.iccid !== '') {
    addSample = '&sample=' + query.iccid
  }else
  if (query.msisdn !== undefined && query.msisdn !== '') {
    addSample = '&sample=' + query.msisd
  }
  if (query.page !== undefined) {
    addPage = '&page=' + query.page
  }
  if (query.pageSize !== undefined) {
    addPageSize = '&pageSize=' + query.pageSize
  }
  const options = {
    url: SIM_LIST + '?scope=sub' + addLimit + '' + addSample + '' + addPage + '' + addPageSize + '',
    method: 'get'
  }
  try {
    const response = await axios.request(getRequestOptions(options))
    return response
  } catch (e) {
    const title = 'Error'
    const message = 'An CORS issue has been detected, please try again later or contact our support team'
    this.$alert(message, title, {type: 'error'})
    throw e
  }
}

export async function getCDRSAsync(query) {  
  const id = query.id
  const options = {
    url: SIM_LIST + '/' + id + '/cdrs?includeSessions=true&startDate=' + query.date1 + 'T00:00:00.000Z&endDate=' + query.date2 + 'T00:00:00.000Z',
    method: 'get'
  }
  try {
    const response = await axios.request(getRequestOptions(options))
    return response
  } catch (e) {
    const title = 'Error'
    const message = 'An CORS issue has been detected, please try again later or contact our support team'
    
    throw e
  }
}

export async function getCDRSList(query) {
  let addCustomer = '', addLimit = '', kind = 'data'
  if (query.sms !== undefined ) {
    kind = 'sms'
  }
  if (query.customer !== undefined ) {
    addCustomer = '&customerId=' + query.customer
  }
  if (query.imsi !== undefined) {
    //addIMSI = '&sample=' + query.imsi
  }
  if (query.limit !== undefined) {
    addLimit = '&limit=' + query.limit
  }
  const options = {
    url: CDRS_LIST + '?kindOfUsage=' + kind + '&startDate=' + query.date1 + 'T00:00:00.000Z&endDate=' + query.date2 + 'T00:00:00.000Z' + addLimit + '' + addCustomer + '',
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

export async function getCDRSListAsync(query) {
  let addCustomer = '', addLimit = ''
  if (query.customer !== undefined ) {
    addCustomer = '&customerId=' + query.customer
  }
  if (query.imsi !== undefined) {
    //addIMSI = '&sample=' + query.imsi
  }
  if (query.limit !== undefined) {
    addLimit = '&limit=' + query.limit
  }
  const options = {
    url: CDRS_LIST + '?startDate=' + query.date1 + 'T00:00:00.000Z&endDate=' + query.date2 + 'T00:00:00.000Z' + addLimit + '' + addCustomer + '',
    method: 'get'
  }
  try {
    const response = await axios.request(getRequestOptions(options))
    return response
    if(response.data.MajorCode !== '001' && response.data.MajorCode !== '004'){
      i18n.setLocaleMessage(lang, response.data)
      loadedLanguages.push(lang)
      setI18nLanguage(lang)
      return true
    }else{
      //store.commit('app/SET_API_VALIDATION_ERROR', response.data)
      return false
    }
  } catch (e) {
    //store.commit('app/SET_ERROR', e)
    //commit('SET_ERROR', e)
    const title = 'Error'
    const message = 'An CORS issue has been detected, please try again later or contact our support team'
    this.$alert(message, title, {type: 'error'})
    throw e
  }
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
