<template>
  <v-container fluid>
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: 'Test',disabled: false, href: '/employee/exam'},{text: `${pageInfo.pageName}`,disabled: true, href: '/employee/question/edit/{id}'}]"
    />
    <v-card>
      <validation-observer ref="observer" v-slot="{ invalid }">
        <v-form ref="form" @submit.prevent="submitData()">
          <v-card-title class="text-h5">
            {{ pageInfo.pageName | capitalize }}<br>
            {{ exam.title }} ( {{ exam.course?exam.course.name:'' }})
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-col cols="12" xs="12" sm="2">
                <v-btn color="success" x-small fab @click="showModal">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-col>
              <v-row dense v-for="(question,key) in form.questions" :key="key">
                <label class="font-weight-bold">{{ key+1 }}. Question</label>
                <v-col cols="12" xs="12" sm="12"></v-col>
                <v-col cols="12" xs="12" sm="4">
                  <validation-provider
                    v-slot="{ errors }"
                    name="question type"
                    vid="question type"
                    rules="required">
                    <v-autocomplete
                      v-model="form.questions[key].question_type"
                      :items="q_types"
                      :error-messages="errors"
                      item-text="name"
                      item-value="id"
                      label="Question Type"
                      dense
                      clearable
                      hide-details="auto"
                      outlined></v-autocomplete>
                  </validation-provider>
                </v-col>
                <v-col cols="12" xs="12" sm="12">
                  <label class="font-weight-bold">{{ key+1 }}. Question</label>
                  <validation-provider
                    v-slot="{ errors }"
                    name="question"
                    vid="question"
                    rules="required">
                    <client-only placeholder="loading...">
                      <ckeditor-nuxt v-model="form.questions[key].question" :error-messages="errors" :config="editorConfig"  />
                    </client-only>
                  </validation-provider>
                </v-col>
                <template v-if="form.questions[key].question_type === 1">
                  <v-col cols="12" xs="12" sm="6">
                    <label>Option: A</label>
                    <validation-provider
                      v-slot="{ errors }"
                      name="option_a"
                      vid="option_a"
                      rules="required">
                      <client-only placeholder="loading...">
                        <ckeditor-nuxt v-model="form.questions[key].options.option_a" :error-messages="errors" :config="editorConfig"  />
                      </client-only>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" xs="12" sm="6">
                    <label>Option: B</label>
                    <validation-provider
                      v-slot="{ errors }"
                      name="option_b"
                      vid="option_b"
                      rules="required">
                      <client-only placeholder="loading...">
                        <ckeditor-nuxt v-model="form.questions[key].options.option_b" :error-messages="errors" :config="editorConfig"  />
                      </client-only>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" xs="12" sm="6">
                    <label>Option: C</label>
                    <validation-provider
                      v-slot="{ errors }"
                      name="option_c"
                      vid="option_c"
                      rules="required">
                      <client-only placeholder="loading...">
                        <ckeditor-nuxt v-model="form.questions[key].options.option_c" :error-messages="errors" :config="editorConfig"  />
                      </client-only>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" xs="12" sm="6">
                    <label>Option: D</label>
                    <validation-provider
                      v-slot="{ errors }"
                      name="option_d"
                      vid="option_d"
                      rules="required">
                      <client-only placeholder="loading...">
                        <ckeditor-nuxt v-model="form.questions[key].options.option_d" :error-messages="errors" :config="editorConfig"  />
                      </client-only>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" xs="12" sm="4">
                    <validation-provider
                      v-slot="{ errors }"
                      name="answer"
                      vid="answer"
                      rules="required">
                      <v-autocomplete
                        v-model="form.questions[key].answer"
                        :items="answer_options"
                        :error-messages="errors"
                        item-text="name"
                        item-value="id"
                        label="Correct Answer"
                        dense
                        clearable
                        hide-details="auto"
                        outlined></v-autocomplete>
                    </validation-provider>
                  </v-col>
                </template>
                <v-col v-if="form.questions[key].question_type === 3" cols="12" xs="12" sm="6">
                  <validation-provider
                    v-slot="{ errors }"
                    name="answer"
                    vid="answer"
                    rules="required">
                    <v-text-field
                      v-model="form.questions[key].answer"
                      :error-messages="errors"
                      label="Correct Answer"
                      dense
                      clearable
                      hide-details="auto"
                      outlined></v-text-field>
                  </validation-provider>
                </v-col>
                <v-col cols="12" xs="12" sm="4">
                  <validation-provider
                    v-slot="{ errors }"
                    name="point"
                    vid="point"
                    rules="required|min_value:0">
                    <v-text-field
                      v-model="form.questions[key].mark"
                      :error-messages="errors"
                      label="Point"
                      dense
                      type="number"
                      step="any"
                      hide-details="auto"
                      outlined></v-text-field>
                  </validation-provider>
                </v-col>
                <v-divider></v-divider>
                <v-col cols="12" xs="12" sm="2">
                  <v-btn color="error" @click="spliceWE(form.questions[key], key)" x-small fab>
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="12" xs="12" sm="12"></v-col>
                <v-col cols="12" xs="12" sm="2">
                  <v-btn color="success" x-small fab @click="submitData(form.questions[key])">
                    <v-icon>mdi-content-save</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-form>
      </validation-observer>
    </v-card>
    <v-dialog v-model="dialog" persistent max-width="900">
      <v-card>
        <validation-observer ref="observer" v-slot="{ invalid }">
          <v-form ref="form" @submit.prevent="addSingle()">
            <v-card-title class="text-h5"> Add {{ pageInfo.pageName | capitalize }}</v-card-title>
            <v-card-text>
              <v-container>
                <label class="font-weight-bold">Question {{ form.questions.length + 1}}</label><br>
                <v-row dense>
                  <v-col cols="12" xs="12" sm="4">
                    <validation-provider
                      v-slot="{ errors }"
                      name="question type"
                      vid="question type"
                      rules="required">
                      <v-autocomplete
                        v-model="question.question_type"
                        :items="q_types"
                        :error-messages="errors"
                        item-text="name"
                        item-value="id"
                        label="Question Type"
                        dense
                        clearable
                        hide-details="auto"
                        outlined></v-autocomplete>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" xs="12" sm="12">
                    <validation-provider
                      v-slot="{ errors }"
                      name="question"
                      vid="question"
                      rules="required">
                      <client-only placeholder="loading...">
                        <ckeditor-nuxt v-model="question.question" :error-messages="errors" :config="editorConfig"  />
                      </client-only>
                    </validation-provider>
                  </v-col>
                  <template v-if="question.question_type === 1">
                    <v-col cols="12" xs="12" sm="6">
                      <label>Option: A</label>
                      <validation-provider
                        v-slot="{ errors }"
                        name="option_a"
                        vid="option_a"
                        rules="required">
                        <client-only placeholder="loading...">
                          <ckeditor-nuxt v-model="question.options.option_a" :error-messages="errors" :config="editorConfig"  />
                        </client-only>
                      </validation-provider>
                    </v-col>
                    <v-col cols="12" xs="12" sm="6">
                      <label>Option: B</label>
                      <validation-provider
                        v-slot="{ errors }"
                        name="option_b"
                        vid="option_b"
                        rules="required">
                        <client-only placeholder="loading...">
                          <ckeditor-nuxt v-model="question.options.option_b" :error-messages="errors" :config="editorConfig"  />
                        </client-only>
                      </validation-provider>
                    </v-col>
                    <v-col cols="12" xs="12" sm="6">
                      <label>Option: C</label>
                      <validation-provider
                        v-slot="{ errors }"
                        name="option_c"
                        vid="option_c"
                        rules="required">
                        <client-only placeholder="loading...">
                          <ckeditor-nuxt v-model="question.options.option_c" :error-messages="errors" :config="editorConfig"  />
                        </client-only>
                      </validation-provider>
                    </v-col>
                    <v-col cols="12" xs="12" sm="6">
                      <label>Option: D</label>
                      <validation-provider
                        v-slot="{ errors }"
                        name="option_d"
                        vid="option_d"
                        rules="required">
                        <client-only placeholder="loading...">
                          <ckeditor-nuxt v-model="question.options.option_d" :error-messages="errors" :config="editorConfig"  />
                        </client-only>
                      </validation-provider>
                    </v-col>

                    <v-col cols="12" xs="12" sm="4">
                      <validation-provider
                        v-slot="{ errors }"
                        name="answer"
                        vid="answer"
                        rules="required">
                        <v-autocomplete
                          v-model="question.answer"
                          :items="answer_options"
                          :error-messages="errors"
                          item-text="name"
                          item-value="id"
                          label="Correct Answer"
                          dense
                          clearable
                          hide-details="auto"
                          outlined></v-autocomplete>
                      </validation-provider>
                    </v-col>
                  </template>
                  <v-col v-if="question.question_type === 3" cols="12" xs="12" sm="4">
                    <validation-provider
                      v-slot="{ errors }"
                      name="answer"
                      vid="answer"
                      rules="required">
                      <v-text-field
                        v-model="question.answer"
                        :error-messages="errors"
                        label="Correct Answer"
                        dense
                        clearable
                        hide-details="auto"
                        outlined></v-text-field>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" xs="12" sm="4">
                    <validation-provider
                      v-slot="{ errors }"
                      name="point"
                      vid="point"
                      rules="required|min_value:0">
                      <v-text-field
                        v-model="question.mark"
                        :error-messages="errors"
                        label="Point"
                        dense
                        type="number"
                        step="any"
                        hide-details="auto"
                        outlined></v-text-field>
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
              <v-btn class="mr-2 error darken-1 white--text" depressed @click="closeModal">Close</v-btn>
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
const stateName = 'exams'
const storeName='employee/exams'
export default {
  name: 'ExamQuestion',
  head: {
    title: 'Test',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'Prepexcellence'
      }
    ],
  },
  meta:{
    action: 'edit',
    subject: 'Employee Test'
  },
  components: {BreadCrumbs, ExportPdf, ExportCsv, ExportExcel, ReportHead,
    'ckeditor-nuxt': () => { if (process.client) { return import('@blowstack/ckeditor-nuxt') } },},
  mixins: [commonMixin],
  data() {
    return {
      moment,
      pageInfo: {
        pageName: 'Test Question',
        apiUrl: '/employee/exam-question/',
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
      editorConfig: {
        simpleUpload: {
          uploadUrl: this.$config.apiUrl+'/ckeditor/upload/file',
          headers: {
            'Authorization': this.$auth.strategy.token.get()
          }
        },
        removePlugins: ['Title'],
      },
      form: {
        exam_id: this.$route.params.id,
        questions:[
          {exam_id: this.$route.params.id, question:'',question_type:1, mark: 1, answer:'', options: {option_a:'', option_b:'', option_c:'', option_d:''}},
        ],
      },
      answer_options:[
        {id:'A', name:'Option A'},
        {id:'B', name:'Option B'},
        {id:'C', name:'Option C'},
        {id:'D', name:'Option D'},
      ],
      q_types:[
        {id:1, name:'MCQ'},
        //{id:2, name:'CQ'},
        //{id:3, name:'Number'},
      ],
      question: {
        exam_id: this.$route.params.id,
        question: '',
        question_type: 1,
        mark: 1,
        answer: '',
        options: {
          option_a: '', option_b: '', option_c: '', option_d: ''
        }
      },
      exam:{},
    }
  },
  async mounted() {
    this.loader.isLoading=true;
    await this.init();
    this.loader.isLoading=false;
  },
  methods: {
    async init() {
      this.loader.isLoading = true

      await this.$axios.get(`/employee/bbb-employee/exams/${this.$route.params.id}`).then((response)=>{
        this.exam = response.data.data
        this.form.question_type = this.exam.question_type
      }).catch(()=>{
        this.exam={}
      })

      await this.$axios.get(`/employee/exam-question/by/exam/${this.$route.params.id}`).then((response)=>{
        this.form.questions = [];
        response.data.data.forEach(item=>{
          this.form.questions.push(
            {id:item.id, exam_id: item.exam_id, question_part:item.question_part, question:item.question,question_type:item.question_type, mark: item.mark, answer:item.answer, options: this.jsonDecode(item.options)},
          )
        })
      }).catch(()=>{
          this.form.questions=[];
      })
      this.loader.isLoading = false
    },
    jsonDecode(data){
      try {
        return JSON.parse(data);
      }catch (e){
        return []
      }
    },
    async submitData(item) {
      this.loader.isSubmitting = true
      const formData = this.$generateFormData(item, true,'options')
      let url = this.pageInfo.apiUrl

       url = url + item.id

      await this.$axios.post(url, formData).then((response) => {
        //this.addOrUpdateState(response, stateName, storeName)
        this.$toaster.success(`${this.pageInfo.pageName} 'updated' successfully!!`)
        //this.closeModal()
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
    spliceWE(item,index) {
      this.deleteItemBasic(item);
      this.form.questions.splice(index, 1);
    },
    async addSingle(){
      this.loader.isSubmitting = true
      const formData = this.$generateFormData(this.question, false,'options')
      let url = this.pageInfo.apiUrl + 'single/store'

      await this.$axios.post(url, formData).then((response) => {
        //this.addOrUpdateState(response, stateName, storeName)
        this.$toaster.success(`${this.pageInfo.pageName}  Added successfully!!`)
        //this.form.questions.push()
        let item = response.data.data
        this.form.questions.push(
          {id:item.id, exam_id: item.exam_id, question_part:item.question_part, question:item.question,question_type:item.question_type, mark: item.mark, answer:item.answer, options: this.jsonDecode(item.options)},
        )
        this.addClear()
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
    addClear(){
      this.question.answer=null
      this.$refs.observer.reset()
    },
    showModal(){
      this.dialog = true
    },
    closeModal(){
      this.dialog = false
    },
  }
}
</script>
