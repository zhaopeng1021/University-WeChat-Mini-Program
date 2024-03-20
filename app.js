// app.js
const{
  WXAPI
} = require("~/wxapi.js")
App({
  onLaunch(){
    //获取系统参数设置
    WXAPI.queryConfigBatch('mallName').then(function(res) {
      if(res.code === 0){
        res.data.forEach(ele => {
          wx.setStorageSync(ele.key,ele.value);
        })
      }
    })
  }
})
