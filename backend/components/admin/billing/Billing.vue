<template>
  <div class="mt-3">
    <v-card>
      <v-card-title>Over time</v-card-title>
      <v-data-table
        dense
        v-model="selected"
        item-key="id"
        show-select
        :headers="headers"
        :items="employee_over_times"
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
            <v-btn v-if="selectedIds.length && $can('read','Auth')" class="mr-2 green" :disabled="disableBill" depressed @click.prevent="prepareBill">Prepare Bill</v-btn>
          </v-toolbar>
        </template>
        <template v-slot:item.is_paid="{ index, item }">
          <span style="color:green;" v-if="item.is_paid">Yes</span>
          <span style="color:red;" v-else>No</span>
        </template>

        <template v-slot:item.actions="{index, item }">
          <v-btn x-small class="mr-1 accent" fab v-if="$can('read','Auth')">
            <v-icon>mdi-eye</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      v-model="dialog"
      max-width="500"
    >
      <v-card>
        <v-card-title class="text-h5">Bill Invoice</v-card-title>
        <v-card-text>
          <v-container class="d-flex" style="font-size:24px; font-weight:bold;">
            <h5 class="mr-2">Bill No:</h5>
            <copy-label :text="bill.invoice_no" />
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="error darken-1 white--text" depressed @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import ExportExcel from '@/components/common/ExportExcel'
import ExportCsv from '@/components/common/ExportCsv'
import ExportPdf from '@/components/common/ExportPdf'
import {common as commonMixin} from "@/mixins/common";
import CopyLabel from "@/components/common/CopyLabel";
import {mapGetters} from "vuex";
const permission = ''
const stateName = 'employee_over_times'
const storeName='admin/billing/employeeOverTime'

export default {
  name: 'Billing',
  components: {ExportPdf, ExportCsv, ExportExcel, CopyLabel},
  mixins: [commonMixin],
  props:{
    employee_id:{ require:true },
  },
  data() {
    return {
      pageInfo: {
        pageName: 'Hour Details',
        apiUrl: '/employee-over-time/',
        permission: ''
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
      bill:{},
      headers: [
        {
          text: 'SL',
          align: 'start',
          value: 'id'
        },
        {
          text: 'Date',
          align: 'start',
          value: 'date'
        },
        {
          text: 'Working Hour',
          align: 'start',
          value: 'working_hour'
        },
        {
          text: 'Hour Rate',
          align: 'start',
          value: 'hour_rate'
        },
        {
          text: 'is Billed',
          align: 'start',
          value: 'is_paid'
        },
        //{text: 'Actions', value: 'actions', sortable: false}
      ],
      footerProps: {
        itemsPerPageOptions: [20, 50, 100, 500]
      }
    }
  },
  computed: {
    ...mapGetters('admin/billing/employeeOverTime',['employee_over_times','totalItems']),
    selectedIds() {
      return this.selected.map((a) => a.id)
    },
    disableBill() {
      let value = false
      this.selected.forEach(item => {
        if(item.is_paid === 1 || item.is_paid === true) value = true
      })
      return value
    }
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
    await this.init();
  },
  methods: {
    async init() {
      this.loader.isLoading = true
      let url = `${this.pageInfo.apiUrl}by/${this.employee_id}?per_page=${this.options.itemsPerPage}&page=${this.options.page}`
      if (this.search.length > 3) {
        url += `&search=${this.search}`
      }
      const payload = {apiUrl: url, stateName}
      await this.$store.dispatch(storeName+'/getItems', payload)
      this.loader.isLoading = false
    },
    async prepareBill() {
      this.$swal?.fire({
        title: 'Are you sure?',
        icon: 'warning',
        text: "Do you want to continue?",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.loader.isDeleting = true

          const formData = new FormData();
          for (let i=0; i < this.selectedIds.length; i++){
            formData.append(`ids[${i}]`,this.selectedIds[i]);
          }
          formData.append('employee_id',this.$route.params.id);
          await this.$axios.post('/employee-payment/prepare/bill2', formData).then((response) => {
            this.$toaster.success('Bill generated successfully!')
            this.selected = []
            this.bill = response.data.data
          }).catch(() => {
            this.$toaster.error('Something went wrong!!')
          }).finally(() => {
            this.loader.isDeleting = false
            this.init()
          })
        }
      })
    },
  }
}
</script>
