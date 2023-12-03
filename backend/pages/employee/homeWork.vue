<template>
  <v-container fluid>
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: 'Course',disabled: false, href: '/employee/course'},{text: `${pageInfo.pageName}`,disabled: true, href: '/employee/homeWork'}]"
    />
    <v-card>
      <v-data-table
        dense
        v-model="selected"
        item-key="id"
        :headers="headers"
        :items="home_works"
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
                              name="submission last date"
                              vid="submission_last_date"
                              rules="required"
                            >
                              <v-text-field
                                v-model="form.submission_last_date"
                                label="Submission Last Date"
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
                              name="total mark"
                              vid="total_mark"
                              rules="required|min_value:1"
                            >
                              <v-text-field
                                v-model="form.total_mark"
                                label="Total Mark"
                                :error-messages="errors"
                                type="number"
                                step="any"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" xs="12" sm="6">
                            <validation-provider
                              v-slot="{ errors }"
                              name="file"
                              vid="file"
                              :rules="editMode?'':'required'"
                            >
                              <v-file-input
                                v-model="form.file"
                                label="File"
                                filled
                                :error-messages="errors"
                                outlined
                                dense
                                hide-details="auto"
                                show-size
                                single-line
                                small-chips
                                counter
                              />
                            </validation-provider>
                          </v-col>
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
        <template v-slot:item.is_active="{ index, item }">
          <v-switch v-if="$can('status change',pageInfo.permission)"
                    class="pa-0 ma-0"
                    hide-details
                    :value="true"
                    :input-value="item.is_active"
                    @change="toggleStatusChange(index, $event !== null, $event, item.id, state.name, state.store_name,'is_active')">
          </v-switch>
        </template>
        <template v-slot:item.actions="{index, item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn x-small class="accent" v-bind="attrs"
                     v-on="on" fab @click="viewSchedule(item,index)">
                <v-icon>mdi-eye</v-icon>
              </v-btn>
            </template>
            <span>View</span>
          </v-tooltip>
          <v-tooltip bottom v-if="$can('edit',pageInfo.permission)">
            <template v-slot:activator="{ on, attrs }">
              <v-btn x-small class="accent" v-bind="attrs" @click="createOrUpdate(item)"
                     v-on="on" color="green" fab >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <span>Edit</span>
          </v-tooltip>
          <v-tooltip bottom v-if="$can('remove',pageInfo.permission)">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="error" x-small fab @click="deleteItem(item, index, state.store_name)" v-if="$can('read','Employee')">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>Remove</span>
          </v-tooltip>
        </template>
      </v-data-table>
      <v-dialog v-model="dialog2" persistent max-width="1000">
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
                <v-card-subtitle class="text-center">{{  selectedItem?selectedItem.course?selectedItem.course.name : '' : '' }} {{ ' '+ 'Home Work' }}</v-card-subtitle>
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                      <th class="text-left">
                        Student ID
                      </th>
                      <th class="text-left">
                        Upload File
                      </th>
                      <th class="text-left">
                        Submission Type
                      </th>
                      <th class="text-left">
                        Total Mark
                      </th>
                      <th class="text-left">
                        Obtain Mark
                      </th>
                      <th class="text-left">
                        Action
                      </th>
                    </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(item,key ) in selectedItem.studentHomeWorks"
                        :key="key">
                        <td>{{ item.student ? item.student.student_id : '' }}</td>
                        <td>
                          <v-btn x-small class="accent" fab :href="item.file" target="_blank">
                            <v-icon>mdi-eye</v-icon>
                          </v-btn>
                        </td>
                        <td>{{ item.submission_type }}</td>
                        <td>{{ item.total_mark }}</td>
                        <td>
                          {{ item.mark }}
                        </td>
                        <td>
                          <v-tooltip bottom v-if="$can('edit',pageInfo.permission)">
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn x-small class="accent" v-bind="attrs" @click="viewMarkUpdateModal(item,key)"
                                     v-on="on" color="green" fab>
                                <v-icon>mdi-pen</v-icon>
                              </v-btn>
                            </template>
                            <span>Update</span>
                          </v-tooltip>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-container>
            </v-sheet>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="mr-2 error darken-1 white--text" depressed @click="closeSchedule()">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialog3" persistent max-width="400">
        <v-container>
          <v-card>
            <validation-observer ref="observer3" v-slot="{ invalid }">
              <v-form ref="form3" @submit.prevent="updateMark()">
                <v-card-title class="text-h5"> Update Mark </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row dense>
                      <v-col cols="12">
                        <validation-provider
                            v-slot="{ errors }"
                            name="mark"
                            vid="mark"
                            :rules="'required|min_value:0|max_value:'+selectedItemMark.total_mark"
                        >
                          <v-text-field
                              v-model="form2.mark"
                              type="number" step="any"
                              :error-messages="errors"
                              dense outlined></v-text-field>
                        </validation-provider>
                      </v-col>
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
                    Update
                  </v-btn>
                  <v-btn class="mr-2 error darken-1 white--text" depressed @click="closeMarkUpdateModal()">Close</v-btn>
                </v-card-actions>
              </v-form>
            </validation-observer>
          </v-card>
        </v-container>
      </v-dialog>
    </v-card>
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
const permission = 'Employee Homework'
const stateName = 'home_works'
const storeName='employee/home_work'
export default {
  name: 'HomeWork',
  head: {
    title: 'Home Works',
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
        pageName: 'Home Works',
        apiUrl: '/employee/home/work/',
        permission,
      },
      state: {
        name: stateName,
        store_name: storeName,
      },
      selected: [],
      selectedItem:{},
      selectedItemMark:{},
      options: {},
      dialog: false,
      dialog2: false,
      dialog3: false,
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
          sortable:false
        },
        {
          text: 'Batch',
          align: 'start',
          value: 'course.batch',
          sortable:false
        },
        {
          text: 'Course Name',
          align: 'start',
          value: 'course.name',
          sortable:false
        },
        {
          text: 'Total Mark',
          align: 'start',
          value: 'total_mark',
          sortable:false
        },
        {
          text: 'Submission Last Date',
          align: 'start',
          value: 'submission_last_date_us',
          sortable:false
        },
        {
          text: 'Total Submitted',
          align: 'center',
          value: 'studentHomeWorks.length',
          sortable:false
        },
        {
          text: 'File',
          align: 'start',
          value: 'file',
          sortable:false
        },
        {
          text: 'Status',
          align: 'start',
          value: 'is_active',
          sortable:false
        },
        {
          text: 'Action',
          value: 'actions',
          sortable:false
        },
      ],
      form: {
        file: null,
        submission_last_date:null,
        total_mark:0,
        course_id:null,
      },
      footerProps: {
        itemsPerPageOptions: [10,20, 50, 100, 500]
      },
      form2:{
        mark:0,
        student_home_work_id:null
      },
      temp_index:null,
      temp_index2:null,
    }
  },
  computed: {
    ...mapGetters('employee/home_work',['home_works','totalItems']),
    ...mapGetters('employee/employee_course',['only_courses']),
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
    if (!this.home_works.length) await this.init();
    const payload1 = {apiUrl: '/employee/only/course', stateName:'only_courses'}
    if (!this.only_courses.length) await this.$store.dispatch('employee/employee_course/getItems2', payload1)
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
        this.editIndex = this.home_works.indexOf(item)
        this.editMode=true;
      }
      else {
        this.editIndex = -1
        this.editMode=false;
      }
      if (this.editMode) {
        this.selectedItem = item
        this.form = {
          course_id: item.course_id,
          file: null,
          submission_last_date: item.submission_last_date ? this.moment(item.submission_last_date).format('YYYY-MM-DD'):null,
          total_mark: item.total_mark,
        }
      } else {
        this.selectedItem = {}
        this.form = {
          file: null,
          submission_last_date:null,
          total_mark:0,
          course_id:null }
      }
      this.dialog = true
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
    closeModal() {
      this.dialog = false
      this.clear()
    },
    clear() {
      this.editIndex = -1
      this.$refs.form.reset()
      this.$refs.observer.reset()
    },
    viewSchedule(item,index){
      this.selectedItem = item
      this.temp_index = index
      this.dialog2=true
    },
    closeSchedule(){
      this.dialog2=false
      this.selectedItem={}
      this.temp_index = null
    },
    viewMarkUpdateModal(item,key){
      this.selectedItemMark = item
      this.form2.student_home_work_id = item.id
      this.form2.mark = item.mark
      this.temp_index2 = key
      this.dialog3=true
    },
    closeMarkUpdateModal(){
      this.selectedItemMark = {}
      this.form2.student_home_work_id = null
      this.form2.mark = null
      this.temp_index2 = null
      this.dialog3=false
    },
    async updateMark(){
      let data = new FormData();
      data.append('mark',this.form2.mark)
      data.append('student_home_work_id',this.form2.student_home_work_id)
      data.append('_method','PUT')
      await this.$axios.post(`/employee/home/work/mark/upload/${this.form2.student_home_work_id}`,data).then((response)=>{
        this.$toaster.success(response.data.message);
        let payload = { index1:this.temp_index, index2: this.temp_index2, mark:this.form2.mark }
        this.$store.commit('employee/home_work/UPDATE_SINGLE_MARK',payload)
        this.closeMarkUpdateModal()
        //this.init()
      }).catch((error)=>{
        if (error.response.status === 422) {
          //this.$refs.observer.setErrors(error?.response?.data?.errors)
          Object.keys(error.response.data.errors).map((field) => {
            this.$toaster.error(error.response.data.errors[field][0]);
          });
        } else this.$toaster.error(error.response.data.message);
      })
    }
  }
}
</script>
