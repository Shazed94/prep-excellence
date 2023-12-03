<template>
  <div>
    <!-- cart sidebar -->
    <div class="side_cart_section cart-sidebar"
        aria-labelledby="slide-over-title" role="dialog" aria-modal="true" @click="$emit('close')">
        <div>
            <button type="button" @click="$emit('close')"
                class="close_sc sidebar-close">
                <span class="sr-only">Close panel</span>
            </button>
        </div>
        <div class="side_cart_unique">

            <div class="side_cart_full_bg" aria-hidden="true"></div>

            <div class="side_cart_full_layout">

                <div class="cart-layout">
                    <div class="cart_layout_body">
                        <div class="cart_layout_shopping">
                            <div class="cart_layout_shopping_title_area">
                                <div class="cart_layout_shopping_title_close">
                                    <button type="button" class="close_sc sidebar-close">
                                      <span class="sr-only">Close panel</span>
                                      <!-- Heroicon name: outline/x -->
                                      <svg class="" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                  </button>
                                </div>
                                <h2 class="" id="slide-over-title">Course cart</h2>
                            </div>

                            <div class="cart_layout_body_content">
                                <div class="cart_layout_body_content_list">
                                    <ul v-if="cartItems && cartItems.length > 0" role="list" class="scp_list">

                                        <li v-for="cartItem in cartItems" :key="cartItem.id" class="sidebar-produc sidebar-product">
                                            <input type="hidden" class="sc_item_id" value="1">
                                                <div v-if="cartItem.image" class="cart_layout_body_content_img">
                                                    <img :src="cartItem.image" alt="" class="">
                                                </div>
                                                <div class="cart_layout_body_content_img" v-else>
                                                    <img src="~/assets/images/course-1.png" alt="" class="">
                                                </div>

                                            <div class="cart_layout_body_content_list_text">
                                                <div>
                                                    <div class="cart_layout_body_content_list_text_left_area">
                                                        <h3>
                                                            <a href="#"> {{ cartItem.name }} </a>
                                                        </h3>
                                                        <div class="sidebar-product-price"><span
                                                                class="product-price">$ {{ cartItem.amount }}</span>
                                                        </div>

                                                    </div>
                                                    <!-- <p class="">ake one of Udemy’s range of Python courses</p> -->
                                                </div>
                                                <div class="">
                                                    <!-- <div class="flex space-x-2 sci_quantity sp_quantity cib_quantity">
                                                        <button class="sct_btn h-6 w-6 border border-gray-200" value="minus"
                                                            data-cart_id=""><i class="fas fa-minus" aria-hidden="true"></i></button>
                                                        <input class="cart_quantity_input h-6 w-6 border border-gray-200" type="number"
                                                            value="" min="1" data-max_stock="10" readonly>
                                                        <button class="sct_btn h-6 w-6 border border-gray-200" value="plus"
                                                            data-cart_id=""><i class="fas fa-plus" aria-hidden="true"></i></button>
                                                    </div> -->

                                                    <div class="product-removal-sidebar flex">
                                                        <button @click="removeItem(cartItem.id)" class="remove-product-sidebar"
                                                            id="">Remove</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>

                                        <!-- <li class="sidebar-produc sidebar-product">
                                            <input type="hidden" class="sc_item_id" value="1">
                                                <div class="cart_layout_body_content_img">
                                                    <img src="~/assets/images/course-2.png" alt="" class="">
                                                </div>

                                            <div class="cart_layout_body_content_list_text">
                                                <div>
                                                    <div class="cart_layout_body_content_list_text_left_area">
                                                        <h3>
                                                            <a href="#"> Scholarships Secrets </a>
                                                        </h3>
                                                        <div class="sidebar-product-price">1 X <span
                                                                class="product-price">100</span>
                                                        </div>

                                                    </div>
                                                    <p class="">ake one of Udemy’s range of Python courses</p>
                                                </div>
                                                <div class="">
                                                    <div class="product-removal-sidebar flex">
                                                        <button class="remove-product-sidebar"
                                                            id="">Remove</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li> -->

                                    </ul>
                                    <ul role="list" class="scp_list" v-else>
                                       <p style="margin-top: 40%" class="text-center">Your cart is empty!</p>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div class="sidebar-total">
                            <!-- <div class="sidebar-subtotal">
                                <p>Subtotal</p>
                                <p class="total-price" id="cart-subtotal">${{ total }}
                                </p>
                            </div> -->

                            <div class="sidebar-grandtotal">
                                <p>Total Amount </p>
                                <p class="total-price" id="cart-total">${{ total }}</p>
                            </div>
                            <div class="sidebar-checkout">
                                <nuxt-link to="/cart"
                                    class="checkout">Cart</nuxt-link>
                            </div>
                            <!-- <div class="sidebar-checkout">
                                <a href="/checkout"
                                    class="checkout">Checkout</a>
                            </div> -->
                            <div class="others_course">
                              <p>
                                or <button type="button" class="">Continue Others Course Enroll<span aria-hidden="true"> &rarr;</span></button>
                              </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cartItems: [],
      total: 0
    }
  },
  mounted() {
    window.addEventListener('cart-localstorage-changed', (event) => {
      this.getCartItems();
    });
  },
  methods: {
    getCartItems() {
      //console.log('www');
      if (process.client) {
        this.cartItems = JSON.parse(localStorage.getItem('cartItems')) ?? [];
        this.total = this.cartItems.reduce((temp, el) => {
                      return temp + el.amount;
                    }, 0);
      }
    },
    removeItem(id) {
      let temp = JSON.parse(localStorage.getItem('cartItems'));
      let index = temp.findIndex(el => el.id === id);
      temp.splice(index, 1);

      localStorage.setItem('cartItems', JSON.stringify(temp));
      this.$toaster.success('Course removed successfully!');
      window.dispatchEvent(new CustomEvent('cart-localstorage-changed', {
        detail: {
          storage: localStorage.getItem('cartItems')
        }
      }));
      //window.location.reload();
    }
  }
}
</script>

<style>

</style>
