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
            <v-btn
            @click="$emit('back-home')"
            width="30px"
            height="30px"
            fab
            color="transparent"
          >
            <v-icon dark> mdi-arrow-left-bold </v-icon>
          </v-btn>
            <!-- <v-btn width="30px" height="30px" fab color="transparent">
                      <v-icon dark> mdi-account-multiple-plus </v-icon>
                    </v-btn> -->
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
          <p class="m-0">Unapproved Group List</p>
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
            <template v-for="(room, i) in unapproved_groups">
              <v-divider v-if="!room" :key="`divider-${i}`"></v-divider>

              <v-list-item
                v-else
                :key="i"
                :value="room.id"
                active-class="deep-purple--text text--accent-4"
              >
                <template>
                  <v-list-item-avatar size="48" @click="showModal(room.id)">
                    <img :src="room.image" />
                  </v-list-item-avatar>
                  <v-list-item-content @click="showModal(room.id)">
                    <v-list-item-title>
                      {{ room.name }}
                    </v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-list-item>
            </template>
          </v-list-item-group>
        </v-list>
      </div>

      <template>
        <v-row justify="center">
          <v-dialog v-model="dialog" persistent max-width="350">
            <v-card style="padding: 10px">
              <v-card-title
                class="text-h5"
                style="text-align: center !important; position: relative;"
              >
              <span style="position: absolute; right: 5px; top: 5px; cursor: pointer;" @click="dialog = false">x</span>
                <h3>Are you sure?</h3>
                <small>You won't be able to revert this!</small>
              </v-card-title>
              <div style="display: flex; justify-content: center">
                <v-btn color="red darken-1" text @click="DeleteMe">
                  Delete
                </v-btn>
                <v-btn color="green darken-1" text @click="approveMe">
                  Approve
                </v-btn>
              </div>
            </v-card>
          </v-dialog>
        </v-row>
      </template>
    </v-container>
  </v-card>
</template>
<script>
export default {
  name: "unapproved-group",
  data() {
    return {
      dialog: false,
      fab2: false,
      menu2: false,
      add_group: false,
      lSingleMessage: "",
      lGroupMessage: "",
      search: "",
      members: [],
      unapproved_groups: [],
      selectedId: "",
    };
  },
  watch: {
    search(value) {
      if (value.length >= 3) {
        setTimeout(() => {
          this.init();
        }, 500);
      } else {
        this.init();
      }
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    approveMe() {
      this.$axios
        .get(`/approve-group/${this.selectedId}`)
        .then((response) => {
          this.$toaster.success(response.data.message);
          this.init();
          this.dialog = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    DeleteMe() {
      this.$axios
        .get(`/delete-group/${this.selectedId}`)
        .then((response) => {
          this.$toaster.success(response.data.message);
          this.init();
          this.dialog = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    showModal(id) {
      this.selectedId = id;
      this.dialog = true;
    },
    init() {
      this.$axios
        .get(`/unapproved-group?search=${this.search}`)
        .then((response) => {
          this.unapproved_groups = response.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  emits:['back-home']
};
</script>
