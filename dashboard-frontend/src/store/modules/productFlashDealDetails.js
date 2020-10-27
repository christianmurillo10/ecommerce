import axios from "axios";
const apiUrl = process.env.VUE_APP_API_BACKEND;

const state = {
  productFlashDealDetailList: [],
};

const getters = {
  getProductFlashDealDetailById: (state) => (id) => {
    return state.productFlashDealDetailList.find(
      (productFlashDealDetail) => productFlashDealDetail.id === id
    );
  },
  getProductFlashDealDetailList: (state) => {
    return state.productFlashDealDetailList;
  },
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    const url = `${apiUrl}/productFlashDealDetails/`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, header)
          .then((response) => {
            const data = response.data;
            commit("SET_DATA", data.result);
            resolve(data);
          })
          .catch((err) => {
            commit("SET_DATA", []);
            resolve(err.response.data);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  getDataByProductFlashDealId(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const url = `${apiUrl}/productFlashDealDetails/findAllbyProductFlashDealId/${payload}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, header)
          .then((response) => {
            const data = response.data;
            let obj = data.result;
            if (obj) {
              obj.forEach((element) => {
                if (element.products.productImages.length > 0) {
                  element.products.productImages.forEach((elementImage) => {
                    elementImage.file_path = `${apiUrl}/productImages/viewImage/${
                      elementImage.file_name
                    }/${elementImage.type}`;
                  });
                } else {
                  element.products.productImages.push({
                    file_path: require("../../assets/images/no-image.png"),
                  });
                }
              });
            }
            commit("SET_DATA", obj);
            resolve(data);
          })
          .catch((err) => {
            commit("SET_DATA", []);
            resolve(err.response.data);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  getDataById(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const url = `${apiUrl}/productFlashDealDetails/${payload}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, header)
          .then((response) => {
            const data = response.data;
            resolve(data);
          })
          .catch((err) => {
            resolve(err.response.data);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  saveData(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const url = `${apiUrl}/productFlashDealDetails/create`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          discount_percentage: payload.discount_percentage,
          discount_amount: payload.discount_amount,
          base_price_amount: payload.base_price_amount,
          current_price_amount: payload.current_price_amount,
          quantity: payload.quantity,
          product_id: payload.product_id,
          product_flash_deal_id: payload.product_flash_deal_id,
          discount_type: payload.discount_type,
        };

        axios
          .post(url, obj, header)
          .then((response) => {
            const data = response.data;
            let obj = data.result;
            if (obj) {
              if (obj.products.productImages.length > 0) {
                obj.products.productImages.forEach((elementImage) => {
                  elementImage.file_path = `${apiUrl}/productImages/viewImage/${
                    elementImage.file_name
                  }/${elementImage.type}`;
                });
              } else {
                obj.products.productImages.push({
                  file_path: require("../../assets/images/no-image.png"),
                });
              }
              commit("ADD_DATA", obj);
            }
            resolve(data);
          })
          .catch((err) => {
            resolve(err.response.data);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  updateData(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const url = `${apiUrl}/productFlashDealDetails/update/${payload.id}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          discount_percentage: payload.discount_percentage,
          discount_amount: payload.discount_amount,
          current_price_amount: payload.current_price_amount,
          quantity: payload.quantity,
          product_id: payload.product_id,
          product_flash_deal_id: payload.product_flash_deal_id,
          discount_type: payload.discount_type,
        };

        axios
          .put(url, obj, header)
          .then((response) => {
            const data = response.data;
            let obj = data.result;
            if (obj.products.productImages.length > 0) {
              obj.products.productImages.forEach((elementImage) => {
                elementImage.file_path = `${apiUrl}/productImages/viewImage/${
                  elementImage.file_name
                }/${elementImage.type}`;
              });
            } else {
              obj.products.productImages.push({
                file_path: require("../../assets/images/no-image.png"),
              });
            }
            commit("UPDATE_DATA", obj);
            resolve(data);
          })
          .catch((err) => {
            resolve(err.response.data);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  deleteData(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const url = `${apiUrl}/productFlashDealDetails/delete/${payload}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        axios
          .put(url, "", header)
          .then((response) => {
            const data = response.data;
            commit("DELETE_DATA", payload);
            resolve(data);
          })
          .catch((err) => {
            resolve(err.response.data);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
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
    const index = state.productFlashDealDetailList
      .map((productFlashDealDetail) => productFlashDealDetail.id)
      .indexOf(payload.id);
    Object.assign(state.productFlashDealDetailList[index], {
      discount_percentage: payload.discount_percentage,
      discount_amount: payload.discount_amount,
      current_price_amount: payload.current_price_amount,
      quantity: payload.quantity,
      product_id: payload.product_id,
      product_flash_deal_id: payload.product_flash_deal_id,
      discount_type: payload.discount_type,
    });
  },
  DELETE_DATA(state, payload) {
    const index = state.productFlashDealDetailList
      .map((productFlashDealDetail) => productFlashDealDetail.id)
      .indexOf(payload);
    state.productFlashDealDetailList.splice(index, 1);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
