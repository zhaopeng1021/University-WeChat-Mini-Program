// pages/register/index.js
const {
  WXAPI
} = require('~/wxapi.js')
import Notify from '@vant/weapp/notify/notify';

Page({
  data: {},
  onLoad() {},
  onRegister() {
    wx.showLoading({
      title: '正在注册账户',
    });
    wx.login({
      success: (res1) => {
        console.log(res1, 'res111');
        WXAPI.register_simple({
          code: res1.code,
        }).then(res2 => {
          console.log(res2, 'res222');
          wx.hideLoading();
          if (0 == res2.code) {
            wx.showToast({
              title: '注册成功',
            });
            wx.navigateBack();
          } else { //注册异常
            wx.showToast({
              title: '注册异常',
              icon:'error'
            })
          }
        })
      }
    })
  },

})