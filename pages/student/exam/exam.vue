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
                <v-card>
                  <v-card-title class="primary_header fs-4">
                    {{ pageInfo.pageName}}
                  </v-card-title>
                  <v-data-table
                    item-key="id"
                    :headers="headers"
                    :items="exams"
                    :options.sync="options"
                    :server-items-length="totalItems"
                    :search="search"
                    :footer-props="footerProps"
                    :items-per-page="20"
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
                          ></v-text-field>
                        </div>
                        <v-spacer></v-spacer>
                      </v-toolbar>
                    </template>
                    <template v-slot:item.sno="{ index, item }">
                      {{ index+1 }}
                    </template>
                    <template v-slot:item.test_start="{ index, item }">
                      <span v-if="item.time_type == 1">{{ moment(item.exam_start).format("MM-DD-Y hh:mm a")}}</span>
                      <span v-else>{{ item.exam_start_date}}</span>
                    </template>
                    <template v-slot:item.test_end="{ index, item }">
                      <span v-if="item.time_type == 1">{{ moment(item.exam_end).format("MM-DD-Y hh:mm a") }}</span>
                      <span v-else>{{ item.exam_end_date}}</span>
                    </template>
                    <template v-slot:item.duration="{ index, item }">
                      <span v-if="item.time_type == 1">{{ moment(item.exam_end).diff(moment(item.exam_start),'minutes')}}</span>
                      <span v-else>{{ item.duration}}</span>
                    </template>
                    <template v-slot:item.actions="{index, item }">
                      <v-tooltip bottom v-if="examStatus(item) == 1 && item.student_answers_count < 1">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn x-small class="accent text-white" :to="'/student/exam/instruction/'+item.id" v-bind="attrs"
                                 v-on="on" >
<!--                            <v-icon color="white">mdi-eye</v-icon>-->
                              Start Test
                          </v-btn>
                        </template>
                        <span>Start Test</span>
                      </v-tooltip>
                      <template v-else-if="examStatus(item) == 1 || examStatus(item) == 2">
                        <v-tooltip bottom v-if="item.student_answers_count">
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn v-if="item.exam_type == 1" x-small class="accent text-white" :to="'/student/exam/result/regular/'+item.id" v-bind="attrs"
                                   v-on="on">
                              Result
                            </v-btn>
                            <v-btn v-else x-small class="accent text-white" :to="'/student/exam/result/sat/'+item.id" v-bind="attrs"
                                   v-on="on">
                              Result
                            </v-btn>
                          </template>
                          <span>View Result</span>
                        </v-tooltip>
                        <span v-else style="color: red">Expired</span>
                      </template>
                    </template>
                  </v-data-table>
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
import {mapGetters} from "vuex";
import Sidebar from "@/components/user/Sidebar";
import moment from "moment";
const stateName = 'exams'
const storeName='student/exam'
export default {
  name: 'studentCourse',
  components: {Sidebar},
  mixins: [commonMixin],
  data() {
    return {
      pageInfo: {
        pageName: 'Tests & Results',
        apiUrl: '/student/course/exam',
      },
      moment,
      state: {
        name: stateName,
        store_name: storeName,
      },
      selected: [],
      selectedItem:{},
      options: {},
      dialog: false,
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
          value: 'sno'
        },
        {
          text: 'Title',
          align: 'start',
          value: 'title'
        },
        {
          text: 'Batch',
          align: 'start',
          value: 'course.batch'
        },
        {
          text: 'Course Name',
          align: 'start',
          value: 'course.name'
        },
        {
          text: 'Test Start',
          align: 'start',
          value: 'test_start'
        },
        {
          text: 'Test End',
          align: 'start',
          value: 'test_end'
        },
        {
          text: 'Duration(min)',
          align: 'start',
          value: 'duration'
        },
        {
          text: 'Action',
          value: 'actions'
        },
      ],
      footerProps: {
        itemsPerPageOptions: [20, 50, 100, 500]
      },
    }
  },
  computed: {
    ...mapGetters('student/exam',['exams','totalItems']),
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
      let url = `/student/course/exam?per_page=${this.options.itemsPerPage}&page=${this.options.page}`
      if (this.search.length >= 3) {
        url += `&search=${this.search}`
      }
      const payload1 = {apiUrl: url, stateName}
      await this.$store.dispatch(storeName+'/getItems', payload1)
      this.loader.isLoading = false
    },
    examStatus(exam){
      let status = 0;
      if (exam.time_type && exam.time_type === 1){
        if (!exam.exam_end || !exam.exam_start){
          status = 0 // 'No result'
        }else if ( (this.moment(exam.exam_end)).diff(this.moment(),'minutes') < 1){
          status = 2 //'Test is expire' or view result
        }else{
          status = 1 //'start test'
        }
      }else if (this.exam.time_type && this.exam.time_type === 2){
        if (this.exam.exam_end_date && this.moment(exam.exam_end_date).format('YMMDD') < this.moment().format('YMMDD')){
          status = 2 //'Test is expire' or view result
        }else{
          status = 1 //'start test'
        }
      }
      return status
    }
  }
}
</script>
