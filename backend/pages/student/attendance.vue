<template>
  <v-container fluid>
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: 'Course',disabled: false, href: '/student/course'},{text: `${pageInfo.pageName}`,disabled: true, href: '/student/attendance'}]"
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
          </v-toolbar>
        </template>
        <template v-slot:item.sno="{ index, item }">
          {{ index +1 }}
        </template>
        <template v-slot:item.status="{ index, item }">
          {{ item.is_active?'Active':'Inactive'}}
        </template>
        <template v-slot:item.actions="{index, item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn x-small class="accent" v-bind="attrs"
                     v-on="on" fab @click="showAttendance(item)">
                <v-icon>mdi-eye</v-icon>
              </v-btn>
            </template>
            <span>View</span>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="dialog" persistent max-width="700"
              hide-overlay
              transition="dialog-bottom-transition">
        <v-card>
        <v-card-text>
          <div class="text-right">
            <v-btn
              ref="printBtn"
              v-print="`#printAttendance`"
              icon
            >
              <v-icon color="light-blue">mdi-printer</v-icon>
            </v-btn>
          </div>
          <v-sheet :id="`printAttendance`" style="margin:10px;">
            <v-container>
              <report-head></report-head>
              <v-card-subtitle class="text-center">{{  selectedItem.name +' '+ 'Attendance' }}</v-card-subtitle>
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                  <tr>
                    <th class="text-left">
                      Date
                    </th>
                    <th class="text-left">
                      Status
                    </th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr
                    v-for="(item,key ) in selectedItem.attendanceStudents"
                    :key="key"
                  >
                    <td>{{ item.date }}</td>
                    <td>
                      {{ item.attendanceStatus?item.attendanceStatus.name:'' }}
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
          <v-btn class="mr-2 error darken-1 white--text" depressed @click="dialog=false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import ExportExcel from '@/components/common/ExportExcel'
import ExportCsv from '@/components/common/ExportCsv'
import ExportPdf from '@/components/common/ExportPdf'
import BreadCrumbs from "~/components/common/BreadCrumbs";
import {common as commonMixin} from "@/mixins/common";
import ReportHead from "@/components/report/ReportHead";
const stateName = 'course_categories'
const storeName='admin/courseCategory'
export default {
  name: 'studentAttendance',
  components: {BreadCrumbs, ExportPdf, ExportCsv, ExportExcel, ReportHead},
  mixins: [commonMixin],
  data() {
    return {
      pageInfo: {
        pageName: 'Student Attendance',
      },
      selected: [],
      options: {},
      selectedItem: {},
      dialog: false,
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
          text: 'Course Name',
          align: 'start',
          value: 'name'
        },
        {
          text: 'Batch',
          align: 'start',
          value: 'batch'
        },
        {
          text: 'Status',
          value: 'status'
        },
        {
          text: 'Action',
          value: 'actions'
        },
      ],
      footerProps: {
        itemsPerPageOptions: [20, 50, 100, 500]
      },
      student_courses:[],
      totalItems:0,
    }
  },
  computed: {
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
    await this.init();
    this.loader.isLoading=false;
  },
  methods: {
    async init() {
      this.loader.isLoading = true
      let url = `/student/course/attendance?per_page=${this.options.itemsPerPage}&page=${this.options.page}`
      if (this.search.length > 3) {
        url += `&search=${this.search}`
      }
      this.$axios.get(url).then((response) => {
        this.student_courses=response.data.data;
        this.totalItems=response.data.meta.total;
      }).catch(() => {
        this.student_courses=[]
        this.totalItems=0
      })
      this.loader.isLoading = false
    },
    showAttendance(item){
      this.selectedItem =item
      this.dialog =true
    }
  }
}
</script>
