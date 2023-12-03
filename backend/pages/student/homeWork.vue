<template>
  <v-container fluid>
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: 'Course',disabled: false, href: '/student/course'},{text: `${pageInfo.pageName}`,disabled: true, href: '/student/homeWork'}]"
    />
    <v-card>
      <v-data-table
        dense
        v-model="selected"
        item-key="id"
        show-select
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
              <v-card>
                <validation-observer ref="observer" v-slot="{ invalid }">
                  <v-form ref="form" @submit.prevent="submitData()">
                    <v-card-title class="text-h5"> {{ 'Upload' }} {{ pageInfo.pageName | capitalize }}</v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row dense>
                          <v-col cols="12" xs="12" sm="6">
                            <validation-provider
                              v-slot="{ errors }"
                              name="file"
                              vid="file"
                              :rules="'required'"
                            >
                              <v-file-input
                                v-model="form.file"
                                label="Your answer script"
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
        <template v-slot:item.actions="{index, item }">
          <v-tooltip bottom v-if="item.studentHomeWorks && item.studentHomeWorks.length">
            <template v-slot:activator="{ on, attrs }">
              <v-btn x-small class="accent" v-bind="attrs"
                     v-on="on" fab :href="item.studentHomeWorks[0].file" target="_blank">
                <v-icon>mdi-eye</v-icon>
              </v-btn>
            </template>
            <span>View</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn x-small class="accent" v-bind="attrs" @click="createOrUpdate(item)"
                     v-on="on" color="green" fab >
                <v-icon>mdi-upload</v-icon>
              </v-btn>
            </template>
            <span>Upload</span>
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
const stateName = 'home_works'
const storeName='student/home_work'
export default {
  name: 'HomeWork',
  components: {BreadCrumbs, ExportPdf, ExportCsv, ExportExcel, ReportHead},
  mixins: [commonMixin],
  data() {
    return {
      moment,
      pageInfo: {
        pageName: 'Home Works',
        apiUrl: '/student/home/works/',
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
          value: 'sno'
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
          text: 'Subject',
          align: 'start',
          value: 'courseType.name'
        },
        {
          text: 'Categories',
          align: 'start',
          value: 'category'
        },*/
        /*{
          text: 'Total Student',
          align: 'start',
          value: ''
        },*/
        /*{
          text: 'Start Date',
          align: 'start',
          value: 'course.start_date'
        },
        {
          text: 'End Date',
          align: 'start',
          value: 'course.end_date'
        },*/
        {
          text: 'Total Mark',
          align: 'start',
          value: 'total_mark'
        },
        {
          text: 'Submission Last Date',
          align: 'start',
          value: 'submission_last_date'
        },
        {
          text: 'Home Work Question',
          align: 'center',
          value: 'file'
        },
        {
          text: 'Action',
          value: 'actions'
        },
      ],
      form: {
        file: null,
      },
      footerProps: {
        itemsPerPageOptions: [20, 50, 100, 500]
      },
    }
  },
  computed: {
    ...mapGetters('student/home_work',['home_works','totalItems']),
    selectedIds() {
      return this.selected.map((a) => a.id)
    },
  },
  watch: {
    /*options: {
      handler() {
        this.init()
      },
      deep: true
    },*/
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
    createOrUpdate(item) {
      this.selectedItem =item
      this.dialog = true
    },
    async submitData() {
      this.loader.isSubmitting = true
      const formData = this.$generateFormData(this.form, false)
      let url = `/student/home/work/submit${this.selectedItem.id}`

      await this.$axios.post(url, formData).then((response) => {
        //this.addOrUpdateState(response, stateName, storeName)
        this.$toaster.success(`${this.pageInfo.pageName} ${this.editMode ? 'updated' : 'created'} successfully!!`)
        this.init();
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
  }
}
</script>
