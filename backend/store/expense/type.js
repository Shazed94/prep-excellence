export default {
  state: () => ({
    types: []
  }),
  getters: {
    types: (state) => {
      return state.types
    },
    onlyActiveTypes: (state) => {
      return state.types.filter(type => {
        return type.is_active === true
      })
    }
  },
  mutations: {
    SET_ALL_TYPES(state, types) {
      state.types = types
    },
    ADD_NEW(state, type) {
      state.types.push(type)
    },
    UPDATE_TYPE(state, type) {
      const editIndex = state.types.findIndex((element) => element.id === type.id)

      Object.assign(state.types[editIndex], type)
    },
    DELETE_TYPE(state, index) {
      state.types.splice(index, 1)
    },
    TYPE_STATUS_CHANGE(state, value) {
      state.types[value.index].is_active = value.value
    }
  },
  actions: {
    async GET_ALL_TYPES(context) {
      //context.commit('LOADER_STATUS_CHANGE',true);
      await this.$axios.get('/expense-type')
        .then((res) => {
          //context.commit('LOADER_STATUS_CHANGE',false);
          context.commit('SET_ALL_TYPES', res.data.data)
        }).catch(() => {
          //context.commit('LOADER_STATUS_CHANGE',false);
        })
    }
  }
}
