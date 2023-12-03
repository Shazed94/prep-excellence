<template>
  <v-card>
    <v-card-text>
      <div class="text-right">
        <v-btn
          ref="printBtn"
          v-print="`#printSchedule`"
          icon
        >
          <v-icon color="light-blue">mdi-printer</v-icon>
        </v-btn>
      </div>
      <v-sheet :id="`printSchedule`" style="margin:10px;">
        <v-container>
          <report-head></report-head>
          <v-card-subtitle class="text-center"><b>{{  selectedItem.name +' '+ 'Schedule' }}</b></v-card-subtitle>
          <v-simple-table>
            <template v-slot:default>
              <thead>
              <tr>
                <th class="text-left">
                  Date
                </th>
                <th class="text-left">
                  Day
                </th>
                <th class="text-left">
                  Instructor
                </th>
                <th class="text-left">
                  Time
                </th>
                <th class="text-left">
                  Course
                </th>
                <th class="text-left">
                  Class
                </th>
                <th class="text-left">
                  Status
                </th>
                <th class="text-left">
                  Action
                </th>
              </tr>
              </thead>
              <tbody>
              <tr
                v-for="(item,key ) in selectedItem.courseSchedules"
                :key="key"
              >
                <td>{{ item.date }}</td>
                <td>{{ item.day }}</td>
                <td>{{ findEmployeeNameById(item.employee_id) }}</td>
                <td>
                  <span>
                    {{ item.start_time?moment(item.start_time,'hh:mm:ss').format('hh:mm a'):'Complete Before' }}
                  </span>
                  <span>
                    {{' - ' + moment(item.end_time,'hh:mm:ss').format('hh:mm a') }}
                  </span>
                </td>
                <td>{{ item.course_name }}</td>
                <td>{{ item.classes }}</td>
                <td>{{ item.status===0 ? 'Pending':item.status===1?'Complete':'Cancel' }}</td>
                <td>
                  <v-tooltip bottom v-if="item.status === 0 ">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn x-small class="mr-1 mb-1 danger" color="red" v-bind="attrs"
                             v-on="on" fab @click="deleteItemBasic(item)" v-if="$can('read','Auth')">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </template>
                    <span>Remove</span>
                  </v-tooltip>
                  <v-tooltip bottom v-if="item.status === 0 ">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn x-small class="mr-1 mb-1 danger" color="green" v-bind="attrs"
                             v-on="on" fab @click="updateModal(item)">
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                    </template>
                    <span>Edit</span>
                  </v-tooltip>
                </td>
              </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-container>
      </v-sheet>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn class="mr-2 error darken-1 white--text" depressed @click="$emit('closeSchedule')">Close</v-btn>
    </v-card-actions>
    <v-dialog v-model="dialog" persistent max-width="800">
      <v-card>
        <validation-observer tag="form" ref="observer" v-slot="{ invalid, valid }">

        <v-form ref="form" @submit.prevent="updateSchedule()">
        <v-card-text>
          <v-sheet style="margin:10px;">
            <v-container>
              <v-card-subtitle class="text-center"><b>{{  'Update Schedule' }}</b></v-card-subtitle>
             <v-row>
                <v-col cols="12" xs="12" md="4">
                  <validation-provider
                      v-slot="{ errors }"
                      name="date"
                      vid="date"
                      rules="required"
                  >
                    <v-text-field
                        v-model="form.date"
                        :error-messages="errors"
                        label="Date"
                        type="date"
                        dense
                        outlined
                        auto-grow
                        no-resize
                    ></v-text-field>
                  </validation-provider>
                </v-col>
               <v-col cols="12" xs="12" md="4">
                 <validation-provider
                     v-slot="{ errors }"
                     name="day"
                     :vid="'day'"
                     rules="required|max:100"
                 >
                   <v-autocomplete
                       v-model="form.day"
                       :items="days"
                       :error-messages="errors"
                       item-text="name"
                       item-value="name"
                       label="Day"
                       dense
                       clearable
                       hide-details="auto"
                       outlined></v-autocomplete>
                 </validation-provider>
               </v-col>
                <v-col cols="12" xs="12" md="4">
                  <validation-provider
                      v-slot="{ errors }"
                      name="start time"
                      vid="start_time"
                      rules="required"
                  >
                    <v-text-field
                        v-model="form.start_time"
                        label="Start At"
                        type="time"
                        :error-messages="errors"
                        dense
                        outlined
                        auto-grow
                        no-resize
                    ></v-text-field>
                  </validation-provider>
                </v-col>
                <v-col cols="12" xs="12" md="4">
                  <validation-provider
                      v-slot="{ errors }"
                      :name="'end time'"
                      :vid="'end_time'"
                      rules="required"
                  >
                    <v-text-field
                        v-model="form.end_time"
                        label="End At"
                        type="time"
                        :error-messages="errors"
                        dense
                        outlined
                        auto-grow
                        no-resize
                    ></v-text-field>
                  </validation-provider>
                </v-col>
                <v-col cols="12" xs="12" md="4">
                  <validation-provider
                      v-slot="{ errors }"
                      :name="'instructor'"
                      :vid="'instructor'"
                      rules="required">
                    <v-autocomplete
                        v-model="form.employee_id"
                        :items="only_employees"
                        :error-messages="errors"
                        item-text="userable.name"
                        item-value="id"
                        label="Instructors"
                        dense
                        clearable
                        hide-details="auto"
                        outlined></v-autocomplete>
                  </validation-provider>
                </v-col>
                <v-col cols="12" xs="12" md="4">
                  <validation-provider
                      v-slot="{ errors }"
                      :name="'topic'"
                      :vid="'topic'"
                      rules="required"
                  >
                    <v-text-field
                        v-model="form.course_name"
                        label="Topic"
                        :error-messages="errors"
                        dense
                        outlined
                        auto-grow
                        no-resize
                    ></v-text-field>
                  </validation-provider>
                </v-col>
                <v-col cols="12" xs="12" md="4">
                  <validation-provider
                      v-slot="{ errors }"
                      :name="'classes'"
                      :vid="'classes'"
                      rules="required"
                  >
                    <v-text-field
                        v-model="form.classes"
                        label="Classes"
                        :error-messages="errors"
                        dense
                        outlined
                        auto-grow
                        no-resize
                    ></v-text-field>
                  </validation-provider>
                </v-col>
              </v-row>
            </v-container>
          </v-sheet>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="primary"
              type="submit"
              :disabled="invalid"
              depressed
          >
            Update
          </v-btn>
          <v-btn class="mr-2 error darken-1 white--text" depressed @click="dialog=false">Close</v-btn>
        </v-card-actions>
        </v-form>
        </validation-observer>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
