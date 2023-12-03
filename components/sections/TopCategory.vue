<template>

  <div>
    <div class="topcategory-section">
      <!-- courses title -->
      <div class="btcontainer">
        <div class="btrow">


        </div>
        <!-- title -->

        <!-- Section Title Start -->
              <div class="section-title aos-init aos-animate" data-aos="fade-up" data-aos-duration="1000">
                  <h2 class="section-title__title">Top Category</h2>
              </div>
              <!-- Section Title End -->

        <v-row v-if="loader.isLoading">
          <v-col
            cols="12"
            md="4"
          >
            <v-skeleton-loader
              class="mx-auto"
              max-width="30"
              type="card"
            ></v-skeleton-loader>
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-skeleton-loader
              class="mx-auto"
              max-width="30"
              type="card"
            ></v-skeleton-loader>
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-skeleton-loader
              class="mx-auto"
              max-width="30"
              type="card"
            ></v-skeleton-loader>
          </v-col>
        </v-row>
        <!-- category list -->
        <div class="btrow" v-else>
          <!-- single category list -->
          <div class="btcol-md-3"  v-for="(cat,key) in top_categories" :key="key">
            <div class="topcat bg-light">
              <div class="topcat_img">
                <v-img v-if="cat.image" :src="cat.image" :lazy-src="$config.loaderImage" :alt="cat.name"></v-img>
                <v-img v-else src="/images/course.png" :lazy-src="$config.loaderImage":alt="cat.name"></v-img>
              </div>
              <h4>{{ cat.name }}</h4>
              <div class="triangle-right"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapGetters} from "vuex";

const stateName = 'top_categories'
const storeName='common'
export default {
  name:'TopCategory',
  data(){
    return{
      pageInfo: {
        pageName: 'Top Category',
        apiUrl: '/get/course/categories',
      },
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
    }
  },
  computed:{
    ...mapGetters('common',['top_categories']),
  },
  async mounted() {
    this.loader.isLoading = true
    const payload = {apiUrl: this.pageInfo.apiUrl, stateName}
    if(!this.top_categories.length) await this.$store.dispatch(storeName+'/getItems', payload)
    this.loader.isLoading = false
  },

}
</script>

<style>

</style>
