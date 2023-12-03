<template>
  <li>
    <template v-if="menu.children">
      <base-menu-item
        :menu="menu"
        :depth="depth + 1"
      />
    </template>
    <template v-else>
      <nuxt-link v-if="menu.relation_with === 'page'"
        :id="menu.page.title"
        :to="'/page/'+ menu.page.slug"
         @click.native="$emit('menuCloseEvent')"
      >
        <span>{{ menu.page.title }}</span>
      </nuxt-link>
      <nuxt-link v-else
                 :id="menu.name"
                 :to="menu.url"
                 @click.native="$emit('menuCloseEvent')"
      >
        <span>{{ menu.name }}</span>
      </nuxt-link>
    </template>
  </li>
</template>

<script>
import BaseMenuItem from "@/components/menu/BaseMenuItem";
export default {
  name:'BaseMenu',
  components:{BaseMenuItem},
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
