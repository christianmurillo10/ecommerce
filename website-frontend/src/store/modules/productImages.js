import axios from "axios";
const apiUrl = process.env.VUE_APP_API_BACKEND;

const state = {
  productImageList: [],
};

const getters = {
  getProductImageById: (state) => (id) => {
    return state.productImageList.find(
      (productImage) => productImage.id === id
    );
  },
  getProductImageFileNameById: (state) => (id) => {
    return state.productImageList.find((productImage) => productImage.id === id)
      .file_name;
  },
  getProductImageList: (state) => {
    return state.productImageList;
  },
};

const actions = {
  getDataById(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const url = `${apiUrl}/productImage/${payload}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("cToken")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        axios.get(url, header).then((response) => {
          resolve(response);
        });
      } catch (err) {
        reject(err);
      }
    });
  },
  getDataByProductId(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const url = `${apiUrl}/productImage/findAllbyProductId/${payload}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("cToken")}` },
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
                element.file_path = `${apiUrl}/productImage/viewImage/${element.file_name}`;
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
      state.productImageList = payload;
    } else {
      state.productImageList = [];
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
