<template>
  <div class="flex-grow-1">
    <bread-crumbs
      :page-title="`Manage ${pageInfo.pageName}`"
      :items="[{text: 'Accounts',disabled: true, href: '/accounts'},{text: `${pageInfo.pageName}`,disabled: true, href: '/accounts/payment-type'}]"
    />
    <v-data-table
      dense
      v-model="selected"
      item-key="id"
      show-select
      :headers="headers"
      :items="paymentTypes"
      :search="search"
      :footer-props="footerProps"
      :items-per-page="20"
      class="elevation-1"
      :loading="loader.isLoading"
    >
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-toolbar-title>
            <div>
              <export-excel :url="`payment-type/export?format=excel&ids=${selectedIds ? selectedIds : ''}`" file_name="payment-types" />
              <export-csv :url="`payment-type/export?format=csv&ids=${selectedIds ? selectedIds : ''}`" file_name="payment-types" />
              <export-pdf  :url="`payment-type/export?format=pdf&ids=${selectedIds ? selectedIds : ''}`" file_name="payment-types" />
            </div>
          </v-toolbar-title>

          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>

          <div class="mr-2">
            <v-text-field
              v-model="search"
              label="Search"
              class="mt-3"
              outlined
              dense
            ></v-text-field>
          </div>

          <v-spacer></v-spacer>

          <v-dialog
            v-model="dialog"
            persistent
            max-width="500"
          >
            <template v-slot:activator="{ on, attrs }">
<!--                color="primary"-->
              <v-btn v-if="$can('create',pageInfo.permission)"
                style="background: #01579B"
                class="mx-2 white--text"
                v-bind="attrs"
                icon
                v-on="on"
                @click="create"
                small
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <v-card>
              <validation-observer ref="observer" v-slot="{ invalid }">
                <v-form ref="form" @submit.prevent="takeAction">
                  <v-card-title class="text-h5">  {{ editMode ? 'Update ' : 'Create' }} {{ pageInfo.pageName | capitalize }}</v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row dense align="baseline" justify="center">
                        <v-col cols="12" xs="12" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            name="Name"
                            rules="required|max:191"
                            vid="name"
                          >
                            <v-text-field
                              v-model="formData.name"
                              :error-messages="errors"
                              label="Name"
                              required
                              dense
                              outlined
                            ></v-text-field>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            name="Details"
                            vid="details"
                            rules=""
                          >
                            <v-textarea
                              v-model="formData.details"
                              clearable
                              clear-icon="mdi-close-circle"
                              label="Details"
                              :error-messages="errors"
                              dense
                              outlined
                              height="75"
                            ></v-textarea>
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
                      {{ editMode ? 'Update' : 'Save' }}
                    </v-btn>
                    <v-btn class="mr-2 error darken-1 white--text" depressed @click="closeModal">
                      Close
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </validation-observer>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>

      <template v-slot:item.is_active="{index, item }" v-if="$can('status change',pageInfo.permission)">
        <v-switch :value="true" :input-value="item.is_active"  @change="toggleStatus(index, $event !== null, $event, item.id)">

        </v-switch>
      </template>

      <template v-slot:item.actions="{ index, item }">
        <v-btn v-if="$can('edit',pageInfo.permission)"
          x-small
          class="mr-2"
          color="accent"
          fab
          @click="editItem(item)"
        >
          <v-icon>
            mdi-pencil
          </v-icon>
        </v-btn>
        <v-btn v-if="$can('remove',pageInfo.permission)"
          color="error"
          x-small
          fab
          @click="deleteItem(index, item.id)"
        >
          <v-icon>
            mdi-delete
          </v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import ExportExcel from '@/components/common/ExportExcel'
