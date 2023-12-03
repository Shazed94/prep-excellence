<template>
  <div>
    <section class="about-page-area">
      <v-container fluid class="btcontainer">
        <v-row>
          <!-- about content -->
          <v-col cols="10" :lg="12">
            <div class="about-content">
              <img v-if="info.image" :src="info.image" class="img-thumbnail rounded float-start mr-2" alt="...">
<!--              <h5 class="mb-2">{{  info.title }}</h5>-->
              <div v-html="info.description"></div>
            </div>
          </v-col>
        </v-row>
      </v-container>
      <div class="map py-10">
        <div class="btcontainer">
          <div class="btrow">
            <div class="btcol-md-6">
              <div v-html="info.short_description"></div>
            </div>
            <div class="btcol-md-6">
              <v-card class="border">
                <span class="fp_label">Tutor Request</span>
                <validation-observer ref="observer" v-slot="{ invalid }">
                  <v-form ref="form" @submit.prevent="submitData()">
                    <!--                    <v-card-title class="text-h5"> Tutor Request</v-card-title>-->
                    <v-card-text class="mt-5">
                      <v-container>
                        <v-row dense>
                          <!--
                                                    <v-col cols="12" sm="12" md="12">
                                                      <validation-provider
                                                        v-slot="{ errors }"
                                                        name="parent name"
                                                        vid="parent name"
                                                        rules="required"
                                                      >
                                                        <v-text-field
                                                          v-model="form.parent_name"
                                                          clearable
                                                          clear-icon="mdi-close-circle"
                                                          label="Parent Name"
                                                          :error-messages="errors"
                                                          dense
                                                          outlined
                                                          auto-grow
                                                          no-resize
                                                        ></v-text-field>
                                                      </validation-provider>
                                                    </v-col>
                                                    <v-col cols="12" sm="12" md="12">
                                                      <validation-provider
                                                        v-slot="{ errors }"
                                                        name="email"
                                                        vid="email"
                                                        rules="required|email"
                                                      >
                                                        <v-text-field
                                                          v-model="form.email"
                                                          clearable
                                                          clear-icon="mdi-close-circle"
                                                          label="Email"
                                                          :error-messages="errors"
                                                          dense
                                                          outlined
                                                          auto-grow
                                                          no-resize
                                                        ></v-text-field>
                                                      </validation-provider>
                                                    </v-col>
                                                    <v-col cols="12" sm="6" md="12">
                                                      <validation-provider
                                                        v-slot="{ errors }"
                                                        name="phone number"
                                                        vid="phone number"
                                                        rules="required"
                                                      >
                                                        <vue-tel-input-vuetify
                                                          v-model="form.phone_number"
                                                          label="Phone Number"
                                                          v-bind="bindProps"
                                                          :error-messages="errors"
                                                          dense
                                                          outlined
                                                          auto-grow
                                                          no-resize
                                                        ></vue-tel-input-vuetify>
                                                      </validation-provider>
                                                    </v-col>
                                                    <v-col cols="12" sm="12" md="12">
                                                      <validation-provider
                                                        v-slot="{ errors }"
                                                        name="student name"
                                                        vid="student name"
                                                        rules="required"
                                                      >
                                                        <v-text-field
                                                          v-model="form.student_name"
                                                          clearable
                                                          clear-icon="mdi-close-circle"
                                                          label="Student Name's"
                                                          :error-messages="errors"
                                                          dense
                                                          outlined
                                                          auto-grow
                                                          no-resize
                                                        ></v-text-field>
                                                      </validation-provider>
                                                    </v-col>
                                                    <v-col cols="12" sm="12" md="12">
                                                      <validation-provider
                                                        v-slot="{ errors }"
                                                        name="student school"
                                                        vid="student school"
                                                        rules="required"
                                                      >
                                                        <v-text-field
                                                          v-model="form.student_school"
                                                          clearable
                                                          clear-icon="mdi-close-circle"
                                                          label="Student School(Name, City, State)"
                                                          :error-messages="errors"
                                                          dense
                                                          outlined
                                                          auto-grow
                                                          no-resize
                                                        ></v-text-field>
                                                      </validation-provider>
                                                    </v-col>
                                                    <v-col cols="12" sm="12" md="12">
                                                      <validation-provider
                                                        v-slot="{ errors }"
                                                        name="student grade"
                                                        vid="student grade"
                                                        rules="required"
                                                      >
                                                        <v-text-field
                                                          v-model="form.student_grade"
                                                          clearable
                                                          clear-icon="mdi-close-circle"
                                                          label="Student Grade"
                                                          :error-messages="errors"
                                                          dense
                                                          outlined
                                                          auto-grow
                                                          no-resize
                                                        ></v-text-field>
                                                      </validation-provider>
                                                    </v-col>
                                                    <v-col cols="12" sm="12" md="12">
                                                      <validation-provider
                                                        v-slot="{ errors }"
                                                        name="student phone number"
                                                        vid="student phone number"
                                                        rules="required"
                                                      >
                                                        <v-text-field
                                                          v-model="form.student_phone"
                                                          clearable
                                                          clear-icon="mdi-close-circle"
                                                          label="Student Phone Number"
                                                          :error-messages="errors"
                                                          dense
                                                          outlined
                                                          auto-grow
                                                          no-resize
                                                        ></v-text-field>
                                                      </validation-provider>
                                                    </v-col>
                                                    <v-col cols="12" sm="12" md="12">
                                                      <validation-provider
                                                        v-slot="{ errors }"
                                                        name="student email"
                                                        vid="student email"
                                                        rules="required|email"
                                                      >
                                                        <v-text-field
                                                          v-model="form.student_email"
                                                          clearable
                                                          clear-icon="mdi-close-circle"
                                                          label="Student Email"
                                                          :error-messages="errors"
                                                          dense
                                                          outlined
                                                          auto-grow
                                                          no-resize
                                                        ></v-text-field>
                                                      </validation-provider>
                                                    </v-col>
                          -->

                          <v-col cols="12" sm="12" md="12">
                            <!--                            <label>What do you need help with?</label>-->
                            <validation-provider
                              v-slot="{ errors }"
                              name="course"
                              vid="course"
                              rules="required"
                            >
                              <v-autocomplete
                                v-model="form.course"
                                :items="course_categories"
                                item-text="name"
                                item-value="id"
                                clear-icon="mdi-close-circle"
                                label="What do you need help with? *"
                                :error-messages="errors"
                                dense
                                multiple
                                outlined
                                auto-grow
                                no-resize>
                              </v-autocomplete>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12" md="12" v-for="(item,key) in form.courses" :key="key">
                            <validation-provider
                              v-slot="{ errors }"
                              name="hour"
                              vid="hour"
                              rules="required"
                            >
                              <v-text-field
                                v-model.number="form.courses[key].hour"
                                clear-icon="mdi-close-circle"
                                :label="item.name +' Hour *'"
                                :error-messages="errors"
                                type="number"
                                step="any"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <!--                          <v-col cols="12" sm="12" md="12">
                                                      <validation-provider
                                                        v-slot="{ errors }"
                                                        name="other"
                                                        vid="other"
                                                        rules=""
                                                      >
                                                        <v-text-field
                                                          v-model="form.other"
                                                          clearable
                                                          clear-icon="mdi-close-circle"
                                                          label="Other"
                                                          :error-messages="errors"
                                                          dense
                                                          outlined
                                                          auto-grow
                                                          no-resize
                                                        ></v-text-field>
                                                      </validation-provider>
                                                    </v-col>-->
                          <v-col cols="12" sm="12" md="12">
                            <validation-provider
                              v-slot="{ errors }"
                              name="student need"
                              vid="student need"
                              rules="required"
                            >
                              <v-textarea
                                v-model="form.student_need"
                                clearable
                                clear-icon="mdi-close-circle"
                                label="Please summarize the student's need in the subject. Please be detailed as much as possible. *"
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-textarea>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12" md="12">
                            <validation-provider
                              v-slot="{ errors }"
                              name="days and time"
                              vid="days and time"
                              rules="required"
                            >
                              <v-text-field
                                v-model="form.day_time"
                                clearable
                                clear-icon="mdi-close-circle"
                                label="Best time for us to call you back (days & time) *"
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12" md="12">
                            <validation-provider
                              v-slot="{ errors }"
                              name="days and time tutoring"
                              vid="days and time tutoring"
                              rules="required"
                            >
                              <v-text-field
                                v-model="form.day_time_tutoring"
                                clearable
                                clear-icon="mdi-close-circle"
                                label="Best days for your child to receive Private Tutoring (days & time) *"
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12" md="12">
                            <validation-provider
                              v-slot="{ errors }"
                              name="referral"
                              vid="referral"
                              rules=""
                            >
                              <v-text-field
                                v-model="form.referral"
                                clearable
                                clear-icon="mdi-close-circle"
                                label="If anyone referred you, please enter his/her name, phone, and email"
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-text-field>
                            </validation-provider>
                          </v-col>
                          <v-col cols="12" sm="12" md="12">
                            <validation-provider
                              v-slot="{ errors }"
                              name="question"
                              vid="question"
                              rules=""
                            >
                              <v-textarea
                                v-model="form.question"
                                clearable
                                clear-icon="mdi-close-circle"
                                label="Do your have any specific question or request?"
                                :error-messages="errors"
                                dense
                                outlined
                                auto-grow
                                no-resize
                              ></v-textarea>
                            </validation-provider>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card-text>
                    <v-card-title v-if="totalHour" class="text-center ml-3">{{ `Total:  ${totalHour} X $ ${hour_rate} = $ ${(totalHour * hour_rate)}` }}</v-card-title>
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
                        {{ 'Pay Now' }}
                      </v-btn>
                    </v-card-actions>
                  </v-form>
                </validation-observer>
              </v-card>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import VueTelInputVuetify from "vue-tel-input-vuetify/lib/vue-tel-input-vuetify.vue"
