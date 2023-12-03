<template>
  <div class="user-dashboard-area">
    <div class="btcontainer">
      <div class="up_wrap">
        <div class="btrow">
          <sidebar/>
          <!-- main content -->
          <div class="btcol-md-6 btcol-lg-9">
            <div class="card-body">
              <div class="dashboard_items">
                <v-container fluid>
                  <v-card>
                    <v-card-title class="primary_header fs-4">
                      {{ pageInfo.pageName}}
                    </v-card-title>
                    <v-data-table
                        dense
                        v-model="selected"
                        item-key="id"
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
                          <div class="mr-2">
                            <v-text-field
                                v-model="search"
                                label="Search"
                                class="mt-3"
                            ></v-text-field>
                          </div>
                          <v-spacer></v-spacer>
                        </v-toolbar>
                      </template>
                      <template v-slot:item.tnx="{ index, item }">
                            <span  v-if="item.payment_status == 'paid' && item.orderPayment">
                              {{ item.orderPayment.txn_number }}
                            </span>
                        <span v-else></span>
                      </template>
                      <template v-slot:item.payment_method="{ index, item }">
                            <span  v-if="item.payment_status == 'paid'">
                              {{ item.payment_method }}
                            </span>
                        <span v-else></span>
                      </template>
                      <template v-slot:item.receipt="{ index, item }">
                            <span  v-if="item.payment_status == 'paid' && item.orderPayment">
                              <a :href="item.orderPayment.receipt_url" target="_blank">{{  'View' }}</a>
                            </span>
                        <span v-else></span>
                      </template>
                      <template v-slot:item.actions="{index, item }">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn x-small class="mr-1 mb-1 mt-1 accent" v-bind="attrs"
                                   v-on="on" fab @click="viewInvoice(item)">
                              <v-icon color="white">mdi-printer</v-icon>
                            </v-btn>
                          </template>
                          <span>Invoice</span>
                        </v-tooltip>
                        <v-tooltip bottom v-if="item.payment_status !='paid'">
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn x-small class="mr-1 mb-1 mt-1 accent warning" v-bind="attrs"
                                   v-on="on" fab :to="'/order/payment/'+item.id">
                              <v-icon color="white">mdi-cash-clock</v-icon>
                            </v-btn>
                          </template>
                          <span>Pay Now</span>
                        </v-tooltip>
                      </template>
                    </v-data-table>
                  </v-card>
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
                                <td>Order Id</td>
                                <td>#{{ selectedInvoice.id }}</td>
                              </tr>
                              <tr class="table-text">
                                <td colspan="2">Courses</td>
                              </tr>
                              <template v-for="(cs,index) in selectedInvoice.studentCourses">
                                <tr class="table-text" :key="index">
                                  <td><span v-if="cs.course">{{ cs.course.name }}</span></td>
                                  <td><span >{{ cs.amount }}</span></td>
                                </tr>
                              </template>
                              <tr class="table-text">
                                <td>Discount</td>
                                <td>{{ selectedInvoice.discount_amount }}</td>
                              </tr>
                              <tr class="table-text">
                                <td>Tax</td>
                                <td>{{ selectedInvoice.tax_amount }}</td>
                              </tr>
                              <tr class="table-text">
                                <td>Total</td>
                                <td>{{ selectedInvoice.total }}</td>
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
                </v-container>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/user/Sidebar";
import {common as commonMixin} from "@/mixins/common";
import ReportHead from "@/components/report/ReportHead";
import {mapGetters} from "vuex";
const stateName = 'orders'
const storeName='student/order'
export default {
  name: 'studentOrder',
  components: {Sidebar, ReportHead },
  mixins: [commonMixin],
  data() {
    return {
      pageInfo: {
        pageName: 'Orders ',
        apiUrl: '#',
      },
      selected: [],
      selectedItem:{},
      options: {},
      dialog: false,
      dialog2: false,
      editIndex: -1,
      editMode:false,
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      search: '',
      timeout: null,
      headers: [
        {
          text: 'Date',
          align: 'start',
          value: 'created_at'
        },
        {
          text: '#Order Id',
          align: 'start',
          value: 'id'
        },
        {
          text: 'Total($)',
          align: 'start',
          value: 'total'
        },
        {
          text: 'Tnx Number',
          align: 'start',
          value: 'tnx'
        },
        {
          text: 'Payment Type',
          align: 'start',
          value: 'payment_method'
        },
        {
          text: 'Gateway Receipt',
          align: 'start',
          value: 'receipt'
        },
        {
          text: 'Payment Status',
          align: 'start',
          value: 'payment_status'
        },
        {
          text: 'actions',
          align: 'start',
          value: 'actions'
        },
      ],
      selectedInvoice:{},
      footerProps: {
        itemsPerPageOptions: [10,20, 50, 100, 500]
      },
    }
  },
  computed: {
    ...mapGetters('student/order',['orders','totalItems']),
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
  async mounted() {
    this.loader.isLoading=true;
    await this.init();
    this.loader.isLoading=false;
  },
  methods: {
    async init() {
      this.loader.isLoading = true
      let url = `/student/all/orders/?per_page=${this.options.itemsPerPage}&page=${this.options.page}`

      if (this.search.length >= 3) {
        url += `&search=${this.search}`
      }
      const payload1 = {apiUrl: url, stateName}
      await this.$store.dispatch(storeName+'/getItems', payload1)
      this.loader.isLoading = false
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
