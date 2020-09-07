import axios from "axios";

const state = {
  productFlashDealDetailList: []
};

const getters = {
  getProductFlashDealDetailById: (state) => (id) => {
    return state.productFlashDealDetailList.find(productFlashDealDetail => productFlashDealDetail.id === id);
  },
  getProductFlashDealDetailList: (state) => {
    return state.productFlashDealDetailList;
  }
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productFlashDealDetails/`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
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
  getDataByProductFlashDealId({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productFlashDealDetails/findAllbyProductFlashDealId/${payload}`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        axios.get(url, header)
          .then(response => {
            let obj = response.data.result;
            if (obj) {
              obj.forEach(element => {
                if (element.products.productImages.length > 0) {
                  element.products.productImages.forEach(elementImage => {
                    elementImage.file_path = `${process.env.VUE_APP_API_BACKEND}/productImages/viewImage/${elementImage.file_name}/${elementImage.type}`;
                  });
                } else {
                  element.products.productImages.push({ file_path: require("../../assets/images/no-image.png") });
                }
              });
            }
            commit("SET_DATA", obj);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  getDataById({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productFlashDealDetails/${payload}`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
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
    let url = `${process.env.VUE_APP_API_BACKEND}/productFlashDealDetails/create`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          discount_value: payload.discount_value,
          base_price_amount: payload.base_price_amount,
          current_price_amount: payload.current_price_amount,
          quantity: payload.quantity,
          product_id: payload.product_id,
          product_flash_deal_id: payload.product_flash_deal_id,
          discount_type: payload.discount_type
        };

        axios
          .post(url, obj, header)
          .then(response => {
            if (response.data.result) {
              let obj = response.data.result;
              if (obj.products.productImages.length > 0) {
                obj.products.productImages.forEach(elementImage => {
                  elementImage.file_path = `${process.env.VUE_APP_API_BACKEND}/productImages/viewImage/${elementImage.file_name}/${elementImage.type}`;
                });
              } else {
                obj.products.productImages.push({ file_path: require("../../assets/images/no-image.png") });
              }
              commit("ADD_DATA", obj);
            }
            resolve(response);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  updateData({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productFlashDealDetails/update/${payload.id}`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          discount_value: payload.discount_value,
          base_price_amount: payload.base_price_amount,
          current_price_amount: payload.current_price_amount,
          quantity: payload.quantity,
          product_id: payload.product_id,
          product_flash_deal_id: payload.product_flash_deal_id,
          discount_type: payload.discount_type
        };

        axios
          .put(url, obj, header)
          .then(response => {
            let obj = response.data.result;
            if (obj.products.productImages.length > 0) {
              obj.products.productImages.forEach(elementImage => {
                elementImage.file_path = `${process.env.VUE_APP_API_BACKEND}/productImages/viewImage/${elementImage.file_name}/${elementImage.type}`;
              });
            } else {
              obj.products.productImages.push({ file_path: require("../../assets/images/no-image.png") });
            }
            commit("UPDATE_DATA", obj);
            resolve(response);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  deleteData({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productFlashDealDetails/delete/${payload}`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
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
      state.productFlashDealDetailList = payload;
    } else {
      state.productFlashDealDetailList = [];
    }
  },
  ADD_DATA(state, payload) {
    state.productFlashDealDetailList.push(payload);
  },
  UPDATE_DATA(state, payload) {
    let index = state.productFlashDealDetailList.map(productFlashDealDetail => productFlashDealDetail.id).indexOf(payload.id);
    Object.assign(state.productFlashDealDetailList[index], {
      discount_value: payload.discount_value,
      base_price_amount: payload.base_price_amount,
      current_price_amount: payload.current_price_amount,
      quantity: payload.quantity,
      product_id: payload.product_id,
      product_flash_deal_id: payload.product_flash_deal_id,
      discount_type: payload.discount_type
    });
  },
  DELETE_DATA(state, payload) {
    let index = state.productFlashDealDetailList.map(productFlashDealDetail => productFlashDealDetail.id).indexOf(payload);
    state.productFlashDealDetailList.splice(index, 1);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
