<template>
  <v-container fluid>
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: 'Tutoring',disabled: true, href: '/admin/tutoring_request'}]"
    />
    <v-card>
      <validation-observer ref="observer" v-slot="{ invalid }">
        <v-form ref="form" @submit.prevent="submitData()">
          <v-card-title class="text-h5"> Tutoring Request Hourly Rate</v-card-title>
          <v-card-text>
            <v-container>
              <v-row dense>
                <v-col cols="12" md="3">
                  <validation-provider
                      v-slot="{ errors }"
                      name="hourly rate"
                      vid="hour_rate"
                      rules="required|min_value:1|max_value:1000"
                  >
                    <v-text-field
                        v-model="form.hour_rate"
                        label="Hourly Rate"
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
                <v-col cols="12" md="3">
                  <validation-provider
                      v-slot="{ errors }"
                      name="discount after(Hour)"
                      vid="hour_rate_after"
                      rules="min_value:1|max_value:1000"
                  >
                    <v-text-field
                        v-model="form.hour_rate_after"
                        label="Discount After(Hour)"
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
                <v-col cols="12" md="3">
                  <validation-provider
                      v-slot="{ errors }"
                      name="discount hourly rate"
                      vid="hour_rate2"
                      :rules="form.hour_rate_after?'required|min_value:1|max_value:1000':'min_value:1|max_value:1000'"
                  >
                    <v-text-field
                        v-model="form.hour_rate2"
                        label="Discount Hour Rate"
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
                <v-col cols="12" md="3">
                  <v-btn
                      color="green darken-1"
                      class="mx-2 white--text"
                      type="submit"
                      :disabled="invalid"
                      :loading="loader.isSubmitting"
                      depressed>Update</v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-form>
      </validation-observer>
      <v-data-table
        dense
        v-model="selected"
        item-key="id"
        show-select
        :headers="headers"
        :items="tutoring_requests"
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
        <template v-slot:item.courses="{item }">
          <span v-for="(it,k) in jsonDecode(item.courses)" :key="k">{{ it.name }} : {{ it.hour}}h<br></span>
        </template>
        <template v-slot:item.created_at="{item }">
          {{ moment(item.created_at).format('DD-MM-Y') }}
        </template>
        <template v-slot:item.is_paid="{item }">
          {{ item.is_paid ? 'Paid' : 'Unpaid' }}
        </template>
        <template v-slot:item.actions="{index, item }">
          <v-btn color="error" x-small fab @click="deleteItem(item, index, state.store_name)" v-if="$can('remove',pageInfo.permission)">
            <v-icon>mdi-delete</v-icon>
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
import BreadCrumbs from "../../components/common/BreadCrumbs";
import {common as commonMixin} from "@/mixins/common";
import {mapGetters} from "vuex";
const permission = 'Tutoring Request'
const stateName = 'tutoring_requests'
const storeName='admin/tutoring_request'
import moment from "moment";
export default {
  name: 'TutoringRequest',
  head: {
    title: 'Tutoring Request',
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
  components: {BreadCrumbs, ExportPdf, ExportCsv, ExportExcel},
  mixins: [commonMixin],
  data() {
    return {
      moment,
      pageInfo: {
        pageName: 'Tutoring Request',
        apiUrl: '/tutoring/',
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
      filter: {
        type: '',
        start_date: '',
        end_date: '',
      },
      form:{
          hour_rate:0,
          hour_rate_after:null,
          hour_rate2:null,
      },
      hourly_rate:{},
      search: '',
      timeout: null,
      headers: [
        {
          text: 'SL',
          align: 'start',
          value: 'id'
        },
        {
          text: 'Tnx No',
          value: 'tnx_no'
        },
        {
          text: 'Student',
          value: 'user.name'
        },
        {
          text: 'phone Number',
          value: 'user.phone_number'
        },
        {
          text: 'Courses',
          value: 'courses'
        },
        {
          text: 'Total Hour',
          value: 'total_hour'
        },
        {
          text: 'Hour Rate',
          value: 'hour_rate'
        },
        {
          text: 'Amount',
          value: 'total_amount'
        },
        {
          text: 'Student Need',
          value: 'student_need'
        },
        {
          text: 'Day Time',
          value: 'day_time'
        },
        {
          text: 'Tutoring',
          value: 'day_time_tutoring'
        },
        {
          text: 'Referral',
          value: 'referral'
        },
        {
          text: 'Question',
          value: 'question'
        },
        {
          text: 'payment Status',
          value: 'is_paid'
        },
        {
          text: 'Purchases At',
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
    ...mapGetters('admin/tutoring_request',['tutoring_requests','totalItems']),
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
    hourly_rate: {
      handler() {
        this.form={
          hour_rate: this.hourly_rate.hour_rate??0,
          hour_rate_after:this.hourly_rate.hour_rate_after??null,
          hour_rate2:this.hourly_rate.hour_rate2??null,
        }
      },
      deep: true
    },
  },
  async mounted() {
    this.loader.isLoading = true
    await this.init();
    await this.init2();
    this.loader.isLoading = false
  },
  methods: {
    jsonDecode(data){
      try {
        return JSON.parse(data);
      }catch (e){
        return data;
      }
    },
    async init() {
      let url = `${this.pageInfo.apiUrl}?per_page=${this.options.itemsPerPage}&page=${this.options.page}`
      if (this.search.length >= 3) {
        url += `&search=${this.search}`
      }
      const payload = {apiUrl: url, stateName}
      await this.$store.dispatch(storeName+'/getItems', payload)
    },
    async init2() {
      let url = `/get/tutoring/fee/hourly`
      await this.$axios.get(url).then((response) => {
        this.hourly_rate = response.data.data
     }).catch(() => {
        this.hourly_rate = {}
      })
    },
    async submitData() {
      this.loader.isSubmitting = true
      const formData = this.$generateFormData(this.form, this.editIndex > -1)
      let url = '/tutoring/fee/store/update'
      await this.$axios.post(url, formData).then((response) => {
        this.hourly_rate = response.data.data
        this.$toaster.success(`${this.pageInfo.pageName} ${this.editMode ? 'updated' : 'created'} successfully!!`)
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
  }
}
</script>
