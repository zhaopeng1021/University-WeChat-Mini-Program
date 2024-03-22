const {
  WXAPI
} = require('~/wxapi')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.eventChannel = this.getOpenerEventChannel();
  },
  onShow() {

  },
  bindGetUserInfo(e) {
    this.detail = e.detail;
    this.login();
  },
  login() {
    wx.showLoading({
      title: '正在登录...',
    })
    wx.login({
      success: (res1) => {
        WXAPI.login_wx(res1.code).then(res2 => {
          wx.hideLoading();
          if (10000 == res2.code) {
            this.register();
          } else if (0 === res2.code) {
            wx.setStorage({
              key: 'user',
              data: res2.data
            });
            wx.navigateBack({
              success:() =>{
                this.eventChannel.emit('login')
              }
            });
          } else {
            Notify({
              type: 'danger',
              message: res2.msg
            })
          }
        })
      },
    })

  },
  resgister() {
    wx.showLoading({
      title: '正在注册...',
    });
    wx.login({
      success: (res1) => {
        WXAPI.register_comples({
          code:res1.code,
          encryptedData:this.detail.encrypetedData,
          iv:this.detail.iv
        }).thenp(res2 =>{
          wx.hideLoading();
          if(0===res2.code){
            wx.showToast({
              title: '注册成功',
            });
            this.login();
          }else{
            Notify({
              type:'danger',
              message:res2.msg
            })
          }
        })
      },
    })
  }
})