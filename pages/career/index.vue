<template>
  <div>
    <!-- Breadcumb -->
    <bread-crumbs2 :title="'Career'" image="/bc_career.png" :items="[{title: pageInfo.pageName, link:'#', disabled:true}]"></bread-crumbs2>
    <section>
      <v-container fluid class="btcontainer">
        <v-row>
          <v-col md="12">
            <v-card
              :loading="loader.isLoading"
              class="mx-auto my-3"
              v-for="(item,key) in jobs"
              :key="key"
            >
              <template slot="progress">
                <v-progress-linear
                  color="deep-purple"
                  height="10"
                  indeterminate
                ></v-progress-linear>
              </template>

              <!--                <v-img v-if="item.image"
                                height="250"
                                :src="item.image"
                              ></v-img>-->

              <v-card-title class="justify-center" @click="singlePage(item.id)">{{ item.title }}</v-card-title>

              <v-card-text class="p-4">
                <div class="my-1 text-subtitle-1">
                  Vacancy : {{ item.vacancy }}
                </div>
                <div class="my-1 text-subtitle-1">
                  Salary : {{ item.salary }}
                </div>
                <div class="my-1 text-subtitle-1">Deadline : {{ item.last_date }}</div>
                <div v-html="item.job_context"></div>
                <v-card-actions class="justify-center">
                  <v-btn
                    depressed
                    color="primary"
                    @click="singlePage(item.id)"
                  >
                    View More
                  </v-btn>
                </v-card-actions>
              </v-card-text>

            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>
    <!-- aboutus page End -->
    <contact-form-button></contact-form-button>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import BreadCrumbs2 from "@/components/common/BreadCrumbs2";
import ContactForm2 from "@/components/page/ContactForm2.vue";
import ContactFormButton from "@/components/page/ContactFormButton.vue";
const stateName = 'jobs'
const storeName='job'
export default {
  name: 'Career',
  auth:false,
  components:{ContactFormButton, BreadCrumbs2, ContactForm2},
  data() {
    return {
      pageInfo: {
        pageName: 'Career',
        apiUrl: '/get/all/jobs',
      },
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
    }
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
    singlePage(id){
      this.$router.push(`/career/post/${id}`)
    }
  },
  computed:{
    ...mapGetters('job',['jobs','totalItems']),
  },
}
</script>

<style>


</style>
