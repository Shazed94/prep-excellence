<template>
  <div>
    <h2>{{pageTitle}}</h2>
    <v-breadcrumbs
      class="ml-n5 mt-n2 mb-n1"
      :items="items"
    ></v-breadcrumbs>
  </div>
</template>

<script>
export default {
  name: 'BreadCrumbs',
  props: {
    pageTitle: { type: String, required: true },
    items: { type: Array, required: true }
  }
}
</script>

<style scoped>

</style>
