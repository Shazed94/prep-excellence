export default {
  state: () => ({
    notifications: [],
    totalItems: 0,
  }),
  getters: {
    notifications(state){
      return state.notifications;
    },
    totalItems(state){
      return state.totalItems;
    },
  },
  mutations: {
    SET_ITEMS(state, payload) {
      if (payload.stateName) {
        state[payload.stateName] = payload.data
      }
    },
    INSERT_NEW_ITEMS(state, payload) {
      if (payload.stateName) {
        state[payload.stateName].unshift(payload.data)
      }
    },
    SET_TOTAL_ITEMS(state, totalItems) {
      state.totalItems = totalItems
    },
    STATUS_CHANGE(state, payload) {
      if (payload.stateName) {
        state[payload.stateName][payload.index][payload.name] = payload.value;
      }
    },
  },
  actions: {
    async getItems(context, payload) {
      await this.$axios.get(payload.apiUrl).then((response) => {
        context.commit('SET_ITEMS', {stateName: payload.stateName, data: response.data.data})
        context.commit('SET_TOTAL_ITEMS', response.data.meta.total)
      }).catch(() => {
        context.commit('SET_ITEMS', {stateName: payload.stateName, data: []})
        context.commit('SET_TOTAL_ITEMS', 0)
      })
    },
  }
}
