
<template>
<form action="/charge" method="post" id="payment-form">
  <div class="form-row">
    <label for="card-element">
      Credit or debit card
    </label>
    <div id="card-element">
      <!-- A Stripe Element will be inserted here. -->
    </div>

    <!-- Used to display Element errors. -->
    <div id="card-errors" role="alert"></div>
  </div>

  <button @click.prevent="pay">Submit Payment</button>
</form>
</template>
 <script src="https://js.stripe.com/v3/"></script>
<script>

export default {
  data() {
    return {
        cardfd: {
        cvc: '',
        number: '',
        expiry: ''
      },
      //elements
      cardNumber: '',
      cardExpiry: '',
      cardCvc: '',
      stripe: null,
      // errors
      stripeError: '',
      cardCvcError: '',
      cardExpiryError: '',
      cardNumberError: '',
      stripe: '',
      card: ''
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (window.Stripe === undefined) {
         alert('Stripe V3 library not loaded!');
       }

      var publishKey = 'pk_test_51Iuv9ZLWLGMBkEKgUCQMXZNgDB8zKn9LYuRcygmXwoDslS895XVjQyQBU4MdUa556UMvqOQNOfbqqTPahecFRoXx000rLKcPKr';

        var stripe = Stripe(publishKey);
        var elements = stripe.elements();

        var style = {
            base: {
                color: "#EF7922",
            }
        };

        var card = elements.create("card", {
            style: style
        });
        card.mount("#card-element");

        this.stripe = stripe;
        this.card = card;

//         var form = document.getElementById('payment-form');

//         form.addEventListener('submit', function(event) {
//         event.preventDefault();

//         stripe.createToken(card).then(function(result) {
//           if (result.error) {
//             // Inform the customer that there was an error.
//             var errorElement = document.getElementById('card-errors');
//             errorElement.textContent = result.error.message;
//           } else {
//             // Send the token to your server.
//             stripeTokenHandler(result.token);
//           }
//         });
// });
    },

    pay() {

        this.stripe.createToken(this.card).then(function(result) {
          if (result.error) {
            console.log(result.error);
            // Inform the customer that there was an error.
            var errorElement = document.getElementById('card-errors');
            errorElement.textContent = result.error.message;
          } else {
            console.log(result.token);
            return;
            // Send the token to your server.
            stripeTokenHandler(result.token);
          }
        });

    }
  }
}
</script>
