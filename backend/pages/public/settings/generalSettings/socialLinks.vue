<template>
  <div class="flex-grow-1">
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: 'Settings',disabled: true, href: '#'},{text: 'General Settings',disabled: true, href: '#'},{text: 'Social Links',disabled: true, href: '#'},]"
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
                      name="facebook"
                      vid="facebook"
                      rules="required"
                    >
                      <v-text-field
                        v-model="form.facebook"
                        :error-messages="errors"
                        label="Facebook"
                        hide-details="auto"
                        dense
                        outlined/>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="twitter"
                      vid="twitter"
                      rules="required"
                    >
                      <v-text-field
                        v-model="form.twitter"
                        :error-messages="errors"
                        label="Twitter"
                        hide-details="auto"
                        dense
                        outlined/>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="youtube"
                      vid="youtube"
                      rules="required"
                    >
                      <v-text-field
                        v-model="form.youtube"
                        :error-messages="errors"
                        label="Youtube"
                        hide-details="auto"
                        dense
                        outlined/>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="instagram"
                      vid="instagram"
                      rules="required"
                    >
                      <v-text-field
                        v-model="form.instagram"
                        :error-messages="errors"
                        label="Instagram"
                        hide-details="auto"
                        dense
                        outlined/>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="linkedin"
                      vid="linkedin"
                      rules="required"
                    >
                      <v-text-field
                        v-model="form.linkedin"
                        :error-messages="errors"
                        label="Linkedin"
                        hide-details="auto"
                        dense
                        outlined/>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="snapchat"
                      vid="snapchat"
                      rules="required"
                    >
                      <v-text-field
                        v-model="form.snapchat"
                        :error-messages="errors"
                        label="snapchat"
                        hide-details="auto"
                        dense
                        outlined/>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12">
                    <div class="text-center">
                      <v-btn v-if="$can('edit','Social Link')"
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
import BreadCrumbs from "@/components/common/BreadCrumbs";
import {mapGetters} from 'vuex'
export default {
  name:'SocialLink',
  head: {
    title: 'Logo & Favicon',
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
    subject: 'Logo & Favicon'
  },
  components: {BreadCrumbs},
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
        facebook: '',
        twitter: '',
        youtube: '',
        instagram: '',
        linkedin: '',
        snapchat: '',
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
        facebook: this.findVal('facebook'),
        twitter: this.findVal('twitter'),
        youtube: this.findVal('youtube'),
        instagram: this.findVal('instagram'),
        linkedin: this.findVal('linkedin'),
        snapchat: this.findVal('snapchat'),
      }
    },
    async submitData() {
      this.loader.isSubmitting = true
      const formData = new FormData()

      formData.append('group', 'social')
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

