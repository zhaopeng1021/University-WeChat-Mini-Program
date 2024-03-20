const {
    WXAPI
} = require("~/wxapi.js");
// const {cmsArticleUseless} = require("../../miniprogram_npm/apifm-wxapi");
Page({
    data: {
        categories: [], //分类
        currentIndex: 0, //选择的分类索引
    },

    onLoad(options) {
        this.initData();
    },

    //初始化
    initData() {
        WXAPI.goodsCategoryV2('0').then(res => {
            this.setData({
                categories: res.data
            });
        });
    },
    //选择分类
    onCategoryClick(e) {
        const index = e.currentTarget.dataset.index;
        const id = e.currentTarget.dataset.id;
        this.setData({
            navActive: index,
            contentActive: id
        });
    },
    async initData() {
        //读取商品分类
        const res1 = await WXAPI.goodsCategoryV2('0');
        if (0 == res1.code) {
            this.setData({
                categories: res1.data
            });
        }
        //读取商品列表
        const res2 = await WXAPI.goodsv2();
        if (0 == res2.code) {
            const goodsWrap = [];
            this.data.categories.forEach(item => {
                const obj = {
                    id: item.id,
                    name: item.name,
                    goods: res2.data.result.filter(item2 => item2.categoryId == item.id)
                }
                goodsWrap.push(obj);
            });
            this.setData({
                goodsWrap: goodsWrap
            });
        }
        wx.nextTick(() => {

            const query1 = wx.createSelectorQuery();
            const heightArr = []
            let s = 0;
            query1.selectAll(".goods-container").boundingClientRect(res => {
                res.forEach(item => {
                    s += item.height;
                    heightArr.push(s)
                })
                this.setData({
                    heightArr: heightArr
                })
            }).exec();

            //计算右侧滚动容器高度
            const query2 = wx.createSelectorQuery();
            query2.select(".right").boundingClientRect(res => {
                this.setData({
                    rightH: res.height
                })
            }).exec();

        });

    },

  onScroll(e){
      //滚动距离
    const scrollTop = e.detail.scrollTop;
    const  scrollArr = this.data.heightArr;
    if (scrollTop >=scrollArr[scrollArr.length-1] -this.data.rightH) {
      return
    } else{
      for (let i=0;i<scrollArr.length;i++){
        if (scrollTop>0 &&scrollTop<scrollArr[0]){
          this.setData({
            navActive:0
          })
        }else if (scrollTop >= scrollArr[i-1] && scrollTop <scrollArr[1]){
            this.setData({
                navActive:i
            })
          }
      }
    }
  }

})