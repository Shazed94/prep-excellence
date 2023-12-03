<template>
  <div class="flex-grow-1">
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: 'Settings',disabled: true, href: '#'},{text: 'General Settings',disabled: true, href: '#'},{text: 'Top Ads',disabled: true, href: '#'},]"
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
                      name="offer"
                      vid="offer"
                      rules="required"
                    >
                      <v-text-field
                        v-model="form.offer"
                        :error-messages="errors"
                        label="Offer"
                        hide-details="auto"
                        dense
                        outlined/>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <validation-provider
                      v-slot="{ errors }"
                      name="text"
                      vid="text"
                      rules="required"
                    >
                      <v-text-field
                        v-model="form.text"
                        :error-messages="errors"
                        label="Text"
                        hide-details="auto"
                        dense
                        outlined/>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12">
                    <div class="text-center">
                      <v-btn v-if="$can('edit','Top Add')"
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
  name:'TopAds',
  head: {
    title: 'Top Ads',
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
    subject: 'Top Add'
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
        offer: '',
        text: '',
        group: 'top_add',
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
      let val = this.gs.find(item=>item.group===this.form.group && item.name===title);
      if (val) return val.value;
      else return '';
    },
    editData() {
      this.form = {
        offer: this.findVal('offer'),
        text: this.findVal('text'),
        group: 'top_add',
      }
    },
    async submitData() {
      this.loader.isSubmitting = true
      const formData = new FormData()

      formData.append('group', 'top_add')
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
            Object.keys(error.response.data.errors).map((field) => {
              this.$toaster.error(error.response.data.errors[field][0]);
            });
          } else this.$toaster.error(error.response.data.message);
        }).finally(() => this.loader.isSubmitting = false)
    },
    clearForm() {
      this.$refs.observer.reset()
      this.form.group='top_add'
    }
  },
  watch:{
    gs(){
      this.editData();
    }
  }
}
</script>

