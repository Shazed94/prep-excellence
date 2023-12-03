<template>
  <div class="d-flex flex-grow-1 flex-column">
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: 'Dashboard',disabled: true, href: '/'}]"
    />
    <client-only>
      <v-row v-if="$can('read','Admin')" dense  class="ma-2">
        <v-col cols="12" xs="12" sm="12" md="3"
        >
          <nuxt-link to="/admin/student/student">
            <v-card color="indigo" min-height="100px" class="pa-2 d-flex align-center justify-center">
              <div class="white--text text-center">
                <h1>
                  {{  report.total_student }}
                </h1>
                <h2>Student</h2>
              </div>
            </v-card>
          </nuxt-link>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="3" >
          <nuxt-link to="/admin/student/student">
            <v-card color="indigo" min-height="100px" class="pa-2 d-flex align-center justify-center">
              <div class="white--text text-center">
                <h1>{{  report.total_parent }}</h1>
                <h2>Parent</h2>
              </div>
            </v-card>
          </nuxt-link>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="3" >
          <nuxt-link to="/admin/employee">
            <v-card color="indigo" min-height="100px" class="pa-2 d-flex align-center justify-center">
              <div class="white--text text-center">
                <h1>{{  report.total_employee }}</h1>
                <h2>Employee</h2>
              </div>
            </v-card>
          </nuxt-link>
        </v-col>
        <v-col cols="12" xs="12" sm="12" md="3" >
          <nuxt-link to="/admin/course/course">
            <v-card color="indigo" min-height="100px" class="pa-2 d-flex align-center justify-center">
              <div class="white--text text-center">
                <h1>{{  report.total_course }}</h1>
                <h2>Course</h2>
              </div>
            </v-card>
          </nuxt-link>
        </v-col>
      </v-row>
      <employee-schedule v-if="$can('read','Employee')"/>
    </client-only>
  </div>
</template>

<script>
import BreadCrumbs from "@/components/common/BreadCrumbs";
import EmployeeSchedule from "@/components/employee/EmployeeSchedule";
const permission = 'Dashboard'
const stateName = 'departments'
const storeName='institute/department'

export default {
  name:'Dashboard',
  head: {
    title: 'Dashboard',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'Prepexcellence description'
      }
    ],
  },
  meta:{
    action: 'read',
    subject: 'Auth'
  },
  components: {
    EmployeeSchedule, BreadCrumbs
  },
  data() {
    return {
      pageInfo: {
        pageName: 'Dashboard',
        apiUrl: '/',
        permission: permission
      },
      loadingInterval: null,

      isLoading1: true,
      report: {},
    }
  },
  mounted() {
    let count = 0
    this.getReportReport()
    // DEMO delay for loading graphics
    this.loadingInterval = setInterval(() => {
      this[`isLoading${count++}`] = false
      if (count === 4) this.clear()
    }, 400)
  },
  beforeDestroy() {
    this.clear()
  },
  methods: {
    clear() {
      clearInterval(this.loadingInterval)
    },
    async getReportReport() {
      this.isLoading = true
      await this.$axios.get('/dashboard/report').then(response => {
        if (response.data.status === 'success') {
          this.report = response.data.data
        }
      }).catch(() => {
        this.$toaster.error('Something went wrong!!')
      }).finally(() => this.isLoading = false)
    },
  }
}
</script>
