<template>
  <v-card  class="chat_container_card chat_add_group" style="max-width: 430px; height: 400px; overflow: scroll;">
    <div class="chat_header">
      <v-row dense class="align-center justify-space-between">
        <v-col cols="10"
          class="mb-0 white--text"
          style="display: flex; padding: 10px"
          >
          <v-img
            style="border-radius: 50%; max-width: 60px;"
            :src="room.chat_group.image"
          ></v-img>
          <div class="ml-1">
            <strong class="front-weight-bold" style="font-size: 14px;position: relative;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2; -webkit-box-orient: vertical;">
              {{room.chat_group.name}}
            </strong
            >
            <v-spacer></v-spacer>

            <v-avatar size="30" v-for="(member,i) in room.chat_group?.chat_group_users.slice(0,3)" :key="i">
              <img
                :src="member.img"
                :alt="member.name"
              >
            </v-avatar>

            <v-avatar size="30" color="white" v-if="totalUsersAmount > 3">
              <span class="black--text text-h5 more_person">+{{ totalUsersAmount - 3 }}</span>
            </v-avatar>
          </div>
        </v-col>

        <v-col cols="2">
            <div class="white--text chat_title">
              <div class="d-flex">
                <v-btn
                  @click="$emit('back-group', room)"
                  width="30px"
                  height="30px"
                  fab
                  color="transparent"
                  >
                  <v-icon dark> mdi-arrow-left-bold </v-icon>
                </v-btn>
                  <v-menu
                    v-model="menu3"
                    min-width = 100
                    attach=".chat_message_con"
                    bottom

                    :close-on-click="true"
                    :close-on-content-click="true"
                    :nudge-bottom="30"
                    :nudge-right="-150"
                    offset-x
                  >
                      <template v-slot:activator="{ on }">
                      <v-fab-transition>
                        <v-btn
                          v-model="fab2"
                          v-on="on"
                          @click="fab2 = !fab2; menu3 = false"
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
                            <v-list-item>
                              <v-list-item-icon>
                                <v-icon> mdi-account-plus </v-icon>
                              </v-list-item-icon>
                              <v-list-item-content>
                                <v-list-item-title> Add to Group</v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                          </v-list-item-group>
                        </v-list>
                      </v-card>
                  </v-menu>
              </div>
            </div>
        </v-col>
      </v-row>

      <v-row
        dense
        class="align-center"
        style="padding: 0 40px; text-align: center"
      >
        <v-col cols="12" class="white--text chat_title">
          <p class="m-0">
           All Member
          </p>
        </v-col>
      </v-row>
    </div>

    <v-divider></v-divider>
    <v-container class="chat-body">
      <form @submit.prevent="submit">

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
            type="text"
            placeholder="Search"
            style="
              padding: 5px 5px 5px 35px !important;
              width: 100%;
              height: 30px;
              border-radius: 5px;
              outline: none;
              color: #ad0000;
              border: 1px solid;
              background-color: #fff;
            "
          />
        </div>
        <v-list flat>
          <v-list-item-group

            color="indigo"
          >
            <v-list-item
              v-for="(item, i) in groupMembers"
              :key="i"
              @click="$emit('show-profile', item.user)"
            >
              <v-list-item-avatar @click="$emit('show-profile', item.user)">
                <v-img :src="item.user?.image"></v-img>
              </v-list-item-avatar>
              <v-list-item-content @click="$emit('show-profile', item.user)">
                <v-list-item-title v-text="item.user?.name"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>


      </form>
    </v-container>
  </v-card>
</template>
<script>
export default {
name:"all-member",
props:{
  room: { type: Object, required: true },
},
data() {
  return {
    menu3: false,
    fab2: false,
   groupMembers: [],
   totalUsersAmount: 0
 }
},
mounted() {
  this.getGroupMembers();
  this.getUsersAmount();
},
methods: {
  getUsersAmount() {
      this.totalUsersAmount = this.room.chat_group?.chat_group_users.length
  },
  getGroupMembers() {
    this.groupMembers = this.room.chat_group?.chat_group_users
  }
},
emits:['back-group', 'show-profile']
}
</script>
<style scoped>

</style>
