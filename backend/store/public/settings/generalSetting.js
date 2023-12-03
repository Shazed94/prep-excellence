export default {
  state: () => ({
    general_settings: [],
  }),
  getters: {
    general_settings(state){
      return state.general_settings
    },
    get_setting_val: (state)=>(group,name)=>{
      let val = state.general_settings.find(item=>item.group === group && item.name === name);
      if (val) return val.value;
      else return null;
    }
  },
  mutations: {
    SET_SETTINGS(state, payload) {
      state.general_settings = payload
    },
  },
  actions: {
    async getSettings(context) {
      this.$axios.get('/setting/').then((response) => {
        context.commit('SET_SETTINGS', response?.data?.data)
      }).catch(() => {
      }).finally(() => {
      })
    },
  }
}
