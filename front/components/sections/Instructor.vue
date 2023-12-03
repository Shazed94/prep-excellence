<template>
  <!-- instructor section -->
    <section class="instructor-area">
      <!-- section title -->
      <div class="instructor-title our-instructor-bg">
        <h2 class="">Our Instructors</h2>
      </div>
      <!-- section content -->
      <div class="instructor-slider"  :style="section.bg_type === 1 ? { backgroundColor: section.bg_color } : { 'background-image': 'url(' + section.bg_image + ')' }">
        <v-container fluid class="btcontainer">
          <!-- instructor slider -->
          <v-row dense>
            <v-col cols="12">
              <vue-slick-carousel class="d-none d-md-flex" v-if="totalItems" v-bind="settings">
                <!-- single instructor card -->
                <div class="single-instructor" v-for="(ins,key) in instructors" :key="key">
                  <InstructorItem :item="ins"></InstructorItem>
                </div>
              </vue-slick-carousel>
            </v-col>
            <v-col cols="12" class="bg-white d-none d-flex d-sm-flex d-md-none">
              <v-carousel
                :cycle="true"
                height="400"
                :light="true"
                v-model="slide"
                :hide-delimiter-background="true"
                hide-delimiters
                :show-arrows="true"
              >
                <v-carousel-item
                  v-for="(slide, i) in instructors"
                  :key="i"
                >
                  <InstructorItem :item="slide"></InstructorItem>
                </v-carousel-item>
              </v-carousel>
            </v-col>
          </v-row>
        </v-container>
      </div>
      <v-card-actions class="justify-content-center" :style="section.bg_type === 1 ? { backgroundColor: section.bg_color } : { 'background-image': 'url(' + section.bg_image + ')' }">
        <v-btn depressed color="primary">
          <nuxt-link to="/instructor" class="text-white">{{ 'View More' }}</nuxt-link>
        </v-btn>
      </v-card-actions>
    </section>
</template>

<script>
import InstructorItem from "@/components/sections/InstructorItem.vue";
import {mapGetters} from "vuex";
const stateName = 'instructors'
const storeName='instructor'
export default {
  name:'Instructor',
  components:{InstructorItem},
  props:{
    section:{
      required:false,
      type:Object,
      default() {
        return {}
      }
    }
  },
  data(){
    return{
      pageInfo: {
        pageName: 'Instructor',
        apiUrl: '/get/all/instructor?page=1&per_page=12',
      },
      slide:0,
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},

      settings:{
        "focusOnSelect": true,
        "touchThreshold": 5,
        "dots": false,
        "autoplay": true,
        "infinite": true,
        "speed": 500,
        "slidesToShow": 4,
        "slidesToScroll": 4,
        "initialSlide": 0,
        "responsive": [
          {
            "breakpoint": 1024,
            "settings": {
              "slidesToShow": 3,
              "slidesToScroll": 3,
              "infinite": true,
              "dots": true
            }
          },
          {
            "breakpoint": 600,
            "settings": {
              "slidesToShow": 2,
              "slidesToScroll": 2,
              "initialSlide": 2
            }
          },
          {
            "breakpoint": 480,
            "settings": {
              "slidesToShow": 1,
              "slidesToScroll": 1
            }
          }
        ]

      }
    }
  },
  computed:{
    ...mapGetters('instructor',['instructors','totalItems']),
  },
  async mounted() {
    this.loader.isLoading = true
    const payload = {apiUrl: this.pageInfo.apiUrl, stateName}
    if(!this.instructors.length) await this.$store.dispatch(storeName+'/getItems', payload)
    this.loader.isLoading = false
  },
}
</script>

<style scoped>
.single-instructor div:first-child {
  height: 335px !important;
}
</style>
