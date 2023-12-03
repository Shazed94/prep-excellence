<template>
  <v-container fluid>
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: 'Test & Results',disabled: true, href: '/admin/exam'},{text: 'Student Test',disabled: true, href: '/admin/exam'}]"
    />
    <v-card>
      <v-data-table
        dense
        v-model="selected"
        item-key="id"
        show-select
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
            <v-dialog v-model="dialog" persistent max-width="900">
              <template v-slot:activator="{ on, attrs }">
                <!--                color="primary"-->
                <v-btn v-if="$can('create',pageInfo.permission)"
                       style="background: #01579B"
                       class="mx-2 white--text"
                       icon
                       small
                       v-bind="attrs"
                       v-on="on"
                       @click="createOrUpdate()"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>
              <v-card>
                <validation-observer ref="observer" v-slot="{ invalid }">
                  <v-form ref="form" @submit.prevent="submitData()">
                    <v-card-title class="text-h5"> {{ editIndex > -1 ? 'Update ' : 'Create' }} {{ pageInfo.pageName | capitalize }}</v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row dense>
                          <v-col cols="12" xs="12" sm="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="course"
                              vid="course"
                              rules="required">
                              <v-autocomplete
                                v-model="form.course_id"
                                :items="only_courses"
                                :error-messages="errors"
                                item-text="name"
                                item-value="id"
                                label="Course"
                                dense
                                clearable
                                hide-details="auto"
                                outlined></v-autocomplete>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="exam type"
                              vid="exam type"
                              rules="required">
                              <v-autocomplete
                                v-model="form.exam_type"
                                :items="ex_types"
                                :error-messages="errors"
                                item-text="name"
                                item-value="id"
                                label="Exam Type"
                                dense
                                clearable
                                hide-details="auto"
                                outlined></v-autocomplete>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" v-if="form.exam_type === 2">
                            <validation-provider
                              v-slot="{ errors }"
                              name="sat score"
                              vid="sat score"
                              rules="required">
                              <v-autocomplete
                                v-model="form.sat_section_id"
                                :items="all_sat_sections"
                                :error-messages="errors"
                                item-text="title"
                                item-value="id"
                                label="Sat Score"
                                dense
                                clearable
                                hide-details="auto"
                                outlined></v-autocomplete>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="exam Title"
                              vid="exam title"
                              rules="required">
                              <v-text-field
                                v-model="form.title"
                                :error-messages="errors"
                                label="Exam Title"
                                dense
                                clearable
                                hide-details="auto"
                                outlined></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="exam time"
                              vid="exam time"
                              rules="required">
                              <v-autocomplete
                                v-model="form.time_type"
                                :items="ex_times"
                                :error-messages="errors"
                                item-text="name"
                                item-value="id"
                                label="Exam Time"
                                dense
                                clearable
                                hide-details="auto"
                                outlined></v-autocomplete>
                            </validation-provider>
                          </v-col>
                          <template v-if="form.time_type === 1">
                            <v-col cols="12" xs="12" sm="4">
                              <validation-provider
                                v-slot="{ errors }"
                                name="Start At"
                                vid="start at"
                                rules="required"
                              >
                                <v-text-field
                                  v-model="form.exam_start"
                                  label="Start At"
                                  type="datetime-local"
                                  :error-messages="errors"
                                  dense
                                  outlined
                                  auto-grow
                                  no-resize
                                ></v-text-field>
                              </validation-provider>
                            </v-col>
                            <v-col cols="12" xs="12" sm="4">
                              <validation-provider
                                v-slot="{ errors }"
                                name="end at"
                                vid="end at"
                                rules="required"
                              >
                                <v-text-field
                                  v-model="form.exam_end"
                                  label="End At"
                                  :error-messages="errors"
                                  type="datetime-local"
                                  dense
                                  outlined
                                  auto-grow
                                  no-resize
                                ></v-text-field>
                              </validation-provider>
                            </v-col>
                          </template>
                          <template v-if="form.time_type === 2">
                            <v-col cols="12" xs="12" sm="4">
                              <validation-provider
                                v-slot="{ errors }"
                                name="Start date"
                                vid="start date"
                                rules="required"
                              >
                                <v-text-field
                                  v-model="form.exam_start_date"
                                  label="Start Date"
                                  type="date"
                                  :error-messages="errors"
                                  dense
                                  outlined
                                  auto-grow
                                  no-resize
                                ></v-text-field>
                              </validation-provider>
                            </v-col>
                            <v-col cols="12" xs="12" sm="4">
                              <validation-provider
                                v-slot="{ errors }"
                                name="end date"
                                vid="end date"
                                rules="required"
                              >
                                <v-text-field
                                  v-model="form.exam_end_date"
                                  label="End Date"
                                  :error-messages="errors"
                                  type="date"
                                  dense
                                  outlined
                                  auto-grow
                                  no-resize
                                ></v-text-field>
                              </validation-provider>
                            </v-col>
                            <v-col cols="12" xs="12" sm="4">
                              <validation-provider
                                v-slot="{ errors }"
                                name="duration"
                                vid="duration"
                                rules="required"
                              >
                                <v-text-field
                                  v-model="form.duration"
                                  label="Duration(min)"
                                  :error-messages="errors"
                                  dense
                                  outlined
                                  auto-grow
                                  no-resize
                                ></v-text-field>
                              </validation-provider>
                            </v-col>
                          </template>
                        </v-row>
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
          </v-toolbar>
        </template>
        <template v-slot:item.sno="{ index, item }">
          {{ index+1 }}
        </template>
        <template v-slot:item.file="{ index, item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn x-small class="accent" v-bind="attrs"
                     v-on="on" fab :href="item.file" target="_blank">
                <v-icon>mdi-eye</v-icon>
              </v-btn>
            </template>
            <span>View</span>
          </v-tooltip>
        </template>
        <template v-slot:item.status="{ index, item }">
          <v-switch v-if="$can('status change',pageInfo.permission)"
                    class="pa-0 ma-0"
                    hide-details
                    :value="true"
                    :input-value="item.status"
                    @change="toggleStatusChange(index, $event !== null, $event, item.id, state.name, state.store_name,'status')">
          </v-switch>
        </template>
        <template v-slot:item.actions="{index, item }">
          <v-tooltip bottom v-if="$can('edit',pageInfo.permission)">
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-if="item.exam_type === 1" x-small class="accent" v-bind="attrs"
                     v-on="on" fab :to="`/admin/exam/question/edit/${item.id}`">
                <v-icon>mdi-eye</v-icon>
              </v-btn>
              <v-btn v-else x-small class="accent" v-bind="attrs"
                     v-on="on" fab :to="`/admin/exam/question/edit/sat/${item.id}`">
                <v-icon>mdi-eye</v-icon>
              </v-btn>
            </template>
            <span>View</span>
          </v-tooltip>
          <v-tooltip bottom v-if="$can('create',pageInfo.permission)">
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-if="item.exam_type === 1" x-small class="accent" v-bind="attrs"
                     v-on="on" fab :to="`/admin/exam/question/${item.id}`">
                <v-icon>mdi-plus-box-multiple</v-icon>
              </v-btn>
              <v-btn v-else x-small class="accent" v-bind="attrs"
                     v-on="on" fab :to="`/admin/exam/question/sat/${item.id}`">
                <v-icon>mdi-plus-box-multiple</v-icon>
              </v-btn>
            </template>
            <span>Add More</span>
          </v-tooltip>
          <v-tooltip bottom v-if="$can('create',pageInfo.permission)">
            <template v-slot:activator="{ on, attrs }">
              <v-btn x-small class="accent" v-bind="attrs"
                     v-on="on" color="green" fab @click="cloneForm(item)">
                <v-icon>mdi-content-copy</v-icon>
              </v-btn>
            </template>
            <span>Clone</span>
          </v-tooltip>
          <v-tooltip bottom v-if="$can('edit',pageInfo.permission)">
            <template v-slot:activator="{ on, attrs }">
              <v-btn x-small class="accent" v-bind="attrs"
                     v-on="on" color="green" fab @click="createOrUpdate(item)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <span>Edit</span>
          </v-tooltip>
          <v-tooltip bottom v-if="$can('remove',pageInfo.permission)">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="error" x-small fab @click="deleteItem(item, index, state.store_name)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>Remove</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="dialog_clone" persistent max-width="900">
      <v-card>
        <validation-observer ref="observer" v-slot="{ invalid }">
          <v-form ref="form" @submit.prevent="submitCloneData()">
            <v-card-title class="text-h5"> Clone {{ pageInfo.pageName | capitalize }}</v-card-title>
            <v-card-text>
              <v-container>
                <v-row dense>
                  <v-col cols="12" xs="12" sm="4">
                    <validation-provider
                      v-slot="{ errors }"
                      name="course"
                      vid="course"
                      rules="required">
                      <v-autocomplete
                        v-model="form.course_id"
                        :items="only_courses"
                        :error-messages="errors"
                        item-text="name"
                        item-value="id"
                        label="Course"
                        dense
                        clearable
                        hide-details="auto"
                        outlined></v-autocomplete>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" xs="12" sm="4">
                    <validation-provider
                      v-slot="{ errors }"
                      name="exam type"
                      vid="exam type"
                      rules="required">
                      <v-autocomplete
                        disabled
                        v-model="form.exam_type"
                        :items="ex_types"
                        :error-messages="errors"
                        item-text="name"
                        item-value="id"
                        label="Exam Type"
                        dense
                        clearable
                        hide-details="auto"
                        outlined></v-autocomplete>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" xs="12" sm="4" v-if="form.exam_type === 2">
                    <validation-provider
                      v-slot="{ errors }"
                      name="sat score"
                      vid="sat score"
                      rules="required">
                      <v-autocomplete
                        v-model="form.sat_section_id"
                        :items="all_sat_sections"
                        :error-messages="errors"
                        item-text="title"
                        item-value="id"
                        label="Sat Score"
                        dense
                        clearable
                        hide-details="auto"
                        outlined></v-autocomplete>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" xs="12" sm="4">
                    <validation-provider
                      v-slot="{ errors }"
                      name="exam Title"
                      vid="exam title"
                      rules="required">
                      <v-text-field
                        v-model="form.title"
                        :error-messages="errors"
                        label="Exam Title"
                        dense
                        clearable
                        hide-details="auto"
                        outlined></v-text-field>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" xs="12" sm="4">
                    <validation-provider
                      v-slot="{ errors }"
                      name="exam time"
                      vid="exam time"
                      rules="required">
                      <v-autocomplete
                        v-model="form.time_type"
                        :items="ex_times"
                        :error-messages="errors"
                        item-text="name"
                        item-value="id"
                        label="Exam Time"
                        dense
                        clearable
                        hide-details="auto"
                        outlined></v-autocomplete>
                    </validation-provider>
                  </v-col>
                  <template v-if="form.time_type === 1">
                    <v-col cols="12" xs="12" sm="4">
                      <validation-provider
                        v-slot="{ errors }"
                        name="Start At"
                        vid="start at"
                        rules="required"
                      >
                        <v-text-field
                          v-model="form.exam_start"
                          label="Start At"
                          type="datetime-local"
                          :error-messages="errors"
                          dense
                          outlined
                          auto-grow
                          no-resize
                        ></v-text-field>
                      </validation-provider>
                    </v-col>
                    <v-col cols="12" xs="12" sm="4">
                      <validation-provider
                        v-slot="{ errors }"
                        name="end at"
                        vid="end at"
                        rules="required"
                      >
                        <v-text-field
                          v-model="form.exam_end"
                          label="End At"
                          :error-messages="errors"
                          type="datetime-local"
                          dense
                          outlined
                          auto-grow
                          no-resize
                        ></v-text-field>
                      </validation-provider>
                    </v-col>
                  </template>
                  <template v-if="form.time_type === 2">
                    <v-col cols="12" xs="12" sm="4">
                      <validation-provider
                        v-slot="{ errors }"
                        name="Start date"
                        vid="start date"
                        rules="required"
                      >
                        <v-text-field
                          v-model="form.exam_start_date"
                          label="Start Date"
                          type="date"
                          :error-messages="errors"
                          dense
                          outlined
                          auto-grow
                          no-resize
                        ></v-text-field>
                      </validation-provider>
                    </v-col>
                    <v-col cols="12" xs="12" sm="4">
                      <validation-provider
                        v-slot="{ errors }"
                        name="end date"
                        vid="end date"
                        rules="required"
                      >
                        <v-text-field
                          v-model="form.exam_end_date"
                          label="End Date"
                          :error-messages="errors"
                          type="date"
                          dense
                          outlined
                          auto-grow
                          no-resize
                        ></v-text-field>
                      </validation-provider>
                    </v-col>
                    <v-col cols="12" xs="12" sm="4">
                      <validation-provider
                        v-slot="{ errors }"
                        name="duration"
                        vid="duration"
                        rules="required"
                      >
                        <v-text-field
                          v-model="form.duration"
                          label="Duration(min)"
                          :error-messages="errors"
                          dense
                          outlined
                          auto-grow
                          no-resize
                        ></v-text-field>
                      </validation-provider>
                    </v-col>
                  </template>
                </v-row>
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
                {{ 'Save' }}
              </v-btn>
              <v-btn class="mr-2 error darken-1 white--text" depressed @click="closeModalClone">Close</v-btn>
            </v-card-actions>
          </v-form>
        </validation-observer>
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
const permission = 'Test'
const stateName = 'exams'
const storeName='admin/exams'
export default {
  name: 'Exam',
  head: {
    title: 'Test',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: ''
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
        pageName: 'Exam Manage',
        apiUrl: '/bbb-employee/exams/',
        permission,
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
          text: 'Start At',
          align: 'start',
          value: 'exam_start'
        },
        {
          text: 'End At',
          align: 'center',
          value: 'exam_end'
        },
        {
          text: 'Duration(Min)',
          align: 'center',
          value: 'duration'
        },
        {
          text: 'Status',
          align: 'start',
          value: 'status'
        },
        {
          text: 'Action',
          value: 'actions'
        },
      ],
      form: {
        title:'',
        time_type:1,
        exam_start_date:null,
        exam_end_date:null,
        exam_start:null,
        exam_end:null,
        duration:0,
        exam_type:1,
        course_id:null,
        sat_section_id:null,
      },
      ex_types:[
        {id:1 , name:'Regular'},
        {id:2 , name:'SAT'},
      ],
      ex_times:[
        {id:1 , name:'Fixed'},
        {id:2 , name:'Not Fixed'},
      ],
      footerProps: {
        itemsPerPageOptions: [20, 50, 100, 500]
      },
    }
  },
  computed: {
    ...mapGetters('admin/exams',['exams','totalItems']),
    ...mapGetters('admin/course',['only_courses']),
    ...mapGetters('admin/sat_score',['all_sat_sections']),
    ...mapGetters('sat/basic',['question_qualities','all_keys','sat_keys','sub_scores','cross_test_scores','sat_exams']),
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
      if (value.length >= 3 || oldVal.length >= 3) {
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
    if (!this.exams.length) await this.init();
    const payload1 = {apiUrl: '/only/course', stateName:'only_courses'}
    if (!this.only_courses.length) await this.$store.dispatch('admin/course/getItems2', payload1)

    const payload2 = {apiUrl: '/sat/question/qualities', stateName:'question_qualities'}
    if (!this.question_qualities.length) await this.$store.dispatch('sat/basic/getItems', payload2)

    const payload3 = {apiUrl: '/sat/all/keys', stateName:'all_keys'}
    if (!this.all_keys.length) await this.$store.dispatch('sat/basic/getItems', payload3)

    const payload4 = {apiUrl: '/sat/keys', stateName:'sat_keys'}
    if (!this.sat_keys.length) await this.$store.dispatch('sat/basic/getItems', payload4)

    const payload5 = {apiUrl: '/sat/sub/score', stateName:'sub_scores'}
    if (!this.sub_scores.length) await this.$store.dispatch('sat/basic/getItems', payload5)

    const payload6 = {apiUrl: '/sat/cross/test/score', stateName:'cross_test_scores'}
    if (!this.cross_test_scores.length) await this.$store.dispatch('sat/basic/getItems', payload6)

    const payload7 = {apiUrl: '/sat/exams', stateName:'sat_exams'}
    if (!this.sat_exams.length) await this.$store.dispatch('sat/basic/getItems', payload7)

    const payload8 = {apiUrl: '/sat-exam/score/section', stateName:'all_sat_sections'}
    if (!this.all_sat_sections.length) await this.$store.dispatch('admin/sat_score/getItems2', payload8)

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
      await this.$store.dispatch(storeName+'/getItems', payload1)
      this.loader.isLoading = false
    },
    createOrUpdate(item = null) {
      if (item) {
        this.editIndex = this.exams.indexOf(item)
        this.editMode=true;
      }
      else {
        this.editIndex = -1
        this.editMode=false;
      }

      if (this.editMode) {
        this.selectedItem = item
        this.form = {
          title:item.title,
          time_type:item.time_type,
          exam_start_date:item.exam_start_date,
          exam_end_date:item.exam_end_date,
          exam_start: item.exam_start,
          exam_end: item.exam_end,
          duration: item.duration,
          exam_type: item.exam_type,
          course_id: item.course_id,
          sat_section_id: item.sat_section_id,
        }
      } else {
        this.selectedItem = {}
        this.form = {
          title:'',
          time_type:1,
          exam_start_date:null,
          exam_end_date:null,
          exam_start:null,
          exam_end:null,
          duration:0,
          exam_type:1,
          course_id:null,
          sat_section_id:null,
        }
      }
      this.dialog = true
    },
    cloneForm(item) {
      this.selectedItem = item
      this.form = {
        title: item.title,
        time_type: item.time_type,
        exam_start_date: item.exam_start_date,
        exam_end_date: item.exam_end_date,
        exam_start: item.exam_start,
        exam_end: item.exam_end,
        duration: item.duration,
        exam_type: item.exam_type,
        question_type: item.question_type,
        question: item.question,
        course_id: item.course_id,
        sat_section_id: item.sat_section_id,
      }
      this.dialog_clone = true
    },
    async submitData() {
      this.loader.isSubmitting = true
      const formData = this.$generateFormData(this.form, this.editIndex > -1)
      let url = this.pageInfo.apiUrl

      if (this.editMode) url = url + this.selectedItem.id

      await this.$axios.post(url, formData).then((response) => {
        this.addOrUpdateState(response, stateName, storeName)
        this.$toaster.success(`${this.pageInfo.pageName} ${this.editMode ? 'updated' : 'created'} successfully!!`)
        this.closeModal()
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
    async submitCloneData() {
      this.loader.isSubmitting = true
      const formData = this.$generateFormData(this.form, this.editIndex > -1)
      let url = this.pageInfo.apiUrl + 'clone/'
      url = url + this.selectedItem.id

      await this.$axios.post(url, formData).then((response) => {
        this.addOrUpdateState(response, stateName, storeName)
        this.$toaster.success(`${this.pageInfo.pageName} clone successfully!!`)
        this.closeModalClone()
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
    closeModalClone() {
      this.dialog_clone = false
      this.clear()
    },
    clear() {
      this.editIndex = -1
      this.$refs.form.reset()
      this.$refs.observer.reset()
    },
  }
}
</script>
