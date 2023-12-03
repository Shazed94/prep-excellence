<template>
  <div>
    <header class="header w-100">
      <!-- top header start -->
      <div class="top-header top-header-bg">
        <div class="btcontainer">
          <div class="btrow">
            <!-- offer button area -->
            <div class="btcol-xl-4 btcol-lg-12 btcol-md-12 offer-area">
              <div class="offer-button top-button-bg">
                <div class="offer-price">
                  <span class="currency-symbol">$</span>
                  <h4>{{ get_setting_val('top_add','offer') }} </h4>
                  <h4 class="text-black">OFF</h4>
                </div>
                <div class="offer-text">
                  <h4>{{ get_setting_val('top_add','text') }}</h4>
                </div>
              </div>
            </div>
            <!-- social info area -->
            <div class="btcol-xl-8 btcol-lg-12 btcol-md-12 ">
              <div class="top-social-info">
                <div class="top-email">
                      <span><font-awesome-icon :icon="['fa', 'fa-envelope-open-text']"/></span>
                    <a :href="`mailto:${get_setting_val('general','email')}`">
                      <p>{{ get_setting_val('general','email') }}</p>
                    </a>
                </div>
                <div class="top-phone">
                  <span><font-awesome-icon :icon="['fa', 'phone']"/></span>
                  <a :href="`tel:${get_setting_val('general','mobile_number')}`">
                    <span>{{ get_setting_val('general','mobile_number') }}</span>
                  </a>
                  <span>|</span>
                  <a :href="`tel:${get_setting_val('general','tel')}`">
                    <span>{{ get_setting_val('general','tel') }}</span>
                  </a>
                </div>

                <div class="header-social-menu">
                  <ul class="pl-0">
                    <li class="">
                      <a :href="get_setting_val('social','facebook')">
                        <font-awesome-icon :icon="['fab', 'facebook']"/>
                      </a>
                    </li>
                    <li class="">
                      <a :href="get_setting_val('social','twitter')">
                        <font-awesome-icon :icon="['fab', 'twitter']"/>
                      </a>
                    </li>
                    <li>
                      <a :href="get_setting_val('social','linkedin')">
                        <font-awesome-icon :icon="['fab', 'linkedin']"/>
                      </a>
                    </li>
                    <li>
                      <a :href="get_setting_val('social','youtube')">
                        <font-awesome-icon :icon="['fab', 'youtube']"/>
                      </a>
                    </li>
                    <li>
                      <a :href="get_setting_val('social','tiktok')">
                        <font-awesome-icon :icon="['fab', 'tiktok']"/>
                      </a>
                    </li>
                    <li>
                      <a :href="get_setting_val('social','instagram')">
                        <font-awesome-icon :icon="['fab', 'instagram']"/>
                      </a>
                    </li>
                    <li>
                      <a :href="get_setting_val('social','snapchat')">
                        <font-awesome-icon :icon="['fab', 'snapchat']"/>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- top header end -->

      <!-- bottom header start -->
      <div class="bottom-header">
        <v-container class="container_header">
          <div class="btrow">
            <div class="btcol-lg-2 btcol-sm-6">
              <div class="logo cursor-pointer">
                <v-img v-if="loader.isLoading" :src="$config.loaderImage"
                        max-height="70"
                       max-width="180" @click="$router.push('/')"></v-img>
                <v-img v-else :src="($config.apiResource + get_setting_val('general','logo'))"
                        max-height="70"
                       max-width="180" @click="$router.push('/')"></v-img>
              </div>
            </div>
            <!-- sidebar-menu -->
            <div class="btcol-sm-6 mobile-menu">
              <div class="sidebar-menu">
                  <button style="margin-right: 20px;" @click="showOrHideCart({status:true})">
                    <span class="cart"><font-awesome-icon :icon="['fa', 'shopping-cart']"/></span>
                    <span class="cart-number" v-if="totalCartItems">{{ totalCartItems }}</span>
                  </button>

                  <button @click="drawer">
                    <span><font-awesome-icon :icon="['fas', 'fa-bars']"/></span>
                  </button>
              </div>
            </div>
            <!-- <div class="btcol-lg-9 large-menu"> -->

              <div class="btcol-lg-9 m-auto" >
              <div class="main-menu justify-content-between">
                <nav class="header-nav m-auto">
                  <ul>
                    <base-menu
                      v-for="(menu, index) in menus"
                      :menu="menu"
                      :depth="0"
                      :key="index"
                    />
                  </ul>
                </nav>
                <div class="right-navigation">
                  <button style="    margin: 10px 0 0 0;" class="" @click="showOrHideCart({status:true})">
                    <span class="cart"><font-awesome-icon :icon="['fa', 'shopping-cart']"/></span>
                    <span class="cart-number" v-if="totalCartItems">{{ totalCartItems }}</span>
                  </button>
                  <div class="right-menu-border"></div>

                  <v-row style="margin-left: 1px;margin:0;">

                    <template v-if="$auth.loggedIn">
                      <v-menu offset-y left transition="slide-y-transition">
                        <template v-slot:activator="{ on }">
                          <v-btn icon class="elevation-2" v-on="on">
                            <v-badge
                              color="success"
                              dot
                              bordered
                              offset-x="10"
                              offset-y="10"
                            >
                              <v-avatar size="40">
                                <v-img v-if="$auth.user.image" :src="$auth.user.image"></v-img>
                                <v-img v-else src="/images/avatars/avatar1.svg"></v-img>
                              </v-avatar>
                            </v-badge>
                          </v-btn>
                        </template>

                        <!-- user menu list -->
                        <v-list dense nav>
                          <v-list-item to="/user-dashboard">
                            <v-list-item-icon>
                              <v-icon small>mdi-face-man-profile</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                              <v-list-item-title>Profile</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>

                          <v-divider class="my-1"></v-divider>

                          <v-list-item @click="logout()">
                            <v-list-item-icon>
                              <v-icon small>mdi-logout-variant</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                              <v-list-item-title>Logout</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </template>
                    <template v-else>
                      <v-btn
                        class="login-menu"
                        dark
                        @click="openModal()"
                      >
                        Login
                      </v-btn>
                       <v-btn
                        class="login-menu"
                        dark
                        @click="openSignup()"
                      >
                        Register
                      </v-btn>
                    </template>
                  </v-row>
                </div>
              </div>
            </div>
          </div>
        </v-container>
      </div>
      <!-- bottom header end -->

      <!-- Mobile menu -->
      <aside class="drawer-mobile-menu" :class="isOpen ? 'mobile-menu-translate' : 'mobile-menu-translate-x'">
        <div class="close">
          <button class="" @click="isOpen = false">
            <svg
              class=""
              fill="none" stroke-linecap="round"
              stroke-linejoin="round" stroke-width="2"
              viewBox="0 0 24 24" stroke="currentColor">
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <nuxt-link to="/">
          <img class="mobile-menu-logo" :src="($config.apiResource + get_setting_val('general','logo'))" alt="">

        </nuxt-link>
        <ul class="drawer-navigation">
          <base-menu
            v-for="(menu, index) in menus"
            :menu="menu"
            :depth="0"
            :key="index"
            @menuCloseEvent="isOpen = false"
          />
          <template v-if="$auth.loggedIn">
            <li>
              <nuxt-link to="/user-dashboard" @click="isOpen = false">Profile</nuxt-link>
            </li>
            <li>
              <a href="javascript:void(0)" @click="logout()">Logout</a>
            </li>
          </template>
        </ul>
        <div class="drawer-follow">
          <p class="">follow us:</p>
          <div class="drawer-social-menu">
            <ul >
              <li class="">
                <a :href="get_setting_val('social','facebook')">
                  <font-awesome-icon :icon="['fab', 'facebook']"/>
                </a>
              </li>
              <li class="">
                <a :href="get_setting_val('social','twitter')">
                  <font-awesome-icon :icon="['fab', 'twitter']"/>
                </a>
              </li>
              <li>
                <a :href="get_setting_val('social','linkedin')">
                  <font-awesome-icon :icon="['fab', 'linkedin']"/>
                </a>
              </li>
              <li>
                <a :href="get_setting_val('social','youtube')">
                  <font-awesome-icon :icon="['fab', 'youtube']"/>
                </a>
              </li>
              <li>
                <a :href="get_setting_val('social','tiktok')">
                  <font-awesome-icon :icon="['fab', 'tiktok']"/>
                </a>
              </li>
              <li>
                <a :href="get_setting_val('social','instagram')">
                  <font-awesome-icon :icon="['fab', 'instagram']"/>
                </a>
              </li>

            </ul>
          </div>
        </div>
        <v-btn v-if="!$auth.loggedIn" class="drawer-button" color="login-menu" dark @click="openModal()">
                <font-awesome-icon class="pr-1" :icon="['fa', 'key']"/>
                <!-- <v-icon left>lock</v-icon> -->
                Login
        </v-btn>
        <v-btn v-if="!$auth.loggedIn" class="drawer-button" color="signup-menu" dark @click="openModal()">
          <font-awesome-icon class="pr-1" :icon="['fa', 'key']"/>
          Signup
        </v-btn>
      </aside>

    </header>

    <CartSidebar v-show="cart_show" @close="showOrHideCart({status:false})" />
  </div>

