<template>
  <div class="btcol-lg-12">
    <template>
      <v-card
        :loading="loading"
        class="mx-auto"
        max-width="374"
      >
        <v-progress-linear
          v-if="loading"
          class="position-absolute"
          style="z-index: 1"
          color="deep-purple"
          height="10"
          indeterminate
        ></v-progress-linear>

        <v-img v-if="$auth.user.image"
          height="150"
          width="150"
          class="rounded-circle mx-auto"
          :src="$auth.user.image"
          cover
        ></v-img>
        <v-img v-else
               height="150"
               width="150"
               class="rounded-circle mx-auto"
               src="/images/avatars/avatar1.svg"
               cover
        ></v-img>

        <v-card-title style="padding:2px">
          <v-card-text style="padding:2px">
            <v-card-title
            d-block
            class="text-center"
            style="font-size:16px; padding:2px"
            >{{  $auth.user.name }}</v-card-title>
          </v-card-text>
        </v-card-title>
          <div class="btrow px-2" v-if="$auth.user.role_id && $auth.user.role_id === 3">
            <div class="btcol-sm">
              Student ID #
            </div>
            <div class="btcol-sm">
              {{ $auth.user?$auth.user.userable?$auth.user.userable.student_id:'':''  }}
            </div>
          </div>
          <div class="btrow px-2" v-else>
            <div class="btcol-sm btcol-md-12 text-center">
              Childs Details
            </div>
            <hr>
            <template v-for="(std, kk) in students">
              <div class="btcol-md-5" :key="std.id">
                Name #
              </div>
              <div class="btcol-sm btcol-md-6">
                {{ std.userable ? std.userable.first_name +' '+ std.userable.last_name : ' '  }}
              </div>
              <div class="btcol-md-5">
                Student ID #
              </div>
              <div class="btcol-sm btcol-md-6">
                {{ std.student_id  }}
              </div>
              <hr>
              <v-divider></v-divider>
            </template>

          </div>

        <v-divider class="mx-4 mb-1"></v-divider>

        <student-i-d-card v-if="$auth.user.role_id && $auth.user.role_id === 3"
        :student="$auth.user">
        </student-i-d-card>

      </v-card>
    </template>
  </div>
</template>
<script>
import StudentIDCard from "@/components/user/StudentIDCard";
import {mapGetters} from "vuex";
const stateName = 'students'
const storeName='user/basic'
export default {
  name:'userCard',
  components:{StudentIDCard},
  data(){
    return{
      loading:false,
      loader: {isLoading: false, isSubmitting: false, isDeleting: false},
    }
  },
  computed: {
    ...mapGetters('user/basic',['students']),
  },
  async mounted() {
    this.loader.isLoading=true;
    await this.init();
    this.loader.isLoading=false;
  },
  methods:{
    async init() {
      this.loader.isLoading = true
      let url = `/parent/parent/child/info`
      const payload = {apiUrl: url, stateName}
      await this.$store.dispatch(storeName+'/getItems', payload)
      this.loader.isLoading = false
    },
  }

}
</script>
