<template>
  <v-container fluid>
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: `Settings`,disabled: true, href: '#'},{text: `${pageInfo.pageName}`,disabled: true, href: '#'}]"
    />
    <v-card>
      <v-data-table
        dense
        v-model="selected"
        item-key="id"
        show-select
        :headers="headers"
        :items="widgets"
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
                <v-btn v-if="$can('create','Widgets')"
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
                            <validation-provider v-slot="{ errors }" name="type" vid="type" rules="required">
                              <v-select
                                v-model="form.type"
                                :items="widget_types"
                                :error-messages="errors"
                                item-text="name"
                                item-value="id"
                                label="Type"
                                dense
                                clearable
                                hide-details="auto"
                                outlined></v-select>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="4">
                            <validation-provider
                              v-slot="{ errors }"
                              name="position"
                              vid="position"
                              rules="required|numeric"
                            >
                              <v-text-field
                                v-model="form.position"
                                clear-icon="mdi-close-circle"
                                label="Position"
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" xs="12" sm="4" v-if="form.type===2">
                            <validation-provider v-slot="{ errors }" name="p_menu_id" vid="menu" rules="required">
                              <v-select
                                v-model="form.p_menu_id"
                                :items="p_menus"
                                :error-messages="errors"
                                item-text="name"
                                item-value="id"
                                label="Menu"
                                dense
                                clearable
                                hide-details="auto"
                                outlined></v-select>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12">
                            <validation-provider
                              v-slot="{ errors }"
                              name="Title"
                              vid="title"
                              rules="required"
                            >
                              <v-text-field
                                v-model="form.title"
                                clear-icon="mdi-close-circle"
                                label="Title"
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12" v-if="form.type===1">
                            <label>Text</label>
                            <validation-provider
                              v-slot="{ errors }"
                              name="text"
                              vid="text"
                              rules="required"
                            >
                              <client-only placeholder="loading...">
                                <ckeditor-nuxt v-model="form.text" :error-messages="errors" :config="editorConfig"  />
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
        <template v-slot:item.type="{ index, item }">
          {{ item.type==1?'Text':'Menu' }}
        </template>
        <template v-slot:item.status="{ index, item }">
          <v-switch v-if="$can('status change',pageInfo.permission)"
                    class="pa-0 ma-0"
                    hide-details
                    :value="true"
                    :input-value="item.status"
                    @change="toggleStatusChange(index, $event !== null, $event, item.id, state.name, state.store_name,'status')">
          </v-switch>
        </template>
        <template v-slot:item.actions="{index, item }">
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
import BreadCrumbs from "../../../components/common/BreadCrumbs";
import FormImagePreview from '@/components/form/formImagePreview';
import {common as commonMixin} from "@/mixins/common";
import {mapGetters} from "vuex";
const permission = 'Widgets'
const stateName = 'widgets'
const storeName='public/settings/widget'
export default {
  name: 'widget',
  head: {
    title: 'Widgets',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'Prepexcellence'
      }
    ],
  },
  meta:{
    action: 'read',
    subject: 'Widgets'
  },
  components: {BreadCrumbs, ExportPdf, ExportCsv, ExportExcel,
    FormImagePreview,
    'ckeditor-nuxt': () => { if (process.client) { return import('@blowstack/ckeditor-nuxt') } },
  },
  mixins: [commonMixin],
  data() {
    return {
      pageInfo: {
        pageName: 'Footer Widget',
        apiUrl: '/widget/',
        permission: permission
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
      form: {
        title: '',
        placement: '',
        type: null,
        text: '',
        position: 1000,
        p_menu_id: null,
      },
      search: '',
      timeout: null,
      headers: [
        {
          text: 'Position',
          align: 'start',
          value: 'position'
        },
        {
          text: 'Title',
          align: 'start',
          value: 'title'
        },
        {
          text: 'Widget Type',
          align: 'start',
          value: 'type'
        },
        {
          text: 'Status',
          align: 'start',
          value: 'status'
        },
        {text: 'Actions', value: 'actions', sortable: false}
      ],
      editorConfig: {
        simpleUpload: {
          uploadUrl: this.$config.apiUrl+'/ckeditor/upload/file',
          headers: {
            'Authorization': this.$auth.strategy.token.get()
          }
        },
        removePlugins: ['Title'],
      },
      footerProps: {
        itemsPerPageOptions: [20, 50, 100, 500]
      }
    }
  },
  computed: {
    ...mapGetters('public/settings/widget',['widgets','totalItems','widget_types']),
    ...mapGetters('public/settings/menu',['p_menus']),
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
      /*await this.$axios.get(url).then((response) => {
        this.items = response.data.data
        this.totalItems = response.data.meta.total
      })*/
      const payload = {apiUrl: url, stateName}
      await this.$store.dispatch(storeName+'/getItems', payload)
      this.loader.isLoading = false
    },
    createOrUpdate(item = null) {
      if (item) {
        this.editIndex = this.widgets.indexOf(item)
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
          Object.keys(error.response.data).map((field) => {
            this.$toaster.error(error.response.data[field][0]);
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
