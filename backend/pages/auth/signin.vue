<template>
  <div>
    <v-card class="text-center pa-1">
      <v-card-title class="justify-center display-2 mb-2" style="font-size: 24px!important; font-weight: 500;">Welcome to Prep-Excellence</v-card-title>
      <v-card-subtitle>Sign in to your account</v-card-subtitle>

      <!-- sign in form -->
      <v-card-text>
        <validation-observer ref="observer" v-slot="{ invalid, validate }">
          <v-form ref="form" @submit.prevent="submit()" lazy-validation>
            <validation-provider
              v-slot="{ errors }"
              name="email"
              vid="email"
              rules="required|email"
            >
              <v-text-field
                v-model="form.email"
                :validate-on-blur="false"
                :error="error"
                :label="$t('login.email')"
                :error-messages="errors"
                name="email"
                outlined
                @keyup.enter="submit"
              />
            </validation-provider>

            <validation-provider
              v-slot="{ errors }"
              name="password"
              vid="password"
              rules="required"
            >
              <v-text-field
                v-model="form.password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required]"
                :type="showPassword ? 'text' : 'password'"
                :error="error"
                :error-messages="errors"
                :label="$t('login.password')"
                name="password"
                outlined
                @keyup.enter="submit"
                @click:append="showPassword = !showPassword"
              />
            </validation-provider>

            <v-btn
              :loading="isLoading"
              :disabled="isSignInDisabled"
              block
              x-large
              color="primary"
              @click="submit"
            >{{ $t('login.button') }}
            </v-btn>
            <div v-if="errorProvider" class="error--text">{{ errorProviderMessages }}</div>

            <div class="mt-5">
              <router-link to="/auth/forgot-password">
                {{ $t('login.forgot') }}
              </router-link>
            </div>
          </v-form>
        </validation-observer>
      </v-card-text>
    </v-card>

  </div>
</template>

<script>
export default {
  layout: 'auth',
  mounted() {
    /*this.$echo.channel('admin-notification')
      .listen('AdminNotificationEvent', (e) => {
        console.log(e);
      });*/
    //console.log('working');
    window.Echo.channel('admin.notification')
      .listen('AdminNotificationEvent', (e) => {
        console.log(e);
      });
    /*
    console.log('working2');*/
    /*this.$echo.channel('admin.notification')
      .listen('AdminNotificationEvent', e => {
        console.log("GENERAL EVENT: ", e);
      })
      .notification(notification => {
        console.log("NOTIFICATION: ", notification);
      });

    this.$echo.channel('user-channel-1')
      .listen('UserNotifyEvent', e => {
        console.log("GENERAL EVENT: ", e);
      })
      .notification(notification => {
        console.log("NOTIFICATION: ", notification);
      });*/
  },
  data() {
    return {
      // sign in buttons
      isLoading: false,
      isSignInDisabled: false,

      // form
      form: {
        email: '',
        password: '',
      },

      // form error
      error: false,
      errorMessages: '',

      errorProvider: false,
      errorProviderMessages: '',

      // show password field
      showPassword: false,

      providers: [{
        id: 'google',
        label: 'Google',
        isLoading: false
      }, {
        id: 'facebook',
        label: 'Facebook',
        isLoading: false
      }],

      // input rules
      rules: {
        required: (value) => (value && Boolean(value)) || 'Required'
      }
    }
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.isLoading = true
        this.isSignInDisabled = true
        this.signIn()
      }
    },
    signIn() {
      const formData = new FormData()

      formData.append('email', this.form.email)
      formData.append('password', this.form.password)

      this.$auth.loginWith('auth', {data: formData})
        .then((response) => {
          const data = response?.data

          if (data) {
            this.$axios.setHeader('Authorization', 'Bearer ' + data.access_token)
            this.$axios.setToken(data.access_token)
            this.$auth.setUserToken(data.access_token)
            this.$auth.setUser(data.user)
            //window.setAuthToken = (token) => {
              window.Echo.options.auth.headers.Authorization = 'Bearer ' + data.access_token;
            //}
            //this.$ability.update(data.user.ability)
            this.$router.push('/dashboard')
          }
        })
        .catch((error) => {
          if (error.response.status === 422) {
            this.$refs.observer.setErrors(error?.response?.data?.errors)
            Object.keys(error.response.data.errors).map((field) => {
              this.$toaster.error(error.response.data.errors[field][0]);
            });
          }else if (error.response.status === 403) {
            this.$toaster.error('Invalid credential')
          } else this.$toaster.error(error.response.data.message);
        })
        .finally(() => {
          this.isLoading = false
          this.isSignInDisabled = false
        })
    },
    signInProvider(provider) {
    },
    resetErrors() {
      this.error = false
      this.errorMessages = ''

      this.errorProvider = false
      this.errorProviderMessages = ''
    }
  }
}
</script>
