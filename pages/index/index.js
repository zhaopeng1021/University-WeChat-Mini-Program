const {
  WXAPI
} = require("~/wxapi.js");


Page({
  data: {
    bannerList: [],
    swiperCurrent: undefined,
    shopSubList: [],
    goodsRecommen: [],
  },
  swiperChange(e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  onLoad() {
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('mallName'),
    });
    this.getData();
  },
  async getData(){
    const res1 = await WXAPI.banners()
    if(0==res1.code){
      this.setData({
        bannerList: res1.data
      })
    }
    const res2 = await WXAPI.fetchShops()
    if(0===res2.code){
      this.setData({
        shopSubList: res2.data
      })
    }
    const res3 = await WXAPI.goodsv2({recommendStatus:1});
    if(0===res3.code){
      this.setData({
        goodsRecommen: res3.data.result
      })
    }
    wx.stopPullDownRefresh();
  },
  onPullDownRefresh () {
    this.getData();
  },
  goMap(e) {
    console.log(e);
    const id = e.currentTarget.dataset.id
    const item = this.data.shopSubList.find(e => {
      return e.id == id
    });
    wx.openLocation({
      latitude: item.latitude,
      longitude: item.longitude,
      name: item.name,
      address: item.address
    })
  }
})