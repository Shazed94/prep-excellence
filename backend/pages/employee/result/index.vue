<template>
  <v-container fluid>
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: 'Test',disabled: false, href: '/employee/exam'},{text: `${pageInfo.pageName}`,disabled: true, href: '/employee/result'}]"
    />
    <v-card>
      <v-data-table
        dense
        v-model="selected"
        item-key="id"
        :headers="headers"
        :items="results"
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
        <template v-slot:item.actions="{index, item }">
          <v-tooltip bottom v-if="item.studentAnswers.length">
            <template v-slot:activator="{ on, attrs }">
              <v-btn x-small class="accent" v-bind="attrs"
                     v-on="on" fab @click="openResult(item)">
                <v-icon>mdi-eye</v-icon>
              </v-btn>
            </template>
            <span>View</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="dialog" persistent max-width="900">
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
              <v-card-subtitle class="text-center"><b>{{  selectedItem.title +' '+ 'Result' }}</b></v-card-subtitle>
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">
                        Student ID
                      </th>
                      <template v-if="selectedItem.exam_type === 2">
                        <th class="text-left">
                          Reading
                        </th>
                        <th class="text-left">
                          Writing
                        </th>
                        <th class="text-left">
                          Math
                        </th>
                        <th class="text-left">
                          Math With Calculator
                        </th>
                        <th class="text-left">
                          Total Score
                        </th>
                      </template>
                      <template v-else>
                        <th class="text-left">
                          Total Question
                        </th>
                        <th class="text-left">
                          Total Point
                        </th>
                      </template>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                    v-for="(item,key ) in selectedItem.course.students"
                    :key="key"
                  >
                    <td>{{ item.student_id }}</td>
                    <template v-if="selectedItem.exam_type === 2">
                      <td>{{ findScore(countPartWiseCorrectAnswer(item.id,1),1) }}({{ (countPartWiseCorrectAnswer(item.id,1)) }})</td>
                      <td>{{ findScore(countPartWiseCorrectAnswer(item.id,2),2) }}({{ (countPartWiseCorrectAnswer(item.id,2)) }})</td>
                      <td>{{ findScore(countPartWiseCorrectAnswer(item.id,3),3) }}({{ (countPartWiseCorrectAnswer(item.id,3)) }})</td>
                      <td>{{ findScore(countPartWiseCorrectAnswer(item.id,4),4) }}({{ (countPartWiseCorrectAnswer(item.id,4)) }})</td>
                      <td>{{ findFinalScore(item.id) }}</td>
                    </template>
                      <template v-else>
                        <th class="text-left">
                          {{ selectedItem.examQuestions.length }}
                        </th>
                        <th class="text-left">
                          {{ simpleCorrectAnswer(item.id)  }}
                        </th>
                      </template>
                  </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-container>
          </v-sheet>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="mr-2 error darken-1 white--text" depressed @click="closeModal()">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
const permission ='Employee Test Result'
const stateName = 'results'
const storeName='admin/result'
export default {
  name: 'Results',
  head: {
    title: 'Test Result',
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
        pageName: 'Student Results',
        apiUrl: '/employee/exams/result',
        permission
      },
      state: {
        name: stateName,
        store_name: storeName,
      },
      selected: [],
      selectedItem:{},
      options: {},
      dialog: false,
      dialog_clone: false,
      dialog2: false,
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
          sortable: false
        },
        {
          text: 'Title',
          align: 'start',
          value: 'title',
          sortable: false
        },
        {
          text: 'Batch',
          align: 'start',
          value: 'course.batch',
          sortable: false
        },
        {
          text: 'Course Name',
          align: 'start',
          value: 'course.name',
          sortable: false
        },
        {
          text: 'Start At',
          align: 'start',
          value: 'exam_start',
          sortable: false
        },
        {
          text: 'End At',
          align: 'center',
          value: 'exam_end',
          sortable: false
        },
        {
          text: 'Duration(Min)',
          align: 'center',
          value: 'duration',
          sortable: false
        },
        {
          text: 'Action',
          value: 'actions',
          sortable: false
        },
      ],
      footerProps: {
        itemsPerPageOptions: [10, 20, 50, 100, 500]
      },
    }
  },
  computed: {
    ...mapGetters('admin/result',['results','totalItems']),
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
    this.loader.isLoading=false;
  },
  methods: {
    async init() {
      this.loader.isLoading = true
      let url = this.pageInfo.apiUrl+`?per_page=${this.options.itemsPerPage}&page=${this.options.page}`
      if (this.search.length > 3) {
        url += `&search=${this.search}`
      }
      const payload1 = {apiUrl: url, stateName}
      if (!this.results.length) await this.$store.dispatch(storeName+'/getItems', payload1)
      this.loader.isLoading = false
    },
    countPartWiseCorrectAnswer(student_id,part){
      let total=0;
      if (this.selectedItem.studentAnswers){
        let questions = this.selectedItem.examQuestions.map(item=> {
          if(item.question_part === part) return item.id
        }).filter( Boolean );
        this.selectedItem.studentAnswers.filter(item2 => {
          if(questions.includes(item2.exam_question_id) && item2.student_id === student_id) total = total + item2.mark;
        });
        return total;
      }
      return total;
    },
    simpleCorrectAnswer(student_id){
      let total=0;
      if (this.selectedItem.studentAnswers){
        let questions = this.selectedItem.examQuestions.map(item=> {
          return item.id
        }).filter( Boolean );
        this.selectedItem.studentAnswers.filter(item2 => {
          if(questions.includes(item2.exam_question_id) && item2.student_id === student_id) total = total + item2.mark;
        });
        return total;
      }
      return total;
    },
    findScore(score, part){
      if (this.selectedItem.satSection && this.selectedItem.satSection.satScores){
        let ss = this.selectedItem.satSection.satScores.find(item=>item.raw_score === score);
        if (ss.id) {
          if (part === 1) return ss.reading;
          else if (part === 2) return ss.writing;
          else if (part === 3) return ss.math;
        }
      }
      return 0;
    },
    findFinalScore(student_id){
      let r_reading = this.countPartWiseCorrectAnswer(student_id,1)
      let r_writing = this.countPartWiseCorrectAnswer(student_id,2)
      let r_math_n_cal = this.countPartWiseCorrectAnswer(student_id,3)
      let r_math_w_cal = this.countPartWiseCorrectAnswer(student_id,4)
      let reading = this.findScore(r_reading,1)
      let writing = this.findScore(r_writing,2)
      let r_math = r_math_n_cal + r_math_w_cal;
      let math = this.findScore(r_math,3)
      return ((reading + writing) * 10 + math)
    },
    openResult(item){
      this.dialog=true
      this.selectedItem =item
    },
    closeModal() {
      this.dialog = false
    },
  }
}
</script>
