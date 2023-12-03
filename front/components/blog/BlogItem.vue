<template>
  <v-card class="mx-auto my-2 aos-init aos-animate h-100">
    <template slot="progress">
      <v-progress-linear
        color="deep-purple"
        height="10"
        indeterminate
      ></v-progress-linear>
    </template>
    <v-img class="cursor-pointer" @click="$router.push(`/blog/${item.id}`)" :src="item.image"></v-img>
    <div class="course-level ml-2 mt-1" >
      <div class="course-cat">
        <span>{{  $moment(item.created_at).format('ll') }}</span>
      </div>
    </div>
    <div class="ml-2">
      <span style="color: gray" v-if="item.user">
          Author:  <nuxt-link v-if="item.user && item.user.userable"  :to="'/instructor/'+item.user.userable.id">{{ item.user.name }}</nuxt-link>
          <span v-else>{{ item.user.name }}</span>
        </span>
    </div>
    <v-card-title>
      <nuxt-link :to="`/blog/${item.id}`">{{  item.title }}</nuxt-link>
    </v-card-title>
    <v-card-text>
      <span v-html="item.short_description.substring(0,80)+'..'"></span>
      <span style="color: #65c0eb"><nuxt-link :to="`/blog/${item.id}`">Read More</nuxt-link></span>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  name:'BlogItem',
  props:['item'],
}
</script>
