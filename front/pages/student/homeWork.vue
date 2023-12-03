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
                <v-card>
                  <v-card-title class="primary_header fs-4">
                    {{ pageInfo.pageName}}
                  </v-card-title>
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
                          ></v-text-field>
                        </div>
                        <v-spacer></v-spacer>
                      </v-toolbar>
                    </template>
                    <template v-slot:item.sno="{ index, item }">
                      {{ index+1 }}
                    </template>
                    <template v-slot:item.submission_last_date="{ index, item }">
                      {{ $moment(item.submission_last_date).format('DD-MM-YYYY') }}
                    </template>
                    <template v-slot:item.updated_at="{ index, item }">
                      {{ $moment(item.updated_at).format('DD-MM-YYYY') }}
                    </template>
                    <template v-slot:item.file="{ index, item }">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn x-small class="accent" v-bind="attrs"
                                 v-on="on" fab :href="item.file" target="_blank">
                            <v-icon color="white">mdi-eye</v-icon>
                          </v-btn>
                        </template>
                        <span>View</span>
                      </v-tooltip>
                    </template>
                    <template v-slot:item.actions="{index, item }">
                      <v-tooltip bottom v-if="!item.studentHomeWorks.length">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn x-small class="accent" v-bind="attrs"
                                 v-on="on" fab @click="createOrUpdate(item)">
                            <v-icon color="white">mdi-upload</v-icon>
                          </v-btn>
                        </template>
                        <span>Upload</span>
                      </v-tooltip>
                      <v-tooltip bottom v-else>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn x-small class="accent" v-bind="attrs"
                                 v-on="on" fab :href="item.studentHomeWorks[0].file" target="_blank">
                            <v-icon color="white">mdi-eye</v-icon>
                          </v-btn>
                        </template>
                        <span>View</span>
                      </v-tooltip>
                    </template>
                  </v-data-table>
                  <v-dialog v-model="dialog" persistent max-width="500">
                    <v-card>
                      <validation-observer ref="observer" v-slot="{ invalid }">
                        <v-form ref="form" @submit.prevent="submitHW()">
                          <v-card-title class="text-h5"> {{ 'Upload Home Work' }}</v-card-title>
                          <v-card-text>
                            <v-container>
                              <v-row dense>
                                <v-col cols="12" xs="12" sm="12">
                                  <validation-provider
                                    v-slot="{ errors }"
                                    name="file"
                                    vid="file"
                                    :rules="'required'"
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
const stateName = 'home_works'
const storeName='student/home_work'
export default {
  name: 'studentHomeWork',
  components: {Sidebar},
  mixins: [commonMixin],
  data() {
    return {
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
      form:{
        home_work_id:null,
        file:null,
      },
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
        {
          text: 'Submission Last Date',
          align: 'start',
          value: 'submission_last_date'
        },
        {
          text: 'Total Mark',
          align: 'center',
          value: 'total_mark'
        },
        {
          text: 'Obtain Mark',
          align: 'center',
          value: 'mark'
        },
        {
          text: 'Last Update',
          align: 'start',
          value: 'updated_at'
        },
        {
          text: 'File',
          value: 'file'
        },
        {
          text: 'Action',
          value: 'actions'
        },
      ],
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
    if (!this.home_works.length)  await this.init();
   this.loader.isLoading=false;
  },
  methods: {
    async init() {
      this.loader.isLoading = true
      let url = this.pageInfo.apiUrl+`?per_page=${this.options.itemsPerPage}&page=${this.options.page}`
      if (this.search.length >= 3) {
        url += `&search=${this.search}`
      }
      const payload1 = {apiUrl: url, stateName}
      await this.$store.dispatch(storeName+'/getItems', payload1)
      this.loader.isLoading = false
    },
    createOrUpdate(item) {
        this.selectedItem = item
        this.dialog = true
    },
    closeModal() {
      this.dialog = false
      this.editIndex = -1
      this.$refs.form.reset()
      this.$refs.observer.reset()
    },
    async submitHW(){
      this.loader.isSubmitting = true
      const formData = this.$generateFormData(this.form, this.editIndex > -1)
      await this.$axios.post(`/student/home/work/submit${this.selectedItem.id}`,formData).then((response)=>{
        this.$toaster.success(response.data.message)
        this.closeModal()

        let url = this.pageInfo.apiUrl+`?per_page=${this.options.itemsPerPage}&page=${this.options.page}`
        if (this.search.length > 3) {
          url += `&search=${this.search}`
        }
        const payload1 = {apiUrl: url, stateName}
        this.$store.dispatch(storeName+'/getItems', payload1)

      }).catch((error)=>{
        this.$toaster.success(error.response.data.message)
      })
      this.loader.isSubmitting = false
    }
  }
}
</script>
