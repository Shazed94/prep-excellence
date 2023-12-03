<template>
  <v-container fluid>
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: 'Notification',disabled: true, href: '/admin/notification'},{text: `${pageInfo.pageName}`,disabled: true, href: '/admin/notification/emailNotification'}]"
    />
    <v-card>
      <v-data-table
        dense
        v-model="selected"
        item-key="id"
        show-select
        :headers="headers"
        :items="email_notifications"
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
            <v-dialog v-model="dialog" persistent max-width="700">
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
                              name="role"
                              vid="role"
                              rules="">
                              <v-autocomplete
                                v-model="form.role_ids"
                                :items="roles"
                                :error-messages="errors"
                                item-text="name"
                                item-value="id"
                                label="Role"
                                multiple
                                dense
                                clearable
                                hide-details="auto"
                                outlined></v-autocomplete>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" xs="12" sm="6">
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
                                small-chips
                              />
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" xs="12" sm="12">
                            <validation-provider
                              v-slot="{ errors }"
                              name="message"
                              vid="message"
                              :rules="'required'"
                            >
                              <v-textarea
                                v-model="form.message"
                                label="Message"
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
                          <v-col cols="12" xs="12" sm="6" v-if="form.notifications.includes('1')">
                            <validation-provider
                              v-slot="{ errors }"
                              name="image/video"
                              vid="image/video"
                              rules=""
                            >
                              <v-file-input
                                v-model="form.file"
                                label="Image or Video"
                                :error-messages="errors"
                                outlined
                                dense
                                hide-details="auto"
                                show-size
                                small-chips
                              />
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" xs="12" sm="12"></v-col>
                          <v-col cols="12" xs="12" sm="6">
                            <label>Select Notification Type</label>
                            <validation-provider
                              v-slot="{ errors }"
                              name="notification type"
                              vid="notification type"
                              rules="required"
                            >
                              <v-row dense>
                                <v-checkbox
                                  v-model="form.notifications"
                                  label="Email"
                                  value="1"
                                ></v-checkbox>
                                <v-checkbox
                                  v-model="form.notifications"
                                  label="SMS"
                                  value="2"
                                ></v-checkbox>
                                <v-checkbox
                                  v-model="form.notifications"
                                  label="Push"
                                  value="3"
                                ></v-checkbox>
                              </v-row>
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
          {{ moment(item.created_at).format('DD-MM-Y')}}
        </template>
        <template v-slot:item.file="{ index, item }">
          <a v-if="item.file" :href="item.file" target="_blank">View</a>
        </template>
        <template v-slot:item.status="{ index, item }">
          <v-chip  v-if="item.try === 0" color="yellow" filter>Pending</v-chip>
          <v-chip  v-else-if="item.is_sent === 1" color="green" filter>Success</v-chip>
          <v-chip  v-else color="red" filter>Fail</v-chip>
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
import moment from "moment-timezone";
import {mapGetters} from "vuex";
const permission = 'Email Notification'
const stateName = 'email_notifications'
const storeName='admin/notification/email'

export default {
  name: 'EmailNotification',
  head: {
    title: 'Admin Complain',
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
  components: {BreadCrumbs, ExportPdf, ExportCsv, ExportExcel},
  mixins: [commonMixin],
  data() {
    return {
      pageInfo: {
        pageName: 'Email Notifications',
        apiUrl: '/email/',
        permission
      },
      state: {
        name: stateName,
        store_name: storeName,
      },
      selected: [],
      moment,
      options: {},
      dialog: false,
      editIndex: -1,
      editMode:false,
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      image:null,
      form: {
        role_ids: [],
        notifications:[],
        subject:'',
        message: '',
        file: null,
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
          text: 'Date',
          align: 'start',
          value: 'created_at'
        },
        {
          text: 'Subject',
          align: 'start',
          value: 'subject'
        },
        {
          text: 'Name',
          align: 'start',
          value: 'name'
        },
        {
          text: 'Email',
          align: 'start',
          value: 'email'
        },
        {
          text: 'File',
          align: 'start',
          value: 'file'
        },
        {
          text: 'Message',
          align: 'start',
          value: 'message'
        },
        {
          text: 'Status',
          value: 'status'
        },
      ],
      footerProps: {
        itemsPerPageOptions: [20, 50, 100, 500]
      }
    }
  },
  computed: {
    ...mapGetters('admin/notification/email',['email_notifications','totalItems']),
    ...mapGetters('rolePermission/basic',['roles']),
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
    const payload = {apiUrl: '/role/', stateName:'roles'}
    if (this.roles.length <1) await this.$store.dispatch('rolePermission/basic/getItems', payload)
    this.loader.isLoading = false
  },
  methods: {
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
      /*if (item) {
        this.editIndex = this.course_categories.indexOf(item)
        this.editMode=true;
      }
      else {
        this.editIndex = -1
        this.editMode=false;
      }

      if (this.editMode) {
        this.selectedItem = item
        this.image=item.image
        this.form = {
          name: item.name,
          image:null,
          description: item.description,
        }
      } else {
        this.selectedItem = {}
        this.image=null
        this.form = {name: '', image:null, description:''}
      }*/
      this.dialog = true
    },
    async submitData() {
      this.loader.isSubmitting = true
      const formData = this.$generateFormData(this.form, this.editIndex > -1)
      let url = this.pageInfo.apiUrl

      if (this.editMode) url = url + this.selectedItem.id

      await this.$axios.post(url, formData).then((response) => {
        //this.addOrUpdateState(response, stateName, storeName)
        this.$toaster.success(`${this.pageInfo.pageName} ${this.editMode ? 'updated' : 'created'} successfully!!`)
        this.closeModal()
        this.init();
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
