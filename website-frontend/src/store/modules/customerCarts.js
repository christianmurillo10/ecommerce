// import axios from "axios";

const state = {
  customerCartList: []
};

const getters = {
  getProductCategoryById: (state) => (id) => {
    return state.productCategoryList.find(productCategory => productCategory.id === id);
  },
  getProductCategoryNameById: (state) => (id) => {
    return state.productCategoryList.find(productCategory => productCategory.id === id).name;
  },
  getProductCategoryList: (state) => {
    return state.productCategoryList;
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
