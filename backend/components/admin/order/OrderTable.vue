<template>
  <v-card>
    <v-data-table
      dense
      v-model="selected"
      item-key="id"
      show-select
      :headers="headers"
      :items="orders"
      :options.sync="options"
      :server-items-length="totalItems"
      :search="search"
      :footer-props="footerProps"
      :items-per-page="10"
      class="elevation-1"
      :loading="loader.isLoading"
    >
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-toolbar-title>
            <div>
              <export-excel :url="`${pageInfo.apiUrl}export?format=excel&ids=${selectedIds ? selectedIds : ''}`"
                            :file_name="pageInfo.pageName"/>
              <export-csv :url="`${pageInfo.apiUrl}export?format=csv&ids=${selectedIds ? selectedIds : ''}`"
                          :file_name="pageInfo.pageName"/>
              <export-pdf :url="`${pageInfo.apiUrl}export?format=pdf&ids=${selectedIds ? selectedIds : ''}`"
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
          <v-dialog v-model="dialog" persistent max-width="900">
            <template v-slot:activator="{ on, attrs }">
              <!--                color="primary"-->
              <!--                <v-btn v-if="$can('read','Auth')"
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
                              -->
            </template>
            <v-card>
              <validation-observer ref="observer" v-slot="{ invalid }">
                <v-form ref="form" @submit.prevent="submitData()">
                  <v-card-title class="text-h5"> {{ editIndex > -1 ? 'Update ' : 'Create' }} {{ pageInfo.pageName | capitalize }}</v-card-title>
                  <v-card-text>
                    <v-container>
                      <v-row dense>
                        <v-col cols="12" md="4">
                          <validation-provider
                            v-slot="{ errors }"
                            name="Title"
                            vid="title"
                            rules="required"
                          >
                            <v-text-field
                              v-model="form.title"
                              clear-icon="mdi-close-circle"
                              label="Title"
                              :error-messages="errors"
                              dense
                              outlined
                              auto-grow
                              no-resize
                            ></v-text-field>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" md="4">
                          <validation-provider
                            v-slot="{ errors }"
                            name="type"
                            vid="type"
                            rules="required"
                          >
                            <v-select
                              v-model="form.type"
                              clear-icon="mdi-close-circle"
                              :items="types"
                              label="Type"
                              :error-messages="errors"
                              dense
                              outlined
                              auto-grow
                              no-resize
                            ></v-select>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" md="4">
                          <validation-provider
                            v-slot="{ errors }"
                            name="code"
                            vid="code"
                            rules="required"
                          >
                            <v-text-field
                              v-model="form.code"
                              clear-icon="mdi-close-circle"
                              label="Code"
                              :error-messages="errors"
                              dense
                              outlined
                              auto-grow
                              no-resize
                            ></v-text-field>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" md="4">
                          <validation-provider
                            v-slot="{ errors }"
                            name="discount"
                            vid="discount"
                            rules="required|min:0"
                          >
                            <v-text-field
                              v-model="form.discount"
                              clear-icon="mdi-close-circle"
                              label="Discount"
                              :error-messages="errors"
                              type="number"
                              step="any"
                              dense
                              outlined
                              auto-grow
                              no-resize
                            ></v-text-field>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" md="4">
                          <validation-provider
                            v-slot="{ errors }"
                            name="limit"
                            vid="limit"
                            rules="required|min:1"
                          >
                            <v-text-field
                              v-model="form.limit"
                              clear-icon="mdi-close-circle"
                              label="Limit"
                              :error-messages="errors"
                              type="number"
                              dense
                              outlined
                              auto-grow
                              no-resize
                            ></v-text-field>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" md="4">
                          <validation-provider
                            v-slot="{ errors }"
                            name="expire date"
                            vid="expire date"
                            rules="required"
                          >
                            <v-text-field
                              v-model="form.expiry_date"
                              clear-icon="mdi-close-circle"
                              label="Expire Date"
                              :error-messages="errors"
                              type="datetime-local"
                              dense
                              outlined
                              auto-grow
                              no-resize
                            ></v-text-field>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" md="4">
                          <validation-provider
                            v-slot="{ errors }"
                            name="minimum spend"
                            vid="minimum spend"
                            rules=""
                          >
                            <v-text-field
                              v-model="form.minimum_spend"
                              clear-icon="mdi-close-circle"
                              label="Minimum Spend"
                              :error-messages="errors"
                              type="number"
                              step="any"
                              dense
                              outlined
                              auto-grow
                              no-resize
                            ></v-text-field>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" md="4">
                          <validation-provider
                            v-slot="{ errors }"
                            name="maximum spend"
                            vid="maximum spend"
                            rules=""
                          >
                            <v-text-field
                              v-model="form.maximum_spend"
                              clear-icon="mdi-close-circle"
                              label="Maximum Spend"
                              :error-messages="errors"
                              type="number"
                              step="any"
                              dense
                              outlined
                              auto-grow
                              no-resize
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
                      :loading="loader.isSubmitting"
                      depressed
                    >
                      {{ editIndex > -1 ? 'Update' : 'Save' }}
                    </v-btn>
                    <v-btn class="mr-2 error darken-1 white--text" depressed @click="closeModal">Close</v-btn>
                  </v-card-actions>
                </v-form>
              </validation-observer>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.status="{ index, item }">
        <v-switch v-if="$can('read','Auth')"
                  class="pa-0 ma-0"
                  hide-details
                  :value="true"
                  :input-value="item.status"
                  @change="toggleStatusChange(index, $event !== null, $event, item.id, state.name, state.store_name,'status')">
        </v-switch>
      </template>
      <template v-slot:item.receipt="{ index, item }">
        <a v-if="item.orderPayment" :href="item.orderPayment.receipt_url" target="_blank">View</a>
        <span v-else></span>
      </template>

      <template v-slot:item.actions="{index, item }">
        <v-btn x-small color="secondary" class="mr-1 accent" @click="viewInvoice(item)" fab v-if="item.payment_status === 'paid' && $can('read','Auth')">
          <v-icon>mdi-eye</v-icon>
        </v-btn>
        <a v-if="item.payment_status === 'Unpaid'" class="btn btn-primary" :href="$config.frontendUrl+'/order/payment/'+item.id" target="_blank">
          Pay Now
        </a>
        <!--          <v-btn x-small class="mr-1 accent" fab @click="createOrUpdate(item)" v-if="$can('read','Auth')">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>-->
        <!--          <v-btn color="error" x-small fab @click="deleteItem(item, index, state.store_name)" v-if="$can('read','Auth')">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>-->
      </template>
    </v-data-table>
    <v-dialog v-model="dialog2" persistent max-width="1300">
      <v-card>
        <v-card-text>
          <div class="text-right">
            <v-btn
              ref="printBtn"
              v-print="`#printInvoice`"
              icon
            >
              <v-icon color="light-blue">mdi-printer</v-icon>
            </v-btn>
          </div>
          <v-sheet :id="`printInvoice`" style="margin:10px;">
            <v-container>
              <report-head></report-head>
              <v-card-subtitle class="text-center"><b>Invoice</b></v-card-subtitle>

              <table v-if="selectedInvoice && Object.keys(selectedInvoice).length" style="width:100%;  margin-top: 30px;">
                <tr class="table-text">
                  <td>Invoice No</td>
                  <td>{{ selectedInvoice.payment_transaction_id }}</td>
                </tr>
                <tr class="table-text">
                  <td>Student Information</td>
                  <td>
                    <div>Name: {{ selectedInvoice?.user?.name }}</div>
  <!--                  <div>Student ID: {{ selectedInvoice?.user?.userable?.student_id }}</div>-->
                    <div>Phone: {{ selectedInvoice?.user?.phone_number }}</div>
                    <div>Email: {{ selectedInvoice?.user?.email }}</div>
                  </td>
                </tr>
                <tr class="table-text" v-for="(cc,key2) in selectedInvoice.studentCourses" :key="key2">
                  <td>{{ selectedInvoice?.courses[key2]?.name  }}</td>
                  <td>$ {{ cc.amount }}</td>
                </tr>
                <tr class="table-text">
                  <td>Sub Total</td>
                  <td>$ {{ selectedInvoice.product_total }}</td>
                </tr>
                <tr class="table-text">
                  <td>Discount</td>
                  <td>$ {{ selectedInvoice.discount_amount }}</td>
                </tr>
                <tr class="table-text">
                  <td>Total</td>
                  <td>$ {{ selectedInvoice.total }}</td>
                </tr>
                <tr class="table-text">
                  <td>Payment</td>
                  <td>
                    <div>Type: {{ selectedInvoice.payment_method }}</div>
                    <div>Status: {{ selectedInvoice.payment_status }}</div>
                  </td>
                </tr>
              </table>
            </v-container>
          </v-sheet>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="mr-2 error darken-1 white--text" depressed @click="closeInvoice()">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
