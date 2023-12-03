<template>
  <v-app>
    <div class="d-flex text-center flex-column flex-md-row flex-grow-1">
      <v-sheet class="layout-side mx-md-1 d-none d-md-flex flex-md-column px-2 align-center">
        <img class="mt-5" style=" width: 200px !important; margin: 0 auto !important;" src="~/assets/image/logo.png" alt="prep-excellence"/>
        <div class="" style="padding: 40px!important">
          <div class="display-2 font-weight-bold primary--text" style="font-size: 36px!important;">
            {{ 'PrepExcellence' }}
          </div>
          <div class="title my-1" style="font-size: 12px!important;">{{ 'Find the Best Course for Your Child' }}</div>
        </div>
        <!-- <img  class="w-full" src="~static/favicon.png" alt="prep-excellence"/> -->
      </v-sheet>

      <div class="pa-2 pa-md-4 flex-grow-1 align-center justify-center d-flex flex-column">
        <div class="layout-content ma-auto w-full">
          <nuxt />
        </div>
      </div>
    </div>
  </v-app>
</template>

<script>

export default {
  auth:false,
  data(){
    return{
      institute:{},
    }
  },
  created() {

  }
}
</script>

<style scoped>
.layout-side {
  width: 350px;
}

.layout-content {
  max-width: 480px;
}
</style>
