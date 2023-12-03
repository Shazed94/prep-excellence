<template>
  <v-container fluid>
    <bread-crumbs
      :page-title="`Manage ${pageInfo.pageName}`"
      :items="[{text: 'Expenses',disabled: true, href: '/expenses'}]"
    />
    <v-data-table
      dense
      v-model="selected"
      item-key="id"
      show-select
      :headers="headers"
      :items="expenses"
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
              <export-excel :url="`expense/export?format=excel&ids=${selectedIds ? selectedIds : ''}`"
                            file_name="expense"/>
              <export-csv :url="`expense/export?format=csv&ids=${selectedIds ? selectedIds : ''}`"
                          file_name="expense"/>
              <export-pdf :url="`expense/export?format=pdf&ids=${selectedIds ? selectedIds : ''}`"
                          file_name="expense"/>
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

          <div class="mr-2" style="max-width: 200px">
            <v-menu
              v-model="filter_start_date_menu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="filter.start_date"
                  label="Start date"
                  append-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  clearable
                  v-on="on"
                  hide-details
                  outlined
                  dense
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="filter.start_date"
                @input="filter_start_date_menu = false"
              ></v-date-picker>
            </v-menu>
          </div>
          <div style="max-width: 180px">
            <v-menu
              v-model="filter_end_date_menu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="filter.end_date"
                  label="End date"
                  append-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  clearable
                  v-on="on"
                  hide-details
                  outlined
                  dense
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="filter.end_date"
                @input="filter_end_date_menu = false"
              ></v-date-picker>
            </v-menu>
          </div>

          <v-spacer></v-spacer>

          <v-dialog
            v-model="dialog"
            persistent
            max-width="900"
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
            <v-card :loading="loader.isPax">
              <validation-observer ref="observer" v-slot="{ invalid }">
                <v-form ref="form" @submit.prevent="takeAction">
                  <v-card-title class="text-h5"> {{ editMode ? 'Update ' : 'Create' }} {{
                      pageInfo.pageName | capitalize
                    }}
                  </v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row dense>
                        <v-col cols="12" xs="12" sm="4">
                          <validation-provider
                            v-slot="{ errors }"
                            name="Expense Type"
                            rules=""
                            vid="expense_type_id"
                          >
                            <v-autocomplete
                              v-model="formData.expense_type_id"
                              :items="onlyActiveTypes"
                              item-text="name"
                              item-value="id"
                              :error-messages="errors"
                              label="Choose expense type"
                              clearable
                              outlined
                              dense
                            ></v-autocomplete>
                          </validation-provider>
                        </v-col>

                        <v-col cols="12" xs="12" sm="4">
                          <validation-provider
                            v-slot="{ errors }"
                            name="Sub Expense Type"
                            rules=""
                            vid="sub_expense_type_id"
                          >
                            <v-autocomplete
                              v-model="formData.sub_expense_type_id"
                              :items="subType"
                              item-text="name"
                              item-value="id"
                              :error-messages="errors"
                              label="Choose sub expense type"
                              clearable
                              outlined
                              dense
                            ></v-autocomplete>
                          </validation-provider>
                        </v-col>

                        <v-col cols="12" xs="12" sm="4">
                          <validation-provider
                            v-slot="{ errors }"
                            name="Expense Date"
                            rules="required"
                            vid="expense_date"
                          >
                            <v-menu
                              v-model="date_menu"
                              :close-on-content-click="false"
                              :nudge-right="40"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="formData.expense_date"
                                  label="Expense date"
                                  append-icon="mdi-calendar"
                                  readonly
                                  v-bind="attrs"
                                  clearable
                                  v-on="on"
                                  hide-details
                                  outlined
                                  dense
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="formData.expense_date"
                                @input="date_menu = false"
                              ></v-date-picker>
                            </v-menu>
                          </validation-provider>
                        </v-col>

                        <v-col cols="12" xs="12" sm="4">
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

                        <v-col cols="12" xs="12" sm="4">
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

                        <v-col cols="12" xs="12" sm="4">
                          <validation-provider
                            v-slot="{ errors }"
                            name="Bank Account"
                            rules=""
                            vid="bank_account_id"
                          >
                            <v-select
                              v-model="formData.bank_account_id"
                              :items="onlyActiveBankAccounts"
                              :error-messages="errors"
                              label="Choose Bank Account"
                              item-text="account_no"
                              item-value="id"
                              append-icon="mdi-package-variant-closed"
                              required
                              dense
                              outlined
                            ></v-select>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" xs="12" sm="4">
                          <validation-provider
                            v-slot="{ errors }"
                            name="Check No."
                            rules="max:100"
                            vid="check_no"
                          >
                            <v-text-field
                              v-model="formData.check_no"
                              :error-messages="errors"
                              label="Check No"
                              required
                              dense
                              outlined
                            ></v-text-field>
                          </validation-provider>
                        </v-col>

                        <v-col cols="12" xs="12" sm="4">
                          <validation-provider
                            v-slot="{ errors }"
                            name="Check Date"
                            rules=""
                            vid="check_date"
                          >
                            <v-menu
                              v-model="check_date_menu"
                              :close-on-content-click="false"
                              :nudge-right="40"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="formData.check_date"
                                  label="Check date"
                                  append-icon="mdi-calendar"
                                  readonly
                                  :error-messages="errors"
                                  v-bind="attrs"
                                  clearable
                                  v-on="on"
                                  outlined
                                  dense
                                ></v-text-field>
                              </template>
                              <v-date-picker
                                v-model="formData.check_date"
                                @input="check_date_menu = false"
                              ></v-date-picker>
                            </v-menu>
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

      <template v-slot:item.expense_date="{index, item }">
        {{ item.expense_date | formatDate }}
      </template>

      <template v-slot:item.is_active="{index, item }" v-if="$can('status change',pageInfo.permission)">
        <v-switch :value="true" :input-value="item.is_active"
                  @change="toggleStatus(index, $event !== null, $event, item.id)">

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
  </v-container>
