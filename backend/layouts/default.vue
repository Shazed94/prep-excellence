<template>
  <v-app>
    <div
      v-shortkey="['ctrl', '/']"
      class="d-flex flex-grow-1"
      @shortkey="onKeyup"
    >
      <!-- Navigation -->
      <v-navigation-drawer
        v-model="drawer"
        app
        floating
        class="elevation-1"
        :right="$vuetify.rtl"
        :light="menuTheme === 'light'"
        :dark="menuTheme === 'dark'"
      >
        <!-- Navigation menu info -->
        <template v-slot:prepend>
          <div class="pa-2">
            <div class="title font-weight-bold text-uppercase primary--text">
              <v-img v-if="get_setting_val('general','logo')"
                class="mx-2"
                :src="$config.apiResource + get_setting_val('general','logo')"
                max-height="100"
                max-width="150"
                contain
              ></v-img>
              <span v-else>{{ "Prep Excellence" }}</span>
            </div>
<!--            <div class="overline grey--text">{{ hotel.sub_title }}</div>-->
          </div>
        </template>

        <!-- Navigation menu -->
        <main-menu :menu="navigation.menu"/>

        <!-- Navigation menu footer -->
        <template v-slot:append>
          <!-- Footer navigation links -->
          <div class="pa-1 text-center">
            <v-btn
              v-for="(item, index) in navigation.footer"
              :key="index"
              :href="item.href"
              :target="item.target"
              small
              text
            >
              {{ item.key ? $t(item.key) : item.text }}
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>

      <!-- Toolbar -->
      <v-app-bar
        app
        :color="isToolbarDetached ? 'surface' : undefined"
        :flat="isToolbarDetached"
        :light="toolbarTheme === 'light'"
        :dark="toolbarTheme === 'dark'"
      >
        <v-card class="flex-grow-1 d-flex" :class="[isToolbarDetached ? 'pa-1 mt-3 mx-1' : 'pa-0 ma-0']" :flat="!isToolbarDetached">
          <div class="d-flex flex-grow-1 align-center">

            <!-- search input mobile -->
<!--            <v-text-field
              v-if="showSearch"
              append-icon="mdi-close"
              placeholder="Search"
              prepend-inner-icon="mdi-magnify"
              hide-details
              solo
              flat
              autofocus
              @click:append="showSearch = false"
            ></v-text-field>-->

            <div class="d-flex flex-grow-1 align-center">
              <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

              <v-spacer class="d-none d-lg-block"></v-spacer>

              <!-- search input desktop -->
<!--              <v-text-field
                ref="search"
                class="mx-1 hidden-xs-only"
                :placeholder="$t('menu.search')"
                prepend-inner-icon="mdi-magnify"
                hide-details
                filled
                rounded
                dense
              ></v-text-field>

              <v-spacer class="d-block d-sm-none"></v-spacer>

              <v-btn class="d-block d-sm-none" icon @click="showSearch = true">
                <v-icon>mdi-magnify</v-icon>
              </v-btn>-->

              <div>
                <v-btn-toggle v-model="theme" color="primary" mandatory class="my-1">
                  <v-btn small>
                    <v-icon :color="!theme ? 'orange': ''">mdi-white-balance-sunny</v-icon>
                  </v-btn>
                  <v-btn small>
                    <v-icon :color="theme ? 'yellow': ''">mdi-weather-night</v-icon>
                  </v-btn>
                </v-btn-toggle>
              </div>

<!--              <toolbar-language/>-->

<!--
              <div class="hidden-xs-only mx-1">
                <toolbar-currency/>
              </div>
-->

<!--              <toolbar-apps/>-->

              <div :class="[$vuetify.rtl ? 'ml-1' : 'mr-1']">
                <toolbar-notifications/>
              </div>

              <toolbar-user/>
            </div>
          </div>
        </v-card>
      </v-app-bar>

      <v-main>
        <v-container class="fill-height" :fluid="!isContentBoxed">
          <v-layout>
            <nuxt/>
          </v-layout>
        </v-container>

        <v-footer app inset>
          <v-spacer></v-spacer>
          <div class="overline">
