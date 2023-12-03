<template>
  <div class="user-dashboard-area">
    <div class="btcontainer">
      <div class="up_wrap">
        <div class="btrow">
          <sidebar/>
          <!-- main content -->
          <div class="btcol-md-6 btcol-lg-9">
            <div class="up_content_wrap">
              <!-- user calender -->
              <v-container fluid>
                <bread-crumbs
                  :page-title="`${pageInfo.pageName}`"
                  :items="[{text: 'Student',disabled: false, href: '/student'},{text: `${pageInfo.pageName}`,disabled: true, href: '/student/exam/instruction'}]"
                />
                <v-card>
                  <TimerCount v-if="exam.time_type === 1 && !is_answers"
                              :strict="true"
                              :duration="exam.duration"
                              :end-time="exam.exam_end"
                              :start-time="exam.exam_start"
                              :timer_type="false"
                              @endCallBack="submitAnswer()"
                  >
                    <template v-slot:examInfo>
                      <strong class="mt-2 mx-1 d-md-none">
                        ( <span class="primary--text">{{ 5 }}</span> / <span class="primary--text">{{ 5 }}</span> )
                      </strong>
                    </template>
                  </TimerCount>

                  <v-card-text>
                    <v-card-title>{{ exam.title }} - {{ exam.course?exam.course.name:'' }}</v-card-title>
                    <v-card-subtitle v-if="is_answers">You already given this Test - Your score is {{ findScore() }} out of {{ this.exam_questions.length }}</v-card-subtitle>
                  </v-card-text>
                </v-card>
                <div v-if="answer.length > 0" v-for="(mcq, n) in exam_questions" :key="mcq.id+'-'+n">
                  <v-card class="mb-2" style="position: relative">
                    <v-card-text class="theme-text-dark">
                      <div class="d-flex justify-space-between">
                        <div class="d-flex">
                          <div class="mr-1"><strong v-if="n+1">{{ n+1 }}.</strong></div>
                          <div v-html="mcq.question"></div>
                        </div>
                      </div>
                      <v-radio-group v-model="answer[n].student_answer" column :disabled="is_answers">
                        <v-radio
                          v-for="(option, i) in jsonDecode(mcq.options)"
                          :key="n+i"
                          class="mb-1 rounded pa-1"
                          :value="findOptionValue(i)"
                          ripple
                          :off-icon="`mdi-alpha-${findOptionStyle(i)}-circle-outline`"
                          :on-icon="`mdi-alpha-${findOptionStyle(i)}-circle-outline`"
                          :class="getStyleClass(mcq.id, findOptionValue(i))"
                        >
                          <template v-slot:label>
                            <div>
                              <strong  v-html="option"></strong>
                             </div>
                          </template>
                        </v-radio>
                      </v-radio-group>
                    </v-card-text>
                  </v-card>
                </div>
                <v-card-actions>
                  <v-btn color="primary" :disabled="is_answers" @click="submitAnswer()">Submit</v-btn>
                </v-card-actions>
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
import TimerCount from "@/components/exam/TimerCount";
import {mapGetters} from "vuex";
import moment from "moment-timezone";
const stateName = 'exam_questions'
const storeName='student/exam'
export default {
  name: 'studentExam',
  components: {Sidebar, BreadCrumbs, TimerCount},
  mixins: [commonMixin],
  data() {
    return {
      pageInfo: {
        pageName: 'Student Tests Questions',
        apiUrl: '/student/exam/question/',
      },
      state: {
        name: stateName,
        store_name: storeName,
      },
      is_answers: false,
      exam:{},
      moment,
      answer: [],
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
    }
  },
  computed: {
    ...mapGetters('student/exam',['exam_questions']),
  },
  watch: {
    exam_questions(){
      this.exam_questions.forEach(item=>{
        this.answer.push({ exam_id: this.$route.params.id ,question_id:item.id, student_answer:null})
      });
    },
    exam(){
      this.examStatus()
      if (this.exam.studentAnswers){
        this.is_answers = this.exam.studentAnswers.length > 0;
      }else this.is_answers = false;
    }
  },
  async mounted() {
    this.loader.isLoading=true;
    await this.init();
    await this.getExam();
    this.loader.isLoading=false;
  },
  methods: {
    jsonDecode(data){
      try {
        return JSON.parse(data);
      }catch (e){
        return []
      }
    },
    findOptionStyle(n){
      if (n === 'option_a') return 'a';
      else if (n === 'option_b') return 'b';
      else if (n === 'option_c') return 'c';
      else if (n === 'option_d') return 'd';
    },
    findOptionValue(n){
      if (n === 'option_a') return 'A';
      else if (n === 'option_b') return 'B';
      else if (n === 'option_c') return 'C';
      else if (n === 'option_d') return 'D';
    },
    async init() {
      this.loader.isLoading = true
      let url = `/student/exam/question/${this.$route.params.id}`
      const payload1 = {apiUrl: url, stateName}
      await this.$store.dispatch(storeName+'/getItems2', payload1)
      this.loader.isLoading = false
    },
    async getExam(){
      this.loader.isLoading = true
      let url = `/student/exam/${this.$route.params.id}`
      await this.$axios.get(url).then((response)=>{
        this.exam =response.data.data;
      }).catch(()=>{
        this.exam={}
      })
      this.loader.isLoading = false
    },
    async submitAnswer(){
      this.loader.isSubmitting = true
      if ( !this.is_answers){
        const formData = new FormData();
        formData.append('answer',JSON.stringify(this.answer))
        await this.$axios.post(`/student/exam/answer/submit`,formData).then((response)=>{
          this.$toaster.success(response.data.message)
          this.getExam();
        }).catch((error)=>{
          this.$toaster.success(error.response.data.message)
        })
      }
      this.loader.isSubmitting = false
    },
    findAnswer(question_id) {
      let ans = this.exam.studentAnswers.find(item => item.exam_question_id === question_id);
      return {
        'student_answer': ans.student_answer,
        'correct_answer': ans.correct_answer,
        'is_correct': ans.student_answer === ans.correct_answer,
      }
    },
    getStyleClass(question_id, option_name) {
     // console.log(option_name);
      if (this.is_answers) {
        if (this.findAnswer(question_id).is_correct && this.findAnswer(question_id).correct_answer === option_name)
          return 'correctUserAnswer'
        else if (this.findAnswer(question_id).correct_answer === option_name) // attended but wrong answer
          return 'originalAnswer'
        /*else if (!this.findAnswer(question_id).student_answer && this.findAnswer(question_id).correct_answer === option_name ) // Not attended
          return 'originalAnswer'*/
        else if (this.findAnswer(question_id).student_answer === option_name)  // wrong answer
          return 'wrongAnswer'
      }
      return 'defaultColor'
    },
    findScore(){
      let score = 0
      if (this.exam && this.exam.studentAnswers){
        this.exam.studentAnswers.forEach(item=>{
          if (item.student_answer === item.correct_answer) score +=1
        })
      }
      return score;
    },
    examStatus(){
      if (this.exam.time_type && this.exam.time_type === 1){
        if (!this.exam.exam_end || !this.exam.exam_start){
          this.$router.push('/')
        }else if ( (this.moment(this.exam.exam_end)).diff(this.moment(),'minutes') < 1){
          this.$toaster.error('Test is end')
          this.$router.push('/')
        }else if(this.moment(this.exam.exam_start).format('YYYYMMDD') === this.moment().format('YYYYMMDD')){
          if((this.moment(this.exam.exam_start)).diff(this.moment(),'minutes') > 1){
            this.$toaster.error('Test not started yet.')
            this.$router.push('/')
          }
        }else{
          this.$toaster.error('Invalid request')
          this.$router.push('/')
        }
      }else if (this.exam.time_type && this.exam.time_type === 2){
        if (this.exam.exam_start_date && this.moment(this.exam.exam_start_date).format('YMMDD') > this.moment().format('YMMDD')){
          this.$toaster.error(`Test enable on ${this.exam.exam_start_date}`)
          this.$router.push('/')
        }else if (this.exam.exam_end_date && this.moment(this.exam.exam_end_date).format('YMMDD') < this.moment().format('YMMDD')){
          this.$toaster.error(`Test is end`)
          this.$router.push('/')
        }
      }else{
        this.$toaster.error(`Invalid request`)
        this.$router.push('/')
      }
    }
  }
}
</script>

<style lang="scss">
.correctUserAnswer {
  background-color: rgba(10, 178, 66, 0.40) !important;
  border: 2px solid #04cc75 !important;
  color: black !important;
  font-weight: 600;
  font-size: 16px;

  > > > .v-radio--is-disabled {
    color: black !important;
  }
}

.originalAnswer {
  background-color: rgba(62, 164, 2, 0.40) !important;
  border: 2px solid #3ea402 !important;
  color: black !important;
  font-weight: 600;
  font-size: 16px;
}

.wrongAnswer {
  background-color: rgba(255, 64, 64, 0.40) !important;
  border: 2px solid red !important;
  color: white !important;
  font-weight: 600;
  font-size: 16px;
}

.defaultColor {
  background-color: transparent !important;
  border: 2px solid #eeeeee !important;
  color: black !important;
  font-weight: 600;
  font-size: 16px;
}

.theme-text-dark {
  font-weight: 500;
  color: #232428 !important;
}

.correct-option {
  color: #04cc75;
  font-weight: 600;
  font-size: 16px;
}

.wrong-option {
  color: red;
  font-weight: 600;
  font-size: 16px;
}
</style>
