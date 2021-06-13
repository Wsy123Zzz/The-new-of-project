<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行','新款','精选']" 
        @tabClick="tabClick" 
        ref="tabControl1" 
        class="tab-control" v-show="isTabFixed"/>
    <scroll class="content" 
    ref="scroll" :probe-type="3"
     @scroll="contentScroll" 
     :pull-up-load="true" @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
        <recommend-view :recommends="recommends"/>
        <feature-view/>
        <tab-control :titles="['流行','新款','精选']" 
        @tabClick="tabClick" 
        ref="tabControl2"/>
        <goods-list :goods="showGoods"/>
    </scroll>
    <!-- 组件不可以直接监听点击，需要添加native -->
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
    </div>

  
</template>

<script>
  
  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView'


  import NavBar from 'components/common/navbar/NavBar';  
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodsList from 'components/content/goods/GoodsList' 
  import Scroll from 'components/common/scroll/Scroll'
  import BackTop from 'components/content/backTop/BackTop'



  import {getHomeMultidata, getHomeGoods} from "network/home";
  import {debouce} from 'common/utils';
  import {itemListenerMixin, backTopMixin} from 'common/mixin'
  
  export default {
    name: "Home",
    components: {
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      TabControl,
      GoodsList,
      Scroll,
      // BackTop
    },
    mixins: [itemListenerMixin, backTopMixin],
    data() {
      return {
        banners: [],
        recommends: [],
        // 保存商品的数据结构设计
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []},
        },
        currentType: 'pop',
        // isShowBackTop: false,
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0,
        
      }
    },
    computed: {
    showGoods() {
      return this.goods[this.currentType].list
    }
    },
    destroyed() {

    },
    activated() {
      //进入时滚动到离开时的位置this.saveY
      this.$refs.scroll.scrollTo(0, this.saveY ,0)
      this.$refs.scroll.refresh()//进入时再刷新，避免出现小问题
    },
    deactivated() {
      //1.保存Y值，保存离开时的位置信息
      this.saveY = this.$refs.scroll.getScrollY()
      //2.取消全局事件的监听(主页图片加载时的监听)所以这里设置了keep-alive
      this.$bus.$off('itemImgLoad', this.itemImgListener)
    },
    created() {
      // 1.请求多个数据
      this.getHomeMultidata()

      //2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')

      //3.赋值
    },
    methods: {
      // 事件监听相关
      
      tabClick(index) {
        switch (index) {
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },
      // 已混入
      // backClick() {
      //   this.$refs.scroll.scrollTo(0, 0)
      // },
      contentScroll(position) {
        // position.y < 1000
        //1.判断我们的backtop是否显示
        this.isShowBackTop = -position.y > 1000
        //2.决定tabcontrol是否吸顶(position: fixed)
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      loadMore() {
        this.getHomeGoods(this.currentType)
        // this.refs.scroll.refresh()
      },
      swiperImageLoad() {
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      },
      // 网络请求
      getHomeMultidata() {
        getHomeMultidata().then(res => {
        // this.result = res;
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      })
     },
     getHomeGoods(type) {
       const page = this.goods[type].page + 1
       getHomeGoods(type, page).then(res => {
        this.goods[type].list.push(...res.data.list)
        this.goods[type].page += 1

        this.$refs.scroll.finishPullUp()
      })
     }
    }
  }
</script>

<style scoped>
  #home {
    /* padding-top: 44px; */
    height: 100vh;
    position: relative;
    
  }


  .home-nav {
    background-color: var(--color-tint);
    color: #fff;
    /* 在使用浏览器原生滚动时，为了让导航不跟随一起滚动 */
    /* position: fixed;
    left: 0;
    top: 0;
    right: 0;
    z-index: 9; */
  }
  .content { 
    /* height: 300px; */
    overflow: hidden;
    position:absolute;
    top:44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
  .tab-control {
    position: relative;
    z-index: 9999;
  }
  /* .content {
    height: calc(100% - 93px);
    overflow: hidden;
    margin-top: 44px;
  } */
  
  
</style>
