import Vue from 'vue'

const can = {
  methods: {
    $can(action = '', subject='') {
      if (this.$auth.loggedIn) {
        const permissions = this.$auth.user.ability ? this.$auth.user.ability : []

        if (permissions && permissions.length) {
          let index = permissions.findIndex(item=>item.action===action && item.subject===subject);
          return index >= 0;
        } else {
          return false
        }
      }
    },
    $canViewVerticalNavMenuGroup(item) {
      return item.items.some(i => this.$can(i.action, i.subject))
    },
  }
}

Vue.mixin(can)
