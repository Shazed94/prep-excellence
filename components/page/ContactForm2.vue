<template>
  <section>
    <div class="instructor-title our-instructor-bg">
      <h2 class=""></h2>
    </div>
    <v-container fluid>
      <v-row no-gutters>
        <v-col cols="12" md="6" offset-md="1">
          <v-card class="border">
            <span class="fp_label">Contact Us</span>
            <validation-observer ref="observer" v-slot="{ invalid }">
              <v-form ref="form" @submit.prevent="submitData()">
                <v-card-text class="mt-5">
                  <v-container>
                    <v-row dense>
                      <v-col cols="12" md="6">
                        <validation-provider
                          v-slot="{ errors }"
                          name="first name"
                          vid="first name"
                          rules="required"
                        >
                          <v-text-field
                            v-model="form.first_name"
                            clearable
                            clear-icon="mdi-close-circle"
                            label="First Name*"
                            :error-messages="errors"
                            dense
                            outlined
                            auto-grow
                            no-resize
                          ></v-text-field>
                        </validation-provider>
                      </v-col>
                      <v-col cols="12" md="6">
                        <validation-provider
                          v-slot="{ errors }"
                          name="last name"
                          vid="last name"
                          rules="required"
                        >
                          <v-text-field
                            v-model="form.last_name"
                            clearable
                            clear-icon="mdi-close-circle"
                            label="Last Name*"
                            :error-messages="errors"
                            dense
                            outlined
                            auto-grow
                            no-resize
                          ></v-text-field>
                        </validation-provider>
                      </v-col>
                      <v-col cols="12" md="6">
                        <validation-provider
                          v-slot="{ errors }"
                          name="email"
                          vid="email"
                          rules="required|email"
                        >
                          <v-text-field
                            v-model="form.email"
                            clearable
                            clear-icon="mdi-close-circle"
                            label="Email*"
                            :error-messages="errors"
                            dense
                            outlined
                            auto-grow
                            no-resize
                          ></v-text-field>
                        </validation-provider>
                      </v-col>
                      <v-col cols="12" md="6">
                        <validation-provider
                          v-slot="{ errors }"
                          name="phone number"
                          vid="phone number"
                          rules="required"
                        >
                          <vue-tel-input-vuetify
                            v-model="form.phone_number"
                            label="Phone Number*"
                            v-bind="bindProps"
                            :error-messages="errors"
                            dense
                            outlined
                            auto-grow
                            no-resize
                          ></vue-tel-input-vuetify>
                        </validation-provider>
                      </v-col>
                      <v-col cols="12" md="12">
                        <validation-provider
                          v-slot="{ errors }"
                          name="subject"
                          vid="subject"
                          rules="required"
                        >
                          <v-text-field
                            v-model="form.subject"
                            label="Subject*"
                            :error-messages="errors"
                            dense
                            outlined
                            auto-grow
                            no-resize
                          ></v-text-field>
                        </validation-provider>
                      </v-col>
                      <v-col cols="12" md="12">
                        <validation-provider
                          v-slot="{ errors }"
                          name="message"
                          vid="message"
                          rules="required"
                        >
                          <v-textarea
                            v-model="form.message"
                            clearable
                            clear-icon="mdi-close-circle"
                            label="How may we help you? *"
                            :error-messages="errors"
                            dense
                            outlined
                            auto-grow
                            no-resize
                          ></v-textarea>
                        </validation-provider>
                      </v-col>
                      <v-col cols="12" md="6">
                        <validation-provider
                          v-slot="{ errors }"
                          name="captcha"
                          vid="captcha"
                          rules=""
                        >
                          <recaptcha />
                        </validation-provider>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    color="primary"
                    class="mx-2 ml-4 mb-3 white--text"
                    type="submit"
                    :loading="loader.isSubmitting"
                    depressed
                  >
                    {{ 'Submit' }}
                  </v-btn>
                </v-card-actions>
              </v-form>
            </validation-observer>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script>
import VueTelInputVuetify from "vue-tel-input-vuetify/lib/vue-tel-input-vuetify.vue"
import {mapGetters} from "vuex";
export default {
  name: 'ContactForm2',
  auth:false,
  components:{VueTelInputVuetify},
  data(){
    return{
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      bindProps:{
        mode: 'international'
      },
      captcha: null,
      form: {
        first_name: null,
        last_name: null,
        email: null,
        phone_number: null,
        subject: null,
        message: null,
      },
    }
  },
  async mounted() {
    //await this.getCaptcha()
    if (this.$auth.user){
      this.form.email = this.$auth.user.email
      this.form.first_name = this.$auth.user.first_name
      this.form.last_name = this.$auth.user.last_name
      this.form.phone_number = this.$auth.user.phone_number
    }
  },
  methods:{
    async submitData(){
      if (await this.$refs.observer.validate()) {
        const token = await this.$recaptcha.getResponse()
        console.log('ReCaptcha token:', token)

        // send token to server alongside your form data

        // at the end you need to reset recaptcha
        await this.$recaptcha.reset()

        this.loader.isSubmitting = true
        const formData = this.$generateFormData(this.form, false, ['course'])

        await this.$axios.post('/contact-form2/submit', formData).then((response) => {
          this.$toaster.success(response.data.message)
          this.clear()
        }).catch((error) => {
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
    },
    async getCaptcha(){
      await this.$axios.get('/captcha').then((response)=>{
        this.captcha = response.data
      }).catch(()=>{
        //
      })
    },
    clear() {
      this.$refs.form.reset()
      this.$refs.observer.reset()
    }
  }
}
</script>