import BreadCrumbs2 from "@/components/common/BreadCrumbs2";
export default {
  name: 'Tutoring',
  components:{VueTelInputVuetify, BreadCrumbs2},
  data() {
    return {
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      info:{},
      pageInfo: {
        pageName: 'Tutoring',
        apiUrl: '/get/all/news?page=1&per_page=8',
      },
      bindProps:{
        mode: 'international'
      },
      form: {
        course: [],
        courses:[],
        other: '',
        student_need: '',
        day_time: '',
        day_time_tutoring: '',
        referral: '',
        question: '',
      },
      hourly_rate:{},
      hour_rate:0,
    }
  },
  watch:{
    'form.course'(value, oldVal){
      if (value.length > oldVal.length){
        let cc =value[oldVal.length]
        let cous = this.findCCatById(cc)
        if (cous){
          this.form.courses.push({
            id:cous.id,
            name:cous.name,
            hour:0
          })
        }
        //console.log(value[oldVal.length])
        //console.log(oldVal)
      }else {
        //remove
        const distinct = oldVal.filter(id => !value.includes(id))
        let ind = this.form.courses.findIndex(item=>item.id === distinct[0])
        if (ind>=0) this.form.courses.splice(ind,1)
      }
    },
    hourly_rate: {
      handler() {
        this.hourRateCalculate()
      },
      deep: true
    },
    totalHour: {
      handler() {
        this.hourRateCalculate()
      },
      deep: true
    },
  },
  async mounted() {
    this.loader.isLoading = true
    await this.init()
    await this.init2()
    const payload1 = {apiUrl: '/public/course/categories', stateName:'course_categories'}
    if (!this.course_categories.length) await this.$store.dispatch('common/courseCategory/getItems', payload1)
    this.loader.isLoading = false
  },
  computed:{
    ...mapGetters('common/courseCategory',['course_categories','findCCatById']),
    totalHour: function() {
      if (this.form.courses.length){
        return this.form.courses.reduce((acc, ele) => {
          return acc + parseInt(ele.hour);
        }, 0);
      }
      return 0;
    },
  },
  methods: {
    async init(){
      await this.$axios.get(`/get/single/page/${this.$route.params.slug}`).then((response)=>{
        this.info=response.data.data
      }).catch(()=>{
        this.info={}
      })
    },
    async init2() {
      let url = `/common/tutoring/fee`
      await this.$axios.get(url).then((response) => {
        this.hourly_rate = response.data.data
      }).catch(() => {
        this.hourly_rate = {}
      })
    },
    hourRateCalculate(){
        let h_rate = this.hourly_rate.hour_rate??0
        let dis_hour = this.hourly_rate.hour_rate_after??null
        let hour_rate2 = this.hourly_rate.hour_rate2??null
        if (dis_hour && hour_rate2 &&  parseFloat(dis_hour).toFixed(2) < this.totalHour){
            this.hour_rate = parseFloat(hour_rate2).toFixed(2)
        }else this.hour_rate = parseFloat(h_rate).toFixed(2)
    },
    async submitData(){
      if (!this.$auth.user) {
        this.openModal()
      }else {
        this.loader.isSubmitting = true
        const formData = this.$generateFormData(this.form, false,['courses'])

        await this.$axios.post('/student/tutoring-form/submit', formData).then((response) => {
          this.payment(response.data.data.id)
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
      }

    },
    payment(id){
      this.$axios.post(`/student/tutoring/student/payment/${id}`).then((response) => {
        if (response.data.url){
          window.location.href=response.data.url;
            //this.$router.go(response.data.url)
        }
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
    clear() {
      this.$refs.form.reset()
      this.$refs.observer.reset()
    },
    openModal(){
      this.$store.commit('user/basic/SET_LOGIN',true)
    },
  }
}
</script>
