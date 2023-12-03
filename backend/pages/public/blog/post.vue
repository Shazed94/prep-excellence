<template>
  <v-container fluid>
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: `Blogs`,disabled: true, href: '#'},{text: `List`,disabled: true, href: '#'}]"
    />
    <v-card>
      <v-data-table
        dense
        v-model="selected"
        item-key="id"
        show-select
        :headers="headers"
        :items="blogs"
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
                          <v-col cols="12" md="6">
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
                          <v-col cols="12" md="6">
                            <validation-provider v-slot="{ errors }" name="category_id" vid="category_id" rules="required">
                              <v-select
                                v-model="form.category_id"
                                :items="blog_categories"
                                :error-messages="errors"
                                item-text="title"
                                item-value="id"
                                label="Category"
                                dense
                                clearable
                                hide-details="auto"
                                outlined></v-select>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" md="6">
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
                          <v-col cols="12" md="6">
                            <validation-provider v-slot="{ errors }"
                                                 name="author"
                                                 vid="author" rules="required">
                              <v-select
                                v-model="form.user_id"
                                :items="users"
                                :error-messages="errors"
                                item-text="name"
                                item-value="id"
                                label="Author"
                                dense
                                clearable
                                hide-details="auto"
                                outlined></v-select>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" md="12">
                            <validation-provider
                              v-slot="{ errors }"
                              name="Short Description"
                              vid="short_description"
                              rules=""
                            >
                              <v-textarea
                                v-model="form.short_description"
                                clear-icon="mdi-close-circle"
                                label="Short Description"
                                :error-messages="errors"
                                dense
                                outlined
                                counter
                                rows="3"
                                auto-grow
                                no-resize
                              ></v-textarea>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" md="12">
                            <label>Description</label>
                            <validation-provider
                              v-slot="{ errors }"
                              name="Description"
                              vid="description"
                              rules="required"
                            >
                              <client-only placeholder="loading...">
                                <ckeditor-nuxt v-model="form.description" :error-messages="errors" :config="editorConfig"  />
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
        <template v-slot:item.status="{ index, item }">
          <v-switch v-if="$can('status change',pageInfo.permission)"
                    class="pa-0 ma-0"
                    hide-details
                    :value="true"
                    :input-value="item.status"
                    @change="toggleStatusChange(index, $event !== null, $event, item.id, state.name, state.store_name,'status')">
          </v-switch>
        </template>
        <template v-slot:item.comment="{ index, item}">
          <v-badge bordered overlap :content="commentCount(item)">
            <v-btn x-small class="mr-1 accent" fab @click="openBlogModal(item)" v-if="$can('edit',pageInfo.permission)">
              <v-icon>mdi-comment-text-multiple-outline</v-icon>
            </v-btn>
          </v-badge>
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
    <v-dialog v-model="dialog2" persistent max-width="1300">
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
              <v-card-subtitle class="text-center"><b>{{  'Blog Comments' }}</b></v-card-subtitle>
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                  <tr>
                    <th class="text-left">
                      Date
                    </th>
                    <th class="text-left">
                      Name
                    </th>
                    <th class="text-left">
                      Email
                    </th>
                    <th class="text-left">
                      Comment
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
                    v-for="(item,key ) in selectedItem.blogComments"
                    :key="key"
                  >
                    <td>{{ moment(item.created_at).format('MMMM Do YYYY, h:mm:ss a') }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.email }}</td>
                    <td>{{ item.comment }}</td>
                    <td>{{ item.status }}</td>
                    <td>
                      <v-tooltip bottom v-if="item.status !== 'Approved' ">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn x-small class="mr-1 mb-1 success" @click="approveOrCancel(item.id,'Approved')" color="green" v-bind="attrs"
                                 v-on="on" fab>
                            <v-icon>mdi-check-decagram</v-icon>
                          </v-btn>
                        </template>
                        <span>Approve</span>
                      </v-tooltip>
                      <v-tooltip bottom v-if="item.status !== 'Canceled' ">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn x-small class="mr-1 mb-1 danger" @click="approveOrCancel(item.id,'Canceled')" color="red" v-bind="attrs"
                                 v-on="on" fab>
                            <v-icon>mdi-cancel</v-icon>
                          </v-btn>
                        </template>
                        <span>Cancel</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn x-small class="mr-1 mb-1 danger" @click="removeComment(item.id)" color="red" v-bind="attrs"
                                 v-on="on" fab>
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </template>
                        <span>Remove</span>
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
          <v-btn class="mr-2 error darken-1 white--text" depressed @click="closeModal2()">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import ExportExcel from '@/components/common/ExportExcel'
