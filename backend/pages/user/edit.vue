<template>
  <v-container style="background-color: f7e8e8">
    <div class="d-flex align-center py-1">
      <div>
        <div class="display-1">Edit User {{ `- ${$auth.user.name}` }}</div>
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 py-2"></v-breadcrumbs>
      </div>
    </div>
    <v-card>
      <div class="text-right" style="padding: 20px">
        <v-btn @click="showModal" depressed color="primary">
          Edit Profile
        </v-btn>
      <v-divider />
      </div>
      <v-row style="padding: 10px 20px">
        <v-col md="4" xs="12">
          <v-flex
              align-center
              justify-center
              layout
              text-xs-center
              class="flex-column mb-2"
          >
            <div class="avater-wraper" v-if="!user.image">
              <img
                  height="150"
                  width="150"
                  style="border-radius: 50%"
                  class="img-fluid logo"
                  src="/favicon.png"
                  alt=""
              />
            </div>

            <div class="avater-wraper" v-else>
              <v-img
                  style="border-radius: 50%"
                  lazy-src="https://picsum.photos/id/11/10/6"
                  height="150"
                  width="150"
                  :src="user.image"
              ></v-img>
            </div>
            <p
                style="font-size: 1.75rem; margin-top: 25px; margin-bottom: 15px"
                class="user-name greyMedium--text font-weight-regular"
            >
              {{ user.name }}
            </p>
            <p
                style="font-size: 1rem; margin-bottom: 3px"
                class="user-name greyMedium--text"
            >
              Role: {{ user.role?user.role.name:'N/A' }}
            </p>

