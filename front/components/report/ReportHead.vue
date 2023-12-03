<template>
  <div>
    <div style="display: flex; align-items: center; justify-content: center; column-gap: 20px">
<!--      <img :src="$config.apiResource + get_setting_val('general','logo')" alt="LOGO" height="70px">
      -->
      <div style="text-align: center">
        <img :src="$config.apiResource + get_setting_val('general','logo')" alt="LOGO" class="img-thumbnail ml-0" width="200" height="50">
        <h1 style="font-size: 3em; line-height: 90px; font-family: sans-serif; color: #4c669a;">{{ get_setting_val('general','title') }}</h1>
        <div style="font-size: 18px; color: orange; font-weight: 800;">
          <div>{{ get_setting_val('general','city') +', '+ get_setting_val('general','state') +', '+ get_setting_val('general','country') }}</div>
          <div>Mobile: {{ get_setting_val('general','mobile_number') }}, Email: {{ get_setting_val('general','email') }}</div>
        </div>
      </div>
<!--      <img :src="$config.apiResource + get_setting_val('general','logo')" alt="LOGO" height="70px">
    -->
    </div>
    <div style="width:100%;background-color: #4c669a;height: 3px;margin: 4px 0;"></div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
  name: 'Head',
  async mounted() {
    if(!this.settings.length) await this.$store.dispatch('setting/getItems');
  },
  computed: {
    ...mapGetters('setting',['settings','get_setting_val']),
  }
}
</script>
