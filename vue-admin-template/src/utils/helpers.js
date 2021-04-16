//const DOMAIN = 'https://test.m2mdata.co/'
const DOMAIN1 = 'https://test4.m2mdata.co/'
const DOMAIN2 = 'https://test4.m2mdata.co/'

export const API_METHODS = {
  DOMAIN1,

  LOGIN: DOMAIN2 + 'service/User/Auth',
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
  USER_RESET_MY_PASSWORD: DOMAIN1 + 'Service/User/ResetMyPassword',
  
  SIM_GET_LIST: DOMAIN2 + 'JT/Sim/Query',
  SIM_CREATE: DOMAIN2 + 'JT/Sim/Add',
  SIM_EDIT: DOMAIN2 + 'JT/Sim/Edit',
  SIM_DELETE: DOMAIN2 + 'JT/Sim/Remove',
  SIM_GET_SERVICE_PROFILE_OPTIONS: DOMAIN1 + 'JT/ServiceProfile/Query',
  SIM_SET_SERVICE_PROFILE: DOMAIN1 + 'JT/Sim/SetSimServiceProfile',
  SIM_SET_ACTIVATE: DOMAIN2 + 'JT/Sim/Activate',
  SIM_SET_SUSPEND: DOMAIN2 + 'JT/Sim/Suspend',
  SIM_SET_RESUME: DOMAIN2 + 'JT/Sim/Resume',
  SIM_SET_TERMINATE: DOMAIN2 + 'JT/Sim/Terminate',
  SIM_GET_POSITION: DOMAIN2 + 'JT/Sim/QueryLBSInfo',
  SIM_MOVE: DOMAIN2 + 'JT/Sim/Transfer',
  SIM_IMPORT: DOMAIN2 + 'JT/Sim/Import',

  CUSTOMER_GET_LIST: DOMAIN1 + 'Service/Organize/Query',
  CUSTOMER_CREATE: DOMAIN1 + 'service/Organize/Add',
  CUSTOMER_EDIT: DOMAIN1 + 'service/Organize/Edit',
  CUSTOMER_CHANGE_STATE: DOMAIN1 + 'service/Organize/SetState',
  CUSTOMER_DELETE: DOMAIN1 + 'service/Organize/Remove',

  TEMPLATE_GET_LIST: DOMAIN1 + 'service/CommandTemplate/Attributes',

  COMMANDS_GET_TEMPLATES: DOMAIN1 + 'Service/SMSTemplate/Query',
  COMMANDS_ADD_TEMPLATE: DOMAIN1 + 'Service/SMSTemplate/Add',
  COMMANDS_EDIT_TEMPLATE: DOMAIN1 + 'Service/SMSTemplate/Edit',
  COMMANDS_DELETE_TEMPLATE: DOMAIN1 + 'Service/SMSTemplate/Remove',

  PERMISSIONS_GET_LIST: DOMAIN2 + 'service/Permission/Query',
  PERMISSIONS_CREATE: DOMAIN2 + 'service/Permission/Add',
  PERMISSIONS_EDIT: DOMAIN2 + 'service/Permission/Edit',
  PERMISSIONS_DELETE: DOMAIN2 + 'service/Permission/Remove',
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