<template>
  <div class="p-0 m-0">
    <img src="~/assets/image/prepexcellence.jpg" alt="prepexcellence"/>
  </div>
</template>

<script>
export default {
  name:'homepage',
  layout: 'auth',
  auth : false,
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
  mounted() {
    /*this.$echo.channel('admin-notification')
      .listen('AdminNotificationEvent', (e) => {
        console.log(e);
      });*/
    /*window.Echo.private('admin-notification')
      .listen('AdminNotificationEvent', (e) => {
        console.log(e);
      });*/
  }

}
</script>
