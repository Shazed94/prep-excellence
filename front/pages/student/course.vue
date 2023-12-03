<template>
  <div class="user-dashboard-area">
    <div class="btcontainer">
      <div class="up_wrap">
        <div class="btrow">
          <sidebar class="mt-1"/>
          <!-- main content -->
          <div class="btcol-md-6 btcol-lg-9">
            <div class="up_content_wrap">
              <!-- user calender -->
              <div class="card shadow my-4">
                <v-card-title class="primary_header fs-4">
                  {{ pageInfo.pageName}}
                </v-card-title>
                <div class="card-body">
                  <div class="dashboard_items">
                    <!-- course section -->
                    <div class="schedule-course-area py-5" >
                      <v-row v-if="loader.isLoading">
                        <v-col
                          cols="12"
                          md="4"
                        >
                          <v-skeleton-loader
                            class="mx-auto"
                            max-width="300"
                            type="card"
                          ></v-skeleton-loader>
                        </v-col>
                        <v-col
                          cols="12"
                          md="4"
                        >
                          <v-skeleton-loader
                            class="mx-auto"
                            max-width="300"
                            type="card"
                          ></v-skeleton-loader>
                        </v-col>
                        <v-col
                          cols="12"
                          md="4"
                        >
                          <v-skeleton-loader
                            class="mx-auto"
                            max-width="300"
                            type="card"
                          ></v-skeleton-loader>
                        </v-col>
                      </v-row>
                      <div v-else class="btcontainer">
                        <div class="btrow  single-course" v-for="(cous,key) in student_courses" :key="key">
                          <div class="btcol-xl-3 btcol-lg-3 btcol-12">
                              <div class="schedule-course-header">
                                <div class="course-header__thumbnail" v-if="cous.course">
                                  <!-- <nuxt-link :to="`/course/${cous.course.id}`" target="_blank"> -->
                                    <img :src="cous.course.image" :alt="cous.course.name" class="img-fluid">
                                  <!-- </nuxt-link> -->
                                </div>
                              </div>
                          </div>
                          <div class="btcol-lg-9 btcol-xl-9 btcol-md-9">
                            <!-- Course Start -->
                            <div class="course-item aos-init aos-animate" data-aos="fade-up" data-aos-duration="1000">
                              <div class="course-level m-0" style="height: 8%;padding:5px;" v-if="cous.course && cous.course.courseSchedules">
                                <div class="course-cat" >
                                  <span>Total Lessons: {{ cous.course.courseSchedules.length }}</span>
                                </div>
                                <div class="course-student">
                                  <span>Completed Lessons: {{ completeTotal(cous.course.courseSchedules) }} /{{ cous.course.courseSchedules.length }}</span>
                                </div>
                              </div>
                              <div class="" v-if="cous.course">
                                <h3 class="course__title"><nuxt-link :to="`/course/${cous.course.id}`" target="_blank">{{  cous.course.name }}</nuxt-link></h3>

                              </div>
                              <div class="schedule-button">
                                <!-- buy now button -->
                                  <v-btn x-small class="mr-1 accent" @click="viewSchedule(cous)">
                                    Schedule
                                  </v-btn>
<!--                                  <v-btn x-small class="mr-1 accent" @click="viewAttendance(cous)">
                                    Attendance
                                  </v-btn>-->
                                <v-btn x-small class="mr-1 accent" to="/student/attendance">
                                  Attendance
                                </v-btn>
                                  <v-btn v-if="$auth.user.role_id === 3" x-small class="mr-1 accent" to="/student/exam/exam">
                                    Results
                                  </v-btn>
                                  <v-btn v-if="$auth.user.role_id === 4" x-small class="mr-1 accent" to="/parent/result">
                                    Results
                                  </v-btn>
                              </div>
                            </div>
                            <!-- Course End -->
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
                    <v-card-subtitle class="text-center">{{  (selectedItem.course ? selectedItem.course.name : '') +' '+ 'Schedule' }}</v-card-subtitle>
                    <v-simple-table v-if="selectedItem.course">
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
                            Instructor
                          </th>
                          <th class="text-left">
                            Time
                          </th>
                          <th class="text-left">
                            Class
                          </th>
                          <th class="text-left">
                            Class Link
                          </th>
                          <th class="text-left">
                            Status
                          </th>
