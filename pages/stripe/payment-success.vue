<template>

  <div style="padding: 100px">
   <h3 style="text-align: center;"> Your order is processing, please wait a second...</h3>
  </div>

</template>

<script>

export default {
  auth: false,
  data() {
    return {
      //
    }
  },
  mounted() {
    this.placeOrder2();
  },

  methods: {
    placeOrder2() {
        let aaa = [];
        if (process.client) {
          aaa = JSON.parse(localStorage.getItem('cartItems')) ?? [];
        }

        let items = this.cartItems;
        let ids = aaa.map(item => item.id);
        let formItems = this.form;
        formItems = {...formItems, ids: ids};
        const formData = this.$generateFormData(formItems);

          this.$axios.post('/place-order2', formData)
          .then((response) => {
            //console.log(response.data);
            if (response.data && response.data.status == 'success') {
             this.emptyCart();
             this.$toaster.success(response.data.message);
             this.$router.push('/');
            } else {
              this.$toaster.error(response.data.message);
            }
          })
          .catch((error) => {
           // console.log(error);
            if (error.response && error.response.status === 422) {
              //
            }
          }).finally(() => {
            // this.loader.isSubmitting = false
          })
    },

    emptyCart() {
       if (process.client) {
        localStorage.clear();
       }
    },
  }
}
</script>

<style scoped>

</style>

