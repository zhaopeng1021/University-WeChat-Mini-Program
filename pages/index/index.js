const {
  WXAPI
} = require("~/wxapi.js");


Page({
  data: {
    bannerList: [],
    swiperCurrent:undefined,
    shopSubList: [],
    goodsRecommend:[],
  },
  swiperChange(e){
    this.setData({
      swiperCurrent:e.detail.current
    })
  },
  onShow() {
    WXAPI.banners().then(res => {
      this.setData({
        bannerList: res.data
      })
    });
    WXAPI.fetchShops().then(res => {
      this.setData({
        shopSubList: res.data
      })
    });
    WXAPI.goodsv2({
      recommendStatus:1
    }).then(res =>{
      this.setData({
        goodsRecommen:res.data.result
      })
    })
  },
  goMap(e){
    console.log(e);
    const id = e.currentTarget.dataset.id
    const item = this.data.shopSubList.find(e =>{
      return e.id == id
    });
    wx.openLocation({
      latitude: item.latitude,
      longitude: item.longitude,
      name:item.name,
      address:item.address
    })
  }
})