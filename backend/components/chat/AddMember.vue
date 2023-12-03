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
            :src="room?.img"
          ></v-img>
          <div class="ml-1">
            <strong class="front-weight-bold" style="font-size: 14px;position: relative;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2; -webkit-box-orient: vertical;">
              {{room.chat_group.name}}
            </strong
            >
            <v-spacer></v-spacer>

            <v-avatar size="30" v-for="(member,i) in room.chat_group?.chat_group_users?.slice(0,3)" :key="i">
              <img
                :src="member.user.image"
                :alt="member.user.name"
              >
            </v-avatar>

            <v-avatar size="30" color="white" v-if="room.chat_group?.chat_group_users.length > 3">
              <span class="black--text text-h5 more_person"> 3+</span>
            </v-avatar>
          </div>
        </v-col>

        <v-col cols="2">
            <div class="white--text chat_title">
              <div class="d-flex">
                <v-btn
                  @click="$emit('back-group',room.id, true)"
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
           Add New Member
          </p>
        </v-col>
      </v-row>
    </div>

    <v-divider></v-divider>
    <v-container class="chat-body">
      <form @submit.prevent="update">

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
        <v-list shaped>
          <v-list-item-group

            multiple
            >
            <template v-for="(item, i) in groupMembers">
              <v-divider
                v-if="!item"
                :key="`divider-${i}`"
              ></v-divider>

              <v-list-item
                v-else
                :key="i"
                :value="item.id"
                active-class="deep-purple--text text--accent-4"
              >
                <template v-slot:default="{ active }">
                  <v-list-item-avatar>
                    <v-img :src="item.user.image"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content @click.prevent="addMembers(item.user_id)">
                    <v-list-item-title v-text="item.user.name"></v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-checkbox
                      :input-value="active"
                      style="display:none"
                      color="deep-purple accent-4"
                    ></v-checkbox>
                  </v-list-item-action>
                </template>
              </v-list-item>
            </template>
          </v-list-item-group>
        </v-list>
        <div class="text-center">
          <v-btn
            class="mr-4 pa-2"
            height="35px"
            type="submit"
            color="#ad0000"
            style="width: 40%; font-size: 20px"
          >
            Update
          </v-btn>
        </div>
      </form>
    </v-container>
  </v-card>
</template>
<script>
export default {
name:"add-member",
props:{
  room: { type: Object, required: true },
},
data() {
  return {
    menu3: false,
    fab2: false,
    groupMemberss: [
     {
       id:1,
       name:'hossain',
       image:'/images/logo.png'
     },
     {
       id:1,
       name:'hossain',
       image:'/images/logo.png'
     },
     {
       id:1,
       name:'hossain',
       image:'/images/logo.png'
     },
     {
       id:1,
       name:'hossain',
       image:'/images/logo.png'
     },
     {
       id:1,
       name:'hossain',
       image:'/images/logo.png'
     },
     {
       id:1,
       name:'hossain',
       image:'/images/logo.png'
     },
     {
       id:1,
       name:'hossain',
       image:'/images/logo.png'
     },
     {
       id:1,
       name:'hossain',
       image:'/images/logo.png'
     },

   ],
   groupMembers: [],
   selectedMembers: [],
   search: ''
 }
},
watch: {
    search(value) {
      if (value.length >= 3) {
        setTimeout(() => {
          this.getMembers(this.search)
        }, 500)
      }
    }
  },
mounted() {
  this.getMembers(null);
},
methods: {
  update() {
    let data =new FormData();
      data.append('user_id', this.selectedMembers)
      this.$axios
        .post(`/update-group/${this.room?.chat_group?.id}`, data)
        .then((response) => {
          this.selectedMembers = [];
          //console.log(response);
          this.$toaster.success(response.data.message);
          this.$emit('group-message', response.data.data, true);
          //this.$emit('back-group');
        })
        .catch((error) => {
          //console.log(error);
        });
  },
  getMembers(search) {
      let url = search ?  `/committee-member?search=${search}` : '/committee-member';
      this.$axios
        .get(`${url}`)
        .then((response) => {
          this.groupMembers = response.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    addMembers(id) {
      if (this.selectedMembers.includes(id)) {
        return;
      }

      this.selectedMembers.push(id);
    }
},
emits:['back-group', "group-message"]

}
</script>
