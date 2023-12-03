<template>
  <div>
    <!-- Breadcumb -->
    <bread-crumbs2 title="Cart" image="/breadcrumb_testimonial.png" :items="[{title: 'Cart', link:'#', disabled:true}]"></bread-crumbs2>
    <!-- Breadcumb end -->
    <v-container>
      <v-row dense>
        <v-col cols="12" md="7">
          <v-card>
            <v-card-title style="background: #0a53be;" class="text-white">Courses</v-card-title>
            <v-card-text>
              <v-simple-table>
                <thead>
                <tr>
                  <th class="product">Course</th>
                  <th class="price">Price</th>
                  <th class="action">Action</th>
                </tr>
                </thead>
                <tbody v-if="cartItems && cartItems.length > 0">
                  <tr v-for="cartItem in cartItems" :key="cartItem.id">
                    <td class="product">
                      <div class="cart-product">
                        <div class="cart-product__thumbnail">
                          <img v-if="cartItem.image" :src="cartItem.image" alt="" width="70" height="auto">
                          <img v-else src="~/assets/images/course-1.png" alt="" class="" width="70" height="auto">
                        </div>
                        <div class="cart-product__content">
                          <h3 class="cart-product__name">{{ cartItem.name }}</h3>
                        </div>
                      </div>
                    </td>
                    <td class="price">
                      <div class="cart-product__price">
                        <span class="sale-price">${{ cartItem.amount }}<small class="separator"></small></span>
                      </div>
                    </td>
                    <td class="action">
                      <div @click="removeItem(cartItem.id)" class="cart-product__remove">
                        <a class="remove btn btn-danger text-white" href="#">Remove</a>
                      </div>
                    </td>
                  </tr>
                </tbody>
                <tbody v-else>
                <tr>
                  <td colspan="5">
                    <p class="text-center">Your cart is empty! Please add some first.</p>
                  </td>
                </tr>
                </tbody>
              </v-simple-table>
            </v-card-text>
            <v-card-actions class="mt-2">
              <v-btn
                class="signup-menu">
                <nuxt-link to="/">
                  Continue shopping
                </nuxt-link>
              </v-btn>
              <v-btn
                class="login-menu"
                dark
                @click="emptyCart"
              >
                Clear shopping cart
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-divider></v-divider>
        <v-col cols="12" md="5">
          <v-card>
            <v-card-title style="background: #0a53be;" class="text-white">Cart Summary</v-card-title>
            <v-card-text>
              <v-simple-table>
                <tbody>
                <tr>
                  <th>Course Total</th>
                  <td>
                    <span class="subtotal-price">$ {{ summary.total }}<span class="separator"></span></span>
                  </td>
                </tr>
                <tr v-if="summary.discount">
                  <th>Discount</th>
                  <td>
                    <span class="subtotal-price">$ {{ summary.discount }}<span class="separator"></span></span>
                  </td>
                </tr>
                <tr>
                  <th>Subtotal</th>
                  <td>
                    <span class="subtotal-price">$ {{ summary.sub_total }}<span class="separator"></span></span>
                  </td>
                </tr>
                <tr v-if="summary.hst">
                  <th>HST</th>
                  <td>
                    <span class="subtotal-price">$ {{ summary.hst }}<span class="separator"></span></span>
                  </td>
                </tr>
                <tr>
                  <th>G. Total</th>
                  <td>
                    <span class="total-price">$ {{ summary.grand_total }}<span class="separator"></span></span>
                  </td>
                </tr>
                </tbody>
              </v-simple-table>
              <h6 class="mt-1 mb-1">Apply Coupon</h6>
              <v-text-field
                v-model="c_coupon"
                dense
                outlined
                :append-outer-icon="'mdi-send'"
                clear-icon="mdi-close-circle"
                clearable
                label="Coupon Code"
                type="text"
                @click:append-outer="applyCoupon"
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click.prevent="placeOrder">Order Now</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import cart from '../store/cart';
import {common as commonMixin} from "@/mixins/common";
import {mapGetters} from "vuex";
import BreadCrumbs2 from "@/components/common/BreadCrumbs2.vue";
export default {
  components: {BreadCrumbs2},
  auth: false,
  mixins: [commonMixin],
  data() {
    return {
      totalCartItems: 0,
      loginOpen: false,
      loader: {isLoading: false, isSignInDisabled: false, isSubmitting: false, isDeleting: false},
      isOpen: false,
      view: {
            atTopOfPage: true
        },
      total: 0,
      c_coupon:null,
    }
  },
  mounted() {
    this.$store.commit('cart/cartRefresh');
    if(this.coupon.coupon) this.c_coupon= this.coupon.coupon.code
  },
  computed:{
    ...mapGetters('cart',['cartItems','summary','totalAmount','coupon'])
  },
  methods: {
    signUpModal() {
      this.login = false;
      this.signup = true;
    },
    async applyCoupon(){
      if (!this.$auth.user) {
        this.openModal()
      }else {
        let aaa = [];
        if (process.client) {
          aaa = JSON.parse(localStorage.getItem('cartItems')) ?? [];
        }
        this.loader.isSubmitting = true
        let ids = aaa.map(item => item.id);
        let formItems = this.form;
        formItems = {...formItems, ids: ids};
        const formData = this.$generateFormData(formItems);

        await this.$axios.post(`/student/coupon/check/${this.c_coupon}`,formData)
          .then((response) => {
            let data = response.data;
            if (data.status) {
              localStorage.setItem('coupon',JSON.stringify(data))
              this.$toaster.success(response.data.text);
            } else {
              localStorage.removeItem('coupon')
              this.$toaster.error(response.data.text);
            }
          })
          .catch(() => {
            localStorage.removeItem('coupon')
            this.$toaster.error('Invalid request');
          }).finally(() => {
            this.loader.isSubmitting = false
            this.refreshCart()
          })
      }
    },
    removeItem(id) {
      let temp = JSON.parse(localStorage.getItem('cartItems'))
      let index = temp.findIndex(el => el.id === id)
      temp.splice(index, 1)
      localStorage.setItem('cartItems', JSON.stringify(temp))
      this.refreshCart()
    },
    emptyCart() {
       if (process.client) {
        localStorage.removeItem('cartItems');
        localStorage.removeItem('coupon');
       }
       this.refreshCart()
    },
    placeOrder() {
        if (!this.$auth.user) {
          this.openModal()
        }else {
          let aaa = [];
          if (process.client) {
            aaa = JSON.parse(localStorage.getItem('cartItems')) ?? [];
          }

          let items = this.cartItems;
          let ids = aaa.map(item => item.id);
          let formItems = this.form;
          formItems = {...formItems, ids: ids};
          const formData = this.$generateFormData(formItems);
          if (this.coupon.coupon) formData.append('coupon_id',this.coupon.coupon.id)
          this.$axios.post('/student/place-order', formData)
            .then((response) => {
              //this.emptyCart();
              this.$router.push(`/order/payment/${response.data.date.id}`)
            })
            .catch((error) => {
              this.$toaster.error(error.data.message);
            }).finally(() => {
            this.loader.isSubmitting = false
          })
        }
    },
    openModal(){
      this.$store.commit('user/basic/SET_LOGIN',true)
    },
    refreshCart(){
      this.$store.commit('cart/cartRefresh')
    }
  }
}
</script>

<style>

</style>
