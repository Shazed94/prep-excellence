<template>
  <v-container fluid>
    <bread-crumbs
      :page-title="`${pageInfo.pageName}`"
      :items="[{text: `${pageInfo.pageName}`,disabled: true, href: '/public/homepage/slider'}]"
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
                  <v-col cols="12" sm="12">
                    <validation-provider
                      v-slot="{ errors }"
                      name="Title"
                      vid="title"
                      rules="required"
                    >
                      <v-text-field
                        v-model="form.text_1"
                        clear-icon="mdi-close-circle"
                        label="Title 1"
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
                      name="Title"
                      vid="title"
                      rules=""
                    >
                      <v-text-field
                        v-model="form.text_2"
                        clear-icon="mdi-close-circle"
                        label="Title 2"
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
                      name="Button 1 Text"
                      vid="button_1_text"
                      rules=""
                    >
                      <v-text-field
                        v-model="form.button_1_text"
                        clear-icon="mdi-close-circle"
                        label="Button 1 Text"
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
                      name="Button 1 URL"
                      vid="button_1_url"
                      rules=""
                    >
                      <v-text-field
                        v-model="form.button_1_url"
                        clear-icon="mdi-close-circle"
                        label="Button 1 URL"
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
                      name="Button 2 Text"
                      vid="button_2_text"
                      rules=""
                    >
                      <v-text-field
                        v-model="form.button_2_text"
                        clear-icon="mdi-close-circle"
                        label="Button 2 Text"
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
                      name="Button 2 URL"
                      vid="button_2_url"
                      rules=""
                    >
                      <v-text-field
                        v-model="form.button_2_url"
                        clear-icon="mdi-close-circle"
                        label="Button 2 URL"
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
                      name="description"
                      vid="description"
                      rules=""
                    >
                      <v-textarea
                        v-model="form.description"
                        clear-icon="mdi-close-circle"
                        label="Text"
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
                  <v-col cols="12" sm="12">
                    <validation-provider
                      v-slot="{ errors }"
                      name="slider_type"
                      vid="slider_type"
                      rules="required"
                    >
                      <v-radio-group
                        v-model.number="form.slider_type"
                        row
                        label="Slider Type"
                        :error-messages="errors"
                      >
                        <v-radio
                          label="Image"
                          value="1"
                        ></v-radio>
                        <v-radio
                          label="Video"
                          value="2"
                        ></v-radio>
                        <v-radio
                          label="Script"
                          value="3"
                        ></v-radio>
                      </v-radio-group>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" sm="4" v-if="form.slider_type === 1">
                    <form-image-preview
                      :existingImages="image"
                      :image-props="form.image"
                      @removeImage="removeImage($emit, 'image')"
                    />
                    <validation-provider
                      v-slot="{ errors }"
                      name="image"
                      vid="image"
                      :rules="editMode ? '' : 'required'"
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
                  <v-col cols="12" sm="4" v-if="form.slider_type === 2">
                    <validation-provider
                      v-slot="{ errors }"
                      name="video"
                      vid="video"
                      :rules="editMode ? '' : 'required'"
                    >
                      <v-file-input
                        v-model="form.video"
                        label="Video"
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
                  <v-col cols="12" sm="12" v-if="form.slider_type === 3">
                    <validation-provider
                      v-slot="{ errors }"
                      name="script"
                      vid="script"
                      rules="required"
                    >
                      <v-textarea
                        v-model="form.slider_script"
                        clear-icon="mdi-close-circle"
                        label="Script"
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
                          v-text="item.text_1"
                        ></v-card-title>

<!--
                        <v-card-subtitle v-text="item.text_1"></v-card-subtitle>
-->
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
const permission = 'Slider'
const stateName = 'sliders'
const storeName='public/slider'
export default {
  name: 'slider',
  head: {
    title: 'Promotion',
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
    subject: 'Slider'
  },
  components: {BreadCrumbs, ExportPdf, ExportCsv, ExportExcel, FormImagePreview,Container, Draggable},
  mixins: [commonMixin],
  data() {
    return {
      items: [],
      pageInfo: {
        pageName: 'Slider',
        apiUrl: '/slider/',
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
      image:null,
      video:null,
      form: {
        text_1: '',
        text_2: '',
        button_1_text: '',
        button_1_url: '',
        button_2_text: '',
        button_2_url: '',
        description: '',
        slider_type: 1,
        image: null,
        video: null,
        slider_script: null,
      },
      search: '',
      timeout: null,
    }
  },
  computed: {
      ...mapGetters('public/slider',['sliders'])
  },
  watch: {
    sliders(){
      this.items = this.sliders;
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    onDrop (dropResult) {
      //console.log(dropResult);
      this.items = this.applyDrag(this.items, dropResult)
    },
    removeImage($emit, formElementName) {
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
        this.editIndex = this.sliders.indexOf(item)
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
        this.form.video=null;
        this.image=this.selectedItem.image;
        this.video=this.selectedItem.video;
      } else {
        this.selectedItem = {}
        Object.keys(this.form).map((field) => {
          this.form[field]=null;
        });
        this.form.slider_type=1;
      }
      this.dialog = true
    },
    async updatePosition(){
      let ids = this.items.map(item=>item.id);
      let data =new FormData();
      for (let i=0; i < ids.length; i++)
        data.append('ids[]',ids[i]);
      await this.$axios.post('slider/position/update', data).then((response) => {
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
        if (error.response.data.status === 422) {
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
      this.form.slider_type=1;
    }
  }
}
</script>
