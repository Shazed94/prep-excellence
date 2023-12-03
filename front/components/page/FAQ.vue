<template>
    <div class="course-area">
      <!-- course section -->
      <div  :style="{ backgroundColor: section.bg_color }">
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
          <div class="row">
            <div class="col-lg-12">
              <div class="faq-content-area" v-for="(faq,key) in faqs" :key="key">
                <div class="faq-content-heading">
                  <h4>{{ faq.question }}</h4>
                </div>
                <div class="faq-description">
                  <span>A.</span>
                  <div class="mt-3 ml-3">
                    {{ faq.answer }}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <contact-form-button></contact-form-button>
    </div>
</template>

<script>
import {mapGetters} from "vuex";
import BreadCrumbs2 from "@/components/common/BreadCrumbs2";
import ContactForm2 from "@/components/page/ContactForm2.vue";
import ContactFormButton from "@/components/page/ContactFormButton.vue";
const stateName = 'faqs'
const storeName='faq'
export default {
  name: 'FAQs',
  components:{ContactFormButton, BreadCrumbs2, ContactForm2},
  props:{
    section:{
      required:false,
      type:Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      pageInfo: {
        pageName: 'FAQs',
        apiUrl: '/get/all/faqs',
      },
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      tab: null,
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
  },
  computed:{
    ...mapGetters('faq',['faqs']),
  },
}
</script>

<style scoped>
.faq-content-heading{
  padding: 25px 0;
  background: #adad4f17;
  position: relative;
  border-left: 6px solid #fed700;
}
.faq-content-heading h4::before {
  font-size: 50px;
  color: #fed700;
  left: 0;
  position: relative;
  content: "Q.";
  top: 0;
  margin-left: 10px;
  margin-right: 10px;
}
.faq-content-heading h4 {
  /* margin-left: 10px;
  margin-top: 25px; */
}
.faq-description {
  display: flex;
  padding: 10px 0 0 0;
  border-left: 5px solid #ddd;
}
.faq-description span {
  font-size: 50px;
  color: #ddd;
  left: 15px;
  position: relative;
  /* width: 120px; */
}
.faq-description p{
  margin-left: 25px;
  margin-top: 25px;
  font-size: 16px;
}
.faq-content-area {
  border-bottom: 1px solid #ddd;
  padding: 25px 0;
}
.faq-content-area:last-child {
  border-bottom: none;
}
</style>
