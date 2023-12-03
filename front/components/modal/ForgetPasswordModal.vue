<template>
  <v-row justify="center">
    <v-dialog
      v-model="forget_password_modal"
      persistent
      max-width="500px"
    >
      <v-card class="text-center pa-1">
        <template  v-if="step===0">
          <v-card-title class="justify-center display-1 mb-2">{{ 'Forgot Password?' }}</v-card-title>
          <v-card-subtitle>
            {{ 'Enter your account email address and we will send you a verification code to reset your password.' }}
          </v-card-subtitle>
          <!-- reset form -->
          <v-card-text>
            <validation-observer ref="observer" v-slot="{ invalid }">
              <v-form ref="form" v-model="isFormValid" lazy-validation @submit.prevent="submit">
                <validation-provider
                  v-slot="{ errors }"
                  name="email"
                  vid="email"
                  rules="required|email"
                >
                  <v-text-field
                    v-model="email"
                    :error-messages="errors"
                    label="Email"
                    dense
                    clearable
                    hide-details="auto"
                    outlined
                  ></v-text-field>
                </validation-provider>
                <v-btn
                  style="margin-top: 15px;"
                  :disabled="invalid"
                  :loading="isLoading"
                  block
                  x-large
                  color="primary"
                  @click="submit"
                >{{ 'Request Password Reset' }}</v-btn>
              </v-form>
            </validation-observer>
          </v-card-text>
        </template>
        <template v-if="step===1">
          <v-card-title class="justify-center display-1 mb-2">{{ 'Please Enter OTP' }}</v-card-title>
          <!-- reset form -->
          <v-card-text>
            <validation-observer ref="observer2" v-slot="{ invalid }">
              <v-form ref="form2" v-model="isFormValid" lazy-validation @submit.prevent="submit">
                <validation-provider
                  v-slot="{ errors }"
                  name="otp"
                  vid="otp"
                  rules="max:6|required"
                >
                  <v-otp-input
                    v-model="token"
                    length="6"
                    type="number"
                    hide-details="auto"
                    outlined
                  ></v-otp-input>
                </validation-provider>
                <v-btn
                  style="margin-top: 15px;"
                  :disabled="invalid"
                  :loading="isLoading"
                  block
                  x-large
                  color="primary"
                  @click="verifyToken"
                >{{ 'Submit' }}</v-btn>
              </v-form>
            </validation-observer>
          </v-card-text>
        </template>
        <template v-if="step===2">
          <new-password :access_token="access_token" :access_name="access_name" @stepChange="stepChange()"></new-password>
        </template>

        <div class="text-center my-2">
          <a href="#" class="btn btn-secondary" @click="signInModal()" style="text-decoration: none;">
            {{ 'Back to Sign In' }}
          </a>
        </div>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import {common as commonMixin} from "@/mixins/common";
import {mapGetters} from "vuex";
import NewPassword from "@/components/auth/NewPassword";
export default {
  name:"ForgetPasswordModal",
  mixins: [commonMixin],
  components:{NewPassword},
  data() {
    return {
      // reset button
      isLoading: false,

      // form
      isFormValid: true,
      email: '',
      access_token:'',
      access_name:'',

      // form error
      error: false,
      errorMessages: '',
      step:0,
      token:null,

      // input rules
      rules: {
        required: (value) => (value && Boolean(value)) || 'Required'
      }
    }
  },
  mounted() {
    this.step = 0
  },
  computed:{
    ...mapGetters('user/basic',['login_modal','signup_modal','forget_password_modal'])
  },
  methods:{
    signInModal(){
      //console.log('working')
      this.stepChange()
      this.$store.commit('user/basic/SET_LOGIN',true)
    },
    submit(e) {
      if (this.$refs.form.validate()) {
        this.isLoading=true
        this.$axios
          .get(`/forgot-password/${this.email}`)
          .then((response) => {
            if (response.data.status == 'success') {
              this.$toaster.success(response.data.data);
              this.step=1
            } else {
              this.$toaster.error(response.data.data);
            }
          })
          .catch((error) => {
            this.$toaster.error(error.response.data.message);
          }).finally(()=>{
            this.isLoading=false
        })
      }
    },
    verifyToken(e) {
      if (this.$refs.form2.validate()) {
        this.isLoading=true
        let data = new FormData();
        data.append('email',this.email)
        data.append('token',this.token)
        this.$axios
          .post(`/forgot-password/verify/token`,data)
          .then((response) => {
            if (response.data.status == 'success') {
              //this.$toaster.success(response.data.data);
              let dd = response.data.data
              this.access_token = dd.token;
              this.access_name = dd.name;
              this.step=2
            } else {
              this.$toaster.error(response.data.data);
            }
          }).catch((error) => {
            if (error.response.status === 422) {
              this.$refs.observer.setErrors(error?.response?.data?.errors)
              Object.keys(error.response.data.errors).map((field) => {
                this.$toaster.error(error.response.data.errors[field][0]);
              });
            } else this.$toaster.error(error.response.data.message);
          }).finally(()=>{
            this.isLoading=false
        })
      }
    },
    resetErrors() {
      this.error = false
      this.errorMessages = ''
    },
    stepChange(){
      this.step = 0
      this.isFormValid = true
      this.email= null
      this.access_token = null
      this.access_name = null

          // form error
      this.error = false
      this.errorMessages = ''
      this.token =null
    }
  }
}
</script>
