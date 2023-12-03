<template>
  <v-container fluid>
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: 'Student',disabled: true, href: '/admin/student/student'}]"
    />
    <v-card>
      <v-data-table
        dense
        v-model="selected"
        item-key="id"
        show-select
        :headers="headers"
        :items="students"
        :options.sync="options"
        :server-items-length="totalItems"
        :search="search"
        :footer-props="footerProps"
        :items-per-page="10"
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
                            <validation-provider
                              v-slot="{ errors }"
                              name="First Name"
                              vid="first_name"
                              rules="required|max:191"
                            >
                              <v-text-field
                                v-model="form.first_name"
                                :error-messages="errors"
                                label="First Name"
                                required
                                dense
                                hide-details="auto"
                                outlined
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="Last Name"
                              vid="last_name"
                              rules="required|max:191"
                            >
                              <v-text-field
                                v-model="form.last_name"
                                :error-messages="errors"
                                label="Last Name"
                                required
                                dense
                                hide-details="auto"
                                outlined
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="email"
                              vid="email"
                              rules="required|email|max:191"
                            >
                              <v-text-field
                                v-model="form.email"
                                :error-messages="errors"
                                label="Email"
                                required
                                dense
                                hide-details="auto"
                                outlined
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="phone number"
                              vid="phone_number"
                              rules="required|max:191"
                            >
                              <v-text-field
                                v-model="form.phone_number"
                                :error-messages="errors"
                                label="Phone Number"
                                required
                                dense
                                hide-details="auto"
                                outlined
                              ></v-text-field>
                            </validation-provider>
                          </v-col>

                          <v-col cols="12" xs="12" sm="4">
                            <validation-provider v-slot="{ errors }" name="gender" vid="gender_id" rules="required">
                              <v-select
                                v-model="form.gender_id"
                                :items="genders"
                                :error-messages="errors"
                                item-text="name"
                                item-value="id"
                                label="Select Gender"
                                dense
                                clearable
                                hide-details="auto"
                                outlined></v-select>
                            </validation-provider>
                          </v-col>

<!--                          <v-col cols="12" xs="12" sm="4">
                            <validation-provider v-slot="{ errors }" name="blood group" vid="blood_group_id" rules="required">
                              <v-select
                                v-model="form.blood_group_id"
                                :items="blood_groups"
                                :error-messages="errors"
                                item-text="name"
                                item-value="id"
                                label="Select Blood Group"
                                dense
                                clearable
                                hide-details="auto"
                                outlined></v-select>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4">
                            <validation-provider v-slot="{ errors }" name="religion" vid="religion_id" rules="required">
                              <v-select
                                v-model="form.religion_id"
                                :items="religions"
                                :error-messages="errors"
                                item-text="name"
                                item-value="id"
                                label="Select Religion"
                                dense
                                clearable
                                hide-details="auto"
                                outlined></v-select>
                            </validation-provider>
                          </v-col>
                          -->
                          <v-col cols="12" xs="12" sm="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="date of birth"
                              vid="date_of_birth"
                              rules="required"
                            >
                              <v-text-field
                                v-model="form.date_of_birth"
                                :error-messages="errors"
                                label="Date of Birth"
                                type="date"
                                :max="moment().format('YYYY-MM-DD')"
                                dense
                                hide-details="auto"
                                outlined
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <template v-if="year < 18 ">
                            <v-col cols="12" xs="12" sm="4">
                              <validation-provider
                                v-slot="{ errors }"
                                name="guardian email"
                                vid="guardian email"
                                rules="required|email|max:60"
                              >
                                <v-text-field
                                  v-model="form.guardian_email"
                                  :error-messages="errors"
                                  label="Guardian Email"
                                  required
                                  dense
                                  hide-details="auto"
                                  outlined
                                ></v-text-field>
                              </validation-provider>
                            </v-col>
                            <v-col cols="12" xs="12" sm="4">
                              <validation-provider
                                v-slot="{ errors }"
                                name="guardian name"
                                vid="guardian_name"
                                rules="required|max:191"
                              >
                                <v-text-field
                                  v-model="form.father_name"
                                  :error-messages="errors"
                                  label="Guardian Name"
                                  required
                                  dense
                                  hide-details="auto"
                                  outlined
                                ></v-text-field>
                              </validation-provider>
                            </v-col>
                            <v-col cols="12" xs="12" sm="4">
                              <validation-provider
                                v-slot="{ errors }"
                                name="Guardian phone number"
                                vid="father_phone_no"
                                rules="required|max:191"
                              >
                                <v-text-field
                                  v-model="form.father_phone_no"
                                  :error-messages="errors"
                                  label="Guardian Phone Number"
                                  required
                                  dense
                                  hide-details="auto"
                                  outlined
                                ></v-text-field>
                              </validation-provider>
                            </v-col>
                          </template>