import ExportExcel from '@/components/common/ExportExcel'
import ExportCsv from '@/components/common/ExportCsv'
import ExportPdf from '@/components/common/ExportPdf'
import BreadCrumbs from "~/components/common/BreadCrumbs";
import {common as commonMixin} from "@/mixins/common";
import ReportHead from "@/components/report/ReportHead";
import {mapGetters} from "vuex";
const permission = ''
const stateName = 'orders'
const storeName='admin/order'

export default {
  name: 'orderTable',
  components: {BreadCrumbs, ExportPdf, ExportCsv, ExportExcel,ReportHead},
  mixins: [commonMixin],
  props:{
    status:{
      required:false,
      type:String,
    }
  },
  data() {
    return {
      pageInfo: {
        pageName: 'Orders',
        apiUrl: '/order/',
        permission: ''
      },
      state: {
        name: stateName,
        store_name: storeName,
      },
      selected: [],
      options: {},
      dialog: false,
      dialog2: false,
      editIndex: -1,
      editMode:false,
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      image:null,
      form: {
        'title':'',
        'type':'fixed',
        'code':'',
        'limit':null,
        'discount':0,
        'expiry_date':null,
        'minimum_spend':0,
        'maximum_spend':0,
        'user_id':null,
      },
      search: '',
      timeout: null,
      selectedInvoice:{},
      headers: [
        /*{
          text: 'SL',
          align: 'start',
          value: 'id'
        },*/
        {
          text: '#Order ID',
          align: 'start',
          value: 'id',
          sortable: false
        },
        {
          text: 'Date',
          align: 'start',
          value: 'created_at',
          sortable: false
        },
        {
          text: 'Name',
          align: 'start',
          value: 'user.name',
          sortable: false
        },
        {
          text: 'Email',
          align: 'start',
          value: 'user.email',
          sortable: false
        },
        {
          text: 'Phone Number',
          align: 'start',
          value: 'user.phone_number',
          sortable: false
        },
        {
          text: 'Getaway Receipt',
          align: 'start',
          value: 'receipt',
          sortable: false
        },
        {
          text: 'Total($)',
          align: 'start',
          value: 'total',
          sortable: false
        },
        {
          text: 'Status',
          value: 'payment_status',
          sortable: false
        },
        {text: 'Actions', value: 'actions', sortable: false}
      ],
      types:['Fixed','Percentage'],
      footerProps: {
        itemsPerPageOptions: [10,20, 50, 100, 500]
      }
    }
  },
  computed: {
    ...mapGetters('admin/order',['orders','totalItems']),
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
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      this.loader.isLoading = true
      let url = `${this.pageInfo.apiUrl}?status=${this.status}&per_page=${this.options.itemsPerPage}&page=${this.options.page}`
      if (this.search.length > 3) {
        url += `&search=${this.search}`
      }
      const payload = {apiUrl: url, stateName}
      await this.$store.dispatch(storeName+'/getItems', payload)
      this.loader.isLoading = false
    },
    createOrUpdate(item = null) {
      if (item) {
        this.editIndex = this.orders.indexOf(item)
        this.editMode=true;
      }
      else {
        this.editIndex = -1
        this.editMode=false;
      }

      if (this.editMode) {
        this.selectedItem = item
        Object.keys(this.form).map((field) => {
          this.form[field] = this.selectedItem[field] ?? '';
        });
      } else {
        this.selectedItem = {}
        Object.keys(this.form).map((field) => {
          this.form[field] = null;
        });
      }
      this.dialog = true
    },
    async submitData() {
      if (await this.$refs.observer.validate()){
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
      }

    },
    closeModal() {
      this.dialog = false
      this.clear()
    },
    clear() {
      this.editIndex = -1
      this.$refs.form.reset()
      this.$refs.observer.reset()
    },
    viewInvoice(item) {
      this.selectedInvoice = item
      this.dialog2 = true
    },
    closeInvoice() {
      this.dialog2 = false
      this.selectedInvoice = {}
    },
  }
}
</script>
<style scoped>
.text-center {
  text-align: center;
}

.d-flex {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
}

th, tr, td {
  padding: 5px;
}

.table-text {
  font-size: 14px;
  font-weight: bold;
}

.text-center {
  text-align: center;
}

#page {
  size: auto;
  margin: 0;
}
</style>
