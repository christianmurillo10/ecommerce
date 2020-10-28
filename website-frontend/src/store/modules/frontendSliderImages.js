import axios from "axios";
const apiUrl = process.env.VUE_APP_API_BACKEND;

const state = {
  frontendSliderImageList: [],
};

const getters = {};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    const url = `${apiUrl}/frontendSliderImages/`;
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url)
          .then((response) => {
            const data = response.data;
            let obj = data.result;
            if (obj) {
              obj.forEach((element) => {
                element.file_path = `${apiUrl}/frontendSliderImages/viewImage/${element.file_name}`;
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
};

const mutations = {
  SET_DATA(state, payload) {
    if (payload) {
      state.frontendSliderImageList = payload.sort((a, b) => a.order - b.order);
    } else {
      state.frontendSliderImageList = [];
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