<!--                          <th class="text-left">
                            Actions
                          </th>-->
                        </tr>
                        </thead>
                        <tbody>
                        <tr
                          v-for="(item,key ) in selectedItem.course.courseSchedules"
                          :key="key"
                        >
                          <td>{{ item.date }}</td>
                          <td>{{ item.day }}</td>
                          <td>
                            {{ findEmployeeName(item.employee_id) }}
                          </td>
                          <td>
                            <span>
                              {{ item.start_time? $moment(item.start_time,'hh:mm:ss').format('hh:mm a'):'Complete Before' }}
                            </span>
                            <span>
                              {{' - ' + $moment(item.end_time,'hh:mm:ss').format('hh:mm a') }}
                            </span>
                          </td>
                          <td>{{ item.classes }}</td>
                          <td>
                            <a v-if="item.class_link" :href="item.class_link" target="_blank">Click here</a>
                            <p v-else>Not Available</p>
                          </td>
                          <td>{{ item.status===0 ? 'Pending':item.status===1?'Complete':'Cancel' }}</td>
<!--                          <td>
                            <v-btn x-small class="mr-1 accent" color="primary">
                              Completed
                            </v-btn>
                            <v-btn x-small class="mr-1 accent error">
                              No Show
                            </v-btn>
                          </td>-->
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
          <v-dialog v-model="dialog3" persistent max-width="1000">
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
                    <v-card-subtitle class="text-center">{{  (selectedItem.course ? selectedItem.course.name : '') +' '+ 'Schedule' }}</v-card-subtitle>
                    <v-simple-table v-if="selectedItem.course">
                      <template v-slot:default>
                        <thead>
                        <tr>
                          <th class="text-left">
                            Date
                          </th>
                          <th class="text-left">
                            Status
                          </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr
                          v-for="(item,key ) in selectedItem.course.attendanceStudents"
                          :key="key"
                        >
                          <td>{{ item.date }}</td>
                          <td>{{ item.attendanceStatus?item.attendanceStatus.name:'' }}</td>
                        </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-container>
                </v-sheet>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="mr-2 error darken-1 white--text" depressed @click=" dialog3 = false">Close</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/user/Sidebar";
import {common as commonMixin} from "@/mixins/common";
import {mapGetters} from "vuex";
const stateName = 'student_courses'
const storeName='student/course'

export default {
  name: 'studentCourse',
  components: {Sidebar },
  mixins: [commonMixin],
  data() {
    return {
      pageInfo: {
        pageName: 'Student Course',
        apiUrl: '/student/all/course/',
        permission: ''
      },
      state: {
        name: stateName,
        store_name: storeName,
      },
      selected: [],
      selectedItem:{},
      options: {},
      dialog: false,
      dialog2: false,
      dialog3: false,
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
        {
          text: 'Action',
          value: 'actions'
        },
      ],
      footerProps: {
        itemsPerPageOptions: [20, 50, 100, 500]
      },
      instructors:[],
    }
  },
  computed: {
    ...mapGetters('student/course',['student_courses','totalItems']),
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
    selectedItem(){
      this.instructors = this.selectedItem.course ? this.selectedItem.course.employees : []
    }
  },
  async mounted() {
    this.loader.isLoading=true;
    await this.init();
    this.loader.isLoading=false;
  },
  methods: {
    findEmployeeName(id){
      let emp = this.instructors.find(item=>item.id === id);
      if (emp) return emp.userable.name
      else return null
    },
    async init() {
      this.loader.isLoading = true
      let url = `/student/all/course?per_page=20&page=1`
      if (this.search.length > 3) {
        url += `&search=${this.search}`
      }
      const payload = {apiUrl: url, stateName}
      await this.$store.dispatch(storeName+'/getItems', payload)
      this.loader.isLoading = false
    },
    viewSchedule(item){
      this.selectedItem = item
      this.dialog2=true
    },
    viewAttendance(item){
      this.selectedItem = item
      this.dialog3=true
    },
    completeTotal(schedules){
      let total=0
      if (schedules.length){
          return schedules.filter(item=>item.status !== 0).length;
      }
      return total;
    },
    closeSchedule(){
      this.dialog2=false
      this.selectedItem={}
    },
  }
}
</script>
