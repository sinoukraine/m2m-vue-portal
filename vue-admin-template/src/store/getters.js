const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  language: state => state.user.language,
  login: state => state.user.login,
  userInfo: state => state.user.qtUserInfo,
  imsi: state => state.dashboard.imsi,
  period: state => state.dashboard.period,
}
export default getters
