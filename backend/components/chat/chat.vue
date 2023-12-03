<template>
   <v-menu
          style="display: none"
          min-width="300"
          top
          v-model="menu"
          :close-on-click="false"
          :close-on-content-click="false"
          :nudge-top="60"
          offset-x
        >
          <template v-slot:activator="{ on }">
            <v-fab-transition>
              <v-btn
                v-model="fab"
                v-on="on"
                color="red darken-1"
                @click="
                  fab = !fab;
                  menu = false;
                  message = false;
                  person = true;
                "
                dark
                fixed
                bottom
                right
                fab
              >
                <v-icon v-if="fab"> mdi-close </v-icon>
                <v-icon v-else> mdi-account-circle </v-icon>
              </v-btn>
            </v-fab-transition>
          </template>
          <add-group v-if="add_group" @back-home="backHome" @group-message="groupMessage"/>
          <chat-list :chat_rooms="chat_rooms" v-if="chat_l" @group-message="groupMessage" @close="closeMe" @signle-message="signleMessage" @add-group="addGroup" @unapproved-group="unapprovedGroup"/>
          <group-message :room="room" v-if="g_message"  @back-home="backHome" @new-member="newMember" @member_list="allMember"/>
          <signle-message :room="room" v-if="s_message" @back-home="backHome" @show-profile="showProfile"/>
          <add-member :room="room" v-if="add_member" @group-message="groupMessage" @back-group="groupMessage"/>
          <all-member :room="room" v-if="all_member" @back-group="groupMessage" @show-profile="showProfile"/>
          <chat-profile :user="user" v-if="profile" @back-home="backHome" @add-group="addGroup"/>
          <unapproved-group v-if="unapproved_group" @back-home="backHome" @unapproved-group="unapprovedGroup"/>
        </v-menu>
</template>

<script>
import AddGroup from "~/components/chat/AddGroup";
import ChatList from '~/components/chat/ChatList';
import GroupMessage from '~/components/chat/GroupMessage';
import SignleMessage from '~/components/chat/SignleMessage';
import AddMember from '~/components/chat/AddMember';
import AllMember from '~/components/chat/AllMember';
import ChatProfile from '~/components/chat/ChatProfile';
import UnapprovedGroup from '~/components/chat/UnapprovedGroup';

export default {
  components: {
    AddGroup,
    AllMember,
    ChatList,
    GroupMessage,
    SignleMessage,
    AddMember,
    ChatProfile,
    UnapprovedGroup
},
  name: "Chat",
  data() {
    return {
      fab: false,
      fab2: false,
      menu: false,
      menu2: false,
      menu3: false,
      g_message: false,
      s_message: false,
      profile:false,
      chat_l: true,
      add_group:false,
      all_member:false,
      add_member:false,
      unapproved_group:false,
      room:{},
      user: {},
      chat_rooms: []
    }
  },
  mounted() {
    this.getChatList();
    this.room = this.chat_rooms[0];
  },
  methods: {
    closeMe() {
      this.fab = !this.fab;
      this.menu = false;
      this.message = false;
      this.person = true;
    },
    getChatList() {
      this.$axios
        .get(`/get-chat-list`)
        .then((response) => {
          this.chat_rooms = response.data.data;
          console.log(response.data.data);
        })
        .catch((error) => {
          //console.log(error);
        })
    },
    unapprovedGroup() {
      this.unapproved_group = true;
      this.g_message = false;
      this.all_member=false
      this.s_message = false;
      this.add_group = false;
      this.chat_l = false;
      this.add_member = false;
      this.profile=false;
    },
    showProfile(user) {
      this.unapproved_group = false;
      this.g_message = false;
      this.all_member=false
      this.s_message = false;
      this.add_group = false;
      this.chat_l = false;
      this.add_member = false;
      this.profile=true;
      this.user = user;
    },
    newMember(id) {
      this.room=this.chat_rooms.find(room => room.id === id);
      this.g_message = false;
      this.unapproved_group = false;
      this.s_message = false;
      this.add_group = false;
      this.chat_l = false;
      this.profile=false;
      this.all_member=false
      this.add_member = true;
    },
    allMember(id) {
      this.room=this.chat_rooms.find(room => room.id === id);
      this.g_message = false;
      this.unapproved_group = false;
      this.s_message = false;
      this.add_group = false;
      this.chat_l = false;
      this.profile=false;
      this.all_member=true;
      this.add_member = false;
    },
    groupMessage(id, newGroup) {
      if (newGroup) {
        this.room = id;
      } else {
        this.room = this.chat_rooms.find(room => room.id == id.id);
      }
      console.log(this.room);
      //this.room = this.chat_rooms.find(room => room.id == id);
      this.all_member=false
      this.unapproved_group = false;
      this.g_message = true;
      this.s_message = false;
      this.add_group = false;
      this.chat_l = false;
      this.add_member = false;
      this.profile=false;
    },
    signleMessage(id, newChat) {
      if (newChat) {
        this.room = id;
      } else {
        this.room = this.chat_rooms.find(room => room.id == id);
      }
      this.all_member=false
      this.unapproved_group = false;
      this.g_message = false;
      this.s_message = true;
      this.add_group = false;
      this.chat_l = false;
      this.add_member = false;
      this.profile=false;
    },
    addGroup() {
      this.chat_l = false;
      this.unapproved_group = false;
      this.s_message = false;
      this.add_group = true;
      this.g_message = false;
      this.add_member = false;
      this.profile=false;
      this.all_member=false
    },
    backHome() {
      this.chat_l = true;
      this.unapproved_group = false;
      this.s_message = false;
      this.add_group = false;
      this.g_message = false;
      this.add_member = false;
      this.profile=false;
      this.all_member=false
    },
  }
}
</script>
<style scoped>
.chat-index .v-list-item__icon {
    align-self: flex-start;
    margin: 12px 0;
}
.message img {
  width: 100px;
}
.v-application .red.darken-1 {
  background-color: #ad0000 !important;
  border-color: #ad0000 !important;
}
</style>
