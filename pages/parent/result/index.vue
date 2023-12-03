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
                <v-card class="mt-2">
                  <v-data-table
                    dense
                    v-model="selected"
                    item-key="id"
                    :headers="headers"
                    :items="exams"
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
                        <div class="mr-2 mt-2">
                          <v-autocomplete
                            v-model="student_id"
                            :items="students"
                            label="Select Student"
                            item-text="userable.first_name"
                            item-value="id"
                            append-icon="mdi-package-variant-closed"
                            required
                            dense
                            outlined
                          ></v-autocomplete>
                        </div>
                      </v-toolbar>
                    </template>
                    <template v-slot:item.sno="{ index, item }">
                      {{ index+1 }}
                    </template>
                    <template v-slot:item.actions="{index, item }">
                      <v-tooltip bottom v-if="item.student_answers_count">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn v-if="item.exam_type === 1" x-small class="accent" :to="`/parent/result/regular/${student_id}/`+item.id" v-bind="attrs"
                                 v-on="on" fab>
                            <v-icon>mdi-eye</v-icon>
                          </v-btn>
                          <v-btn v-else-if="item.exam_type === 2" x-small class="accent" :to="`/parent/result/sat/${student_id}/`+item.id" v-bind="attrs"
                                 v-on="on" fab>
                            <v-icon>mdi-eye</v-icon>
                          </v-btn>
                        </template>
                        <span>Result</span>
                      </v-tooltip>
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
const stateName = 'exams'
const storeName='parent/result'
export default {
  name: 'ExamResult',
  components: {Sidebar},
  mixins: [commonMixin],
  data() {
    return {
      pageInfo: {
        pageName: 'Student Tests',
        apiUrl: '/parent/course/result',
      },
      state: {
        name: stateName,
        store_name: storeName,
      },
      student_id:null,
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
        /*{
          text: 'Location',
          align: 'start',
          value: 'course.course_location'
        },*/
        {
          text: 'Exam Date',
          align: 'start',
          value: 'exam_start_date'
        },
        {
          text: 'Exam Start',
          align: 'start',
          value: 'exam_start'
        },
        {
          text: 'Duration(min)',
          align: 'start',
          value: 'duration'
        },
        {
          text: 'Result',
          value: 'actions'
        },
      ],
      footerProps: {
        itemsPerPageOptions: [20, 50, 100, 500]
      },
    }
  },
  computed: {
    ...mapGetters('parent/result',['exams','totalItems']),
    ...mapGetters('user/basic',['students']),
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
    student_id(){
      if(this.student_id) this.init();
    },
    students(){
      if (this.students && this.students.length){
        this.student_id = this.students[0].id
      }else{
        this.student_id = null
      }
    }
  },
  async mounted() {
    this.loader.isLoading=true;
    if (this.students && this.students.length){
      this.student_id = this.students[0].id
    }else{
      this.student_id = null
    }
    if(this.student_id) await this.init();
   this.loader.isLoading=false;
  },
  methods: {
    async init() {
      this.loader.isLoading = true
      let url = `${this.pageInfo.apiUrl}?student_id=${this.student_id}&per_page=${this.options.itemsPerPage}&page=${this.options.page}`
      if (this.search.length >= 3) {
        url += `&search=${this.search}`
      }
      const payload1 = {apiUrl: url, stateName}
      await this.$store.dispatch(storeName+'/getItems', payload1)
      this.loader.isLoading = false
    },
  }
}
</script>
