<template>
  <v-card class="pa-2">
    <v-card-title class="justify-center display-1 mb-2">Set new password</v-card-title>
    <v-card-text>
      <validation-observer ref="observer" v-slot="{ invalid }">
        <v-form ref="form" @submit.prevent="submitData()">
          <v-row dense>
            <v-col cols="12" xs="12" sm="12">
              <validation-provider
                v-slot="{ errors }"
                name="password"
                vid="password"
                rules="required|min:6"
              >
                <v-text-field
                  v-model="form.password"
                  :error-messages="errors"
                  label="Password"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  @click:append="showPassword = !showPassword"
                  dense
                  clearable
                  hide-details="auto"
                  outlined></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="12" xs="12" sm="12">
              <validation-provider
                v-slot="{ errors }"
                name="confirm password"
                vid="confirm password"
                rules="required|min:6"
              >
                <v-text-field
                  v-model="form.password_confirmation"
                  :error-messages="errors"
                  label="Confirm Password"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPassword ? 'text' : 'password'"
                  @click:append="showPassword = !showPassword"
                  dense
                  clearable
                  hide-details="auto"
                  outlined></v-text-field>
              </validation-provider>
            </v-col>
          </v-row>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              class="mx-2 white--text"
              type="submit"
              :disabled="invalid"
              :loading="loader.isSubmitting"
              depressed
            >
              {{ 'Save' }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </validation-observer>
    </v-card-text>
  </v-card>
</template>

<script>

export default {
  name:'NewPasswordPage',
  props:{
    access_token:{
      type:String,
    },
    access_name:{
      type:String,
    },
  },
  data() {
    return {
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      form: {
        password: '',
        password_confirmation: '',
      },
      showPassword:false,
    }
  },
  methods: {
    signInModal(){
      this.$emit('stepChange')
      this.$store.commit('user/basic/SET_LOGIN',true)
    },
    submitData() {
      this.loader.isLoading = true
      const formData = this.$generateFormData(this.form)
      formData.append('name',this.access_name)
      formData.append('token',this.access_token)
      this.$axios
        .post(`/reset-password/`, formData)
        .then((response) => {
          this.loader.isLoading = false
          this.$toaster.success(response.data.message);
          this.$emit('stepChange')
          this.signInModal()
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
    },
  }
}
</script>