import ExportCsv from '@/components/common/ExportCsv'
import ExportPdf from '@/components/common/ExportPdf'
import {mapGetters, mapActions} from 'vuex'
import BreadCrumbs from "../../components/common/BreadCrumbs";
const permission = 'Payment Type'
export default {
  name: 'PType',
  head: {
    title: 'Payment Types',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: ''
      }
    ],
  },
  meta:{
    action: 'read',
    subject: permission
  },
  components: {BreadCrumbs, ExportPdf, ExportCsv, ExportExcel },
  data() {
    return {
      pageInfo: {
        pageName: 'Payment Types',
        apiUrl: '/payment-type',
        permission
      },
      selected: [],
      items: [],
      item: {},
      selectedItem: null,
      totalItems: 0,
      options: {},
      dialog: false,
      editMode: false,
      loader: {
        isLoading: false,
        isSubmitting: false,
        isDeleting: false
      },
      editIndex: -1,
      formData: {
        name: '',
        details: '',
        // is_active: false
      },
      search: '',
      timeout: null,
      headers: [
        {
          text: 'Name',
          align: 'start',
          value: 'name'
        },
        {
          text: 'Details',
          value: 'details'
        },
        {
          text: 'Status',
          value: 'is_active'
        },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      footerProps: {
        itemsPerPageOptions: [20, 50, 100, 500]
      }
    }
  },
  computed: {
    ...mapGetters('accounts/paymentType', ['paymentTypes']),
    selectedIds() {
      return this.selected.map((a) => a.id)
    },
    form: function () {
      const formData = new FormData()
      if (this.editMode) {
        formData.append('_method', 'PUT')
      }
      formData.append('name', this.formData.name)
      formData.append('details', this.formData.details ? this.formData.details : '')
      // formData.append('is_active', this.formData.is_active ? 1 : 0)

      return formData
    }
  },
  watch: {
    dialog(val) {
      val || this.closeModal()
    }
  },
  created() {
    if(this.paymentTypes && this.paymentTypes.length < 1) {
      this.GET_ALL_PAYMENT_TYPES()
    }
  },
  methods: {
    ...mapActions('accounts/paymentType', ['GET_ALL_PAYMENT_TYPES']),
    create() {
      this.editMode = false
      this.selectedItem = null
      this.formData = {
        formData: {
          name: '',
          details: '',
          // is_active: false
        },
      }
    },
    editItem(item) {
      this.dialog = true
      this.editMode = true
      this.selectedItem = item
      this.formData = {
        name: item.name || '',
        details: item.details || '',
        // is_active: item.is_active
      }
    },
    toggleStatus(index, value, event, id) {
      this.$axios.get(`${this.pageInfo.apiUrl}/toggle/${id}`).then(response => {
        if(response.data.status === 'success') {
          this.$store.commit('accounts/paymentType/PAYMENT_TYPE_STATUS_CHANGE', {index, value })
          this.$toaster.success(response.data.message)
        } else{
          this.$toaster.error(response.data.message)
        }
      }).catch(() => {
        this.$toaster.error('Something went wrong!!')
      })
    },
    takeAction() {
      this.editMode ? this.update() : this.submit()
    },
    async submit() {
      this.loader.isSubmitting = true
      await this.$axios.post(this.pageInfo.apiUrl, this.form).then(response => {
        this.dialog = false
        this.$store.commit('accounts/paymentType/ADD_NEW', response.data.data)
        this.clear()
        this.$toaster.success(`${this.pageInfo.pageName} created successfully!!`)
      }).catch((error) => {
        if (error.response.status === 422) {
          this.$refs.observer.setErrors(error?.response?.data?.errors)
          Object.keys(error.response.data.errors).map((field) => {
            this.$toaster.error(error.response.data.errors[field][0]);
          });
        } else this.$toaster.error(error.response.data.message);
      }).finally(() => this.loader.isSubmitting = false)
    },
    async update() {
      this.loader.isSubmitting = true
      await this.$axios.post(`${this.pageInfo.apiUrl}/${this.selectedItem.id}`, this.form).then(response => {
        this.$store.commit('accounts/paymentType/UPDATE_PAYMENT_TYPE', response.data.data)
        this.dialog = false
        this.clear()
        this.$toaster.success(`${this.pageInfo.pageName} Updated successfully!!`)
      }).catch((error) => {
        if (error.response.status === 422) {
          this.$refs.observer.setErrors(error?.response?.data?.errors)
          Object.keys(error.response.data.errors).map((field) => {
            this.$toaster.error(error.response.data.errors[field][0]);
          });
        } else this.$toaster.error(error.response.data.message);
      }).finally(() => this.loader.isSubmitting = false)
    },
    async deleteItem(index, id) {
      this.$swal?.fire({
        title: 'Are you sure?',
        icon: 'warning',
        text: `Do you want to delete this ${this.pageInfo.pageName}?`,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.loader.isDeleting = this.items.id
          await this.$axios.delete(`${this.pageInfo.apiUrl}/${id}`).then((response) => {
            this.$store.commit('accounts/paymentType/DELETE_PAYMENT_TYPE', index)
            this.$toaster.success(`${this.pageInfo.pageName} Deleted successfully!!`)
          }).finally(() => this.loader.isDeleting = false)
        }
      })

    },
    closeModal() {
      this.dialog = false
      this.selectedItem = null
      this.editMode = false
      this.$refs.observer.reset()
    },
    clear() {
      this.editMode = false
      this.selectedItem = null
      this.$refs.form.reset()
      this.$refs.observer.reset()
    }
  }
}
</script>
