export default {
  state: () => ({
    banks: []
  }),
  getters: {
    banks: (state) => {
      return state.banks
    },
    onlyActiveBanks: (state) => {
      return state.banks.filter(bank => {
        return bank.is_active === true
      })
    }
  },
  mutations: {
    SET_ALL_BANKS(state, banks) {
      state.banks = banks
    },
    ADD_NEW(state, bank) {
      state.banks.push(bank)
    },
    UPDATE_BANK(state, bank) {
      const editIndex = state.banks.findIndex((element) => element.id === bank.id)

      Object.assign(state.banks[editIndex], bank)
    },
    DELETE_BANK(state, index) {
      state.banks.splice(index, 1)
    },
    BANK_STATUS_CHANGE(state, value) {
      state.banks[value.index].is_active = value.value
    }
  },
  actions: {
    async GET_ALL_BANKS(context) {
      //context.commit('LOADER_STATUS_CHANGE',true);
      await this.$axios.get('/bank')
        .then((res) => {
          //context.commit('LOADER_STATUS_CHANGE',false);
          context.commit('SET_ALL_BANKS', res.data.data)
        }).catch(() => {
          //context.commit('LOADER_STATUS_CHANGE',false);
        })
    }
  }
}
