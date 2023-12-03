<template>
  <v-container fluid>
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: 'Mange Course',disabled: false, href: '/admin/course/course'},{text: `${pageInfo.pageName}`,disabled: true, href: '/admin/course/scheduleCancelRequest'}]"
    />
    <v-card>
      <v-data-table
        dense
        v-model="selected"
        item-key="id"
        show-select
        :headers="headers"
        :items="schedule_cancel_requests"
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
            <v-dialog v-model="dialog" persistent max-width="500">
              <v-card>
                <validation-observer ref="observer" v-slot="{ invalid }">
                  <v-form ref="form" @submit.prevent="submitData()">
                    <v-card-title class="text-h5"> {{ pageInfo.pageName | capitalize }}</v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row dense>
                          <v-col cols="12" xs="12" sm="12" v-if="form.status === 1">
                            <validation-provider
                              v-slot="{ errors }"
                              name="employee"
                              vid="employee"
                              rules="">
                              <v-autocomplete
                                v-model="form.employee_id"
                                :items="only_employees"
                                :error-messages="errors"
                                item-text="employee_id"
                                item-value="id"
                                label="Select referer employee"
                                dense
                                clearable
                                hide-details="auto"
                                outlined>
                                <template v-slot:selection="data">
                                  <v-chip
                                    v-bind="data.attrs"
                                    :input-value="data.selected"
                                  >
                                    <v-avatar left>
                                      <v-img :src="data.item.userable.image"></v-img>
                                    </v-avatar>
                                    {{ data.item.userable.name }}
                                  </v-chip>
                                </template>
                                <template v-slot:item="data">
                                  <template v-if="typeof data.item !== 'object'">
                                    <v-list-item-content v-text="data.item"></v-list-item-content>
                                  </template>
                                  <template v-else>
                                    <v-list-item-avatar>
                                      <img :src="data.item.userable.image" alt="">
                                    </v-list-item-avatar>
                                    <v-list-item-content>
                                      <v-list-item-title v-html="data.item.userable.name"></v-list-item-title>
                                      <v-list-item-subtitle v-html="data.item.employee_id"></v-list-item-subtitle>
                                      <v-list-item-subtitle v-html="data.item.userable.phone_number"></v-list-item-subtitle>
                                    </v-list-item-content>
                                  </template>
                                </template>
                              </v-autocomplete>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12">
                            <validation-provider
                              v-slot="{ errors }"
                              name="note"
                              vid="note"
                              rules=""
                            >
                              <v-textarea
                                v-model="form.note"
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
        <template v-slot:item.name="{item }">
          <template v-if="item.user">
            {{ item?.user?.first_name }}{{' '}}
            {{ item?.user?.last_name }}<br>
            {{ item?.user?.phone_number }}<br>
          </template>
        </template>
        <template v-slot:item.c_date="{item }">
          <template v-if="item.course_schedule"> {{ moment(item.course_schedule.date).format('ll')}}</template>
        </template>
        <template v-slot:item.employee_id="{item }">
          <template v-if="item.employee">
            {{ item?.employee?.userable?.first_name }}{{' '}}
            {{ item?.employee?.userable?.last_name }}<br>
            {{ item?.employee?.employee_id }}<br>
            {{ item?.employee?.userable?.phone_number }}<br>
          </template>
        </template>
        <template v-slot:item.time="{item }">
          {{ item.course_schedule ? moment(item.course_schedule.start_time,'hh:mm').format('hh:mm a') +'-'+ moment(item.course_schedule.end_time,'hh:mm').format('hh:mm a') :'' }}<br>
        </template>
        <template v-slot:item.status="{item }">
          <span v-if="item.status === 0 " style="color: #545406"> Pending </span>
          <span v-else-if="item.status === 1 " style="color: green"> Approved </span>
          <span v-else-if="item.status === 2 " style="color: red"> Canceled </span>
        </template>
        <template v-slot:item.actions="{index, item }">
          <v-btn x-small class="mr-1 accent" v-if="$can('edit',pageInfo.permission)" @click="approveOrCancel(item, 1)">
            Approve
          </v-btn>
          <v-btn color="error" x-small  v-if="$can('edit',pageInfo.permission)" @click="approveOrCancel(item, 2)">
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
import BreadCrumbs from "~/components/common/BreadCrumbs";
import {common as commonMixin} from "@/mixins/common";
import {mapGetters} from "vuex";
import moment from "moment-timezone";
const permission = 'Schedule Cancel Request'
const stateName = 'schedule_cancel_requests'
const storeName='admin/schedule_cancel_request'

export default {
  name: 'CancelRequest',
  head: {
    title: 'schedule cancel request',
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
        pageName: 'Course Schedule Approve/Cancel Requests',
        apiUrl: '/course-schedule/cancel/request/',
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
      form: {
        employee_id: null,
        note: null,
        status:0,
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
          text: 'Course',
          align: 'start',
          value: 'course_schedule.course.name'
        },
        {
          text: 'Date',
          align: 'start',
          value: 'c_date'
        },
        {
          text: 'Time',
          align: 'start',
          value: 'time'
        },
        {
          text: 'Class',
          align: 'start',
          value: 'course_schedule.classes'
        },
        {
          text: 'Name',
          align: 'start',
          value: 'name'
        },
        {
          text: 'Reason',
          align: 'start',
          value: 'reason'
        },
        {
          text: 'Refer Employee',
          align: 'start',
          value: 'employee_id'
        },
        {
          text: 'Status',
          value: 'status'
        },
        {text: 'Actions', value: 'actions', sortable: false}
      ],
      footerProps: {
        itemsPerPageOptions: [20, 50, 100, 500]
      }
    }
  },
  computed: {
    ...mapGetters('admin/schedule_cancel_request',['schedule_cancel_requests','totalItems']),
    ...mapGetters('admin/employee',['only_employees']),
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
    const payload1 = {apiUrl: '/employee/all/active', stateName:'only_employees'}
    await this.$store.dispatch('admin/employee/getItems2', payload1)
    this.loader.isLoading=false;
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
    approveOrCancel(item, status) {
      this.selectedItem = item
      this.form = {
        employee_id: item.employee_id,
        note: item.note,
        status: status,
      }
      this.dialog = true
    },
    async submitData() {
      this.loader.isSubmitting = true
      const formData = this.$generateFormData(this.form, false)
      let url = this.pageInfo.apiUrl + this.selectedItem.id

      await this.$axios.post(url, formData).then((response) => {
        //this.addOrUpdateState(response, stateName, storeName)
        this.$toaster.success(response.data.message)
        this.closeModal()
        this.init();
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
