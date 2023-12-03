<template>
  <div>
    <!-- aboutus page start -->
    <section class="about-page-area">
      <v-container class="py-10 btcontainer">
        <v-row dense>
          <!-- single contact info -->
          <v-col cols="12" md="4">
            <div class="single_contact_info bg-white shadow-lg h-100" style="background-image: url(https://prepexcellence.com/wp-content/uploads/2019/09/icon-box_bg-01.png);">
              <div>
                <span>  <font-awesome-icon :icon="['fa', 'map']"/> </span>
                <h5 class=" my-3 ">Our Mailing Address:</h5>
                <p>{{ get_setting_val('general','street') }}, {{ get_setting_val('general','city') }}, {{ get_setting_val('general','state') }}, {{ get_setting_val('general','country') }}, {{ get_setting_val('general','zip') }}</p>
              </div>
            </div>
          </v-col>
          <!-- single contact info -->
          <v-col cols="12" md="4">
            <div class="single_contact_info bg-white shadow-lg h-100" style="background-image: url(https://prepexcellence.com/wp-content/uploads/2019/09/icon-box_bg-02.png);">
              <div>
                <span>  <font-awesome-icon :icon="['fab', 'whatsapp']"/> </span>
                <h5 class=" my-3 ">Call us 9AM -> 7PM Eastern:</h5>
                <div class="d-flex">
                  <a :href="`tel:${get_setting_val('general','mobile_number')}`">
                    <p>{{ get_setting_val('general','mobile_number') }}</p>
                  </a>
                  <p class="mx-2"> or </p>
                  <a :href="`tel:${get_setting_val('general','tel')}`">
                    <p>{{ get_setting_val('general','tel') }}</p>
                  </a>
                </div>

                <!-- <p>+1 (214) 603-2254 or +1 (848) 448-3331</p> -->
              </div>
            </div>
          </v-col>
          <!-- single contact info -->
          <v-col cols="12" md="4">
            <div class="single_contact_info bg-white shadow-lg h-100" style="background-image: url(https://prepexcellence.com/wp-content/uploads/2019/09/icon-box_bg-03.png);">
              <div>
                <span>  <font-awesome-icon :icon="['fa', 'envelope']"/> </span>
                <h5 class=" my-3 ">Email us:</h5>
                <a :href="`mailto:${get_setting_val('general','email')}`">
                  <p>{{ get_setting_val('general','email') }}</p>
                </a>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
      <div class="map py-10">
        <v-container fluid class="btcontainer">
          <v-row dense>
            <v-col cols="12" md="6">
              <div class="question mt-xs-1">
                <div>
                  <h5>Questions ? We Are Here to Help</h5>
                  <p> please let us know by completing the form to the right. You can also call (9 AM to 7 PM Eastern) or email us info@prepexcellence.com (24/7)</p>
                </div>
              </div>
              <div>
                <iframe :src="get_setting_val('general','map')" width="100%" height="400" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <contact-form></contact-form>
            </v-col>
          </v-row>
        </v-container>
      </div>

    </section>
    <!-- aboutus page End -->
  </div>
</template>

<script>
import BreadCrumbs2 from "@/components/common/BreadCrumbs2";
import ContactForm from "@/components/page/ContactForm";
import {mapGetters} from "vuex";
export default {
  name: 'ContactUs',
  components:{BreadCrumbs2, ContactForm},
  data(){
    return{
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
    }
  },
  async mounted() {

  },
  computed:{
    ...mapGetters('setting',['settings','get_setting_val']),
  },
  methods:{

  }
}
</script>

<style>


</style>
