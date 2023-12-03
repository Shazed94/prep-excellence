<template>
  <v-card :loading="loader.isLoading">
    <v-data-table
      v-model="selectedItems"
      dense
      item-key="id"
      show-select
      :headers="headers"
      :items="items"
      class="elevation-1"
      :loading="loader.isLoading"
    >
      <template v-slot:top>
        <v-toolbar flat >
          <v-toolbar-title>Manage {{ pageInfo.pageName | capitalize(true) }}</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <div class="mr-2">
            <v-text-field v-model="search" outlined dense label="Search" class="mt-3"></v-text-field>
          </div>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" persistent max-width="800">
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
                        <v-col cols="12" xs="6" sm="4">
                          <validation-provider
                            v-slot="{ errors }"
                            name="name"
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
                        <v-col cols="12" xs="6" sm="4">
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
                        <v-col cols="12" xs="6" sm="4">
                          <validation-provider v-slot="{ errors }" name="type" vid="type" rules="required">
                            <v-select
                              v-model.number="form.type"
                              :items="types"
                              :error-messages="errors"
                              item-text="name"
                              item-value="id"
                              label="Type"
                              dense
                              hide-details="auto"
                              outlined></v-select>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" xs="12" sm="12">
                          <validation-provider v-slot="{ errors }" name="permission" vid="permission_ids" rules="required">
                            <v-select
                              v-model="form.permission_ids"
                              :items="permissions"
                              :error-messages="errors"
                              item-text="name"
                              item-value="id"
                              label="Permission"
                              dense
                              multiple
                              hide-details="auto"
                              outlined></v-select>
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
      </template>
      <template v-slot:item.permissions="{ index, item }">
        <span v-for="(permission,key) in item.permissions" :key="key">
          <v-chip class="ma-1"> {{ permission.name}} </v-chip>
        </span>
      </template>
      <template v-slot:item.type="{ index, item }">
        <v-chip class="ma-1"> {{ findTypeById(item.type)}} </v-chip>
      </template>
      <template v-slot:item.is_active="{ index, item }">
        <v-switch
          class="pa-0 ma-0"
          v-if="$can('status change',pageInfo.permission)"
          hide-details
          :value="true"
          :input-value="item.is_active"
          @change="toggleStatusChange(index, $event !== null, $event, item.id, state.name, state.store_name,'is_active')">
        </v-switch>
      </template>

      <template v-slot:item.actions="{index, item }">
        <v-btn x-small color="green darken-1" v-if="$can('edit',pageInfo.permission)" class="white--text" fab @click="createOrUpdate(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn color="error" x-small fab v-if="$can('remove',pageInfo.permission)" @click="deleteItem(item, index, state.store_name)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>

  </v-card>
</template>

<script>
import {common as commonMixin} from "@/mixins/common";
import {mapGetters} from "vuex";

const permission = 'Role Menu'
const stateName = 'menus'
const storeName='rolePermission/basic'

export default {
  mixins: [commonMixin],
  data() {
    return {
      pageInfo: {
        pageName: 'Menus',
        apiUrl: '/menu/',
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
        alias:'',
        type:'',
        permission_ids:[],
      },
      selectedItem: {},
      editIndex: -1,
      selectedItems: [],
      options: {},
      search: '',
      timeout: null,
      footerProps: {
        itemsPerPageOptions: [20, 50, 100, 500]
      },
      headers: [
        {text: 'Name', align: 'start', value: 'name'},
        {text: 'Alias', align: 'start', value: 'alias'},
        {text: 'Type', align: 'start', value: 'type'},
        {text: 'Permission', align: 'start', value: 'permissions'},
        {text: 'Status', value: 'is_active'},
        {text: 'Actions', value: 'actions', sortable: false}
      ],
    }
  },
  computed: {
    ...mapGetters('rolePermission/basic',['findTypeById','types','permissions']),
    items() {
      return this.$store.state.rolePermission.basic[stateName]
    },
    editMode() {
      return this.editIndex > -1
    }
  },
  async mounted() {
    this.loader.isLoading = true
    if(this.items.length<1 ) await this.init()
    this.loader.isLoading = false
  },
  watch: {
    options: {
      handler() {
        this.init()
      },
      deep: true
    },
    search(value, oldVal) {
      if ((value.length >= 3) || oldVal.length >= 3) {
        if (this.timeout) {
          clearTimeout(this.timeout)
        }
        this.timeout = setTimeout(() => {
          this.init()
        }, 500)
      }
    },
  },
  methods: {
    async init(){
      let url = this.pageInfo.apiUrl
      url+=`?per_page=${this.options.itemsPerPage}&page=${this.options.page}`
      if (this.search.length > 3) {
        url += `&search=${this.search}`
      }
      const payload = {apiUrl: url, stateName}
      await this.$store.dispatch(storeName+'/getItems', payload)
    },
    createOrUpdate(item = null) {
      if (item) this.editIndex = this.items.indexOf(item)
      else this.editIndex = -1

      if (this.editMode) {
        this.selectedItem = item
        this.form = {
          name: item.name,
          alias: item.alias,
          type: item.type,
        }
        if (item.permissions) this.form.permission_ids = item.permissions.map(obj => obj.id);
      } else {
        this.selectedItem = {}
        this.form = {name: '', alias: '', type:'', permission_ids:[]}
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
.v-btn.error{
  background-color:red !important;
}
</style>
