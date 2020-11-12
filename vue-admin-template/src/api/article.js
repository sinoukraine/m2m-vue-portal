import request from '@/utils/request'
import axios from 'axios'
import { getToken } from '@/utils/auth' // get token from cookie

const API_DOMIAN = 'https://m2mdata03.sinopacific.com.ua/api/v3/'
const DAILY_USAGE_REPORT = API_DOMIAN + 'cdrs'
const CUSTOMER_LIST = API_DOMIAN + 'counterparties'

function getRequestOptions(options) {
  const token = getToken()
  const axiosRequestOptions = {
    url: options.url,
    method: options.method,
    timeout: 25000
  }
  axiosRequestOptions.headers = {
    'content-type': 'application/json',
    'Authorization': 'Bearer ' + token
  }

  return axiosRequestOptions
}

export async function getDailyUsageReportList(query) {
  let addParametr = ''
  if (query.customer !== '0') {
    addParametr = '&customerId=' + query.customer
  }
  const options = {
    url: DAILY_USAGE_REPORT + '?startDate=' + query.date1 + 'T00:00:00.000Z&endDate=' + query.date2 + 'T00:00:00.000Z&limit=' + query.limit + '' + addParametr,
    method: 'get'
  }
  return new Promise((resolve, reject) => {
    axios.request(getRequestOptions(options)).then(
      (result) => {
        console.log(result)

        resolve(result)
      }).catch(e => {
      reject(e)
    })
  })
}

export async function getCustomerList(query) {
  console.log('c', query)
  const options = {
    url: CUSTOMER_LIST + '?fields[]=_id&fields[]=info.name&scope=sub&sort=info.name',
    method: 'get'
  }
  return new Promise((resolve, reject) => {
    axios.request(getRequestOptions(options)).then(
      (result) => {
        console.log(result)

        resolve(result)
      }).catch(e => {
      reject(e)
    })
  })
}

export async function fetchList(query) {
  console.log(query)
  /*  var myHeaders = new Headers()
  var urlencoded = new URLSearchParams()
  urlencoded.append('page', query.page)
  urlencoded.append('Rows', query.limit)
  urlencoded.append('Status', 'A')
  urlencoded.append('token', '00000000-0000-0000-0000-000000000000')

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  }

  return new Promise((resolve, reject) => {
    fetch('http://test.m2mdata.co/Service/Language/Query', requestOptions)
      .then(response => response.json())
      .then(result => {
        // const { data } = result
        resolve(result)
      })
      .catch(error => {
        reject(error)
      })
  })*/

  /* let data = {
    page: query.page,
    Rows: query.limit,
    Status: 'A',
    token: '00000000-0000-0000-0000-000000000000'
  }*/
  const data = new FormData()
  const hasToken = getToken()
  data.append('page', query.page)
  data.append('Rows', query.limit)
  data.append('startDate', query.data1 + 'T00:00:00.000Z')
  data.append('endDate', query.data2 + 'T00:00:00.000Z')
  data.append('limit', '10')
  data.append('Status', 'A')
  data.append('token', hasToken)
  try {
    const response = await axios.get('https://m2mdata03.sinopacific.com.ua/api/v3/cdrs', data)
    return response.data
  } catch (e) {
    console.log(e)
    return false
  }

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
