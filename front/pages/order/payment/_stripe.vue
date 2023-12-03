<template>
  <div>
    <!-- Breadcumb -->
    <bread-crumbs2 title="Order" image="/breadcrumb_testimonial.png" :items="[{title: 'Payment', link:'#', disabled:true}]"></bread-crumbs2>
    <!-- Breadcumb end -->
    <v-container fluid>
      <v-row no-gutters>
        <v-col md="7" offset-md="3">
          <v-card
            :loading="loader.isLoading"
            class="mx-auto my-3"
          >
            <template slot="progress">
              <v-progress-linear
                color="deep-purple"
                height="10"
                indeterminate
              ></v-progress-linear>
            </template>
            <v-card-title style="background: #0a53be;" class="text-white justify-center">Payment</v-card-title>
            <v-card-text class="p-4">
              <validation-observer ref="observer" v-slot="{ invalid }">
                <v-form ref="form" @submit.prevent="submit()">
                  <v-card-text>
                    <h6 class="justify-center text-center">Payment Amount: <b> $ {{ order.total }}</b></h6>
                    <v-container>
                      <v-row dense>
                        <v-col cols="12" md="12">
                          <validation-provider
                            v-slot="{ errors }"
                            name="name on card"
                            vid="name on card"
                            rules="required"
                          >
                            <v-text-field
                              label="Name on Card"
                              :error-messages="errors"
                              v-model="form.name"
                              outlined
                              dense
                            ></v-text-field>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" md="12">
                          <validation-provider
                            v-slot="{ errors }"
                            name="card no"
                            vid="card no"
                            rules="required|max:16"
                          >
                            <v-text-field
                              label="Card Number"
                              placeholder="you name"
                              type="number"
                              :error-messages="errors"
                              v-model.number="form.number"
                              outlined
                              dense
                            ></v-text-field>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" md="4">
                          <validation-provider
                            v-slot="{ errors }"
                            name="cvc"
                            vid="cvc"
                            rules="required|max:3"
                          >
                            <v-text-field
                              label="CVC"
                              type="number"
                              placeholder="123"
                              :error-messages="errors"
                              v-model.number="form.cvc"
                              outlined
                              dense
                            ></v-text-field>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" md="4">
                          <validation-provider
                            v-slot="{ errors }"
                            name="expiration month"
                            vid="expiration month"
                            rules="required|max:2"
                          >
                            <v-text-field
                              label="Expiration Month"
                              placeholder="MM"
                              type="number"
                              :error-messages="errors"
                              v-model.number="form.exp_month"
                              outlined
                              dense
                            ></v-text-field>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" md="4">
                          <validation-provider
                            v-slot="{ errors }"
                            name="expiration year"
                            vid="expiration year"
                            rules="required|max:4"
                          >
                            <v-text-field
                              label="Expiration Year"
                              placeholder="YYYY"
                              type="number"
                              :error-messages="errors"
                              v-model.number="form.exp_year"
                              outlined
                              dense
                            ></v-text-field>
                          </validation-provider>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="primary darken-1"
                      class="mx-2 white--text"
                      type="submit"
                      :loading="loader.isSubmitting"
                      depressed
                    >
                      {{ 'Submit' }}
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </validation-observer>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import {common as commonMixin} from "@/mixins/common";
import BreadCrumbs2 from "@/components/common/BreadCrumbs2.vue";
 export default {
    name:'StripPayment',
   components: {BreadCrumbs2},
    mixins: [commonMixin],
    auth:false,
    data() {
     return {
       pageInfo: {
         pageName: 'Payment',
         apiUrl: '/get/all/jobs',
       },
       loader: {isLoading: false, isSignInDisabled: false, isSubmitting: false, isDeleting: false},
       form: {
         name: '',
         number: '',
         exp_month: '',
         exp_year: '',
         cvc: '',
       },
       order:{}
     };
   },
    mounted() {
      this.validateOrder();
    },
    methods: {
      async validateOrder() {
        this.loader.isLoading=true
        await this.$axios.post(`/student/order/payment/validate/${this.$route.params.stripe}`)
          .then((response) => {
            this.order = response.data.data;
          })
          .catch((error) => {
            this.$toaster.success(error.response.data.message);
            this.$router.push('/');
          }).finally(() => {
            this.loader.isLoading = false
          })
      },
      async submit() {
        if (await this.$refs.observer.validate()) {
          this.loader.isSubmitting=true
          const formData = this.$generateFormData(this.form, false)
          await this.$axios.post(`/student/order/payment/strip/${this.$route.params.stripe}`,formData)
            .then((response) => {
              this.$toaster.success(response.data.message);
              this.$router.push('/stripe/success');
            })
            .catch((error) => {
              if (error.response.status === 422) {
                this.$refs.observer.setErrors(error?.response?.data?.errors)
                Object.keys(error.response.data.errors).map((field) => {
                  this.$toaster.error(error.response.data.errors[field][0]);
                });
              } else this.$toaster.error(error.response.data.message);
            }).finally(() => {
              this.loader.isSubmitting = false
            })
        }
      }
   },
 };
</script>
