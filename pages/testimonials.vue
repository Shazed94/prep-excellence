<template>
  <div>
    <bread-crumbs2 title="Testimonial" image="/breadcrumb_testimonial.png" :items="[{title: 'Testimonials', link:'#', disabled:true}]"></bread-crumbs2>
    <div class="review-section">
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
      <v-container v-else fluid>
        <v-row no-gutters>
          <v-col md="7" offset-md="2">
            <v-card
              :loading="loader.isLoading"
              class="mx-auto my-2"
              v-for="(item,key) in testimonials"
              :key="key"
            >
              <v-card-text class="single-course p-4 course-item aos-init aos-animate bg-white" data-aos="fade-up" data-aos-duration="1000">
                <div style="color: #1b1b1b !important;">
                  {{ item.message }}
                </div>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <h6 style="color: #1b1b1b !important;">- {{item.name}}</h6>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <div class="text-center">
          <v-pagination
            v-model="page"
            :length="page_length"
            circle
          ></v-pagination>
        </div>
      </v-container>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
const stateName = 'testimonials'
const storeName='testimonial'
import BreadCrumbs2 from "@/components/common/BreadCrumbs2";
export default {
  name: 'Testimonial',
  auth:false,
  components:{BreadCrumbs2},
  data() {
    return {
      pageInfo: {
        pageName: 'Testimonial',
        apiUrl: '/get/all/testimonial',
      },
      page:1,
      per_page:15,
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
    }
  },
  computed:{
    ...mapGetters('testimonial',['testimonials','totalItems','page_length']),
  },
  watch:{
    page: {
      handler() {
        this.init()
      },
      deep: true
    },
  },
  async mounted() {
    await this.init()
  },
  methods:{
    async init(){
      this.loader.isLoading = true
      let url = this.pageInfo.apiUrl +`?page=${this.page}&per_page=${this.per_page}`;
      const payload = {apiUrl: url, stateName}
      if(!this.testimonials.length) await this.$store.dispatch(storeName+'/getItems', payload)
      this.loader.isLoading = false
    }
  }
}
</script>

<style>

</style>
