import axios from "axios";

const state = {
  cartList: []
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
  ADD_TO_CART(state, payload) {
    state.cartList.push(payload);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
