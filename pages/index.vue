<template>
  <div>
    <!-- Slider Area -->
    <Slider />
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
    <template v-else>
      <div v-for="(sec, key) in home_sections" :key="key">
        <v-lazy v-if="sec.section_design_type_id === 10"
          :min-height="200"
          :options="{'threshold':0.5}"
          transition="fade-transition"
        >
          <!-- Top Category -->
          <TopCategory />
        </v-lazy>
        <v-lazy v-if="sec.section_design_type_id === 6"
          :min-height="200"
          :options="{'threshold':0.5}"
          transition="fade-transition">
          <!-- courses -->
          <Course :section="sec"/>
        </v-lazy>

        <v-lazy v-if="sec.section_design_type_id === 3"
          :min-height="200"
          :options="{'threshold':0.5}"
          transition="fade-transition">
          <!-- client review -->
          <Review :section="sec"/>
        </v-lazy>
        <v-lazy v-if="sec.section_design_type_id === 7"
          :min-height="200"
          :options="{'threshold':0.5}"
          transition="fade-transition">
          <!-- education card -->
          <EducationCard :section="sec"/>
        </v-lazy>
        <v-lazy v-if="sec.section_design_type_id === 8"
          :min-height="200"
          :options="{'threshold':0.5}"
          transition="fade-transition">
          <!-- instructor section -->
          <Instructor :section="sec"/>
        </v-lazy>
      </div>
    </template>
  </div>
</template>

<script>
import Slider from '../components/sections/Slider.vue'
import Course from '../components/sections/Course.vue'
import EducationCard from '../components/sections/EducationCard.vue'
import Instructor from '../components/sections/Instructor.vue'
import TopCategory from '../components/sections/TopCategory.vue'
import Review from '../components/sections/Review.vue'
import {mapGetters} from "vuex";

export default {
  components: { EducationCard, Instructor, Course, TopCategory, Slider, Review },
  name: 'HomePage',
  auth:false,
  data() {
    return {
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
    }
  },
  async mounted() {
    this.loader.isLoading = true
    const payload = {apiUrl: '/get/home/sections', stateName:'home_sections'}
    if(!this.home_sections.length) await this.$store.dispatch('common/getItems', payload)
    this.loader.isLoading = false
  },
  computed:{
    ...mapGetters('common',['home_sections'])
  },
}
</script>
