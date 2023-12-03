<template>
  <div>
    <template v-if="!menuItem.items">
      <v-list-item
        v-if="$can(menuItem.action, menuItem.subject)"
        :input-value="menuItem.value"
        :to="localePath(menuItem.link)"
        :exact="menuItem.exact || true"
        :disabled="menuItem.disabled"
        active-class="primary--text"
        link
      >
        <v-list-item-icon>
          <v-icon :small="small" :class="{ 'grey--text': menuItem.disabled }">
            {{ menuItem.icon || 'mdi-circle-medium' }}
          </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            {{ menuItem.key ? $t(menuItem.key) : menuItem.text }}
            <v-badge v-if="menuItem.badge && menuItem.content" class="ml-1"
                     color="yellow"
                     text-color="red"
                     :content="dashboard[menuItem.content] > 0 ? dashboard[menuItem.content] : '0' "></v-badge>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
    <template v-else>
      <template v-if="$canViewVerticalNavMenuGroup(menuItem)">
        <v-list-group
          :value="menuItem.regex ? menuItem.regex.test($route.path) : false"
          :disabled="menuItem.disabled"
          :sub-group="subgroup"
          :to="localePath(menuItem.link)"
          link
        >

          <template v-slot:activator>
            <v-list-item-icon v-if="!subgroup">
              <v-icon :small="small">{{ menuItem.icon || 'mdi-circle-medium' }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ menuItem.key ? $t(menuItem.key) : menuItem.text }}
                <v-badge v-if="menuItem.badge && menuItem.content"
                         class="ml-1" color="yellow"
                         text-color="red"
                         :content="dashboard[menuItem.content] > 0 ? dashboard[menuItem.content] : '0' "></v-badge>

              </v-list-item-title>
            </v-list-item-content>
          </template>

          <slot></slot>

        </v-list-group>
      </template>

    </template>

  </div>
</template>

<script>
/*
|---------------------------------------------------------------------
| Navigation Menu Item Component
|---------------------------------------------------------------------
|
| Navigation items for the NavMenu component
|
*/
import {mapGetters} from "vuex";

export default {
  props: {
    menuItem: {
      type: Object,
      default: () => {
      }
    },
    subgroup: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    }
  },
  computed:{
    ...mapGetters('user/basic', ['dashboard'])
  },
}
</script>
