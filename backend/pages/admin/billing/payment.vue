<template>
  <v-container fluid>
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: 'Billing',disabled: true, href: '/admin/billing/payment'},{text: `${pageInfo.pageName}`,disabled: true, href: '/admin/billing/payment'}]"
    />
    <v-card>
      <v-card-title>
        <div style="max-width: 200px;" class="mt-3 mr-2">
          <v-autocomplete
            v-model="filter.is_paid"
            :items="payment_status"
            label="Payment Status"
            item-text="name"
            item-value="id"
            append-icon="mdi-package-variant-closed"
            required
            clearable
            dense
            outlined
          ></v-autocomplete>
        </div>
      </v-card-title>
      <v-data-table
        dense
        v-model="selected"
        item-key="id"
        show-select
        :headers="headers"
        :items="payments"
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
                <export-excel :url="`/export${pageInfo.apiUrl}?format=excel&ids=${selectedIds ? selectedIds : ''}`"
                              :file_name="pageInfo.pageName"/>
                <export-csv :url="`/export${pageInfo.apiUrl}?format=csv&ids=${selectedIds ? selectedIds : ''}`"
                            :file_name="pageInfo.pageName"/>
                <export-pdf :url="`/export${pageInfo.apiUrl}?format=pdf&ids=${selectedIds ? selectedIds : ''}`"
                            :file_name="pageInfo.pageName"/>
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
<!--            <v-dialog v-model="dialog" persistent max-width="500">
              <template v-slot:activator="{ on, attrs }">
                &lt;!&ndash;                color="primary"&ndash;&gt;
                <v-btn v-if="$can('read','Auth')"
                       style="background: #01579B"
                       class="mx-2 white&#45;&#45;text"
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
                        <v-row dense>
                          <v-col cols="12" sm="12">
                            <validation-provider
                              v-slot="{ errors }"
                              name="Question"
                              vid="question"
                              rules="required"
                            >
                              <v-text-field
                                v-model="form.name"
                                clearable
                                clear-icon="mdi-close-circle"
                                label="Name"
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" xs="12" sm="12">
                            <form-image-preview
                              :existingImages="image"
                              :image-props="form.image"
                              @removeImage="removeImage($emit, 'image')"
                            />
                            <validation-provider
                              v-slot="{ errors }"
                              name="image"
                              vid="image"
                              :rules="editMode?'':'required'"
                            >
                              <v-file-input
                                v-model="form.image"
                                label="Image"
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
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="green darken-1"
                        class="mx-2 white&#45;&#45;text"
                        type="submit"
                        :disabled="invalid"
                        :loading="loader.isSubmitting"
                        depressed
                      >
                        {{ editIndex > -1 ? 'Update' : 'Save' }}
                      </v-btn>
                      <v-btn class="mr-2 error darken-1 white&#45;&#45;text" depressed @click="closeModal">Close</v-btn>
                    </v-card-actions>
                  </v-form>
                </validation-observer>
              </v-card>
            </v-dialog>-->
          </v-toolbar>
        </template>
        <template v-slot:item.employee="{ index, item }">
          <template v-if="item.employee">
            <template v-if="item.employee.userable">
              <span>{{ item.employee.userable.name }}</span><br>
              <span>{{ item.employee.userable.email }}</span><br>
              <span>{{ item.employee.userable.phone_number }}</span><br>
            </template>
            <span>{{ item.employee.employee_id }}</span>
          </template>
        </template>
        <template v-slot:item.is_paid="{ index, item }">
          <v-switch v-if="$can('status change',pageInfo.permission)"
                    class="pa-0 ma-0"
                    hide-details
                    :value="true"
                    :input-value="item.is_paid"
                    @change="toggleStatusChange(index, $event !== null, $event, item.id, state.name, state.store_name,'is_paid')">
          </v-switch>
        </template>

