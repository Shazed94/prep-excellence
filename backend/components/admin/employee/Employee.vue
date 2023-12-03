<template>
  <v-card>
    <v-card-title class="grey text--darken-1">
      <span class="text-h6">Add Employee</span>
      <v-spacer></v-spacer>
    </v-card-title>
    <validation-observer ref="observer" v-slot="{ invalid }">
      <v-form ref="form" @submit.prevent="submitData()">
        <v-card-text>
          <v-container>
            <v-row dense align="baseline">
              <v-col cols="12" xs="12" md="4">
                <validation-provider
                   v-slot="{ errors }"
                   name="role id"
                   vid="role_id"
                   rules="required">
                  <v-select
                    v-model="form.role_id"
                    :items="activeEmployeeRoles"
                    :error-messages="errors"
                    item-text="name"
                    item-value="id"
                    label="Select Role"
                    dense
                    clearable
                    hide-details="auto"
                    outlined></v-select>
                </validation-provider>
              </v-col>
              <v-col cols="12" xs="12" md="4">
                <validation-provider v-slot="{ errors }" name="qualification" vid="qualification" rules="">
                  <v-select
                    v-model="form.designation_id"
                    :items="activeDesignations"
                    :error-messages="errors"
                    item-text="name"
                    item-value="id"
                    label="Select Qualification"
                    dense
                    clearable
                    hide-details="auto"
                    outlined></v-select>
                </validation-provider>
              </v-col>
              <v-col cols="12" xs="12" md="4">
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
              <v-col cols="12" xs="12" md="4">
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
              <v-col cols="12" xs="12" md="4">
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
              <v-col cols="12" xs="12" md="4">
                <validation-provider
                  v-slot="{ errors }"
                  name="phone number"
                  vid="phone_number"
                  rules="required|max:60"
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
              <v-col cols="12" xs="12" md="4">
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

<!--              <v-col cols="12" xs="12" md="4">
                <validation-provider
                  v-slot="{ errors }"
                  name="hourly rate"
                  vid="hourly rate"
                  rules="required"
                >
                  <v-text-field
                    v-model="form.hour_rate"
                    :error-messages="errors"
                    label="Hourly rate"
                    type="number"
                    step="any"
                    required
                    dense
                    hide-details="auto"
                    outlined
                  ></v-text-field>
                </validation-provider>
              </v-col>-->

<!--              <v-col cols="12" xs="12" md="4">
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
              <v-col cols="12" xs="12" md="4">
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
              <v-col cols="12" xs="12" md="4">
                <validation-provider v-slot="{ errors }" name="marital status" vid="marital_status_id" rules="required">
                  <v-select
                    v-model="form.marital_status_id"
                    :items="marital_status"
                    :error-messages="errors"
                    item-text="name"
                    item-value="id"
                    label="Select marital status"
                    dense
                    clearable
                    hide-details="auto"
                    outlined></v-select>
                </validation-provider>
              </v-col>
              <v-col cols="12" xs="12" md="4">
                <validation-provider
                  v-slot="{ errors }"
                  name="father name"
                  vid="father_name"
                  rules="required|max:191"
                >
                  <v-text-field
                    v-model="form.father_name"
                    :error-messages="errors"
                    label="Father Name"
                    required
                    dense
                    hide-details="auto"
                    outlined
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="12" xs="12" md="4">
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
              </v-col>
              -->
              <v-col cols="12" xs="12" md="4">
                <validation-provider
                  v-slot="{ errors }"
                  name="joining date"
                  vid="joining_date"
                  rules="required"
                >
                  <v-text-field
                    v-model="form.join_date"
                    :error-messages="errors"
                    label="joining date"
                    type="date"
                    dense
                    hide-details="auto"
                    outlined
                  ></v-text-field>
                </validation-provider>
              </v-col>
