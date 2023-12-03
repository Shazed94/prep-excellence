<template>
  <v-container fluid>
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: 'Student',disabled: false, href: '/admin/student/student'},{text: `${pageInfo.pageName}`,disabled: true, href: '/admin/student/studentCourse'}]"
    />
    <v-card>
      <v-data-table
        dense
        v-model="selected"
        item-key="id"
        show-select
        :headers="headers"
        :items="student_courses"
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
                          <v-col cols="12" xs="12" sm="4">
                            <validation-provider v-slot="{ errors }" name="gender" vid="gender_id" rules="required">
                              <v-autocomplete
                                v-model="form.student_id"
                                :items="students"
                                :error-messages="errors"
                                item-text="student_id"
                                item-value="id"
                                label="Select Student"
                                dense
                                clearable
                                hide-details="auto"
                                outlined>
                                <template v-slot:selection="data">
                                  <v-chip
                                    v-bind="data.attrs"
                                    :input-value="data.selected"
                                  >
                                    <v-avatar left v-if="data.item.userable">
                                      <v-img :src="data.item.userable.image"></v-img>
                                    </v-avatar>
                                    {{ data.item.userable.name }}
                                  </v-chip>
                                </template>
                                <template v-slot:item="data">
                                  <template v-if="typeof data.item !== 'object'">
                                    <v-list-item-content v-text="data.item"></v-list-item-content>
                                  </template>
                                  <template v-else>
                                    <v-list-item-avatar v-if="data.item.userable">
                                      <img :src="data.item.userable.image" alt="">
                                    </v-list-item-avatar>
                                    <v-list-item-content v-if="data.item.userable">
                                      <v-list-item-title v-html="data.item.userable.name"></v-list-item-title>
                                      <v-list-item-subtitle v-html="data.item.student_id"></v-list-item-subtitle>
                                    </v-list-item-content>
                                  </template>
                                </template>
                              </v-autocomplete>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4">
                            <validation-provider v-slot="{ errors }" name="blood group" vid="blood_group_id" rules="required">
                              <v-autocomplete
                                v-model="form.course_id"
                                :items="courses"
                                :error-messages="errors"
                                item-text="name"
                                item-value="id"
                                label="Select Course"
                                dense
                                clearable
                                hide-details="auto"
                                outlined>
                              </v-autocomplete>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="amount"
                              vid="amount"
                              rules="required|min:1|max:30"
                            >
                              <v-text-field
                                v-model="form.amount"
                                :error-messages="errors"
                                label="Amount"
                                type="number"
                                 step="any"
                                required
                                dense
                                hide-details="auto"
                                outlined
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" xs="12" sm="6">
                            <validation-provider
                              v-slot="{ errors }"
                              name="Payment Type"
                              vid="payment_type"
                              rules="required|max:191"
                            >
                              <v-text-field
                                v-model="form.payment_type"
                                :error-messages="errors"
                                label="Payment Type"
                                required
                                dense
                                hide-details="auto"
                                outlined
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" xs="12" sm="6">
                            <validation-provider
                              v-slot="{ errors }"
                              name="payment details"
                              vid="payment_details"
                              rules="required|max:191"
                            >
                              <v-text-field
                                v-model="form.payment_details"
                                :error-messages="errors"
                                label="Payment Details"
                                required
                                dense
                                hide-details="auto"
                                outlined
                              ></v-text-field>
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
        <template v-slot:item.userable.image="{ index, item }">
          <img :src="item.userable.image" alt="item.userable.name" width="50" height="50"/>
        </template>
        <template v-slot:item.is_approved="{ index, item }">
          <v-switch v-if="$can('edit',pageInfo.permission)"
                    class="pa-0 ma-0"
                    hide-details
                    :value="true"
                    :input-value="item.is_approved"
                    @change="approveOrDecline(index, $event !== null, $event, item.id, state.name, state.store_name, 'is_approved')">
          </v-switch>
        </template>
        <template v-slot:item.status="{ index, item }">
          <v-switch v-if="$can('status change',pageInfo.permission)"
                    class="pa-0 ma-0"
                    hide-details
                    :value="true"
                    :input-value="item.is_active"
                    @change="toggleStatusChange(index, $event !== null, $event, item.id, state.name, state.store_name)">
          </v-switch>
        </template>

        <template v-slot:item.actions="{index, item }">
          <v-tooltip bottom v-if="item.transaction_no">
            <template v-slot:activator="{ on, attrs }">
              <v-btn x-small class="mr-1 mb-1 mt-1 accent" v-bind="attrs"
                     v-on="on" fab @click="viewInvoice(item)">
                <v-icon>mdi-printer</v-icon>
              </v-btn>
            </template>
            <span>Invoice</span>
          </v-tooltip>

          <v-btn x-small class="mr-1 accent" fab @click="createOrUpdate(item)" v-if="$can('edit',pageInfo.permission)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn color="error" x-small fab @click="deleteItem(item, index, state.store_name)" v-if="$can('remove',pageInfo.permission)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
      <v-dialog v-model="dialog2" persistent max-width="1300">
        <v-card>
          <v-card-text>
            <div class="text-right">
              <v-btn
                ref="printBtn"
                v-print="`#printInvoice`"
                icon
              >
                <v-icon color="light-blue">mdi-printer</v-icon>
              </v-btn>
            </div>
            <v-sheet :id="`printInvoice`" style="margin:10px;">
              <v-container>
                <report-head></report-head>
                <v-card-subtitle class="text-center"><b>Invoice</b></v-card-subtitle>

                <table v-if="selectedInvoice && Object.keys(selectedInvoice).length" style="width:100%;  margin-top: 30px;">
                  <tr class="table-text">
                    <td>Invoice No</td>
                    <td>{{ selectedInvoice.transaction_no }}</td>
                  </tr>
                  <tr class="table-text">
                    <td>Student Information</td>
                    <td>
                      <div>Name: {{ selectedInvoice?.student?.userable?.name }}</div>
                      <div>Student ID: {{ selectedInvoice?.student?.student_id }}</div>
                      <div>Phone: {{ selectedInvoice?.student?.userable?.phone_number }}</div>
                      <div>Email: {{ selectedInvoice?.student?.userable?.email }}</div>
                    </td>
                  </tr>
                  <tr class="table-text">
                    <td>Course Name</td>
                    <td>{{ selectedInvoice?.course?.name }}</td>
                  </tr>
                  <tr class="table-text">
                    <td>Amount</td>
                    <td>{{ selectedInvoice?.course?.amount }}</td>
                  </tr>
                  <tr class="table-text">
                    <td>Total</td>
                    <td>{{ selectedInvoice.amount }}</td>
                  </tr>
                  <tr class="table-text">
                    <td>Payment</td>
                    <td>
                      <div>Type: {{ selectedInvoice.payment_type }}</div>
                      <div>Status: {{ selectedInvoice.payment_status }}</div>
                      <div>Details: {{ selectedInvoice.payment_details }}</div>
                    </td>
                  </tr>
                </table>
              </v-container>
            </v-sheet>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="mr-2 error darken-1 white--text" depressed @click="closeInvoice()">Close</v-btn>
          </v-card-actions>
        </v-card>
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
import {mapGetters} from "vuex";
const permission = 'Students Course'
const stateName = 'student_courses'
const storeName='admin/student_course'

