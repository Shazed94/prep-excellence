export default {
  state: () => ({
    withdraws: [],
    totalItems: 0
  }),
  getters: {
    withdraws: (state) => {
      return state.withdraws
    },
    totalItems: (state) => {
      return state.totalItems
    },
  },
  mutations: {
    SET_TOTAL_ITEMS(state, totalItems) {
      state.totalItems = totalItems
    },
    SET_ALL_WITHDRAW(state, withdraws) {
      state.withdraws = withdraws
    },
    ADD_NEW(state, withdraw) {
      state.totalItems += 1
      state.withdraws.push(withdraw)
    },
    UPDATE_WITHDRAW(state, withdraw) {
      const editIndex = state.withdraws.findIndex((element) => element.id === withdraw.id)

      Object.assign(state.withdraws[editIndex], withdraw)
    },
    DELETE_WITHDRAW(state, index) {
      state.totalItems -= 1
      state.withdraws.splice(index, 1)
    },
    WITHDRAW_STATUS_CHANGE(state, value) {
      state.withdraws[value.index].is_active = value.value
    }
  },
  actions: {
    async GET_ALL_WITHDRAWS(context, { page, per_page, search }) {
      //context.commit('LOADER_STATUS_CHANGE',true);
      let url = `/withdraw?per_page=${per_page}&page=${page}`

      if (search && search !== '') {
        url += `&search=${search}`
      }

      await this.$axios.get(url)
        .then((res) => {
          //context.commit('LOADER_STATUS_CHANGE',false);
          context.commit('SET_ALL_WITHDRAW', res.data.data)
          context.commit('SET_TOTAL_ITEMS', res.data.meta.total)
        }).catch(() => {
          //context.commit('LOADER_STATUS_CHANGE',false);
        })
    }
  }
}
