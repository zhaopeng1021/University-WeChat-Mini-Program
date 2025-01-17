// app.js
const {
  WXAPI
} = require("~/wxapi");
App({
  onLaunch() {
    WXAPI.queryConfigBatch("mallName").then(function (res) {
      if (res.code === 0) {
        res.data.forEach(ele => {
          wx.setStorageSync(ele.key, ele.value)
        })
      }
    })
  },
  //身份认证
  authorize(cb) {
    const user = wx.getStorageSync('user')
    if (user && user.token) {
      WXAPI.checkToken(user.token).then(res => {
        if (0 !== res.code) {
          wx.showToast({
            title: res.msg,
            icon: 'none'
          })
          wx.removeStorage({
            key: 'user',
          });
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/authorize/index',
              events: {
                login: () => {
                  if (cb && typeof cb === 'function')
                    cb('ok');
                }
              }
            })
          }, 1000)
        } else {
          if (cb && typeof cb == 'function') {
            return cb('ok')
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/authorize/index',
        events: {
          login: () => {
            if (cb && typeof cb === 'function')
              cb('ok');
          }
        }
      })
    }
  }
});