<template>
  <v-card flat
          v-scroll.self="onScroll"
          class="overflow-y-auto"
          max-height="500" min-height="500" id="message_scroll">
    <v-card-text v-for="(item) in messages" :key="item.time">
      <v-list-item
        :key="item.time"
        v-if="item.from != 'You'"
        class=""
      >
        <v-list-item-avatar class="align-self-start mr-2">
          <v-avatar size="40">
            <v-img src="https://via.placeholder.com/50"></v-img>
          </v-avatar>
        </v-list-item-avatar>
        <v-list-item-content class="received-message">
          <v-card color="grey lighten-3" class="flex-none">
            <v-card-text class=" pa-1 d-flex flex-column">
              <span class="text-caption">{{item.from}} </span>
              <span class="align-self-start text-subtitle-1">{{ item.message }}</span>
              <span class="text-caption font-italic align-self-end">{{item.time}}</span>
            </v-card-text>
          </v-card>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-else :key="item.time">
        <v-list-item-content class="sent-message justify-end">
          <v-card color="light-blue accent-3" class="flex-none">
            <v-card-text class="pa-1 d-flex flex-column">
              <span class="text-subtitle-1 chat-message">{{ item.message }}</span>
              <span class="text-caption font-italic align-self-start">{{item.time}}</span>
            </v-card-text>
          </v-card>
        </v-list-item-content>
        <v-list-item-avatar class="align-self-start ml-2">
          <v-img src="https://via.placeholder.com/50"></v-img>
        </v-list-item-avatar>
      </v-list-item>
    </v-card-text>
  </v-card>
</template>
<script>
import {mapGetters} from "vuex";

export default {
  name:'MessageBody',
  data: () => ({
    scrollInvoked: 0,
  }),
  mounted() {
    var container = this.$el.querySelector("#message_scroll");
    container.scrollTop = container.scrollHeight;
  },
  computed: {
    ...mapGetters('message/message',['messages','totalItems'])
  },
  methods: {
    onScroll () {
      this.scrollInvoked++
    },
  },

};
</script>
<style scoped>
.chat-message {
  display: unset !important;
  white-space: break-spaces;
}
.chat-screen {
  max-height: 320px;
  overflow-y: auto;
}
.flex-none {
  flex: unset;
}
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
</style>
