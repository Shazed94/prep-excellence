<template>
  <v-card class="border">
    <span class="fp_label">Contact Us</span>
    <validation-observer ref="observer" v-slot="{ invalid }">
      <v-form ref="form" @submit.prevent="submitData()">
        <v-card-text class="mt-3">
          <v-container>
            <v-row dense>
              <v-col cols="12" md="6">
                <validation-provider
                  v-slot="{ errors }"
                  name="firstname"
                  vid="firstname"
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
                  name="lastname"
                  vid="lastname"
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
                  name="state"
                  vid="state"
                  rules="required"
                >
                  <v-text-field
                    v-model="form.state_or_region"
                    clearable
                    clear-icon="mdi-close-circle"
                    label="State/Region*"
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
                  name="country"
                  vid="country"
                  rules="required"
                >
                  <v-text-field
                    v-model="form.country"
                    clearable
                    clear-icon="mdi-close-circle"
                    label="Country*"
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
                  name="student grade"
                  vid="student grade"
                  rules="required"
                >
                  <v-text-field
                    v-model="form.student_grade"
                    clearable
                    clear-icon="mdi-close-circle"
                    label="Student Grade (2020-21)*"
                    :error-messages="errors"
                    dense
                    outlined
                    auto-grow
                    no-resize
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="12" md="12">
                <label>What do you need help with? *</label>
                <validation-provider
                  v-slot="{ errors }"
                  name="course"
                  vid="course"
                  rules="required"
                >
                  <v-checkbox v-for="(cc,index) in course_categories"
                    :key="index"
                    v-model="form.course"
                    :value="cc.id"
                    :label="cc.name"
                    :error-messages="errors"
                    color="indigo"
                    hide-details
                  ></v-checkbox>
                </validation-provider>
              </v-col>
              <!--                          <v-col cols="12" sm="12" md="12">
                                          <validation-provider
                                            v-slot="{ errors }"
                                            name="other"
                                            vid="other"
                                            rules=""
                                          >
                                            <v-text-field
                                              v-model="form.other"
                                              clearable
                                              clear-icon="mdi-close-circle"
                                              label="Other"
                                              :error-messages="errors"
                                              dense
                                              outlined
                                              auto-grow
                                              no-resize
                                            ></v-text-field>
                                          </validation-provider>
                                        </v-col>-->
              <v-col cols="12" md="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="days and time"
                  vid="days and time"
                  rules="required"
                >
                  <v-text-field
                    v-model="form.day_time"
                    clearable
                    clear-icon="mdi-close-circle"
                    label="What are the best days and time that we can call you? *"
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
<!--              <v-col cols="12" md="12"></v-col>
              <v-col cols="12" md="6">
                <validation-provider
                  v-slot="{ errors }"
                  name="captcha"
                  vid="captcha"
                  rules="required"
                >
                  <v-text-field
                    v-model="form.captcha"
                    label="Captcha"
                    :error-messages="errors"
                    dense
                    outlined
                    auto-grow
                    no-resize
                  ></v-text-field>
                </validation-provider>
              </v-col>-->
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
</template>

<script>
import VueTelInputVuetify from "vue-tel-input-vuetify/lib/vue-tel-input-vuetify.vue"
import {mapGetters} from "vuex";
export default {
  name: 'ContactForm',
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
        state_or_region: null,
        country: null,
        student_grade: null,
        course: [],
        other: null,
        day_time: null,
        message: null,
      },
    }
  },
  async mounted() {
    const payload1 = {apiUrl: '/public/course/categories', stateName:'course_categories'}
    if (!this.course_categories.length) await this.$store.dispatch('common/courseCategory/getItems', payload1)
    if (this.$auth.user){
      this.form.email = this.$auth.user.email
      this.form.first_name = this.$auth.user.first_name
      this.form.last_name = this.$auth.user.last_name
      this.form.phone_number = this.$auth.user.phone_number
    }
  },
  computed:{
    ...mapGetters('common/courseCategory',['course_categories']),
  },
  methods:{
    async submitData(){
      if (await this.$refs.observer.validate()){
        this.loader.isSubmitting = true
        const formData = this.$generateFormData(this.form, false,['course'])

        await this.$axios.post('/contact-form/submit', formData).then((response) => {
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
    clear() {
      this.$refs.form.reset()
      this.$refs.observer.reset()
    }
  },
}
</script>
