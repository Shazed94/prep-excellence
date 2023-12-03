<template>
  <section class="about-page-area ">
    <div class="instructor-title our-instructor-bg">
      <h2 class="">Our College Advisors</h2>
    </div>
    <v-container class="btcontainer">
      <v-row v-for="(advisor,key) in info" :key="key">
        <!-- about image -->
        <v-col class="mt-4" cols="12" lg="3" v-if="key%2 === 1" >
          <v-avatar size="100%">
            <v-img :src="advisor.image" max-height="350" max-width="350" :alt="advisor.name"></v-img>
          </v-avatar>
        </v-col>
        <!-- about content -->
        <v-col class="mt-4" cols="12" :lg="9" >
          <div class="about-content">
            <h4 class="mb-2">{{  advisor.name }}</h4>
            <div v-html="advisor.description"></div>
          </div>
        </v-col>
        <v-col class="mt-4" cols="12" lg="3" v-if="key%2 === 0">
          <v-avatar size="100%">
            <v-img :src="advisor.image" :alt="advisor.name"></v-img>
          </v-avatar>
        </v-col>

      </v-row>
    </v-container>
  </section>
</template>

<script>
import {mapGetters} from "vuex";
import ContactForm from "@/components/page/ContactForm.vue";
export default {
  name: 'CollegeAdvisor',
  components:{ ContactForm},
  data() {
    return {
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      info:[],
      pageInfo: {
        pageName: 'College Advisors',
        apiUrl: '/get/all/college/advisors',
      },
    }
  },
  async mounted() {
    await this.init()
  },
  methods: {
    async init(){
      this.loader.isLoading = true
      await this.$axios.get(this.pageInfo.apiUrl).then((response)=>{
        this.info=response.data.data
      }).catch(()=>{
        this.info=[]
      })
      this.loader.isLoading = false
    },
  }
}
</script>
