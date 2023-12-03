export default {
  state: () => ({
    cartItems: [],
    cartTotal:0,
    coupon: {},
    hst: {
      amount:0,
    },
    isInCart: false,
    cart_show:false,
    totalAmount:0,
  }),
  getters: {
    totalAmount(state){
      return state.totalAmount;
    },
    coupon(state){
      return state.coupon;
    },
    cartItems(state){
      return state.cartItems.filter((item)=> {
        if (item.id) return item
      });
    },
    summary(state){
      let dc = state.coupon.discount??0
      let st = state.totalAmount - dc
      let gt = st + state.hst.amount;
      return {
        total: state.totalAmount>0 ? state.totalAmount:0,
        discount: dc>0 ? dc:0,
        sub_total: st>0 ? st:0,
        hst: state.hst.amount>0? state.hst.amount: 0,
        grand_total: gt > 0 ? gt:0,
      }
    },
    cart_show(state){
      return state.cart_show;
    },
  },
  mutations: {
    cartRefresh(state, payload){
      if (process.client) {
        state.cartItems = JSON.parse(localStorage.getItem('cartItems')) ?? [];
        state.totalAmount = state.cartItems.reduce((temp, el) => {
          return el.amount? temp + el.amount:temp;
        }, 0);
        if (!state.cartItems.length)  localStorage.removeItem('coupon')
        state.coupon = JSON.parse(localStorage.getItem('coupon')) ?? {};
        state.cartTotal = state.cartItems.length;
      }
    },
    cardStatusChange(state, payload){
      state.cart_show=payload.status
    }
  },
  actions: {
    addCart: (context, payload) => {
      console.log('from cartjs');
      console.log(payload);
      //context.commit('addToCart', payload);
    },
    showOrHideCart:(context, payload)=>{
      window.dispatchEvent(new CustomEvent('cart-localstorage-changed', {
        detail: {
          storage: localStorage.getItem('cartItems')
        }
      }));
      context.commit("cardStatusChange", payload)
      context.commit('cartRefresh')
    }
  }

}
