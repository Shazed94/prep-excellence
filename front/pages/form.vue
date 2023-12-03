<template>
  <div class="btcontainer">
    <v-app>
      <v-row v-if="loader.isLoading">
        <v-col
            cols="12"
            md="4"
        >
          <v-skeleton-loader
              class="mx-auto"
              max-width="300"
              type="card"
          ></v-skeleton-loader>
        </v-col>
        <v-col
            cols="12"
            md="4"
        >
          <v-skeleton-loader
              class="mx-auto"
              max-width="300"
              type="card"
          ></v-skeleton-loader>
        </v-col>
        <v-col
            cols="12"
            md="4"
        >
          <v-skeleton-loader
              class="mx-auto"
              max-width="300"
              type="card"
          ></v-skeleton-loader>
        </v-col>
      </v-row>
      <template v-else>
        <validation-observer ref="observer" v-slot="{ invalid }">
          <v-form ref="form" @submit.prevent="submitData()">
            <v-card-title class="text-h5">
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row dense>
                  <v-col cols="8" xs="8" sm="8">
                    <v-row dense>
                      <v-col cols="12" xs="12" sm="6">
                        <validation-provider
                            v-slot="{ errors }"
                            name="First Name"
                            vid="first_name"
                            rules="required|max:191"
                        >
                          <v-text-field
                              v-model="form.first_name"
                              :error-messages="errors"
                              label="First Name*"
                              required
                              dense
                              hide-details="auto"
                              outlined
                          ></v-text-field>
                        </validation-provider>

                      </v-col>
                      <v-col cols="12" xs="12" sm="6">
                        <validation-provider
                            v-slot="{ errors }"
                            name="Last Name"
                            vid="last_name"
                            rules="required|max:191"
                        >
                          <v-text-field
                              v-model="form.last_name"
                              :error-messages="errors"
                              label="Last Name*"
                              required
                              dense
                              hide-details="auto"
                              outlined
                          ></v-text-field>
                        </validation-provider>
                      </v-col>
                      <v-col cols="12" xs="12" sm="6">
                        <validation-provider
                            v-slot="{ errors }"
                            name="email"
                            vid="email"
                            rules="required|email|max:191"
                        >
                          <v-text-field
                              v-model="form.email"
                              :error-messages="errors"
                              label="Email*"
                              required
                              dense
                              hide-details="auto"
                              outlined
                          ></v-text-field>
                        </validation-provider>
                      </v-col>
                      <v-col cols="12" xs="12" sm="6">
                        <validation-provider
                            v-slot="{ errors }"
                            name="phone number"
                            vid="phone_number"
                            rules="required"
                        >
                          <vue-tel-input-vuetify
                              v-model="form.phone_number"
                              label="Phone Number*"
                              mode="international"
                              :error-messages="errors"
                              dense
                              outlined
                              auto-grow
                              no-resize
                          ></vue-tel-input-vuetify>
                        </validation-provider>
                      </v-col>

                      <!--                <v-col cols="12" xs="12" sm="6">
                                        <validation-provider v-slot="{ errors }" name="gender" vid="gender_id" rules="required">
                                          <v-select
                                            v-model="form.gender_id"
                                            :items="genders"
                                            :error-messages="errors"
                                            item-text="name"
                                            item-value="id"
                                            label="Select Gender"
                                            dense
                                            clearable
                                            hide-details="auto"
                                            outlined></v-select>

                                        </validation-provider>
                                      </v-col>
                                      <v-col cols="12" xs="12" sm="6">
                                        <validation-provider v-slot="{ errors }" name="blood group" vid="blood_group_id" rules="required">
                                          <v-select
                                            v-model="form.blood_group_id"
                                            :items="blood_groups"
                                            :error-messages="errors"
                                            item-text="name"
                                            item-value="id"
                                            label="Select Blood Group"
                                            dense
                                            clearable
                                            hide-details="auto"
                                            outlined></v-select>
                                        </validation-provider>
                                      </v-col>
                                      <v-col cols="12" xs="12" sm="6">
                                        <validation-provider v-slot="{ errors }" name="religion" vid="religion_id" rules="required">
                                          <v-select
                                            v-model="form.religion_id"
                                            :items="religions"
                                            :error-messages="errors"
                                            item-text="name"
                                            item-value="id"
                                            label="Select Religion"
                                            dense
                                            clearable
                                            hide-details="auto"
                                            outlined></v-select>
                                        </validation-provider>
                                      </v-col>
                                         -->
                      <v-col cols="12" xs="12" sm="6">
                        <validation-provider
                            v-slot="{ errors }"
                            name="date of birth"
                            vid="date_of_birth"
                            rules="required"
                        >
                          <v-text-field
                              v-model="form.date_of_birth"
                              :error-messages="errors"
                              label="Date of Birth*"
                              type="date"
                              :max="moment().format('YYYY-MM-DD')"
                              required
                              dense
                              hide-details="auto"
                              outlined
                          ></v-text-field>
                        </validation-provider>
                      </v-col>
                      <template v-if="year < 18 ">
                        <v-col cols="12" xs="12" sm="6">
                          <validation-provider
                              v-slot="{ errors }"
                              name="guardian email"
                              vid="guardian email"
                              rules="required|email|max:191"
                          >
                            <v-text-field
                                v-model="form.guardian_email"
                                :error-messages="errors"
                                label="Guardian Email*"
                                required
                                dense
                                hide-details="auto"
                                outlined
                            ></v-text-field>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" xs="12" sm="6">
                          <validation-provider
                              v-slot="{ errors }"
                              name="guardian name"
                              vid="guardian_name"
                              rules="required|max:191"
                          >
                            <v-text-field
                                v-model="form.father_name"
                                :error-messages="errors"
                                label="Guardian Name*"
                                required
                                dense
                                hide-details="auto"
                                outlined
                            ></v-text-field>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" xs="12" sm="6">
                          <validation-provider
                              v-slot="{ errors }"
                              name="guardian number"
                              vid="guardian_phone_no"
                              rules="required|max:191"
                          >
                            <v-text-field
                                v-model="form.father_phone_no"
                                :error-messages="errors"
                                label="Guardian Phone Number*"
                                required
                                dense
                                hide-details="auto"
                                outlined
                            ></v-text-field>
                          </validation-provider>
                        </v-col>
                      </template>

                      <!--                <v-col cols="12" xs="12" sm="6">
                                        <validation-provider
                                          v-slot="{ errors }"
                                          name="mother name"
                                          vid="mother_name"
                                          rules="required|max:191"
                                        >
                                          <v-text-field
                                            v-model="form.mother_name"
                                            :error-messages="errors"
                                            label="Mother Name"
                                            required
                                            dense
                                            hide-details="auto"
                                            outlined
                                          ></v-text-field>
                                        </validation-provider>
                                      </v-col>
                                          -->
                      <v-col cols="12" xs="12" sm="12"></v-col>
                      <v-col cols="12" xs="12" sm="4">
                        <validation-provider
                            v-slot="{ errors }"
                            name="address"
                            vid="address"
                            rules="required|max:191"
                        >
                          <v-text-field
                              v-model="form.present_address.address"
                              :error-messages="errors"
                              label="Address*"
                              required
                              dense
                              hide-details="auto"
                              outlined
                          ></v-text-field>
                        </validation-provider>
                      </v-col>
                      <v-col cols="12" xs="12" sm="4">
                        <validation-provider
                            v-slot="{ errors }"
                            name="city"
                            vid="city"
                            rules="required"
                        >
                          <v-text-field
                              v-model="form.present_address.city"
                              :error-messages="errors"
                              label="City*"
                              required
                              dense
                              hide-details="auto"
                              outlined
                          ></v-text-field>
                        </validation-provider>
                      </v-col>
                      <v-col cols="12" xs="12" sm="4">
                        <validation-provider
                            v-slot="{ errors }"
                            name="state"
                            vid="state"
                            rules=""
                        >
                          <v-text-field
                              v-model="form.present_address.state"
                              :error-messages="errors"
                              label="State"
                              required
                              dense
                              hide-details="auto"
                              outlined
                          ></v-text-field>
                        </validation-provider>
                      </v-col>
                      <v-col cols="12" xs="12" sm="4">
                        <validation-provider
                            v-slot="{ errors }"
                            name="country"
                            vid="country"
                            rules="required"
                        >
                          <v-text-field
                              v-model="form.present_address.country"
                              :error-messages="errors"
                              label="Country*"
                              required
                              dense
                              hide-details="auto"
                              outlined
                          ></v-text-field>
                        </validation-provider>
                      </v-col>
                      <v-col cols="12" xs="12" sm="4">
                        <validation-provider
                            v-slot="{ errors }"
                            name="zip"
                            vid="zip"
                            rules="required"
                        >
                          <v-text-field
                              v-model="form.present_address.zip"
                              :error-messages="errors"
                              label="Zip*"
                              required
                              dense
                              hide-details="auto"
                              outlined
                          ></v-text-field>
                        </validation-provider>
                      </v-col>

                      <!--                <v-col cols="12" xs="12" sm="12">
                                        <validation-provider
                                          v-slot="{ errors }"
                                          name="permanent address"
                                          vid="permanent_address"
                                          rules="required|max:191"
                                        >
                                          <v-textarea
                                            v-model="form.parmanent_address"
                                            :error-messages="errors"
                                            label="Permanent Address"
                                            required
                                            dense
                                            hide-details="auto"
                                            outlined
                                          ></v-textarea>
                                        </validation-provider>
                                      </v-col>-->
                    </v-row>
                  </v-col>
                  <v-col cols="4" xs="4" sm="4">
                    <v-row dense>
                      <v-col cols="12" sm="12">
                        <form-image-preview
                            :existingImages="image"
                            :image-props="form.image"
                            :imageHeight="`200px`"
                            @removeImage="removeImage($emit, 'image')"
                        />
                        <validation-provider
                            v-slot="{ errors }"
                            name="image"
                            vid="image"
                            rules=""
                        >
                          <v-file-input
                              v-model="form.image"
                              label="Image"
                              filled
                              prepend-icon="mdi-camera"
                              :error-messages="errors"
                              outlined
                              dense
                              hide-details="auto"
                              show-size
                              single-line
                              small-chips
                              counter
                          />
                        </validation-provider>
                      </v-col>
                    </v-row>
                  </v-col>
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
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-form>
        </validation-observer>
      </template>
    </v-app>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import FormImagePreview from "@/components/form/formImagePreview";
