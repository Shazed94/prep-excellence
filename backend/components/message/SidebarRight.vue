<template>
  <v-col cols="12" md="3">
    <v-card class="text-center mt-8 mb-3 custom-color" shaped >
      <v-badge
        bordered
        bottom
        :color="is_online(selected_user.id)?'green':'gray'"
        dot
        offset-x="11"
        offset-y="13"
      >
        <v-avatar class="mt-n7" size="60" elevation="10">
          <img :src="selected_user.image" alt=""/>
        </v-avatar>
      </v-badge>
      <v-card-title class="layout justify-center">{{  selected_user.name }}</v-card-title>
      <v-card-subtitle class="layout justify-center">{{  selected_user.title }}</v-card-subtitle>
      <v-expansion-panels v-model="panel" multiple>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <h3>Information</h3>
          </v-expansion-panel-header>
          <v-expansion-panel-content>

          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <h3>Images(14)</h3>
          </v-expansion-panel-header>
          <v-expansion-panel-content>

          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel >
          <v-expansion-panel-header>
            <h3>Files(3) </h3>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-list shaped>
              <v-list-item-group

              >
                <v-list-item
                  v-for="(item, i) in files"
                  :key="i"
                >
                  <v-list-item-icon>
                    <v-icon v-text="item.icon" color="green"></v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.text"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>
            <h3>Pinned items</h3>
          </v-expansion-panel-header>
          <v-expansion-panel-content>

          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
  </v-col>
</template>
<script>
import {mapGetters} from "vuex";

export default {
  name:'SidebarRight',
  data: () => ({
    panel: [2],
    files: [
      { text: 'Landing_page.zip', icon: ' mdi-cloud-upload' },
      { text: 'Requirements.pdf', icon: ' mdi-cloud-upload' },
      { text: 'Uwagi.docx', icon: ' mdi-cloud-upload' },
    ],
    show: false,
    marker: true,
    iconIndex: 0,
  }),
  computed: {
    ...mapGetters('message/message',['selected_user','is_online'])
  },

};
</script>
<style scoped>
.border {
  border-right: 1px solid grey;
}
.custom-color{
  background-color: rgb(116 201 222) !important;
  color: white !important;
}
</style>
