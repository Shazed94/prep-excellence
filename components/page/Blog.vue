<template>
    <div class="course-area">
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
        <v-container class="btcontainer" v-else fluid>
          <v-row class="justify-content-center" dense>
              <v-col cols="12" md="4" lg="3" xl="3" xxl="2" v-for="(cous,key) in blogs" :key="key">
                <BlogItem :item="cous"></BlogItem>
              </v-col>
          </v-row>
        </v-container>
      </div>
      <contact-form-button></contact-form-button>
    </div>
</template>

<script>
import {mapGetters} from "vuex";
import BreadCrumbs2 from "@/components/common/BreadCrumbs2";
import ContactForm2 from "@/components/page/ContactForm2.vue";
import BlogItem from "@/components/blog/BlogItem.vue";
import moment from "moment-timezone";
import ContactFormButton from "@/components/page/ContactFormButton.vue";
const stateName = 'blogs'
const storeName='blog'
export default {
  name: 'Blogs',
  components:{ContactFormButton, BreadCrumbs2, ContactForm2, BlogItem},
  props:{
    section:{
      required:false,
      type:Object,
      default() {
        return {
          moment,
        }
      }
    }
  },
  data() {
    return {
      pageInfo: {
        pageName: 'Blogs',
        apiUrl: '/get/all/news?page=1&per_page=8',
      },
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      tab: null,
      loading: false,
      selection: 1,
    };
  },
  async mounted() {
    await this.init();
  },
  methods: {
    async init(){
      this.loader.isLoading = true
      let url = this.pageInfo.apiUrl;
      const payload = {apiUrl: url, stateName}
      await this.$store.dispatch(storeName+'/getItems', payload)
      this.loader.isLoading = false
    },
    reserve () {
      this.loading = true

      setTimeout(() => (this.loading = false), 2000)
    },
  },
  computed:{
    ...mapGetters('blog',['blogs','totalItems']),
  },
}
</script>

<style>

</style>
