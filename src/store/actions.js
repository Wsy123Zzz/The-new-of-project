import {
  ADD_COUNTER,
  ADD_YO_CART
} from './mutation-types'


export default {
  addCart(context, payload) {
    return new Promise((resolve, reject) => {
      //payload新添加的商品
    // let oldProduct = null
    // for(let item of state.cartList) {
    //   if (item.iid === payload.iid) {
    //     oldProduct = item;
    //   }
    // }
    
    // 查找数组中是否有该商品
    let product = context.state.cartList.find(function(item){
      return item.iid === payload.iid
    })
    //2.判断是否有oldproduct
    if (product) { //数量加一
      context.commit(ADD_COUNTER, product)
      resolve('当前数量加+1')
    } else {//添加新的商品
      payload.count = 1
      // context.state.cartList.push(payload)
      context.commit(ADD_YO_CART, payload)
      resolve('添加了新的商品')
    }
    // if (oldProduct) {
    //   oldProduct.count += 1
    // } else {
    //   payload.count = 1
    //   state.cartList.push(payload)
    // }
    })
  }
}