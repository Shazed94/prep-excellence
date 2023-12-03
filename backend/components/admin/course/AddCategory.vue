<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="500"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="green"
        dark
        x-small
        fab
        v-bind="attrs"
        v-on="on"
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
</template>

<script>
import {common as commonMixin} from "@/mixins/common";
const stateName = 'course_categories'
const storeName='admin/courseCategory'

export default {
  name: "AddSubject",
  mixins: [commonMixin],
  data() {
    return {
      dialog: false,
      editIndex: -1,
      editMode:false,
      pageInfo: {
        pageName: 'Course Category',
        apiUrl: '/course-category/',
      },
      state: {
        name: stateName,
        store_name: storeName,
      },
      image:null,
      form: {
        name: '',
        image:null,
        description: '',
      },
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
    }
  },
  methods: {
    removeImage($emit, formElementName) {
      if (!formElementName) return
      if ($emit && (this.form[formElementName] && this.form[formElementName].length > 1))
        $emit ? this.form[formElementName].splice($emit, 1) : this.form[formElementName] = null
      else this.form[formElementName] = null
    },
    createOrUpdate(item = null) {
      if (item) {
        this.editIndex = this.subjects.indexOf(item)
        this.editMode=true;
      }
      else {
        this.editIndex = -1
        this.editMode=false;
      }

      if (this.editMode) {
        this.selectedItem = item
        this.image=item.image
        this.form = {
          name: item.name,
          image: null,
          description: item.description,
        }
      } else {
        this.selectedItem = {}
        this.image=null
        this.form = {name: '', image:null, description:''}
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
          Object.keys(error.response.data.errors).map((field) => {
            this.$toaster.error(error.response.data.errors[field][0]);
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

<style scoped>
.d-flex {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
.text-center {
  text-align: center;
}
table {
  border-collapse: collapse;
}

@page {
  size: auto;
  margin: 0;
}
</style>