</template>

<script>
import ExportExcel from '@/components/common/ExportExcel'
import ExportCsv from '@/components/common/ExportCsv'
import ExportPdf from '@/components/common/ExportPdf'
import {mapGetters, mapActions} from 'vuex'
import BreadCrumbs from "../../components/common/BreadCrumbs";
const permission = 'Expense'
export default {
  name: 'Expense',
  head: {
    title: 'Expenses',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'prep excellence'
      }
    ],
  },
  meta:{
    action: 'read',
    subject: permission
  },
  components: {BreadCrumbs, ExportPdf, ExportCsv, ExportExcel},
  data() {
    return {
      pageInfo: {
        pageName: 'Expenses',
        apiUrl: '/expense',
        permission
      },
      selected: [],
      items: [],
      item: {},
      subType: [],
      selectedItem: null,
      options: {},
      dialog: false,
      editMode: false,
      loader: {
        isLoading: false,
        isSubmitting: false,
        isPax: false
      },
      editIndex: -1,
      filter_start_date_menu: false,
      filter_end_date_menu: false,
      date_menu: false,
      check_date_menu: false,
      filter: {
        start_date: null,
        end_date: null,
      },
      formData: {
        expense_type_id: null,
        sub_expense_type_id: null,
        expense_date: null,
        amount: 0,
        payment_type_id: null,
        bank_account_id: null,
        check_no: null,
        check_date: null,
        note: null
      },
      search: '',
      timeout: null,
      headers: [
        {
          text: 'Invoice No',
          align: 'start',
          value: 'invoice_no'
        },
        {
          text: 'Expense Date',
          align: 'start',
          value: 'expense_date'
        },
        {
          text: 'Amount',
          value: 'amount'
        },
        {
          text: 'Expense Type',
          value: 'expenseType.name'
        },
        {
          text: 'Sub Expense Type',
          value: 'subExpenseType.name'
        },
        {
          text: 'Payment Type',
          value: 'payment_type.name'
        },
        {
          text: 'Bank Account',
          value: 'bankAccount.account_no'
        },
        {text: 'Actions', value: 'actions', sortable: false}
      ],
      footerProps: {
        itemsPerPageOptions: [20, 50, 100, 500]
      },
      check_counter:0,
    }
  },
  computed: {
    ...mapGetters('expense/expense', ['expenses', 'totalItems']),
    ...mapGetters('expense/type', ['onlyActiveTypes']),
    ...mapGetters('expense/subType', ['onlyActiveSubTypes', 'filterByExpenseTypeId']),
    ...mapGetters('accounts/paymentType', ['onlyActivePaymentTypes']),
    ...mapGetters('accounts/bankAccount', ['onlyActiveBankAccounts']),
    selectedIds() {
      return this.selected.map((a) => a.id)
    },
    form: function () {
      const formData = new FormData()
      if (this.editMode) {
        formData.append('_method', 'PUT')
      }
      //formData.append('invoice_no', this.formData.invoice_no)
      formData.append('expense_type_id', this.formData.expense_type_id)
      if(this.formData.sub_expense_type_id) formData.append('sub_expense_type_id', this.formData.sub_expense_type_id)
      if (this.formData.expense_date) {
        formData.append('expense_date', this.formData.expense_date)
      }
      formData.append('amount', this.formData.amount)
      formData.append('payment_type_id', this.formData.payment_type_id)
      formData.append('bank_account_id', this.formData.bank_account_id)
      formData.append('check_no', this.formData.check_no)
      if (this.formData.check_date) {
        formData.append('check_date', this.formData.check_date)
      }
      formData.append('note', this.formData.note ? this.formData.note : null)

      return formData
    },
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
    'formData.expense_type_id'(value) {
      if(value) {
        this.subType = this.filterByExpenseTypeId(this.formData.expense_type_id)
        if(!this.subType.length) this.formData.sub_expense_type_id = null
      }else{
        this.formData.sub_expense_type_id = null
      }
    },
    'filter.start_date'(){
        this.init()
    },
    'filter.end_date'(){
      this.init()
    }
  },
  created() {
    if (this.onlyActiveTypes.length < 1) this.$store.dispatch('expense/type/GET_ALL_TYPES');
    if (this.onlyActiveSubTypes.length < 1) this.$store.dispatch('expense/subType/GET_ALL_SUB_TYPES');
    if (this.onlyActivePaymentTypes.length < 1) this.$store.dispatch('accounts/paymentType/GET_ALL_PAYMENT_TYPES');
    if (this.onlyActivePaymentTypes.length < 1) this.$store.dispatch('accounts/bankAccount/GET_ALL_BANK_ACCOUNTS');
  },
  methods: {
    ...mapActions('expense/expense', ['GET_ALL_EXPENSES']),
    async init() {
      this.loader.isLoading = true
      await this.GET_ALL_EXPENSES({
        page: this.options.page,
        per_page: this.options.itemsPerPage,
        search: this.search.length >= 3 ? this.search : null,
        start_date: this.filter.start_date ??null,
        end_date: this.filter.end_date ??null,
      })
      this.loader.isLoading = false
    },
    create() {
      this.editMode = false
      this.selectedItem = null
      this.formData = {
        formData: {
          expense_type_id: null,
          sub_expense_type_id: null,
          expense_date: null,
          amount: 0,
          payment_type_id: null,
          bank_account_id: null,
          check_no: null,
          check_date: null,
          note: null
        },
      }
    },
    editItem(item) {
      this.dialog = true
      this.editMode = true
      this.selectedItem = item
      this.formData = {
        expense_type_id: item.expense_type_id || null,
        sub_expense_type_id: item.sub_expense_type_id || null,
        expense_date: item.expense_date || null,
        amount: item.amount || null,
        payment_type_id: item.payment_type_id || null,
        bank_account_id: item.bank_account_id || null,
        check_no: item.check_no || null,
        check_date: item.check_date || null,
        note: item.note || null
      }
    },
    toggleStatus(index, value, event, id) {
      this.$axios.get(`${this.pageInfo.apiUrl}/toggle/${id}`).then(response => {
        if (response.data.status === 'success') {
          this.$store.commit('expense/expense/EXPENSE_STATUS_CHANGE', {index, value})
          this.$toaster.success(response.data.message)
        } else {
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
        this.$store.commit('expense/expense/ADD_NEW', response.data.data)
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
        this.$store.commit('expense/expense/UPDATE_EXPENSE', response.data.data)
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
            this.$store.commit('expense/expense/DELETE_EXPENSE', index)
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
