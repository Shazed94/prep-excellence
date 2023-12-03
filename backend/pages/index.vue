<template>
  <div></div>
</template>

<script>
export default {
  name:'MainPage',
  head: {
    title: 'Dashboard',
    meta: [
      {
        hid: 'description',
        name: 'description',
        content: 'Prepexcellence description'
      }
    ],
  },
  meta:{
    action: 'read',
    subject: 'Auth'
  },
  created() {
    this.$router.replace('/dashboard')
  }
}
</script>
