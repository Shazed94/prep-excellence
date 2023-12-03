<template>
  <div>
    <!-- Breadcumb -->
    <bread-crumbs2 :title="info.title" image="/bc_career.png" :items="[{title: pageInfo.pageName, link:'/career', disabled:true},{title: info.title, link:'#', disabled:true}]"></bread-crumbs2>

    <v-container fluid class="btcontainer">
      <v-row>
        <v-col md="12">
          <v-card
            :loading="loader.isLoading"
            class="mx-auto my-3"
          >
            <template slot="progress">
              <v-progress-linear
                color="deep-purple"
                height="10"
                indeterminate
              ></v-progress-linear>
            </template>

            <!--                <v-img v-if="info.image"
                                   height="250"
                                   :src="info.image"
                            ></v-img>-->

            <v-card-title class="justify-center" @click="singlePage(info.id)">{{ info.title }}</v-card-title>

            <v-card-text class="p-4">
              <div class="my-1 text-subtitle-1">
                Vacancy : {{ info.vacancy }}
              </div>
              <div class="my-1 text-subtitle-1">
                Salary : {{ info.salary }}
              </div>
              <div class="my-1 text-subtitle-1">
                Gender : {{ info.gender }}
              </div>
              <div class="my-1 text-subtitle-1">Deadline : {{ info.last_date }}</div>
              <div class="text-subtitle-1">
                Job Context :
              </div>
              <div v-html="info.job_context"></div>
              <div class=" text-subtitle-1">
                Job Responsibilities :
              </div>
              <div v-html="info.job_responsibilities"></div>
              <div class=" text-subtitle-1">
                Employment Status :
              </div>
              <div v-html="info.employment_status"></div>
              <div class=" text-subtitle-1">
                Educational Requirements :
              </div>
              <div v-html="info.educational_requirements"></div>
              <div class=" text-subtitle-1">
                Experience Requirements :
              </div>
              <div v-html="info.experience_requirements"></div>
              <div class=" text-subtitle-1">
                Additional Requirements :
              </div>
              <div v-html="info.additional_requirements"></div>
              <div class=" text-subtitle-1">
                Compensation & Other Benefits :
              </div>
              <div v-html="info.compensation_benefits"></div>
              <v-card-actions class="justify-center" v-if="$moment().format('YYYYMMDD') <= $moment(info.last_date).format('YYYYMMDD')">
                <v-btn
                  depressed
                  color="primary"
                  class="text-center ml-4"
                  @click="singlePage(info.id)"
                >
                  Apply Now
                </v-btn>
              </v-card-actions>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <!-- aboutus page End -->
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import BreadCrumbs2 from "@/components/common/BreadCrumbs2";
const stateName = 'jobs'
const storeName='job'
export default {
  name: 'Career',
  auth:false,
  components:{BreadCrumbs2},
  data() {
    return {
      pageInfo: {
        pageName: 'Career',
      },
      info:{},
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
    }
  },
  async mounted() {
    await this.init();
  },
  methods: {
    async init(){
      this.loader.isLoading = true
      await this.$axios.get(`/get/single/job/${this.$route.params.id}`).then((response)=>{
        this.info=response.data.data
      }).catch(()=>{
        this.info={}
      })
      this.loader.isLoading = false
    },
    singlePage(id){
      this.$router.push(`/career/apply/${id}`)
    }
  },
}
</script>

<style>


</style>
