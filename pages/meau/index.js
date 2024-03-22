const {
  WXAPI
} = require("~/wxapi"); // 引入WXAPI模块

// pages/meau/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    categories: [], // 商品分类数据数组
    goodsWrap: [], // 分类及其对应商品列表的数组
    heightArr: [], // 右侧商品列表每个分类项的高度数组
    contentActive: '', // 当前右侧内容区域的活动项ID
    navActive: 0, // 当前左侧导航项的活动索引，默认为0
    rightH: '', // 右侧滚动区域的高度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.initData(); // 页面加载时初始化数据
  },

  // 生命周期函数--监听页面显示
  onShow() {
    // 这里可以添加页面显示时的逻辑
  },

  /**
   * 初始化页面数据
   */
  async initData() {
    // 获取商品分类数据
    const res1 = await WXAPI.goodsCategoryV2('0');
    if (0 == res1.code) {
      // 将商品分类数据存储到data中的categories中
      this.setData({
        categories: res1.data
      })
    }
    // 获取商品数据
    const res2 = await WXAPI.goodsv2();
    if (0 == res2.code) {
      const goodsWrap = [];
      // 遍历分类数据，筛选对应分类下的商品数据，并存储到goodsWrap中
      this.data.categories.forEach(item => {
        const obj = {
          id: item.id,
          name: item.name,
          goods: res2.data.result.filter(item2 => item2.categoryId == item.id)
        }
        goodsWrap.push(obj);
      });
      // 更新页面的商品数据
      this.setData({
        goodsWrap: goodsWrap
      })
    }
    // 使用nextTick等待页面渲染完成后执行以下代码
    wx.nextTick(() => {
      // 创建一个查询实例
      const qurey1 = wx.createSelectorQuery();
      const heightArr = [];
      let s = 0;
      // 获取右侧商品列表每个分类项的高度
      qurey1.selectAll(".goods-container").boundingClientRect(res => {
        res.forEach(item => {
          s += item.height;
          heightArr.push(s);
        });
        // 将计算得到的高度数组存储到data中的heightArr中
        this.setData({
          heightArr: heightArr
        })
      }).exec()
      // 创建另一个查询实例
      const query2 = wx.createSelectorQuery();
      // 获取右侧滚动区域的高度
      query2.select(".right").boundingClientRect(res => {
        // 将获取到的高度存储到data中的rightH中
        this.setData({
          rightH: res.height
        })
      }).exec()
    })
  },

  /**
   * 处理左侧商品分类被点击的事件
   */
  onCategoryClick(e) {
    // 获取被点击分类的索引和ID
    const index = e.currentTarget.dataset.index;
    const id = e.currentTarget.dataset.id;
    // 更新data中的navActive和contentActive
    this.setData({
      navActive: index,
      contentActive: id,
      currentIndex: e.currentTarget.dataset.index
    })
  },

  /**
   * 处理右侧商品列表滚动事件
   */
  onScroll(e) {
    // 获取滚动的位置scrollTop
    const scrollTop = e.detail.scrollTop;
    const scrollArr = this.data.heightArr;
    // 如果滚动到了最底部，则不做处理
    if (scrollTop >= scrollArr[scrollArr.length - 1] - this.data.rightH) {
      return
    } else {
      // 遍历每个分类项的高度数组，根据滚动位置动态改变左侧导航的选中状态
      for (let i = 0; i < scrollArr.length; i++) {
        if (scrollTop > 0 && scrollTop < scrollArr[0]) {
          this.setData({
            navActive: 0,
          })
        } else if (scrollTop >= scrollArr[i - 1] && scrollTop < scrollArr[i]) {
          this.setData({
            navActive: i,
          })
        }
      }
    }
  }
})
