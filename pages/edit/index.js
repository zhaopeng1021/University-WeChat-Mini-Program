// pages/edit/index.js
const {
  WXAPI
} = require('~/wxapi.js')
Component({
  methods: {
    //选择头像上传
    chooseavatar(e) {
      console.log(e,'eeee')
      if (e.detail.avatarUrl) {
        wx.showLoading({
          title: '正在上传',
        })
      }
      //上传文件接口
      WXAPI.uploadFileV2(this.token, e.detail.avatarUrl).then(res => {
        wx.hideLoading();
        if (0 == res.code) {
          console.log(res.data.url)
          this.setData({
            avatar: res.data.url //头像网络路径
          })

        } else {
          wx.showToast({
            title: '上传失败',
            icon: "error"
          })
        }
      })
    },
    //新昵称
    nickInput(e) {
      console.log(e,'eeee');
      this.setData({
        nickName: e.detail.value
      })
    },
    onLoad() {
      const user = wx.getStorageSync('user');//读取缓存
      console.log(user,'user');
      if (user && user.token) {//如果有缓存
        this.token = user.token;
        this.getUserinfo();//读取用户信息
      } else {
        wx.showToast({
          title: '没有token',//没有缓存
          icon: 'error'
        });
        setTimeout(() => {
          wx.wx.navigateBack()
        }, 1000)
      }
    },
    onSave() {
      wx.showLoading({
        title: '正在保存',
      });
      WXAPI.modifyUserInfo({ //修改信息接口
        token: this.token,
        avatarUrl: this.data.avatar,
        nick: this.data.nickName //修改信息
      }).then(res => {
        wx.hideLoading();
        if (0 == res.code) {
          wx.showToast({
            title: '保存成功',
          });
          setTimeout(() => {
            wx.navigateBack()
          }, 1000)
        } else {
          wx.showToast({
            title: '保存失败',
            icon: 'error'
          })
        }
      })
    },
    getUserinfo() {
      wx.showLoading({
        title: '正在读取',
      })
      WXAPI.userDetail(this.token).then(res => {
        console.log(res,'ressss')
        wx.hideLoading()
        if (0 == res.code) {
          this.setData({
            avatar: res.data.base.avatarUrl || '/assets/nohead.jpg',
            nickName: res.data.base.nick || ''
          })
        } else {
          Notify({
            type: 'danger',
            message: res.msg
          })
        }
      })
    },

  },
})