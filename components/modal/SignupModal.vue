<template>
  <v-row justify="center">
    <v-dialog
      v-model="signup_modal"
      persistent
      max-width="500px"
    >
      <v-card class="login_form">
        <v-card-title>
          <span class="text-h5">Sign Up</span>
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
          <v-form ref="form" @submit.prevent="signUp()">
          <v-card-text>
            <v-container>
              <v-row>
                <v-col
                  cols="12"
                >
                  <validation-provider
                    v-slot="{ errors }"
                    name="first name"
                    vid="first name"
                    rules="required|max:191"
                  >
                    <v-text-field
                      v-model="form.first_name"
                      label="first name*"
                      :error-messages="errors"
                      dense
                      outlined
                    ></v-text-field>
                  </validation-provider>
                </v-col>

                <v-col
                  cols="12"
                >
                  <validation-provider
                    v-slot="{ errors }"
                    name="last name"
                    vid="last name"
                    rules="required|max:191"
                  >
                  <v-text-field
                    v-model="form.last_name"
                    label="last name*"
                    :error-messages="errors"
                    dense
                    outlined
                  ></v-text-field>
                  </validation-provider>
                </v-col>
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="email"
                    vid="email"
                    rules="required|email|max:60"
                  >
                    <v-text-field
                      v-model="form.email"
                      label="Email*"
                      :error-messages="errors"
                      dense
                      outlined
                    ></v-text-field>
                  </validation-provider>
                </v-col>
                <v-col cols="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="password"
                    vid="password"
                    rules="required|min:6|max:191"
                  >
                    <v-text-field
                      v-model="form.password"
                      :append-icon="password ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="password ? 'text' : 'password'"
                      name="password"
                      label="Password*"
                      :error-messages="errors"
                      dense
                      class="input-group--focused"
                      @click:append="password = !password"
                      outlined
                    ></v-text-field>
                  </validation-provider>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <small>*indicates required field</small>
            <v-spacer></v-spacer>

            <!-- <v-btn
                        class="signup-menu"
                        dark
                        @click="signup = true"
                      >
                        Sign Up
                      </v-btn> -->

            <v-btn color="login-menu"
                   dark
                   type="submit">
              Sign Up
            </v-btn>

          </v-card-actions>
          </v-form>
        </validation-observer>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import {common as commonMixin} from "@/mixins/common";
import {mapGetters} from "vuex";
export default {
  name:"SingupModal",
  mixins: [commonMixin],
  data() {
    return {
      password: false,
      loader: {isLoading: false, isSignInDisabled: false, isSubmitting: false, isDeleting: false},
      form: {
        first_name: '',
        last_name: '',
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
    async signUp() {
      if (await this.$refs.observer.validate()) {
        this.loader.isSubmitting = true
        const formData = this.$generateFormData(this.form)

        await this.$axios.post('/register/', formData).then((response) => {
          if (response.data && response.data.status === 'success') {
            this.$toaster.success(`Email verification link sent to your email!!`)
            this.closeModal()
          }
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
    closeModal(){
      this.form= {
        first_name: '',
        last_name: '',
        email: '',
        password: '',
      }
      this.$store.commit('user/basic/SET_SIGNUP',false)
    }
  }
}
</script>
