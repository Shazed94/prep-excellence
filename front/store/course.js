export default {
  state: () => ({
    courses: [],
    totalItems: 0,
  }),
  getters: {
    courses(state){
      return state.courses;
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
        state[payload.stateName].push(payload.data)
      }
    },
    SET_TOTAL_ITEMS(state, totalItems) {
      state.totalItems = totalItems
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
