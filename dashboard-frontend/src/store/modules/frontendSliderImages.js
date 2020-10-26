import axios from "axios";
import FormData from "form-data";
const apiUrl = process.env.VUE_APP_API_BACKEND;

const state = {
  frontendSliderImageList: [],
};

const getters = {
  getFrontendSliderImageById: (state) => (id) => {
    return state.frontendSliderImageList.find(
      (frontendSliderImage) => frontendSliderImage.id === id
    );
  },
  getFrontendSliderImageFileNameById: (state) => (id) => {
    return state.frontendSliderImageList.find(
      (frontendSliderImage) => frontendSliderImage.id === id
    ).file_name;
  },
  getFrontendSliderImageList: (state) => {
    return state.frontendSliderImageList;
  },
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    const url = `${apiUrl}/frontendSliderImages/`;
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

            if (obj !== false) {
              obj.forEach((element) => {
                if (!_.isNull(element.file_name)) {
                  element.file_path = `${apiUrl}/frontendSliderImages/viewImage/${
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
    const url = `${apiUrl}/frontendSliderImages/${payload}`;
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
    const url = `${apiUrl}/frontendSliderImages/create`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        var data = new FormData();
        data.set("file_name", payload.file_name);
        data.set("url", payload.url);
        data.set("order", payload.order);
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
    const url = `${apiUrl}/frontendSliderImages/update/${payload.id}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        var data = new FormData();
        data.set("file_name", payload.file_name);
        data.set("url", payload.url);
        data.set("order", payload.order);
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
    const url = `${apiUrl}/frontendSliderImages/delete/${payload}`;
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
      state.frontendSliderImageList = payload;
    } else {
      state.frontendSliderImageList = [];
    }
  },
  ADD_DATA(state, payload) {
    let obj = payload;
    obj.file_path = _.isNull(payload.file_name)
      ? require("../../assets/images/no-image.png")
      : `${apiUrl}/frontendSliderImages/viewImage/${payload.file_name}`;
    state.frontendSliderImageList.push(obj);
  },
  UPDATE_DATA(state, payload) {
    const index = state.frontendSliderImageList
      .map((frontendSliderImage) => frontendSliderImage.id)
      .indexOf(payload.id);
    Object.assign(state.frontendSliderImageList[index], {
      file_name: payload.file_name,
      url: payload.url,
      order: payload.order,
      file_path: _.isNull(payload.file_name)
        ? require("../../assets/images/no-image.png")
        : `${apiUrl}/frontendSliderImages/viewImage/${payload.file_name}`,
    });
  },
  DELETE_DATA(state, payload) {
    const index = state.frontendSliderImageList
      .map((frontendSliderImage) => frontendSliderImage.id)
      .indexOf(payload);
    state.frontendSliderImageList.splice(index, 1);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