</template>


<script>
import CartSidebar from './sections/CartSidebar.vue';
import {mapActions, mapGetters} from "vuex";
import BaseMenu from "@/components/menu/BaseMenu";
export default {
   components: { CartSidebar, BaseMenu },
  data() {
    return {
      drawer1:true,
      totalCartItems: 0,
      group: 0,
      loginOpen: false,
      loader: {isLoading: false, isSignInDisabled: false, isSubmitting: false, isDeleting: false},
      isOpen: false,
      view: {
            atTopOfPage: true
        },
    }
  },
   beforeMount () {
      window.addEventListener('scroll', this.handleScroll);
  },

  computed:{
    ...mapGetters('menu',['menus']),
    ...mapGetters('setting',['settings','get_setting_val']),
    ...mapGetters('cart',['cart_show','cartItems']),
  },
  async mounted() {
    //this.loader.isLoading = true
    this.$store.commit('cart/cartRefresh')
    this.totalCartItems = this.cartItems.length
    //this.loader.isLoading = false
  },
  methods: {
     ...mapActions('cart',['showOrHideCart']),
    drawer() {
      this.isOpen = !this.isOpen;
    },
    handleScroll(){
        if(window.pageYOffset>0){
            if(this.view.atTopOfPage) this.view.atTopOfPage = false
        }else{
            if(!this.view.atTopOfPage) this.view.atTopOfPage = true
        }
    },
    logout(){
      this.$auth.logout()
    },
    openModal(){
      this.$store.commit('user/basic/SET_LOGIN',true)
    },
    openSignup(){
      this.$store.commit('user/basic/SET_SIGNUP',true)
    }
  },

  watch: {
    isOpen: {
      immediate: true,
      handler(isOpen) {
        if (process.client) {
          if (isOpen) document.body.style.setProperty("overflow", "hidden");
          else document.body.style.removeProperty("overflow");
        }
      }
    },
    cartItems: {
      immediate: true,
      handler() {
        this.totalCartItems = this.cartItems.length
      }
    },
  }
}
</script>
<style scoped>
@media (min-width: 1264px){
  .container_header {
    max-width: 1350px !important;
  }
}
@media (max-width: 1400px){
  nav.header-nav ul li a {
    font-size: 7px;
  }
}

</style>
