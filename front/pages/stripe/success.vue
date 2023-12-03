<template>
  <div>
    <bread-crumbs2 title="Payment Successful" image="instructor.png" :items="[{title: 'Payment Successful', link:'#', disabled:true}]"></bread-crumbs2>

    <div class="cart-section">
      <div class="btcontainer">
        <h3 class="text-center">Payment Successful</h3>
        <h6 class="text-center">Thank you for your purchase</h6>
      </div>
    </div>
  </div>
</template>

<script>

import BreadCrumbs2 from "@/components/common/BreadCrumbs2.vue";

export default {
  components: {BreadCrumbs2},
  auth: false,
  data() {
    return {
      //
    }
  },
  mounted() {
    this.emptyCart()
    if (process.client) {
      localStorage.removeItem('cartItems');
      window.dispatchEvent(new CustomEvent('cart-localstorage-changed', {
        detail: {
          storage: localStorage.getItem('cartItems')
        }
      }));
    }
  },
  methods:{
    refreshCart(){
      this.$store.commit('cart/cartRefresh')
    },
    emptyCart() {
      if (process.client) {
        localStorage.removeItem('cartItems');
        localStorage.removeItem('coupon');
      }
      this.refreshCart()
    },
  }
}
</script>

<style scoped>

</style>

