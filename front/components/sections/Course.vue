<template>
    <div class="course-area pt-8">
      <!-- courses title -->
      <div class="btcontainer">
        <div class="btrow">
        <div class="btcol-md-3">
              <!-- Section Title Start -->
              <div class="section-title aos-init aos-animate" data-aos="fade-up" data-aos-duration="1000">
                  <h2 class="section-title__title">Top Courses </h2>
              </div>
              <!-- Section Title End -->
          </div>
          <div class="btcol-md-9">
              <div class="courses-tab-menu aos-init aos-animate" data-aos="fade-up" data-aos-duration="1000">
                  <ul class="nav justify-content-lg-end">
                      <li><button class="" @click="tabClick(null)" :class="tab ? '':'active'">All</button></li>
                      <li v-for="(cat,key) in top_categories" :key="key">
                        <button @click="tabClick(cat.id)" :class="tab === cat.id ? 'active':''">{{ cat.name }}</button>
                      </li>
                    <li><button class="" @click="upcomingPage()">Upcoming</button></li>
                  </ul>
              </div>
          </div>
      </div>
      </div>

      <!-- course section -->
      <div class="allcoursesarea py-5"  :style="{ backgroundColor: section.bg_color }">
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
        <div v-else class="btcontainer">
          <div class="btrow justify-content-center">
                <div class="btcol-lg-3 btcol-xl-3 btcol-md-4 h-auto" v-for="(cous,key) in courses" :key="key">
                    <!-- Course Start -->
                    <div class="single-course course-item aos-init aos-animate bg-white" data-aos="fade-up" data-aos-duration="1000">
                        <div class="course-header">
                            <div class="course-header__thumbnail ">
                                <nuxt-link :to="`/course/${cous.id}`">
                                  <img width="100%" height="173" :src="cous.image" :alt="cous.name"/>
                                </nuxt-link>
                            </div>
                        </div>
                        <div class="course-level m-0" style="height: 8%;padding:5px;">
                          <div class="course-cat">
                            <span v-if="cous.level">{{  cous.level.substring(0,20) }}</span>
                          </div>
                          <div class="course-student">
                            <span><font-awesome-icon :icon="['fa', 'user']"/> {{ cous.studentCourses.length }}</span>
                          </div>
                        </div>
                        <div class="course-info">
                            <!-- <span class="course-info__badge-text badge-all">{{  cous.level }}</span> -->
                            <!-- <h2 class="course-title"> <nuxt-link to="/course-details">{{  cous.name }}</nuxt-link></h2> -->
                            <h3 class="course-info__title">
                              <nuxt-link :to="`/course/${cous.id}`">{{  cous.name }}</nuxt-link></h3>
                            <!-- <a href="#" class="course-info__instructor">parra</a> -->
                            <div class="course-user">
                              <img src="/images/user.png" alt=""/>
                              <p>
                                <span>by</span>
                                <template v-for="(ins,key) in cous.employees">
                                  <nuxt-link v-if="key<3" :key="key" :to="'/instructor/'+ins.id">
                                    <span v-if="ins.userable">{{ ins.userable.name }}</span>
                                  </nuxt-link>
                                </template>
                                <nuxt-link v-if="cous.employees && cous.employees.length > 3" :to="`/course/${cous.id}`">
                                  <span >{{cous.employees.length - 3 }} More</span>
                                </nuxt-link>
                              </p>
                          </div>
                            <!-- course button -->

                            <!-- <div class="course-info__price">
                                <span class="sale-price">${{ cous.amount}}.<small class="separator">00</small></span>
                            </div> -->
                        </div>
                        <div class="course-button" style="height: 10%;">
                            <!-- price -->
                            <div class="price">
                              <h4> <nuxt-link :to="`/course/${cous.id}`">$ {{ cous.amount}}</nuxt-link></h4>
                            </div>
                            <!-- buy now button -->
                            <button class="btn btn-default" v-if="moment(cous.end_date).format('YMMDD') >= moment().format('YMMDD')">
                             <nuxt-link :to="`/course/${cous.id}`">Enroll Now</nuxt-link>
                            </button>
                          </div>
                    </div>
                    <!-- Course End -->
                </div>
          </div>
          <v-card-actions v-if="section.button_url" class="justify-content-center">
            <v-btn depressed color="primary">
              <nuxt-link v-if="section.button_name" :to="section.button_url">{{ section.button_name }}</nuxt-link>
              <nuxt-link v-else :to="section.button_url" class="text-white">{{ 'View all' }}</nuxt-link>
            </v-btn>
          </v-card-actions>

        </div>
      </div>
    </div>
</template>

<script>
import {mapGetters} from "vuex";
const stateName = 'courses'
const storeName='course'
import moment from "moment";
export default {
  name: 'Course',
  props:{
    section:{
      required:true,
      type:Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      moment,
      pageInfo: {
        pageName: 'Course',
        apiUrl: '/get/all/course?page=1&per_page=8',
      },
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      tab: null,
    };
  },
  async mounted() {
    await this.init();
    this.loader.isLoading = true
    const payload = {apiUrl: '/get/course/categories', stateName:'top_categories'}
    if(!this.top_categories.length) await this.$store.dispatch('common/getItems', payload)
    this.loader.isLoading = false
  },
  methods: {
    tabClick(id){
      this.tab=id;
      this.init();
    },
    async init(){
      this.loader.isLoading = true
      let url = this.pageInfo.apiUrl;
      if (this.tab) url = url +'&category='+this.tab
      const payload = {apiUrl: url, stateName}
      await this.$store.dispatch(storeName+'/getItems', payload)
      this.loader.isLoading = false
    },
    upcomingPage(){
      this.$router.push('/page/upcoming-courses')
    }
  },
  computed:{
    ...mapGetters('course',['courses','totalItems']),
    ...mapGetters('common',['top_categories']),
  },
}
</script>

<style>

</style>
