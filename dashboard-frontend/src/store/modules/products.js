import axios from "axios";

const state = {
  productList: []
};

const getters = {
  getProductById: (state) => (id) => {
    return state.productList.find(product => product.id === id);
  },
  getProductNameById: (state) => (id) => {
    return state.productList.find(product => product.id === id).name;
  },
  getProductList: (state) => {
    return state.productList;
  }
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    let url = `${process.env.VUE_APP_API_BACKEND}/products/`;
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
  getDataById({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/products/${payload}`;
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
    let url = `${process.env.VUE_APP_API_BACKEND}/products/create`;
    let header = { headers: { Token: localStorage.getItem("token") } };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          name: payload.name,
          description: payload.description,
          unit: payload.unit,
          tags: payload.tags,
          price_amount: payload.price_amount,
          vat_value: payload.vat_value,
          discount_value: payload.discount_value,
          product_brand_id: payload.product_brand_id,
          product_category_id: payload.product_category_id,
          product_sub_category_id: payload.product_sub_category_id,
          product_sub_sub_category_id: payload.product_sub_sub_category_id,
          vat_type: payload.vat_type,
          discount_type: payload.discount_type,
          is_today_deal: payload.is_today_deal,
          is_featured: payload.is_featured,
          is_published: payload.is_published
        };

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
    let url = `${process.env.VUE_APP_API_BACKEND}/products/update/${payload.id}`;
    let header = { headers: { Token: localStorage.getItem("token") } };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          name: payload.name,
          description: payload.description,
          unit: payload.unit,
          tags: payload.tags,
          price_amount: payload.price_amount,
          vat_value: payload.vat_value,
          discount_value: payload.discount_value,
          product_brand_id: payload.product_brand_id,
          product_category_id: payload.product_category_id,
          product_sub_category_id: payload.product_sub_category_id,
          product_sub_sub_category_id: payload.product_sub_sub_category_id,
          vat_type: payload.vat_type,
          discount_type: payload.discount_type,
          is_today_deal: payload.is_today_deal,
          is_featured: payload.is_featured,
          is_published: payload.is_published
        };

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
    let url = `${process.env.VUE_APP_API_BACKEND}/products/delete/${payload}`;
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
      state.productList = payload;
    } else {
      state.productList = [];
    }
  },
  ADD_DATA(state, payload) {
    state.productList.push(payload);
  },
  UPDATE_DATA(state, payload) {
    let index = state.productList.map(product => product.id).indexOf(payload.id);
    Object.assign(state.productList[index], {
      name: payload.name,
      description: payload.description,
      unit: payload.unit,
      tags: payload.tags,
      price_amount: payload.price_amount,
      vat_value: payload.vat_value,
      discount_value: payload.discount_value,
      product_brand_id: payload.product_brand_id,
      product_category_id: payload.product_category_id,
      product_sub_category_id: payload.product_sub_category_id,
      product_sub_sub_category_id: payload.product_sub_sub_category_id,
      vat_type: payload.vat_type,
      discount_type: payload.discount_type,
      is_today_deal: payload.is_today_deal,
      is_featured: payload.is_featured,
      is_published: payload.is_published
    });
  },
  DELETE_DATA(state, payload) {
    let index = state.productList.map(product => product.id).indexOf(payload);
    state.productList.splice(index, 1);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
