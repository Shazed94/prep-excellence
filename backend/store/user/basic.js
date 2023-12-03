export default {
  state: () => ({
    designations: [],
    religions: [],
    genders: [],
    blood_groups: [],
    marital_status: [],
    roles: [],
    dashboard:{},
  }),
  getters: {
    designations(state){
      return state.designations;
    },
    activeDesignations(state){
      return state.designations.filter(item=> item.is_active==1);
    },
    religions(state){
      return state.religions;
    },
    genders(state){
      return state.genders;
    },
    blood_groups(state){
      return state.blood_groups;
    },
    marital_status(state){
      return state.marital_status;
    },
    roles(state){
      return state.roles;
    },
    dashboard(state){
      return state.dashboard;
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
        context.commit('SET_ITEMS', {stateName: payload.stateName, data: response?.data?.data})
      }).catch(() => {
        context.commit('SET_ITEMS', {stateName: payload.stateName, data: []})
      })
    },
  }
}
