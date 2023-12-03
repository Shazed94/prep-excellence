<template>
  <v-card
    class="chat_container_card chat_add_group"
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
        <div class="white--text chat_title text-right d-flex">
          <v-btn
            @click="$emit('back-home')"
            width="30px"
            height="30px"
            fab
            color="transparent"
          >
            <v-icon dark> mdi-arrow-left-bold </v-icon>
          </v-btn>
          <div>
            <!-- <v-btn width="30px" height="30px" fab color="transparent">
                      <v-icon dark> mdi-account-multiple-plus </v-icon>
                    </v-btn> -->

            <v-menu
              v-model="menu2"
              min-width="100"
              attach=".chat_add_group"
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
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon> mdi-account-plus </v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title> Create a group</v-list-item-title>
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
          <p class="m-0">Create Group</p>
        </v-col>
      </v-row>
    </div>

    <v-divider></v-divider>
    <v-container class="chat-body">
      <form @submit.prevent="AddGroup">
        <div class="py-2 subtitle-1">Group Image :</div>
        <v-file-input
          label="Image"
          filled
          prepend-icon="mdi-camera"
          outlined
          dense
          hide-details="auto"
          single-line
          small-chips
          v-model="file"
        />
        <div class="py-2 subtitle-1">Group Name :</div>
        <v-text-field
          outlined
          filled
          dense
          hide-details="auto"
          label="Group name"
          v-model="name"
        ></v-text-field>
        <div class="mt-2">
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
          <v-list-item-group multiple>
            <template v-for="(item, i) in members">
              <v-divider v-if="!item" :key="`divider-${i}`"></v-divider>

              <v-list-item
                v-else
                :key="`item-${i}`"
                :value="item.id"
                active-class="deep-purple--text text--accent-4"
              >
                <template v-slot:default="{ active }">
                  <v-list-item-avatar>
                    <v-img :src="item.user?.image"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content @click.prevent="addMembers(item.user_id)">
                    <v-list-item-title v-text="item.user?.name"></v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-checkbox
                      :input-value="active"
                      color="deep-purple accent-4"
                      style="display: none"
                    ></v-checkbox>
                  </v-list-item-action>
                </template>
              </v-list-item>
            </template>
          </v-list-item-group>
        </v-list>
        <div class="text-center">
          <v-btn
            :disabled="selectedMembers.length == 0"
            class="mr-4 pa-2"
            height="35px"
            type="submit"
            color="#ad0000"
            style="width: 40%; font-size: 20px"
          >
            Create Group
          </v-btn>
        </div>
      </form>
    </v-container>
  </v-card>
</template>
<script>
export default {
  name: "add-group",
  data() {
    return {
      fab2: false,
      menu2: false,
      members: [],
      name: '',
      file: '',
      selectedMembers: [],
      search: ''
    };
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
    AddGroup() {
      let data =new FormData();
      data.append('name', this.name)
      data.append('file', this.file)
      data.append('user_id', this.selectedMembers)
      this.$axios
        .post(`/add-group`, data)
        .then((response) => {
          this.name = '';
          this.file = '';
          this.selectedMembers = [];
          this.$toaster.success(response.data.message);
          //this.$emit('back-home');
          this.$emit('group-message', response.data.data, true);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getMembers(search) {
      let url = search ?  `/committee-member?search=${search}` : '/committee-member';
      this.$axios
        .get(`${url}`)
        .then((response) => {
          //console.log(response.data.data);
          this.members = response.data.data;
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
  emits: ["back-home", "group-message"],
};
</script>
