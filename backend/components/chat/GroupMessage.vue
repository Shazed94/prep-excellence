<template>
  <v-card
    class="chat_container_card chat_message_con"
    style="max-width: 430px; height: 400px; overflow: scroll"
  >
    <div class="chat_header">
      <v-row dense class="align-center justify-space-between">
        <v-col
          cols="10"
          class="mb-2 white--text"
          style="display: flex; padding: 20px"
        >
          <v-img
            style="border-radius: 50%; max-width: 60px"
            :src="room?.chat_group ? room?.chat_group?.image : room?.image"
          ></v-img>
          <div class="ml-1">
            <strong
              class="front-weight-bold"
              style="
                font-size: 14px;
                position: relative;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
              "
            >
              {{ room.chat_group ? room.chat_group?.name : room?.name }}
            </strong>
            <v-spacer></v-spacer>

            <v-avatar size="30" v-for="(member,i) in room?.chat_group?.chat_group_users.slice(0,3)" :key="i">
              <img
                :src="member?.user?.image"
                :alt="member?.user?.name"
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
                @click="$emit('back-home')"
                width="30px"
                height="30px"
                fab
                color="transparent"
              >
                <v-icon dark> mdi-arrow-left-bold </v-icon>
              </v-btn>
              <v-menu
                v-model="menu3"
                min-width="100"
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
                      @click="
                        fab2 = !fab2;
                        menu3 = false;
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
                      <v-list-item @click="$emit('new-member', room.id)">
                        <v-list-item-icon>
                          <v-icon> mdi-account-plus </v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title> Add to Group</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item @click="$emit('member_list', room.id)">
                        <v-list-item-icon>
                          <v-icon> mdi-account-group </v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title> All Member</v-list-item-title>
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
      <div class="message_list">
        <div v-for="(message, i) in messages" :key="i">
          <div
            v-if="room.messages && message.sender_id == room.created_by"
            class="d-flex justify-right chat_message chat-send"
          >
            <div class="d-flex align-end justify-end" style="width: 80%">
              <div class="message_body">
                <div class="message">
                  {{ message.message }}
                  <div>
                    <span class="time">{{ moment(message.created_at).format('h:mm a') }}</span>
                    <span class="unseen-icon" v-if="!message.is_seen">
                      <img
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAABLklEQVRIie2RsUrDUBSGvxt6gujcgOAbNHLBtMVNbDcdfAffrA8hLsZBEJcQCFhwcFc665IbblyukoamJroI5h8/7v3POf8PvXr9eamffsyyLDDGXJdl+TaZTE6auPcL8xg4UkrtbOOdB6RpOjTG3AAh8GStvdjGO0WUpunQWhsDh87kdDqdvjZxgEGXAWVZLpzJUkRmWutVJZYQeBSRudZ69fmn0wBr7b1SyorIZRtzcBElSXIH7IrIWfVBkiQPgNQ5rBXaaA6uZNd4ZIyJsywLKpEMNvG25l8X1EsCZuPx+GUT9zyvaCq0cUBlq1tg5LY61lq/17d1z7/dfC0iAK31SkRmwBIY5Xl+UOFzZx52MV+7oHLJXlEU+1EUPdd4kOf5FYDv++dtzHv9E30ArSnjRSfAn5oAAAAASUVORK5CYII=">
                    </span>
                    <span class="seen-icon" v-else>
                      <img
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAABTUlEQVRIie2RsU7CUBSGv0tbQ3SmiYlvALZB1LgZYdPBd3BnIOEtaNRX8CGMiziYGBckobGJg7umsy60t9ehFQpSpEwm8o/fvec//zkHVlrpz0ssW2gN2iaBvEGJD3fv/DCLF5Y3D7vADkIV5/HcDar9ZolA3oKoAC8y0k/n8VwrqvabJRnpXWA7MTny9jvvWRxAz9NAKv0qMfEwtLpnd3xr0DZlvJYKqGcMveHZHf+7JlcDIvGghIqEoZ25tuOPdy5G5q7t+OkSAWD1WvfAOoZ2nP5g9VqPgDHNIX3QbHNIjqyEKAI1grBrDdrm6FWhz+KLmo8mmD6Sgao/7V6+zeJRQYZZB81sME4l74BykurAtZ3PH2njsl+TT6wIwLUdH0OrAx6IMsNga8z1RmwuKnnMJyZITbIhQ7np1S5ep7jJUF4DsKadLGK+0j/RF/HJ0mHuVfASAAAAAElFTkSuQmCC">
                    </span>
                  </div>
                </div>
              </div>
              <div class="chat-avatar">
                <v-avatar size="37">
                  <img :src="message?.sender?.image" :alt="message?.sender?.name" />
                </v-avatar>
              </div>
            </div>
          </div>
          <div v-else-if="message.sender_id == room.sender_id"
            class="d-flex justify-right chat_message chat-send"
          >
            <div class="d-flex align-end justify-end" style="width: 80%">
              <div class="message_body">
                <div class="message">
                  {{ message.message }}
                  <div>
                    <span class="time">{{ moment(message.created_at).format('h:mm a') }}</span>
                    <span class="unseen-icon" v-if="!message.is_seen">
                      <img
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAABLklEQVRIie2RsUrDUBSGvxt6gujcgOAbNHLBtMVNbDcdfAffrA8hLsZBEJcQCFhwcFc665IbblyukoamJroI5h8/7v3POf8PvXr9eamffsyyLDDGXJdl+TaZTE6auPcL8xg4UkrtbOOdB6RpOjTG3AAh8GStvdjGO0WUpunQWhsDh87kdDqdvjZxgEGXAWVZLpzJUkRmWutVJZYQeBSRudZ69fmn0wBr7b1SyorIZRtzcBElSXIH7IrIWfVBkiQPgNQ5rBXaaA6uZNd4ZIyJsywLKpEMNvG25l8X1EsCZuPx+GUT9zyvaCq0cUBlq1tg5LY61lq/17d1z7/dfC0iAK31SkRmwBIY5Xl+UOFzZx52MV+7oHLJXlEU+1EUPdd4kOf5FYDv++dtzHv9E30ArSnjRSfAn5oAAAAASUVORK5CYII=">
                    </span>
                    <span class="seen-icon" v-else>
                      <img
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAABTUlEQVRIie2RsU7CUBSGv0tbQ3SmiYlvALZB1LgZYdPBd3BnIOEtaNRX8CGMiziYGBckobGJg7umsy60t9ehFQpSpEwm8o/fvec//zkHVlrpz0ssW2gN2iaBvEGJD3fv/DCLF5Y3D7vADkIV5/HcDar9ZolA3oKoAC8y0k/n8VwrqvabJRnpXWA7MTny9jvvWRxAz9NAKv0qMfEwtLpnd3xr0DZlvJYKqGcMveHZHf+7JlcDIvGghIqEoZ25tuOPdy5G5q7t+OkSAWD1WvfAOoZ2nP5g9VqPgDHNIX3QbHNIjqyEKAI1grBrDdrm6FWhz+KLmo8mmD6Sgao/7V6+zeJRQYZZB81sME4l74BykurAtZ3PH2njsl+TT6wIwLUdH0OrAx6IMsNga8z1RmwuKnnMJyZITbIhQ7np1S5ep7jJUF4DsKadLGK+0j/RF/HJ0mHuVfASAAAAAElFTkSuQmCC">
                    </span>
                  </div>
                </div>
              </div>
              <div class="chat-avatar">
                <v-avatar size="37">
                  <img :src="message?.sender?.image" :alt="message?.sender?.name" />
                </v-avatar>
              </div>
            </div>
          </div>
          <div
            v-else
            class="d-flex justify-left chat_message chat-receive"
          >
            <div class="d-flex align-end" style="width: 80%">
              <div class="chat-avatar">
                <v-avatar size="37">
                  <img :src=" message.chat_group?.chat_group_users.find(user => user.user_id === message.sender_id)?.user?.image" :alt=" message.chat_group?.chat_group_users.find(user => user.user_id === message.sender_id)?.user?.name" />
                </v-avatar>
              </div>
              <div class="message_body">
                <div class="message" v-if="message.file">
                  <img :src="message.file" />
                  <div>
                    <span class="time">{{ moment(message.created_at).format('h:mm a') }}</span>
                    <span class="unseen-icon" v-if="!message.is_seen">
                      <img
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAABLklEQVRIie2RsUrDUBSGvxt6gujcgOAbNHLBtMVNbDcdfAffrA8hLsZBEJcQCFhwcFc665IbblyukoamJroI5h8/7v3POf8PvXr9eamffsyyLDDGXJdl+TaZTE6auPcL8xg4UkrtbOOdB6RpOjTG3AAh8GStvdjGO0WUpunQWhsDh87kdDqdvjZxgEGXAWVZLpzJUkRmWutVJZYQeBSRudZ69fmn0wBr7b1SyorIZRtzcBElSXIH7IrIWfVBkiQPgNQ5rBXaaA6uZNd4ZIyJsywLKpEMNvG25l8X1EsCZuPx+GUT9zyvaCq0cUBlq1tg5LY61lq/17d1z7/dfC0iAK31SkRmwBIY5Xl+UOFzZx52MV+7oHLJXlEU+1EUPdd4kOf5FYDv++dtzHv9E30ArSnjRSfAn5oAAAAASUVORK5CYII=">
                    </span>
                    <span class="seen-icon" v-else>
                      <img
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAABTUlEQVRIie2RsU7CUBSGv0tbQ3SmiYlvALZB1LgZYdPBd3BnIOEtaNRX8CGMiziYGBckobGJg7umsy60t9ehFQpSpEwm8o/fvec//zkHVlrpz0ssW2gN2iaBvEGJD3fv/DCLF5Y3D7vADkIV5/HcDar9ZolA3oKoAC8y0k/n8VwrqvabJRnpXWA7MTny9jvvWRxAz9NAKv0qMfEwtLpnd3xr0DZlvJYKqGcMveHZHf+7JlcDIvGghIqEoZ25tuOPdy5G5q7t+OkSAWD1WvfAOoZ2nP5g9VqPgDHNIX3QbHNIjqyEKAI1grBrDdrm6FWhz+KLmo8mmD6Sgao/7V6+zeJRQYZZB81sME4l74BykurAtZ3PH2njsl+TT6wIwLUdH0OrAx6IMsNga8z1RmwuKnnMJyZITbIhQ7np1S5ep7jJUF4DsKadLGK+0j/RF/HJ0mHuVfASAAAAAElFTkSuQmCC">
                    </span>
                  </div>
                </div>
                <div class="message" v-else>
                  {{ message.message }}
                  <div>
                    <span class="time">{{ moment(message.created_at).format('h:mm a') }}</span>
                    <span class="unseen-icon" v-if="!message.is_seen">
                      <img
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAABLklEQVRIie2RsUrDUBSGvxt6gujcgOAbNHLBtMVNbDcdfAffrA8hLsZBEJcQCFhwcFc665IbblyukoamJroI5h8/7v3POf8PvXr9eamffsyyLDDGXJdl+TaZTE6auPcL8xg4UkrtbOOdB6RpOjTG3AAh8GStvdjGO0WUpunQWhsDh87kdDqdvjZxgEGXAWVZLpzJUkRmWutVJZYQeBSRudZ69fmn0wBr7b1SyorIZRtzcBElSXIH7IrIWfVBkiQPgNQ5rBXaaA6uZNd4ZIyJsywLKpEMNvG25l8X1EsCZuPx+GUT9zyvaCq0cUBlq1tg5LY61lq/17d1z7/dfC0iAK31SkRmwBIY5Xl+UOFzZx52MV+7oHLJXlEU+1EUPdd4kOf5FYDv++dtzHv9E30ArSnjRSfAn5oAAAAASUVORK5CYII=">
                    </span>
                    <span class="seen-icon" v-else>
                      <img
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAABTUlEQVRIie2RsU7CUBSGv0tbQ3SmiYlvALZB1LgZYdPBd3BnIOEtaNRX8CGMiziYGBckobGJg7umsy60t9ehFQpSpEwm8o/fvec//zkHVlrpz0ssW2gN2iaBvEGJD3fv/DCLF5Y3D7vADkIV5/HcDar9ZolA3oKoAC8y0k/n8VwrqvabJRnpXWA7MTny9jvvWRxAz9NAKv0qMfEwtLpnd3xr0DZlvJYKqGcMveHZHf+7JlcDIvGghIqEoZ25tuOPdy5G5q7t+OkSAWD1WvfAOoZ2nP5g9VqPgDHNIX3QbHNIjqyEKAI1grBrDdrm6FWhz+KLmo8mmD6Sgao/7V6+zeJRQYZZB81sME4l74BykurAtZ3PH2njsl+TT6wIwLUdH0OrAx6IMsNga8z1RmwuKnnMJyZITbIhQ7np1S5ep7jJUF4DsKadLGK+0j/RF/HJ0mHuVfASAAAAAElFTkSuQmCC">
                    </span>
                  </div>
                  <!-- {{ message.chat_group?.chat_group_users.find(user => user.user_id === message.sender_id)?.user.name }} -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="chat_upload_files_container">
        <div class="chat_upload_files">
          <div class="chat_upload_file" v-for="(file, i) in files" :key="i">
            <div class="remove_icon">
              <v-btn
                width="20px"
                height="20px"
                fab
                @click="removeFile"
                color="transparent"
              >
                <v-icon color="red">mdi-close-circle-outline</v-icon>
              </v-btn>
            </div>

            <div
              v-if="isImageFile(file)"
              class="upload_image"
              :style="{
                'background-image': `url('${file.localUrl || file.url}')`,
              }"
            ></div>
            <video v-else-if="isVideoFile(file)" controls>
              <source :src="file.localUrl || file.url" />
            </video>

            <div v-else class="file-container">
              <div>
                <v-icon color="red">mdi-text-box-outline</v-icon>
              </div>
              <div class="text-ellipsis">
                {{ file.name }}
              </div>
              <div v-if="file.extension" class="text-ellipsis text-extension">
                {{ file.extension }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex chat-footer align-center">
        <div class="left_side">
          <div class="d-flex">
            <div class="mr-1">
              <v-btn @click="launchFilePicker">
                <v-icon color="red">mdi-image-plus</v-icon>
              </v-btn>
              <input
                ref="file"
                type="file"
                multiple
                :accept="acceptedFiles"
                style="display: none"
                @change="onFileChange($event.target.files)"
              />
            </div>
            <v-text-field
              v-on:keyup.enter="send()"
              color="teal"
              class="chat-input"
              v-model="message"
              outline
            ></v-text-field>
          </div>
        </div>
        <div class="right_side">
          <v-btn @click.prevent="send()">
            <v-img width="40px" src="/images/send.png"></v-img>
          </v-btn>
        </div>
      </div>
    </v-container>
  </v-card>
</template>
<script>
import moment from "moment";

export default {
  name: "group-message",
  props: {
    room: { type: Object, required: true }
  },
  data() {
    return {
      moment,
      menu3: false,
      fab2: false,
      acceptedFiles: "image/*,.pdf,.doc",
      message: '',
      files: [],
      messages: [],
      totalUsersAmount: 0
    };
  },

  emits: ["back-home", "new-member", "member_list"],
  mounted() {
    window.Echo.private(`TestChannel`)
      .listen('NewMessage', (response) => {
        alert('you have a new message');
        let check = response.message?.chat_group?.chat_group_users?.filter(item => {
          if (item.user_id == response.message.auth_id) return item
        })

        if (check) {
          this.messages.push(response.message);
        }
        
        //let payload = {stateName:stateName, data:response }
        //this.$store.commit('user/notifications/INSERT_NEW_ITEMS', payload)
      });
    this.getGroupMessages(this.room?.messages ? this.room.id :  this.room?.chat_group_id)
    this.getUsersAmount();
  },
  methods: {
    getUsersAmount() {
      this.totalUsersAmount = this.room?.chat_group ? this.room?.chat_group?.chat_group_users?.length : this.room?.chat_group_users?.length
    },
    send() {
      if (this.message == '') {
        return;
      }
      let data =new FormData();
      data.append('message', this.message)
      data.append('file', this.files)
      data.append('chat_group_id', this.room?.messages ? this.room.id :  this.room?.chat_group_id)
      this.$axios
        .post(`/send-message`, data)
        .then((response) => {
          this.message = '';
          this.files = [];
          this.messages.push(response.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getGroupMessages(id) {
      this.$axios
        .get(`/get-group-chat-list/${id}`)
        .then((response) => {
          this.messages = response.data.data;
        })
        .catch((error) => {
          console.log(error);
        })
    },
    checkMediaType(types, file) {
      if (!file || !file.type) return;
      return types.some((t) => file.type.toLowerCase().includes(t));
    },
    isImageFile(file) {
      return this.checkMediaType(this.image_types, file);
    },
    isVideoFile(file) {
      return this.checkMediaType(this.video_types, file);
    },
    isImageVideoFile(file) {
      return (
        this.checkMediaType(this.image_types, file) ||
        checkMediaType(this.video_types, file)
      );
    },
    isAudioFile(file) {
      return this.checkMediaType(this.audio_types, file);
    },
    launchFilePicker() {
      this.$refs.file.value = "";
      this.$refs.file.click();
    },
    async onFileChange(files) {
      this.fileDialog = true;
      //this.focusTextarea()
      Array.from(files).forEach(async (file) => {
        const fileURL = URL.createObjectURL(file);
        const typeIndex = file.name.lastIndexOf(".");
        this.files.push({
          loading: true,
          name: file.name.substring(0, typeIndex),
          size: file.size,
          type: file.type,
          extension: file.name.substring(typeIndex + 1),
          localUrl: fileURL,
        });
        const blobFile = await fetch(fileURL).then((res) => res.blob());
        let loadedFile = this.files.find((file) => file.localUrl === fileURL);
        if (loadedFile) {
          loadedFile.blob = blobFile;
          loadedFile.loading = false;
          delete loadedFile.loading;
        }
      });
      setTimeout(() => (this.fileDialog = false), 500);
    },
    removeFile(index) {
      this.files.splice(index, 1);
      // this.focusTextarea()
    },
  },
};
</script>
