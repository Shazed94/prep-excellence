export default {
  state: () => ({
    instructors: [],
    totalItems: 0,
    last_page:1,
  }),
  getters: {
    instructors(state){
      return state.instructors;
    },
    totalItems(state){
      return state.totalItems;
    },
    last_page(state){
      return state.last_page;
    },
  },
  mutations: {
    SET_ITEMS(state, payload) {
      if (payload.stateName) {
        state[payload.stateName] = payload.data
      }
    },
    SET_ITEMS_MORE(state, payload){
      if (payload.stateName) {
        state[payload.stateName].push(...payload.data)
      }
    },
    SET_LAST_PAGE(state,lastPage){
      state.last_page = lastPage
    },
    INSERT_NEW_ITEMS(state, payload) {
      if (payload.stateName) {
        state[payload.stateName].push(payload.data)
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
        state[payload.stateName][payload.index][payload.name]= !state[payload.stateName][payload.index][payload.name];
      }
    },
  },
  actions: {
    async getItems(context, payload) {
      this.$axios.get(payload.apiUrl).then((response) => {
        if (context.state.instructors.length){
          let counter = context.state.totalItems + response.data.meta.total
          context.commit('SET_ITEMS_MORE', {stateName: payload.stateName, data: response.data.data})
          context.commit('SET_TOTAL_ITEMS', counter)
          context.commit('SET_LAST_PAGE', response.data.meta.last_page)
        }else{
          context.commit('SET_ITEMS', {stateName: payload.stateName, data: response.data.data})
          context.commit('SET_TOTAL_ITEMS', response.data.meta.total)
          context.commit('SET_LAST_PAGE', response.data.meta.last_page)
        }
      }).catch(() => {
        context.commit('SET_ITEMS', {stateName: payload.stateName, data: []})
        context.commit('SET_TOTAL_ITEMS', 0)
        context.commit('SET_LAST_PAGE', 1)
      })
    },
  }
}
