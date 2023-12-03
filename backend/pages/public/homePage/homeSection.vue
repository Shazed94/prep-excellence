<template>
  <v-container fluid>
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: `${pageInfo.pageName}`,disabled: true, href: '/public/homepage/homeSection'}]"
    />
    <v-card>
      <v-row>
        <v-col cols="12" sm="8">
          <validation-observer ref="observer" v-slot="{ invalid }">
          <v-form ref="form" @submit.prevent="submitData()">
            <v-card-title class="text-h5"> {{ editIndex > -1 ? 'Update ' : 'Create' }} {{ pageInfo.pageName | capitalize }}</v-card-title>
            <v-card-text>
              <v-container>
                <v-row dense>
                  <v-col cols="12" sm="7">
                    <v-row dense>
                      <v-col cols="12" sm="12">
                        <validation-provider
                          v-slot="{ errors }"
                          name="Section Name"
                          vid="Section Name"
                          rules="required"
                        >
                          <v-text-field
                            v-model="form.section_name"
                            clear-icon="mdi-close-circle"
                            label="Section Name"
                            :error-messages="errors"
                            dense
                            outlined
                            auto-grow
                            no-resize
                          ></v-text-field>
                        </validation-provider>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <validation-provider
                          v-slot="{ errors }"
                          name="display section title"
                          vid="section_name_is_show"
                          rules="required"
                        >
                          <v-select
                            v-model="form.section_name_is_show"
                            :items="display_items"
                            item-text="name"
                            item-value="id"
                            label="Display section title"
                            :error-messages="errors"
                            dense
                            outlined
                            persistent-hint
                            small-chips
                          ></v-select>
                        </validation-provider>
                      </v-col>
                      <v-col cols="12" sm="4">
                        <validation-provider
                          v-slot="{ errors }"
                          name="background type"
                          vid="bg_type"
                          rules="required"
                        >
                          <v-select
                            v-model="form.bg_type"
                            :items="bg_types"
                            item-text="name"
                            item-value="id"
                            label="Background Type"
                            :error-messages="errors"
                            dense
                            outlined
                            persistent-hint
                            small-chips
                          ></v-select>
                        </validation-provider>
                      </v-col>
                      <v-col cols="12" sm="4" v-if="form.bg_type==1">
                        <validation-provider
                          v-slot="{ errors }"
                          name="background color"
                          vid="bg_color"
                          rules="required"
                        >
                          <v-text-field
                            v-model="form.bg_color"
                            clear-icon="mdi-close-circle"
                            label="Background Color"
                            :error-messages="errors"
                            dense
                            outlined
                            auto-grow
                            no-resize
                            type="color"
                          ></v-text-field>
                        </validation-provider>
                      </v-col>
                      <v-col cols="12" sm="12">
                        <validation-provider
                          v-slot="{ errors }"
                          name="Design Type"
                          vid="section_design_type_id"
                          rules="required"
                        >
                          <v-select
                            v-model="form.section_design_type_id"
                            :items="section_design_types"
                            item-text="name"
                            item-value="id"
                            label="Design Type"
                            :error-messages="errors"
                            dense
                            outlined
                            persistent-hint
                            small-chips
                          ></v-select>
                        </validation-provider>
                      </v-col>

                      <template v-if="!optional_designs.includes(parseInt(form.section_design_type_id))">
                        <v-col cols="12" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            name="Title"
                            vid="Title"
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
                        <v-col cols="12" sm="12">
                          <validation-provider
                            v-slot="{ errors }"
                            name="Sub Title"
                            vid="Sub Title"
                            rules=""
                          >
                            <v-text-field
                              v-model="form.sub_title"
                              clear-icon="mdi-close-circle"
                              label="Sub Title"
                              :error-messages="errors"
                              dense
                              outlined
                              auto-grow
                              no-resize
                            ></v-text-field>
                          </validation-provider>
                        </v-col>

                        <v-col cols="12" sm="4">
                          <validation-provider
                            v-slot="{ errors }"
                            name="Text Align"
                            vid="text_align"
                            rules="required"
                          >
                            <v-select
                              v-model="form.text_align"
                              :items="text_aligns"
                              item-text="name"
                              item-value="id"
                              label="Text Align"
                              :error-messages="errors"
                              dense
                              hide-selected
                              outlined
                              persistent-hint
                              small-chips
                            ></v-select>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" sm="4">
                          <validation-provider
                            v-slot="{ errors }"
                            name="Button Name"
                            vid="button_name"
                            rules=""
                          >
                            <v-text-field
                              v-model="form.button_name"
                              clear-icon="mdi-close-circle"
                              label="Button Name"
                              :error-messages="errors"
                              dense
                              outlined
                              auto-grow
                              no-resize
                            ></v-text-field>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" sm="4">
                          <validation-provider
                            v-slot="{ errors }"
                            name="Button  URL"
                            vid="button_url"
                            rules=""
                          >
                            <v-text-field
                              v-model="form.button_url"
                              clear-icon="mdi-close-circle"
                              label="Button URL"
                              :error-messages="errors"
                              dense
                              outlined
                              auto-grow
                              no-resize
                            ></v-text-field>
                          </validation-provider>
                        </v-col>
                      </template>
                      <template v-if="parseInt(form.section_design_type_id) === 6">
                        <v-col cols="12" sm="6">
                          <validation-provider
                            v-slot="{ errors }"
                            name="Button Name"
                            vid="button_name"
                            rules=""
                          >
                            <v-text-field
                              v-model="form.button_name"
                              clear-icon="mdi-close-circle"
                              label="Button Name"
                              :error-messages="errors"
                              dense
                              outlined
                              auto-grow
                              no-resize
                            ></v-text-field>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <validation-provider
                            v-slot="{ errors }"
                            name="Button  URL"
                            vid="button_url"
                            rules=""
                          >
                            <v-text-field
                              v-model="form.button_url"
                              clear-icon="mdi-close-circle"
                              label="Button URL"
                              :error-messages="errors"
                              dense
                              outlined
                              auto-grow
                              no-resize
                            ></v-text-field>
                          </validation-provider>
                        </v-col>
                      </template>
                      <template v-if="parseInt(form.section_design_type_id) ===2 ">
                        <v-col cols="12" sm="6">
                          <validation-provider
                            v-slot="{ errors }"
                            name="Number of Column"
                            vid="number_of_column"
                            rules=""
                          >
                            <v-select
                              v-model="form.col"
                              clear-icon="mdi-close-circle"
                              label="Number of Column"
                              :error-messages="errors"
                              :items="cols"
                              item-text="name"
                              item-value="id"
                              dense
                              outlined
                              auto-grow
                              no-resize
                            ></v-select>
                          </validation-provider>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <validation-provider
                            v-slot="{ errors }"
                            name="Number of row"
                            vid="number of row"
                            rules=""
                          >
                            <v-text-field
                              v-model="form.row"
                              clear-icon="mdi-close-circle"
                              label="Number of row"
                              :error-messages="errors"
                              dense
                              outlined
                              auto-grow
                              no-resize
                            ></v-text-field>
                          </validation-provider>
                        </v-col>
                      </template>

                    </v-row>
                  </v-col>
                  <v-col cols="12" sm="5">
                    <v-col cols="12" sm="12" v-if="!optional_designs.includes(parseInt(form.section_design_type_id))">
                      <form-image-preview
                        :existingImages="image"
                        :image-props="form.image"
                        @removeImage="removeImage($emit, 'image')"
                      />
                      <validation-provider
                        v-slot="{ errors }"
                        name="image"
                        vid="image"
                        :rules="editMode ? '' : ''"
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
                    <v-col cols="12" sm="12" v-if="form.bg_type==2">
                      <form-image-preview
                        :existingImages="bg_image"
                        :image-props="form.bg_image"
                        @removeImage="removeImage($emit, 'bg_image')"
                      />
                      <validation-provider
                        v-slot="{ errors }"
                        name="bg_image"
                        vid="bg_image"
                        :rules="editMode ? '' : ''"
                      >
                        <v-file-input
                          v-model="form.bg_image"
                          label="BG Image"
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
                  </v-col>
                  <template v-if="!optional_designs.includes(parseInt(form.section_design_type_id)) && parseInt(form.section_design_type_id) !== 4">
                    <v-col cols="12" sm="12">
                      <label>Short Description</label>
                      <validation-provider
                        v-slot="{ errors }"
                        name="short description"
                        vid="short_description"
                        rules=""
                      >
                        <VueEditor
                          v-model="form.short_description"
                          label="Short Description"
                          :error-messages="errors"
                          dense
                          outlined
                          counter
                          rows="3"
                          auto-grow
                          no-resize
                          placeholder="short description"/>
                      </validation-provider>
                    </v-col>
                    <v-col cols="12" sm="12">
                      <label>Description</label>
                      <validation-provider
                        v-slot="{ errors }"
                        name="description"
                        vid="description"
                        rules=""
                      >
                        <VueEditor
                          v-model="form.description"
                          label="Description"
                          :error-messages="errors"
                          dense
                          outlined
                          counter
                          rows="3"
                          auto-grow
                          no-resize placeholder="description"/>
                      </validation-provider>
                    </v-col>
                  </template>

                </v-row>

              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn v-if="$can('create',pageInfo.permission)"
                color="green darken-1"
                class="mx-2 white--text"
                type="submit"
                :disabled="invalid"
                :loading="loader.isSubmitting"
                depressed
              >
                {{ editIndex > -1 ? 'Update' : 'Save' }}
              </v-btn>
              <v-btn
                color="red darken-1"
                class="mx-2 white--text"
                type="button"
                @click="clear()"
                depressed
              >
                {{ 'Clear' }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </validation-observer>
        </v-col>
        <v-col cols="12" sm="4">
          <div class="simple-page mt-8">
            <Container @drop="onDrop" drag-handle-selector=".column-drag-handle">
              <Draggable v-for="(item,key) in items" :key="item.id">
                <div class="draggable-item bg-amber-300">
                  <v-card color="rgba(56,95,115,.60)" class="mt-1">
                    <span class="column-drag-handle" style="float:left; padding:0 10px; cursor: pointer">&#x2630;</span>
                    <div class="d-flex flex-no-wrap justify-space-between">
                      <div>
                        <v-card-title
                          class="text-h5"
                          v-text="item.section_name"
                        ></v-card-title>
                        <v-card-subtitle v-text="item.title"></v-card-subtitle>
                        <v-card-actions>
                          <v-btn
                            class="ml-2 mt-3"
                            fab
                            icon
                            outlined
                            rounded
                            small
                            right @click="createOrUpdate(item)" v-if="$can('edit',pageInfo.permission)"
                          >
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>

                          <v-btn
                            class="ml-1 mt-3"
                            icon
                            outlined
                            rounded
                            small @click="deleteItem(item, key, state.store_name)" v-if="$can('remove',pageInfo.permission)"
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </v-card-actions>
                      </div>

                      <v-avatar
                        class="ma-3"
                        size="125"
                        tile
                      >
                        <v-img :src="item.image"></v-img>
                      </v-avatar>
                    </div>
                  </v-card>

                </div>
              </Draggable>
            </Container>
            <v-btn v-if="items.length" class="mr-2 mt-2 success darken-1 white--text" depressed @click="updatePosition()">Update Position</v-btn>
          </div>
        </v-col>
      </v-row>
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
import { Container, Draggable } from 'vue-smooth-dnd'
import {mapGetters} from "vuex";
const permission = 'Home Section'
const stateName = 'home_sections'
const storeName='public/home_section'
export default {
  name: 'homeSection',
  head: {
    title: 'Home Section',
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
    subject: 'Home Section'
  },
  components: {BreadCrumbs, ExportPdf, ExportCsv, ExportExcel, FormImagePreview,Container, Draggable},
  mixins: [commonMixin],
  data() {
    return {
      items: [],
      pageInfo: {
        pageName: 'Home Section',
        apiUrl: '/home-section/',
        permission: permission
      },
      state: {
        name: stateName,
        store_name: storeName,
      },
      optional_designs:[2,3,6,7,8,9,10],
      display_items:[
        {id:1, name:'Yes'},
        {id:0, name:'No'},
      ],
      bg_types:[
        {id:1, name:'Color'},
        {id:2, name:'Image'},
      ],
      text_aligns:[
        {id:1, name:'Left'},
        {id:2, name:'Right'},
      ],
      cols:[
        {id:3, name:'3'},
        {id:4, name:'4'},
      ],
      selected: [],
      options: {},
      dialog: false,
      editIndex: -1,
      editMode:false,
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      image:null,
      bg_image:null,
      video:null,
      form: {
        section_name:'',
        bg_type:1,
        section_name_is_show:1,
        bg_color:null,
        section_design_type_id:null,
        title:'',
        sub_title:'',
        text_align:1,
        col:3,
        row:1,
        button_name: '',
        button_url: '',
        short_description: '',
        description: '',
        image: null,
        bg_image: null,
        type: 1,
      },
      search: '',
      timeout: null,
    }
  },
  computed: {
      ...mapGetters('public/home_section',['home_sections','section_design_types'])
  },
  watch: {
    home_sections(){
      this.items = this.home_sections;
    }
  },
  async mounted() {
    await this.init();
    const payload1 = {apiUrl: '/section-design-type/', stateName: 'section_design_types'}
    if (!this.section_design_types.length ) await this.$store.dispatch('public/home_section/getItems', payload1)

  },
  methods: {
    onDrop (dropResult) {
      //console.log(dropResult);
      this.items = this.applyDrag(this.items, dropResult)
    },
    removeImage($emit, formElementName) {
      console.log(this);
      if (!formElementName) return
      if ($emit && (this.form[formElementName] && this.form[formElementName].length > 1))
        $emit ? this.form[formElementName].splice($emit, 1) : this.form[formElementName] = null
      else this.form[formElementName] = null
    },
    async init() {
      const payload = {apiUrl: this.pageInfo.apiUrl, stateName}
      await this.$store.dispatch(storeName+'/getItems', payload)
      this.loader.isLoading = false
    },
    createOrUpdate(item = null) {

      if (item) {
        this.editIndex = this.home_sections.indexOf(item)
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
        this.form.image=null;
        this.form.bg_image=null;
        this.image=this.selectedItem.image;
        this.bg_image=this.selectedItem.bg_image;
      } else {
        this.selectedItem = {}
        Object.keys(this.form).map((field) => {
          this.form[field]=null;
        });
      }
      this.form.type = 1
      this.dialog = true
    },
    async updatePosition(){
      let ids = this.items.map(item=>item.id);
      let data =new FormData();
      for (let i=0; i < ids.length; i++)
        data.append('ids[]',ids[i]);
      await this.$axios.post('home/section/position/update', data).then((response) => {
        this.$toaster.success(`${this.pageInfo.pageName} position updated successfully!!`)
        this.init();
      }).catch((error) => {
        if (error.response.status === 422) {
          Object.keys(error.response.data).map((field) => {
            this.$toaster.error(error.response.data[field][0]);
          });
        } else this.$toaster.error(error.response.data.message);
      }).finally(() => {
        this.loader.isSubmitting = false
      })
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
      this.form.type=1;
      this.form.short_description='';
      this.form.description='';
    }
  }
}
</script>
