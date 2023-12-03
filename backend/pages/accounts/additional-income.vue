<template>
  <div class="flex-grow-1">
    <bread-crumbs
      :page-title="`Manage ${pageInfo.pageName}`"
      :items="[{text: 'Accounts',disabled: true, href: '/accounts'},{text: `${pageInfo.pageName}`,disabled: true, href: '/accounts/additional-income'}]"
    />
    <v-data-table
      dense
      v-model="selected"
      item-key="id"
      show-select
      :headers="headers"
      :items="additional_incomes"
      :options.sync="options"
      :server-items-length="totalItems"
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
              <export-excel :url="`${pageInfo.apiUrl}/export?format=excel&ids=${selectedIds ? selectedIds : ''}`"
                            file_name="withdraw"/>
              <export-csv :url="`${pageInfo.apiUrl}/export?format=csv&ids=${selectedIds ? selectedIds : ''}`"
                          file_name="withdraw"/>
              <export-pdf :url="`${pageInfo.apiUrl}/export?format=pdf&ids=${selectedIds ? selectedIds : ''}`"
                          file_name="withdraw"/>
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
            max-width="700"
          >
            <template v-slot:activator="{ on, attrs }">
              <!--                color="primary"-->
              <v-btn v-if="$can('create','Income')"
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
                  <v-card-title class="text-h5"> {{ editMode ? 'Update ' : 'Create' }} {{
                      pageInfo.pageName | capitalize
                    }}
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row dense>
                        <v-col cols="12" xs="12" sm="6">
                          <validation-provider
                            v-slot="{ errors }"
                            name="Payment Type"
                            rules="required"
                            vid="payment_type_id"
                          >
                            <v-select
                              v-model="formData.payment_type_id"
                              :items="onlyActivePaymentTypes"
                              :error-messages="errors"
                              label="Choose payment type"
                              item-text="name"
                              item-value="id"
                              append-icon="mdi-package-variant-closed"
                              required
                              dense
                              outlined
                            ></v-select>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" xs="12" sm="6">
                          <validation-provider
                            v-slot="{ errors }"
                            name="Amount"
                            rules="required|double"
                            vid="amount"
                          >
                            <v-text-field
                              v-model="formData.amount"
                              type="number"
                              :error-messages="errors"
                              label="Amount"
                              required
                              dense
                              outlined
                            ></v-text-field>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            name="Payment details"
                            vid="payment_details"
                            rules=""
                          >
                            <v-textarea
                              v-model="formData.payment_details"
                              clearable
                              clear-icon="mdi-close-circle"
                              label="Payment details"
                              :error-messages="errors"
                              dense
                              outlined
                              rows="3"
                              auto-grow
                              no-resize
                            ></v-textarea>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            name="Note"
                            vid="note"
                            rules=""
                          >
                            <v-textarea
                              v-model="formData.note"
                              clearable
                              clear-icon="mdi-close-circle"
                              label="Note"
                              :error-messages="errors"
                              dense
                              outlined
                              counter
                              rows="3"
                              auto-grow
                              no-resize
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
      <template v-slot:item.created_at="{item }">
        {{ moment(item.created_at).format('DD-MM-Y hh:mm a') }}
      </template>
      <template v-slot:item.actions="{ index, item }">
        <v-btn v-if="$can('update','Income')"
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
        <v-btn v-if="$can('remove','Income')"
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
import moment from "moment";
export default {
  name: 'additionalIncome',
  head: {
    title: 'Additional Income',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'Hotel Blue Bird'
      }
    ],
  },
  meta:{
    action: 'read',
    subject: 'Income'
  },
  components: {BreadCrumbs, ExportPdf, ExportCsv, ExportExcel},
  data() {
    return {
      moment,
      pageInfo: {
        pageName: 'Additional Income',
        apiUrl: '/additional-income',
        permission: ''
      },
      selected: [],
      items: [],
      item: {},
      selectedItem: null,
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
        payment_type_id: '',
        amount: '',
        payment_details: '',
        note: '',
        // is_active: false
      },
      search: '',
      timeout: null,
      headers: [
        {
          text: 'Payment Type',
          value: 'payment_type.name'
        },
        {
          text: 'Amount',
          value: 'amount'
        },
        {
          text: 'Payment Details',
          value: 'payment_details'
        },
        {
          text: 'Note',
          value: 'note'
        },
        {
          text: 'Created At',
          value: 'created_at'
        },
        {text: 'Actions', value: 'actions', sortable: false}
      ],
      footerProps: {
        itemsPerPageOptions: [20, 50, 100, 500]
      }
    }
  },
  computed: {
    ...mapGetters('accounts/additionalIncome', ['additional_incomes', 'totalItems']),
    ...mapGetters('accounts/paymentType', ['onlyActivePaymentTypes']),
    selectedIds() {
      return this.selected.map((a) => a.id)
    },
    form: function () {
      const formData = new FormData()
      if (this.editMode) {
        formData.append('_method', 'PUT')
      }
      formData.append('payment_type_id', this.formData.payment_type_id)
      formData.append('amount', this.formData.amount)
      formData.append('payment_details', this.formData.payment_details ? this.formData.payment_details : '')
      formData.append('note', this.formData.note ? this.formData.note: '')
      // formData.append('is_active', this.formData.is_active ? 1 : 0)

      return formData
    }
  },
  watch: {
    options: {
      handler() {
        this.init()
      },
      deep: true
    },
    dialog(val) {
      val || this.closeModal()
    },
    search(value, oldVal) {
      if ((value.length >= 3) || oldVal.length === 3) {
        if (this.timeout) {
          clearTimeout(this.timeout)
        }
        this.timeout = setTimeout(() => {
          this.init()
        }, 500)
      }
    },
  },
  created() {
    if (this.onlyActivePaymentTypes.length < 1) this.$store.dispatch('accounts/paymentType/GET_ALL_PAYMENT_TYPES');
  },
  methods: {
    ...mapActions('accounts/additionalIncome', ['GET_ALL_INCOME']),
    async init() {
      this.loader.isLoading = true
      await this.GET_ALL_INCOME({
        page: this.options.page,
        per_page: this.options.itemsPerPage,
        search: this.search.length >= 3 ? this.search : ''
      })
      this.loader.isLoading = false
    },
    create() {
      this.editMode = false
      this.selectedItem = null
      this.formData = {
        formData: {
          payment_type_id: '',
          amount: '',
          payment_details: '',
          note: '',
        },
      }
    },
    editItem(item) {
      this.dialog = true
      this.editMode = true
      this.selectedItem = item
      this.formData = {
        payment_type_id: item.payment_type_id || null,
        amount: item.amount || '',
        payment_details: item.payment_details || '',
        note: item.note || ''
      }
    },
    takeAction() {
      this.editMode ? this.update() : this.submit()
    },
    async submit() {
      this.loader.isSubmitting = true
      await this.$axios.post(this.pageInfo.apiUrl, this.form).then(response => {
        this.dialog = false
        this.$store.commit('accounts/additionalIncome/ADD_NEW', response.data)
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
        this.$store.commit('accounts/additionalIncome/UPDATE_ITEM', response.data)
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
            this.$store.commit('accounts/additionalIncome/DELETE_ITEM', index)
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
