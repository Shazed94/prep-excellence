export default {
  state: () => ({
    subTypes: []
  }),
  getters: {
    subTypes: (state) => {
      return state.subTypes
    },
    onlyActiveSubTypes: (state) => {
      return state.subTypes.filter(subType => {
        return subType.is_active === true
      })
    },
    filterByExpenseTypeId: (state) => (id) => {
      const item = state.subTypes.filter((item) => item.expense_type_id === parseInt(id) && item.is_active === true)

      return item ? item : []
    }
  },
  mutations: {
    SET_ALL_SUB_TYPES(state, subTypes) {
      state.subTypes = subTypes
    },
    ADD_NEW(state, subType) {
      state.subTypes.push(subType)
    },
    UPDATE_SUB_TYPE(state, subType) {
      const editIndex = state.subTypes.findIndex((element) => element.id === subType.id)

      Object.assign(state.subTypes[editIndex], subType)
    },
    DELETE_SUB_TYPE(state, index) {
      state.subTypes.splice(index, 1)
    },
    SUB_TYPE_STATUS_CHANGE(state, value) {
      state.subTypes[value.index].is_active = value.value
    }
  },
  actions: {
    async GET_ALL_SUB_TYPES(context) {
      //context.commit('LOADER_STATUS_CHANGE',true);
      await this.$axios.get('/sub-expense-type')
        .then((res) => {
          //context.commit('LOADER_STATUS_CHANGE',false);
          context.commit('SET_ALL_SUB_TYPES', res.data.data)
        }).catch(() => {
          //context.commit('LOADER_STATUS_CHANGE',false);
        })
    }
  }
}
