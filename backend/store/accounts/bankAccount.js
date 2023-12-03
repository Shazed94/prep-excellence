export default {
  state: () => ({
    bankAccounts: []
  }),
  getters: {
    bankAccounts: (state) => {
      return state.bankAccounts
    },
    onlyActiveBankAccounts: (state) => {
      return state.bankAccounts.filter(bankAccount => {
        return bankAccount.is_active === true
      })
    }
  },
  mutations: {
    SET_ALL_BANK_ACCOUNTS(state, bankAccounts) {
      state.bankAccounts = bankAccounts
    },
    ADD_NEW(state, bank) {
      state.bankAccounts.push(bank)
    },
    UPDATE_BANK_ACCOUNT(state, bankAccount) {
      const editIndex = state.bankAccounts.findIndex((element) => element.id === bankAccount.id)

      Object.assign(state.bankAccounts[editIndex], bankAccount)
    },
    DELETE_BANK_ACCOUNT(state, index) {
      state.bankAccounts.splice(index, 1)
    },
    BANK_ACCOUNT_STATUS_CHANGE(state, value) {
      state.bankAccounts[value.index].is_active = value.value
    }
  },
  actions: {
    async GET_ALL_BANK_ACCOUNTS(context) {
      //context.commit('LOADER_STATUS_CHANGE',true);
      await this.$axios.get('/bank-account')
        .then((res) => {
          //context.commit('LOADER_STATUS_CHANGE',false);
          context.commit('SET_ALL_BANK_ACCOUNTS', res.data.data)
        }).catch(() => {
          //context.commit('LOADER_STATUS_CHANGE',false);
        })
    }
  }
}
