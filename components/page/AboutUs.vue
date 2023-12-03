<template>
  <div>
    <!-- aboutus page start -->
    <section class="about-page-area">
      <div class="btcontainer">
        <div class="btrow">
          <!-- about content -->
          <div :class="'btcol-lg-12'">
            <div class="about-content">
              <img v-if="info.image" :src="info.image" class="img-thumbnail rounded float-start mr-2" alt="...">
<!--              <h5>{{  info.title }}</h5>-->
              <div v-html="info.description"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- aboutus page End -->
    <Instructor />
    <contact-form-button></contact-form-button>
  </div>
</template>

<script>
import Instructor from "@/components/sections/Instructor";
import BreadCrumbs2 from "@/components/common/BreadCrumbs2";
import ContactForm2 from "@/components/page/ContactForm2.vue";
import ContactFormButton from "@/components/page/ContactFormButton.vue";
export default {
  components: {ContactFormButton, Instructor, BreadCrumbs2, ContactForm2},
  name: 'aboutUs',
  auth:false,
  props:{
    info:{
      required:true,
      type:Object,
      default() {
        return {}
      }
    }
  },
  data(){
    return{

    }
  }
}
</script>

<style>


</style>
