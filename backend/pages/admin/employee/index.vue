<template>
  <v-container fluid>
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: 'Employee',disabled: true, href: '/admin/employee'}]"
    />
    <v-card>
      <v-data-table
        dense
        v-model="selected"
        item-key="id"
        show-select
        :headers="headers"
        :items="employees"
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
            <v-btn v-if="$can('create',pageInfo.permission)"
                   style="background: #01579B"
                   class="mx-2 white--text"
                   icon
                   small
                   to="/admin/employee/add"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-toolbar>
        </template>
        <template v-slot:item.index="{ index, item }">
          {{ index+1 }}
        </template>
        <template v-slot:item.created_at="{ index, item }">
          {{ moment(item.created_at).format('MM-DD-YYYY') }}
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
<!--          <v-btn x-small class="mr-1 accent" fab  v-if="$can('read','Auth')">
            <v-icon>mdi-eye</v-icon>
          </v-btn>-->
          <v-btn x-small class="mr-1 accent" fab :to="`/admin/employee/${item.id}/edit`"  v-if="$can('edit',pageInfo.permission)">
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
import BreadCrumbs from "@/components/common/BreadCrumbs";
import FormImagePreview from '@/components/form/formImagePreview';
import {common as commonMixin} from "@/mixins/common";
import {mapGetters} from "vuex";
import moment from "moment-timezone";
const permission = 'Employees'
const stateName = 'employees'
const storeName='admin/employee'
export default {
  name: 'employee',
  head: {
    title: 'Employees',
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
    subject: 'Employees'
  },
  components: {BreadCrumbs, ExportPdf, ExportCsv, ExportExcel, FormImagePreview},
  mixins: [commonMixin],
  data() {
    return {
      pageInfo: {
        pageName: 'Employee Manage',
        apiUrl: '/employee/',
        permission
      },
      state: {
        name: stateName,
        store_name: storeName,
      },
      moment,
      selected: [],
      options: {},
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
          value: 'index'
        },
        {
          text: 'Employee Id',
          align: 'start',
          value: 'employee_id'
        },
        {
          text: 'Role',
          align: 'start',
          value: 'userable.role.name'
        },
        {
          text: 'Name',
          align: 'start',
          value: 'userable.name'
        },
        {
          text: 'Email',
          align: 'start',
          value: 'userable.email'
        },
        {
          text: 'designation',
          align: 'start',
          value: 'designation.name'
        },
        /*{
          text: 'Gender',
          align: 'start',
          value: 'userable.gender.name'
        },*/
        {
          text: 'Hour Rate',
          align: 'start',
          value: 'hour_rate'
        },
        /*{
          text: 'Father Name',
          align: 'start',
          value: 'father_name'
        },
        {
          text: 'Mother Name',
          align: 'start',
          value: 'mother_name'
        },*/
        {
          text: 'Created At',
          align: 'start',
          value: 'created_at'
        },
        {
          text: 'Status',
          align: 'start',
          value: 'status'
        },
        {text: 'Actions', value: 'actions', sortable: false}
      ],
      footerProps: {
        itemsPerPageOptions: [10,20, 50, 100, 500]
      }
    }
  },
  computed: {
    ...mapGetters('admin/employee',['employees','totalItems']),
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
  mounted() {
    this.init();
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
  }
}
</script>
