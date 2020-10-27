import axios from "axios";
import FormData from "form-data";
const apiUrl = process.env.VUE_APP_API_BACKEND;

const state = {
  productBrandList: [],
  productBrandTotalCount: 0,
};

const getters = {
  getProductBrandById: (state) => (id) => {
    return state.productBrandList.find(
      (productBrand) => productBrand.id === id
    );
  },
  getProductBrandFileNameById: (state) => (id) => {
    return state.productBrandList.find((productBrand) => productBrand.id === id)
      .file_name;
  },
  getProductBrandList: (state) => {
    return state.productBrandList;
  },
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    const url = `${apiUrl}/productBrands/`;
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
                if (!_.isNull(element.file_name)) {
                  element.file_path = `${apiUrl}/productBrands/viewImage/${
                    element.file_name
                  }`;
                } else {
                  element.file_path = require("../../assets/images/no-image.png");
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
    const url = `${apiUrl}/productBrands/${payload}`;
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
  getTotalCount({ dispatch, commit, state, rootState, getters, rootGetters }) {
    const url = `${apiUrl}/productBrands/count/all`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, header)
          .then((response) => {
            const data = response.data;
            commit("SET_TOTAL_COUNT", data.result);
            resolve(data);
          })
          .catch((err) => {
            commit("SET_TOTAL_COUNT", 0);
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
    const url = `${apiUrl}/productBrands/create`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        var data = new FormData();
        data.set("name", payload.name);
        data.set("description", payload.description);
        data.set("file_name", payload.file_name);
        data.append("image", payload.file);

        axios
          .post(url, data, header)
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
    const url = `${apiUrl}/productBrands/update/${payload.id}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        var data = new FormData();
        data.set("name", payload.name);
        data.set("description", payload.description);
        data.set("file_name", payload.file_name);
        data.append("image", payload.file);

        axios
          .put(url, data, header)
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
    const url = `${apiUrl}/productBrands/delete/${payload}`;
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
      state.productBrandList = payload;
    } else {
      state.productBrandList = [];
    }
  },
  SET_TOTAL_COUNT(state, payload) {
    if (payload) {
      state.productBrandTotalCount = payload;
    } else {
      state.productBrandTotalCount = 0;
    }
  },
  ADD_DATA(state, payload) {
    let obj = payload;
    obj.file_path = _.isNull(payload.file_name)
      ? require("../../assets/images/no-image.png")
      : `${apiUrl}/productBrands/viewImage/${payload.file_name}`;
    state.productBrandList.push(obj);
  },
  UPDATE_DATA(state, payload) {
    const index = state.productBrandList
      .map((productBrand) => productBrand.id)
      .indexOf(payload.id);
    Object.assign(state.productBrandList[index], {
      name: payload.name,
      description: payload.description,
      file_name: payload.file_name,
      file_path: _.isNull(payload.file_name)
        ? require("../../assets/images/no-image.png")
        : `${apiUrl}/productBrands/viewImage/${payload.file_name}`,
    });
  },
  DELETE_DATA(state, payload) {
    const index = state.productBrandList
      .map((productBrand) => productBrand.id)
      .indexOf(payload);
    state.productBrandList.splice(index, 1);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
