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
  SET_DATA(state, payload) {
    state.customerCartList = _.isUndefined(localStorage.getItem("cCarts")) ? [] : JSON.parse(localStorage.getItem("cCarts"));
  },
  ADD_DATA(state, payload) {
    let index = state.customerCartList.length;
    payload.index = index;
    state.customerCartList.push(payload);
    localStorage.setItem("cCarts", JSON.stringify(state.customerCartList));
  },
  UPDATE_DATA(state, payload) {
    let index = state.customerCartList.map(customerCart => customerCart.index).indexOf(payload.index);
    let total_price = parseFloat(state.customerCartList[index].price) * payload.quantity;
    Object.assign(state.customerCartList[index], {
      quantity: payload.quantity,
      total_price: total_price.toFixed(2)
    });
    localStorage.setItem("cCarts", JSON.stringify(state.customerCartList));
  },
  DELETE_DATA(state, payload) {
    let index = state.customerCartList.map(customerCart => customerCart.index).indexOf(payload);
    state.customerCartList.splice(index, 1);
    localStorage.setItem("cCarts", JSON.stringify(state.customerCartList));
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
