<template>
  <div>
    <footer class="footer-bg py-20">
      <div class="btcontainer">
        <div class="row">
          <!-- footer menu -->
          <div class="col-lg-8">
            <div class="footer-menu-area">
              <!-- single footer menu -->
              <div class="single-footer-menu" v-for="(wd,key) in widgets" :key="key">
                <template v-if="wd.type === 1">
                  <div v-html="wd.text"></div>
                </template>
                <template v-if="wd.type === 2">
                  <ul>
                    <li v-for="(item,key1) in wd.items" :key="key1">
                      <nuxt-link class="" :to="item.url">{{ item.name }}</nuxt-link>
                    </li>
                  </ul>
                </template>

              </div>
            </div>
          </div>
          <!-- footer text -->
          <div class="col-lg-4">
            <div class="footer-text">
              <v-img
                class="text-center ml-4 cursor-pointer"
                :src="($config.apiResource + get_setting_val('general','logo'))"
                aspect-ratio="1"
                max-height="70"
                max-width="180"
                @click="$router.push('/')">
              </v-img>
               <div class="">
                  <ul class="footer-social-menu">
                    <li class="">
                      <a class="" :href="get_setting_val('social','facebook')">
                        <font-awesome-icon :icon="['fab', 'facebook']"/>
                      </a>
                    </li>
                    <li class="">
                      <a class="" :href="get_setting_val('social','twitter')">
                        <font-awesome-icon :icon="['fab', 'twitter']"/>
                      </a>
                    </li>
                    <li class="">
                      <a class="" :href="get_setting_val('social','linkedin')">
                        <font-awesome-icon :icon="['fab', 'linkedin']"/>
                      </a>
                    </li>
                    <li class="">
                      <a class="" :href="get_setting_val('social','youtube')">
                        <font-awesome-icon :icon="['fab', 'youtube']"/>
                      </a>
                    </li>
                   <li class="">
                      <a class="" :href="get_setting_val('social','tiktok')">
                        <font-awesome-icon :icon="['fab', 'tiktok']"/>
                      </a>
                    </li>
                    <li class="">
                      <a class="" :href="get_setting_val('social','instagram')">
                        <font-awesome-icon :icon="['fab', 'instagram']"/>
                      </a>
                    </li>
                    <li class="">
                      <a class="" :href="get_setting_val('social','snapchat')">
                        <font-awesome-icon :icon="['fab', 'snapchat']"/>
                      </a>
                    </li>

                  </ul>
                </div>

                 <!-- copyright text -->
              <div class="footer-copyright">
                <p class="">&copy; {{ get_setting_val('general','title') }} 2016 - {{ new Date().getFullYear() }} {{ get_setting_val('general','copyright') }}</p>
              </div>
              <!-- terms condition menu -->
              <div class="footer-terms-menu">
                <ul class="">
                  <li>
                    <nuxt-link to="/page/terms-of-service">Terms of Service</nuxt-link>
                  </li>
                  <li>
                    <nuxt-link to="/page/privacy-policy">Privacy Policy</nuxt-link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- footer bottom -->
      <div class="footer_bottom_area">
        <div class="btcontainer">
          <div class="btrow">
            <p>SAT® is a registered trademark of the College Board. The College Board does not endorse or is not affiliated in any way with the owner or any content of this web site.</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
const stateName = 'widgets'
const storeName='widgets'
export default {
  name:'Footer',
  data() {
    return {
      pageInfo: {
        pageName: 'Footer',
        apiUrl: '/get/all/widgets',
      },
      state: {
        name: stateName,
        store_name: storeName,
      },
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
    }
  },
  computed:{
    ...mapGetters('setting',['settings','get_setting_val']),
      ...mapGetters('widgets',['widgets']),
  },
  async mounted() {
    this.loader.isLoading = true
    const payload1 = {apiUrl: this.pageInfo.apiUrl, stateName}
    await this.$store.dispatch(storeName+'/getItems', payload1)
    this.loader.isLoading = false
  },
  methods:{

  }

}
</script>

<style>

</style>
