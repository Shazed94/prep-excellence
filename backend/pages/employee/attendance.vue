<template>
  <v-container fluid>
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: 'Course',disabled: false, href: '/employee/course'},{text: `${pageInfo.pageName}`,disabled: true, href: '/employee/attendance'}]"
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
        <template v-slot:item.category="{ index, item }">
          <ul>
            <li v-for="(cat, key) in item.courseCategories" :key="key">{{ cat.name}}</li>
          </ul>
        </template>
        <template v-slot:item.actions="{index, item }">
          <v-tooltip bottom v-if="$can('create',pageInfo.permission)">
            <template v-slot:activator="{ on, attrs }">
              <v-btn x-small class="accent" v-bind="attrs"
                     v-on="on" fab @click="viewSchedule(item)">
                <v-icon>mdi-calendar-check</v-icon>
              </v-btn>
            </template>
            <span>View Attendance</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn x-small class="accent" v-bind="attrs"
                     v-on="on" fab @click="viewSchedule(item)">
                <v-icon>mdi-calendar-edit</v-icon>
              </v-btn>
            </template>
            <span>Add New</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn x-small class="accent" v-bind="attrs" @click="openAttendance(item)"
                     v-on="on" color="green" fab >
                <v-icon>mdi-calendar-month-outline</v-icon>
              </v-btn>
            </template>
            <span>Take Attendance</span>
          </v-tooltip>
        </template>
      </v-data-table>
      <v-dialog v-model="dialog2" persistent max-width="1000"
                fullscreen
                hide-overlay
                transition="dialog-bottom-transition">
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
                      <td>{{ moment(item.date).format('MM-DD-Y') }}</td>
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
                        <v-btn x-small class="mr-1 accent success" v-if="item.status !== 1 && moment(item.date).format('YMMDD') <= moment().format('YMMDD')" @click="ssChange(key, item.id, 1)" color="primary">
                          Complete
                        </v-btn>
                        <v-btn x-small class="mr-1 accent error" v-if="item.status !== 2" @click="openReasonModal(key, item)">
                          Cancel/Reassign
                        </v-btn>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn x-small class="accent" v-bind="attrs" @click="findAttendances(item.id)"
                                   v-on="on" color="green" fab >
                              <v-icon>mdi-eye</v-icon>
                            </v-btn>
                          </template>
                          <span>Attendance View</span>
                        </v-tooltip>
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
      <v-dialog v-model="dialog4" persistent max-width="1000"
                fullscreen
                hide-overlay
                transition="dialog-bottom-transition">
        <v-card>
          <v-card-text>
            <div class="text-right">
              <v-btn
                ref="printBtn"
                v-print="`#printAttendance`"
                icon
              >
                <v-icon color="light-blue">mdi-printer</v-icon>
              </v-btn>
            </div>
            <v-sheet :id="`printAttendance`" style="margin:10px;">
              <v-container>
                <report-head></report-head>
                <v-card-subtitle class="text-center">{{  selectedItem.name +' '+ 'Attendance' }}</v-card-subtitle>
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">
                          Date
                        </th>
                      <th class="text-left">
                        Student Id
                      </th>
                      <th class="text-left">
                        Status
                      </th>
                    </tr>
                    </thead>
                    <tbody>
                      <tr
                      v-for="(item,key ) in attendances"
                      :key="key"
                    >
                        <td>{{ item.date }}</td>
                      <td>{{ item.student?item.student.student_id:'' }}</td>
                      <td>
                        {{ item.attendance_status?item.attendance_status.name:'' }}
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
            <v-btn class="mr-2 error darken-1 white--text" depressed @click="dialog4=false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <template>
        <v-row justify="center">
          <v-dialog
            v-model="dialog3"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
          >
            <v-card>
              <v-toolbar
                dark
                color="primary"
              >
                <v-btn
                  icon
                  dark
                  @click="dialog3 = false"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Take Attendance</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                  <v-btn
                    dark
                    text
                    @click="dialog3 = false"
                  >
                    Save
                  </v-btn>
                </v-toolbar-items>
              </v-toolbar>
              <validation-observer ref="observer" v-slot="{ invalid }">
                <v-form ref="form" @submit.prevent="submitData()">
                  <v-card-text>
                    <v-container>
                      <v-row dense>
                        <v-col cols="12" xs="12" sm="4">
                          <validation-provider
                            v-slot="{ errors }"
                            name="course"
                            vid="course"
                            rules="required">
                            <v-autocomplete
                              disabled
                              v-model="form.course_id"
                              :items="only_courses"
                              :error-messages="errors"
                              item-text="name"
                              item-value="id"
                              label="Course"
                              dense
                              clearable
                              hide-details="auto"
                              outlined></v-autocomplete>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" xs="12" sm="4">
                          <validation-provider
                            v-slot="{ errors }"
                            name="class"
                            vid="course_schedule_id"
                            rules="required">
                            <v-autocomplete
                              v-model="form.course_schedule_id"
                              :items="selectedItem.courseSchedules"
                              :error-messages="errors"
                              item-text="classes"
                              item-value="id"
                              label="Class"
                              dense
                              clearable
                              hide-details="auto"
                              outlined></v-autocomplete>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" xs="12" sm="12"></v-col>
                        <v-col cols="12" xs="12" sm="12">
                          <v-simple-table
                            fixed-header
                            height="300px"
                          >
                            <template v-slot:default>
                              <thead>
                              <tr>
                                <th class="text-left">
                                  Student Id
                                </th>
                                <th class="text-left">
                                  Status
                                </th>
                              </tr>
                              </thead>
                              <tbody>
                              <tr
                                v-for="(std, kk) in students" :key="kk"
                              >
                                <td>
                                  {{ std.student_id }}
                                  <p hidden>{{ form.student_ids[kk] = std.id}}</p>
                                </td>
                                <td>
                                  <validation-provider
                                    v-slot="{ errors }"
                                    name="status"
                                    vid="status"
                                    rules="required">
                                    <v-radio-group
                                      v-model="form.attendance_status_ids[kk]"
                                      row
                                    >
                                      <v-radio v-for="(st,k) in attendance_statuses" :key="k"
                                               :label="st.name"
                                               :value="st.id"
                                      ></v-radio>
                                    </v-radio-group>
                                  </validation-provider>
                                </td>
                              </tr>
                              </tbody>
                            </template>
                          </v-simple-table>
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
                    <v-btn class="mr-2 error darken-1 white--text" depressed @click="dialog3 = false">Close</v-btn>
                  </v-card-actions>
                </v-form>
              </validation-observer>
            </v-card>
          </v-dialog>
        </v-row>
      </template>
      <v-dialog v-model="dialog5" persistent max-width="500">
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
import moment from "moment-timezone";
import {mapGetters} from "vuex";
const permission = 'Employee Attendance'
const stateName = 'employee_courses'
const storeName='employee/employee_course'
export default {
  name: 'Attendance',
  head: {
    title: 'Attendance',
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
  components: {BreadCrumbs, ExportPdf, ExportCsv, ExportExcel, ReportHead},
  mixins: [commonMixin],
  data() {
    return {
      moment,
      pageInfo: {
        pageName: 'Attendance',
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
      dialog5: false,
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
          text: 'Action',
          value: 'actions',
          sortable:false
        },
      ],
      footerProps: {
        itemsPerPageOptions: [20, 50, 100, 500]
      },
      employee_courses:[],
      students:[],
      attendances:[],
      totalItems:0,

      form: {
        course_id: null,
        course_schedule_id:null,
        attendance_status_ids:[],
        student_ids:[],
        date:null,
      },
      selected_index:-1,
      reason:"",
      employee_id:null,
    }
  },
  computed: {
    ...mapGetters('employee/employee_course',['only_courses']),
    ...mapGetters('employee/attendance_status',['attendance_statuses']),
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
    'form.course_schedule_id'(){
      if (this.form.course_schedule_id){
        let ss = this.selectedItem.courseSchedules.find(item=>item.id === this.form.course_schedule_id)
        if(ss) this.form.date = ss.date
        else this.form.date=null
      }else{
        this.form.date=null
      }
    }
  },
  async mounted() {
    this.loader.isLoading=true;
    await this.init();
    const payload1 = {apiUrl: '/employee/only/course', stateName:'only_courses'}
    if (!this.only_courses.length) await this.$store.dispatch('employee/employee_course/getItems2', payload1)
    const payload2 = {apiUrl: '/employee/attendance/statuses', stateName:'attendance_statuses'}
    if (!this.attendance_statuses.length) await this.$store.dispatch('employee/attendance_status/getItems', payload2)

    const payload3 = {apiUrl: '/all/employee/basic/info', stateName:'employees'}
    if (!this.employees.length) await this.$store.dispatch('common/employee/getItems', payload3)

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
    async ssChange(index, id, value){
      let data = new FormData();
      data.append('reason',this.reason);
      if(this.employee_id) data.append('employee_id',this.employee_id);
      await this.$axios.post(`/employee/course/schedule/statusChange/${id}/${value}`,data).then((response)=>{
        this.$toaster.success(response.data.message);
        this.selectedItem.courseSchedules[index].status = value
        if (value === 2) this.closeReasonModal();
      }).catch((error)=>{
        this.$toaster.error(error.response.data.message);
      })
    },
    openAttendance(item){
      this.selectedItem =item;
      this.form.course_id=item.id
      this.findStudent()
      this.dialog3=true;
    },
    async findStudent(){
      await this.$axios.get(`/employee/get/students${this.selectedItem.id}`).then((response)=>{
        this.students = response.data.data;
      }).catch(()=>{
        this.students=[]
      })
    },
    async findAttendances(cs_id){
      await this.$axios.get(`/employee/attendance/find${this.selectedItem.id}/${cs_id}`).then((response)=>{
        this.attendances = response.data;
      }).catch(()=>{
        this.attendances=[]
      })
      this.dialog4=true
    },
    async submitData() {
      this.loader.isSubmitting = true
      const formData = this.$generateFormData(this.form, this.editIndex > -1)
      await this.$axios.post('/employee/attendance/store', formData).then((response) => {
        this.$toaster.success(response.data.message)
        this.closeModal();
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
    closeModal(){
      this.dialog3 =false
      this.$refs.form.reset()
      this.$refs.observer.reset()
    },
    openReasonModal(index, item){
      this.dialog5=true
      this.selected_index=index
      this.selectedItem2=item
    },
    closeReasonModal(){
      this.dialog5=false
      this.selectedItem2={}
    },
  }
}
</script>
