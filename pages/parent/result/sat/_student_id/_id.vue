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
                          </svg> <nuxt-link class="text-decoration-none" to="#"></nuxt-link>
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
                  <v-row dense>
                    <v-col cols="12" md="6" sm="12">
                      <v-card-title>Reading</v-card-title>
                      <v-simple-table>
                        <template v-slot:default>
                          <thead>
                          <tr>
                            <th class="text-left">
                              Q. No.
                            </th>
                            <th class="text-left">
                              Answer
                            </th>
                            <th class="text-left">
                              C. Answer
                            </th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr
                            v-for="(item,i) in exam_questions.filter(item2=>item2.question_part === 1)"
                            :key="item.id"
                          >
                            <td>{{ i+1 }}</td>
                            <td :style="findAnswer(item.id).is_correct?'':'color:red'">{{ findAnswer(item.id).student_answer }}</td>
                            <td>
                              <v-icon color="success" v-if="findAnswer(item.id).is_correct">mdi-check-decagram</v-icon>
                              <span style="color: green" v-else>{{ findAnswer2(item.id) }}</span>
                            </td>
                          </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                      <v-card-actions>
                        <v-card-title>Raw Score: {{  countPartWiseCorrectAnswer(1) }}, Test Score: {{ findTestScore().reading}}</v-card-title>
                      </v-card-actions>
                    </v-col>
                    <v-col cols="12" md="6" sm="12">
                      <v-card-title>Writing</v-card-title>
                      <v-simple-table>
                        <template v-slot:default>
                          <thead>
                          <tr>
                            <th class="text-left">
                              Q. No.
                            </th>
                            <th class="text-left">
                              Answer
                            </th>
                            <th class="text-left">
                              C. Answer
                            </th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr
                            v-for="(item,i) in exam_questions.filter(item2=>item2.question_part === 2)"
                            :key="item.id"
                          >
                            <td>{{ i+1 }}</td>
                            <td :style="findAnswer(item.id).is_correct?'':'color:red'">{{ findAnswer(item.id).student_answer }}</td>
                            <td>
                              <v-icon color="success" v-if="findAnswer(item.id).is_correct">mdi-check-decagram</v-icon>
                              <span style="color: green" v-else>{{ findAnswer2(item.id) }}</span>
                            </td>
                          </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                      <v-card-actions>
                        <v-card-title>Row Score: {{  countPartWiseCorrectAnswer(2) }},  Test Score: {{ findTestScore().writing}}</v-card-title>
                      </v-card-actions>
                    </v-col>
                    <v-col cols="12" md="6" sm="12">
                      <v-card-title>Math with calculator</v-card-title>
                      <v-simple-table>
                        <template v-slot:default>
                          <thead>
                          <tr>
                            <th class="text-left">
                              Q. No.
                            </th>
                            <th class="text-left">
                              Answer
                            </th>
                            <th class="text-left">
                              C. Answer
                            </th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr
                            v-for="(item,i) in exam_questions.filter(item2=>item2.question_part === 3)"
                            :key="item.id"
                          >
                            <td>{{ i+1 }}</td>
                            <td :style="findAnswer(item.id).is_correct?'':'color:red'">{{ findAnswer(item.id).student_answer }}</td>
                            <td>
                              <v-icon color="success" v-if="findAnswer(item.id).is_correct">mdi-check-decagram</v-icon>
                              <span style="color: green" v-else>{{ findAnswer2(item.id) }}</span>
                            </td>
                          </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                      <v-card-actions>
                        <v-card-title>Row Score: {{  countPartWiseCorrectAnswer(3) }}</v-card-title>
                      </v-card-actions>
                    </v-col>
                    <v-col cols="12" md="6" sm="12">
                      <v-card-title>Math without calculator</v-card-title>
                      <v-simple-table>
                        <template v-slot:default>
                          <thead>
                          <tr>
                            <th class="text-left">
                              Q. No.
                            </th>
                            <th class="text-left">
                              Answer
                            </th>
                            <th class="text-left">
                              C. Answer
                            </th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr
                            v-for="(item,i) in exam_questions.filter(item2=>item2.question_part === 4)"
                            :key="item.id"
                          >
                            <td>{{ i+1 }}</td>
                            <td :style="findAnswer(item.id).is_correct?'':'color:red'">{{ findAnswer(item.id).student_answer }}</td>
                            <td>
                              <v-icon color="success" v-if="findAnswer(item.id).is_correct">mdi-check-decagram</v-icon>
                              <span style="color: green" v-else>{{ findAnswer2(item.id) }}</span>
                            </td>
                          </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                      <v-card-actions>
                        <v-card-title>Row Score: {{  countPartWiseCorrectAnswer(4) }}</v-card-title>
                      </v-card-actions>
                    </v-col>
                    <v-col cols="12" md="6" sm="12">
                      <v-card-actions>
                        <v-card-title> Math Test Score: {{ findTestScore().math}}</v-card-title>
                      </v-card-actions>
                    </v-col>
                  </v-row>
                  <v-card-actions>
                    <v-card-title>Final Score: {{  findFinalScore() }}</v-card-title>
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
import {mapGetters} from "vuex";
const stateName = 'exam_questions'
const storeName='student/exam'
export default {
  name: 'examResultSat',
  components: {Sidebar, BreadCrumbs},
  mixins: [commonMixin],
  data() {
    return {
      pageInfo: {
        pageName: 'Student Test Result',
        apiUrl: '/student/exam/question/',
      },
      state: {
        name: stateName,
        store_name: storeName,
      },
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      exam:{},
    }
  },
  async mounted() {
    this.loader.isLoading = true
    await this.getExam();
    await this.getQuestionById();
    this.loader.isLoading = false
  },
  computed: {
    ...mapGetters('student/exam',['exam_questions']),
  },
  methods: {
    async getExam(){
      let url = `/parent/result/${this.$route.params.id}?student_id=${this.$route.params.student_id}`
      await this.$axios.get(url).then((response)=>{
        this.exam = response.data.data;
        //if(Object.keys(this.exam).length) this.$router.push('/')
      }).catch(()=>{
        this.exam={}
        this.$router.push('/')
      })
    },
    async getQuestionById(){
      let url = `/student/exam/question/with/answer/${this.$route.params.id}`
      const payload1 = {apiUrl: url, stateName}
      await this.$store.dispatch(storeName+'/getItems2', payload1)
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
    findAnswer2(question_id) {
      if (this.exam_questions) {
        let ans = this.exam_questions.find(item => item.id === question_id);
        if (ans) return ans.answer
      }
      return ''

    },
    countPartWiseCorrectAnswer(part){
      let total=0;
      if (this.exam &&  this.exam.studentAnswers){
        let questions = this.exam_questions.map(item=> {
          if(item.question_part === part) return item.id
        }).filter( Boolean );
        this.exam.studentAnswers.filter(item2 => {
          if(questions.includes(item2.exam_question_id)) total = total + item2.mark;
        });
        return total;
      }
      return total;
    },
    findScore(score, part){
      if (this.exam && this.exam.satSection && this.exam.satSection.satScores){
        let ss = this.exam.satSection.satScores.find(item=>item.raw_score === score);
        if (ss.id) {
          if (part === 1) return ss.reading;
          else if (part === 2) return ss.writing;
          else if (part === 3) return ss.math;
        }
      }
      return 0;
    },
    findTestScore(){
      let r_reading = this.countPartWiseCorrectAnswer(1)
      let r_writing = this.countPartWiseCorrectAnswer(2)
      let r_math_n_cal = this.countPartWiseCorrectAnswer(3)
      let r_math_w_cal = this.countPartWiseCorrectAnswer(4)
      let reading = this.findScore(r_reading,1)
      let writing = this.findScore(r_writing,2)
      let r_math = r_math_n_cal + r_math_w_cal;
      let math = this.findScore(r_math,3)
      return {
        reading:reading,
        writing:writing,
        math:math,
      }
    },
    findFinalScore(){
      let r_reading = this.countPartWiseCorrectAnswer(1)
      let r_writing = this.countPartWiseCorrectAnswer(2)
      let r_math_n_cal = this.countPartWiseCorrectAnswer(3)
      let r_math_w_cal = this.countPartWiseCorrectAnswer(4)
      let reading = this.findScore(r_reading,1)
      let writing = this.findScore(r_writing,2)
      let r_math = r_math_n_cal + r_math_w_cal;
      let math = this.findScore(r_math,3)
      return ((reading + writing) * 10 + math)

    }
  }
}
</script>
