export default {
  state: () => ({
    payments: [],
    totalItems: 0,
  }),
  getters: {
    payments(state){
      return state.payments;
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
    UPDATE_ITEM(state, payload) {
      if (payload.stateName) {
        Object.assign(state[payload.stateName][payload.index], payload.data)
      }
    },
    DELETE_ITEM(state, payload) {
      if (payload.stateName) {
        state[payload.stateName].splice(payload.index,1);
      }
    },
    STATUS_CHANGE(state, payload) {
      if (payload.stateName) {
        state[payload.stateName][payload.index][payload.name] = !state[payload.stateName][payload.index][payload.name];
      }
    },
  },
  actions: {
    async getItems(context, payload) {
      this.$axios.get(payload.apiUrl).then((response) => {
        context.commit('SET_ITEMS', {stateName: payload.stateName, data: response.data.data})
        context.commit('SET_TOTAL_ITEMS', response.data.meta.total)
      }).catch(() => {
        context.commit('SET_ITEMS', {stateName: payload.stateName, data: []})
        context.commit('SET_TOTAL_ITEMS', 0)
      })
    },
  }
}