<!--                          <v-col cols="12" xs="12" sm="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="mother name"
                              vid="mother_name"
                              rules="required|max:191"
                            >
                              <v-text-field
                                v-model="form.mother_name"
                                :error-messages="errors"
                                label="Mother Name"
                                required
                                dense
                                hide-details="auto"
                                outlined
                              ></v-text-field>
                            </validation-provider>
                          </v-col>-->
                          <v-col cols="12" sm="4">
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
                          </v-col>
                          <v-col cols="12" xs="12" sm="12"></v-col>
                          <v-col cols="12" xs="12" sm="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="address"
                              vid="address"
                              rules="required|max:191"
                            >
                              <v-text-field
                                v-model="form.present_address.address"
                                :error-messages="errors"
                                label="Address"
                                required
                                dense
                                hide-details="auto"
                                outlined
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="city"
                              vid="city"
                              rules="required"
                            >
                              <v-text-field
                                v-model="form.present_address.city"
                                :error-messages="errors"
                                label="City"
                                required
                                dense
                                hide-details="auto"
                                outlined
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="state"
                              vid="state"
                              rules="required"
                            >
                              <v-text-field
                                v-model="form.present_address.state"
                                :error-messages="errors"
                                label="State"
                                required
                                dense
                                hide-details="auto"
                                outlined
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="country"
                              vid="country"
                              rules="required"
                            >
                              <v-text-field
                                v-model="form.present_address.country"
                                :error-messages="errors"
                                label="Country"
                                required
                                dense
                                hide-details="auto"
                                outlined
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="zip"
                              vid="zip"
                              rules="required"
                            >
                              <v-text-field
                                v-model="form.present_address.zip"
                                :error-messages="errors"
                                label="Zip"
                                required
                                dense
                                hide-details="auto"
                                outlined
                              ></v-text-field>
                            </validation-provider>
                          </v-col>

<!--                          <v-col cols="12" xs="12" sm="6">
                            <validation-provider
                              v-slot="{ errors }"
                              name="permanent address"
                              vid="permanent_address"
                              rules="required|max:191"
                            >
                              <v-textarea
                                v-model="form.parmanent_address"
                                :error-messages="errors"
                                label="Permanent Address"
                                required
                                dense
                                hide-details="auto"
                                outlined
                              ></v-textarea>
                            </validation-provider>
                          </v-col>-->
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="green darken-1"
                        class="mx-2 white--text"
                        type="submit"
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
          <img v-if="item.userable" :src="item.userable.image" alt="item.userable.name" width="50" height="50"/>
          <img v-else :src="`https://microsite.hcltech.com/manufacturing/imro/img/avatar.png`" alt="item.userable.name" width="50" height="50"/>
        </template>

        <template v-slot:item.status="{ index, item }">
          <v-switch v-if="$can('read',pageInfo.permission)"
                    class="pa-0 ma-0"
                    hide-details
                    :value="true"
                    :input-value="item.is_active"
                    @change="toggleStatusChange(index, $event !== null, $event, item.id, state.name, state.store_name)">
          </v-switch>
        </template>
        <template v-slot:item.date_of_birth="{ index, item }">
          {{ moment(item.date_of_birth).format('MM-DD-YYYY') }}
        </template>
        <template v-slot:item.created_at="{ index, item }">
          {{ moment(item.created_at).format('MM-DD-YYYY') }}
        </template>
        <template v-slot:item.actions="{index, item }">
          <v-btn x-small class="mr-1 accent" fab :to="`/admin/student/${item.id}/student`" v-if="$can('read',pageInfo.permission)">
            <v-icon>mdi-eye</v-icon>
          </v-btn>
          <v-btn x-small class="mr-1 accent" fab @click="createOrUpdate(item)" v-if="$can('edit',pageInfo.permission)">
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
import BreadCrumbs from "~/components/common/BreadCrumbs";
import {common as commonMixin} from "@/mixins/common";
import {mapGetters} from "vuex";
import FormImagePreview from '@/components/form/formImagePreview';
import moment from "moment-timezone";
const permission = 'Students'
const stateName = 'students'
const storeName='admin/student'

