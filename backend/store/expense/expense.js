export default {
  state: () => ({
    expenses: [],
    totalItems: 0,
  }),
  getters: {
    expenses: (state) => {
      return state.expenses
    },
    totalItems: (state) => {
      return state.totalItems
    }
  },
  mutations: {
    SET_TOTAL_ITEMS(state, totalItems) {
      state.totalItems = totalItems
    },
    SET_ALL_EXPENSES(state, expenses) {
      state.expenses = expenses
    },
    ADD_NEW(state, expense) {
      state.totalItems += 1
      state.expenses.unshift(expense)
    },
    UPDATE_EXPENSE(state, expense) {
      const editIndex = state.expenses.findIndex((element) => element.id === expense.id)

      Object.assign(state.expenses[editIndex], expense)
    },
    DELETE_EXPENSE(state, index) {
      state.totalItems -= 1
      state.expenses.splice(index, 1)
    },
    EXPENSE_STATUS_CHANGE(state, value) {
      state.expenses[value.index].is_active = value.value
    }
  },
  actions: {
    async GET_ALL_EXPENSES(context, { page, per_page, search, start_date, end_date }) {
      //context.commit('LOADER_STATUS_CHANGE',true);
      let url = `/expense?per_page=${per_page}&page=${page}`

      if (search && search !== '') {
        url += `&search=${search}`
      }
      if (start_date) {
        url += `&start_date=${start_date}`
      }
      if (end_date) {
        url += `&end_date=${end_date}`
      }

      await this.$axios.get(url)
        .then((res) => {
          //context.commit('LOADER_STATUS_CHANGE',false);
          context.commit('SET_ALL_EXPENSES', res.data.data)
          context.commit('SET_TOTAL_ITEMS', res.data.meta.total)
        }).catch(() => {
          //context.commit('LOADER_STATUS_CHANGE',false);
        })
    }
  }
}
