<template>
  <v-container fluid>
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: 'Billing',disabled: true, href: '/employee/billing'},{text: `${pageInfo.pageName}`,disabled: true, href: '/employee/billing/overTime'}]"
    />
    <v-card>
      <v-data-table
        dense
        v-model="selected"
        item-key="id"
        :headers="headers"
        :items="over_times"
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
            <v-toolbar-title v-if="$can('export',pageInfo.permission)">
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
            <v-dialog v-model="dialog" persistent max-width="700">
              <template v-slot:activator="{ on, attrs }">
                <!--                color="primary"-->
                <v-btn v-if="$can('create',pageInfo.permission)"
                       style="background: #01579B"
                       class="mx-2 white--text"
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
                          <v-col cols="12" md="6" sm="12">
                            <validation-provider
                              v-slot="{ errors }"
                              name="date"
                              vid="date"
                              rules="required"
                            >
                              <v-text-field
                                v-model="form.date"
                                clearable
                                clear-icon="mdi-close-circle"
                                label="Date*"
                                :error-messages="errors"
                                type="date"
                                :max="moment().format('YYYY-MM-DD')"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" md="6" sm="12">
                            <validation-provider
                              v-slot="{ errors }"
                              name="course"
                              vid="course_id"
                              rules="required"
                            >
                              <v-autocomplete
                                  v-model="form.course_id"
                                  :items="only_courses"
                                  :error-messages="errors"
                                  item-text="name"
                                  item-value="id"
                                  label="Course*"
                                  dense
                                  hide-details="auto"
                                  outlined></v-autocomplete>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" md="6" sm="12">
                            <validation-provider
                              v-slot="{ errors }"
                              name="working hour"
                              vid="working_hour"
                              rules="required|min_value:1|max_value:24"
                            >
                              <v-text-field
                                v-model="form.working_hour"
                                clearable
                                clear-icon="mdi-close-circle"
                                label="Working Hour*"
                                type="number"
                                step="any"
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" md="6" sm="12">
                            <validation-provider
                              v-slot="{ errors }"
                              name="hourly rate"
                              vid="hour_rate"
                              rules="required|min_value:1|max_value:1000"
                            >
                              <v-text-field
                                v-model="form.hour_rate"
                                clearable
                                clear-icon="mdi-close-circle"
                                label="Hourly Rate*"
                                type="number"
                                step="any"
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" md="12" sm="12">
                            <validation-provider
                              v-slot="{ errors }"
                              name="note"
                              vid="note"
                              rules="max:200"
                            >
                              <v-textarea
                                v-model="form.note"
                                clearable
                                clear-icon="mdi-close-circle"
                                label="note"
                                :error-messages="errors"
                                dense
                                outlined
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
        <template v-slot:item.sno="{ index, item }">
          {{ index +1 }}
        </template>
        <template v-slot:item.total="{ index, item }">
          {{ item.hour_rate * item.working_hour}}
        </template>
        <template v-slot:item.is_paid="{ index, item }">
          <span v-if="item.is_paid">Yes</span>
          <span v-else>No</span>
        </template>
        <template v-slot:item.status="{index, item }">
          <span v-if="item.status === 0 " style="color: #8a6d1a">Pending</span>
          <span v-else-if="item.status === 1 " style="color: green">Approved</span>
          <span v-else-if="item.status === 3 " style="color: red">Canceled</span>
        </template>
        <template v-slot:item.note="{index, item }">
          {{ item.note.substring(0,50)}}
        </template>
        <template v-slot:item.actions="{index, item }">
          <template v-if="item.status === 0 && item.is_paid === false ">
            <v-btn x-small class="mr-1 accent" fab @click="createOrUpdate(item)" v-if="$can('edit',pageInfo.permission)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn color="error" x-small fab @click="deleteItem(item, index, state.store_name)" v-if="$can('remove',pageInfo.permission)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>

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
import moment from "moment-timezone";
import {mapGetters} from "vuex";
const permission = 'My Over Time'
const stateName = 'over_times'
const storeName='employee/billing/overTime'

export default {
  name: 'WorkingHour',
  head: {
    title: 'My Over Time',
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
    subject: permission
  },
  components: {BreadCrumbs, ExportPdf, ExportCsv, ExportExcel},
  mixins: [commonMixin],
  data() {
    return {
      moment,
      pageInfo: {
        pageName: 'Over Time',
        apiUrl: '/employee/billing/employee-over-time/',
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
        date: null,
        work_type:'',
        course_id:null,
        working_hour:null,
        hour_rate: null,
        note: '',
      },
      search: '',
      timeout: null,
      headers: [
        {
          text: 'SL',
          align: 'start',
          value: 'sno'
        },
        {
          text: 'Date',
          align: 'start',
          value: 'date_us'
        },
        {
          text: 'Course',
          align: 'start',
          value: 'course.name'
        },
        {
          text: 'Working Hour',
          align: 'start',
          value: 'working_hour'
        },
        {
          text: 'Hourly rate',
          align: 'start',
          value: 'hour_rate'
        },
        {
          text: 'Total Amount($)',
          align: 'start',
          value: 'total'
        },
        {
          text: 'Note',
          align: 'start',
          value: 'note'
        },
        {
          text: 'Invoiced',
          align: 'start',
          value: 'is_paid'
        },
        {
          text: 'Status',
          value: 'status'
        },
        {text: 'Actions', value: 'actions', sortable: false}
      ],
      footerProps: {
        itemsPerPageOptions: [10, 20, 50, 100, 500]
      }
    }
  },
  computed: {
    ...mapGetters('employee/billing/overTime',['over_times','totalItems']),
    ...mapGetters('employee/employee_course',['only_courses']),
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
    const payload1 = {apiUrl: '/employee/only/course', stateName:'only_courses'}
    if (!this.only_courses.length) await this.$store.dispatch('employee/employee_course/getItems2', payload1)
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
    createOrUpdate(item = null) {
      if (item) {
        this.editIndex = this.over_times.indexOf(item)
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
          date: item.date,
          work_type: item.work_type,
          course_id: item.course_id,
          working_hour: item.working_hour,
          hour_rate: item.hour_rate,
          note: item.note,
        }
      } else {
        this.selectedItem = {}
        this.form = {
          date: null,
          course_id: null,
          work_type:'',
          working_hour:null,
          hour_rate: null,
          note: '',
        }
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
        if (!this.over_times.length) this.init()
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
