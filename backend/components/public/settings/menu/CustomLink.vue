<template>
  <v-card>
    <v-card-title class="grey text--darken-1">
      <span class="text-h6">Add Custom Link</span>
      <v-spacer></v-spacer>
    </v-card-title>
    <validation-observer ref="observer" v-slot="{ invalid }">
      <v-form ref="form" @submit.prevent="submitData()">
        <v-card-text>
          <v-container>
            <v-row dense align="baseline" justify="center">
              <v-col cols="12" xs="12" sm="12">
                <validation-provider v-slot="{ errors }" name="menu id" vid="menu_id" rules="required">
                  <v-select
                    v-model="form.p_menu_id"
                    :items="p_menus"
                    :error-messages="errors"
                    item-text="name"
                    item-value="id"
                    label="Select Menu"
                    dense
                    clearable
                    hide-details="auto"
                    outlined></v-select>
                </validation-provider>
              </v-col>
              <v-col cols="12" xs="12" sm="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="Name"
                  vid="name"
                  rules="required|max:191"
                >
                  <v-text-field
                    v-model="form.name"
                    :error-messages="errors"
                    label="Name"
                    required
                    dense
                    hide-details="auto"
                    outlined
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="12" xs="12" sm="12">
                <validation-provider
                  v-slot="{ errors }"
                  name="url"
                  vid="url"
                  rules="required|max:191"
                >
                  <v-text-field
                    v-model="form.url"
                    :error-messages="errors"
                    label="URL"
                    required
                    dense
                    hide-details="auto"
                    outlined
                  ></v-text-field>
                </validation-provider>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-if="$can('create','Menu')"
            color="green darken-1"
            class="mx-2 white--text"
            type="submit"
            :disabled="invalid"
            :loading="loader.isSubmitting"
            depressed
          >
            {{ editIndex > -1 ? 'Update' : 'Save' }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </validation-observer>
  </v-card>

</template>

<script>
import {common as commonMixin} from "@/mixins/common";
import {mapGetters} from 'vuex'
const stateName = 'menu_items'
const storeName='public/settings/menu'
export default {
  mixins: [commonMixin],
  data() {
    return {
      pageInfo: {
        pageName: 'Menu Item',
        apiUrl: '/menu-item/',
      },
      state: {
        name: stateName,
        store_name: storeName,
      },
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      dialog: false,
      form: {
        name: '',
        url: '',
        p_menu_id:null,
        relation_with:'custom_link',
      },
      search: '',
      selectedItem: {},
      editIndex: -1
    }
  },
  computed: {
    ...mapGetters('public/settings/menu',['p_menus']),
    editMode() {
      return this.editIndex > -1
    }
  },
  methods: {
    async submitData() {
      this.loader.isSubmitting = true
      const formData = this.$generateFormData(this.form, this.editIndex > -1)
      let url = this.pageInfo.apiUrl

      await this.$axios.post(url, formData).then((response) => {
        this.addOrUpdateState(response, stateName, storeName)
        this.$toaster.success(`${this.pageInfo.pageName} ${this.editMode ? 'updated' : 'created'} successfully!!`)
        this.closeModal()
      }).catch((error) => {
        this.$refs.observer.setErrors(error?.response?.data?.errors)
        if (error.response.status === 422) {
          Object.keys(error.response.data).map((field) => {
            this.$toaster.error(error.response.data[field][0]);
          });
        } else this.$toaster.error(error.response.data.message);
      }).finally(() => {
        this.loader.isSubmitting = false
      })
    },
    closeModal() {
      this.dialog = false
      this.clear()
    },
    clear() {
      this.editIndex = -1
      this.$refs.form.reset()
      this.$refs.observer.reset()
      this.form.relation_with='custom_link'
    }
  }
}
</script>

