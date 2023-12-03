<template>
  <v-container fluid>
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: 'Job',disabled: false, href: '/admin/job'},{text: `${pageInfo.pageName}`,disabled: true, href: '/admin/job/applicant'}]"
    />
    <v-card>
      <v-card-title>
<!--        <div style="max-width: 200px;" class="mt-3 mr-2">
          <v-autocomplete
            v-model="filter.category_id"
            :items="course_categories"
            label="Select Category"
            item-text="name"
            item-value="name"
            append-icon="mdi-package-variant-closed"
            required
            clearable
            dense
            outlined
          ></v-autocomplete>
        </div>-->
        <div style="max-width: 200px;" class="mt-3 mr-2">
          <v-autocomplete
            v-model="filter.status"
            :items="ap_status"
            label="Select Status"
            item-text="name"
            item-value="id"
            clearable
            dense
            outlined
          ></v-autocomplete>
        </div>
        <div style="max-width: 200px;" class="mt-3 mr-2">
          <v-autocomplete
            v-model="filter.job_id"
            :items="only_jobs"
            label="Select Job"
            item-text="title"
            item-value="id"
            append-icon="mdi-package-variant-closed"
            required
            clearable
            dense
            outlined
          ></v-autocomplete>
        </div>
        <div class="mr-2" style="max-width: 200px">
          <v-menu
            v-model="start_menu"
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
              @input="start_menu = false"
            ></v-date-picker>
          </v-menu>
        </div>
        <div class="mr-2" style="max-width: 180px">
          <v-menu
            v-model="end_menu"
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
              @input="end_menu = false"
            ></v-date-picker>
          </v-menu>
        </div>
      </v-card-title>
      <v-data-table
        dense
        v-model="selected"
        item-key="id"
        show-select
        :headers="headers"
        :items="applicants"
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
          </v-toolbar>
        </template>
        <template v-slot:item.status="{ index, item }">
          {{ ap_status[item.status]['name'] }}
        </template>
        <template v-slot:item.cv_file="{ index, item }">
          <a :href="item.cv_file" target="_blank">View</a>
        </template>
        <template v-slot:item.actions="{index, item }" v-if="$can('status change',pageInfo.permission)">
          <applicant-preview :applicant="item"></applicant-preview>
          <v-btn x-small class="mr-1 accent" v-if="item.status === 0 " @click="customStatusChange(index,1,item.id,state.name,state.store_name,'status')">
            Pre-Select
          </v-btn>
          <v-btn v-if="item.status === 1" x-small class="mr-1 accent" @click="customStatusChange(index,2,item.id,state.name,state.store_name,'status')">
            Interviewing
          </v-btn>
          <v-btn v-if="item.status === 2" x-small class="mr-1 accent" @click="customStatusChange(index,3,item.id,state.name,state.store_name,'status')">
            Select
          </v-btn>
          <v-btn v-if="item.status === 3" x-small class="mr-1 accent" :to="`/admin/employee/manual/${item.id}`">
            Add To Employee
          </v-btn>

          <v-btn v-if="item.status !== 4" color="error" x-small class="mr-1 accent danger" @click="customStatusChange(index,4,item.id,state.name,state.store_name,'status')">
            Cancel
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import ExportExcel from '@/components/common/ExportExcel'
import ExportCsv from '@/components/common/ExportCsv'
import ExportPdf from '@/components/common/ExportPdf'
import BreadCrumbs from "../../../components/common/BreadCrumbs";
import FormImagePreview from '@/components/form/formImagePreview';
import Employee from "@/components/admin/employee/Employee";
import ApplicantPreview from "@/components/admin/job/ApplicantPreview.vue";
import {common as commonMixin} from "@/mixins/common";
import {mapGetters} from "vuex";
const permission = 'Applicant'
const stateName = 'applicants'
const storeName='admin/job/applicant'
export default {
  name: 'applicant',
  head: {
    title: 'Applicant',
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
    subject: 'Applicant'
  },
  components: {BreadCrumbs, ExportPdf, ExportCsv, ExportExcel,
    FormImagePreview, Employee, ApplicantPreview},
  mixins: [commonMixin],
  data() {
    return {
      pageInfo: {
        pageName: 'Applicant',
        apiUrl: '/applicant/',
        permission
      },
      state: {
        name: stateName,
        store_name: storeName,
      },
      customToolbar: [
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "code-block"]
      ],
      selected: [],
      options: {},
      dialog: false,
      editIndex: -1,
      editMode:false,
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      image: null,
      search: '',
      timeout: null,
      headers: [
        {
          text: 'SL',
          align: 'start',
          value: 'id'
        },
        {
          text: 'Name',
          align: 'start',
          value: 'name'
        },
        {
          text: 'Email',
          align: 'start',
          value: 'email'
        },
        {
          text: 'Phone Number',
          align: 'start',
          value: 'phone_number'
        },
        {
          text: 'CV',
          align: 'start',
          value: 'cv_file'
        },
        {
          text: 'Status',
          align: 'start',
          value: 'status'
        },
        {text: 'Actions', value: 'actions', sortable: false}
      ],
      footerProps: {
        itemsPerPageOptions: [20, 50, 100, 500]
      },
      start_menu: false,
      end_menu: false,
      ap_status:[{id:0,name:'Applied'}, {id:1,name:'Pre-Selected'}, {id:2,name:'Interviewing'}, {id:3,name:'Selected'}, {id:4,name:'Rejected'}],
      filter: {
        category_id: '',
        job_id: '',
        start_date: '',
        end_date: '',
        status: null,
      },
    }
  },
  computed: {
    ...mapGetters('admin/job/applicant',['applicants','totalItems']),
    ...mapGetters('admin/job/job',['only_jobs']),
    ...mapGetters('admin/courseCategory',['course_categories']),
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
    'filter.category_id'(value) {
      this.init()
    },
    'filter.job_id'(value) {
      this.init()
    },
    'filter.start_date'(value) {
      this.init()
    },
    'filter.end_date'(value) {
      this.init()
    },
    'filter.status'(value) {
      this.init()
    },
  },
  async mounted() {
    await this.init();
    const payload2 = {apiUrl: '/course-category/', stateName: 'course_categories'}
    if (!this.course_categories.length) await this.$store.dispatch('admin/courseCategory/getItems', payload2)

    const payload3 = {apiUrl: '/only/job/list', stateName: 'only_jobs'}
    if (!this.only_jobs.length) await this.$store.dispatch('admin/job/job/getItems2', payload3)

  },
  methods: {
    removeImage($emit, formElementName) {
      if (!formElementName) return
      if ($emit && (this.form[formElementName] && this.form[formElementName].length > 1))
        $emit ? this.form[formElementName].splice($emit, 1) : this.form[formElementName] = null
      else this.form[formElementName] = null
    },
    async init() {
      this.loader.isLoading = true
      let url = `${this.pageInfo.apiUrl}?per_page=${this.options.itemsPerPage}&page=${this.options.page}`
      if (this.search.length > 3) {
        url += `&search=${this.search}`
      }
      if (this.filter.category_id) url += `&category=${this.filter.category_id}`
      if (this.filter.job_id) url += `&job_id=${this.filter.job_id}`
      if (this.filter.start_date) url += `&start_date=${this.filter.start_date}`
      if (this.filter.end_date) url += `&end_date=${this.filter.end_date}`
      if (this.filter.status !== null) url += `&status=${this.filter.status}`
      const payload = {apiUrl: url, stateName}
      await this.$store.dispatch(storeName+'/getItems', payload)
      this.loader.isLoading = false
    },
  }
}
</script>
