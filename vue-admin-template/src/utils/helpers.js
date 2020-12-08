const DOMAIN1 = 'http://test.m2mdata.co/'

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