export default {
  name: 'student',
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
    subject: 'Students'
  },
  components: {BreadCrumbs, ExportPdf, ExportCsv, ExportExcel, FormImagePreview},
  mixins: [commonMixin],
  data() {
    return {
      pageInfo: {
        pageName: 'Student',
        apiUrl: '/student/',
        permission
      },
      moment,
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
      form: {
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        image: null,
        gender_id: null,
        blood_group_id: null,
        religion_id: null,
        parent_id: null,
        father_name: '',
        father_phone_no: '',
        guardian_email: '',
        mother_name: '',
        date_of_birth: null,
        present_address: {
          city:'',
          state:'',
          country:'',
          zip:'',
          address:'',
        },
        parmanent_address: '',
      },
      search: '',
      timeout: null,
      headers: [
        /*{
          text: 'SL',
          align: 'start',
          value: 'id'
        },*/
        {
          text: 'Image',
          align: 'start',
          value: 'userable.image'
        },
        {
          text: 'First Name',
          align: 'start',
          value: 'userable.first_name'
        },
        {
          text: 'Last Name',
          align: 'start',
          value: 'userable.last_name'
        },
        {
          text: 'Student ID',
          align: 'start',
          value: 'student_id'
        },
        {
          text: 'Email',
          align: 'start',
          value: 'userable.email'
        },
        {
          text: 'Phone Number',
          align: 'start',
          value: 'userable.phone_number'
        },
        /*{
          text: 'Gender',
          align: 'start',
          value: 'userable.gender.name'
        },*/
        /*{
          text: 'Blood Group',
          align: 'start',
          value: 'userable.bloodGroup.name'
        },
        {
          text: 'Religion',
          align: 'start',
          value: 'userable.religion.name'
        },*/
        {
          text: 'DOB',
          align: 'start',
          value: 'date_of_birth'
        },
        {
          text: 'Guardian Name',
          align: 'start',
          value: 'parents.father_name'
        },
        {
          text: 'Guardian Contact',
          align: 'start',
          value: 'parents.father_phone_no'
        },
        {
          text: 'Student Added',
          align: 'start',
          value: 'created_at'
        },
        {
          text: 'Status',
          value: 'status'
        },
        {text: 'Actions', value: 'actions', sortable: false}
      ],
      footerProps: {
        itemsPerPageOptions: [10,20, 50, 100, 500]
      },
      year:0,
    }
  },
  computed: {
    ...mapGetters('admin/student',['students','totalItems']),
    ...mapGetters('user/basic',['religions','genders','blood_groups']),
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
    'form.date_of_birth': {
      handler() {
        if (this.form.date_of_birth){
          this.year = moment().diff(moment(this.form.date_of_birth),'years')
        }else{
          this.year = 0
        }
      },
      deep: true
    },
    'form.guardian_email': {
      handler() {
        if (!this.editMode && this.form.guardian_email){
          this.findParent()
        }else{
          this.form.parent_id=null
        }
      },
      deep: true
    },
  },
  async mounted() {
    this.loader.isLoading=true;
    await this.init();
    const payload2 = {apiUrl: '/religion/', stateName: 'religions'}
    if (!this.religions.length) await this.$store.dispatch('user/basic/getItems', payload2)

    const payload4 = {apiUrl: '/gender/', stateName: 'genders'}
    if (!this.genders.length) await this.$store.dispatch('user/basic/getItems', payload4)

    const payload5 = {apiUrl: '/blood-group/', stateName: 'blood_groups'}
    if (!this.blood_groups.length) await this.$store.dispatch('user/basic/getItems', payload5)
    this.loader.isLoading=false;
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
    jsonDecode(dt){
      try {
        return JSON.parse(dt)
      }catch (e){
        return {}
      }
    },
    createOrUpdate(item = null) {
      if (item) {
        this.editIndex = this.students.indexOf(item)
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
        this.form.first_name=item.userable?item.userable.first_name:null
        this.form.last_name=item.userable?item.userable.last_name:null
        this.form.email=item.userable?item.userable.email:null
        this.form.phone_number=item.userable?item.userable.phone_number:null
        this.form.gender_id=item.userable?item.userable.gender_id:null
        this.form.blood_group_id=item.userable?item.userable.blood_group_id:null
        this.form.religion_id=item.userable?item.userable.religion_id:null
        this.image=item.userable?item.userable.image:null
        this.form.image=null
        if (item.parents){
          this.form.father_name=item.parents.father_name
          this.form.father_phone_no=item.parents.father_phone_no
          this.form.mother_name=item.parents.mother_name
          this.form.present_address=this.jsonDecode(item.parents.present_address)
          this.form.parmanent_address=item.parents.parmanent_address
          if (item.parents.userable){
            this.form.guardian_email=item.parents.userable.email
          }else{
            this.form.guardian_email=null
          }
        }else{
          this.form.father_name=null
          this.form.father_phone_no=null
          this.form.mother_name=null
          this.form.present_address= {}
          this.form.parmanent_address=null
          this.form.guardian_email=null
        }

      } else {
        this.selectedItem = {}
        Object.keys(this.form).map((field) => {
          this.form[field]=null;
        });
        this.form.present_address={}
        this.image=null
        this.form.image=null
     }
      this.dialog = true
    },
    async submitData() {
      if (await this.$refs.observer.validate()) {
        this.loader.isSubmitting = true
        const formData = this.$generateFormData(this.form, this.editIndex > -1, ['present_address'])
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
      }
    },
    closeModal() {
      this.dialog = false
      this.clear()
    },
    clear() {
      this.editIndex = -1
      this.$refs.form.reset()
      this.form.present_address={}
      this.$refs.observer.reset()
    },
    findParent(){
      this.$axios.get(`/parent/find/by/${this.form.guardian_email}`).then((response) => {
        let dd = this.form.parent_id= response.data.data
        this.form.parent_id = dd.id;
        this.form.father_name = dd.father_name;
        this.form.father_phone_no = dd.father_phone_no;
      }).catch(() => {
          this.form.parent_id=null;
          this.form.father_name = '';
          this.form.father_phone_no = '';
      })
    }
  }
}
</script>
