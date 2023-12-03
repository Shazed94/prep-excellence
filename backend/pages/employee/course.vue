<template>
  <v-container fluid>
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: 'Course',disabled: true, href: '/employee/course'}]"
    />
    <v-card>
      <v-data-table
        dense
        v-model="selected"
        item-key="id"
        :headers="headers"
        :items="employee_courses"
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
        <template v-slot:item.sno="{ index, item }">
          {{ index+1 }}
        </template>
        <template v-slot:item.start_date="{ index, item }">
          {{ moment(item.start_date).format('MM-DD-YYYY') }}
        </template>
        <template v-slot:item.end_date="{ index, item }">
          {{ moment(item.end_date).format('MM-DD-YYYY') }}
        </template>
        <template v-slot:item.category="{ index, item }">
          <ul>
            <li v-for="(cat, key) in item.courseCategories" :key="key">{{ cat.name}}</li>
          </ul>
        </template>
        <template v-slot:item.actions="{index, item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn x-small class="accent" v-bind="attrs"
                     v-on="on" fab @click="viewSchedule(item)">
                <v-icon>mdi-clock-outline</v-icon>
              </v-btn>
            </template>
            <span>Schedule</span>
          </v-tooltip>
          <v-tooltip bottom v-if="$can('create',pageInfo.permission)">
            <template v-slot:activator="{ on, attrs }">
              <v-btn x-small class="accent" v-bind="attrs"
                     v-on="on" fab @click="addScheduleTime(item)">
                <v-icon>mdi-calendar-edit</v-icon>
              </v-btn>
            </template>
            <span>Schedule Add</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn x-small class="accent" v-bind="attrs" to="/employee/homeWork"
                     v-on="on" color="green" fab >
                <v-icon>mdi-home-city</v-icon>
              </v-btn>
            </template>
            <span>Home Works</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn x-small class="accent" color="blue" fab v-bind="attrs"
                     to="/employee/courseMaterial"
                     v-on="on">
                <v-icon>mdi-briefcase-upload-outline</v-icon>
              </v-btn>
            </template>
            <span>Course Materials</span>
          </v-tooltip>
        </template>
      </v-data-table>
      <v-dialog v-model="dialog2" persistent max-width="1000">
        <v-card>
          <v-card-text>
            <div class="text-right">
              <v-btn
                ref="printBtn"
                v-print="`#printSchedule`"
                icon
              >
                <v-icon color="light-blue">mdi-printer</v-icon>
              </v-btn>
            </div>
            <v-sheet :id="`printSchedule`" style="margin:10px;">
              <v-container>
                <report-head></report-head>
                <v-card-subtitle class="text-center">{{  selectedItem.name +' '+ 'Schedule' }}</v-card-subtitle>
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                      <th class="text-left">
                        Date
                      </th>
                      <th class="text-left">
                        Day
                      </th>
                      <th class="text-left">
                        Time
                      </th>
                      <th class="text-left">
                        Class
                      </th>
                      <th class="text-left">
                        Status
                      </th>
                      <th class="text-left">
                        Actions
                      </th>
                    </tr>
                    </thead>
                    <tbody>
                      <tr
                      v-for="(item,key ) in selectedItem.courseSchedules"
                      :key="key"
                    >
                      <td>{{moment(item.date).format('MM-DD-YYYY') }}</td>
                      <td>{{ item.day }}</td>
                      <td>
                        <span>
                          {{ item.start_time?moment(item.start_time,'hh:mm:ss').format('hh:mm a'):'Complete Before' }}
                        </span>
                        <span>
                            {{' - ' + moment(item.end_time,'hh:mm:ss').format('hh:mm a') }}
                          </span>
                      </td>
                      <td>{{ item.classes }}</td>
                      <td>
                        {{ item.status===0 ? 'Pending':item.status===1?'Complete':'Cancel' }}
                      </td>
                      <td>
                        <v-btn x-small class="mr-1 accent" v-if="item.status !== 1  && moment(item.date).format('YMMDD') <= moment().format('YMMDD')" @click="ssChange(key, item.id, 1)" color="primary">
                          Complete
                        </v-btn>
                        <v-btn x-small class="mr-1 accent error" v-if="item.status !== 2" @click="openReasonModal(key, item)">
                          Cancel/Reassign
                        </v-btn>
                      </td>
                    </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-container>
            </v-sheet>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="mr-2 error darken-1 white--text" depressed @click="closeSchedule()">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialog3" persistent max-width="500">
        <v-card>
          <validation-observer ref="observer" v-slot="{ invalid }">
            <v-form ref="form" @submit.prevent="ssChange(selected_index, selectedItem2.id, 2)">
              <v-card-title class="text-h5"> {{ 'Cancellation Form' | capitalize }}</v-card-title>
              <v-card-text>
                <v-container>
                  <v-row dense>
                    <v-col cols="12" sm="12">
                      <validation-provider
                        v-slot="{ errors }"
                        name="reason"
                        vid="reason"
                        rules="required"
                      >
                        <v-textarea
                          v-model="reason"
                          label="Reason for cancel"
                          :error-messages="errors"
                          dense
                          outlined
                          auto-grow
                          no-resize
                        ></v-textarea>
                      </validation-provider>
                    </v-col>
                    <v-col cols="12" xs="12" sm="12">
                      <validation-provider
                        v-slot="{ errors }"
                        name="employee"
                        vid="employee"
                        rules="">
                        <v-autocomplete
                          v-model="employee_id"
                          :items="employees"
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
                  {{ 'Save' }}
                </v-btn>
                <v-btn class="mr-2 error darken-1 white--text" depressed @click="closeReasonModal">Close</v-btn>
              </v-card-actions>
            </v-form>
          </validation-observer>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialog4" persistent max-width="800">
          <employee-schedule-add :item="selectedItem" @closeAddModal="closeAddModal"></employee-schedule-add>
      </v-dialog>
    </v-card>
  </v-container>
