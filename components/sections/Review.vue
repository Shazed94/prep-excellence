<template>
  <div class="review-section" :style="section.bg_type === 1 ? { backgroundColor: section.bg_color } : { 'background-image': 'url(' + section.bg_image + ')' }">
    <div class="btcontainer">
      <v-row dense>
        <v-col cols="12" lg="4" >
          <!-- review title -->
          <div class="review-title">
            <h2 class="">{{  section.section_name }}</h2>
            <h2 class="mb-2"><span class="">Prep Excellence</span></h2>
            <p class="">One-stop Solution for any elearnine center, Online Courses. People love Prep
              Excellence because they can
              create their site here.</p>
            <nuxt-link class="view-all-btn" to="/testimonials">View all</nuxt-link>
          </div>
        </v-col>
        <!-- review slider area -->
        <v-col cols="12" lg="7">
          <div class="review-area">
            <vue-slick-carousel class="d-none d-md-flex" v-bind="reviews" v-if="totalItems">
              <!-- single review -->
              <div v-for="(testi,key) in testimonials" :key="key" class="single-review">
                <div class="review-content">
                  <h4 class="rating-title"></h4>
                  <p class="client-review-msg m-3">{{ testi.message }}</p>
                  <div class="user-review">
                    <div class="rating-user">
                      <p class="">{{ testi.name }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </vue-slick-carousel>
            <div class="d-none d-flex d-sm-flex d-md-none">
              <v-carousel
                v-model="slide"
                height="300"
                :cycle="true"
                :hide-delimiter-background="true"
                hide-delimiters
                :show-arrows="true">
                <v-carousel-item
                  v-for="(testi,key) in testimonials"
                  :key="key"
                >
                  <div class="single-review">
                    <div class="review-content">
                      <h4 class="rating-title"></h4>
                      <p class="client-review-msg m-3">{{ testi.message }}</p>
                      <div class="user-review">
                        <div class="rating-user">
                          <p class="">{{ testi.name }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </v-carousel-item>
              </v-carousel>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
const stateName = 'testimonials'
const storeName='testimonial'
export default {
  name: 'Testimonial',
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
      pageInfo: {
        pageName: 'Testimonial',
        apiUrl: '/get/all/testimonial?page=1&per_page=15',
      },
      colors: [
        'primary',
        'secondary',
        'yellow darken-2',
        'red',
        'orange',
      ],
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      slide:0,
      reviews: {
        "dots": false,
        "arrows": true,
        "autoplay": true,
        "focusOnSelect": true,
        "infinite": true,
        "speed": 500,
        "slidesToShow": 2,
        "slidesToScroll": 2,
        "touchThreshold": 5,
        "responsive":[
          {
            "breakpoint": 1024,
            "settings": {
              "slidesToShow": 2,
              "slidesToScroll": 2,
            }
          },
          {
            "breakpoint": 600,
            "settings": {
              "slidesToShow": 2,
              "slidesToScroll": 2
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
    ...mapGetters('testimonial',['testimonials','totalItems']),
  },
  async mounted() {
    this.loader.isLoading = true
    const payload = {apiUrl: this.pageInfo.apiUrl, stateName}
    if(!this.testimonials.length) await this.$store.dispatch(storeName+'/getItems', payload)
    this.loader.isLoading = false
  },
}
</script>

<style>

</style>
