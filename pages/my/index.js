const {
  WXAPI
} = require("~/wxapi")
const app = getApp();
// pages/register/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ifAuthorize: undefined,
    nickName: undefined,
    avatar:undefined,
    orderList: [],
    goodsMap: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow() {
    
    app.authorize(res => {
      if (res == 'ok') {
        this.setData({
          ifAuthorize: true
        });
        this.getUserinfo();
        this.orderList();
      }
    })
  },
  orderList() {
    const user = wx.getStorageSync('user')
    WXAPI.orderList({
      token: user.token
    }).then(res => {
      this.setData({
        orderlist: res.data.orderList,
        goodsMap: res.data.goodsMap
      })
    })
  },
  goLogin() {
    wx.navigateTo({
      url: '/pages/authorize/index',
      events: {
        login: () => {
          this.setData({
            ifAuthorize: true
          });
          this.getUserinfo();
          this.orderList();
        }
      }
    })
  },
  getUserinfo() {
    const user = wx.getStorageSync('user')
    wx.showLoading({
      title: '读取用户信息',
    })
    WXAPI.userDetail(user.token).then(res => {
      wx.hideLoading();
      if (0 == res.code) {
        wx.hideLoading();
        this.setData({
          avatar: res.data.base.avatarUrl,
          nickName: res.data.base.nick
        })
      }
    })
  },
  goEdit() {
    wx.navigateTo({
      url: '/pages/edit/index',
    })
  }
})