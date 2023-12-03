<template>
  <v-card
    class="chat_container_card chat_index"
    style="max-width: 430px; height: 400px; overflow: scroll"
  >
    <div class="chat_header">
      <v-row dense class="align-center justify-space-between">
        <div class="white--text" style="display: flex; padding: 15px 20px 0">
          <v-avatar size="50">
            <img src="/images/logo.png" />
          </v-avatar>

          <div>
            <strong class="ml-3 text-uppercase front-weight-bold"
              >Badhan</strong
            >
            <v-spacer></v-spacer>
            <span class="ml-3 caption">Blood Donor Organization</span>
          </div>
        </div>
        <div class="white--text chat_title text-right">
          <div>
            <v-btn width="30px" height="30px" fab color="transparent">
              <v-icon @click="$emit('close')" dark> mdi-minus </v-icon>
            </v-btn>
            <v-menu
              v-model="menu2"
              min-width="100"
              attach=".chat_index"
              bottom
              :close-on-click="true"
              :close-on-content-click="true"
              :nudge-bottom="30"
              :nudge-right="-165"
              offset-x
            >
              <template v-slot:activator="{ on }">
                <v-fab-transition>
                  <v-btn
                    v-model="fab2"
                    v-on="on"
                    @click="
                      fab2 = !fab2;
                      menu2 = false;
                    "
                    width="30px"
                    height="30px"
                    fab
                    color="transparent"
                  >
                    <v-icon dark> mdi-dots-vertical </v-icon>
                  </v-btn>
                </v-fab-transition>
              </template>
              <v-card>
                <v-list>
                  <v-list-item-group>
                    <v-list-item @click="$emit('add-group')">
                      <v-list-item-icon>
                        <v-icon> mdi-account-plus </v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title> Create a group</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item @click="$emit('unapproved-group')">
                      <v-list-item-icon>
                        <v-icon> mdi-account </v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>Unapproved Groups</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-card>
            </v-menu>
          </div>
        </div>
      </v-row>

      <v-row
        dense
        class="align-center"
        style="padding: 0 40px; text-align: center"
      >
        <v-col cols="12" class="white--text chat_title">
          <p class="m-0">একের রক্ত অন্যের জীবন রক্তই হোক আত্মার বাঁধন</p>
          <div>
            <v-icon
              dark
              style="
                position: absolute;
                z-index: 2;
                display: block;
                width: 2.375rem;
                height: 2.375rem;
                line-height: 32px;
                text-align: center;
                pointer-events: none;
                color: #aaa;
              "
            >
              mdi-search-web
            </v-icon>
            <input
            v-model="search"
              type="search"
              placeholder="Search"
              style="
                padding: 5px 5px 5px 35px !important;
                width: 100%;
                height: 30px;
                border-radius: 5px;
                outline: none;
                color: #ad0000;
                background-color: #fff;
              "
            />
          </div>
        </v-col>
      </v-row>
    </div>

    <v-divider></v-divider>
    <v-container class="chat-body">
      <div class="message_list">
        <v-list shaped>
          <v-list-item-group multiple>
            <template v-for="(room, i) in chat_list">
              <v-divider v-if="!room" :key="`divider-${i}`"></v-divider>

              <v-list-item
                v-else
                :key="i"
                :value="room.id"
                active-class="deep-purple--text text--accent-4"
              >
                <template v-if="room?.chat_group === null">
                  <v-list-item-avatar
                    size="48"
                    @click="$emit('signle-message', room.id, false)"
                  >
                    <img :src="room.sender?.image" />
                    <div v-if="isOnline(room.auth_id == room.receiver?.id ? room.sender?.id : room.receiver?.id)" class="online"></div>
                    <div v-else class="ofline"></div>
                  </v-list-item-avatar>
                  <v-list-item-content
                    @click="$emit('signle-message', room.id, false)"
                  >
                    <v-list-item-title>
                      {{
                        room.auth_id == room.receiver?.id
                          ? room.sender?.name
                          : room.receiver?.name
                      }}
                    </v-list-item-title>
                    <small>{{ room.single_message.slice(0, 40) }}</small>
                    <span class="time">12:00 am</span>
                  </v-list-item-content>
                </template>
                <template v-else-if="room.role_id">
                  <v-list-item-avatar
                    size="48"
                    @click="$emit('signle-message', room, true)"
                  >
                    <img :src="room.image" />
                    <!-- <div class="online"></div> -->
                    <!-- <div class="ofline"></div> -->
                  </v-list-item-avatar>
                  <v-list-item-content
                    @click="$emit('signle-message', room, true)"
                  >
                    <v-list-item-title>
                      {{
                        room.name
                      }}
                    </v-list-item-title>
                  </v-list-item-content>
                </template>
                <template v-else-if="room.messages">
                  <v-list-item-avatar
                    size="48"
                    @click="$emit('group-message', room, false)"
                  >
                    <img :src="room.image" />
                    <!-- <div class="online"></div> -->
                    <!-- <div class="ofline"></div> -->
                  </v-list-item-avatar>
                  <v-list-item-content @click="$emit('group-message', room, false)">
                    <v-list-item-title>
                      {{ room.name }}
                    </v-list-item-title>
                    <small>{{ room.group_message.slice(0, 40) }}</small>
                  </v-list-item-content>
                </template>
                <template v-else-if="room.chat_group">
                  <v-list-item-avatar
                    size="48"
                    @click="$emit('group-message', room, false)"
                  >
                    <img :src="room.chat_group?.image" />
                    <div></div>
                    <div class="ofline"></div>
                  </v-list-item-avatar>
                  <v-list-item-content @click="$emit('group-message', room, false)">
                    <v-list-item-title>
                      {{ room.chat_group?.name }}
                    </v-list-item-title>
                    <small>{{ room.group_message.slice(0, 40) }}</small>
                  </v-list-item-content>
                </template>
              </v-list-item>
            </template>
          </v-list-item-group>
        </v-list>
      </div>
    </v-container>
  </v-card>
