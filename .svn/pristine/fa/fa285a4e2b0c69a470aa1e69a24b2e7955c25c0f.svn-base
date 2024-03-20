const WXAPI = require('apifm-wxapi');
WXAPI.init('37b982f3883b91328f4bee4606af14a0');

import Notify from '@vant/weapp/notify/notify';
Page({
  /**
     * 页面的初始数据
   */
  data: {
    avatar: '',
    nickName: "",
    showEdit: false
  },

  onLogin() {
    wx.login({
      success: (res1) => {
        WXAPI.login_wx(res1.code).then(res2 => {
          wx.hideLoading();
          console.log(res1);
          console.log(res2);
          if (0 == res2.code) { //登录成功
            wx.setStorage({
              key: 'user',
              data: res2.data
            });
            this.setData({
              showEdit: true
            });
            this.getUserinfo(res2.data.token);
            console.log("1")
            // wx.navigateTo({
            //   url: "/pages/index/index",
            // })
          } else if (10000 == res2.code) { //用户未注册
            wx.showModal({
              title: '提示',
              content: '您还没有注册账户，是否继续？',
              complete: (res3) => {
                if (res3.confirm) {
                  wx.navigateTo({
                    url: '/pages/register/index',
                  })
                }
              }
            })
          } else { //其它情况
            Notify({
              type: 'danger',
              message: res2.msg
            })
          }
        });
      },
    });
  },
  //获取用户详细信息
  getUserinfo(token) {
    wx.showLoading({
      title: '读取用户信息',
    });
    WXAPI.userDetail(token).then(res => {
      wx.hideLoading();
      if (0 == res.code) {
        this.setData({
          avatar: res.data.base.avatarUrl || '/assets/nohead.png',
          nickName: res.data.base.nick || '微信用户'
        })
      } else {
        Notify({
          type: 'danger',
          message: res.msg
        });
      }
    })
  },

  // 页面跳转
  edit() {
    wx.navigateTo({
      url: '/pages/edit/index',
    })
  }
})