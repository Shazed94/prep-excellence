<template>
  <v-container fluid>
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: 'Job',disabled: true, href: '/admin/job'}]"
    />
    <v-card>
      <v-data-table
        dense
        v-model="selected"
        item-key="id"
        show-select
        :headers="headers"
        :items="jobs"
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
            <v-toolbar-title>
              <div>
                <export-excel :url="`${pageInfo.apiUrl}export?format=excel&ids=${selectedIds ? selectedIds : ''}`"
                              :file_name="pageInfo.pageName"/>
                <export-csv :url="`${pageInfo.apiUrl}export?format=csv&ids=${selectedIds ? selectedIds : ''}`"
                            :file_name="pageInfo.pageName"/>
                <export-pdf :url="`${pageInfo.apiUrl}export?format=pdf&ids=${selectedIds ? selectedIds : ''}`"
                            :file_name="pageInfo.pageName"/>
              </div>
            </v-toolbar-title>

            <v-divider
              class="mx-4"
              inset
              vertical
            ></v-divider>

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
<!--                          <v-col cols="12" md="4">
                            <form-image-preview
                              :existingImages="image"
                              :image-props="form.image"
                              @removeImage="removeImage($emit, 'image')"
                            />
                            <validation-provider
                              v-slot="{ errors }"
                              name="image"
                              vid="image"
                              rules=""
                            >
                              <v-file-input
                                v-model="form.image"
                                label="Image"
                                filled
                                prepend-icon="mdi-camera"
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
                          </v-col>-->
                          <v-col cols="12" md="12">
                          </v-col>
                          <v-col cols="12" md="6">
                            <validation-provider
                              v-slot="{ errors }"
                              name="Title"
                              vid="title"
                              rules="required"
                            >
                              <v-text-field
                                v-model="form.title"
                                clear-icon="mdi-close-circle"
                                label="Title"
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" md="6">
                            <validation-provider
                              v-slot="{ errors }"
                              name="vacancy"
                              vid="vacancy"
                              rules="required|numeric"
                            >
                              <v-text-field
                                v-model="form.vacancy"
                                clear-icon="mdi-close-circle"
                                label="Vacancy"
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" md="6">
                            <validation-provider
                              v-slot="{ errors }"
                              name="employment status"
                              vid="employment status"
                              rules="required"
                            >
                              <v-text-field
                                v-model="form.employment_status"
                                clear-icon="mdi-close-circle"
                                label="Employment Status"
                                :error-messages="errors"
                                placeholder="part time/full time"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" md="6">
                            <validation-provider
                              v-slot="{ errors }"
                              name="salary"
                              vid="salary"
                              rules="required"
                            >
                              <v-text-field
                                v-model="form.salary"
                                clear-icon="mdi-close-circle"
                                label="Salary"
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" md="6">
                            <validation-provider
                              v-slot="{ errors }"
                              name="application deadline"
                              vid="application deadline"
                              rules="required"
                            >
                              <v-text-field
                                v-model="form.last_date"
                                clear-icon="mdi-close-circle"
                                label="Application Deadline"
                                :error-messages="errors"
                                type="date"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" md="6">
                            <validation-provider
                              v-slot="{ errors }"
                              name="gender"
                              vid="gender"
                              rules="required"
                            >
                              <v-text-field
                                v-model="form.gender"
                                clear-icon="mdi-close-circle"
                                label="Gender"
                                :error-messages="errors"
                                placeholder="Both males and females are allowed to apply"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" md="12">
                            <label>Job Context</label>
                            <validation-provider
                              v-slot="{ errors }"
                              name="job context"
                              vid="job context"
                              rules="required"
                            >
                              <VueEditor
                                v-model="form.job_context"
                                clear-icon="mdi-close-circle"
                                label="Job Context"
                                :error-messages="errors"
                                :editorToolbar="customToolbar"
                                dense
                                outlined
                                counter
                                rows="3"
                                auto-grow
                                no-resize/>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" md="12">
                            <label>Job Responsibilities</label>
                            <validation-provider
                              v-slot="{ errors }"
                              name="job responsibilities"
                              vid="job responsibilities"
                              rules="required"
                            >
                              <VueEditor
                                v-model="form.job_responsibilities"
                                 clear-icon="mdi-close-circle"
                                 label="Job Responsibilities"
                                 :error-messages="errors"
                                :editorToolbar="customToolbar"
                                 dense
                                 outlined
                                 counter
                                 rows="3"
                                 auto-grow
                                 no-resize/>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" md="12">
                            <label>Educational Requirements</label>
                            <validation-provider
                              v-slot="{ errors }"
                              name="educational requirements"
                              vid="educational requirements"
                              rules="required"
                            >
                              <VueEditor
                                v-model="form.educational_requirements"
                                 clear-icon="mdi-close-circle"
                                 label="Educational Requirements"
                                 :error-messages="errors"
                                :editorToolbar="customToolbar"
                                 dense
                                 outlined
                                 counter
                                 rows="3"
                                 auto-grow
                                 no-resize/>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" md="12">
                            <label>Experience Requirements</label>
                            <validation-provider
                              v-slot="{ errors }"
                              name="experience requirements"
                              vid="experience requirements"
                              rules="required"
                            >
                              <VueEditor
                                v-model="form.experience_requirements"
                                 clear-icon="mdi-close-circle"
                                 label="Experience Requirements"
                                 :error-messages="errors"
                                :editorToolbar="customToolbar"
                                 dense
                                 outlined
                                 counter
                                 rows="3"
                                 auto-grow
                                 no-resize/>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" md="12">
                            <label>Additional Requirements</label>
                            <validation-provider
                              v-slot="{ errors }"
                              name="additional requirements"
                              vid="additional requirements"
                              rules=""
                            >
                              <VueEditor
                                v-model="form.additional_requirements"
                                 clear-icon="mdi-close-circle"
                                 label="Additional Requirements"
                                 :error-messages="errors"
                                :editorToolbar="customToolbar"
                                 dense
                                 outlined
                                 counter
                                 rows="3"
                                 auto-grow
                                 no-resize/>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" md="12">
                            <label>Compensation & Other Benefits</label>
                            <validation-provider
                              v-slot="{ errors }"
                              name="compensation benefits"
                              vid="compensation benefits"
                              rules=""
                            >
                              <VueEditor
                                v-model="form.compensation_benefits"
                                 clear-icon="mdi-close-circle"
                                 label="Compensation & Other Benefits"
                                 :error-messages="errors"
                                :editorToolbar="customToolbar"
                                 dense
                                 outlined
                                 counter
                                 rows="3"
                                 auto-grow
                                 no-resize/>
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
        <template v-slot:item.job_context="{ index, item }">
          <div v-html="item.job_context"></div>
        </template>
        <template v-slot:item.status="{ index, item }">
          <v-switch v-if="$can('status change',pageInfo.permission)"
                    class="pa-0 ma-0"
                    hide-details
                    :value="true"
                    :input-value="item.is_active"
                    @change="toggleStatusChange(index, $event !== null, $event, item.id, state.name, state.store_name,'is_active')">
          </v-switch>
        </template>
        <template v-slot:item.actions="{index, item }">
          <v-btn x-small class="accent mb-1" fab @click="createOrUpdate(item)" v-if="$can('edit',pageInfo.permission)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn color="error" x-small fab @click="deleteItem(item, index, state.store_name)" v-if="$can('remove',pageInfo.permission)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import ExportExcel from '@/components/common/ExportExcel'
