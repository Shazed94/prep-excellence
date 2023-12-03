export default {
  state: () => ({
    users: [],
  }),
  getters: {},
  mutations: {
    SET_USER(state, payload) {
      state.users = payload
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
  }
}
