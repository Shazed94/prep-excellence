<template>
  <v-container fluid>
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: 'Billing',disabled: true, href: '/admin/billing/workingHour'},{text: `${pageInfo.pageName}`,disabled: true, href: '/admin/billing/overTime'}]"
    />
    <v-card>
      <v-data-table
        dense
        v-model="selected"
        item-key="id"
        show-select
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
            <v-dialog v-model="dialog" persistent max-width="700">
<!--              <template v-slot:activator="{ on, attrs }">
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
              </template>-->
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
                                label="Date"
                                :error-messages="errors"
                                type="date"
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
                          <v-col cols="12" md="6" sm="12">
                            <validation-provider
                              v-slot="{ errors }"
                              name="status"
                              vid="status"
                              rules="required">
                              <v-select
                                v-model="form.status"
                                :items="ot_status"
                                :error-messages="errors"
                                item-text="name"
                                item-value="id"
                                label="Status"
                                dense
                                clearable
                                hide-details="auto"
                                outlined></v-select>
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
          <span v-if="item.is_paid">Yes</span>
          <span v-else>No</span>
        </template>
        <template v-slot:item.status="{ index, item }">
            <v-chip  v-if="item.status === 0" color="yellow" filter>Pending</v-chip>
            <v-chip  v-else-if="item.status === 1" color="green" filter>Approved</v-chip>
            <v-chip  v-else color="red" filter>canceled</v-chip>
        </template>
        <template v-slot:item.actions="{index, item }">
          <template v-if="item.is_paid === false">
            <v-tooltip bottom v-if="$can('edit',pageInfo.permission)">
              <template v-slot:activator="{ on, attrs }">
                <v-btn x-small class="accent" v-bind="attrs"
                       v-on="on" fab @click="approveOrCancel(item, 1)">
                  <v-icon>mdi-check-decagram</v-icon>
                </v-btn>
              </template>
              <span>Approve</span>
            </v-tooltip>
            <v-tooltip bottom v-if="$can('edit',pageInfo.permission)">
              <template v-slot:activator="{ on, attrs }">
                <v-btn x-small color="error" class="accent" v-bind="attrs"
                       v-on="on" fab @click="approveOrCancel(item, 2)">
                  <v-icon>mdi-cancel</v-icon>
                </v-btn>
              </template>
              <span>Canceled</span>
            </v-tooltip>
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
import {mapGetters} from "vuex";
const permission = 'Over Time'
const stateName = 'over_times'
const storeName='admin/billing/overTime'

export default {
  name: 'OTime',
  head: {
    title: 'Over Time',
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
    subject: 'Over Time'
  },
  components: {BreadCrumbs, ExportPdf, ExportCsv, ExportExcel},
  mixins: [commonMixin],
  data() {
    return {
      pageInfo: {
        pageName: 'Over Time',
        apiUrl: '/employee-over-time/',
        permission
      },
      state: {
        name: stateName,
        store_name: storeName,
      },
      ot_status:[
        {id:0, name:'Pending'},
        {id: 1, name:'Approve'},
        {id:2, name:'Cancel'},
      ],
      selected: [],
      options: {},
      dialog: false,
      editIndex: -1,
      editMode:false,
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      image:null,
      form: {
        employee_id: null,
        date: null,
        work_type:'',
        working_hour:null,
        hour_rate: null,
        status: 1,
        note: '',
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
          text: 'Employee',
          align: 'start',
          value: 'employee'
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
          text: 'Hour rate',
          align: 'start',
          value: 'hour_rate'
        },
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
    ...mapGetters('admin/billing/overTime',['over_times','totalItems']),
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
      if (this.search.length >= 3) {
        url += `&search=${this.search}`
      }
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
    approveOrCancel(item, status) {
      this.selectedItem = item
      this.editMode = true
      this.editIndex = this.over_times.indexOf(item)
      this.form = {
        date: item.date,
        working_hour: item.working_hour,
        hour_rate: item.hour_rate,
        note: item.note,
        status: status,
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
