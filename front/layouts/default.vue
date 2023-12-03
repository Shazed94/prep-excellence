<template>
  <v-app >
    <div v-if="loader.isLoading" class="container mt-10" style="min-height: 200px">
      <div class="row">
          <div class="loader"></div>
          <div class="col-md-12 text-center"><div class="loader1">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div></div>
      </div>
    </div>
    <template v-else>
      <Header />
      <v-main>
        <Nuxt />
        <login-modal></login-modal>
        <signup-modal></signup-modal>
        <forget-password-modal></forget-password-modal>
      </v-main>
      <Footer />
    </template>
  </v-app>
</template>
<script>
import Footer from '../components/Footer.vue'
import Header from '../components/Header.vue'
import LoginModal from "@/components/modal/LoginModal";
import SignupModal from "@/components/modal/SignupModal";
import ForgetPasswordModal from "@/components/modal/ForgetPasswordModal";
import {mapGetters} from "vuex";
export default {
  components: {LoginModal, Header, Footer,SignupModal,ForgetPasswordModal},
  data() {
    return {
      loader: {isLoading: true, isSignInDisabled: false, isSubmitting: false, isDeleting: false},
    }
  },
  computed:{
    ...mapGetters('menu',['menus']),
    ...mapGetters('setting',['settings','get_setting_val']),
  },
  async mounted() {
    window.dispatchEvent(new CustomEvent('cart-localstorage-changed', {
      detail: {
        storage: localStorage.getItem('cartItems')
      }
    }));
    window.localStorage.setItem('theme','light')
    this.loader.isLoading=true
    const payload = {apiUrl: `/get/menu/by${1}`, stateName:'menus'}
    if(!this.menus.length) await this.$store.dispatch('menu/getItems', payload)
    const payload2 = {apiUrl: `get/all/settings`, stateName:'settings'}
    if(!this.settings.length) await this.$store.dispatch('setting/getItems', payload2)
    await this.fetchUser(null,null,false)
    this.loader.isLoading=false
  },
  watch:{
    $route(to, from) {
      this.fetchUser(to.path, from.path)
    },
  },
  methods:{
    async fetchUser(to=null, from=null, route=true){
      await this.$auth.fetchUser().then(()=>{
        this.changeToEdit(to, from, route)
      })
    },
    changeToEdit(to=null, from=null, route=true){
      let user = this.$auth.user;
      //console.log(user)
      if (route && to === from){
        //don nothing
      }else if(route && to == '/form'){
        //don nothing
      }else if (user && user.role_id == 3 && !this.$auth.user.userable.date_of_birth){
        this.$toaster.error('Please complete your profile information first');
        this.$router.push('/form')
      }
    },
  },
}
</script>

<style scoped>
body {
  background:#000 !important;
  color:#FFF;

}
.loader1 {
  display:inline-block;
  font-size:0px;
  padding:0px;
}
.loader1 span {
  vertical-align:middle;
  border-radius:100%;
  display:inline-block;
  width:10px;
  height:10px;
  margin:3px 2px;
  -webkit-animation:loader1 0.8s linear infinite alternate;
  animation:loader1 0.8s linear infinite alternate;
}
.loader1 span:nth-child(1) {
  -webkit-animation-delay:-1s;
  animation-delay:-1s;
  background:rgba(245, 103, 115,0.6);
}
.loader1 span:nth-child(2) {
  -webkit-animation-delay:-0.8s;
  animation-delay:-0.8s;
  background:rgba(245, 103, 115,0.8);
}
.loader1 span:nth-child(3) {
  -webkit-animation-delay:-0.26666s;
  animation-delay:-0.26666s;
  background:rgba(245, 103, 115,1);
}
.loader1 span:nth-child(4) {
  -webkit-animation-delay:-0.8s;
  animation-delay:-0.8s;
  background:rgba(245, 103, 115,0.8);

}
.loader1 span:nth-child(5) {
  -webkit-animation-delay:-1s;
  animation-delay:-1s;
  background:rgba(245, 103, 115,0.4);
}

@keyframes loader1 {
  from {transform: scale(0, 0);}
  to {transform: scale(1, 1);}
}
@-webkit-keyframes loader1 {
  from {-webkit-transform: scale(0, 0);}
  to {-webkit-transform: scale(1, 1);}
}
</style>
