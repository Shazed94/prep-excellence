<template>
  <v-container fluid>
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: 'Billing',disabled: true, href: '/employee/billing'},{text: `${pageInfo.pageName}`,disabled: true, href: '/employee/billing/payment'}]"
    />
    <v-card>
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
          </v-toolbar>
        </template>
        <template v-slot:item.is_paid="{ index, item }">
          <span v-if="item.is_paid">Yes</span>
          <span v-else>No</span>
        </template>
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
const permission = 'My Payment'
const stateName = 'payments'
const storeName='employee/billing/payment'

export default {
  name: 'Payment',
  head: {
    title: 'Payment',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'Prepexcellence'
      }
    ],
  },
  meta:{
    action: 'read',
    subject: 'My Payment'
  },
  components: {BreadCrumbs, ExportPdf, ExportCsv, ExportExcel},
  mixins: [commonMixin],
  data() {
    return {
      pageInfo: {
        pageName: 'Payment',
        apiUrl: '/employee/billing/payment',
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
        {
          text: 'Note',
          align: 'start',
          value: 'note'
        },
        {
          text: 'is Paid',
          align: 'start',
          value: 'is_paid'
        },
      ],
      footerProps: {
        itemsPerPageOptions: [20, 50, 100, 500]
      }
    }
  },
  computed: {
    ...mapGetters('employee/billing/payment',['payments','totalItems']),
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
      let url = `${this.pageInfo.apiUrl}?per_page=${this.options.itemsPerPage}&page=${this.options.page}`
      if (this.search.length > 3) {
        url += `&search=${this.search}`
      }
      const payload = {apiUrl: url, stateName}
      await this.$store.dispatch(storeName+'/getItems', payload)
      this.loader.isLoading = false
    },
  }
}
</script>
