<template>
  <v-text-field
    v-model="message"
    :append-outer-icon="message ? 'mdi-send' : 'mdi-send'"
    clear-icon="mdi-close-circle"
    clearable
    outlined
    dense
    label="Message"
    type="text"
    @keydown="sentTypingEvent"
    @keyup.enter="sendMessage"
    @click:append-outer="sendMessage"
    @click:clear="clearMessage"
  ></v-text-field>
</template>
<script>
import {mapGetters} from "vuex";
import {common as commonMixin} from "@/mixins/common";
const stateName = 'messages'
const storeName='message/message'
export default {
  name:'MessageWrite',
  mixins: [commonMixin],
  data: () => ({
    pageInfo: {
      apiUrl: '/chat/',
    },
    state: {
      name: stateName,
      store_name: storeName,
    },
    loader: {isLoading: false, isSubmitting: false, isDeleting: false},
    message: '',
    marker: true,
    iconIndex: 0,
    active:false,
  }),
  computed: {
    ...mapGetters('message/message',['selected_user'])
  },
  methods: {
    async sendMessage() {
      if (!this.selected_user.id){
        this.$toaster.error('PLease select receiver for sent message')
      }else {
        this.loader.isSubmitting = true
        const formData = new FormData()
        formData.append('message', this.message)
        formData.append('receiver_id', this.selected_user.id)
        let url = this.pageInfo.apiUrl

        await this.$axios.post(url, formData).then((response) => {
          this.addOrUpdateState(response, stateName, storeName)
          //this.$toaster.success(`${this.pageInfo.pageName} ${this.editMode ? 'updated' : 'created'} successfully!!`)
          this.resetIcon()
          this.clearMessage()
        }).catch((error) => {
          if (error.response.status === 422) {
            //this.$refs.observer.setErrors(error?.response?.data?.errors)
            Object.keys(error.response.data.errors).map((field) => {
              this.$toaster.error(error.response.data.errors[field][0]);
            });
          } else this.$toaster.error(error.response.data.message);
        }).finally(() => {
          this.loader.isSubmitting = false
        })
      }
    },
    clearMessage () {
      this.message = ''
    },
    resetIcon () {
      this.iconIndex = 0
    },
    sentTypingEvent(){
      this.active = true;
      Echo.join(`message-channel-${this.selected_user.id}`)
        .whisper('typing',this.selected_user);
    }

  },

};
</script>
