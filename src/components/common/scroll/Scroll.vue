<template>

  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>


<script>
import BScroll from 'better-scroll'


export default {
  name:"Scroll",
  props: {
    probeType: {
      type: Number,
      default: 0
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scroll: null
    }
  },
  mounted() {
    //1 创建BScroll对象
    //通过document.querySelector('.wrapper')获取元素的方式不太好
    //可能会有其他标签的class也是wrapper
    
    this.scroll = new BScroll(this.$refs.wrapper,{
      click: true,
      probeType: this.probeType,
      pullUpLoad:this.pullUpLoad,
      observeDOM: true
    })
    
    // 2 监听滚定的位置
    if (this.probeType === 2 || this.probeType === 3) {
      this.scroll.on('scroll', (position) => {
      this.$emit('scroll', position)
    }) 
    }

    // 3.监听上拉事件
    if (this.pullUpLoad) {
      this.scroll.on('pullingUp', () => {
      this.$emit('pullingUp')
    })  
   }
  },
  methods: {
    scrollTo(x, y, time=1000) {
      this.scroll && this.scroll.scrollTo && this.scroll.scrollTo(x, y, time)
    },
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp()
    },
    refresh() {
      // console.log('-----');
      this.scroll && this.scroll.refresh()
    },
    getScrollY() {
      return this.scroll ? this.scroll.y : 0
    }
  }
}
</script>


<style scoped>

</style>