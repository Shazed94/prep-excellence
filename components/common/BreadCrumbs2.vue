<template>
  <!-- Breadcumb -->
  <div class="breadcrumbs-area mt-0 pt-0">
    <v-img :src="image" height="400" class="b_area_custom">
      <v-container fluid>
        <v-row dense class="custom_breadcrumb_text">
          <v-col cols="4" md="4"></v-col>
          <v-col cols="12" md="4">
            <div class="justify-content-center text-white">
              <h4 class="mb-1 text-center">{{  title }}</h4>
              <h6 class="mt-1 text-center">
                <nuxt-link class="text-decoration-none text-white" to="/">Home</nuxt-link>
                <template v-for="(item,key) in items">
                  <svg class="" style="height:25px;" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <nuxt-link :key="key" class="text-decoration-none text-white" :disabled="item.disabled" :to="item.link">{{  item.title }}</nuxt-link>
                </template>
              </h6>
            </div>
          </v-col>
          <v-col cols="4" md="4"></v-col>
        </v-row>
      </v-container>
    </v-img>
  </div>
  <!-- Breadcumb end -->
</template>

<script>
export default {
  name: 'BreadCrumbs2',
  props: {
    items: { type: Array, required: true },
    image: { type: String, required: false, default(){ return '/bg-breadcumb.jpeg' }},
    title: { type: String, required: false, default(){ return 'Page' } },
  }
}
</script>

<style scoped>
.custom_breadcrumb_text{
  margin-top: 140px !important;
}
.b_area_custom{
  max-height: 400px !important;
}
.breadcrumbs-area{
  max-height: 400px !important;
}
@media (max-width: 575px) {
  .custom_breadcrumb_text{
    margin-top: 140px !important;
  }
}
/* Small devices (landscape phones, 576px and up)*/
@media (min-width: 576px) {
  .custom_breadcrumb_text{
    margin-top: 140px !important;
  }
}

/*Medium devices (tablets, 768px and up)*/
@media (min-width: 768px) {
  .custom_breadcrumb_text{
    margin-top: 140px !important;
  }
}

/*Large devices (desktops, 992px and up)*/
@media (min-width: 992px) {
  .custom_breadcrumb_text{
    margin-top: 140px !important;
  }
}

/*X-Large devices (large desktops, 1200px and up)*/
@media (min-width: 1200px) {
  .custom_breadcrumb_text{
    margin-top: 140px !important;
  }
}

/*XX-Large devices (larger desktops, 1400px and up)*/
@media (min-width: 1400px) {
  .custom_breadcrumb_text{
    margin-top: 140px !important;
  }
}
</style>
