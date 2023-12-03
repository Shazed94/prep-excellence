<template>
  <v-card>
    <validation-observer ref="observer" v-slot="{ invalid }">
      <v-form ref="form" @submit.prevent="submit()">
        <v-card-title class="text-h5"> {{ 'New Schedule add form' | capitalize }}</v-card-title>
        <v-card-text>
          <v-container>
            <v-row dense>
              <v-col cols="12" xs="12" md="4">
                <validation-provider
                  v-slot="{ errors }"
                  :name="'date'"
                  :vid="'date'"
                  rules="required"
                >
                  <v-text-field
                    v-model="form.date"
                    :error-messages="errors"
                    label="Date"
                    type="date"
                    dense
                    outlined
                    auto-grow
                    no-resize
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="12" xs="12" md="4">
                <validation-provider
                  v-slot="{ errors }"
                  :name="'start time'"
                  :vid="'start time'"
                  rules="required"
                >
                  <v-text-field
                    v-model="form.start_time"
                    label="Start At"
                    type="time"
                    :error-messages="errors"
                    dense
                    outlined
                    auto-grow
                    no-resize
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="12" xs="12" md="4">
                <validation-provider
                  v-slot="{ errors }"
                  :name="'end time'"
                  :vid="'end time'"
                  rules="required"
                >
                  <v-text-field
                    v-model="form.end_time"
                    label="End At"
                    type="time"
                    :error-messages="errors"
                    dense
                    outlined
                    auto-grow
                    no-resize
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="12" xs="12" md="4">
                <validation-provider
                  v-slot="{ errors }"
                  :name="'classes'"
                  :vid="'classes'"
                  rules="required"
                >
                  <v-text-field
                    v-model="form.classes"
                    label="Class"
                    :error-messages="errors"
                    dense
                    outlined
                    auto-grow
                    no-resize
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="12" xs="12" md="4">
                <validation-provider
                  v-slot="{ errors }"
                  :name="'topic'"
                  :vid="'topic'"
                  rules="required"
                >
                  <v-text-field
                    v-model="form.course_name"
                    label="Topic"
                    :error-messages="errors"
                    dense
                    outlined
                    auto-grow
                    no-resize
                  ></v-text-field>
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
            {{ 'Save' }}
          </v-btn>
          <v-btn class="mr-2 error darken-1 white--text" depressed @click="$emit('closeAddModal')">Close</v-btn>
        </v-card-actions>
      </v-form>
    </validation-observer>
  </v-card>
</template>

<script>
import BreadCrumbs from "~/components/common/BreadCrumbs";
import {common as commonMixin} from "@/mixins/common";
import Calender from "@/components/admin/course/Calender";
import moment from "moment-timezone";
export default {
  name: 'EScheduleModal',
  components: {BreadCrumbs, Calender},
  mixins: [commonMixin],
  props:{
    item:{
      required:true,
      type:Object,
    }
  },
  data() {
    return {
      moment,
      pageInfo: {
        pageName: 'My Schedule',
      },
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      form:{
        date:null,
        start_time:null,
        end_time:null,
        classes:null,
        course_name:null,
        day:null,
      },
    }
  },
  watch:{
    'form.date'(){
      if (this.form.date){
        this.dayUpdate()
      }else{
        this.form.day=null
      }
    }
  },
  methods: {
    dayUpdate(){
      this.form.day = this.moment(this.form.date).format('dddd')
    },
    async submit(){
      this.loader.isSubmitting=true
      const formData = this.$generateFormData(this.form, false)
      await this.$axios.post(`/employee/course/schedule/add${this.item.id}`,formData).then((response)=>{
        this.$toaster.success(response.data.message)
        this.$emit('closeAddModal')
        this.$refs.form.reset()
        this.$refs.observer.reset()
      }).catch((error)=>{
        if (error.response.status === 422) {
          this.$refs.observer.setErrors(error?.response?.data?.errors)
          Object.keys(error.response.data.errors).map((field) => {
            this.$toaster.error(error.response.data.errors[field][0])
          });
        } else this.$toaster.error(error.response.data.message)
      }).finally(()=>{
        this.loader.isSubmitting=false
      })
    }
  }
}
</script>
<style scoped>
.theme--light * >>> .v-btn {
  color: #1b457d !important;
  border-radius: 6px !important;
}
</style>
