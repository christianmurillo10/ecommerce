import axios from "axios";
const apiUrl = process.env.VUE_APP_API_BACKEND;

const state = {
  productVariationDetailList: [],
};

const getters = {
  getProductVariationDetailById: (state) => (id) => {
    return state.productVariationDetailList.find(
      (productVariationDetail) => productVariationDetail.id === id
    );
  },
  getProductVariationDetailList: (state) => {
    return state.productVariationDetailList;
  },
  getFilteredProductVariationDetailList: (state) => {
    let filteredList = [];
    state.productVariationDetailList.forEach((value) => {
      filteredList.push({
        id: value.id,
        code: value.code,
        name: value.name,
      });
    });
    return filteredList;
  },
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    const url = `${apiUrl}/productVariationDetails/`;
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
  getDataByProductVariationId(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const url = `${apiUrl}/productVariationDetails/findAllbyProductVariationId/${payload}`;
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
  getDataById(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const url = `${apiUrl}/productVariationDetails/${payload}`;
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
    const url = `${apiUrl}/productVariationDetails/create`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          code: payload.code,
          name: payload.name,
          product_variation_id: payload.product_variation_id,
        };

        axios
          .post(url, obj, header)
          .then((response) => {
            const data = response.data;
            if (data.result) {
              commit("ADD_DATA", data.result);
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
    const url = `${apiUrl}/productVariationDetails/update/${payload.id}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          code: payload.code,
          name: payload.name,
          product_variation_id: payload.product_variation_id,
        };

        axios
          .put(url, obj, header)
          .then((response) => {
            const data = response.data;
            commit("UPDATE_DATA", data.result);
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
    const url = `${apiUrl}/productVariationDetails/delete/${payload}`;
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
      state.productVariationDetailList = payload;
    } else {
      state.productVariationDetailList = [];
    }
  },
  ADD_DATA(state, payload) {
    state.productVariationDetailList.push(payload);
  },
  UPDATE_DATA(state, payload) {
    const index = state.productVariationDetailList
      .map((productVariationDetail) => productVariationDetail.id)
      .indexOf(payload.id);
    Object.assign(state.productVariationDetailList[index], {
      code: payload.code,
      name: payload.name,
      product_variation_id: payload.product_variation_id,
    });
  },
  DELETE_DATA(state, payload) {
    const index = state.productVariationDetailList
      .map((productVariationDetail) => productVariationDetail.id)
      .indexOf(payload);
    state.productVariationDetailList.splice(index, 1);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
