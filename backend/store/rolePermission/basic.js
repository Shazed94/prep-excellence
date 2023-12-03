export default {
  state: () => ({
    roles: [],
    menus: [],
    permissions: [],
    menu_permissions:[],
    types:[
      {id:1, name:'Admin' },
      {id:2, name:'Employee' },
      {id:3, name:'Student' },
      {id:4, name:'Parent' },
      {id:5, name:'Affiliation' },
    ],
  }),
  getters: {
    roles(state){
      return state.roles;
    },
    types(state){
      return state.types;
    },
    permissions(state){
      return state.permissions;
    },
    employee_roles(state){
      return state.roles.filter(item=>parseInt(item.type)===2);
    },
    activeEmployeeRoles(state){
      return state.roles.filter(item=>parseInt(item.type)===2 && item.is_active==1);
    },
    findTypeById: state=>id=> {
      return state.types.find(item=>item.id === id).name;
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
