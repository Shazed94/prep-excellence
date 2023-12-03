<template>
  <div class="flex-grow-1">
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: 'Settings',disabled: true, href: '#'},{text: 'General Settings',disabled: true, href: '#'},{text: 'Web Information',disabled: true, href: '#'},]"
    />
    <v-card :loading="loader.isLoading">
      <v-card-text>
        <!-- Content Goes here... -->
        <v-row dense>
          <v-col cols="12">
            <validation-observer ref="observer" v-slot="{ invalid, validate }">
              <v-form ref="form" @submit.prevent="submitData()">
                <v-row dense>
                  <v-col cols="12" sm="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="title"
                      vid="title"
                      rules="required"
                    >
                      <v-text-field
                        v-model="form.title"
                        :error-messages="errors"
                        label="Website Title"
                        hide-details="auto"
                        dense
                        outlined/>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="slogan"
                      vid="slogan"
                      rules="required"
                    >
                      <v-text-field
                        v-model="form.slogan"
                        :error-messages="errors"
                        label="Slogan"
                        hide-details="auto"
                        dense
                        outlined/>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="number"
                      vid="number"
                      rules="required"
                    >
                      <v-text-field
                        v-model="form.mobile_number"
                        :error-messages="errors"
                        label="Number"
                        hide-details="auto"
                        dense
                        outlined/>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Email"
                      vid="email"
                      rules="required|email"
                    >
                      <v-text-field
                        v-model="form.email"
                        :error-messages="errors"
                        label="Email"
                        hide-details="auto"
                        dense
                        outlined/>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="tel"
                      vid="tel"
                      rules="required"
                    >
                      <v-text-field
                        v-model="form.tel"
                        :error-messages="errors"
                        label="Tel"
                        hide-details="auto"
                        dense
                        outlined/>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="copyright"
                      vid="copyright"
                      rules="required"
                    >
                      <v-text-field
                        v-model="form.copyright"
                        :error-messages="errors"
                        label="Copyright"
                        hide-details="auto"
                        dense
                        outlined/>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <validation-provider
                      v-slot="{ errors }"
                      name="city"
                      vid="city"
                      rules="required"
                    >
                      <v-text-field
                        v-model="form.city"
                        :error-messages="errors"
                        label="City"
                        hide-details="auto"
                        dense
                        outlined/>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <validation-provider
                      v-slot="{ errors }"
                      name="state"
                      vid="state"
                      rules="required"
                    >
                      <v-text-field
                        v-model="form.state"
                        :error-messages="errors"
                        label="State"
                        hide-details="auto"
                        dense
                        outlined/>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <validation-provider
                      v-slot="{ errors }"
                      name="country"
                      vid="country"
                      rules="required"
                    >
                      <v-text-field
                        v-model="form.country"
                        :error-messages="errors"
                        label="Country"
                        hide-details="auto"
                        dense
                        outlined/>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <validation-provider
                      v-slot="{ errors }"
                      name="zip"
                      vid="zip"
                      rules="required"
                    >
                      <v-text-field
                        v-model="form.zip"
                        :error-messages="errors"
                        label="Zip"
                        hide-details="auto"
                        dense
                        outlined/>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <validation-provider
                      v-slot="{ errors }"
                      name="street"
                      vid="street"
                      rules="required"
                    >
                      <v-text-field
                        v-model="form.street"
                        :error-messages="errors"
                        label="Street"
                        hide-details="auto"
                        dense
                        outlined/>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <validation-provider
                      v-slot="{ errors }"
                      name="map"
                      vid="map"
                      rules="required"
                    >
                      <v-text-field
                        v-model="form.map"
                        :error-messages="errors"
                        label="Map Location link"
                        hide-details="auto"
                        dense
                        outlined/>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12">
                    <div class="text-center">
                      <v-btn v-if="$can('edit','Web Information')"
                        type="submit"
                        small class="primary"
                        :loading="loader.isSubmitting"
                        :disabled="loader.isSubmitting"
                      >Update
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
              </v-form>
            </validation-observer>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import FormImagePreview from '@/components/form/formImagePreview';
import BreadCrumbs from "@/components/common/BreadCrumbs";
import {mapGetters} from 'vuex'
export default {
  name:'WebInfo',
  head: {
    title: 'Web Information',
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
    subject: 'Web Information'
  },
  components: {BreadCrumbs, FormImagePreview},
  fetchOnServer: false,
  async fetch() {
  },
  data() {
    return {
      pageInfo: {
        pageName: 'General Settings',
        apiUrl: '/setting',
        permission: ''
      },
      loader: {isLoading: false, isSubmitting: false, isDeleting: 0},
      form: {
        title: '',
        slogan: '',
        mobile_number: '',
        email: '',
        tel: '',
        copyright: '',
        city: '',
        state: '',
        country: '',
        zip: '',
        street: '',
        map: '',
      },
    }
  },
  mounted() {
      this.$store.dispatch('public/settings/generalSetting/getSettings');
      this.editData();
  },
  computed: {
    gs(){
      return this.$store.state.public.settings.generalSetting.general_settings;
    }
    //...mapGetters('settings/generalSetting', ['gs']),
  },
  methods: {
    findVal(title){
      let val = this.gs.find(item=>item.name===title);
      if (val) return val.value;
      else return '';
    },
    editData() {
      this.form = {
        title: this.findVal('title'),
        slogan: this.findVal('slogan'),
        mobile_number: this.findVal('mobile_number'),
        email: this.findVal('email'),
        tel: this.findVal('tel'),
        copyright: this.findVal('copyright'),
        city: this.findVal('city'),
        state: this.findVal('state'),
        country: this.findVal('country'),
        zip: this.findVal('zip'),
        street: this.findVal('street'),
        map: this.findVal('map'),
      }
    },
    async submitData() {
      this.loader.isSubmitting = true
      const formData = new FormData()

      formData.append('group', 'general')
      for (const [key, value] of Object.entries(this.form)) {
        if (value === true || value === false) formData.append(key, value ? 1 : 0)
        else if (value !== null) formData.append(key, String(value) ? value : '')
      }
      await this.$axios.post(`${this.pageInfo.apiUrl}`, formData)
        .then((response) => {
          this.$store.dispatch('public/settings/generalSetting/getSettings');
          this.$toaster.success(`${this.pageInfo.pageName} updated successfully!!`)
        }).catch((error) => {
          if (error.response.status === 422) {
            this.$refs.observer.setErrors(error?.response?.data?.errors)
            Object.keys(error.response.data).map((field) => {
              this.$toaster.error(error.response.data[field][0]);
            });
          } else this.$toaster.error(error.response.data.message);
        }).finally(() => this.loader.isSubmitting = false)
    },
    clearForm() {
      this.$refs.observer.reset()
    }
  },
  watch:{
    gs(){
      this.editData();
    }
  }
}
</script>

