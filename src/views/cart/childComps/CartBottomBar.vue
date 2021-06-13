<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button 
      :is-checked="isSelectAll" 
      class="check-button" 
      @click.native="checkClick"/>
      <span>全选</span>
    </div>
    <div class="price">
      合计：{{totalPrice}}
    </div>
    <div class="calculate" @click="calcClick">

      去计算({{checkLength}})
    </div>
  </div>
</template>

<script>

import CheckButton from 'components/content/checkButton/CheckButton'
import {mapGetters} from 'vuex'

export default {
  name: "CartBottomBar",
  components: {
    CheckButton 
  },
  computed: {
    ...mapGetters(['cartList']),
    totalPrice() {
      return '￥' + this.cartList.filter(item => {
        return item.checked
      }).reduce((preValue, item) => {
        return preValue + item.price * item.count
      }, 0).toFixed(2)
    },
    checkLength() {
      return this.cartList.filter(item => item.checked).length
    },
    isSelectAll() {
      // return !(this.cartList.filter(item => !item.checked).length)
      if (this.cartList.length === 0) return false
      // 没有数据则下面一行代码为空 !underfined = true 所以上面需要加判断
      // return !this.cartList.find(item => !item.checked)
      
      for (let item of this.cartList) {
        if(!item.checked) {
          return false
        }
      }
      return true
    }
  },
  methods: {
    checkClick() {
      if (this.isSelectAll) { //全部选中
        this.cartList.forEach(item => item.checked = false)
      } else {//部分或全部不选中
        this.cartList.forEach(item => item.checked = true)
      }
    },
    calcClick() {
      if (!this.isSelectAll) {
        this.$toast.show('请选择购买的商品', 2000)
      }
    }
  }
}
</script>


<style scoped>
  .bottom-bar {
    height: 40px;
    background-color: #eee;
    position: relative;
    line-height: 40px;
    display:flex;
    bottom:40px;
  }
  .check-content {
    display: flex;
    align-items: center;
    margin-left: 10px;
    width: 60px;
    /* line-height: 40px; */
  }
  .check-button {
    width: 20px;
    height: 20px;
    line-height: 20px;
    margin-right: 5px;
  }
  .price {
    margin-left: 10px;
    flex: 1;
  }
  .calculate {
    width: 80px;
    background-color: red;
    color:#fff;
    text-align: center;
  }
</style>