<template>
  <div class="user-dashboard-area">
    <div class="btcontainer">
      <div class="up_wrap">
        <div class="btrow">
          <sidebar/>
          <!-- main content -->
          <div class="btcol-md-6 btcol-lg-9">
            <div class="up_content_wrap">
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
                    :items="complains"
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
                        <v-dialog v-model="dialog" persistent max-width="500">
                          <template v-slot:activator="{ on, attrs }">
                            <!--                color="primary"-->
                            <v-btn
                                   style="background: #01579B"
                                   class="mx-2 white--text"
                                   icon
                                   small
                                   v-bind="attrs"
                                   v-on="on"
                                   @click="createOrUpdate()"
                            >
                              <v-icon color="white">mdi-plus</v-icon>
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
                                          name="subject"
                                          vid="subject"
                                          :rules="'required'"
                                        >
                                          <v-text-field
                                            v-model="form.subject"
                                            label="Subject"
                                            :error-messages="errors"
                                            outlined
                                            dense
                                            hide-details="auto"
                                            show-size
                                          />
                                        </validation-provider>
                                      </v-col>
                                      <v-col cols="12" xs="12" sm="12">
                                        <validation-provider
                                          v-slot="{ errors }"
                                          name="complain"
                                          vid="complain"
                                          :rules="'required'"
                                        >
                                          <v-textarea
                                            v-model="form.message"
                                            label="Your Complain"
                                            :error-messages="errors"
                                            outlined
                                            dense
                                            hide-details="auto"
                                            show-size
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
                    <template v-slot:item.created_at="{ index, item }">
                      {{ moment(item.created_at).format('MM-DD-Y')}}
                    </template>
                    <template v-slot:item.status="{ index, item }">
                      <v-chip  v-if="item.status === 0" color="yellow" filter>Pending</v-chip>
                      <v-chip  v-else-if="item.status === 1" color="green" filter>Solved</v-chip>
                      <v-chip  v-else color="red" filter>canceled</v-chip>
                    </template>
                    <template v-slot:item.actions="{index, item }">
                      <template v-if="item.status === 0">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn x-small class="mr-1 accent" v-bind="attrs"
                                   v-on="on" fab @click="createOrUpdate(item)">
                              <v-icon color="white">mdi-pencil</v-icon>
                            </v-btn>
                          </template>
                          <span>Update</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn color="error" x-small v-bind="attrs"
                                   v-on="on" fab @click="deleteItem(item, index, state.store_name)">
                              <v-icon color="white">mdi-delete</v-icon>
                            </v-btn>
                          </template>
                          <span>Remove</span>
                        </v-tooltip>
                      </template>
                    </template>
                  </v-data-table>
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
import ExportExcel from '@/components/common/ExportExcel'
import ExportCsv from '@/components/common/ExportCsv'
import ExportPdf from '@/components/common/ExportPdf'
import BreadCrumbs from "~/components/common/BreadCrumbs";
import Sidebar from "@/components/user/Sidebar";
import {common as commonMixin} from "@/mixins/common";
import {mapGetters} from "vuex";
import moment from "moment";
const permission = ''
const stateName = 'complains'
const storeName='common/complain'

export default {
  name: 'Complain',
  components: {BreadCrumbs, ExportPdf, ExportCsv, ExportExcel, Sidebar},
  mixins: [commonMixin],
  data() {
    return {
      pageInfo: {
        pageName: 'Complains',
        apiUrl: '/user/complain/',
        permission: ''
      },
      state: {
        name: stateName,
        store_name: storeName,
      },
      selected: [],
      options: {},
      dialog: false,
      editIndex: -1,
      editMode:false,
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      image:null,
      moment,
      form: {
        subject: '',
        message: '',
      },
      search: '',
      timeout: null,
      headers: [
        {
          text: 'Date',
          align: 'start',
          value: 'created_at'
        },
        {
          text: 'Subject',
          align: 'start',
          value: 'subject',
        },
        {
          text: 'Complain',
          align: 'start',
          value: 'message'
        },
        {
          text: 'Review',
          align: 'start',
          value: 'review'
        },
        {
          text: 'Status',
          value: 'status',
          sortable:false
        },
        {
          text: 'Actions',
          value: 'actions',
          sortable:false
        },
      ],
      footerProps: {
        itemsPerPageOptions: [20, 50, 100, 500]
      }
    }
  },
  computed: {
    ...mapGetters('common/complain',['complains','totalItems']),
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
    this.loader.isLoading = true
    await this.init();
   this.loader.isLoading = false
  },
  methods: {
    async init() {
      this.loader.isLoading = true
      let url = `${this.pageInfo.apiUrl}?per_page=${this.options.itemsPerPage}&page=${this.options.page}`
      if (this.search.length >= 3) {
        url += `&search=${this.search}`
      }
      if (this.options.sortBy[0]){
        url += '&sort_by='+this.options.sortBy[0]+'&sort_order='
        url += this.options.sortDesc[0]?'DESC':'ASC'
      }
      const payload = {apiUrl: url, stateName}
      await this.$store.dispatch(storeName+'/getItems', payload)
      this.loader.isLoading = false
    },
    createOrUpdate(item = null) {
      if (item) {
        this.editIndex = this.complains.indexOf(item)
        this.editMode=true;
      }
      else {
        this.editIndex = -1
        this.editMode=false;
      }

      if (this.editMode) {
        this.selectedItem = item
        this.form = {
          subject: item.subject,
          message: item.message,
        }
      } else {
        this.selectedItem = {}
        this.form = {subject: '',message:''}
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
