<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="1000"
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
        <v-icon>mdi-wrench-clock</v-icon>
      </v-btn>
    </template>
    <v-card>
      <validation-observer ref="observer" v-slot="{ invalid }">
        <v-form ref="form" @submit.prevent="submitData()">
          <v-card-title class="text-h5"> Add More {{ pageInfo.pageName | capitalize }}</v-card-title>
          <v-card-text>
            <v-container>
              <validation-observer ref="observer2" v-slot="{ invalid2 }">
                <v-row dense>
                  <v-col cols="12" xs="12" md="4">
                    <validation-provider
                      v-slot="{ errors }"
                      name="duration"
                      vid="duration_in_week"
                      rules="required"
                    >
                      <v-text-field
                        v-model="form.duration_in_week"
                        label="Duration(Week)"
                        :error-messages="errors"
                        dense
                        outlined
                        auto-grow
                        no-resize
                      ></v-text-field>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" xs="12" md="4">
                    <validation-provider
                      v-slot="{ errors }"
                      name="start date"
                      vid="start_date"
                      rules="required"
                    >
                      <v-text-field
                        v-model="form.start_date"
                        label="Start Date"
                        :error-messages="errors"
                        dense
                        type="date"
                        outlined
                        auto-grow
                        no-resize
                      ></v-text-field>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" xs="12" md="4">
                    <validation-provider
                      v-slot="{ errors }"
                      name="end date"
                      vid="end_date"
                      rules="required"
                    >
                      <v-text-field
                        v-model="form.end_date"
                        label="End Date"
                        :error-messages="errors"
                        dense
                        type="date"
                        outlined
                        auto-grow
                        no-resize
                      ></v-text-field>
                    </validation-provider>
                  </v-col>
