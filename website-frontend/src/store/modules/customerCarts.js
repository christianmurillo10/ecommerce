// import axios from "axios";

const state = {
  customerCartList: []
};

const getters = {
  getCustomerCartTotalPrice: (state) => {
    let totalPrice = 0;
    state.customerCartList.forEach(element => {
      totalPrice += parseFloat(element.total_price)
    });
    return totalPrice.toFixed(2);
  }
};

const actions = {
};

const mutations = {
  ADD_DATA(state, payload) {
    let index = state.customerCartList.length;
    payload.index = index;
    state.customerCartList.push(payload);
  },
  DELETE_DATA(state, payload) {
    let index = state.customerCartList.map(customerCart => customerCart.index).indexOf(payload);
    state.customerCartList.splice(index, 1);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
