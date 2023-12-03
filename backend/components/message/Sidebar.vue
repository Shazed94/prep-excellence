<template>
  <v-col cols="12" md="4">
    <v-app-bar flat class="custom-color">
<!--      <v-btn class="custom-color"
             tile x-medium>
        <v-icon large left>
          mdi-plus-circle
        </v-icon>
        New Conversation
      </v-btn>-->
      Chat
    </v-app-bar>
    <v-app-bar flat color="rgba(0,0,0,0)">
      <v-toolbar-title class="title">
        Chat
      </v-toolbar-title>

      <v-spacer></v-spacer>
      <v-btn
        icon
      >
        <v-icon>mdi-ellipsis-h</v-icon>
      </v-btn>
    </v-app-bar>
    <v-app-bar flat color="rgba(0,0,0,0)">
      <v-text-field
        label="Search Here"
        append-icon="mdi-magnify"
        color="grey"
        v-model="search"
      ></v-text-field>
    </v-app-bar>
    <v-list two-line color="rgba(0,0,0,0)">
      <v-list-item-group
        v-model="selected2"
        active-class="blue lighten-4"
      >
        <v-virtual-scroll
          :items="users"
          :item-height="65"
          height="450"
        >
          <template v-slot="{ item, index }">
            <v-list-item :key="item.id">
              <v-badge
                bordered
                bottom
                :color="is_online(item.id) ? 'green':'gray'"
                dot
                offset-x="22"
                offset-y="26"
              >
                <v-list-item-avatar>
                  <v-img :src="item.image"></v-img>
                </v-list-item-avatar>
              </v-badge>
              <template >
                <v-list-item-content  @click="selected=item.id">
                  <v-list-item-title>
                    {{ item.name }}
                    <v-badge v-if="item.receive_messages_unseen_count && item.receive_messages_unseen_count > 0" class="ml-1" color="yellow"
                             text-color="red" :content="item.receive_messages_unseen_count"></v-badge>
                  </v-list-item-title>
                  <v-list-item-subtitle v-text="item.title"></v-list-item-subtitle>
                </v-list-item-content>
              </template>
            </v-list-item>

            <v-divider
              v-if="index < users.length - 1"
              :key="index"
            ></v-divider>
          </template>
        </v-virtual-scroll>
      </v-list-item-group>
    </v-list>
  </v-col>
</template>
<script>
import {mapGetters} from "vuex";
const stateName = 'users'
const storeName='message/message'

export default {
  name:'SidebarLeft',
  data: () => ({
    selected: null,
    selected2: null,
    search:'',
    show: false,
    marker: true,
    iconIndex: 0,
    pageInfo: {
      apiUrl: '/chat-user/',
    },
    state: {
      name: stateName,
      store_name: storeName,
    },
    loader: {isLoading: false, isSubmitting: false, isDeleting: false},
  }),
  computed: {
    ...mapGetters('message/message',['users','online_users','is_online'])
  },
  async mounted() {
    this.changeUser()
    await this.init()
  },
  watch:{
    selected2(){
        this.changeUser()
    },
    selected(){
      if (this.selected){
        let payload = {stateName, name:'receive_messages_unseen_count', id:this.selected, value:0 }
        this.$store.commit('message/message/UPDATE_MESSAGE_COUNTER',payload)
        this.seenMessage(this.selected)
        this.getDashboard()
      }
    },
    search(value, oldVal) {
      if ((value.length >= 2) || oldVal.length >= 1) {
        if (this.timeout) {
          clearTimeout(this.timeout)
        }
        this.timeout = setTimeout(() => {
          this.init()
        }, 300)
      }
    },
  },
  methods:{
    async init() {
      this.loader.isLoading = true
      let url =this.pageInfo.apiUrl;
      if (this.search) url += '?search='+this.search
      const payload = {apiUrl: url, stateName}
      await this.$store.dispatch(storeName+'/getItems2', payload)
      this.loader.isLoading = false
    },
    async getDashboard(){
      const payload0 = { apiUrl: "/dashboard/report", stateName: "dashboard" };
      await this.$store.dispatch("user/basic/getItems", payload0);
    },
    changeUser(){
      let user={}
      if (this.selected2 >=0 && this.selected){
        let index = this.users.findIndex(item=>item.id === this.selected);
        if(index >=0 )user = this.users[index]
      }
      const payload={stateName:'selected_user', data:user }
      this.$store.commit('message/message/SET_ITEMS',payload)
    },
    async seenMessage(sender_id){
      await this.$axios.post(`/user/seen/message/sender/${sender_id}`)
    }
  }

};
</script>
<style scoped>
.border {
  border-right: 1px solid grey;
}
.custom-color{
  background-color: rgb(47 148 209) !important;
  color: white !important;
}
</style>
