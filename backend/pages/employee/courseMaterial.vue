<template>
  <v-container fluid>
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: 'Course',disabled: false, href: '/employee/course'},{text: `${pageInfo.pageName}`,disabled: true, href: '/employee/courseMaterial'}]"
    />
    <v-card>
      <v-data-table
        dense
        v-model="selected"
        item-key="id"
        :headers="headers"
        :items="course_materials"
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
            <v-dialog v-model="dialog" persistent max-width="500">
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
                          <v-col cols="12" xs="12" sm="12">
                            <validation-provider
                              v-slot="{ errors }"
                              name="course"
                              vid="course_id"
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
                          <v-col cols="12" xs="12" sm="12">
                            <validation-provider
                                v-slot="{ errors }"
                                name="expire date"
                                vid="expire_date"
                                rules="required">
                              <v-text-field
                                  v-model="form.expire_date"
                                  :error-messages="errors"
                                  type="date"
                                  label="Expire Date"
                                  dense
                                  hide-details="auto"
                                  outlined></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" xs="12" sm="12">
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
        <template v-slot:item.expire_date="{ index, item }">
          {{ moment(item.expire_date).format('MM-DD-Y') }}
        </template>
        <template v-slot:item.category="{ index, item }">
          <ul>
            <li v-for="(cat, key) in item.courseCategories" :key="key">{{ cat.name}}</li>
          </ul>
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
                     v-on="on" fab :href="item.file" target="_blank">
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
const permission = 'Employee Course Material'
const stateName = 'course_materials'
const storeName='employee/course_materials'
export default {
  name: 'studentCourse',
  head: {
    title: 'Course Materials',
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
        pageName: 'Course Materials',
        apiUrl: '/employee/course/material/',
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
          text: 'Location',
          align: 'start',
          value: 'course.course_location',
          sortable:false
        },
        {
          text: 'Expire Date',
          align: 'start',
          value: 'expire_date',
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
        type:1,
        course_id:null,
        expire_date:null,
      },
      footerProps: {
        itemsPerPageOptions: [10,20, 50, 100, 500]
      },
    }
  },
  computed: {
    ...mapGetters('employee/course_materials',['course_materials','totalItems']),
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
      if ((value.length >= 2) || oldVal.length >= 2) {
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
    const payload1 = {apiUrl: '/employee/only/course', stateName:'only_courses'}
    if (!this.only_courses.length) await this.$store.dispatch('employee/employee_course/getItems2', payload1)
    this.loader.isLoading=false;
  },
  methods: {
    async init() {
      this.loader.isLoading = true
      let url = `/employee/course/material?per_page=${this.options.itemsPerPage}&page=${this.options.page}`
      if (this.search.length >= 2) {
        url += `&search=${this.search}`
      }
      const payload1 = {apiUrl: url, stateName}
      await this.$store.dispatch(storeName+'/getItems', payload1)
      this.loader.isLoading = false
    },
    createOrUpdate(item = null) {
      if (item) {
        this.editIndex = this.course_materials.indexOf(item)
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
          file:null,
          type:1,
          expire_date:item.expire_date,
        }
      } else {
        this.selectedItem = {}
        this.form = {course_id: null, file:null, type:1, expire_date:null}
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
    }
  }
}
</script>
