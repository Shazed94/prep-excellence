<template>
  <v-card class="my-2">
    <v-card-title>User Information</v-card-title>
    <v-card-text>
      <validation-observer ref="observer" v-slot="{ invalid }">
        <v-form ref="form" @submit.prevent="update">
          <v-row>
            <v-col cols="12" md="6">
              <validation-provider
                v-slot="{ errors }"
                name="Name"
                rules="required|max:191"
                vid="name"
              >
                <v-text-field
                  disabled
                  v-model="user.name"
                  :error-messages="errors"
                  required
                  outlined
                  dense
                  label="Name"
                ></v-text-field>
              </validation-provider>
              <validation-provider
                v-slot="{ errors }"
                name="Email"
                rules="required|email"
                vid="email"
              >
                <v-text-field
                  disabled
                  v-model="user.email"
                  type="email"
                  :error-messages="errors"
                  required
                  outlined
                  dense
                  label="Email"
                ></v-text-field>
              </validation-provider>
            </v-col>


            <v-col cols="12" md="6">
              <validation-provider
                v-slot="{ errors }"
                name="Phone"
                rules="digits:11"
                vid="phone"
              >
                <v-text-field
                  disabled
                  v-model="user.phone_number"
                  type="number"
                  :error-messages="errors"
                  required
                  outlined
                  dense
                  label="Phone"
                ></v-text-field>
              </validation-provider>
              <validation-provider
                v-slot="{ errors }"
                name="Address"
                rules=""
                vid="address"
              >
              <v-text-field
                disabled
                v-model="user.address"
                :error-messages="errors"
                required
                outlined
                dense
                label="Address"
              ></v-text-field>
              </validation-provider>
            </v-col>
          </v-row>

          <div class="d-flex">
            <v-spacer></v-spacer>
            <v-btn type="submit" color="primary" :loading="isLoading" disabled>Update</v-btn>
          </div>
        </v-form>
      </validation-observer>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    user: {type: Object, required: true}
  },
  data: () => ({
    date: '1990-10-09',
    menu: false,
    gender: 'male',
    isLoading: false,
  }),
  watch: {
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    }
  },
  methods: {
    async update() {
      this.isLoading = true;
      const formData = new FormData()
      formData.append('_method', 'PUT')
      formData.append('name', this.user.name)
      formData.append('email', this.user.email)
      formData.append('phone', this.user.phone ? this.user.phone : '')
      formData.append('address', this.user.address ? this.user.address : '')
      await this.$axios.post(`user/${this.$auth.user.id}`, formData).then(response => {
        this.$toaster.success('Updated successfully!!')
        this.$emit('update')
      }).catch((error) => {
        this.$refs.observer.setErrors(error.response.data)
        this.$toaster.error('Something went wrong!!')
      }).finally(() => this.isLoading = false)
    }
  }
}
</script>