import ExportCsv from '@/components/common/ExportCsv'
import ExportPdf from '@/components/common/ExportPdf'
import BreadCrumbs from "../../../components/common/BreadCrumbs";
import FormImagePreview from '@/components/form/formImagePreview';
import {common as commonMixin} from "@/mixins/common";
import {mapGetters} from "vuex";
const permission = 'Job'
const stateName = 'jobs'
const storeName='admin/job/job'
export default {
  name: 'job',
  head: {
    title: 'Job',
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
  components: {BreadCrumbs, ExportPdf, ExportCsv, ExportExcel, FormImagePreview,},
  mixins: [commonMixin],
  data() {
    return {
      pageInfo: {
        pageName: 'Job',
        apiUrl: '/job/',
        permission
      },
      state: {
        name: stateName,
        store_name: storeName,
      },
      customToolbar: [
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "code-block"]
      ],
      selected: [],
      options: {},
      dialog: false,
      editIndex: -1,
      editMode:false,
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      image: null,
      form: {
        image:null,
        title:'',
        vacancy:'',
        job_context:'',
        job_responsibilities:'',
        employment_status:'',
        educational_requirements:'',
        experience_requirements:'',
        additional_requirements:'',
        job_location:'',
        salary:'',
        compensation_benefits:'',
        gender:'',
        last_date:'',
      },
      search: '',
      timeout: null,
      headers: [
        {
          text: 'SL',
          align: 'start',
          value: 'id'
        },
        {
          text: 'Title',
          align: 'start',
          value: 'title'
        },
        {
          text: 'Vacancy',
          align: 'start',
          value: 'vacancy'
        },
        {
          text: 'Job Context',
          align: 'start',
          value: 'job_context'
        },
        {
          text: 'Salary',
          align: 'start',
          value: 'salary'
        },
        {
          text: 'Last Date',
          align: 'start',
          value: 'last_date'
        },
        {
          text: 'Status',
          align: 'start',
          value: 'status'
        },
        {text: 'Actions', value: 'actions', sortable: false}
      ],
      footerProps: {
        itemsPerPageOptions: [20, 50, 100, 500]
      },
    }
  },
  computed: {
    ...mapGetters('admin/job/job',['jobs','totalItems']),
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
  mounted() {
    this.init();
  },
  methods: {
    removeImage($emit, formElementName) {
      if (!formElementName) return
      if ($emit && (this.form[formElementName] && this.form[formElementName].length > 1))
        $emit ? this.form[formElementName].splice($emit, 1) : this.form[formElementName] = null
      else this.form[formElementName] = null
    },
    async init() {
      this.loader.isLoading = true
      let url = `${this.pageInfo.apiUrl}?per_page=${this.options.itemsPerPage}&page=${this.options.page}`
      if (this.search.length > 3) {
        url += `&search=${this.search}`
      }
      const payload = {apiUrl: url, stateName}
      await this.$store.dispatch(storeName+'/getItems', payload)
      this.loader.isLoading = false
    },
    createOrUpdate(item = null) {
      if (item) {
        this.editIndex = this.jobs.indexOf(item)
        this.editMode=true;
      }
      else {
        this.editIndex = -1
        this.editMode=false;
      }

      if (this.editMode) {
        this.selectedItem = item
        Object.keys(this.form).map((field) => {
          this.form[field]=this.selectedItem[field]??'';
        });
        this.image=this.selectedItem.image;
      } else {
        this.selectedItem = {}
        Object.keys(this.form).map((field) => {
          this.form[field]=null;
        });
        this.image=null
      }
      this.form.image=null;
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
