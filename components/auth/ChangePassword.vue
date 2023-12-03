<template>
  <validation-observer ref="observer" v-slot="{ invalid }">
    <v-form ref="form" @submit.prevent="updatePassword()">
      <v-card-text>
        <v-container>
          <div class="row">
            <div class="col-md-4">
              <validation-provider name="Old Password" rules="required|min:6|max:191" v-slot="{ errors }">
                <v-text-field
                    outlined
                    dense
                    :error-messages="errors"
                    :append-icon="password_show ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="password_show = !password_show"
                    :type="password_show ? 'text' : 'password'"
                    label="Old Password"
                    placeholder="Enter Old Password"
                    v-model="form.old_password">
                </v-text-field>
              </validation-provider>
            </div>
            <div class="col-md-4">
              <validation-provider name="New Password" rules="required|min:6|max:191" v-slot="{ errors }">
                <v-text-field
                    outlined
                    dense
                    :error-messages="errors"
                    :append-icon="password_show ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="password_show = !password_show"
                    :type="password_show ? 'text' : 'password'"
                    label="New Password"
                    placeholder="Enter New Password"
                    v-model="form.password">
                </v-text-field>
              </validation-provider>
            </div>
            <div class="col-md-4">
              <validation-provider name="Confirm Password" rules="required|min:6|max:191" v-slot="{errors }">
                <v-text-field
                    outlined
                    dense
                    :error="custom_valid_error"
                    :error-messages="errors"
                    :append-icon="password_show ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="password_show = !password_show"
                    :type="password_show ? 'text' : 'password'"
                    label="Confirm Password"
                    placeholder="Confirm Password"
                    v-model="form.password_confirmation">
                </v-text-field>
                <span class="text-danger" v-if="!errors[0] && custom_valid_error ">{{ custom_valid_error_message }}</span>
              </validation-provider>
            </div>
          </div>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="#031f46"
            class="mx-2 white--text"
            type="submit"
            :disabled="invalid"
            :loading="loader.isSubmitting"
            depressed
        >Update</v-btn>
      </v-card-actions>
    </v-form>
  </validation-observer>
</template>

<script>
import {common as commonMixin} from "@/mixins/common";
export default {
  name: 'ChangePassword',
  mixins: [commonMixin],
  data() {
    return {
      custom_valid_error:false,
      password_show:false,
      custom_valid_error_message:'Confirm password don\'t match',
      form: {
        old_password: null,
        password: null,
        password_confirmation: null,
      },
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
    }
  },
  watch:{
    'form.password_confirmation'(){
        this.custom_valid_error = !!(this.form.password_confirmation && this.form.password_confirmation.length &&
            this.form.password && this.form.password.length && this.form.password !== this.form.password_confirmation);
    },
    'form.password'(){
      this.custom_valid_error = !!(this.form.password_confirmation && this.form.password_confirmation.length &&
          this.form.password && this.form.password.length && this.form.password !== this.form.password_confirmation);
    }
  },
  methods: {
    async updatePassword() {
      this.loader.isSubmitting = true
      const formData = this.$generateFormData(this.form, false)
      let url = `/password/update`

      await this.$axios.post(url, formData).then((response) => {
        if (response.data.status ==='success') {
          this.$toaster.success(response.data.message);
          this.clear()
        }
        else this.$toaster.error(response.data.message);
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
    clear() {
      this.$refs.form.reset()
      this.$refs.observer.reset()
    }

  }
}
</script>