</template>
<script>
export default {
  name: "chat-list",
  props: {
    chat_rooms: { type: Array, required: true },
  },
  emits: ["group-message", "signle-message", "add-group", "unapproved-group", 'close'],
  data() {
    return {
      fab2: false,
      menu2: false,
      add_group: false,
      lSingleMessage: "",
      lGroupMessage: "",
      search: "",
      members: [],
      chat_list: [],
      search_list: [],
      onlineUsers: []
    };
  },
  watch: {
      search(value) {
        if (value.length >= 3) {
          setTimeout(() => {
            this.getMembers();
          }, 500)
        } else {
          this.chat_list = this.chat_rooms;
        }
      }
    },
  mounted() {
    window.Echo.join(`message-channel-online`)
      .here(users=>{
        this.onlineUsers = users.map(item=>item.id);
        // let ids = users.map(item=>item.id)
      })
      .joining(user => {
     
      })
      .leaving(user => {
        // let index = this.online_users.findIndex(item=>item === user.id)
      });

    this.chat_list = this.chat_rooms
  },
  methods: {
    isOnline(id) {
      return true;
    },
    getMembers() {
      // let url = search ?  `/committee-member?search=${search}` : '/committee-member';
      this.$axios.get(`/committee-member-with-group?search=${this.search}`)
      //this.$axios.get(`/committee-member?search=${this.search}`)
        .then((response) => {
         // console.log(response.data.data);
          this.search_list = response.data.data;
          this.chat_list = this.search_list;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    lastSingleMessage(id) {
      this.$axios
        .get(`/get-last-single-message/${id}`)
        .then((response) => {
          return response.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    lastGroupMessage(id) {
      this.$axios
        .get(`/get-last-group-message/${id}`)
        .then((response) => {
          return response.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
