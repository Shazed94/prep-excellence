<template>
  <v-container fluid>
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: 'Test',disabled: false, href: '/employee/exam'},{text: `${pageInfo.pageName}`,disabled: true, href: '/employee/question/sat/{id}'}]"
    />
    <v-card>
      <validation-observer ref="observer" v-slot="{ invalid }">
        <v-form ref="form" @submit.prevent="submitData()">
          <v-card-title class="text-h5"> {{ editIndex > -1 ? 'Update ' : 'Create' }} {{ pageInfo.pageName | capitalize }}</v-card-title>
          <v-card-text>
            <v-container>
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
<!--                  <label>Answer</label>-->
                  <validation-provider
                    v-slot="{ errors }"
                    name="answer"
                    vid="answer"
                    rules="required">
<!--                    <client-only placeholder="loading...">
                      <ckeditor-nuxt v-model="form.questions[key].answer" :error-messages="errors" :config="editorConfig"  />
                    </client-only>-->
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
                  <v-btn color="error" @click="spliceWE(key)" x-small fab v-if="form.questions.length > 1">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-col>
                <v-col cols="12" xs="12" sm="12"></v-col>
                <v-col cols="12" xs="12" sm="2">
                  <v-btn color="success" @click="addWE()" x-small fab v-if="form.questions.length === (key+1)">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
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
          </v-card-actions>
        </v-form>
      </validation-observer>
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
    action: 'create',
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
        question_type: 1,
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
       // {id:2, name:'CQ'},
        //{id:3, name:'Number'},
      ],
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
      this.loader.isLoading = false
    },
    async submitData() {
      this.loader.isSubmitting = true
      const formData = this.$generateFormData(this.form, this.editIndex > -1,'questions')
      let url = this.pageInfo.apiUrl

      if (this.editMode) url = url + this.selectedItem.id

      await this.$axios.post(url, formData).then((response) => {
        //this.addOrUpdateState(response, stateName, storeName)
        this.$toaster.success(`${this.pageInfo.pageName} ${this.editMode ? 'updated' : 'created'} successfully!!`)
        this.clear()
        this.$router.push('/employee/exam');
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
    clear() {
      this.editIndex = -1
      /*this.form.questions=[
        {exam_id: this.$route.params.id, question:'',question_type:1, mark: 1, answer:'', options: {option_a:'', option_b:'', option_c:'', option_d:''}},
      ]*/
      this.$refs.form.reset()
      this.$refs.observer.reset()
    },
    addWE() {
      this.form.questions.push({exam_id: this.$route.params.id, question:'',question_type:1, mark: 1, answer:'', options: {option_a:'', option_b:'', option_c:'', option_d:''}},);
    },
    spliceWE(index) {
      this.form.questions.splice(index, 1);
    },
  }
}
</script>
