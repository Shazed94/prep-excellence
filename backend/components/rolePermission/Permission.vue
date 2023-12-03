<template>
  <v-card :loading="loader.isLoading">
    <v-toolbar flat>
      <v-toolbar-title>{{ pageInfo.pageName | capitalize(true) }}</v-toolbar-title>
      <v-divider class="mx-4" inset vertical></v-divider>
      <div class="mr-2">
        <v-text-field v-model="search" outlined dense label="Search" class="mt-3"></v-text-field>
      </div>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" persistent max-width="500">
        <template v-slot:activator="{ on, attrs }">
          <!--                color="primary"-->
          <v-btn
            style="background: #01579B"
            class="mx-2 white--text"
            v-if="$can('create',pageInfo.permission)"
            icon
            small
            v-bind="attrs"
            v-on="on"
            @click="createOrUpdate()"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </template>
        <v-card>
          <validation-observer ref="observer" v-slot="{ invalid }">
            <v-form ref="form" @submit.prevent="submitData()">
              <v-card-title class="text-h5"> {{ editIndex > -1 ? 'Update ' : 'Create' }} {{ pageInfo.pageName | capitalize }}</v-card-title>
              <v-card-text>
                <v-container>
                  <v-row dense align="baseline" justify="center">
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
                        name="alias"
                        vid="alias"
                        rules="required|max:191"
                      >
                        <v-text-field
                          v-model="form.alias"
                          :error-messages="errors"
                          label="Alias"
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
                <v-btn
                  color="green darken-1"
                  class="mx-2 white--text"
                  type="submit"
                  :disabled="invalid"
                  :loading="loader.isSubmitting"
                  depressed
                >
                  {{ editIndex > -1 ? 'Update' : 'Save' }}
                </v-btn>
                <v-btn class="mr-2 error white--text" depressed @click="closeModal">Close</v-btn>
              </v-card-actions>
            </v-form>
          </validation-observer>
        </v-card>
      </v-dialog>
    </v-toolbar>
    <v-divider></v-divider>
   <v-card-text>
      <v-data-table
          :headers="headers"
          :items="items"
          :search="search"
        >

        <template v-slot:item.is_active="{ item }">
          <v-switch
            v-if="$can('status change',pageInfo.permission)"
            class="pa-0 ma-0"
            hide-details
            :value="true"
            :input-value="item.is_active"
            @change="toggleStatusChange(items.indexOf(item), $event !== null, $event, item.id, state.name, state.store_name,'is_active')">
          </v-switch>

        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn fab x-small color="green darken-1" v-if="$can('edit',pageInfo.permission)" class="white--text" @click="createOrUpdate(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn fab x-small color="red" class="ml-1" v-if="$can('remove',pageInfo.permission)" @click="deleteItem(item, items.indexOf(item), state.store_name)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import {common as commonMixin} from "@/mixins/common";

const permission = 'Permission'
const stateName = 'permissions'
const storeName='rolePermission/basic'

export default {
  mixins: [commonMixin],
  data() {
    return {
      pageInfo: {
        pageName: 'Permission',
        apiUrl: '/permission/',
        permission
      },
      state: {
        name: stateName,
        store_name: storeName,
      },
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      dialog: false,
      form: {
        name: '',
        alias:''
      },
      search: '',
       headers: [
        {
          text: 'Name',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Alais', value: 'alias' },
        { text: 'Status', value: 'is_active',sortable: false },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      selectedItem: {},
      editIndex: -1
    }
  },
  computed: {
    items() {
      return this.$store.state.rolePermission.basic[stateName]
    },
    editMode() {
      return this.editIndex > -1
    }
  },
  async mounted() {
    this.loader.isLoading = true
    const payload = {apiUrl: this.pageInfo.apiUrl, stateName}
    if(this.items.length<1 ) await this.$store.dispatch(storeName+'/getItems', payload)
    this.loader.isLoading = false
  },
  methods: {
    createOrUpdate(item = null) {
      if (item) this.editIndex = this.items.indexOf(item)
      else this.editIndex = -1

      if (this.editMode) {
        this.selectedItem = item
        this.form = {
          name: item.name,
          alias: item.alias,
        }
      } else {
        this.selectedItem = {}
        this.form = {name: '',alias: ''}
      }
      this.dialog = true
    },
    async submitData() {
      this.loader.isSubmitting = true
      const formData = this.$generateFormData(this.form, this.editIndex > -1)
      let url = this.pageInfo.apiUrl

      if (this.editMode) url = url + this.selectedItem.id

      await this.$axios.post(url, formData).then((response) => {
        this.addOrUpdateState(response, stateName, storeName)
        this.$toaster.success(`${this.pageInfo.pageName} ${this.editMode ? 'updated' : 'created'} successfully!!`)
        this.closeModal()
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
      this.dialog = false
      this.clear()
    },
    clear() {
      this.editIndex = -1
      this.$refs.form.reset()
      this.$refs.observer.reset()
    }
  }
}
</script>
<style>
.v-data-table table td {
  border-bottom:thin solid rgba(0, 0, 0, 0.05)!important;
}
.v-application .text-h5 {
    padding: 5px 0px 0px 0px;
    font-size: 17px!important;
    font-weight: 600!important;
    padding-left: 38px;
}
</style>
