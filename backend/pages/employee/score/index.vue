<template>
  <v-container fluid>
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: 'Test',disabled: false, href: '/employee/exam'},{text: `${pageInfo.pageName}`,disabled: true, href: '/employee/score'}]"
    />
    <v-card>
      <v-data-table
        dense
        v-model="selected"
        item-key="id"
        :headers="headers"
        :items="sat_scores"
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
                          <v-col cols="12" xs="12" sm="6">
                            <validation-provider
                              v-slot="{ errors }"
                              name="title"
                              vid="title"
                              rules="required">
                              <v-text-field
                                v-model="form.title"
                                :error-messages="errors"
                                label="Title"
                                dense
                                clearable
                                hide-details="auto"
                                outlined></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" xs="12" sm="12">
                            <v-row dense v-for="(ii,key) in form.scores" :key="key">
                              <v-col cols="12" xs="12" sm="3">
                                <validation-provider
                                  v-slot="{ errors }"
                                  name="raw score"
                                  vid="raw score"
                                  rules="required">
                                  <v-text-field
                                    v-model="form.scores[key].raw_score"
                                    :error-messages="errors"
                                    label="Raw Score"
                                    dense
                                    clearable
                                    hide-details="auto"
                                    outlined></v-text-field>
                                </validation-provider>
                              </v-col>
                              <v-col cols="12" xs="12" sm="3">
                                <validation-provider
                                  v-slot="{ errors }"
                                  name="reading score"
                                  vid="reading score"
                                  rules="">
                                  <v-text-field
                                    v-model="form.scores[key].reading"
                                    :error-messages="errors"
                                    label="Reading score"
                                    dense
                                    clearable
                                    hide-details="auto"
                                    outlined></v-text-field>
                                </validation-provider>
                              </v-col>
                              <v-col cols="12" xs="12" sm="2">
                                <validation-provider
                                  v-slot="{ errors }"
                                  name="writing score"
                                  vid="writing score"
                                  rules="">
                                  <v-text-field
                                    v-model="form.scores[key].writing"
                                    :error-messages="errors"
                                    label="Writing Score"
                                    dense
                                    clearable
                                    hide-details="auto"
                                    outlined></v-text-field>
                                </validation-provider>
                              </v-col>
                              <v-col cols="12" xs="12" sm="2">
                                <validation-provider
                                  v-slot="{ errors }"
                                  name="math score"
                                  vid="math score"
                                  rules="required">
                                  <v-text-field
                                    v-model="form.scores[key].math"
                                    :error-messages="errors"
                                    label="math score"
                                    dense
                                    clearable
                                    hide-details="auto"
                                    outlined></v-text-field>
                                </validation-provider>
                              </v-col>
                              <v-col cols="12" xs="12" sm="2">
                                <v-btn color="error" @click="spliceWE(key)" x-small fab v-if="form.scores.length > 1">
                                  <v-icon>mdi-delete</v-icon>
                                </v-btn>
                                <v-btn color="success" @click="addWE()" x-small fab v-if="form.scores.length === (key+1)">
                                  <v-icon>mdi-plus</v-icon>
                                </v-btn>
                              </v-col>
                            </v-row>
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
        <template v-slot:item.created_at="{ index, item }">
          {{ moment(item.created_at).format('DD-MM-Y hh:mm a') }}
        </template>
        <template v-slot:item.is_active="{ index, item }" v-if="$can('status change',pageInfo.permission)">
          <v-switch
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
              <v-btn x-small class="accent" v-bind="attrs" @click="openScore(item)"
                     v-on="on" fab>
                <v-icon>mdi-eye</v-icon>
              </v-btn>
            </template>
            <span>View</span>
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
<!--          <v-tooltip bottom v-if="$can('remove',pageInfo.permission)">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="error" x-small fab @click="deleteItem(item, index, state.store_name)" v-if="$can('read','Employee')">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>Remove</span>
          </v-tooltip>-->
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="dialog_clone" persistent max-width="900">
      <v-card>
        <validation-observer ref="observer" v-slot="{ invalid }">
          <v-form ref="form" @submit.prevent="submitData()">
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
    <v-dialog v-model="dialog2" persistent max-width="800">
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
              <v-card-subtitle class="text-center"><b>{{  selectedItem.title +' '+ 'Scoring' }}</b></v-card-subtitle>
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                  <tr>
                    <th class="text-left">
                      Row Score
                    </th>
                    <th class="text-left">
                      Reading Score
                    </th>
                    <th class="text-left">
                      Writing Score
                    </th>
                    <th class="text-left">
                      Math Score
                    </th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr
                    v-for="(item,key ) in selectedItem.satScores"
                    :key="key"
                  >
                    <td>{{ item.raw_score }}</td>
                    <td>{{ item.reading }}</td>
                    <td>{{ item.writing }}</td>
                    <td>{{ item.math }}</td>
                  </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-container>
          </v-sheet>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="mr-2 error darken-1 white--text" depressed @click="closeScore()">Close</v-btn>
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

const permission = 'Sat Raw Score'
const stateName = 'sat_scores'
const storeName='employee/sat_score'
export default {
  name: 'SectionAndScore',
  head: {
    title: 'Sat Raw Score',
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
        pageName: 'Section & Test Score',
        apiUrl: '/sat-exam/test/score/',
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
          text: 'Create At',
          align: 'start',
          value: 'created_at',
          sortable: false
        },
        {
          text: 'status',
          align: 'start',
          value: 'is_active',
          sortable: false
        },
        {
          text: 'Action',
          value: 'actions',
          sortable: false
        },
      ],
      form: {
        title:'',
        description:'',
        scores:[
          { raw_score:0, math:'', reading:'', writing:'' }
        ],
      },
      footerProps: {
        itemsPerPageOptions: [20, 50, 100, 500]
      },
    }
  },
  computed: {
    ...mapGetters('employee/sat_score',['sat_scores','totalItems']),
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
      await this.$store.dispatch(storeName+'/getItems', payload1)
      this.loader.isLoading = false
    },
    getOnlyData(item){
      this.form.scores=[];
      if (item.satScores){
        item.satScores.filter(item => {
          this.form.scores.push({raw_score: item.raw_score, math: item.math, reading: item.reading, writing: item.writing})
        });
      }else this.form.scores.push({ raw_score:0, math:'', reading:'', writing:'' })
    },
    createOrUpdate(item = null) {
      if (item) {
        this.editIndex = this.sat_scores.indexOf(item)
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
          description:item.description,
          scores: [],
        }
        this.getOnlyData(item)
      } else {
        this.selectedItem = {}
        this.form = {
          title:'',
          description:'',
          scores:[
            { raw_score:0, math:'', reading:'', writing:'' }
          ],
        }
      }
      this.dialog = true
    },
    cloneForm(item) {
      this.editIndex = -1
      this.selectedItem = item
      this.form = {
        title:item.title,
        description:item.description,
        scores: [],
      }
      this.getOnlyData(item)
      this.dialog = true
    },
    async submitData() {
      this.loader.isSubmitting = true
      const formData = this.$generateFormData(this.form, this.editIndex > -1,'scores')
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
    addWE() {
      this.form.scores.push({raw_score: this.form.scores.length, math:'', reading:'', writing:''});
    },
    spliceWE(index) {
      this.form.scores.splice(index, 1);
    },
    openScore(item){
      this.dialog2=true
      this.selectedItem =item
    },
    closeScore(){
      this.dialog2=false
    }
  }
}
</script>
