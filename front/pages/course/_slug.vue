<template>
  <div class="">
    <!-- Breadcumb -->
    <bread-crumbs2 :title="course.name" :image="course.image" :items="[{title: course.name, link:'#', disabled:true}]"></bread-crumbs2>

    <!-- Breadcumb end -->

    <!-- course details -->
    <div class="py-2 px-20 bg-white">
      <div class="btcontainer">
        <div class="btrow">
          <!-- course description -->
          <div class="btcol-lg-8 px-2">
            <!-- course description -->
            <div class="">
              <!-- title -->
              <div class="">
                <h4 class=" text-2xl font-normal">Description</h4>
              </div>
              <!-- course schedule -->
              <div>
                <div class="py-2">
                  <h4 class="text-dark h6">COURSE SCHEDULE</h4>
                </div>
                <div>

                  <div class="relative overflow-x-auto shadow-sm rounded">
                    <v-data-table
                      :headers="headers"
                      :items="course.courseSchedules"
                      :page.sync="page"
                      :items-per-page="15"
                      hide-default-footer
                      class="elevation-1"
                      @page-count="pageCount = $event"
                    >
                      <template v-slot:item.instructor="{ index, item }">
                        {{  findEmployeeName(item.employee_id) }}
                      </template>
                      <template v-slot:item.date="{ index, item }">
                        {{  $moment(item.date).format('MM-DD-yyyy') }}
                      </template>
                      <template v-slot:item.time="{ index, item }">
                        {{ item.start_time?$moment(item.start_time,'hh:mm').format('hh:mm a'):'Complete before ' }}
                        {{ $moment(item.end_time,'hh:mm').format('hh:mm a') }}
                      </template>
                    </v-data-table>
                    <div class="text-center pt-2">
                      <v-pagination
                        v-model="page"
                        :length="pageCount"
                      ></v-pagination>
                    </div>
                  </div>
                </div>
                <!-- course details -->
                <div class="mt-3 text-dark">
                  <div v-html="course.course_outline"></div>
                </div>
                <!-- instructor rating -->

              </div>
            </div>
            <div class="btrow">
              <div class="btcol-xl-6 btcol-xl-6 btcol-lg-8 btcol-md-8 btcol-12">
                <div class="tutor-instructor my-10">
                    <!-- title -->
                    <div>
                      <h4 class="h5 text-dark mb-3 font-weight-bold">Your Instructors</h4>
                      <div class="p-4 border rounded shadow" v-for="(ins,key) in course.employees" :key="key">
                        <!-- image -->
                        <div class="tutor-instructor-image" align="center">
                          <nuxt-link :to="'/instructor/'+ins.id">
                            <img :src="ins.userable.image" width="100%" :alt="ins.employee_id" class="img-fluid">
                          </nuxt-link>
                        </div>
                        <!-- details -->
                        <div class="details ml-6 mt-3">
                          <h4 class="h5 mb-3 font-weight-bold">
                            <nuxt-link :to="'/instructor/'+ins.id">
                              {{  ins.userable.name }}
                            </nuxt-link>
                          </h4>
                          <div class="tutor-instructor-meta mt-3">
                            <div class="d-flex text-secondary me-2">
                              <span class="me-1"><font-awesome-icon :icon="['fa', 'play']"/></span>
                              <span>1 Courses</span>
                            </div>
                            <div class="d-flex text-secondary me-2">
                              <span class="me-1"><font-awesome-icon :icon="['fa', 'message']"/></span>
                              <span>0 Reviews</span>
                            </div>
                            <div class="d-flex text-secondary me-2">
                              <span class="me-1"><font-awesome-icon :icon="['fa', 'user']"/></span>
                              <span>0 Students</span>
                            </div>
                          </div>
                          <div class="button mt-5 text-emerald-600 uppercase text-lg  font-medium hover:text-yellow-600">
                            <nuxt-link class="text-decoration-none" :to="'/instructor/'+ins.id">+ See More</nuxt-link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </div>
          <!-- course card -->
          <div class="tutor-course-price-preview btcol-xl-4 btcol-lg-4 btcol-md-6 btcol-12">
            <div class="course-card shadow-lg border bg-white border-gray-200 rounded p-2">
              <div class="">
                <img class="img-fluid" width="100%" :src="course.image" :alt="course.name">
              </div>
              <!-- contend -->
              <div class="single-page-cart btcol-xl-4 btcol-lg-4 btcol-md-4 col-12 p-4">
                <div class="tutor-course-price-preview__price">
                  <div class="tutor-course-price">
                      <span class="sale-price">${{ course.amount }}<span class="separator">.00</span></span>
<!--                      <span class="regular-price">$76<span class="separator">.00</span></span>-->
                  </div>
