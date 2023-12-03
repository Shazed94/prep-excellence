<template>
  <v-col cols="12" class="mb-1" md="10" :offset-md="offset_layer">
    <v-row dense>
      <v-col cols="12">
        <v-badge
          color="secondary"
          dot
          bordered
          offset-x="10"
          offset-y="10"
        >
          <v-avatar size="40">
            <v-img src="/images/profile.png"></v-img>
          </v-avatar>
        </v-badge>
        <span>{{  comment.name }}</span><br>
        <span class="text-grey ml-4" style="color: gray">{{ moment(comment.created_at).startOf('hour').fromNow() }}</span>
      </v-col>
    </v-row>
    <div class="mt-2">
      {{comment.comment }}
    </div>
    <div class="text-left my-2">
      <a href="javascript:void(0)" @click="is_form_show = !is_form_show" style="text-decoration: none; color: #0a53be !important;">
        {{ 'Reply' }}
      </a>
    </div>
    <v-row dense>
      <v-col cols="12">
        <validation-observer v-if="is_form_show" ref="observer" v-slot="{ invalid }">
          <v-form ref="form" @submit.prevent="submitData(comment.id)">
            <v-card-title>{{ "Reply to  " }}<span style="color: gray">{{ ' '+comment.name }}</span></v-card-title>
            <v-card-subtitle> Your email address will not be published.</v-card-subtitle>
            <v-card-text>
              <v-row dense>
                <v-col cols="12" md="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="comment"
                    vid="comment"
                    rules="required"
                  >
                    <v-textarea
                      v-model="form.comment"
                      label="Comment"
                      :error-messages="errors"
                      dense
                      outlined
                      auto-grow
                      no-resize
                    ></v-textarea>
                  </validation-provider>
                </v-col>
                <v-col cols="12" md="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="name"
                    vid="name"
                    rules="required"
                  >
                    <v-text-field
                      v-model="form.name"
                      label="Name"
                      :error-messages="errors"
                      dense
                      outlined
                      auto-grow
                      no-resize
                    ></v-text-field>
                  </validation-provider>
                </v-col>
                <v-col cols="12" md="12">
                  <validation-provider
                    v-slot="{ errors }"
                    name="email"
                    vid="email"
                    rules="required|email"
                  >
                    <v-text-field
                      v-model="form.email"
                      label="Email"
                      :error-messages="errors"
                      dense
                      outlined
                      auto-grow
                      no-resize
                    ></v-text-field>
                  </validation-provider>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                class="mx-2 white--text"
                type="submit"
                :loading="loader.isSubmitting"
                depressed
              >
                Submit
              </v-btn>
            </v-card-actions>
          </v-form>
        </validation-observer>
        <template v-if="comment.children && comment.children.length">
          <comment v-for="(comment,key) in comment.children" :offset_layer="findOffset(offset_layer,key)" :comment="comment" :key="key"></comment>
        </template>
      </v-col>
    </v-row>
  </v-col>
</template>
<script>
import {common as commonMixin} from "@/mixins/common";
import moment from "moment-timezone";
export default {
  name:'Comment',
  mixins: [commonMixin],
  props:{
    comment:{
      required:true,
      type:Object,
      default() {
        return []
      }
    },
    offset_layer:{
      required:true,
      default() {
        return 0
      }
    }
  },
  data(){
    return{
      info:{},
      moment,
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      is_form_show:false,
      offset_layer_con:0,
      form: {
        name: null,
        email:null,
        comment: null,
        blog_comment_id: this.comment.id,
      },
    }
  },
  methods:{
    findOffset(offset, key){
      if (key === 0 ) return parseInt(offset) + 1;
      return offset;
    },
    async submitData(comment_id) {
      if (await this.$refs.observer.validate()){
        this.loader.isSubmitting = true
        const formData = this.$generateFormData(this.form, false)
        formData.append('blog_id',this.comment.blog_id)
        let url = 'blog/comment/submit'
        await this.$axios.post(url, formData).then((response) => {
          this.$toaster.success(response.data.message)
          this.$refs.form.reset()
          this.$refs.observer.reset()
        }).catch((error) => {
          if (error.response.status === 422) {
            this.$refs.observer.setErrors(error?.response?.data?.errors)
            Object.keys(error.response.data.errors).map((field) => {
              this.$toaster.error(error.response.data.errors[field][0]);
            });
          } else this.$toaster.error(error.response.data.message);
        }).finally(() => {
          this.loader.isSubmitting = false
        })
      }

    },
  }
}
</script>
