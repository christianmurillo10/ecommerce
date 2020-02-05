import axios from "axios";

const state = {
  productBannerImageList: []
};

const getters = {
  getProductBannerImageById: (state) => (id) => {
    return state.productBannerImageList.find(productBannerImage => productBannerImage.id === id);
  },
  getProductBannerImageFileNameById: (state) => (id) => {
    return state.productBannerImageList.find(productBannerImage => productBannerImage.id === id).file_name;
  },
  getProductBannerImageList: (state) => {
    return state.productBannerImageList;
  }
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productBannerImage/`;
    return new Promise((resolve, reject) => {
      try {
        axios.get(url)
          .then(response => {
            let obj = response.data.result;
            if (obj) {
              obj.forEach(element => {
                element.file_path = `${process.env.VUE_APP_API_BACKEND}/productBannerImage/viewImage/${element.file_name}`;
              });
            }
            commit("SET_DATA", obj);
            resolve(response);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  getDataById({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productBannerImage/${payload}`;
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url)
          .then(response => {
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
      state.productBannerImageList = payload.sort((a, b) => a.order - b.order);
    } else {
      state.productBannerImageList = [];
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
