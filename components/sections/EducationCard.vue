<template>
  <div class="education-card btcontainer" :style="section.bg_type === 2 ?{ 'background-image': 'url(' + section.bg_image + ')' } : null">
    <div class="card-bg py-10" :style="section.bg_type === 1? { backgroundColor: section.bg_color } : null ">
      <v-row dense class="btrow">
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
        <v-col md="12" v-else>
          <div class="btrow">
            <div class="btcol-md-6 mb-2" v-for="(prom,key) in promotions" :key="key">
              <!-- single card -->
              <div class="card h-100 p-2">
                <div class="btrow">
                  <div class="btcol-xl-7 btcol-lg-7 btcol-md-12">
                    <div class="pe-2 p-1">
                      <h4 class="primary-color font-semibold text-2xl mb-2">{{  prom.title }}</h4>
                      <p class=" font-normal text-lg mb-3">{{ prom.description }}</p>
                      <v-btn color="green" class="home-promotion rounded text-white" :to="prom.button_url">{{  prom.button_text }}</v-btn>
                    </div>

                  </div>

                  <div class="btcol-xl-5 btcol-lg-5 btcol-md-12">
                    <div class="w-100">
                      <img class="w-100 relative top-28 responsive" :src="prom.image" alt=""/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
const stateName = 'promotions'
const storeName='common'
export default {
  name:'Promotion',
  props:{
    section:{
      required:true,
      type:Object,
      default() {
        return {}
      }
    }
  },
  data(){
    return{
      pageInfo: {
        pageName: 'Promotion',
        apiUrl: '/get/all/promotion',
        permission: ''
      },
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
    }
  },
  computed:{
    ...mapGetters('common',['promotions']),
  },
  async mounted() {
    this.loader.isLoading = true
    const payload = {apiUrl: this.pageInfo.apiUrl, stateName}
    if(!this.promotions.length) await this.$store.dispatch(storeName+'/getItems', payload)
    this.loader.isLoading = false
  },
}
</script>