<!--
              <v-col cols="12" xs="12" md="4">
                <validation-provider
                  v-slot="{ errors }"
                  name="SSN"
                  vid="ssn"
                  rules="max:191"
                >
                  <v-text-field
                    v-model="form.nid"
                    :error-messages="errors"
                    label="SSN"
                    required
                    dense
                    hide-details="auto"
                    outlined
                  ></v-text-field>
                </validation-provider>
              </v-col>
-->

              <v-col cols="12" xs="12" md="4">
                <validation-provider
                  v-slot="{ errors }"
                  name="emergency contact"
                  vid="emergency_contact"
                  rules="required|max:191"
                >
                  <v-text-field
                    v-model="form.emergency_contact"
                    :error-messages="errors"
                    label="emergency contact (Name, Phone, Email)"
                    required
                    dense
                    hide-details="auto"
                    outlined
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="12" xs="12" md="12"></v-col>
              <v-col cols="12" md="4">
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
                  />
                </validation-provider>
              </v-col>
              <v-col cols="12" xs="12" md="12"></v-col>
              <v-col cols="12" xs="12" md="4">
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
              <v-col cols="12" xs="12" md="4">
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
              <v-col cols="12" xs="12" md="4">
                <validation-provider
                  v-slot="{ errors }"
                  name="a state"
                  vid="a state"
                  rules="required"
                >
                  <v-text-field
                    v-model="form.present_address.state"
                    :error-messages="errors"
                    label="State"
                    dense
                    hide-details="auto"
                    outlined
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="12" xs="12" md="4">
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
              <v-col cols="12" xs="12" md="4">
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
              <!--   employee subject salaries          -->
              <v-col cols="12" md="12" xs="12">
                <v-card>
                  <v-card-title class="grey text--darken-1">
                    <span>Employee Subject wise hour rate</span>
                  </v-card-title>
                  <v-row dense v-for="(exp,e) in form.employee_subject_salaries" :key="e">
                    <v-col cols="12" md="10">
                      <v-row dense>
                        <v-col cols="12" md="6">
                          <validation-provider
                              v-slot="{ errors }"
                              name="subject"
                              :vid="'subject_id'+e"
                              rules="required">
                            <v-select
                                v-model="form.employee_subject_salaries[e].course_type_id"
                                :items="only_subjects"
                                :error-messages="errors"
                                item-text="name"
                                item-value="id"
                                label="Select Subject"
                                dense
                                hide-details="auto"
                                outlined></v-select>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" md="6">
                          <validation-provider
                              v-slot="{ errors }"
                              name="hour_rate"
                              :vid="'hour_rate'+e"
                              rules="required|min_value:1"
                          >
                            <v-text-field
                                v-model="form.employee_subject_salaries[e].hour_rate"
                                :error-messages="errors"
                                label="Hour rate"
                                type="number"
                                step="any"
                                dense
                                hide-details="auto"
                                outlined
                            ></v-text-field>
                          </validation-provider>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" xs="12" md="2">
                      <v-btn color="error" @click="spliceESS(e)" x-small fab v-if="form.employee_subject_salaries.length > 1">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                      <v-btn color="success" @click="addESS()" x-small fab v-if="form.employee_subject_salaries.length === (e+1)">
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
              <!--    work experiences          -->
              <v-col cols="12" md="12" xs="12">
                <v-card>
                  <v-card-title class="grey text--darken-1">
                    <span>Employee Work Experience</span>
                  </v-card-title>
                  <v-row dense v-for="(exp,e) in form.work_experiences" :key="e">
                    <v-col cols="12" xs="12" md="10">
                      <v-row dense>
                        <v-col cols="12" xs="12" md="12">
                          <validation-provider
                            v-slot="{ errors }"
                            name="is working"
                            :vid="'is working'+e"
                            rules=""
                          >
                            <v-checkbox
                              v-model="form.work_experiences[e].is_working"
                              :label="`I am currently working in this role`"
                              :error-messages="errors"
                              dense
                              hide-details="auto"
                              outlined
                            ></v-checkbox>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" xs="12" md="3">
                          <validation-provider
                            v-slot="{ errors }"
                            name="employer"
                            :vid="'employer'+e"
                            rules="max:191"
                          >
                            <v-text-field
                              v-model="form.work_experiences[e].institute"
                              :error-messages="errors"
                              label="Employer"
                              required
                              dense
                              hide-details="auto"
                              outlined
                            ></v-text-field>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" xs="12" md="3">
                          <validation-provider
                            v-slot="{ errors }"
                            name="designation"
                            :vid="'designation'+e"
                            rules="max:191"
                          >
                            <v-text-field
                              v-model="form.work_experiences[e].designation"
                              :error-messages="errors"
                              label="Designation"
                              required
                              dense
                              hide-details="auto"
                              outlined
                            ></v-text-field>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" xs="12" md="3">
                          <validation-provider
                            v-slot="{ errors }"
                            name="start at"
                            :vid="'start_date'+e"
                            rules=""
                          >
                            <v-text-field
                              v-model="form.work_experiences[e].start_date"
                              :error-messages="errors"
                              label="Start At"
                              type="date"
                              :max="moment().format('YYYY-MM-DD')"
                              dense
                              hide-details="auto"
                              outlined
                            ></v-text-field>
                          </validation-provider>
                        </v-col>
                        <v-col v-if="!exp.is_working" cols="12" xs="12" md="3">
                          <validation-provider
                            v-slot="{ errors }"
                            name="end at"
                            :vid="'end_date'+e"
                            rules=""
                          >
                            <v-text-field
                              v-model="form.work_experiences[e].end_date"
                              :error-messages="errors"
                              label="End At"
                              type="date"
                              :min="form.work_experiences[e].start_date?moment(form.work_experiences[e].start_date).format('YYYY-MM-DD'):''"
                              dense
                              hide-details="auto"
                              outlined
                            ></v-text-field>
                          </validation-provider>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" xs="12" md="2">
                      <v-btn color="error" @click="spliceWE(e)" x-small fab v-if="form.work_experiences.length > 1">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                      <v-btn color="success" @click="addWE()" x-small fab v-if="form.work_experiences.length === (e+1)">
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            <!--     Education qualification         -->
              <v-col cols="12" md="12" xs="12">
                <v-card>
                  <v-card-title class="grey text--darken-1">
                    <span>Employee Education Qualification</span>
                  </v-card-title>
                  <v-row dense v-for="(exp,e) in form.employee_qualifications" :key="e">
                    <v-col cols="12" xs="12" md="10">
                      <v-row dense>
                        <v-col cols="12" xs="12" md="3">
                          <validation-provider
                            v-slot="{ errors }"
                            name="degree or qualification"
                            :vid="'degree or qualification'+e"
                            rules="max:191"
                          >
                            <v-text-field
                              v-model="form.employee_qualifications[e].exam_name"
                              :error-messages="errors"
                              label="Degree / Qualification"
                              required
                              dense
                              hide-details="auto"
                              outlined
                            ></v-text-field>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" xs="12" md="3">
                          <validation-provider
                            v-slot="{ errors }"
                            name="institute"
                            :vid="'institute'+e"
                            rules="max:191"
                          >
                            <v-text-field
                              v-model="form.employee_qualifications[e].institute"
                              :error-messages="errors"
                              label="Institute"
                              required
                              dense
                              hide-details="auto"
                              outlined
                            ></v-text-field>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" xs="12" md="3">
                          <validation-provider
                            v-slot="{ errors }"
                            name="state"
                            :vid="'state'+e"
                            rules="max:100"
                          >
                            <v-text-field
                              v-model="form.employee_qualifications[e].state"
                              :error-messages="errors"
                              label="State"
                              dense
                              hide-details="auto"
                              outlined
                            ></v-text-field>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" xs="12" md="3">
                          <validation-provider
                            v-slot="{ errors }"
                            name="country"
                            :vid="'country'+e"
                            rules="max:100"
                          >
                            <v-text-field
                              v-model="form.employee_qualifications[e].country"
                              :error-messages="errors"
                              label="Country"
                              dense
                              hide-details="auto"
                              outlined
                            ></v-text-field>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" xs="12" md="3">
                          <validation-provider
                            v-slot="{ errors }"
                            name="result"
                            :vid="'result'+e"
                            rules="max:191"
                          >
                            <v-text-field
                              v-model="form.employee_qualifications[e].result"
                              :error-messages="errors"
                              label="Result"
                              dense
                              hide-details="auto"
                              outlined
                            ></v-text-field>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" xs="12" md="3">
                          <validation-provider
                            v-slot="{ errors }"
                            name="out of result"
                            :vid="'out_of_result'+e"
                            rules="max:191"
                          >
                            <v-text-field
                              v-model="form.employee_qualifications[e].out_of_result"
                              :error-messages="errors"
                              label="Out of Result"
                              dense
                              hide-details="auto"
                              outlined
                            ></v-text-field>
                          </validation-provider>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col cols="12" xs="12" md="2">
                      <v-btn color="error" @click="spliceEQ(e)" x-small fab v-if="form.employee_qualifications.length > 1">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                      <v-btn color="success" @click="addEQ()" x-small fab v-if="form.employee_qualifications.length === (e+1)">
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
              <v-col cols="12" md="12">
                <validation-provider
                    v-slot="{ errors }"
                    name="short biography"
                    vid="short_biography"
                    rules=""
                >
                  <v-textarea
                      v-model="form.short_biography"
                      :error-messages="errors"
                      label="Short Biography"
                      dense
                      hide-details="auto"
                      outlined
                  ></v-textarea>
                </validation-provider>
              </v-col>
              <v-col cols="12" md="12">
                <label>Biography</label>
                <validation-provider
                  v-slot="{ errors }"
                  name="biography"
                  vid="biography"
                  rules=""
                >
                  <client-only placeholder="loading...">
                    <ckeditor-nuxt v-model="form.biography" :error-messages="errors" :config="editorConfig"  />
                  </client-only>
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
            :loading="loader.isSubmitting"
            depressed
          >
            {{ editIndex > -1 ? 'Update' : 'Save' }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </validation-observer>
  </v-card>

</template>

<script>
import {common as commonMixin} from "@/mixins/common";
import FormImagePreview from '@/components/form/formImagePreview';
import moment from "moment-timezone";
import {mapGetters} from 'vuex'
const stateName = 'employees'
const storeName='admin/employee'
export default {
  mixins: [commonMixin],
  components:{FormImagePreview,'ckeditor-nuxt': () => { if (process.client) { return import('@blowstack/ckeditor-nuxt') } },},
  props:{
    applicant:{
      type:Object,
      required:false
    }
  },
  data() {
    return {
      pageInfo: {
        pageName: 'Employee',
        apiUrl: '/employee/',
      },
      state: {
        name: stateName,
        store_name: storeName,
      },
      moment,
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      dialog: false,
      image:null,
      form: {
        role_id:null,
        designation_id:null,
        first_name: null,
        last_name: null,
        email: null,
        phone_number: null,
        image: null,
        gender_id: null,
        blood_group_id: null,
        religion_id: null,
        marital_status: null,
        father_name: null,
        mother_name: null,
        join_date: null,
        hour_rate: 0,
        nid: null,
        biography: null,
        short_biography: null,
        emergency_contact: null,
        present_address: {
          city:null,
          state:null,
          country:null,
          zip:null,
          address:null,
        },
        permanent_address: '',
        work_experiences:[
          {institute:null, designation:null, start_date:null, end_date:null, is_working:0},
        ],
        employee_qualifications:[
          {exam_name:null, institute:null, state:null,country:null, result:null, out_of_result:null},
        ],
        employee_subject_salaries:[
          {course_type_id:null, course_category_id:null, hour_rate:0},
        ],
      },
      search: '',
      selectedItem: {},
      editIndex: -1,
      is_workings:[
        {id:1, name:'Yes'},
        {id:0, name:'No'},
      ],
      editorConfig: {
        simpleUpload: {
          uploadUrl: this.$config.apiUrl+'/ckeditor/upload/file',
          withCredentials: true,
          // Headers sent along with the XMLHttpRequest to the upload server.
          headers: {
            'X-CSRF-TOKEN': 'CSRF-Token',
            Authorization: this.$auth.strategy.token.get()
          }
        },
        removePlugins: ['Title'],
      },
    }
  },
  computed: {
    ...mapGetters('rolePermission/basic',['employee_roles','activeEmployeeRoles']),
    ...mapGetters('user/basic',['activeDesignations','designations','religions','marital_status','genders','blood_groups']),
    ...mapGetters('admin/subject',['only_subjects']),
    editMode() {
      return this.editIndex > -1
    }
  },
  async mounted() {
    this.loader.isLoading=true;
    const payload = {apiUrl: '/role/', stateName: 'roles'}
    if (!this.employee_roles.length) await this.$store.dispatch('rolePermission/basic/getItems', payload)

    const payload1 = {apiUrl: '/designation/', stateName: 'designations'}
    if (!this.designations.length) await this.$store.dispatch('user/basic/getItems', payload1)

    const payload2 = {apiUrl: '/religion/', stateName: 'religions'}
    if (!this.religions.length) await this.$store.dispatch('user/basic/getItems', payload2)

    const payload3 = {apiUrl: '/marital-status/', stateName: 'marital_status'}
    if (!this.marital_status.length) await this.$store.dispatch('user/basic/getItems', payload3)

    const payload4 = {apiUrl: '/gender/', stateName: 'genders'}
    if (!this.genders.length) await this.$store.dispatch('user/basic/getItems', payload4)

    const payload5 = {apiUrl: '/blood-group/', stateName: 'blood_groups'}
    if (!this.blood_groups.length) await this.$store.dispatch('user/basic/getItems', payload5)

    const payload6 = {apiUrl: '/common/course/types', stateName: 'only_subjects'}
    await this.$store.dispatch('admin/subject/getItems2', payload6)

    this.loader.isLoading=false;
  },
  created() {
    if(this.applicant) this.setInitInfo()
  },
  watch:{
    applicant(){
      if(this.applicant) this.setInitInfo()
    }
  },
  methods: {
    removeImage($emit, formElementName) {
      if (!formElementName) return
      if ($emit && (this.form[formElementName] && this.form[formElementName].length > 1))
        $emit ? this.form[formElementName].splice($emit, 1) : this.form[formElementName] = null
      else this.form[formElementName] = null
    },
    addWE(){
      this.form.work_experiences.push({institute:null, designation:null, start_date:null, end_date:null, is_working:0})
    },
    spliceWE(index){
      this.form.work_experiences.splice(index,1)
    },
    addEQ(){
      this.form.employee_qualifications.push({exam_name:null, institute:null, state:null, country:null, result:null, out_of_result:null})
    },
    spliceEQ(index){
      this.form.employee_qualifications.splice(index,1);
    },
    addESS(){
      this.form.employee_subject_salaries.push({course_type_id:null, course_category_id:null, hour_rate:0})
    },
    spliceESS(index){
      this.form.employee_subject_salaries.splice(index,1);
    },
    async submitData() {
      if (await this.$refs.observer.validate()) {
        this.loader.isSubmitting = true
        const formData = this.$generateFormData(this.form, this.editIndex > -1, ['work_experiences', 'employee_qualifications', 'present_address','employee_subject_salaries'])
        let url = this.pageInfo.apiUrl

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
      this.form.work_experiences=[
        {institute:null, designation:null, start_date:null, end_date:null, is_working:0},
      ]
      this.form.employee_qualifications=[
        {exam_name:null, institute:null, state:null, country:null, result:null, out_of_result:null},
      ]
      this.form.employee_subject_salaries = [
          {course_type_id:null, course_category_id:null, hour_rate:0}
      ]
      this.form.biography = null
      this.$refs.observer.reset()
    },
    setInitInfo(){
        this.form.first_name = this.applicant.name
        this.form.email = this.applicant.email
        this.form.phone_number = this.applicant.phone_number
    }
  }
}
</script>

