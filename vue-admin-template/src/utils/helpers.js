const DOMAIN1 = 'https://test.m2mdata.co/'

export const API_METHODS = {
  DOMAIN1,

  LOGIN: DOMAIN1 + 'service/User/Auth',
  REMOTE_LOGIN: DOMAIN1 + 'service/User/ReAuth',

  GET_LOCALE: DOMAIN1 + 'service/language/json',

  TRANSLATIONS_GET_LIST: DOMAIN1 + 'service/language/Query',
  TRANSLATIONS_EDIT: DOMAIN1 + 'service/language/Edit',
  TRANSLATIONS_CREATE: DOMAIN1 + 'service/language/Add',
  TRANSLATIONS_DELETE: DOMAIN1 + 'service/language/Remove',

  OSP_GET_LIST: DOMAIN1 + 'service/OrganizeServiceProfile/Query',
  // if the user wan to create or edit a osp, you need call OrganizeServiceProfile/Myself  to display sub osp and sub roles options which can be seleced
  OSP_GET_LIST_MYSELF: DOMAIN1 + 'service/OrganizeServiceProfile/Myself',
  OSP_CREATE: DOMAIN1 + 'service/OrganizeServiceProfile/Add',
  OSP_EDIT: DOMAIN1 + 'service/OrganizeServiceProfile/Edit',
  OSP_DELETE: DOMAIN1 + 'service/OrganizeServiceProfile/Remove',

  USER_GET_LIST: DOMAIN1 + 'service/User/Query',
  USER_CREATE: DOMAIN1 + 'service/User/Add',
  USER_EDIT: DOMAIN1 + 'service/User/Edit',
  USER_DELETE: DOMAIN1 + 'service/User/Remove',
  USER_RESET_PASSWORD: DOMAIN1 + 'Service/User/ResetPassword',
  
  SIM_GET_LIST: DOMAIN1 + 'service/JTSim/Query',
  SIM_CREATE: DOMAIN1 + 'service/JTSim/Add',
  SIM_EDIT: DOMAIN1 + 'service/JTSim/Edit',
  SIM_DELETE: DOMAIN1 + 'service/JTSim/Remove',

  CUSTOMER_GET_LIST: DOMAIN1 + 'service/Organize/Query',
  CUSTOMER_CREATE: DOMAIN1 + 'service/Organize/Add',
  CUSTOMER_EDIT: DOMAIN1 + 'service/Organize/Edit',
  CUSTOMER_CHANGE_STATE: DOMAIN1 + 'service/Organize/SetState',
  CUSTOMER_DELETE: DOMAIN1 + 'service/Organize/Remove',

  TEMPLATE_GET_LIST: DOMAIN1 + 'service/CommandTemplate/Attributes',
  
}


//http://test.m2mdata.co/Service/Language/Edit
//http://test.m2mdata.co/Service/Language/Query

export function toLowerCaseObjectKeys(source) {
  return Object.keys(source)
    .reduce((destination, key) => {
      destination[key.toLowerCase()] = source[key];
      return destination;
    }, {});
}

export function isObjEmpty(obj) {
  // null and undefined are "empty"
  if (obj == null) return true;

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (obj.length > 0)    return false;
  if (obj.length === 0)  return true;

  // If it isn't an object at this point
  // it is empty, but it can't be anything *but* empty
  // Is it empty?  Depends on your application.
  if (typeof obj !== "object") return true;

  // Otherwise, does it have any properties of its own?
  // Note that this doesn't handle
  // toString and valueOf enumeration bugs in IE < 9
  for (let key in obj) {
    if (hasOwnProperty.call(obj, key)) return false;
  }
  return true;
}

export function getFormDataFromObject(query){
  let data = new FormData();
  if (!isObjEmpty(query)){
    const arr = Object.keys(query)
    arr.forEach(element => {
      if(Array.isArray(query[element])){
        for (let i = 0; i < query[element].length; i++) {
          if (query[element][i]) data.append(element+'[]', query[element][i])
        }
      }else{
        if (query[element]) data.append(element, query[element])
      }
    })
  }
  return data
}

export function sortArrayByObjProps(list, sortBy){
  //sortBy.direction == 1  means asc
  //sortBy.direction == -1 means desc
  if(list && list.length){
    list.sort(function(a,b){
      let i = 0, result = 0;
      while(i < sortBy.length && result === 0) {
        result = sortBy[i].direction*(a[ sortBy[i].prop ].toString().toUpperCase() < b[ sortBy[i].prop ].toString().toUpperCase() ? -1 : (a[ sortBy[i].prop ].toString().toUpperCase() > b[ sortBy[i].prop ].toString().toUpperCase() ? 1 : 0));
        i++;
      }
      return result;
    })
  }
  return list;
}

export function detectNavigatorAgentType(){
  let userAgent = navigator.userAgent || navigator.vendor || window.opera;
  let ret = 'Web';
  if (/android/i.test(userAgent)) {
    ret = "Android";
  }else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    ret = "IOS";
  }
  return ret;
}


/*const DOMAIN1 = 'http://test.m2mdata.co/'

export const API_METHODS = {
  DOMAIN1,

  GET_LOCALE: DOMAIN1 + 'service/language/json',

  TRANSLATIONS_GET_LIST: DOMAIN1 + 'service/language/Query',
  TRANSLATIONS_EDIT: DOMAIN1 + 'service/language/Edit',
  TRANSLATIONS_CREATE: DOMAIN1 + 'service/language/Add',
  TRANSLATIONS_DELETE: DOMAIN1 + 'service/language/Remove',

  CSP_GET_LIST: DOMAIN1 + 'service/OrganizeServiceProfile/Query',
}


//http://test.m2mdata.co/Service/Language/Edit
//http://test.m2mdata.co/Service/Language/Query
*/