import moment from "moment-timezone";
import ReportHead from "@/components/report/ReportHead";
import {common as commonMixin} from "@/mixins/common";
import {mapGetters} from "vuex";
export default {
  name:'CourseSchedule',
  components:{ReportHead},
  mixins: [commonMixin],
  props:{
    selectedItem:{
      required:true,
      type:Object,
      default() {
        return {}
      }
    }
  },
  data(){
    return{
      moment,
      pageInfo: {
        pageName: 'Course Schedule',
        apiUrl: '/course-schedule/',
        permission: ''
      },
      dialog:false,
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      selected_item:{},
      form:{
        date:null,
        day:null,
        start_time:null,
        end_time:null,
        employee_id:null,
        course_name:null,
        classes:null,
      }
    }
  },
  computed: {
    ...mapGetters('admin/employee',['findEmployeeNameById','only_employees','subject_wise_employees']),
    ...mapGetters('admin/course',['days']),
  },
  methods:{
    updateModal(item){
      this.selected_item = item
      Object.keys(this.form).map((field)=>{
        this.form[field] = this.selected_item[field] ?? null;
      })
      this.dialog = true
    },
    async updateSchedule(){
      let formData = this.$generateFormData(this.form,true)
      await this.$axios.post(`/course-schedule/${this.selected_item.id}`,formData).then((response)=>{
          this.$toaster.success('Update successfully')
          this.dialog =false
          this.$emit('closeSchedule')
      }).catch((error)=>{
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
}
</script>

