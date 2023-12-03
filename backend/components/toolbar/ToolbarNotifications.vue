<template>
  <v-menu offset-y left transition="slide-y-transition">
    <template v-slot:activator="{ on }">
      <v-badge
        bordered
        color="yellow"
        text-color="red"
        :content="counter"
        offset-x="22"
        offset-y="22"
      >
        <v-btn icon v-on="on">
          <v-icon color="black">mdi-bell-outline</v-icon>
        </v-btn>
      </v-badge>
    </template>

    <!-- dropdown card -->
    <v-card>
      <v-list three-line dense max-width="400" class="overflow-y-auto" style="max-height: 400px !important;">
        <v-subheader class="pa-2 font-weight-bold">Notifications</v-subheader>
        <div v-for="(item, index) in notifications" :key="index">
          <v-divider v-if="index > 0 && index < notifications.length" inset></v-divider>

          <v-list-item @click="seenNotification(item.id,index,item.link)" :style="item.is_seen?'background-color:white':'background-color:#8b81819e'">
            <v-list-item-avatar size="32" :color="'success'">
              <v-icon small>{{ 'mdi-account-circle' }}</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-text="item.subject"></v-list-item-title>
              <v-list-item-subtitle class="caption" v-text="item.message"></v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action class="align-self-center">
              <v-list-item-action-text>{{ moment(item.created_at).startOf('day').fromNow() }}</v-list-item-action-text>
            </v-list-item-action>
          </v-list-item>
        </div>
      </v-list>

<!--      <div class="text-center py-2">
        <v-btn small>See all</v-btn>
      </div>-->
    </v-card>
  </v-menu>
</template>

<script>
/*
|---------------------------------------------------------------------
| Toolbar Notifications Component
|---------------------------------------------------------------------
|
| Quickmenu to check out notifications
|
*/
import {common as commonMixin} from "@/mixins/common";
import {mapGetters} from "vuex";
import notifications from "@/store/user/notifications";
import moment from "moment-timezone";
const permission = ''
const stateName = 'notifications'
const storeName='user/notifications'

export default {
  name: 'Notification',
  mixins: [commonMixin],
  data() {
    return {
      moment,
      pageInfo: {
        pageName: 'Notifications',
        apiUrl: '/user/notification/',
        permission: ''
      },
      state: {
        name: stateName,
        store_name: storeName,
      },
      counter:0,
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
    }
  },
  computed:{
    ...mapGetters('user/notifications',['notifications','totalItems']),
  },
  watch:{
    notifications: {
      handler() {
        this.counter = this.notifications.filter(item=>item.is_seen == false).length;
      },
      deep: true
    },
  },
  async mounted() {
    this.loader.isLoading = true
    await this.init();
    window.Echo.private(`user-channel-${this.$auth.user.id}`)
      .listen('UserNotifyEvent', (response) => {
        //console.log(response);
        let payload = {stateName:stateName, data:response }
        this.$store.commit('user/notifications/INSERT_NEW_ITEMS', payload)
      });
    window.Echo.private(`user-channel-${this.$auth.user.id}`)
      .listen('CommonNotifyEvent', (response) => {
        //console.log(response);
        let payload = {stateName:stateName, data:response }
        this.$store.commit('user/notifications/INSERT_NEW_ITEMS', payload)
      });
    window.Echo.private(`admin-notify-channel-${this.$auth.user.id}`)
      .listen('CommonNotifyEvent', (response) => {
        //console.log(response);
        let payload = {stateName:stateName, data:response }
        this.$store.commit('user/notifications/INSERT_NEW_ITEMS', payload)
      });
    this.loader.isLoading = false
  },
  methods:{
    async init() {
      this.loader.isLoading = true
      let url = `${this.pageInfo.apiUrl}?per_page=10&page=1`
      const payload = {apiUrl: url, stateName}
      await this.$store.dispatch(storeName+'/getItems', payload)
      this.loader.isLoading = false
    },
    async seenNotification(id,index,link=null){
      await this.$axios.post(`/update/push/notification/${id}`).then(()=>{
        const payload = {index, stateName, name:'is_seen', value:true}
        this.$store.commit(storeName + '/STATUS_CHANGE', payload)
      }).catch(()=>{
        //noting to say
      }).finally(()=>{
        if (link) this.$router.push(link)
      })
    }
  }
}
</script>
