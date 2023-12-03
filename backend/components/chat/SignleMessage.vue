<template>
  <v-card
    class="chat_container_card chat_message_signle"
    style="max-width: 430px; height: 400px; overflow: scroll"
  >
    <div class="chat_header">
      <v-row dense class="align-center justify-space-between">
        <v-col
          cols="9"
          class="mb-0 white--text align-center"
          style="display: flex"
        >
          <v-avatar
            size="50"
            @click="
              $emit('show-profile', room.user_id ? room.user : room.receiver)
            "
          >
            <img :src="room?.receiver?.image" alt="John" />
          </v-avatar>
          <div>
            <v-btn
              text
              @click="
                $emit('show-profile', room.user_id ? room.user : room.receiver)
              "
            >
              <strong class="front-weight-bold" v-if="room.user_id">
                {{ room.user?.name }}
              </strong>
              <strong class="front-weight-bold" v-else>
                {{
                  room.auth_id == room.receiver?.id
                    ? room.sender?.name
                    : room.receiver?.name
                }}
              </strong>
            </v-btn>

            <v-spacer></v-spacer>
          </div>
        </v-col>
        <v-col cols="3" class="text-right">
          <v-btn
            @click="$emit('back-home')"
            width="30px"
            height="30px"
            fab
            color="transparent"
          >
            <v-icon dark> mdi-arrow-left-bold </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </div>

    <v-divider></v-divider>
    <v-container class="chat-body">
      <div class="message_list" id="message_scroll">
        <!-- <div class="pa-1 text-center" style="color: #747474; font-size: 12px">
          {{ dateFomate("2022-08-04 08:35:51") }}
        </div> -->
        <template v-for="(message, i) in messages">
          <div
            v-if="message.receiver_id != room.auth_id"
            :key="i"
            class="d-flex justify-right chat_message chat-send"
          >
            <!-- <div class="d-flex align-end justify-end"> -->
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
                </div>
              </div>
              <div class="chat-avatar">
                <v-avatar size="37">
                  <img
                    :src="message?.sender?.image"
                    :alt="message?.sender?.name"
                  />
                </v-avatar>
              </div>
            <!-- </div> -->
          </div>
          <div
            v-else
            :key="`inex-${i}`"
            class="d-flex justify-left chat_message chat-receive"
          >
            <!-- <div class="d-flex align-end"> -->
              <div class="chat-avatar">
                <v-avatar size="37">
                  <img
                    :src="message?.sender?.image"
                    :alt="message?.sender?.name"
                  />
                </v-avatar>
              </div>
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
            <!-- </div> -->
          </div>
        </template>
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

            <v-textarea
              v-on:keyup.enter="send()"
              color="teal"
              class="chat-input"
              rows="1"
              v-model="message"
              outline
            ></v-textarea>
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
  name: "single-message",
  data() {
    return {
      moment,
      disabled: true,
      menu3: false,
      fab2: false,
      acceptedFiles: "image/*,.pdf,.doc",
      message: "",
      files: [],
      messages: [],
      audio_types: ["mp3", "audio/ogg", "wav", "mpeg"],
      video_types: ["mp4", "video/ogg", "webm", "quicktime"],
      image_types: ["png", "jpg", "jpeg", "webp", "svg", "gif"],
      selectedFiles: [],
      receiver_id: "",
      newMessageId: ''
    };
  },

  emits: ["back-home", "show-profile"],
  props: {
    room: { type: Object, required: true },
  },
  watch:{
    messages(){
      this.$nextTick(() => this.scrollToEnd());
    }
  },
  mounted() {
    window.Echo.channel(`message-channel`)
      .listen('NewMessage',(response)=>{
        alert('sdfdf');
        if (response.message.receiver_id == response.message.auth_id) {
           this.messages.push(response.message);
         } else {
          console.log(response)
        }
    })
    // window.Echo.join(`message-channel-1`)
    //   .listen('NewMessage',(response)=>{
    //     if (response.message.receiver_id == response.message.auth_id) {
    //        this.messages.push(response.message);
    //      } else {
    //       console.log(response)
    //     }
    // })
    // window.Echo.private(`room-${1}`)
    //   .listen('NewMessage', (response) => {
    //     console.log('new mesage');
    //     if (response.message.receiver_id == response.message.auth_id) {
    //       this.messages.push(response.message);
    //     }
    //   });
    this.setReceiverId();
    this.getSingleMessage(this.receiver_id);
  },
  methods: {
    scrollToEnd() {
      var container = this.$el.querySelector("#message_scroll");
      container.scrollTop = container.scrollHeight;
    },
    setReceiverId() {
      if (this.room.role_id) {
        this.receiver_id = this.room?.id;
      } else if (this.room.auth_id == this.room?.sender_id) {
        this.receiver_id = this.room?.receiver_id;
      } else {
        this.receiver_id = this.room?.sender_id;
      }
    },
    send() {
      if (this.message == "" && this.selectedFiles.length == 0) {
        return;
      }
      let data = new FormData();
      data.append("message", this.message);
      let allFiles = [];
      for (var i = 0; i < this.selectedFiles.length; i++) {
        //let file = this.selectedFiles[i];
        allFiles.push(this.selectedFiles[i]);
        //data.append('files[' + i + ']', file);
      }
      data.append("files", allFiles[0]);
      //data.append('file', this.uploadfiles)
      //data.append('file', JSON.stringify(this.uploadFiles));
      data.append("receiver_id", this.receiver_id);
      this.$axios
        .post(`/send-message`, data)
        .then((response) => {
          this.message = "";
          this.files = [];
          this.messages.push(response.data.data);
          this.newMessageId = response.data.data?.id

          window.Echo.channel(`message-channel`)
      .listen('NewMessage',(response)=>{
        alert('sdfdf');
        if (response.message.receiver_id == response.message.auth_id) {
           this.messages.push(response.message);
         } else {
          console.log(response)
        }
    })
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getSingleMessage(id) {
      this.$axios
        .get(`/get-single-chat-list/${id}`)
        .then((response) => {
          this.messages = response.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    dateFomate(arg) {
      const month = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const d = new Date(arg);
      let m_name = month[d.getMonth()];
      let d_name = days[d.getDay()];
      let day = d.getDate();
      let year = d.getFullYear();
      return d_name + ", " + m_name + " " + day + ", " + year;
    },
    showDate() {
      return true;
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

      for (let i = 0; i < files.length; i++) {
        this.selectedFiles.push(files[i]);
      }
      for (let i = 0; i < this.selectedFiles.length; i++) {
        let reader = new FileReader(); //instantiate a new file reader
        reader.addEventListener(
          "load",
          function () {
            this.$refs["image" + parseInt(i)][0].src = reader.result;
          }.bind(this),
          false
        ); //add event listener

        reader.readAsDataURL(this.selectedFiles[i]);
      }

      // for (var index = 0; index < files.length; index++) {
      //   var reader = new FileReader();
      //   reader.onload = function(event) {
      //     let imageUrl = event.target.result;
      //     this.selectedFiles.push(imageUrl);
      //   }
      //   reader.readAsDataURL(files[index]);
      // }

      // for ( var i = 0; i < this.$refs.file.files.length; i++ ){
      //   let file = this.$refs.file.files[i];
      //   //formData.append('files[' + i + ']', file);
      //   this.uploadFiles.push(file);
      // }
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
<style scoped>

.message img {
  width: 100px;
}
</style>
