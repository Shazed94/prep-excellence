<template>
  <v-row justify="center">
    <v-dialog
      v-model="login_modal"
      persistent
      max-width="500px"
    >
      <v-card class="login_form">
        <v-card-title>
          <span class="card-header text-center text-h5">Login</span>

          <v-card-actions class="close_button">
            <v-btn
              color="error"
              outlined
              @click="closeModal()"
            >
              <v-icon>mdi-window-close</v-icon>
            </v-btn>
          </v-card-actions>

        </v-card-title>
        <validation-observer ref="observer" v-slot="{ invalid }">
          <v-form ref="form" @submit.prevent="submit()">
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <validation-provider
                      v-slot="{ errors }"
                      name="email"
                      vid="email"
                      rules="required|email"
                    >
                      <v-text-field
                        label="Email*"
                        value="Email Address"
                        :error-messages="errors"
                        v-model="form.email"
                        outlined
                      ></v-text-field>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12">

                    <validation-provider
                      v-slot="{ errors }"
                      name="password"
                      vid="password"
                      rules="required"
                    >
                      <v-text-field
                        v-model="form.password"
                        :append-icon="password ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="password ? 'text' : 'password'"
                        :error-messages="errors"
                        name="password"
                        label="Password*"
                        class="input-group--focused"
                        @click:append="password = !password"
                        outlined
                      ></v-text-field>

                    </validation-provider>
                  </v-col>
                </v-row>
              </v-container>
              <small>*indicates required field</small>
            </v-card-text>
          </v-form>
          <v-card-actions>
            <v-btn @click="signUpModal" color="login-menu" dark>
              Sign Up
            </v-btn>
            <v-btn color="login-menu" @click="forgetModal" dark>
              Forgot password?
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn @click="submit"
                   :loading="loader.isSubmitting"
                    color="login-menu" dark>
              <font-awesome-icon class="pr-1" :icon="['fa', 'key']"/>
              <!-- <v-icon left>lock</v-icon> -->
              Login
            </v-btn>
          </v-card-actions>
        </validation-observer>
      </v-card>
    </v-dialog>
  </v-row>

</template>

<script>
import {common as commonMixin} from "@/mixins/common";
import {mapGetters} from "vuex";
export default {
  name: 'LoginModal',
  mixins: [commonMixin],
  data() {
    return {
      password: false,
      loader: {isLoading: false, isSignInDisabled: false, isSubmitting: false, isDeleting: false},
      form: {
        email: '',
        password: '',
      },
    }
  },
  mounted() {
    //console.log('Hello');
  },
  computed:{
    ...mapGetters('user/basic',['login_modal','signup_modal'])
  },
  methods:{
    signUpModal(){
      this.$store.commit('user/basic/SET_SIGNUP',true)
    },
    forgetModal(){
      this.$store.commit('user/basic/SET_FORGET',true)
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.loader.isLoading = true
        this.loader.isSignInDisabled = true
        this.signIn()
      }
    },
    async signIn() {
      if (await this.$refs.observer.validate()) {
        const formData = new FormData()
        formData.append('email', this.form.email)
        formData.append('password', this.form.password)

        await this.$auth.loginWith('auth', {data: formData})
          .then((response) => {
            const data = response?.data
            if (data) {
              this.$axios.setHeader('Authorization', 'Bearer ' + data.access_token)
              this.$axios.setToken(data.access_token)
              this.$auth.setUserToken(data.access_token)
              this.$auth.setUser(data.user)
              //this.$ability.update(data.user.ability)
              this.closeModal()
              if (data.role_id == 3 && data.userable){
                if (!data.userable.date_of_birth) this.$router.push('/form');
              }
              this.$router.push('/user-dashboard');
            }
          })
          .catch((error) => {
            if (error.response.status === 422) {
              this.$refs.observer.setErrors(error?.response?.data?.errors)
              Object.keys(error.response.data.errors).map((field) => {
                this.$toaster.error(error.response.data.errors[field][0]);
              });
            } else this.$toaster.error(error.response.data.message);
          })
          .finally(() => {
            this.loader.isLoading = false
            this.loader.isSignInDisabled = false
          })
      }
    },
    closeModal(){
      this.$store.commit('user/basic/SET_LOGIN',false)
    }
  }
}
</script>

<style scoped>

</style>
