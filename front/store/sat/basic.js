export default {
  state: () => ({
    question_qualities: [],
    all_keys: [],
    sat_keys: [],
    sub_scores: [],
    cross_test_scores: [],
    sat_exams: [],
  }),
  getters: {
    question_qualities(state){
      return state.question_qualities;
    },
    all_keys(state){
      return state.all_keys;
    },
    sat_keys(state){
      return state.sat_keys;
    },
    sub_scores(state){
      return state.sub_scores;
    },
    cross_test_scores(state){
      return state.cross_test_scores;
    },
    sat_exams(state){
      return state.sat_exams;
    },
  },
  mutations: {
    SET_ITEMS(state, payload) {
      if (payload.stateName) {
        state[payload.stateName] = payload.data
      }
    },
  },
  actions: {
    async getItems(context, payload) {
      await this.$axios.get(payload.apiUrl).then((response) => {
        context.commit('SET_ITEMS', {stateName: payload.stateName, data: response.data})
      }).catch(() => {
        context.commit('SET_ITEMS', {stateName: payload.stateName, data: []})
      })
    },
  }
}
