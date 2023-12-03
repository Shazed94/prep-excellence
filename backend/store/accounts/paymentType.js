export default {
  state: () => ({
    paymentTypes: []
  }),
  getters: {
    paymentTypes: (state) => {
      return state.paymentTypes
    },
    onlyActivePaymentTypes: (state) => {
      return state.paymentTypes.filter(paymentType => {
        return paymentType.is_active === true
      })
    }
  },
  mutations: {
    SET_ALL_PAYMENT_TYPES(state, paymentTypes) {
      state.paymentTypes = paymentTypes
    },
    ADD_NEW(state, paymentType) {
      state.paymentTypes.push(paymentType)
    },
    UPDATE_PAYMENT_TYPE(state, paymentType) {
      const editIndex = state.paymentTypes.findIndex((element) => element.id === paymentType.id)

      Object.assign(state.paymentTypes[editIndex], paymentType)
    },
    DELETE_PAYMENT_TYPE(state, index) {
      state.paymentTypes.splice(index, 1)
    },
    PAYMENT_TYPE_STATUS_CHANGE(state, value) {
      state.paymentTypes[value.index].is_active = value.value
    }
  },
  actions: {
    async GET_ALL_PAYMENT_TYPES(context) {
      //context.commit('LOADER_STATUS_CHANGE',true);
      await this.$axios.get('/payment-type')
        .then((res) => {
          //context.commit('LOADER_STATUS_CHANGE',false);
          context.commit('SET_ALL_PAYMENT_TYPES', res.data.data)
        }).catch(() => {
          //context.commit('LOADER_STATUS_CHANGE',false);
        })
    }
  }
}
