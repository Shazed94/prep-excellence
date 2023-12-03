<template>
  <div class="flex-grow-1">
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: 'Settings',disabled: true, href: '#'},{text: 'General Settings',disabled: true, href: '#'},{text: 'Logo & Favicon',disabled: true, href: '#'},]"
    />
    <v-card :loading="loader.isLoading">
      <v-card-text>
        <!-- Content Goes here... -->
        <v-row dense>
          <v-col cols="12">
            <validation-observer ref="observer" v-slot="{ invalid, validate }">
              <v-form ref="form" @submit.prevent="submitData()">
                <v-row dense>
                  <v-col cols="12" sm="4">
                    <form-image-preview
                      :existingImages="logo"
                      :image-props="form.logo"
                      @removeImage="removeImage($emit, 'logo')"
                    />
                    <validation-provider
                      v-slot="{ errors }"
                      name="logo"
                      vid="logo"
                      :rules="logo?'':'required'"
                    >
                      <v-file-input
                        v-model="form.logo"
                        label="Logo"
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
                  <v-col cols="12" sm="4">
                    <form-image-preview
                      :existingImages="og_image"
                      :image-props="form.og_image"
                      @removeImage="removeImage($emit, 'og_image')"
                    />
                    <validation-provider
                      v-slot="{ errors }"
                      name="og_image"
                      vid="og_image"
                      :rules="og_image?'':'required'"
                    >
                      <v-file-input
                        v-model="form.og_image"
                        label="OG Image"
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
                  <v-col cols="12" sm="4">
                    <form-image-preview
                      :existingImages="favicon"
                      :image-props="form.favicon"
                      @removeImage="removeImage($emit, 'favicon')"
                    />
                    <validation-provider
                      v-slot="{ errors }"
                      name="favicon"
                      vid="favicon"
                      :rules="favicon?'':'required'"
                    >
                      <v-file-input
                        v-model="form.favicon"
                        label="Favicon"
                        filled
                        prepend-icon="mdi-camera"
                        :error-messages="errors"
                        outlined
                        hide-details="auto"
                        show-size
                        single-line
                        small-chips
                        counter
                        dense
                      />
                    </validation-provider>

                  </v-col>
                  <v-col cols="12">
                    <div class="text-center">
                      <v-btn v-if="$can('edit','Logo & Favicon')"
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
const permission = 'Logo & Favicon'
export default {
  name:'LogoFav',
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
  components: {BreadCrumbs, FormImagePreview},
  fetchOnServer: false,
  async fetch() {
  },
  data() {
    return {
      pageInfo: {
        pageName: 'Logo & Favicon',
        apiUrl: '/setting',
        permission: permission
      },
      loader: {isLoading: false, isSubmitting: false, isDeleting: 0},
      logo: null,
      og_image: null,
      favicon: null,
      form: {
        logo: null,
        og_image: null,
        favicon: null,
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
  },
  methods: {
    removeImage($emit, formElementName) {
      if (!formElementName) return
      if ($emit && (this.form[formElementName] && this.form[formElementName].length > 1))
        $emit ? this.form[formElementName].splice($emit, 1) : this.form[formElementName] = null
      else this.form[formElementName] = null
    },
    findVal(title){
      let val = this.gs.find(item=>item.name===title);
      if (val) return this.$config.apiResource+val.value;
      else return '';
    },
    editData() {
      this.logo= this.findVal('logo');
      this.og_image= this.findVal('og_image');
      this.favicon= this.findVal('favicon');
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
          console.log(response);
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