import VueTelInputVuetify from "vue-tel-input-vuetify/lib/vue-tel-input-vuetify.vue"

import moment from "moment-timezone";
export default {
  name:'StudentForm',
  components:{FormImagePreview, VueTelInputVuetify},
  data(){
    return{
      moment,
      form: {
        first_name: null,
        last_name: null,
        email: null,
        phone_number: null,
        image: null,
        gender_id: null,
        blood_group_id: null,
        religion_id: null,
        father_name: null,
        father_phone_no: null,
        guardian_email: null,
        mother_name: null,
        date_of_birth: null,
        present_address: {
          city:null,
          state:null,
          country:null,
          zip:null,
          address:null,
        },
        parmanent_address: null,
      },
      loader: {
        isLoading: false,
        isSubmitting: false
         },
      image:null,
      user: {},
      year:0,
    }
  },

  computed: {
    ...mapGetters('user/basic',['religions','genders','blood_groups']),
  },

  async mounted() {
    this.loader.isLoading = true
    this.setUserData();
    await this.setData();
    if (this.$auth.user){
      if (this.$auth.user.role_id != 3 || this.$auth.user.userable.date_of_birth) return this.$router.push('/')
    }
    this.loader.isLoading = false
  },
  watch:{
    'form.date_of_birth': {
      handler() {
        if (this.form.date_of_birth){
          this.year = moment().diff(moment(this.form.date_of_birth),'years')
        }else{
          this.year = 0
        }
      },
      deep: true
    },
  },

  methods: {
    setUserData() {
      this.form.first_name = this.$auth.user.first_name;
      this.form.last_name = this.$auth.user.last_name;
      this.form.email = this.$auth.user.email;
    },
    removeImage($emit, formElementName) {
      if (!formElementName) return
      if ($emit && (this.form[formElementName] && this.form[formElementName].length > 1))
        $emit ? this.form[formElementName].splice($emit, 1) : this.form[formElementName] = null
      else this.form[formElementName] = null
    },

    async submitData() {
      this.loader.isSubmitting = true;
      const formData = this.$generateFormData(this.form, false,['present_address'])
      let url = `/submit-all-data`
      await this.$axios.post(url, formData).then((response) => {
        //console.log(response.data);
        this.$toaster.success(response.data.message);
        this.$router.push('/user-dashboard');
      }).catch((error) => {
        if (error.response && error.response.status === 422) {
          //console.log(error.response);
         this.$refs.observer.setErrors(error?.response?.data?.errors)
         Object.keys(error.response.data.errors).map((field) => {
            this.$toaster.error(error.response.data.errors[field][0]);
         });
        } else this.$toaster.error(error.response.data.message);
      }).finally(() => {
        this.loader.isSubmitting = false
      })
    },

    async setData() {
      const payload2 = {apiUrl: '/common/religion/', stateName: 'religions'}
      if (!this.religions.length) await this.$store.dispatch('user/basic/getItems', payload2)

      const payload4 = {apiUrl: '/common/gender/', stateName: 'genders'}
      if (!this.genders.length) await this.$store.dispatch('user/basic/getItems', payload4)

      const payload5 = {apiUrl: '/common/blood-group/', stateName: 'blood_groups'}
      if (!this.blood_groups.length) await this.$store.dispatch('user/basic/getItems', payload5)
    }
  }
}
</script>

<style scoped>
.theme--light.v-card {
  background-color: #fff;
}
</style>
