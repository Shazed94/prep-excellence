<template>
  <v-dialog
    v-model="dialog"
    max-width="1200"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="green"
        dark
        x-small
        fab
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-presentation</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-sheet>
        <v-container>
          <report-head></report-head>
          <v-row>
            <v-col cols="12" md="8">
              <div class="py-2">
                <h4 class="text-dark h6">COURSE SCHEDULE</h4>
              </div>
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
                        Instructor
                      </th>
                      <th class="text-left">
                        Time
                      </th>
                      <th class="text-left">
                        Course
                      </th>
                      <th class="text-left">
                        Class
                      </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr
                      v-for="(item,key ) in course.courseSchedules"
                      :key="key"
                    >
                      <td>{{ item.date }}</td>
                      <td>{{ item.day }}</td>
                      <td>{{ findEmployeeName(item.employee_id) }}</td>
                      <td>
                            <span>
                              {{ item.start_time?moment(item.start_time,'hh:mm:ss').format('hh:mm a'):'Complete Before' }}
                            </span>
                        <span>
                              {{' - ' + moment(item.end_time,'hh:mm:ss').format('hh:mm a') }}
                            </span>
                      </td>
                      <td>{{ item.course_name }}</td>
                      <td>{{ item.classes }}</td>
                    </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              <!-- course details -->
              <div class="mt-3 text-dark">
                <div v-html="course.course_outline"></div>
              </div>
              <!-- instructor rating -->
            </v-col>
            <v-col cols="12" md="4">
              <div class="tutor-course-price-preview btcol-xl-4 btcol-lg-4 btcol-md-6 btcol-12">
                <div class="course-card shadow-lg border bg-white border-gray-200 rounded p-2">
                  <div class="text-center">
                    <img class="img-fluid" :src="course.image" :alt="course.name">
                  </div>
                  <!-- contend -->
                  <div class="single-page-cart btcol-xl-4 btcol-lg-4 btcol-md-4 col-12 p-4">
                    <div class="tutor-course-price-preview__price">
                      <div class="tutor-course-price">
                        <span class="sale-price">${{ course.amount }}<span class="separator">.00</span></span>
                      </div>
                    </div>
                    <h4 class="material-include-title">Material Includes</h4>
                    <div class="d-flex text-secondary">
                      <span class="me-2"> <v-icon>mdi-calendar</v-icon></span>
                      <p>Start: {{ moment(course.start_date).format('MMMM Do YYYY') }} – {{ moment(course.end_date).format('MMMM Do YYYY') }}</p>
                    </div>
                    <div class="d-flex text-secondary me-2">
                      <span class="me-2"><v-icon>mdi-clock</v-icon></span>
                      <p>Class Times: {{ course.class_time }}</p>
                    </div>
                    <div class="d-flex text-secondary me-2">
                      <span class="me-2"><v-icon>mdi-map-marker</v-icon></span>
                      <p>Course Location: {{  course.course_location }}</p>
                    </div>
                    <div class="d-flex text-secondary me-2">
                      <span class="me-2"><v-icon>mdi-timer-sand-paused</v-icon></span>
                      <p>Duration: {{  course.courseSchedules.length }} Classes</p>
                    </div>
                  </div>
                  <!-- cart button -->
                  <div class="p-1">
                    <v-btn class="primary py-2 rounded-lg" color="primary">
                      <span class="mr-3"><v-icon>mdi-cart</v-icon></span>
                      Enroll Now
                    </v-btn>
                  </div>
                </div>
              </div>
              <div>
                <h4 class="h5 text-dark mb-3 font-weight-bold">Your Instructors</h4>

                <div class="p-4 border rounded shadow" v-for="(ins,key) in course.employees" :key="key">
                  <!-- image -->
                  <div class="tutor-instructor-image" align="center">
                    <img :src="ins.userable.image" :alt="ins.employee_id" class="img-fluid">
                  </div>
                  <!-- details -->
                  <div class="details ml-3 mt-2">
                    <h4 class="h5 mb-3 font-weight-bold">{{  ins.userable.name }}</h4>
                    <div class="tutor-instructor-meta mt-3">
                      <div class="d-flex text-secondary me-2">
                        <span class="me-1"> <v-icon>mdi-play</v-icon></span>
                        <span>1 Courses</span>
                      </div>
                      <div class="d-flex text-secondary me-2">
                        <span class="me-1"><v-icon>mdi-message</v-icon></span>
                        <span>0 Reviews</span>
                      </div>
                      <div class="d-flex text-secondary me-2">
                        <span class="me-1"> <v-icon>mdi-user</v-icon></span>
                        <span>0 Students</span>
                      </div>
                    </div>
                    <div class="button mt-5 text-emerald-600 uppercase text-lg  font-medium hover:text-yellow-600">
                      <nuxt-link class="text-decoration-none" to="">+ See More</nuxt-link>
                    </div>
                  </div>
                </div>

              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-sheet>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn class="mr-2 error darken-1 white--text" depressed @click="dialog = false">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from "moment-timezone";
import ReportHead from "@/components/report/ReportHead";
export default {
  name:'CourseDetails',
  components:{ReportHead},
  props:{
    course:{
      required:true,
      type:Object,
      default() {
        return {}
      }
    }
  },
  data(){
    return{
      moment,
      dialog: false,
      instructors:[],
    }
  },
  watch:{
    course(){
      this.instructors = this.course.employees ??[]
    }
  },
  methods:{
    findEmployeeName(id){
      let emp = this.instructors.find(item=>item.id === id);
      if (emp) return emp.userable.name
      else return null

    },
  }
}
</script>

<style>
.tutor-course-price .sale-price {
  font-size: 34px;
  line-height: 34px;
  font-weight: 700;
  color: #d31819;
}
h4.material-include-title {
  font-size: 20px;
  font-weight: 600;
  padding: 10px 0;
}
</style>