<!--        <template v-slot:item.actions="{index, item }">
          <v-btn x-small class="mr-1 accent" fab @click="createOrUpdate(item)" v-if="$can('read','Auth')">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn color="error" x-small fab @click="deleteItem(item, index, state.store_name)" v-if="$can('read','Auth')">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>-->
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import ExportExcel from '@/components/common/ExportExcel'
import ExportCsv from '@/components/common/ExportCsv'
import ExportPdf from '@/components/common/ExportPdf'
import BreadCrumbs from "@/components/common/BreadCrumbs";
import {common as commonMixin} from "@/mixins/common";
import {mapGetters} from "vuex";
const permission = 'Payment'
const stateName = 'payments'
const storeName='admin/billing/payment'

export default {
  name: 'Payment',
  head: {
    title: 'Payment',
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
    subject: 'Payment'
  },
  components: {BreadCrumbs, ExportPdf, ExportCsv, ExportExcel},
  mixins: [commonMixin],
  data() {
    return {
      pageInfo: {
        pageName: 'Payment',
        apiUrl: '/employee-payment/',
        permission
      },
      state: {
        name: stateName,
        store_name: storeName,
      },
      selected: [],
      options: {},
      dialog: false,
      editIndex: -1,
      editMode:false,
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      image:null,
      form: {
        name: '',
        image:null,
        description: '',
      },
      search: '',
      timeout: null,
      headers: [
        {
          text: 'SL',
          align: 'start',
          value: 'id'
        },
        {
          text: 'Invoice No',
          align: 'start',
          value: 'invoice_no'
        },
        {
          text: 'Date',
          align: 'start',
          value: 'date'
        },
        {
          text: 'Employee Id',
          align: 'start',
          value: 'employee.employee_id'
        },
        {
          text: 'Employee',
          align: 'start',
          value: 'employee'
        },
        {
          text: 'is Paid',
          align: 'start',
          value: 'is_paid'
        },
        {
          text: 'Regular Hour',
          align: 'start',
          value: 'regular_hour'
        },
        {
          text: 'OT Hour',
          align: 'start',
          value: 'ot_hour'
        },
        {
          text: 'Total Hour',
          align: 'start',
          value: 'total_hour'
        },
        /*{
          text: 'Regular Hour Rate',
          align: 'start',
          value: 'regular_hour_rate'
        },
        {
          text: 'OT Hour Rate',
          align: 'start',
          value: 'ot_hour_rate'
        },*/
        {
          text: 'Regular Amount',
          align: 'start',
          value: 'regular_amount'
        },
        {
          text: 'OT Amount',
          align: 'start',
          value: 'ot_amount'
        },
        {
          text: 'Total Amount',
          align: 'start',
          value: 'total_amount'
        },
        /*{
          text: 'payment Type',
          align: 'start',
          value: 'payment_type'
        },*/
        /*{
          text: 'Note',
          align: 'start',
          value: 'note'
        },*/
      ],
      footerProps: {
        itemsPerPageOptions: [20, 50, 100, 500]
      },
      payment_status:[{id:1, name:'Paid'},{id:0,name:'Not Paid'}],
      filter:{
        is_paid:null,
      }
    }
  },
  computed: {
    ...mapGetters('admin/billing/payment',['payments','totalItems']),
    selectedIds() {
      return this.selected.map((a) => a.id)
    },
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
    'filter.is_paid'(value) {
      this.init()
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      this.loader.isLoading = true
      let url = `${this.pageInfo.apiUrl}?per_page=${this.options.itemsPerPage}&page=${this.options.page}`
      if (this.search.length >= 3) {
        url += `&search=${this.search}`
      }
      if (this.filter.is_paid != null) url += `&is_paid=${this.filter.is_paid}`
      const payload = {apiUrl: url, stateName}
      await this.$store.dispatch(storeName+'/getItems', payload)
      this.loader.isLoading = false
    },
    createOrUpdate(item = null) {
      if (item) {
        this.editIndex = this.course_categories.indexOf(item)
        this.editMode=true;
      }
      else {
        this.editIndex = -1
        this.editMode=false;
      }

      if (this.editMode) {
        this.selectedItem = item
        this.image=item.image
        this.form = {
          name: item.name,
          image:null,
          description: item.description,
        }
      } else {
        this.selectedItem = {}
        this.image=null
        this.form = {name: '', image:null, description:''}
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
