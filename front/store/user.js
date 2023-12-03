export default {
  state: () => ({
    users: [],

  }),
  getters: {
    students(state){
      return state.students;
    },
  },
  mutations: {
    SET_USER(state, payload) {
      state.users = payload
    },
    SET_ITEMS(state, payload) {
      if (payload.stateName) {
        state[payload.stateName] = payload.data
      }
    },
  },
  actions: {
    async getUser(context) {
      this.$axios.get('/users').then((response) => {
        context.commit('SET_USER', response?.data?.data)
      }).catch(() => {
      }).finally(() => {
      })
    },
    async getItems(context, payload) {
      this.$axios.get(payload.apiUrl).then((response) => {
        context.commit('SET_ITEMS', {stateName: payload.stateName, data: response.data.data})
        //context.commit('SET_TOTAL_ITEMS', response.data.meta.total)
      }).catch(() => {
        context.commit('SET_ITEMS', {stateName: payload.stateName, data: []})
        //context.commit('SET_TOTAL_ITEMS', 0)
      })
    },
  }
}
