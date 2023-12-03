<template>
  <v-container fluid>
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: 'Billing',disabled: false, href: '/admin/billing/workingHour'},{text: `${pageInfo.pageName}`,disabled: true, href: '/admin/billing/workingHour'}]"
    />
    <v-card>
      <v-data-table
        dense
        v-model="selected"
        item-key="id"
        show-select
        :headers="headers"
        :items="working_hours"
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
                <export-excel :url="`/export${pageInfo.exportUrl}?format=excel&ids=${selectedIds ? selectedIds : ''}`"
                              :file_name="pageInfo.exportUrl"/>
                <export-csv :url="`/export${pageInfo.exportUrl}?format=csv&ids=${selectedIds ? selectedIds : ''}`"
                            :file_name="pageInfo.pageName"/>
                <export-pdf :url="`/export${pageInfo.exportUrl}?format=pdf&ids=${selectedIds ? selectedIds : ''}`"
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
<!--            <v-dialog v-model="dialog" persistent max-width="500">
              <template v-slot:activator="{ on, attrs }">
                &lt;!&ndash;                color="primary"&ndash;&gt;
                <v-btn v-if="$can('read','Auth')"
                       style="background: #01579B"
                       class="mx-2 white&#45;&#45;text"
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
                          <v-col cols="12" sm="12">
                            <validation-provider
                              v-slot="{ errors }"
                              name="Question"
                              vid="question"
                              rules="required"
                            >
                              <v-text-field
                                v-model="form.name"
                                clearable
                                clear-icon="mdi-close-circle"
                                label="Name"
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" xs="12" sm="12">
                            <form-image-preview
                              :existingImages="image"
                              :image-props="form.image"
                              @removeImage="removeImage($emit, 'image')"
                            />
                            <validation-provider
                              v-slot="{ errors }"
                              name="image"
                              vid="image"
                              :rules="editMode?'':'required'"
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
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="green darken-1"
                        class="mx-2 white&#45;&#45;text"
                        type="submit"
                        :disabled="invalid"
                        :loading="loader.isSubmitting"
                        depressed
                      >
                        {{ editIndex > -1 ? 'Update' : 'Save' }}
                      </v-btn>
                      <v-btn class="mr-2 error darken-1 white&#45;&#45;text" depressed @click="closeModal">Close</v-btn>
                    </v-card-actions>
                  </v-form>
                </validation-observer>
              </v-card>
            </v-dialog>-->
          </v-toolbar>
        </template>
        <template v-slot:item.employee="{ index, item }">
          <template v-if="item.userable">
            <span>{{ item.userable.first_name+' '+item.userable.last_name  }}</span><br>
            <span>{{ item.userable.email }}</span><br>
            <span>{{ item.userable.phone_number }}</span><br>
          </template>
          <span>{{ item.employee_id }}</span>
        </template>
        <template v-slot:item.total_hour="{ index, item }">
          {{ item.regular_hour +  item.ot_hour}}
        </template>
        <template v-slot:item.due_hour="{ index, item }">
          <span style="color:red;">{{ item.regular_hour +  item.ot_hour - item.paid_hour}}</span>
        </template>

        <template v-slot:item.actions="{index, item }">
          <v-btn x-small class="mr-1 accent" fab v-if="$can('read','Auth')" :to="`/admin/billing/hourDetails/${item.id}`">
            <v-icon>mdi-eye</v-icon>
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
import {common as commonMixin} from "@/mixins/common";
import {mapGetters} from "vuex";
const permission = 'Working Hour'
const stateName = 'working_hours'
const storeName='admin/billing/workingHour'

export default {
  name: 'WorkingHour',
  head: {
    title: 'Working Hour',
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
    subject: 'Working Hour'
  },
  components: {BreadCrumbs, ExportPdf, ExportCsv, ExportExcel},
  mixins: [commonMixin],
  data() {
    return {
      pageInfo: {
        pageName: 'Working Hour',
        apiUrl: '/employee-working/employee/wise/',
        exportUrl: '/employee-working/',
        permission
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
      form: {
        name: '',
        image:null,
        description: '',
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
          text: 'Employee',
          align: 'start',
          value: 'employee'
        },
        {
          text: 'Regular Hour',
          align: 'start',
          value: 'regular_hour'
        },
        {
          text: 'OT Hour',
          align: 'start',
          value: 'ot_hour'
        },
        {
          text: 'Total Hour',
          align: 'start',
          value: 'total_hour'
        },
        {
          text: 'Paid Hour',
          align: 'start',
          value: 'paid_hour'
        },
        {
          text: 'Pending Hour',
          value: 'pending_hour'
        },
        {
          text: 'Due Hour',
          value: 'due_hour'
        },
        {text: 'Actions', value: 'actions', sortable: false}
      ],
      footerProps: {
        itemsPerPageOptions: [20, 50, 100, 500]
      }
    }
  },
  computed: {
    ...mapGetters('admin/billing/workingHour',['working_hours','totalItems']),
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
      await this.$store.dispatch(storeName+'/getItems2', payload)
      this.loader.isLoading = false
    },
  }
}
</script>
