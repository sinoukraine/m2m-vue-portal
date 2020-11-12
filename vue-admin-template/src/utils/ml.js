import Vue from 'vue'
import { MLInstaller, MLCreate, MLanguage } from 'vue-multilanguage'
import eng from '@/utils/locales/ENG'
import ukr from '@/utils/locales/UKR'

Vue.use(MLInstaller)

export default new MLCreate({
  initial: 'en',
  save: process.env.NODE_ENV === 'production',
  languages: [
    new MLanguage('en').create(eng),
   // new MLanguage('uk').create(ukr)
  ]
})
/* import Vue from 'vue'
import { MLInstaller, MLCreate, MLanguage } from 'vue-multilanguage'

Vue.use(MLInstaller)

export default new MLCreate({
  initial: 'english',
  save: process.env.NODE_ENV === 'production',
  languages: [
    new MLanguage('english').create({
      title: 'Hello mr {0}!',
      msg: 'You have {f} friends and {l} likes',
      test: 'Test'
    }),
    new MLanguage('portuguese').create({
      title: 'Oi {0}!',
      msg: 'Você tem {f} amigos e {l} curtidas',
      test: 'Testos'
    })
  ]
})*/
