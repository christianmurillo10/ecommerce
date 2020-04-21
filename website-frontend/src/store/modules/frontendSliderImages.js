import axios from "axios";

const state = {
  frontendSliderImageList: []
};

const getters = { };

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    let url = `${process.env.VUE_APP_API_BACKEND}/frontendSliderImages/`;
    return new Promise((resolve, reject) => {
      try {
        axios.get(url)
          .then(response => {
            let obj = response.data.result;
            if (obj) {
              obj.forEach(element => {
                element.file_path = `${process.env.VUE_APP_API_BACKEND}/frontendSliderImages/viewImage/${element.file_name}`;
              });
            }
            commit("SET_DATA", obj);
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
      state.frontendSliderImageList = payload.sort((a, b) => a.order - b.order);
    } else {
      state.frontendSliderImageList = [];
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