export default {
  name: 'studentCourse',
  head: {
    title: 'Students',
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
    subject: 'Students Course'
  },
  components: {BreadCrumbs, ExportPdf, ExportCsv, ExportExcel,ReportHead},
  mixins: [commonMixin],
  data() {
    return {
      pageInfo: {
        pageName: 'Student Course',
        apiUrl: '/student-course/',
        permission
      },
      state: {
        name: stateName,
        store_name: storeName,
      },
      selected: [],
      options: {},
      dialog: false,
      dialog2: false,
      editIndex: -1,
      editMode:false,
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      image:null,
      form: {
        student_id:null,
        course_id:null,
        amount:0,
        payment_type:'',
        payment_details:'',
      },
      search: '',
      timeout: null,
      headers: [
        {
          text: 'SL',
          align: 'start',
          value: 'id'
        },
        /*{
          text: 'Transaction No',
          align: 'start',
          value: 'transaction_no'
        },*/
        {
          text: 'Student Name',
          align: 'start',
          value: 'student.userable.name'
        },
        {
          text: 'Student ID',
          align: 'start',
          value: 'student.student_id'
        },
        {
          text: 'Course Name',
          align: 'start',
          value: 'course.name'
        },
        {
          text: 'Course Amount',
          align: 'start',
          value: 'amount'
        },
        /*{
          text: 'Payment Type',
          align: 'start',
          value: 'payment_type'
        },
        {
          text: 'Payment Details',
          align: 'start',
          value: 'payment_details'
        },*/
        {
          text: 'Payment Status',
          align: 'start',
          value: 'payment_status'
        },
        {
          text: 'Is Approved',
          value: 'is_approved'
        },
        {
          text: 'Status',
          value: 'status'
        },
        {text: 'Actions', value: 'actions', sortable: false}
      ],
      selectedInvoice:{},
      footerProps: {
        itemsPerPageOptions: [20, 50, 100, 500]
      }
    }
  },
  computed: {
    ...mapGetters('admin/student_course',['student_courses','totalItems']),
    ...mapGetters('admin/student',['students']),
    ...mapGetters('admin/course',['courses']),
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
    'form.course_id'(value){
      let vv = this.courses.find(item=>item.id === value)
      if (vv) this.form.amount=vv.amount;
      else this.form.amount=0
    }
  },
  async mounted() {
    this.loader.isLoading=true;
    await this.init();
    const payload2 = {apiUrl: '/student/?per_page=500&page=1', stateName: 'students'}
    if (!this.students.length) await this.$store.dispatch('admin/student/getItems', payload2)

    const payload4 = {apiUrl: '/course/?per_page=500&page=1', stateName: 'courses'}
    if (!this.courses.length) await this.$store.dispatch('admin/course/getItems', payload4)
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
      if (item) {
        this.editIndex = this.student_courses.indexOf(item)
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
      } else {
        this.selectedItem = {}
        Object.keys(this.form).map((field) => {
          this.form[field]=null;
        });
        this.image=null
        this.form.image=null
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
    approveOrDecline(index, value, event, id, stateName, storeName, name) {
      this.$axios.put(`/student-course/approved/decline/${id}`)
        .then(response => {
          if (response.data.status === 'success') {
            const payload = {index, stateName, name}
            this.$store.commit(storeName + '/ANY_STATUS_CHANGE', payload)
            this.$toaster.success(response.data.message)
          } else {
            this.$toaster.error(response.data.message)
          }
        })
        .catch(() => {
          this.$toaster.error('Something went wrong!!')
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
    viewInvoice(item) {
      this.selectedInvoice = item
      this.dialog2 = true
    },
    closeInvoice() {
      this.dialog2 = false
      this.selectedInvoice = {}
    },
  }
}
</script>
<style scoped>
.text-center {
  text-align: center;
}

.d-flex {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
}

th, tr, td {
  padding: 5px;
}

.table-text {
  font-size: 14px;
  font-weight: bold;
}

.text-center {
  text-align: center;
}

#page {
  size: auto;
  margin: 0;
}
</style>
