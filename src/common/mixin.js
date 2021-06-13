import {debouce} from './utils';
import BackTop from 'components/content/backTop/BackTop'
import {POP, NEW, SELL} from "./const";

export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null,
      refresh: null
    }
  },
  mounted() {
    // 3.监听item中图片加载完成
      // 形成函数闭包，不会销毁
    this.refresh = debouce(this.$refs.scroll.refresh, 100)

    this.itemImgListener = () => {
      this.refresh()
    }
    this.$bus.$on('itemImgLoad', this.itemImgListener)
    // console.log('我是混入中的内容');
    // 2.tabcontrol的offsettop
      // 所有组件都有一个$el:用于获取组件中的元素，需让图片加载完成之后计算最终的offsettop
  },
}


export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false,
    }
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 200)
    },
  }
}
// catetory
export const tabControlMixin = {
  data: function () {
    return {
      currentType: POP
    }
  },
  methods: {
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = POP
          break
        case 1:
          this.currentType = NEW
          break
        case 2:
          this.currentType = SELL
          break
      }
      console.log(this.currentType);
    }
  }
}