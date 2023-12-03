<template>
  <v-app-bar color="rgba(0,0,0,0)" flat>
    <template>
      <template v-if="selected_user.image">
        <v-badge
            bordered
            bottom
            :color="is_online(selected_user.id)?'green':'gray'"
            dot
            offset-x="11"
            offset-y="13"
        >
          <v-avatar class="mt-n7" size="40" elevation="10">
            <img :src="selected_user.image" alt=""/>
          </v-avatar>
        </v-badge>
      </template>
      <v-toolbar-title v-if="selected_user.id" class="title pl-0 ml-2 mt-n4">
        {{  selected_user.name }}
      </v-toolbar-title>
      <v-toolbar-title v-else class="title mt-n1 text-center justify-content-center ml-4">
        Select your contact person
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </template>
<!--    <v-toolbar-title class="title pl-0 mr-2 mt-n4">
      Users :
    </v-toolbar-title>
    <v-btn
      color="cyan"
      icon
      class="mt-n5 mr-n2"
      outlined
      max-height="35"
      max-width="35"
    >
      <v-icon small>mdi-plus-circle</v-icon>
    </v-btn>
    <v-avatar class="mt-n5 mr-2" size="30" elevation="10">
      <img :src="selected_user.image" alt=""/>
    </v-avatar>
    <v-divider vertical inset class="mt-n1"></v-divider>
    <v-btn
      color="black"
      icon
      class="mt-n5"
    >
      <v-icon>mdi-cog</v-icon>
    </v-btn>-->
  </v-app-bar>
</template>
<script>
import {mapGetters} from "vuex";

export default {
  name:'MessageHeader',
  computed: {
    ...mapGetters('message/message',['selected_user','is_online'])
  },
  methods: {

  },

};
</script>
