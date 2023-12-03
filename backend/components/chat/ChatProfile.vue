<template>
  <v-card  class="chat_container_card chat_profile" style="max-width: 430px; height: 400px; overflow: scroll;">
    <div class="chat_header">
      <v-row dense class="align-center justify-space-between">
        <v-col cols="9">
          <div class="white--text" style="display: flex; padding: 15px 20px 0;">
            <v-avatar size="35">
              <img
                src="/images/logo.png"
              />
            </v-avatar>
            <div style="width: 80%;text-align: center;">
              <strong class="ml-3 text-uppercase front-weight-bold">Profile</strong>
              <v-spacer></v-spacer>
            </div>
          </div>
        </v-col>
        <v-col cols="3">
          <div class="white--text chat_title text-right d-flex justify-end">
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

              <v-menu
                v-model="menu2"
                min-width="100"
                attach=".chat_profile"
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
                          <v-list-item-title>
                            Create a group</v-list-item-title
                          >
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


    </div>

    <v-divider></v-divider>
    <v-container class="chat-body">
      <div  class="text-center">
        <v-avatar size="100" style="border: 2px solid #ad0000;">
          <img
          :src="user.image"
          />
        </v-avatar>
      </div>
      <div class="text-center">
        <strong class="front-weight-bold headline" style="color:#ad0000">{{ user.name }}</strong>
        <div class="front-weight-bold title">Blood Group : {{ user.blood_group?.name }}</div>
      </div>
      <div class="text-center">
        <v-btn
          icon
          width="30px"
          height="30px"
          fab
          style="background-color:#11d719"
          color="#11d719"
          >
          <v-icon  style="font-size:20px;"> mdi-phone </v-icon>
          </v-btn>
          <!-- <v-btn
          icon
          width="40px"
          height="40px"
          fab
          color="transparent"
          >
          <v-icon color="blue" style="width:40px;height:40px;font-size:40px;"> mdi-chat-processing </v-icon>
          </v-btn> -->
      </div>
      <div class="front-weight-bold body-1 py-1 mt-1" style="border-bottom: 1px solid #bf0b0b;border-top: 1px solid #bf0b0b;">
        <strong>Name :</strong>  {{ user.name }}
      </div>
      <div class="front-weight-bold body-1 py-1" style="border-bottom: 1px solid #bf0b0b;">
        <strong>Mobile Number :</strong>  {{ user.phone_number }}
      </div>
      <div class="front-weight-bold body-1 py-1" style="border-bottom: 1px solid #bf0b0b;">
        <strong>Email :</strong>  {{ user.email }}
      </div>
      <!-- <div class="front-weight-bold body-1 py-1" style="border-bottom: 1px solid #bf0b0b;">
        <strong>Current Address :</strong>  H-26,R-9, Mirpur Mirpur Mirpur  Mirpur Mirpur-Rupnagar,Dhaka-1216,Bangladesh
      </div>
      <div class="front-weight-bold body-1 py-1" style="border-bottom: 1px solid #bf0b0b;">
        <strong>Parmanent Address :</strong>  H-26,R-9,Mirpur-Rupnagar,Dhaka-1216,Bangladesh
      </div> -->
      <div class="front-weight-bold body-1 py-1" style="border-bottom: 1px solid #bf0b0b;">
        <strong>Profession :</strong>  {{ user.occupation }}
      </div>
      <div class="front-weight-bold body-1 py-1" style="border-bottom: 1px solid #bf0b0b;">
        <strong>Organogram :</strong>  {{ user.organogram?.name }}
      </div>

    </v-container>
  </v-card>
</template>
<script>
export default {
  name:'chat-profile',
  emits: ['back-home','add-group'],
  props: {
    user: { type: Object, required: true },
  },
  data() {
    return {
      fab2: false,
      menu2: false,
      add_group:false,
    }
  },
  mounted() {
   // console.log(this.user);
  }
}
</script>
