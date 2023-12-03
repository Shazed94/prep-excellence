export default {
  state: () => ({
    additional_incomes: [],
    totalItems: 0
  }),
  getters: {
    additional_incomes: (state) => {
      return state.additional_incomes
    },
    totalItems: (state) => {
      return state.totalItems
    },
  },
  mutations: {
    SET_TOTAL_ITEMS(state, totalItems) {
      state.totalItems = totalItems
    },
    SET_ALL_ITEMS(state, additional_incomes) {
      state.additional_incomes = additional_incomes
    },
    ADD_NEW(state, additional_income) {
      state.totalItems += 1
      state.additional_incomes.push(additional_income)
    },
    UPDATE_ITEM(state, additional_income) {
      const editIndex = state.additional_incomes.findIndex((element) => element.id === additional_income.id)

      Object.assign(state.additional_incomes[editIndex], additional_income)
    },
    DELETE_ITEM(state, index) {
      state.totalItems -= 1
      state.additional_incomes.splice(index, 1)
    },
  },
  actions: {
    async GET_ALL_INCOME(context, { page, per_page, search }) {
      //context.commit('LOADER_STATUS_CHANGE',true);
      let url = `/additional-income?per_page=${per_page}&page=${page}`

      if (search && search !== '') {
        url += `&search=${search}`
      }

      await this.$axios.get(url)
        .then((res) => {
          //context.commit('LOADER_STATUS_CHANGE',false);
          //console.log(res.data.data);
          context.commit('SET_ALL_ITEMS', res.data.data)
          context.commit('SET_TOTAL_ITEMS', res.data.total)
        }).catch(() => {
          //context.commit('LOADER_STATUS_CHANGE',false);
        })
    }
  }
}
