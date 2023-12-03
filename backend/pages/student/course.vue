<template>
  <v-container fluid>
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: 'Course',disabled: true, href: '/student/course'}]"
    />
    <v-card>
      <v-data-table
        dense
        v-model="selected"
        item-key="id"
        show-select
        :headers="headers"
        :items="student_courses"
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
        <template v-slot:item.is_approved="{ index, item }">
          {{ item.is_approved?'Approved':'Pending'}}
        </template>
        <template v-slot:item.status="{ index, item }">
          {{ item.is_active?'Active':'Inactive'}}
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import ExportExcel from '@/components/common/ExportExcel'
import ExportCsv from '@/components/common/ExportCsv'
import ExportPdf from '@/components/common/ExportPdf'
import BreadCrumbs from "~/components/common/BreadCrumbs";
import {common as commonMixin} from "@/mixins/common";
const stateName = 'course_categories'
const storeName='admin/courseCategory'
export default {
  name: 'studentCourse',
  components: {BreadCrumbs, ExportPdf, ExportCsv, ExportExcel},
  mixins: [commonMixin],
  data() {
    return {
      pageInfo: {
        pageName: 'Student Course',
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
          text: 'Transaction No',
          align: 'start',
          value: 'transaction_no'
        },
        {
          text: 'Course Name',
          align: 'start',
          value: 'course.name'
        },
        {
          text: 'Course Amount',
          align: 'start',
          value: 'amount'
        },
        {
          text: 'Payment Type',
          align: 'start',
          value: 'payment_type'
        },
        {
          text: 'Payment Details',
          align: 'start',
          value: 'payment_details'
        },
        {
          text: 'Is Approved',
          value: 'is_approved'
        },
        {
          text: 'Status',
          value: 'status'
        },
      ],
      footerProps: {
        itemsPerPageOptions: [20, 50, 100, 500]
      },
      student_courses:[],
      totalItems:0,
    }
  },
  computed: {
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
  async mounted() {
    this.loader.isLoading=true;
    await this.init();
    this.loader.isLoading=false;
  },
  methods: {
    async init() {
      this.loader.isLoading = true
      let url = `/student/all/course?per_page=${this.options.itemsPerPage}&page=${this.options.page}`
      if (this.search.length > 3) {
        url += `&search=${this.search}`
      }
      this.$axios.get(url).then((response) => {
        this.student_courses=response.data.data;
        this.totalItems=response.data.meta.total;
      }).catch(() => {
        this.student_courses=[]
        this.totalItems=0
      })
      this.loader.isLoading = false
    },
  }
}
</script>
