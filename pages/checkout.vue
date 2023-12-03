<template>
  <div>
    <!-- Breadcumb -->
    <bread-crumbs2 title="Testimonial" image="/breadcrumb_testimonial.png" :items="[{title: 'Testimonials', link:'#', disabled:true}]"></bread-crumbs2>

    <!-- Breadcumb end -->

    <div class="cart-section">
        <div class="btcontainer">
          <div class="btrow">
            <div class="btcol-lg-6">
              <h3>Billing Details</h3>
            </div>
            <div class="btcol-lg-6">
              <h3>Your Order</h3>
              <div class="cart-collaterals__item">

                  <div class="cart-collaterals__box">
                      <table class="cart-collaterals__table">
                          <tbody>
                              <template v-if="cartItems && cartItems.length > 0" style="margin-bottom: 100px!important;">
                                <tr v-for="cartItem in cartItems" :key="cartItem.id">
                                  <th>{{ cartItem.name }}  × 1</th>
                                    <td>
                                        <span class="subtotal-price">${{ cartItem.amount }}<span class="separator"></span></span>
                                    </td>
                                </tr>
                              </template>

                              <tr class="cart-subtotal">
                                  <th>Subtotal</th>
                                  <td>
                                      <span class="subtotal-price">${{ total }}<span class="separator"></span></span>
                                  </td>
                              </tr>
                              <!-- <tr class="cart-shipping">
                                  <th>Shipping</th>
                                  <td>Free shipping <span class="shipping-fee">$5<span class="separator">.00</span></span></td>
                              </tr> -->
                              <tr class="order-total">
                                  <th>Total</th>
                                  <td>
                                      <span class="total-price">${{ total }}<span class="separator"></span></span>
                                  </td>
                              </tr>
                          </tbody>
                      </table>
                      <p style="margin: 20px 0;">Payment Details</p>
                      <!-- <form action="/charge" method="post" id="payment-form"> -->
                        <div class="form-row">
                          <label for="card-element">
                            Credit or debit card
                          </label>
                          <div id="card-element" style="margin-top: 10px;">
                            <!-- A Stripe Element will be inserted here. -->
                          </div>

                          <!-- Used to display Element errors. -->
                          <div id="card-errors" role="alert"></div>
                        </div>

                        <!-- <button @click.prevent="pay">Submit Payment</button> -->
                      <!-- </form> -->
                      <!-- <div class="form-group" style="margin-bottom: 10px;">
                        <label>Name on card</label>
                        <input v-model="form.card_name" type="text" placeholder="John Smith" class="form-control">
                      </div>
                      <div class="form-group" style="margin-bottom: 10px;">
                        <label>Card Number</label>
                        <input v-model="form.number" size='20' maxlength="16" placeholder="0000 0000 0000 0000" type="number" class="form-control">
                      </div>

                      <div class="btrow" style="margin-bottom: 10px;">
                        <div class="btcol-lg-6">
                           <div class="form-group">
                            <label>Expiration Month</label>
                            <input v-model="form.exp_month" placeholder='MM' size='2' maxlength="2" type='number' class="form-control">
                          </div>
                        </div>

                        <div class="btcol-lg-6">
                           <div class="form-group">
                            <label>Expiration Year</label>
                            <input v-model="form.exp_year" placeholder='YYYY' maxlength="4" size='4' type='number' class="form-control">
                          </div>
                        </div>
                      </div>

                      <div class="form-group">
                      <label>CVC</label>
                      <input v-model="form.cvc" maxlength="3" placeholder='e.g 595' size='4' type='number' class="form-control">
                    </div> -->


                      <div class="cart-collaterals__btn" style="margin-top: 30px;">
                          <button @click.prevent="placeOrder" style="padding: 12px 0;" class="btn btn-primary btn-hover-secondary w-100 text-white">Place Order</button>
                      </div>
                  </div>

              </div>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>
<script src="https://js.stripe.com/v3/"></script>
<script>
import BreadCrumbs2 from "@/components/common/BreadCrumbs2.vue";

export default {
  auth: false,
  components: {BreadCrumbs2},
  data() {
    return {
      form: {
        card_name: '',
        number: '',
        exp_month: '',
        exp_year: '',
        cvc: '',
      },
      cartItems: [],
      total: 0,
      stripe: '',
      card: '',
      token: null
    }
  },
  mounted() {
    this.getCartItems();
    this.init();
  },
  methods: {
    init() {
      // if (window.Stripe === undefined) {
      //    alert('Stripe V3 library not loaded!');
      //  }

      // var publishKey = 'pk_test_51IY8vtFWI3CsOsRtsoXUf1dx4tm3OEfSJuurkbGX6Nai3xvd48HBaf57x83VYF2N9fwO14pJLK4gJtIQaH9UAhOi00kzYa1SMi';

      //   var stripe = Stripe(publishKey);
      //   var elements = stripe.elements();

      //   var style = {
      //       base: {
      //           color: "#EF7922",
      //       }
      //   };

      //   var card = elements.create("card", {
      //       style: style
      //   });
      //   card.mount("#card-element");

      //   this.stripe = stripe;
      //   this.card = card;
    },

   placeOrder() {
        if (!this.$auth.user) {
          this.$toaster.error('Please login to purchase.');
        }
        this.stripe.createToken(this.card).then( result => {
          if (result.error) {
            console.log(result.error);
            // Inform the customer that there was an error.
            var errorElement = document.getElementById('card-errors');
            errorElement.textContent = result.error.message;
          } else {
            let aaa = [];
            if (process.client) {
              aaa = JSON.parse(localStorage.getItem('cartItems')) ?? [];
            }

            console.log(result.token.id);
            // let items = this.cartItems;
            let ids = aaa.map(item => item.id);
            let formItems = this.form;
            formItems = {...formItems, ids: ids, token: result.token.id};
            const formData = this.$generateFormData(formItems);

              this.$axios.post('place-order', formData)
              .then((response) => {
               console.log(response.data);
                if (response.data && response.data.status == 'success') {
                  this.emptyCart();
                  this.$router.push('/');
                  this.$toaster.success(response.data.message);
                } else {
                  this.$toaster.error(response.data.message);
                }
              })
              .catch((error) => {
                console.log(error);
                if (error.response && error.response.status === 422) {
                  //
                }
              }).finally(() => {
                // this.loader.isSubmitting = false
              })
          }
      });
    },

    getCartItems() {
      if (process.client) {
        this.cartItems = JSON.parse(localStorage.getItem('cartItems')) ?? [];
        this.total = this.cartItems.reduce((temp, el) => {
                      return temp + el.amount;
                    }, 0);
      }
    },

    // removeItem(id) {
    //   let temp = JSON.parse(localStorage.getItem('cartItems'));
    //   let index = temp.findIndex(el => el.id === id);
    //   temp.splice(index, 1);

    //   localStorage.setItem('cartItems', JSON.stringify(temp));
    //   alert('Item removed successfully!');
    //   window.location.reload();
    // },
    emptyCart() {
       if (process.client) {
        localStorage.clear();
        //alert('All items removed successfully!');
        //window.location.reload();
       }
    }
  }
}
</script>

<style>

</style>
