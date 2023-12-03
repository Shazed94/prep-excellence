export default {
  state: () => ({
    pages: [],
    totalItems: 0,
    templates:[
      {id:1, name:'About us'},
      {id:2, name:'Contact Us'},
      {id:3, name:'All Courses'},
      {id:4, name:'Blog'},
      {id:5, name:'Tutoring'},
      {id:6, name:'College Admission'},
      {id:7, name:'FAQs'},
    ],
  }),
  getters: {
    pages(state){
      return state.pages;
    },
    totalItems(state){
      return state.totalItems;
    },
    templates(state){
      return state.templates;
    },
    pageTitleById:state=>id=>{
      let tt = state.pages.find(item=>parseInt(item.id) === parseInt(id));
      if (tt) return tt.title;
      else return '';
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
        context.commit('SET_ITEMS', {stateName: payload.stateName, data: response.data.data})
        context.commit('SET_TOTAL_ITEMS', response.data.meta.total)
      }).catch(() => {
        context.commit('SET_ITEMS', {stateName: payload.stateName, data: []})
        context.commit('SET_TOTAL_ITEMS', 0)
      })
    },
  }
}
