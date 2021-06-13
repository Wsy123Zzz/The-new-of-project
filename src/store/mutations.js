import {
  ADD_COUNTER,
  ADD_YO_CART
} from './mutation-types'

export default {
  // mutations唯一的目的是修改states的状态
    // mutations中每个方法尽可能完成的事件比较单一一点
    [ADD_COUNTER](state, payload) {
      payload.count++
    },
    [ADD_YO_CART](state, payload) {
      payload.checked = true
      state.cartList.push(payload)
    }
}