<!--                  <v-col cols="12" xs="12" md="3">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Schedule Type"
                      vid="Schedule Type"
                      rules="required"
                    >
                      <v-select
                        v-model.number="form.course_type"
                        :items="schedule_types"
                        :error-messages="errors"
                        label="Schedule Type"
                        item-text="name"
                        item-value="id"
                        dense
                        outlined
                        auto-grow
                        no-resize
                      ></v-select>
                    </validation-provider>
                  </v-col>-->
                  <v-col cols="12" xs="12" md="3">
                    <validation-provider
                      v-slot="{ errors }"
                      name="course length"
                      vid="course_length_in_hour"
                      rules="required"
                    >
                      <v-text-field
                        v-model="course_length_in_hour"
                        label="course length(hour)"
                        :error-messages="errors"
                        dense
                        outlined
                        auto-grow
                        no-resize
                      ></v-text-field>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" xs="12" md="3">
                    <validation-provider
                      v-slot="{ errors }"
                      name="duration"
                      vid="duration_in_hour"
                      rules="required"
                    >
                      <v-text-field
                        v-model="form.duration_in_hour"
                        label="Duration(hour)"
                        :error-messages="errors"
                        dense
                        outlined
                        auto-grow
                        no-resize
                      ></v-text-field>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" xs="12" md="3">
                    <validation-provider
                      v-slot="{ errors }"
                      name="instructor"
                      vid="instructor"
                      rules="required">
                      <v-autocomplete
                        @change="selectedEmployeeFind()"
                        v-model="form.employee_ids"
                        :items="only_employees"
                        :error-messages="errors"
                        item-text="userable.name"
                        item-value="id"
                        label="Instructors"
                        multiple
                        dense
                        clearable
                        hide-details="auto"
                        outlined></v-autocomplete>
                    </validation-provider>
                  </v-col>
                  <template>
                    <v-col cols="12" xs="12" md="12"></v-col>
                    <template v-if="form.course_type === 1">
                      <v-col cols="12" xs="12" md="4">
                        <validation-provider
                          v-slot="{ errors }"
                          name="start time"
                          vid="start_time"
                          rules="required"
                        >
                          <v-text-field
                            v-model="start_time"
                            label="Start At"
                            type="time"
                            :error-messages="errors"
                            dense
                            outlined
                            auto-grow
                            no-resize
                          ></v-text-field>
                        </validation-provider>
                      </v-col>
                      <v-col cols="12" xs="12" md="4">
                        <validation-provider
                          v-slot="{ errors }"
                          name="end time"
                          vid="end_time"
                          rules="required"
                        >
                          <v-text-field
                            v-model="end_time"
                            label="End At"
                            type="time"
                            :error-messages="errors"
                            dense
                            outlined
                            auto-grow
                            no-resize
                          ></v-text-field>
                        </validation-provider>
                      </v-col>

                      <v-col cols="12" xs="12" md="4">
                        <validation-provider
                          v-slot="{ errors }"
                          name="exam days"
                          vid="exam_days"
                          rules=""
                        >
                          <v-autocomplete
                            v-model="selected_exam_days"
                            :items="exam_days"
                            :error-messages="errors"
                            item-text="id"
                            item-value="id"
                            outlined
                            dense
                            chips
                            small-chips
                            label="Exam Days"
                            multiple
                          >
                            <template v-slot:item="data">
                              <template v-if="typeof data.item !== 'object'">
                                <v-list-item-content v-text="data.item"></v-list-item-content>
                              </template>
                              <template v-else>
                                <v-list-item-content>
                                  <v-list-item-title v-html="data.item.id"></v-list-item-title>
                                  <v-list-item-title v-html="data.item.date"></v-list-item-title>
                                  <v-list-item-subtitle v-html="data.item.day"></v-list-item-subtitle>
                                </v-list-item-content>
                              </template>
                            </template>
                          </v-autocomplete>
                        </validation-provider>
                      </v-col>

                      <v-col cols="12" md="12" xs="12">
                        <label>Input First Week Schedule</label>
                        <v-row dense v-for="(exp,e) in regulars" :key="e">
                          <v-col cols="12" xs="12" md="3">
                            <validation-provider
                              v-slot="{ errors }"
                              name="w_date"
                              vid="w_date"
                              rules="required"
                            >
                              <v-text-field
                                v-model="regulars[e].date"
                                :error-messages="errors"
                                label="Date"
                                type="date"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" xs="12" md="3">
                            <validation-provider
                              v-slot="{ errors }"
                              name="day"
                              vid="day"
                              rules="required|max:191"
                            >
                              <v-autocomplete
                                v-model="regulars[e].day"
                                :items="days"
                                :error-messages="errors"
                                item-text="name"
                                item-value="name"
                                label="Day"
                                dense
                                clearable
                                hide-details="auto"
                                outlined></v-autocomplete>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" xs="12" md="3">
                            <validation-provider
                              v-slot="{ errors }"
                              name="start time"
                              vid="start_time"
                              rules="required"
                            >
                              <v-text-field
                                v-model="regulars[e].start_time"
                                label="Start At"
                                type="time"
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" xs="12" md="3">
                            <validation-provider
                              v-slot="{ errors }"
                              name="end time"
                              vid="end_time"
                              rules="required"
                            >
                              <v-text-field
                                v-model="regulars[e].end_time"
                                label="End At"
                                type="time"
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" xs="12" md="3">
                            <validation-provider
                              v-slot="{ errors }"
                              name="instructor"
                              vid="instructor"
                              rules="required">
                              <v-autocomplete
                                v-model="regulars[e].employee_id"
                                :items="selected_employees"
                                :error-messages="errors"
                                item-text="userable.name"
                                item-value="id"
                                label="Instructors"
                                dense
                                clearable
                                hide-details="auto"
                                outlined></v-autocomplete>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" xs="12" md="3">
                            <validation-provider
                              v-slot="{ errors }"
                              name="course name"
                              vid="course_name"
                              rules="required"
                            >
                              <v-text-field
                                v-model="regulars[e].course_name"
                                label="Course"
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-divider></v-divider>
                        </v-row>
                      </v-col>
                    </template>
                    <template v-if="form.course_type === 2">
                      <v-col cols="12" md="12" xs="12">
                        <label>Input First Week Schedule</label>
                        <v-row class="border" dense v-for="(exp,e) in one_on_ones" :key="e">
                          <v-col cols="12" xs="12" md="3">
                            <validation-provider
                              v-slot="{ errors }"
                              name="w_date"
                              vid="w_date"
                              rules="required"
                            >
                              <v-text-field
                                v-model="one_on_ones[e].date"
                                :error-messages="errors"
                                label="Date"
                                type="date"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" xs="12" md="3">
                            <validation-provider
                              v-slot="{ errors }"
                              name="start time"
                              vid="start_time"
                              rules="required"
                            >
                              <v-text-field
                                v-model="one_on_ones[e].start_time"
                                label="Start At"
                                type="time"
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" xs="12" md="3">
                            <validation-provider
                              v-slot="{ errors }"
                              name="end time"
                              vid="end_time"
                              rules="required"
                            >
                              <v-text-field
                                v-model="one_on_ones[e].end_time"
                                label="End At"
                                type="time"
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" xs="12" md="3">
                            <validation-provider
                              v-slot="{ errors }"
                              name="instructor"
                              vid="instructor"
                              rules="required">
                              <v-autocomplete
                                v-model="one_on_ones[e].employee_id"
                                :items="selected_employees"
                                :error-messages="errors"
                                item-text="userable.name"
                                item-value="id"
                                label="Instructors"
                                dense
                                clearable
                                hide-details="auto"
                                outlined></v-autocomplete>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" xs="12" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="course name"
                              vid="course_name"
                              rules="required"
                            >
                              <v-text-field
                                v-model="one_on_ones[e].course_name"
                                label="Course"
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" xs="12" md="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="classes"
                              vid="classes"
                              rules="required"
                            >
                              <v-text-field
                                v-model="one_on_ones[e].classes"
                                label="Classes"
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" xs="12" md="2">
                            <v-btn color="error" @click="spliceOne(e)" x-small fab v-if="one_on_ones.length > 1">
                              <v-icon>mdi-delete</v-icon>
                            </v-btn>
                            <v-btn color="success" @click="addOne()" x-small fab v-if="one_on_ones.length === (e+1) && one_on_ones.length < 7">
                              <v-icon>mdi-plus</v-icon>
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-col>
                    </template>
                  </template>
                </v-row>
              </validation-observer>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-1"
              class="mx-2 white--text"
              type="submit"
              :disabled="invalid"
              :loading="loader.isSubmitting"
              depressed
            >
              {{ editIndex > -1 ? 'Update' : 'Save' }}
            </v-btn>
            <v-btn class="mr-2 error darken-1 white--text" depressed @click="closeModal">Close</v-btn>
          </v-card-actions>
        </v-form>
      </validation-observer>
    </v-card>
  </v-dialog>