import ExportCsv from '@/components/common/ExportCsv'
import ExportPdf from '@/components/common/ExportPdf'
import BreadCrumbs from "../../../components/common/BreadCrumbs";
import FormImagePreview from '@/components/form/formImagePreview';
import {common as commonMixin} from "@/mixins/common";
import moment from "moment-timezone";
import {mapGetters} from "vuex";
const permission = 'Blog'
const stateName = 'blogs'
const storeName='public/blog'
export default {
  name: 'blog',
  head: {
    title: 'Blogs',
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
    subject: permission
  },
  components: {BreadCrumbs, ExportPdf, ExportCsv, ExportExcel,
    FormImagePreview, 'ckeditor-nuxt': () => { if (process.client) { return import('@blowstack/ckeditor-nuxt') } },
  },
  mixins: [commonMixin],
  data() {
    return {
      pageInfo: {
        pageName: 'Blog',
        apiUrl: '/blog/',
        permission
      },
      state: {
        name: stateName,
        store_name: storeName,
      },
      moment,
      selected: [],
      options: {},
      selectedItem: {},
      dialog: false,
      dialog2: false,
      editIndex: -1,
      editMode:false,
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      image: null,
      form: {
        type:1,
        image:null,
        video:null,
        embedded_code:null,
        title: null,
        user_id: null,
        short_description: null,
        description: null,
        category_id: null,
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
          text: 'Title',
          align: 'start',
          value: 'title'
        },
        {
          text: 'Author',
          align: 'start',
          value: 'user.name'
        },
        {
          text: 'Comments',
          align: 'start',
          value: 'comment'
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
      },
      users:[],
      editorConfig: {
        simpleUpload: {
          uploadUrl: this.$config.apiUrl+'/ckeditor/upload/file',
          headers: {
            'Authorization': this.$auth.strategy.token.get()
          }
        },
        removePlugins: ['Title'],
      },
    }
  },
  computed: {
    ...mapGetters('public/blog',['blogs','totalItems']),
    ...mapGetters('public/category',['blog_categories']),
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
    const payload1 = {apiUrl: '/category/', stateName: 'categories'}
    if (!this.blog_categories.length ) this.$store.dispatch('public/category/getItems', payload1)
    this.getAllEmployee()
  },
  methods: {
    commentCount(item){
      if(item.blogComments && item.blogComments.length) {
        return item.blogComments.filter(item=>item.status === 'Pending').length;
      }
      return '0';
    },
    removeImage($emit, formElementName) {
      if (!formElementName) return
      if ($emit && (this.form[formElementName] && this.form[formElementName].length > 1))
        $emit ? this.form[formElementName].splice($emit, 1) : this.form[formElementName] = null
      else this.form[formElementName] = null
    },
    async getAllEmployee(){
      await this.$axios.get('/all/authors').then((response)=>{
          this.users = response.data.data;
      }).catch(()=>{
        this.users=[]
      })
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
    createOrUpdate(item = null) {
      if (item) {
        this.editIndex = this.blogs.indexOf(item)
        this.editMode=true;
      }
      else {
        this.editIndex = -1
        this.editMode=false;
      }

      if (this.editMode) {
        this.selectedItem = item
        Object.keys(this.form).map((field) => {
          this.form[field]=this.selectedItem[field]??null;
        });
        this.image=this.selectedItem.image;
      } else {
        this.selectedItem = {}
        Object.keys(this.form).map((field) => {
          this.form[field]=null;
        });
        this.form.type=1;
      }
      this.form.image=null;
      this.form.video=null;
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
    },
    openBlogModal(item) {
      this.selectedItem=item
      this.dialog2 = true
    },
    closeModal2() {
      this.selectedItem = {}
      this.dialog2 = false
      this.init()
    },
    async removeComment(id){
      await this.$axios.delete(`/blog-comment/${id}`).then((response) => {
        this.$toaster.success('removed successfully');
        this.closeModal2()
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
    async approveOrCancel(id,status){
      await this.$axios.put(`/blog-comment/status/change/${id}/${status}`).then((response) => {
        this.$toaster.success('status change successfully');
        this.closeModal2()
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
  }
}
</script>
