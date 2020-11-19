import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from '@/locales/en'
import axios from 'axios'

Vue.use(VueI18n)

/*function loadLocaleMessages () {
  const locales = require.context('@/locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  return messages
}
console.log(messages)*/
export const i18n = new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || 'en',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  //messages: loadLocaleMessages()
  messages: {'en': messages}
})

const loadedLanguages = ['en'] // our default language that is preloaded

function setI18nLanguage (lang) {
  i18n.locale = lang
  axios.defaults.headers.common['Accept-Language'] = lang
  document.querySelector('html').setAttribute('lang', lang)
  return lang
}

export function loadLanguageAsync(lang='en') {
  // If the same language
  if (i18n.locale === lang) {
    return Promise.resolve(setI18nLanguage(lang))
  }

  // If the language was already loaded
  if (loadedLanguages.includes(lang)) {
    return Promise.resolve(setI18nLanguage(lang))
  }

  // If the language hasn't been loaded yet
  return import(`@/locales/${ lang }.json`).then(
  //return fetch('http://test.m2mdata.co/service/language/json?token=00000000-0000-0000-0000-000000000000&q='+lang).then(
    async response => {
      let messages = response && response.status === 200? await response.json():false;
      console.log(messages)
      if(messages){
        i18n.setLocaleMessage(lang, messages)
        loadedLanguages.push(lang)
        return setI18nLanguage(lang)
      } else {
        return false
      }
    }
  )
}
