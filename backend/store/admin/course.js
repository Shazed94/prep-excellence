export default {
  state: () => ({
    courses: [],
    only_courses:[],
    totalItems: 0,
    days:[
      {id:1, name:'Saturday'},
      {id:2, name:'Sunday'},
      {id:3, name:'Monday'},
      {id:4, name:'Tuesday'},
      {id:5, name:'Wednesday'},
      {id:6, name:'Thursday'},
      {id:7, name:'Friday'},
    ],
  }),
  getters: {
    courses(state){
      return state.courses;
    },
    only_courses(state){
      return state.only_courses;
    },
    totalItems(state){
      return state.totalItems;
    },
    days(state){
      return state.days;
    }
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
    async getItems2(context, payload) {
      await this.$axios.get(payload.apiUrl).then((response) => {
        context.commit('SET_ITEMS', {stateName: payload.stateName, data: response.data.data})
      }).catch(() => {
        context.commit('SET_ITEMS', {stateName: payload.stateName, data: []})
      })
    },
  }
}
