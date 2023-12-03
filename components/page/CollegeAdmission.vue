<template>
  <section class="about-page-area">
    <v-container fluid class="btcontainer">
      <v-row >
        <!-- about image -->
<!--        <v-col cols="12" lg="4" v-if="info.image" offset-md="1">
          <div class="about-content-img">
            <img :src="info.image" :alt="info.title">
          </div>
        </v-col>-->
        <!-- about content -->
        <v-col cols="12" md="12">
          <div class="about-content">
            <img v-if="info.image" :src="info.image" class="img-thumbnail rounded float-start mr-2" alt="...">

            <!--            <h5 class="mb-2">{{  info.title }}</h5>-->
            <div v-html="info.description"></div>
          </div>
        </v-col>
        <v-col cols="12" md="12">
          <div class="instructor-title our-instructor-bg mt-2 mb-2">
            <h2>{{ info.service_title }}</h2>
          </div>
          <div class="mb-4">{{ info.service_sub_title }}</div>
          <v-row dense>
            <!-- about image -->
            <v-col cols="12" lg="4" class="mb-4" v-for="(service,key) in jsonDecode(info.services)" :key="key">
              <h6 class="mb-2">{{ service.title }}</h6>
              <div>{{ service.description }}</div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <college-advisor></college-advisor>
    <div class="instructor-title our-instructor-bg">
      <h2 class="">Have Questions?</h2>
    </div>
    <div class="map py-10">
      <v-container fluid class="btcontainer">
        <v-row>
          <v-col cols="12" md="6">
            <div v-html="info.short_description"></div>
          </v-col>
          <v-col cols="12" md="6">
            <contact-form></contact-form>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </section>
</template>

<script>
import {mapGetters} from "vuex";
import ContactForm from "@/components/page/ContactForm.vue";
import CollegeAdvisor from "@/components/page/CollegeAdvisor.vue";
export default {
  name: 'CollegeAdmission',
  components:{ ContactForm, CollegeAdvisor},
  data() {
    return {
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      info:{},
      pageInfo: {
        pageName: 'College Admission',
        apiUrl: '/get/all/news?page=1&per_page=8',
      },
    }
  },
  watch:{

  },
  async mounted() {
    await this.init()
  },
  computed:{

  },
  methods: {
    async init(){
      this.loader.isLoading = true
      await this.$axios.get(`/get/single/page/${this.$route.params.slug}`).then((response)=>{
        this.info=response.data.data
      }).catch(()=>{
        this.info={}
      })
      this.loader.isLoading = false
    },
    jsonDecode(data){
      try {
        return JSON.parse(data);
      }catch (e){
        return []
      }
    },
  }
}
</script>
