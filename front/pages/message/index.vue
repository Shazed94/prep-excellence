<template>
  <div class="user-dashboard-area">
    <div class="btcontainer">
      <div class="up_wrap">
        <div class="btrow">
          <Sidebar1></Sidebar1>
          <div class="btcol-md-9 mt-2">
            <v-row dense>
              <sidebar></sidebar>
              <v-col cols="12" md="7" sm="12" xs="12">
                <v-card>
                  <message-header class="custom-color"></message-header>
                  <v-divider></v-divider>
                  <v-card flat
                          v-scroll.self="onScroll"
                          class="overflow-y-auto chat-screen"
                          max-height="490" min-height="490" id="message_scroll" ref="messagesContainer">
                    <template v-if="selected_user.id">
                      <v-card-text v-for="(item,i) in messages" :key="i">
                        <v-list-item three-line
                                     :key="i"
                                     v-if="item.sender_id != $auth.user.id"
                                     class=""
                        >
                          <v-list-item-avatar class="align-self-start mr-2">
                            <v-avatar size="40">
                              <v-img :src="selected_user.image"></v-img>
                            </v-avatar>
                          </v-list-item-avatar>
                          <v-list-item-content class="received-message">
                            <v-card color="grey lighten-3" class="flex-none">
                              <v-card-text class=" pa-1 d-flex flex-column">
                                <span class="text-caption">{{selected_user.name}} </span>
                                <span class="align-self-start text-subtitle-1">{{ item.message }}</span>
                                <span class="text-caption font-italic align-self-end">{{item.time}}</span>
                              </v-card-text>
                            </v-card>
                          </v-list-item-content>
                        </v-list-item>
                        <v-list-item v-else :key="i">
                          <v-list-item-content class="sent-message justify-end">
                            <v-card color="light-blue accent-3" class="flex-none">
                              <v-card-text class="pa-1 d-flex flex-column">
                                <span class="text-subtitle-1 chat-message">{{ item.message }}</span>
                                <span class="text-caption font-italic align-self-start">{{item.time}}</span>
                              </v-card-text>
                            </v-card>
                          </v-list-item-content>
                          <v-list-item-avatar class="align-self-start ml-2">
                            <v-img :src="$auth.user.image"></v-img>
                          </v-list-item-avatar>
                        </v-list-item>
                      </v-card-text>
                    </template>
                  </v-card>
                  <message-write class="mt-2"></message-write>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
import BreadCrumbs from "@/components/common/BreadCrumbs";
import Sidebar from "@/components/message/Sidebar";
import Sidebar1 from "@/components/user/Sidebar"
import SidebarRight from "@/components/message/SidebarRight";
import MessageHeader from "@/components/message/MessageHeader";
import MessageBody from "@/components/message/MessageBody";
import MessageWrite from "@/components/message/MessageWrite";
import {mapGetters} from "vuex";
const stateName = 'messages'
const storeName='message/message'
export default {
  name:'message',
  auth:true,
  components:{BreadCrumbs, Sidebar, SidebarRight, MessageHeader, MessageBody, MessageWrite, Sidebar1},
  data: () => ({
    pageInfo: {
      pageName: 'Message',
      apiUrl: '/chat/',
    },
    state: {
      name: stateName,
      store_name: storeName,
    },
    loader: {isLoading: false, isSubmitting: false, isDeleting: false},
    scrollInvoked: 0,
    active: false,
    activeUser:'',
    sc_top:false
  }),
  mounted() {
    //var container = this.$el.querySelector("#message_scroll");
    //container.scrollTop = container.scrollHeight;
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
        if (message.sender_id === this.selected_user.id){
          let payload = {stateName:'messages',data:message}
          this.$store.commit('message/message/INSERT_NEW_ITEMS',payload)
        }else {
          console.log(message)
        }
    }).listenForWhisper('typing',user=> {
      console.log('typing')
      //this.active = true;
      //this.activeUser =user;
    });

  },
  watch:{
    messages(){
      if(this.selected_user.id) this.$nextTick(() => this.scrollToEnd());
    },
    selected_user(){
      this.init()
      if(this.selected_user.id) this.scrollToEnd()
    }
  },
  computed: {
    ...mapGetters('message/message',['messages','totalItems','selected_user','online_users','is_online'])
  },
  methods: {
    async init() {
      if (this.selected_user.id){
        this.loader.isLoading = true
        let url = this.pageInfo.apiUrl+`by/${this.selected_user.id}`
        const payload = {apiUrl: url, stateName}
        await this.$store.dispatch(storeName+'/getItems', payload)
        this.loader.isLoading = false
      }
    },
    onScroll () {
      this.scrollInvoked++
    },
    scrollToEnd() {
      if (!this.sc_top){
        this.sc_top=true
        //var content = this.$refs.messagesContainer;
        //content.scrollTop = content.scrollHeight
        let container = this.$el.querySelector("#message_scroll");
        let hg = container.scrollHeight
        if(hg) container.scrollTop = hg;
      }
    }
  },

};
</script>
<style scoped>
.chat-message {
  display: unset !important;
  white-space: break-spaces;
}
.chat-screen {
  max-height: 500px;
  overflow-y: auto;
}
.flex-none {
  flex: unset;
}
.custom-color{
  background-color: rgb(47 148 209) !important;
  color: white !important;
}
/*
.received-message::after {
  content: ' ';
  position: absolute;
  width: 0;
  height: 0;
  left: 54px;
  right: auto;
  top: 12px;
  bottom: auto;
  border: 12px solid;
  border-color: #0c4b56 transparent transparent transparent;
}
.sent-message::after {
  content: ' ';
  position: absolute;
  width: 0;
  height: 0;
  left: auto;
  right: 54px;
  top: 12px;
  bottom: auto;
  border: 12px solid;
  border-color: #646464 transparent transparent transparent;
}
*/

</style>
