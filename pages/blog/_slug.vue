<template>
  <div>
    <template v-if="loader.isLoading">
      <v-sheet
        :color="`grey lighten-4`"
        class="pa-3"
      >
        <v-row>
          <v-col cols="12" md="4">
            <v-skeleton-loader
              class="mx-auto"
              max-width="300"
              type="card"
            ></v-skeleton-loader>
          </v-col>
          <v-col cols="12" md="4">
            <v-skeleton-loader
              class="mx-auto"
              max-width="300"
              type="card"
            ></v-skeleton-loader>
          </v-col>
          <v-col cols="12" md="4">
            <v-skeleton-loader
              class="mx-auto"
              max-width="300"
              type="card"
            ></v-skeleton-loader>
          </v-col>
        </v-row>

      </v-sheet>
    </template>
    <template v-else>
      <!-- Breadcumb -->
      <bread-crumbs2 :title="info.title" :image="info.image" :items="[{title:'Blogs', link:'/page/blog', disabled:true}, {title:info.title, link:'#', disabled:true}]"></bread-crumbs2>
      <!-- Breadcumb end -->

      <!-- aboutus page start -->
      <section class="about-page-area">
        <v-container fluid>
          <v-row dense>
            <v-col cols="12">
              <v-container fluid>
<!--                <v-row justify="left" v-if="info.image">
                  <v-col cols="12" md="7" class="ml-0 pl-0">
                    <img
                      class="ml-2 img-fluid"
                      :src="info.image" alt=""
                    />
                    <div class="mt-2 ml-2 mb-2">
                      <div class="course-info__title">
                        <span style="color: gray" v-if="info.user">
                          Author:  {{ info.user.first_name }}
                          <span v-if="info.user.last_name">{{ ' '+ info.user.last_name }}</span>
                        </span>
                        <span class="justify-content-end single-blog-date" style="color: gray"> <b>{{  $moment(info.created_at).format('MM-DD-YYYY') }}</b></span>
                      </div>
                    </div>
                  </v-col>
                </v-row>-->
                <div class="mb-2"><h4>{{ info.title }}</h4></div>
                <div class="mt-2 ml-1 mb-2">
                  <div class="course-info__title">
                        <span style="color: gray" v-if="info.user">
                          Author:  <nuxt-link v-if="info.user && info.user.userable"  :to="'/instructor/'+info.user.userable.id">{{ info.user.first_name }}</nuxt-link>
                          <span v-else>{{ info.user.first_name }}</span>
                          <span v-if="info.user.last_name">{{ ' '+ info.user.last_name }}</span>
                        </span>
                    <span class="justify-content-end ml-2" style="color: gray">{{ $moment(info.updated_at).format('ll') }}</span>
                  </div>
                </div>
                <div v-html="info.description"></div>
                <div><b>Comments ({{ info.comment_count}})</b></div>
                <v-row dense>
                    <v-col cols="12" md="12">
                      <v-row no-gutters>
                        <comment v-for="(comment,key) in info.blogComments" :offset_layer="0" :comment="comment" :key="key"/>
                      </v-row>
                    </v-col>
                </v-row>
                <v-row dense justify="left">
                  <v-col cols="12" md="6">
                    <validation-observer ref="observer" v-slot="{ invalid }">
                      <v-form ref="form" @submit.prevent="submitData()">
                        <v-card-title> Leave your comment</v-card-title>
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
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
          </v-row>
        </v-container>
      </section>
      <!-- aboutus page End -->
    </template>
  </div>
</template>

<script>
import BreadCrumbs2 from "@/components/common/BreadCrumbs2";
import {common as commonMixin} from "@/mixins/common";
import Comment from "@/components/blog/Comment.vue";
export default {
  name: 'SingleBlog',
  auth:false,
  components:{BreadCrumbs2, Comment},
  mixins: [commonMixin],
  data(){
    return{
      info:{},
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
      form: {
        name: null,
        email:null,
        comment: null,
        blog_comment_id: null,
      },
    }
  },
  mounted() {
    this.init()
  },
  methods:{
    async init(){
      this.loader.isLoading = true
      await this.$axios.get(`/get/single/new/${this.$route.params.slug}`).then((response)=>{
        this.info=response.data.data
      }).catch(()=>{
        this.info={}
      })
      this.loader.isLoading = false
    },
    async submitData() {
      if (await this.$refs.observer.validate()){
          this.loader.isSubmitting = true
          const formData = this.$generateFormData(this.form, false)
          formData.append('blog_id',this.info.id)
          let url = '/blog/comment/submit'
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

<style scoped>
.single-blog-date{
  margin-left: 15% !important;
}
@media (max-width: 1200px) {
  .single-blog-date{
    margin-left: 45% !important;
  }
}
@media (max-width: 415px) {
  .single-blog-date{
    margin-left: 15% !important;
  }
}
@media (min-width: 1200px) {
  .single-blog-date{
    margin-left: 50% !important;
  }
}
@media (min-width: 1400px) {
  .single-blog-date{
    margin-left: 60% !important;
  }
}

</style>
