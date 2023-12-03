export default {
  state: () => ({
    designations: [],
    religions: [],
    genders: [],
    blood_groups: [],
    marital_status: [],
    login_modal:false,
    signup_modal:false,
    forget_password_modal:false,
    students:[],
    dashboard:{},
  }),
  getters: {
    students(state){
      return state.students;
    },
    dashboard(state){
      return state.dashboard;
    },
    designations(state){
      return state.designations;
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
    login_modal(state){
      return state.login_modal;
    },
    signup_modal(state){
      return state.signup_modal;
    },
    forget_password_modal(state){
      return state.forget_password_modal;
    },
  },
  mutations: {
    SET_LOGIN(state, payload) {
      state.signup_modal = false
      state.forget_password_modal = false
      state.login_modal = payload
    },
    SET_SIGNUP(state, payload) {
      state.login_modal = false
      state.forget_password_modal = false
      state.signup_modal = payload
    },
    SET_FORGET(state, payload) {
      state.login_modal = false
      state.signup_modal = false
      state.forget_password_modal = payload
    },
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
