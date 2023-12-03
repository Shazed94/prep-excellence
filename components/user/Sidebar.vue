<template>
<v-col cols="12" md="3">
  <user-card/>
  <v-card
    class="mx-auto mt-3"
    max-width="300"
    title
  >
    <v-list shaped>
      <v-list-item-group
        v-model="selectedItem"
        color="primary"
      >
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.url"
          v-if="(item.role_id && item.role_id === $auth.user.role_id) || !item.role_id"
        >
          <v-list-item-icon>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.text }} <v-badge v-if="item.badge && item.content" class="ml-1" color="green" :content="item.content"></v-badge></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="logout()">
          <v-list-item-icon>
            <v-icon v-text="'mdi-logout'"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ 'Logout' }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
</v-col>

</template>
<script>
import UserCard from "@/components/user/UserCard";
import {mapGetters} from "vuex";
const stateName = 'dashboard'
const storeName='user/basic'
export default {
  name:'Sidebar',
  components: {UserCard},
  data(){
    return{
      selectedItem: 0,
      items: [],
      pageInfo: {
        pageName: 'Student Tests',
        apiUrl: '/student/dashboard/info',
      },
      state: {
        name: stateName,
        store_name: storeName,
      },
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
    }
  },
  mounted() {
    if (this.dashboard && !Object.keys(this.dashboard).length) this.init()
    if (!this.items.length) this.menu()
  },
  watch:{
    dashboard(){
      this.menu();
    }
  },
  computed: {
    ...mapGetters('user/basic',['dashboard']),
  },
  methods:{
    logout(){
      this.$auth.logout()
    },
    menu(){
      this.items = [
        { text: 'Dashboard', icon: 'mdi-view-dashboard', url: '/user-dashboard', badge:false, role_id:false },
        { text: 'Profile', icon: 'mdi-account-circle-outline', url: '/user/profile', badge:false, role_id:false },
        { text: 'Courses', icon: 'mdi-book-open-blank-variant', url: '/student/course', badge:true,content: this.dashboard.total_active, role_id:false},
        { text: 'Homeworks', icon: 'mdi-book-open-page-variant-outline', url: '/student/homeWork', badge:true,content: this.dashboard.home_work, role_id:false},
        { text: 'Course Materials', icon: 'mdi-book-open-variant', url: '/student/courseMaterial', badge:true, content: this.dashboard.course_material, role_id:false},
        { text: 'Attendance', icon: 'mdi-book-account-outline', url: '/student/attendance', badge:false, role_id:false },
        { text: 'Tests & Results', icon: 'mdi-file-account', url: '/student/exam/exam', badge:true, content: this.dashboard.exams, role_id:3},
        { text: 'Results', icon: 'mdi-file-account', url: '/parent/result', badge:true, content: this.dashboard.exams, role_id:4},
        { text: 'Orders', icon: 'mdi-shopping', url: '/student/payment-history', badge:true, content: this.dashboard.payments, role_id:3},
        { text: 'Tutoring Request', icon: 'mdi-shopping-search-outline', url: '/student/tutoringRequest', badge:false, role_id:3},
        { text: 'Calender', icon: 'mdi-calendar', url: '/student/schedule', badge:false, role_id:false },
        { text: 'Message', icon: 'mdi-chat-processing', url: '/message', badge:false, role_id:false },
        { text: 'Complain', icon: 'mdi-alert-circle-outline', url: '/common/complain', badge:true, content: this.dashboard.complain, role_id:false },
        { text: 'Change Password', icon: 'mdi-lock', url: '/student/change-password', badge:false, role_id:false },
        /*{ text: 'Profile', icon: 'mdi-account-circle' , url: ''},*/
      ]
    },
    async init() {
      this.loader.isLoading = true
      let url = `${this.pageInfo.apiUrl}`
      const payload1 = {apiUrl: url, stateName}
      await this.$store.dispatch(storeName+'/getItems', payload1)
      this.loader.isLoading = false
    },
  },

}

</script>
