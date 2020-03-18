import axios from "axios";

const state = {
  productSubSubCategoryList: []
};

const getters = {
  getProductSubSubCategoryById: (state) => (id) => {
    return state.productSubSubCategoryList.find(productSubSubCategory => productSubSubCategory.id === id);
  },
  getProductSubSubCategoryList: (state) => {
    return state.productSubSubCategoryList;
  }
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productSubSubCategories/`;
    let header = { headers: { Token: localStorage.getItem("token") } };
    return new Promise((resolve, reject) => {
      try {
        axios.get(url, header)
          .then(response => {
            commit("SET_DATA", response.data.result);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  getDataByProductCategoryIdAndProductSubCategoryId({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productSubSubCategories/findAllbyProductCategoryIdAndProductSubCategoryId/${payload.categoryId}/${payload.subCategoryId}`;
    let header = { headers: { Token: localStorage.getItem("token") } };
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, header)
          .then(response => {
            commit("SET_DATA", response.data.result);
            resolve(response);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  getDataById({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productSubSubCategories/${payload}`;
    let header = { headers: { Token: localStorage.getItem("token") } };
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, header)
          .then(response => {
            resolve(response);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  saveData({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productSubSubCategories/create`;
    let header = { headers: { Token: localStorage.getItem("token") } };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          name: payload.name,
          description: payload.description,
          product_category_id: payload.product_category_id,
          product_sub_category_id: payload.product_sub_category_id
        }

        axios
          .post(url, obj, header)
          .then(response => {
            if (response.data.result) {
              commit("ADD_DATA", response.data.result);
            }
            resolve(response);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  updateData({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productSubSubCategories/update/${payload.id}`;
    let header = { headers: { Token: localStorage.getItem("token") } };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          name: payload.name,
          description: payload.description,
          product_category_id: payload.product_category_id,
          product_sub_category_id: payload.product_sub_category_id
        }

        axios
          .put(url, obj, header)
          .then(response => {
            commit("UPDATE_DATA", response.data.result);
            resolve(response);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  deleteData({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productSubSubCategories/delete/${payload}`;
    let header = { headers: { Token: localStorage.getItem("token") } };
    return new Promise((resolve, reject) => {
      try {
        axios
          .put(url, '', header)
          .then(response => {
            commit("DELETE_DATA", payload);
            resolve(response);
          });
      } catch (err) {
        reject(err);
      }
    });
  }
};

const mutations = {
  SET_DATA(state, payload) {
    if (payload) {
      state.productSubSubCategoryList = payload;
    } else {
      state.productSubSubCategoryList = [];
    }
  },
  ADD_DATA(state, payload) {
    state.productSubSubCategoryList.push(payload);
  },
  UPDATE_DATA(state, payload) {
    let index = state.productSubSubCategoryList.map(productSubSubCategory => productSubSubCategory.id).indexOf(payload.id);
    Object.assign(state.productSubSubCategoryList[index], {
      name: payload.name,
      description: payload.description,
      product_category_id: payload.product_category_id,
      productCategories: payload.productCategories,
      product_sub_category_id: payload.product_sub_category_id,
      productSubCategories: payload.productSubCategories
    });
  },
  DELETE_DATA(state, payload) {
    let index = state.productSubSubCategoryList.map(productSubSubCategory => productSubSubCategory.id).indexOf(payload);
    state.productSubSubCategoryList.splice(index, 1);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
