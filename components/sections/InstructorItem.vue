<template>
  <div>
    <div v-if="item.userable">
      <nuxt-link :to="'/instructor/'+item.id">
        <img class="img-fluid img-thumbnail" :src="item.userable.image" alt=""/>
      </nuxt-link>
    </div>
    <div class="instructor-content">
      <h2 class=" text-center" v-if="item.userable">
        <nuxt-link :to="'/instructor/'+item.id">
          {{  item.userable.name }}
        </nuxt-link>
      </h2>
      <p class="" v-if="item.designation">{{ item.designation.name }}</p>
      <div class="" v-if="item.short_biography" v-html="item.short_biography.substring(0,100)+'..'"></div>
    </div>
  </div>
</template>
<script>
export default {
  name:'InstructorItem',
  props:['item']
}
</script>
