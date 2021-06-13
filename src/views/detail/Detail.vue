<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info ref="params" :param-info="paramInfo"/>
      <detail-comment-info ref="comment" :comment-info="commentInfo"/>
      <goods-list ref="recommend" :goods="recommends"/>
    </scroll>
    <detail-bottom-bar @addCart="addToCart"/>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
    <!-- <toast :message="message" :show="show"/> -->
  </div>

</template>


<script>
import DetailNavBar from './childComponents/DetailNavBar'
import DetailSwiper from './childComponents/DetailSwiper'
import DetailBaseInfo from './childComponents/DetailBaseInfo'
import DetailShopInfo from './childComponents/DetailShopInfo'
import DetailGoodsInfo from './childComponents/DetailGoodsInfo'
import DetailParamInfo from './childComponents/DetailParamInfo'
import DetailCommentInfo from './childComponents/DetailCommentInfo'
import DetailBottomBar from './childComponents/DetailBottomBar'


import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodsList'
// import Toast from 'components/common/toast/Toast'


import {debouce} from 'common/utils'
import {itemListenerMixin, backTopMixin} from 'common/mixin'
import {getDetail, Goods, Shop, GoodsParam, getRecommend} from "network/detail"

import { mapActions } from 'vuex'

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailBottomBar,
    GoodsList,
    // Toast,
    Scroll
  },
  mixins: [itemListenerMixin, backTopMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      // goodsInfo: {},
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      getThemeTopY: null,
      currentIndex: 0,
      // message: '',
      // show: false
    }
  },
   
  created() {
    //1.保存传入的id
    this.iid = this.$route.params.iid
    //2.根据iid请求详细数据 
    getDetail(this.iid).then(res => {
      console.log(res);
      //1.获取顶部的图片轮播数据
      const data = res.result;
      this.topImages = data.itemInfo.topImages
      //2.获取商品信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
      //3.创建店铺信息
      this.shop = new Shop(data.shopInfo)
      //4.保存我们商品的详情数据
      this.detailInfo = data.detailInfo;
      //5.获取参数的信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
      //6.获取评论信息
      if (data.rate.cRate !== 0) {
		    this.commentInfo = data.rate.list[0];
	    }
        // 第一次获取不到，因为根本没有渲染
        // this.themeTopYs = [];
        // this.themeTopYs.push(0);
        // this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        // this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      // this.$nextTick(()=> {
        // 第二次根据最新的数据，对应dom是已经被渲染出来了，但图片依然没有加载完
        // 目前获取的offsettop不包含其中的图片，这种情况基本为图片的问题
        // this.themeTopYs = [];
        // this.themeTopYs.push(0);
        // this.themeTopYs.push(this.$refs.params.$el.offsetTop);
        // this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
        // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      // })
       
    }),
     //3. 请求推荐数据
    getRecommend().then(res => {
      this.recommends = res.data.list
    })
    // 给getThemeTopY赋值进行防抖
    this.getThemeTopY = debouce(() => {
      this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      this.themeTopYs.push(Number.MAX_VALUE)
      console.log(this.themeTopYs);
    }, 100)
  },
  methods: {
    ...mapActions(['addCart']),
    imageLoad() {
      this.$refs.scroll.refresh()
      // this.refresh()
    this.getThemeTopY()
      
    },
    titleClick(index) {
      // console.log(index);
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 200)
    },
    contentScroll(position) {
      // console.log(position);
      // 1.获取Y值
      const positionY = -position.y

      // 2.positionY和主题中的值进行对比
      let length = this.themeTopYs.length
      for(let i = 0; i < length-1; i++) {
        // if (positionY > this.themeTopYs[i] && positionY < this.themeTopYs[i+1]) {
          
        // }

        if(this.currentIndex !== i && (positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])) {
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex
        }
        // if (this.currentIndex !== i && ((i < length - 1 &&  positionY >= this.themeTopYs[i] &&  
        // positionY < this.themeTopYs[i+1]) || (i === 
        // length - 1 && positionY >= this.themeTopYs[i]))) {
        //   this.currentIndex = i
          // console.log(this.currentIndex);
          // this.$refs.nav.currentIndex = this.currentIndex
        // }
        //3.是否显示回到顶部
        this.isShowBackTop = -position.y > 1000
      }
    },
    addToCart() {
      //1.获取购物车需要展示的的信息
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;
      //2.将我们的商品添加到购物车里面
      // this.$store.commit('addCart', product)
      this.addCart(product).then(res => {
      //   this.show = true;
      //   this.message = res;
      //   setTimeout(() => {
      //     this.show = false;
      //     this.message = ''
      //   }, 1500)
      this.$toast.show(res, 2000)
    })
      // this.$store.dispatch('addCart', product).then(res => {
      //   console.log(res);
      // })
      
    }
  },
  mounted() {
   
  },
  updated() {
    // 其中方法之一
    // this.themeTopYs = [];

    // this.themeTopYs.push(0);
    // this.themeTopYs.push(this.$refs.params.$el.offsetTop);
    // this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
    // this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
  },
  destroyed() {
    this.$bus.$off('itemImgLoad', this.itemImgListener)
  }
}
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }
  .content {
    height: calc(100% - 44px - 49px);
  }
  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }
</style>