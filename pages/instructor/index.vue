<template>
    <div class="course-area">
      <bread-crumbs2 :title="pageInfo.pageName" image="/instructor.png" :items="[{title: pageInfo.pageName, link:'#', disabled:true}]"></bread-crumbs2>
      <!-- course section -->
      <div class="allcoursesarea py-5">
        <v-row v-if="loader.isLoading">
          <v-col
            cols="12"
            md="4"
          >
            <v-skeleton-loader
              class="mx-auto"
              max-width="300"
              type="card"
            ></v-skeleton-loader>
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-skeleton-loader
              class="mx-auto"
              max-width="300"
              type="card"
            ></v-skeleton-loader>
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-skeleton-loader
              class="mx-auto"
              max-width="300"
              type="card"
            ></v-skeleton-loader>
          </v-col>
        </v-row>
        <v-container class="btcontainer" v-else>
          <v-row class="btrow justify-content-center" dense>
            <div class="btcol-lg-3 btcol-xl-3 btcol-md-4 h-auto aos-init aos-animate bg-white" data-aos="fade-up" data-aos-duration="1000" v-for="(item,key) in instructors" :key="key">
              <!-- Course Start -->

<!--              <div class="single-course course-item aos-init aos-animate bg-white h-100" data-aos="fade-up" data-aos-duration="1000">
                <div class="course-header">
                  <div class="course-header__thumbnail ">
                    <nuxt-link :to="`/instructor/${item.id}`">
                      <img width="100%" height="200" :src="item.userable.image" :alt="item.userable.name"/>
                    </nuxt-link>
                  </div>
                </div>
                <div class="course-info">
                  <h3 class="course-info__title"></h3>

                  &lt;!&ndash; <a href="#" class="course-info__instructor">parra</a> &ndash;&gt;
                  <div class="course-user mt-2">
                    <nuxt-link :to="`/instructor/${item.id}`"><b>{{  item.userable.name }}</b></nuxt-link><br>
                  </div>
                  <div v-if="item.biography" >
                    <span v-html="item.biography.substring(20,120)+'..'"></span>
                  </div>
                </div>
              </div>
              -->
              <!-- Course End -->
              <InstructorItem :item="item"></InstructorItem>
            </div>
          </v-row>
        </v-container>
        <v-card-actions class="justify-content-center" v-if="last_page > page">
          <v-btn depressed color="primary" @click="loadMore">
            Load More
          </v-btn>
        </v-card-actions>
      </div>

<!--      <contact-form2></contact-form2>-->
    </div>
</template>

<script>
import {mapGetters} from "vuex";
import BreadCrumbs2 from "@/components/common/BreadCrumbs2";
import ContactForm2 from "@/components/page/ContactForm2.vue";
import InstructorItem from "@/components/sections/InstructorItem.vue";
const stateName = 'instructors'
const storeName='instructor'
export default {
  name: 'Instructor',
  components:{BreadCrumbs2, ContactForm2, InstructorItem},
  auth:false,
  data() {
    return {
      pageInfo: {
        pageName: 'Instructors',
        apiUrl: '/get/all/instructor',
      },
      loader: {isLoading: true, isSubmitting: false, isDeleting: false},
      page:1,
      per_page:12,
    };
  },
  async mounted() {
    this.loader.isLoading = true
    if(!this.instructors.length) await this.init();
    this.loader.isLoading = false
  },
  methods: {
    loadMore() {
      this.page += 1;
      this.init();
    },
    async init(){
      this.loader.isLoading = true
      let url = this.pageInfo.apiUrl;
      if (this.page) url = url +'?page='+this.page
      if (this.per_page) url = url +'&per_page='+this.per_page
      const payload = {apiUrl: url, stateName}
      await this.$store.dispatch(storeName+'/getItems', payload)
      this.loader.isLoading = false
    },
  },
  computed:{
    ...mapGetters('instructor',['instructors','totalItems','last_page']),
  },
}
</script>