</template>

<script>
import {common as commonMixin} from "@/mixins/common";
import {mapGetters} from "vuex";
import moment from "moment-timezone";
const permission = ''
const stateName = 'courses'
const storeName='admin/course'

export default {
  name: "AddMoreSchedule",
  mixins: [commonMixin],
  props:{
    course:{
      required:true,
      type:Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      moment,
      dialog: false,
      editIndex: -1,
      editMode:false,
      pageInfo: {
        pageName: 'Course Schedule',
        apiUrl: '/course-type/',
        permission: ''
      },
      state: {
        name: stateName,
        store_name: storeName,
      },
      start_time:null,
      end_time:null,
      exam_days:[],
      selected_exam_days:[],
      exam_counter:0,
      class_counter:0,
      selected_employees:[],
      course_length_in_hour:0,
      form: {
        employee_ids:[],
        course_type:2,
        start_date: null,
        end_date: null,
        duration_in_hour: '',
        duration_in_week: '',
        course_schedules:[
          {employee_id:null, date:null, 'day':null, start_time:null, end_time:null, classes:'', course:'', is_exam:false}
        ],
      },
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      one_on_ones:[
        {employee_id:null, date:null, start_time:null, end_time:null, classes:'', course_name:'', is_exam:false}
      ],
      regulars:[
        {employee_id:null, date:null, day:null, start_time:null, end_time:null, classes:'', course_name:'', is_exam:false},
        {employee_id:null, date:null, day:null, start_time:null, end_time:null, classes:'', course_name:'', is_exam:false},
        {employee_id:null, date:null, day:null, start_time:null, end_time:null, classes:'', course_name:'', is_exam:false},
        {employee_id:null, date:null, day:null, start_time:null, end_time:null, classes:'', course_name:'', is_exam:false},
        {employee_id:null, date:null, day:null, start_time:null, end_time:null, classes:'', course_name:'', is_exam:false},
        {employee_id:null, date:null, day:null, start_time:null, end_time:null, classes:'', course_name:'', is_exam:false},
        {employee_id:null, date:null, day:null, start_time:null, end_time:null, classes:'', course_name:'', is_exam:false},
      ],
      schedule_types: [
        {id:1, name: "Regular"},
        {id:2, name: "One on One"},
      ],
    }
  },
  computed:{
    ...mapGetters('admin/course',['days']),
    ...mapGetters('admin/employee',['only_employees','findEmployeeNameById']),
  },
  methods: {
    selectedEmployeeFind() {
      this.selected_employees = this.only_employees.filter(item => {
        if (this.form.employee_ids.includes(item.id)) return item
      })
      this.auto7DateMake()
    },
    weekCount() {
      if (!this.editMode) {
        if (this.form.start_date && this.form.end_date) {
          this.form.duration_in_week = this.moment(this.form.end_date).diff(this.form.start_date, 'weeks')
        } else this.form.duration_in_week = 0
      }
    },
    durationHourCalculate(){
      if (!this.editMode) {
        if (this.course_length_in_hour && this.form.course_type && this.form.duration_in_week){
          if (this.form.course_type === 1){
            this.form.duration_in_hour = (this.course_length_in_hour * this.form.duration_in_week * 7)
          }else{
            this.form.duration_in_hour = (this.course_length_in_hour * this.form.duration_in_week * this.one_on_ones.length)
          }
        }else{
          this.form.duration_in_hour=0
        }
      }
    },
    examDaysCreate() {
      if (!this.editMode) {
        this.exam_days = []
        this.selected_exam_days = []
        if (this.form.start_date && this.form.end_date && this.form.duration_in_week) {
          let ll =this.form.start_date
          for (let i = 0; i < (this.form.duration_in_week * 7); i++) {
            if (i > 0) {
              ll = moment(ll).add(i, 'days');
              ll = moment(ll).format('YYYY-MM-DD');
            }
            let day = this.moment(ll).format('dddd')
            this.exam_days.push({ id:(i + 1),date:ll, day:day });
          }
        }
      }
    },
    endDateCalculate() {
      if (this.form.start_date && this.form.duration_in_week) {
        let c_date = moment(this.form.start_date).add(this.form.duration_in_week, 'weeks');
        this.form.end_date = moment(c_date).format('YYYY-MM-DD');
      } else {
        this.form.end_date = null
      }

    },
    auto7DateMake() {
      if (!this.editMode && this.form.start_date && this.form.course_type === 1) {
        let ll = this.form.start_date;
        this.regulars = this.regulars.filter((itm, key) => {
          if (key > 0) {
            ll = moment(ll).add(1, 'days');
            ll = moment(ll).format('YYYY-MM-DD');
          }
          itm.date = ll
          itm.day = this.moment(ll).format('dddd')
          itm.start_time = this.start_time
          itm.end_time = this.end_time
          itm.employee_id = this.selected_employees[0] ? this.selected_employees[0].id : null
          return itm;
        })
      }
    },
    scheduleMake() {
      if (!this.editMode) {
        this.form.course_schedules = []
        if (this.form.course_type === 1) {
          //this.auto7DateMake()
          //this.examDaysCreate()
          this.exam_counter = 0
          this.class_counter = 0
          if (this.form.start_date && this.form.end_date && this.form.duration_in_week && this.start_time && this.end_time) {
            this.form.course_schedules = []
            //let c_date= this.form.start_date
            for (let i = 0; i < this.form.duration_in_week; i++) {
              this.regulars.forEach((item, key) => {
                let c_date = item.date
                if (i > 0) {
                  c_date = moment(c_date).add((i * 7), 'days');
                  c_date = moment(c_date).format('YYYY-MM-DD');
                }
                /*if exam date found*/
                if (this.selected_exam_days.includes((i * 7) + (key + 1))) {
                  this.exam_counter += 1
                  this.form.course_schedules.push({
                    employee_id: item.employee_id,
                    date: c_date,
                    'day': this.moment(c_date).format('dddd'),
                    start_time: null,
                    end_time: '23:59',
                    classes: 'Exam ', //+ this.exam_counter,
                    course_name: item.course_name,
                    is_exam: true
                  });
                } else {
                  this.class_counter += 1
                  this.form.course_schedules.push({
                    employee_id: item.employee_id,
                    date: c_date,
                    'day': this.moment(c_date).format('dddd'),
                    start_time: item.start_time,
                    end_time: item.end_time,
                    classes: 'Class ', //+ this.class_counter,
                    course_name: item.course_name,
                    is_exam: false
                  });
                }
              })
            }
          } else {
            this.form.course_schedules = [{
              employee_id: null,
              date: null,
              'day': null,
              start_time: null,
              end_time: null,
              classes: '',
              course_name: '',
              is_exam: false
            }];
          }
        } else if (this.form.course_type === 2) {
          if (this.form.duration_in_week && this.one_on_ones.length) {
            let one_counter = 0
            this.one_on_ones.filter(item => {
              if (item.date) one_counter += 1
            })
            let one_ones = this.one_on_ones;
            if (one_counter === this.one_on_ones.length) {
              for (let i = 0; i < this.form.duration_in_week; i++) {
                one_ones.forEach(itm => {
                  let ll = itm.date;
                  if (i > 0) {
                    ll = moment(ll).add((7 * i), 'days');
                    ll = moment(ll).format('YYYY-MM-DD');
                  }
                  this.form.course_schedules.push({
                    employee_id: itm.employee_id,
                    date: ll,
                    day: this.moment(ll).format('dddd'),
                    start_time: itm.start_time,
                    end_time: itm.end_time,
                    classes: itm.classes,
                    course_name: itm.course_name,
                    is_exam: false
                  });
                })
              }
            } else {
              this.form.course_schedules = [{
                employee_id: null,
                date: null,
                'day': null,
                start_time: null,
                end_time: null,
                classes: '',
                course_name: '',
                is_exam: false
              }];
            }
          } else {
            this.form.course_schedules = [{
              employee_id: null,
              date: null,
              'day': null,
              start_time: null,
              end_time: null,
              classes: '',
              course_name: '',
              is_exam: false
            }];
          }
        }

      }
    },
    addWE() {
      this.form.course_schedules.push({
        employee_id: null,
        date: null,
        'day': null,
        start_time: null,
        end_time: null,
        classes: '',
        course_name: '',
        is_exam: false
      });
    },
    spliceWE(index) {
      this.form.course_schedules.splice(index, 1);
    },
    addOne() {
      this.one_on_ones.push({
        employee_id: null,
        date: null,
        start_time: null,
        end_time: null,
        classes: '',
        course_name: '',
        is_exam: false
      });
    },
    spliceOne(index) {
      this.one_on_ones.splice(index, 1);
    },
    createOrUpdate(item) {
      this.form.employee_ids = item.employees.map(item => item.id)
      this.form.course_type = 2
      if (item.courseSchedules.length){
        let e_date = item.courseSchedules[item.courseSchedules.length-1].date
        e_date = moment(e_date).add(1, 'days');
        this.form.start_date = moment(e_date).format('YYYY-MM-DD');
      }
      this.selectedEmployeeFind()
    },
    async submitData() {
      this.loader.isSubmitting = true
      this.scheduleMake()
      const formData = this.$generateFormData(this.form, this.editIndex > -1, ['course_schedules'])
      let url = '/additional/course/schedule/store'+ this.course.id
      await this.$axios.post(url, formData).then((response) => {
        //this.addOrUpdateState(response, stateName, storeName)
        this.$toaster.success(`${this.pageInfo.pageName} ${this.editMode ? 'updated' : 'created'} successfully!!`)
        this.closeModal()
        let url = `/course?per_page=20&page=1`
        const payload = {apiUrl: url, stateName}
        this.$store.dispatch(storeName + '/getItems', payload)
      }).catch((error) => {
        if (error.response.status === 422) {
          this.$refs.observer.setErrors(error?.response?.data?.errors)
          Object.keys(error.response.data.errors).map((field) => {
            this.$toaster.error(error.response.data.errors[field][0]);
          });
        } else this.$toaster.error(error.response.data.message);
      }).finally(() => {
        this.loader.isSubmitting = false
      })
    },
    closeModal() {
      this.dialog = false
      this.clear()
    },
    clear() {
      this.editIndex = -1
      this.$refs.form.reset()
      this.$refs.observer.reset()
    }
  },
  watch:{
    'form.start_date'(){
      this.endDateCalculate()
      this.weekCount()
      this.auto7DateMake()
    },
    'form.end_date'(){
      this.weekCount()
      this.auto7DateMake()
    },
    'form.duration_in_week'(){
      this.endDateCalculate()
      this.examDaysCreate()
      this.auto7DateMake()
      this.durationHourCalculate()
    },
    start_time(){
      this.auto7DateMake()
    },
    end_time(){
      this.auto7DateMake()
    },
    'form.course_type'(){
      this.auto7DateMake()
      this.durationHourCalculate()
    },
    course_length_in_hour(){
      this.durationHourCalculate()
    },
    one_on_ones:{
      handler: function (val, oldVal) {
        this.durationHourCalculate()
      },
      deep: true
    },
    course(){
      this.createOrUpdate(this.course)
    }
  }
}
</script>
