export default {
  state: () => ({
    messages: [],
    users: [],
    online_users: [],
    selected_user:{},
    totalItems: 0,
  }),
  getters: {
    messages(state){
      return state.messages.slice().reverse();
    },
    users(state){
      return state.users;
    },
    online_users(state){
      return state.online_users;
    },
    is_online: state => id =>{
      return state.online_users.includes(id);
    },
    selected_user(state){
      return state.selected_user;
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
        //state[payload.stateName].push(payload.data)
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
    UPDATE_MESSAGE_COUNTER(state, payload) {
      if (payload.stateName) {
        let index = state[payload.stateName].findIndex(item=>item.id == payload.id)
        if(index >= 0) state[payload.stateName][index][payload.name] = payload.value;
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