<template>
  <v-card>
    <v-card-text>
      <v-sheet style="margin:10px;">
        <v-container>
<!--          <report-head></report-head>-->
          <v-card-subtitle class="text-center"><b>{{ 'Employee Schedule' }}</b></v-card-subtitle>
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
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item,key ) in schedules"
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
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-container>
      </v-sheet>
    </v-card-text>
<!--    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn class="mr-2 error darken-1 white&#45;&#45;text" depressed @click="$emit('closeEmpSchedule')">Close</v-btn>
    </v-card-actions>-->
  </v-card>
</template>

<script>
import moment from "moment-timezone";
import ReportHead from "@/components/report/ReportHead";
import {mapGetters} from "vuex";
export default {
  name:'EmployeeSchedule',
  components:{ReportHead},
  props:{
    start_date:{
      required:true,
      default() {
        return null
      }
    },
    end_date:{
      required:true,
      default() {
        return null
      }
    },
    employee_ids:{
      required:true,
      type:Array,
      default() {
        return []
      }
    }
  },
  data(){
    return{
      moment,
      schedules:[],
    }
  },
  computed: {
    ...mapGetters('admin/employee',['findEmployeeNameById']),
  },
  watch:{
    start_date(){
      this.getSchedule()
    },
    end_date(){
      this.getSchedule()
    },
    employee_ids(){
      this.getSchedule()
    },
  },
  mounted() {
    this.getSchedule()
  },
  methods:{
    async getSchedule(){
      if (this.start_date && this.end_date && this.employee_ids && this.employee_ids.length){
        let formData=new FormData()
        formData.append('start_date',this.start_date)
        formData.append('end_date',this.end_date)
        for (let i=0; i<this.employee_ids.length; i++) formData.append('employee_ids['+i+']',this.employee_ids[i])
        await this.$axios.post('/course-schedule/get/by/date/and/employee', formData).then((response) => {
            this.schedules =response.data.data
        }).catch(() => {
            this.schedules=[]
        })
      }
    }
  }
}
</script>

