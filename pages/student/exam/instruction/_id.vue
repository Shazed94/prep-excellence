<template>
  <div class="user-dashboard-area">
    <div class="btcontainer">
      <div class="up_wrap">
        <div class="btrow">
          <sidebar/>
          <!-- main content -->
          <div class="btcol-md-6 btcol-lg-9">
            <div class="up_content_wrap">
              <template v-if="loader.isLoading">
                <!-- Breadcumb -->
                <div class="breadcrumbs-area">
                  <div class="btcontainer">
                    <div class="btrow">
                      <div class="d-flex flex-col">
                        <div class="d-flex flex-col">
                          <svg class="" style="height:25px;" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg> <a class="text-decoration-none" href="">Home</a>
                        </div>
                        <div class="d-flex flex-col">
                          <svg class="" style="height:25px;" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                          </svg> <a class="text-decoration-none" href="#"></a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Breadcumb end -->

                <v-sheet
                  :color="`grey lighten-4`"
                  class="pa-3"
                >
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-skeleton-loader
                        class="mx-auto"
                        max-width="300"
                        type="card"
                      ></v-skeleton-loader>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-skeleton-loader
                        class="mx-auto"
                        max-width="300"
                        type="card"
                      ></v-skeleton-loader>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-skeleton-loader
                        class="mx-auto"
                        max-width="300"
                        type="card"
                      ></v-skeleton-loader>
                    </v-col>
                  </v-row>

                </v-sheet>
              </template>
              <!-- user calender -->
              <v-container fluid v-else>
                <bread-crumbs
                  :page-title="`${pageInfo.pageName}`"
                  :items="[{text: 'Student',disabled: false, href: '/student'},{text: `${pageInfo.pageName}`,disabled: true, href: '/student/exam/instruction'}]"
                />
                <v-card class="pa-3">
                  <div v-if="warning_show">
                    <h3 class="text-center">Warnings !!!</h3>
                    <div class="d-flex align-center justify-center flex-wrap">
                      <div>
                        <svg
                          width="170"
                          height="170"
                          viewBox="0 0 170 170"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M143.225 120.606L97.2305 35.8889C96.0128 33.6516 94.2144 31.784 92.0246 30.4827C89.8348 29.1814 87.3347 28.4946 84.7874 28.4946C82.2402 28.4946 79.7401 29.1814 77.5503 30.4827C75.3605 31.784 73.5621 33.6516 72.3444 35.8889L26.3027 120.606C25.0976 122.769 24.4805 125.21 24.5129 127.686C24.5453 130.162 25.2261 132.586 26.4874 134.717C27.7486 136.847 29.5464 138.61 31.7014 139.83C33.8564 141.049 36.2933 141.683 38.7694 141.667H130.758C133.214 141.669 135.628 141.033 137.764 139.821C139.9 138.608 141.684 136.862 142.941 134.752C144.198 132.643 144.885 130.243 144.935 127.787C144.985 125.332 144.396 122.906 143.225 120.747V120.606ZM77.7277 60.1612C77.7277 58.2825 78.474 56.4809 79.8024 55.1525C81.1308 53.8241 82.9324 53.0778 84.811 53.0778C86.6897 53.0778 88.4913 53.8241 89.8197 55.1525C91.1481 56.4809 91.8944 58.2825 91.8944 60.1612V92.6973C91.8944 94.5759 91.1481 96.3776 89.8197 97.7059C88.4913 99.0343 86.6897 99.7806 84.811 99.7806C82.9324 99.7806 81.1308 99.0343 79.8024 97.7059C78.474 96.3776 77.7277 94.5759 77.7277 92.6973V60.1612ZM84.9999 123.958C83.3935 123.958 81.8232 123.482 80.4875 122.59C79.1518 121.697 78.1107 120.429 77.496 118.944C76.8812 117.46 76.7204 115.827 77.0338 114.252C77.3472 112.676 78.1208 111.229 79.2567 110.093C80.3926 108.957 81.8398 108.183 83.4154 107.87C84.9909 107.557 86.624 107.717 88.1082 108.332C89.5923 108.947 90.8608 109.988 91.7533 111.324C92.6458 112.659 93.1222 114.23 93.1222 115.836C93.1222 117.99 92.2664 120.056 90.7432 121.579C89.22 123.103 87.1541 123.958 84.9999 123.958Z"
                            fill="#E52520"
                          />
                        </svg>
                      </div>
                      <ul>
                        <li>Make sure you have a stable internet connection.</li>
                        <li>Do not 'close' or 'refresh' tab before submitting the test.</li>
                        <li>Do not click the ‘Back’ button on the browser while giving test.</li>
                      </ul>
                    </div>
                  </div>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <template>
                      <span style="color: red">{{ message }}{{'   '}}</span>
                      <span v-if="exam.time_type === 1 && timer" style="color: green">{{ " Test start in" }} </span>
                      <TimerCount v-if="exam.time_type === 1 && timer"
                                  :strict="true"
                                  :duration="exam.duration"
                                  :end-time="exam.exam_start"
                                  :start-time="moment()"
                                  :timer_type="false"
                                  @endCallBack="examPage()">
                      </TimerCount>
                    </template>
                    <template v-if="is_enable && $auth.user.role_id === 3">
                      <v-btn v-if="exam.exam_type === 2" color="#00A1FF" class="white--text px-2 mr-1" :to="'/student/exam/sat/'+$route.params.id">Start now</v-btn>
                      <v-btn v-else color="#00A1FF" class="white--text px-2 mr-1" :to="'/student/exam/regular/'+$route.params.id">Start now</v-btn>
                    </template>
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-container>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {common as commonMixin} from "@/mixins/common";
import Sidebar from "@/components/user/Sidebar";
import BreadCrumbs from "@/components/common/BreadCrumbs";
import TimerCount from "~/components/exam/TimerCount";
import moment from "moment-timezone";
const stateName = 'exams'
const storeName='student/exam'
export default {
  name: 'examInstruction',
  components: {Sidebar, BreadCrumbs, TimerCount},
  mixins: [commonMixin],
  data() {
    return {
      pageInfo: {
        pageName: 'Student Test Instruction',
        apiUrl: '/student/course/exam',
      },
      moment,
      state: {
        name: stateName,
        store_name: storeName,
      },
      is_enable:false,
      timer:0,
      message:'',
      warning_show:false,
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      exam:{},
    }
  },
  async mounted() {
    await this.getExam();
  },
  watch:{
    exam(){
      this.pageRedirect()
    },
  },
  methods: {
    async getExam(){
      this.loader.isLoading = true
      let url = `/student/exam/${this.$route.params.id}`
      await this.$axios.get(url).then((response)=>{
        this.exam = response.data.data;
      }).catch(()=>{
        this.exam={}
      })
      this.loader.isLoading = false
    },
    async pageRedirect(){
      if (this.exam.studentAnswers && this.exam.studentAnswers.length){
        if (this.exam.exam_type === 1){
          await this.$router.push(`/student/exam/result/regular/${this.exam.id}`);
        }else if(this.exam.exam_type === 2){
          await this.$router.push(`/student/exam/result/sat/${this.exam.id}`);
        }
      }else{
        this.examStatus()
      }
    },
    examPage() {
      this.examStatus()
    },
    examStatus(){
      if (this.exam.time_type && this.exam.time_type === 1){
          if (!this.exam.exam_end || !this.exam.exam_start){
            this.is_enable = false
            this.message =''
          }else if ( (this.moment(this.exam.exam_end)).diff(this.moment(),'minutes') < 1){
            this.is_enable = false
            this.message ='The time for this test has expired !'
          }else if(this.moment(this.exam.exam_start).format('YYYYMMDD') === this.moment().format('YYYYMMDD')){
            //console.log('Work')
            if((this.moment(this.exam.exam_start)).diff(this.moment(),'minutes') > 1){
              this.is_enable = false
              this.timer = true
              this.message ='Remaining time to start the test. '
            }else{
              this.is_enable = true
              this.timer = false
              this.message =''
              this.warning_show=true
            }
          }else{
            this.is_enable = false
            this.message ='PLease wait. It is not the time to start the test.'
          }
      }else if (this.exam.time_type && this.exam.time_type === 2){
        if (this.exam.exam_start_date && this.moment(this.exam.exam_start_date).format('YMMDD') > this.moment().format('YMMDD')){
          this.is_enable = false
          this.message =`PLease wait. It is not the time to start the test. Test start date ${this.exam.exam_start_date} `
        }else if (this.exam.exam_end_date && this.moment(this.exam.exam_end_date).format('YMMDD') < this.moment().format('YMMDD')){
          this.is_enable = false
          this.message =`The time for this test has expired !`
        }else{
          this.is_enable = true
          this.message =''
          this.warning_show=true
        }
      }else{
        this.is_enable = false
      }
    }
  }
}
</script>
