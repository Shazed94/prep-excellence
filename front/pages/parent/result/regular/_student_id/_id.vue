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
                  <v-card-text>
                    <v-card-title>{{ exam.title }} - {{ exam.course?exam.course.name:'' }}</v-card-title>
                    <v-card-subtitle > Your score is {{ findScore() }} out of {{ this.exam_questions.length }}</v-card-subtitle>
                  </v-card-text>
                </v-card>
                <div v-for="(mcq, n) in exam_questions" :key="mcq.id+'-'+n">
                  <v-card class="mb-2" style="position: relative">
                    <v-card-text class="theme-text-dark">
                      <div class="d-flex justify-space-between">
                        <div class="d-flex">
                          <div class="mr-1"><strong v-if="n+1">{{ n+1 }}.</strong></div>
                          <div v-html="mcq.question"></div>
                        </div>
                      </div>
                      <v-radio-group column disabled>
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
import {mapGetters} from "vuex";
const stateName = 'exam_questions'
const storeName='student/exam'
export default {
  name: 'studentExam',
  components: {Sidebar, BreadCrumbs},
  mixins: [commonMixin],
  data() {
    return {
      pageInfo: {
        pageName: 'Student Tests Result',
        apiUrl: '/student/exam/question/',
      },
      state: {
        name: stateName,
        store_name: storeName,
      },
      exam:{},
      answer: [],
      correct_answer:0,
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
    }
  },
  computed: {
    ...mapGetters('student/exam',['exam_questions']),
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
        return data
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
      let url = `/student/exam/question/with/answer/${this.$route.params.id}`
      const payload1 = {apiUrl: url, stateName}
      await this.$store.dispatch(storeName+'/getItems2', payload1)
      this.loader.isLoading = false
    },
    async getExam(){
      this.loader.isLoading = true
      let url = `/parent/result/${this.$route.params.id}?student_id=${this.$route.params.student_id}`
      await this.$axios.get(url).then((response)=>{
        this.exam = response.data.data;
        //if(Object.keys(this.exam).length) this.$router.push('/')
      }).catch(()=>{
        this.exam={}
        this.$router.push('/')
      })
      this.loader.isLoading = false
    },
    findAnswer(question_id) {
      if (this.exam && this.exam.studentAnswers){
        let ans = this.exam.studentAnswers.find(item => item.exam_question_id === question_id);
        if (ans){
          return {
            'student_answer': ans.student_answer,
            'correct_answer': ans.correct_answer,
            'is_correct': ans.student_answer === ans.correct_answer,
          }
        }
      }
      return {
        'student_answer': '',
        'correct_answer': '',
        'is_correct': false,
      }
    },
    findAnswerByQuestion(question_id) {
      if (this.exam_questions) {
        let ans = this.exam_questions.find(item => item.id === question_id);
        if (ans) return ans.answer
      }
      return ''
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
    getStyleClass(question_id, option_name) {
      let answer = this.findAnswer(question_id);
      if (answer){
        if (answer.is_correct && answer.correct_answer === option_name)
          return 'correctUserAnswer'
        else if (answer.correct_answer && answer.correct_answer === option_name) // attended but wrong answer
          return 'originalAnswer'
        else if(!answer.correct_answer && this.findAnswerByQuestion(question_id) === option_name) return 'originalAnswer'
        else if (answer.student_answer === option_name)  // wrong answer
          return 'wrongAnswer'
      }
      return 'defaultColor'
    },
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
