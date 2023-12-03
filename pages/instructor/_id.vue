<template>
  <div>
    <bread-crumbs2 :title="'Instructor'" :items="[{title:'Instructor', link:'#', disabled:true}]"></bread-crumbs2>
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
      <template>
        <!-- aboutus page start -->
        <section class="about-page-area">
          <div class="btcontainer">
            <div class="btrow">
              <!-- about image -->
              <div class="btcol-lg-5" v-if="info.userable">
                <div class="about-content-img">
                  <!--              <div class="about-img-overlay"></div>-->
                  <img :src="info.userable.image" alt="" class="pb-3">
                </div>
              </div>
              <!-- about content -->
              <div :class="info.userable ? 'btcol-lg-7':'btcol-lg-12'">
                <div class="about-content">
                  <h4 class="mb-1">{{  'Biography' }}</h4>
                  <p v-if="info.userable" class="mb-2">{{  info.userable.name }}</p>
                  <div v-html="info.biography"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <!-- aboutus page End -->
      </template>
    </template>
  </div>
</template>

<script>
import AboutUs from "@/components/page/AboutUs";
import ContactUs from "@/components/page/ContactUs";
import AllCourses from "@/components/page/AllCourses"
import Blog from "@/components/page/Blog";
import Tutoring from "@/components/page/Tutoring";
import BreadCrumbs2 from "@/components/common/BreadCrumbs2";
export default {
  name: 'InstructorSinglePage',
  auth:false,
  components:{AboutUs, ContactUs, AllCourses, Blog, Tutoring, BreadCrumbs2},
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
      await this.$axios.get(`/get/single/instructor/${this.$route.params.id}`).then((response)=>{
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
