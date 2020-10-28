import axios from "axios";
const apiUrl = process.env.VUE_APP_API_BACKEND;

const state = {
  productCategoryWithSubList: [],
  productCategoryList: [],
  productCategoryDataById: "",
};

const getters = {};

const actions = {
  getDataWithSubCategories({
    dispatch,
    commit,
    state,
    rootState,
    getters,
    rootGetters,
  }) {
    const url = `${apiUrl}/productCategories/findAllWithSubCategories`;
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url)
          .then((response) => {
            const data = response.data;
            commit("SET_DATA_WITH_SUB_CATEGORIES", data.result);
            resolve(data);
          })
          .catch((err) => {
            commit("SET_DATA_WITH_SUB_CATEGORIES", []);
            resolve(err.response.data);
          });
      } catch (err) {
        reject(err);
      }
    });
  },

  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    const url = `${apiUrl}/productCategories/`;
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
    const url = `${apiUrl}/productCategories/${payload}`;
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
  SET_DATA_WITH_SUB_CATEGORIES(state, payload) {
    if (payload) {
      state.productCategoryWithSubList = payload;
    } else {
      state.productCategoryWithSubList = [];
    }
  },

  SET_DATA(state, payload) {
    if (payload) {
      state.productCategoryList = payload;
    } else {
      state.productCategoryList = [];
    }
  },
  SET_DATA_BY_ID(state, payload) {
    if (payload) {
      state.productCategoryDataById = payload;
    } else {
      state.productCategoryDataById = "";
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