<!--                  <div class="tutor-course-price-badge">39% off</div>-->
                </div>
                <h4 class="material-include-title">Material Includes</h4>
                <div class="d-flex text-secondary">
                  <span class="me-2"><font-awesome-icon :icon="['fa', 'calendar-days']"/></span>
                  <p>Start: {{ $moment(course.start_date).format('MMMM Do YYYY') }} – {{ $moment(course.end_date).format('MMMM Do YYYY') }}</p>
                </div>
                <div class="d-flex text-secondary me-2">
                  <span class="me-2"><font-awesome-icon :icon="['fa', 'clock']"/></span>
                  <p>Class Times: {{ course.class_time }}</p>
                </div>
<!--                <div class="d-flex text-secondary me-2">
                  <span class="me-2"><font-awesome-icon :icon="['fa', 'calendar']"/></span>
                  <p>Test Day: Done at Home</p>
                </div>-->
                <div class="d-flex text-secondary me-2">
                  <span class="me-2"><font-awesome-icon :icon="['fa', 'location-dot']"/></span>
                  <p>Course Location: {{  course.course_location }}</p>
                </div>
                <div class="d-flex text-secondary me-2">
                  <span class="me-2"><font-awesome-icon :icon="['fa', 'hourglass']"/></span>
                  <p v-if="course.courseSchedules">Duration: {{  course.courseSchedules.length }} Classes</p>
                </div>
<!--                <div class="d-flex text-secondary me-2">
                  <span class="me-2"><font-awesome-icon :icon="['fa', 'calendar']"/></span>
                  <p>Validity: Lifetime</p>
                </div>-->
              </div>
              <!-- cart button -->
              <div class="p-2" v-if="moment(course.end_date).format('YMMDD') >= moment().format('YMMDD')">
                <button @click="addToCart(course)" class="primary-bg text-white w-full py-2 rounded-lg">
                  <span class="mr-3"><font-awesome-icon :icon="['fa', 'cart-shopping']"/></span>
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- course details end -->
  </div>
</template>

<script>
import BreadCrumbs2 from "@/components/common/BreadCrumbs2";
import {mapActions} from "vuex";
import moment from "moment";
export default {
  name:'CourseDetails',
  auth:false,
  components:{BreadCrumbs2},
  data(){
    return{
      moment,
      page:1,
      pageCount:0,
      course:{},
      instructors:[],
      headers: [
        {
          text: 'Date',
          align: 'start',
          sortable: false,
          value: 'date',
        },
        { text: 'Day', value: 'day' },
        { text: 'Instructor', value: 'instructor' },
        { text: 'Time', value: 'time' },
        { text: 'Course', value: 'course_name' },
        { text: 'Class', value: 'classes' },
      ],
    }
  },
  fetch(){
    //this.init()
  },
  mounted() {
    this.init();
    this.getCartData();
  },
  watch:{
    course(){
      this.instructors = this.course.employees ??[]
    }
  },
  computed: {

  },
  methods:{
    ...mapActions('cart',['showOrHideCart']),
      findEmployeeName(id){
        let emp = this.instructors.find(item=>item.id === id);
        if (emp) return emp.userable.name
        else return null

      },
      async init(){
         await this.$axios.get(`/get/single/course/${this.$route.params.slug}`).then((response)=>{
              this.course=response.data.data
          }).catch(()=>{
            this.course={}
          })
      },

      getCartData() {
        if (process.client) {

          //console.log(JSON.parse(localStorage.getItem('cartItems')) ?? []);
        }
      },

      addToCart(course) {
        if (this.$auth.user && this.$auth.user.role_id !== 3){
          this.$toaster.error('Must be student for enroll');
        }else if (process.client) {
          let item = course;
          item = {...course, quantity: 1}

          if (localStorage.getItem("cartItems") === null) {
            localStorage.setItem('cartItems', JSON.stringify([]));
          }

          let cartItems = JSON.parse(localStorage.getItem('cartItems'));

          if (cartItems.length > 0) {
            let bool = cartItems.some(i => i.id === item.id);
            if (bool) {
              this.$toaster.error('Course already exists is your cart.');
            } else {
              cartItems.push(item);
              //state.totalCartItems++;
              localStorage.setItem('cartItems', JSON.stringify(cartItems));
               this.$toaster.success('Course Added successfully!');
               //window.location.reload();
            }
          } else {
             cartItems.push(item);
              //state.totalCartItems++;
              localStorage.setItem('cartItems', JSON.stringify(cartItems));
              this.$toaster.success('Course Added successfully!');
              //window.location.reload();
          }
          window.dispatchEvent(new CustomEvent('cart-localstorage-changed', {
            detail: {
              storage: localStorage.getItem('cartItems')
            }
          }));
          this.showOrHideCart({status:true})
        }
     }
  }
}
</script>

<style>

</style>
