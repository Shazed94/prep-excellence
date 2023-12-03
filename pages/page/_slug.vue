<template>
  <div>
    <template v-if="loader.isLoading">
      <v-sheet
        :color="`grey lighten-4`"
        class="pa-3"
      >
        <v-row>
          <v-col cols="12" md="4">
            <v-skeleton-loader
              class="mx-auto"
              max-width="300"
              type="card"
            ></v-skeleton-loader>
          </v-col>
          <v-col cols="12" md="4">
            <v-skeleton-loader
              class="mx-auto"
              max-width="300"
              type="card"
            ></v-skeleton-loader>
          </v-col>
          <v-col cols="12" md="4">
            <v-skeleton-loader
              class="mx-auto"
              max-width="300"
              type="card"
            ></v-skeleton-loader>
          </v-col>
        </v-row>
      </v-sheet>
    </template>
    <template v-else>
      <bread-crumbs2 :title="info.title" :image="info.bread_crumb_image" :items="[{title: info.title, link:'#', disabled:true}]"></bread-crumbs2>
      <about-us v-if="info.template === 1" :info="info"></about-us>
      <contact-us v-else-if="info.template === 2"></contact-us>
      <all-courses v-else-if="info.template === 3"></all-courses>
      <blog v-else-if="info.template === 4"></blog>
      <tutoring v-else-if="info.template === 5"></tutoring>
      <college-admission v-else-if="info.template === 6"></college-admission>
      <f-a-q v-else-if="info.template === 7"></f-a-q>
      <template v-else>
        <section class="about-page-area">
          <v-container fluid class="btcontainer">
            <v-row>
              <!-- about image -->
<!--              <v-col cols="12" lg="4" v-if="info.image">
                <div class="about-content-img">
                  <img :src="info.image" :alt="info.title">
                </div>
              </v-col>-->
              <!-- about content -->
              <v-col cols="10" :lg="12">
                <div class="about-content">
                  <img v-if="info.image" :src="info.image" class="img-thumbnail rounded float-start mr-2" alt="...">

                  <!--                  <h4 class="mb-2">{{  info.title }}</h4>-->
                  <div v-html="info.description"></div>
                </div>
              </v-col>
            </v-row>
          </v-container>
        </section>
        <contact-form-button></contact-form-button>
        <!-- aboutus page End -->
      </template>
    </template>
  </div>
</template>

<script>
import BreadCrumbs2 from "@/components/common/BreadCrumbs2";
import AboutUs from "@/components/page/AboutUs";
import ContactUs from "@/components/page/ContactUs";
import AllCourses from "@/components/page/AllCourses"
import Blog from "@/components/page/Blog";
import Tutoring from "@/components/page/Tutoring";
import FAQ from "@/components/page/FAQ";
import CollegeAdmission from "@/components/page/CollegeAdmission.vue";
import ContactFormButton from "@/components/page/ContactFormButton.vue";
export default {
  name: 'SinglePage',
  auth:false,
  components:{AboutUs, ContactUs, AllCourses, Blog, Tutoring,
    BreadCrumbs2, FAQ, CollegeAdmission,ContactFormButton},
  data(){
    return{
      info:{},
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
    }
  },
  mounted() {
    this.init()
  },
  methods:{
    async init(){
      this.loader.isLoading = true
      await this.$axios.get(`/get/single/page/${this.$route.params.slug}`).then((response)=>{
        this.info=response.data.data
      }).catch(()=>{
        this.info={}
      })
      this.loader.isLoading = false
    }
  }
}
</script>

<style>


</style>
