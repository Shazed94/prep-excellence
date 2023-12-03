<template>
  <li>
    <nuxt-link v-if="menu.relation_with === 'page'"
               :id="menu.page.title"
               :to="'/page/'+ menu.page.slug"
    >
      <span>{{ menu.page.title }}</span>
    </nuxt-link>
    <nuxt-link v-else
               :id="menu.name"
               :to="menu.url"
    >
      <span>{{ menu.name }}</span>
    </nuxt-link>
    <template v-if="menu.children">
      <ul>
        <base-menu-item v-for="(mm,k) in menu.children" :key="k"
                        :menu="mm"
                        :depth="depth + 1"
        ></base-menu-item>
      </ul>

    </template>
  </li>
</template>

<script>
import BaseMenu from "@/components/menu/BaseMenu";
export default {
  name:'BaseMenuItem',
  components:{BaseMenu},
  props: {
    menu: {
      type: Object,
      required: true,
    },
    depth: {
      type: Number,
      required: true,
    },
  },
};
</script>