<!--            <div>
              <v-btn
                  rounded
                  style="background-color: transparent; min-width: 36px"
                  class="pa-0 mr-0 mr-sm-n2 mr-lg-0"
              >
                <v-icon icon notranslate class="greyTint&#45;&#45;text">
                  mdi-facebook
                </v-icon>
              </v-btn>
              <v-btn
                  rounded
                  style="background-color: transparent; min-width: 36px"
                  class="pa-0 mr-0 mr-sm-n2 mr-lg-0"
              >
                <v-icon icon notranslate class="greyTint&#45;&#45;text">
                  mdi-twitter
                </v-icon>
              </v-btn>
              <v-btn
                  rounded
                  style="background-color: transparent; min-width: 36px"
                  class="pa-0 mr-0 mr-sm-n2 mr-lg-0"
              >
                <v-icon icon notranslate class="greyTint&#45;&#45;text">
                  mdi-instagram
                </v-icon>
              </v-btn>
              <v-btn
                  rounded
                  style="background-color: transparent; min-width: 36px"
                  class="pa-0 mr-0 mr-sm-n2 mr-lg-0"
              >
                <v-icon icon notranslate class="greyTint&#45;&#45;text">
                  mdi-youtube
                </v-icon>
              </v-btn>
            </div>-->
          </v-flex>
        </v-col>
        <v-col md="6" xs="12">
          <template>
            <v-simple-table>
              <template>
                <thead style="background-color: #6199cb; color: #fff;">
                <tr>
                  <td colspan="2">Personal Information</td>
                </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Name</td>
                    <td>{{ user.name ?? "NA" }}</td>
                  </tr>
                  <tr v-if="user.userable">
                    <td>Employee Id</td>
                    <td>{{ user.userable.employee_id ?? "N/A" }}</td>
                  </tr>
                  <tr>
                    <td>Email</td>
                    <td>{{ user.email ?? "NA" }}</td>
                  </tr>
                  <tr>
                    <td>Phone Number</td>
                    <td>{{ user.phone_number ?? "NA" }}</td>
                  </tr>
                  <tr>
                    <td>Gender</td>
                    <td>{{ user.gender ? user.gender.name : "NA" }}</td>
                  </tr>
                  <tr>
                    <td>Blood Group</td>
                    <td>{{ user.bloodGroup ? user.bloodGroup.name : "NA" }}</td>
                  </tr>
                  <tr>
                    <td>Date of Birth</td>
                    <td>{{ user.dob ? moment(user.dob).format('MM-DD-Y') :"NA" }}</td>
                  </tr>
                  <tr>
                    <td>Joining Date</td>
                    <td>{{ user.join_date ? moment(user.join_date).format('MM-DD-Y') : "NA" }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </template>
        </v-col>
      </v-row>
      <v-row style="padding: 10px 20px">
        <v-simple-table>
          <thead style="background-color: #6199cb; color: #fff;">
          <tr>
          <td >Update Password</td>
          </tr>
          </thead>
        </v-simple-table>
        <v-col cols="12" md="12">
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
        </v-col>
      </v-row>
    </v-card>

    <v-dialog v-model="dialog" persistent max-width="800">
      <v-card>
        <div
            class="text-right"
            style="position: absolute; right: 5px; top: 0px"
        >
          <v-btn @click="closeModal" color="primary" icon>x</v-btn>
        </div>
        <validation-observer ref="observer2" v-slot="{ invalid }">
          <v-form ref="form2" @submit.prevent="submitData()">
            <v-card-text>
              <v-container>
                <v-toolbar-title style="position: absolute; top: 5px;">Edit Profile</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-row dense>
                  <v-col cols="12" md="6">
                    <form-image-preview
                        :existingImages="image"
                        :image-props="form2.image"
                        @removeImage="removeImage($emit, 'image')"
                    />
                    <validation-provider
                        v-slot="{ errors }"
                        name="image"
                        vid="image"
                        rules=""
                    >
                      <v-file-input
                          v-model="form2.image"
                          label="Image"
                          type="file"
                          prepend-icon="mdi-camera"
                          :error-messages="errors"
                          outlined
                          dense
                          hide-details="auto"
                          show-size
                          single-line
                      />
                    </validation-provider>
                  </v-col>
                  <v-col cols="12"></v-col>
                  <v-col cols="12" md="6">
                    <validation-provider
                        v-slot="{ errors }"
                        name="first name"
                        vid="first_name"
                        rules="required|max:191"
                    >
                      <v-text-field
                          v-model="form2.first_name"
                          :error-messages="errors"
                          label="First Name"
                          required
                          dense
                          hide-details="auto"
                          outlined
                      ></v-text-field>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" md="6">
                    <validation-provider
                        v-slot="{ errors }"
                        name="last name"
                        vid="last_name"
                        rules="required|max:191"
                    >
                      <v-text-field
                          v-model="form2.last_name"
                          :error-messages="errors"
                          label="Last Name"
                          required
                          dense
                          hide-details="auto"
                          outlined
                      ></v-text-field>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" md="6">
                    <validation-provider
                        v-slot="{ errors }"
                        name="email"
                        vid="email"
                        rules="required|max:191"
                    >
                      <v-text-field
                          v-model="form2.email"
                          :error-messages="errors"
                          label="Email"
                          type="email"
                          required
                          dense
                          hide-details="auto"
                          outlined
                      ></v-text-field>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" md="6">
                    <validation-provider
                        v-slot="{ errors }"
                        name="phone number"
                        vid="phone_number"
                        rules="required"
                    >
                      <vue-tel-input-vuetify
                          v-model="form2.phone_number"
                          label="Phone Number"
                          v-bind="bindProps"
                          :error-messages="errors"
                          dense
                          outlined
                          auto-grow
                          no-resize
                      ></vue-tel-input-vuetify>
                    </validation-provider>
                  </v-col>

<!--                  <v-col cols="12" md="6">
                    <validation-provider
                        v-slot="{ errors }"
                        name="address"
                        vid="address"
                        rules="required|max:191"
                    >
                      <v-text-field
                          v-model="form2.present_address.address"
                          :error-messages="errors"
                          label="Address"
                          required
                          dense
                          hide-details="auto"
                          outlined
                      ></v-text-field>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" md="6">
                    <validation-provider
                        v-slot="{ errors }"
                        name="city"
                        vid="city"
                        rules="required"
                    >
                      <v-text-field
                          v-model="form2.present_address.city"
                          :error-messages="errors"
                          label="City"
                          required
                          dense
                          hide-details="auto"
                          outlined
                      ></v-text-field>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" md="6">
                    <validation-provider
                        v-slot="{ errors }"
                        name="state"
                        vid="state"
                        rules="required"
                    >
                      <v-text-field
                          v-model="form2.present_address.state"
                          :error-messages="errors"
                          label="State"
                          required
                          dense
                          hide-details="auto"
                          outlined
                      ></v-text-field>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" md="6">
                    <validation-provider
                        v-slot="{ errors }"
                        name="country"
                        vid="country"
                        rules="required"
                    >
                      <v-text-field
                          v-model="form2.present_address.country"
                          :error-messages="errors"
                          label="Country"
                          required
                          dense
                          hide-details="auto"
                          outlined
                      ></v-text-field>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" md="6">
                    <validation-provider
                        v-slot="{ errors }"
                        name="zip"
                        vid="zip"
                        rules="required"
                    >
                      <v-text-field
                          v-model="form2.present_address.zip"
                          :error-messages="errors"
                          label="Zip"
                          required
                          dense
                          hide-details="auto"
                          outlined
                      ></v-text-field>
                    </validation-provider>
                  </v-col>-->

                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                  color="green darken-1"
                  class="mx-2 white--text"
                  type="submit"
                  :disabled="invalid"
                  :loading="loader.isSubmitting"
                  depressed
              >
                Update
              </v-btn>
              <v-btn
                  class="mr-2 error darken-1 white--text"
                  depressed
                  @click="closeModal"
              >Close</v-btn
              >
            </v-card-actions>
          </v-form>
        </validation-observer>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import CopyLabel from '../../components/common/CopyLabel'
import AccountTab from '../../components/user/AccountTab'
import InformationTab from '../../components/user/InformationTab'
import {common as commonMixin} from "@/mixins/common"
import VueTelInputVuetify from "vue-tel-input-vuetify/lib/vue-tel-input-vuetify.vue"
import moment from 'moment'
export default {
  head: {
    title: 'Profile',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'Prepexcellence'
      }
    ],
  },
  meta:{
    action: 'read',
    subject: 'Auth'
  },
  components: {
    CopyLabel,
    AccountTab,
    InformationTab,
    VueTelInputVuetify
  },
  mixins: [commonMixin],
  data() {
    return {
      user: {},
      tab: null,
      moment,
      bindProps:{
        mode: 'international'
      },
      dialog:false,
      breadcrumbs: [
        {
          text: 'Users',
          to: '#',
          exact: true
        },
        {
          text: 'Profile'
        }
      ],
      custom_valid_error:false,
      password_show:false,
      custom_valid_error_message:'Confirm password don\'t match',
      form: {
        old_password: null,
        password: null,
        password_confirmation: null,
      },
      image:null,
      form2: {
        first_name:null,
        last_name:null,
        image:null,
        email: null,
        phone_number: null,
      },
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
    }
  },
  async created() {
    await this.init()
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
    async init() {
      this.isLoading = true

      this.$axios.get('/user-details').then((response) => {
        this.user = response.data
      }).catch(() => {
      }).finally(() => {
        this.isLoading = false
      })
    },
    removeImage($emit, formElementName) {
      if (!formElementName) return;
      if (
          $emit &&
          this.form[formElementName] &&
          this.form[formElementName].length > 1
      )
        $emit
            ? this.form[formElementName].splice($emit, 1)
            : (this.form[formElementName] = null);
      else this.form[formElementName] = null;
    },
    showModal() {
      let item = this.user;
      Object.keys(this.form2).map((field) => {
        this.form2[field] = item[field] ?? null;
      });

      this.image = item.image;
      this.form2.image = null;
      this.dialog = true;
    },
    async updatePassword() {
      this.loader.isSubmitting = true
      const formData = this.$generateFormData(this.form,false)
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
    async submitData(){
      this.loader.isSubmitting = true
      const formData = this.$generateFormData(this.form2,true)
      let url = `/user/update`
      await this.$axios.post(url, formData).then((response) => {
        this.$toaster.success('Update successfully');
        this.closeModal()
        this.$auth.fetchUser()
        this.init()
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
    closeModal() {
      this.dialog = false;
      this.clear2();
    },
    clear() {
      this.$refs.form.reset()
      this.$refs.observer.reset()
    },
    clear2() {
      this.$refs.form2.reset()
      this.$refs.observer2.reset()
    }
  }
}
</script>