<!--            Built with-->
            Website By
            <v-icon small color="pink">mdi-copyright</v-icon>
<!--            <a class="text-decoration-none" href="javascript:void(0)" target="_blank">Hotel Blue Bird</a>-->
            <a class="text-decoration-none" href="https://stylezworld.com">styleZworld</a>
          </div>
        </v-footer>
      </v-main>
    </div>
  </v-app>
</template>

<script>
import {mapGetters, mapMutations, mapState} from 'vuex'

// navigation menu configurations
import config from '../configs'

import MainMenu from '../components/navigation/MainMenu'
import ToolbarUser from '../components/toolbar/ToolbarUser'
import ToolbarApps from '../components/toolbar/ToolbarApps'
import ToolbarLanguage from '../components/toolbar/ToolbarLanguage'
import ToolbarCurrency from '../components/toolbar/ToolbarCurrency'
import ToolbarNotifications from '../components/toolbar/ToolbarNotifications'
//import Header from "~/components/master/Header";
export default {
  //middleware: ['auth'],
  middleware: ['auth','routePermission'],
  components: {
    //Header,
    MainMenu,
    ToolbarUser,
    ToolbarLanguage,
    ToolbarApps,
    ToolbarCurrency,
    ToolbarNotifications
  },
  async fetch() {
    if(!this.general_settings.length) await this.$store.dispatch('public/settings/generalSetting/getSettings')
  },
  fetchOnServer: false,
  data() {
    return {
      theme: 0,
      drawer: null,
      showSearch: false,
      moved: true,
      navigation: config.navigation
    }
  },
  computed: {
    ...mapState('app', ['product', 'isContentBoxed', 'menuTheme', 'toolbarTheme', 'isToolbarDetached']),
    ...mapGetters('public/settings/generalSetting', ['general_settings','get_setting_val']),
    ...mapGetters('user/basic', ['dashboard']),
  },
  watch: {
    theme(val) {
      this.setGlobalTheme((val === 0 ? 'light' : 'dark'))
    }
  },
  created() {
    if (process.client) this.checkActiveTheme()
    this.$nuxt.$on('hide-sidebar-event', () => {
      //console.log('drawer')
      this.drawer = false
    })
  },
  async mounted() {
    window.Echo.join(`message-channel-online`)
    .here(users=>{
      let ids = users.map(item=>item.id)
      let payload = {stateName:'online_users',data: ids}
      this.$store.commit('message/message/SET_ITEMS',payload)
    })
    .joining(user => {
      let payload = {stateName:'online_users',data:user.id}
      this.$store.commit('message/message/INSERT_NEW_ITEMS',payload)
    })
    .leaving(user => {
      let index = this.online_users.findIndex(item=>item === user.id)
      let payload = {stateName:'online_users',index:index}
      this.$store.commit('message/message/DELETE_ITEM',payload)
    });
    window.Echo.join(`message-channel-${this.$auth.user.id}`)
    .listen('MessageEvent',(message)=>{
        if(message.sender_id != this.$auth.user.id) this.init()
    })
  },
  methods: {
    async init(){
      const payload0 = { apiUrl: "/dashboard/report", stateName: "dashboard" };
      await this.$store.dispatch("user/basic/getItems", payload0);
    },
    sidebarHandler() {
      var sideBar = document.getElementById("mobile-nav");
      sideBar.style.transform = "translateX(-260px)";
      if (this.$data.moved) {
        sideBar.style.transform = "translateX(0px)";
        this.$data.moved = false;
      } else {
        sideBar.style.transform = "translateX(-260px)";
        this.$data.moved = true;
      }
    },
    ...mapMutations('app', ['setGlobalTheme']),
    setTheme() {
      this.$vuetify.theme.dark = this.theme === 'dark'
    },
    checkActiveTheme() {
      this.theme = null
      const currentTheme = window.localStorage.getItem('theme')

      currentTheme === 'dark' ? this.theme = 1 : this.theme = 0
    },
    onKeyup(e) {
      this.$refs.search.focus()
    },
  }
}
</script>

<style scoped>
.buy-button {
  box-shadow: 1px 1px 18px #ee44aa;
}
</style>