</template>

<script>
import ExportExcel from '@/components/common/ExportExcel'
import ExportCsv from '@/components/common/ExportCsv'
import ExportPdf from '@/components/common/ExportPdf'
import BreadCrumbs from "~/components/common/BreadCrumbs";
import {common as commonMixin} from "@/mixins/common";
import ReportHead from "@/components/report/ReportHead";
import EmployeeScheduleAdd from "@/components/employee/EmployeeScheduleAdd";
import moment from "moment-timezone";
import {mapGetters} from "vuex";
const permission = 'Employee Courses'
const stateName = 'employee_courses'
const storeName='employee/employee_course'
export default {
  name: 'studentCourse',
  head: {
    title: 'Courses',
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
  components: {BreadCrumbs, ExportPdf, ExportCsv, ExportExcel, ReportHead, EmployeeScheduleAdd},
  mixins: [commonMixin],
  data() {
    return {
      moment,
      pageInfo: {
        pageName: 'Assigned Courses',
        apiUrl: '/employee/',
        permission,
      },
      selected: [],
      selectedItem:{},
      selectedItem2:{},
      options: {},
      dialog: false,
      dialog2: false,
      dialog3: false,
      dialog4: false,
      editIndex: -1,
      editMode:false,
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      search: '',
      timeout: null,
      headers: [
        {
          text: 'SL',
          align: 'start',
          value: 'sno',
          sortable:false
        },
        {
          text: 'Batch',
          align: 'start',
          value: 'batch',
          sortable:false
        },
        {
          text: 'Course Name',
          align: 'start',
          value: 'name',
          sortable:false
        },
        {
          text: 'Start Date',
          align: 'start',
          value: 'start_date',
          sortable:false
        },
        {
          text: 'End Date',
          align: 'start',
          value: 'end_date',
          sortable:false
        },
        {
          text: 'Location',
          align: 'start',
          value: 'course_location',
          sortable:false
        },
        {
          text: 'Action',
          value: 'actions',
          sortable:false
        },
      ],
      footerProps: {
        itemsPerPageOptions: [10, 20, 50, 100, 500]
      },
      employee_courses:[],
      totalItems:0,
      selected_index:-1,
      reason:"",
      employee_id:null,
    }
  },
  computed: {
    ...mapGetters('common/employee',['employees']),
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
    const payload1 = {apiUrl: '/all/employee/basic/info', stateName:'employees'}
    if (!this.employees.length) await this.$store.dispatch('common/employee/getItems', payload1)
    this.loader.isLoading=false;
  },
  methods: {
    async init() {
      this.loader.isLoading = true
      let url = `/employee/all/course?per_page=${this.options.itemsPerPage}&page=${this.options.page}`
      if (this.search.length > 3) {
        url += `&search=${this.search}`
      }
      this.$axios.get(url).then((response) => {
        this.employee_courses=response.data.data;
        this.totalItems=response.data.meta.total;
      }).catch(() => {
        this.employee_courses=[]
        this.totalItems=0
      })
      this.loader.isLoading = false
    },
    viewSchedule(item){
      this.selectedItem = item
      this.dialog2=true
    },
    closeSchedule(){
      this.dialog2=false
      this.selectedItem={}
    },
    addScheduleTime(item){
      this.dialog4=true
      this.selectedItem=item
    },
    closeAddModal(){
      this.dialog4=false
      this.selectedItem= {}
      this.init()
    },
    async ssChange(index, id, value){
      let data =new FormData();
      data.append('reason',this.reason);
      this.employee_id ? data.append('employee_id',this.employee_id):'';
      await this.$axios.post(`/employee/course/schedule/statusChange/${id}/${value}`,data).then((response)=>{
        this.$toaster.success(response.data.message);
        this.selectedItem.courseSchedules[index].status = value
        if (value === 2) this.closeReasonModal();
      }).catch((error)=>{
        this.$toaster.error(error.response.data.message);
      })
    },
    openReasonModal(index, item){
      this.dialog3=true
      this.selected_index=index
      this.selectedItem2=item
    },
    closeReasonModal(){
      this.dialog3=false
      this.selectedItem2={}
    },
  }
}
</script>
