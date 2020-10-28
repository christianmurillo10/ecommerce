import axios from "axios";
const apiUrl = process.env.VUE_APP_API_BACKEND;

const state = {
  productSubCategoryList: [],
  productSubCategoryDataById: "",
};

const getters = {};

const actions = {
  getDataByProductCategoryId(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const url = `${apiUrl}/productSubCategories/findAllbyProductCategoryId/${payload}`;
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url)
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
    const url = `${apiUrl}/productSubCategories/${payload}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("cToken")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, header)
          .then((response) => {
            const data = response.data;
            commit("SET_DATA_BY_ID", data.result);
            resolve(data);
          })
          .catch((err) => {
            commit("SET_DATA_BY_ID", "");
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
      state.productSubCategoryList = payload;
    } else {
      state.productSubCategoryList = [];
    }
  },
  SET_DATA_BY_ID(state, payload) {
    if (payload) {
      state.productSubCategoryDataById = payload;
    } else {
      state.productSubCategoryDataById = "";
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
