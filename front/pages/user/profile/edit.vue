<template>
  <div class="user-dashboard-area">
    <div class="btcontainer">
      <div class="up_wrap">
        <div class="btrow">
          <sidebar class="mt-3"/>
          <!-- main content -->
          <div class="btcol-md-6 btcol-lg-9">
            <div class="up_content_wrap">
              <v-container fluid>
                <div class="row">
                  <div class="col-md-9">
                    <v-card class="profile_info_edit">
                      <v-card-title class="primary_header fs-4">Edit Profile
                      </v-card-title>
                      <validation-observer ref="observer" v-slot="{ invalid }">
                        <v-form ref="form" @submit.prevent="submitData()">
                          <v-card-text class="profile_edit_form">
                            <div class="row gx-3 mb-3">
                              <div class="col-md-6">
                                <validation-provider v-slot="{ errors }" name="First Name*" vid="first_name" rules="required|max:191">
                                  <v-text-field v-model="form.first_name" :error-messages="errors" label="First Name*" required dense
                                                hide-details="auto" outlined>
                                  </v-text-field>
                                </validation-provider>
                              </div>
                              <div class="col-md-6">
                                <validation-provider v-slot="{ errors }" name="Last Name" vid="last_name" rules="required|max:191">
                                  <v-text-field v-model="form.last_name" :error-messages="errors" label="Last Name*" required dense
                                                hide-details="auto" outlined>
                                  </v-text-field>
                                </validation-provider>
                              </div>
                              <div class="col-md-6">
                                <validation-provider v-slot="{ errors }" name="email" vid="email" rules="max:191">
                                  <v-text-field v-model="form.email" :error-messages="errors" label="Email*" required dense
                                                hide-details="auto" outlined>
                                  </v-text-field>
                                </validation-provider>
                              </div>
                              <div class="col-md-6">
                                <validation-provider v-slot="{ errors }" name="phone number" vid="phone_number" rules="required">
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
                              </div>
                            </div>
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
                            >Update
                            </v-btn>
                          </v-card-actions>
                        </v-form>
                      </validation-observer>
                    </v-card>
                  </div>
                  <div class="col-md-3" style="padding: 25px 0px;">
                    <v-card>
                      <v-card-title class="primary_header fs-4">Picture
                      </v-card-title>
                      <v-card-text>
                        <form-image-preview
                            :existingImages="image"
                            :image-props="form.image"
                            @removeImage="removeImage($emit, 'image')"
                        />

                        <v-file-input
                            v-model="form.image"
                            type="file"
                            placeholder="please select an image"
                        ></v-file-input>
                      </v-card-text>
                    </v-card>
                  </div>
                </div>
                <v-spacer></v-spacer>
                <v-card>
                  <v-card-title class="primary_header fs-3">Change Password
                  </v-card-title>
                  <change-password></change-password>
                </v-card>
              </v-container>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BreadCrumbs from "@/components/common/BreadCrumbs";
import Sidebar from "@/components/user/Sidebar";
import {common as commonMixin} from "@/mixins/common";
import FormImagePreview from "@/components/form/formImagePreview.vue";
import ChangePassword from "@/components/auth/ChangePassword.vue";
import VueTelInputVuetify from "vue-tel-input-vuetify/lib/vue-tel-input-vuetify.vue"
const permission = ''
const stateName = 'users'
const storeName = 'user/user'

export default {
  name: 'profile-edit',
  layout: 'userLayout',
  components: {BreadCrumbs, FormImagePreview, Sidebar,ChangePassword, VueTelInputVuetify},
  mixins: [commonMixin],
  data() {
    return {
      pageInfo: {
        pageName: 'Profile Update',
        apiUrl: '/user/',
        permission
      },
      state: {
        name: stateName,
        store_name: storeName,
      },
      selected: [],
      options: {},
      dialog: false,
      editIndex: -1,
      editMode: false,
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      image: null,
      bindProps:{
        mode: 'international'
      },
      form: {
        first_name: null,
        last_name: null,
        email: null,
        phone_number: null,
        image: null,
      },
      userInfo: {},
    }
  },
  async mounted() {
    this.loader.isLoading = true
    await this.init()
    this.loader.isLoading = false
  },
  methods: {
    removeImage($emit, formElementName) {
      if (!formElementName) return
      if ($emit && (this.form[formElementName] && this.form[formElementName].length > 1))
        $emit ? this.form[formElementName].splice($emit, 1) : this.form[formElementName] = null
      else this.form[formElementName] = null
    },
    async init() {
      await this.$axios.get(`/user`)
        .then((response) => {
          this.userInfo = response.data;

          Object.keys(this.form).map((field) => {
            this.form[field] = this.userInfo[field] ?? null;
          });
          this.image = this.userInfo.image
          this.form.image = null
        }).catch(() => {
          this.userInfo = {}
        })
    },
    async submitData() {
      if (await this.$refs.observer.validate()){
        this.loader.isSubmitting = true
        const formData = this.$generateFormData(this.form,true)
        let url = `/user/update`

        await this.$axios.post(url, formData).then((response) => {
          this.$toaster.success('Update successfully!!')
          this.$auth.fetchUser()
          this.$router.push('/user/profile')
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
    },
  }
}
</script>

