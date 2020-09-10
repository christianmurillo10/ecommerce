import axios from "axios";

const state = {
  productFlashDealList: [],
  productFlashDealDataById: "",
  productFlashDealTodayFlashDeal: ""
};

const getters = {
  getProductFlashDealById: (state) => (id) => {
    return state.productFlashDealList.find(productFlashDeal => productFlashDeal.id === id);
  },
  getProductFlashDealTitleById: (state) => (id) => {
    return state.productFlashDealList.find(productFlashDeal => productFlashDeal.id === id).title;
  },
  getProductFlashDealList: (state) => {
    return state.productFlashDealList;
  },
  getProductFlashDealTodayFlashDeal: (state) => {
    return state.productFlashDealTodayFlashDeal;
  }
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productFlashDeals/`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        axios.get(url, header)
          .then(response => {
            commit("SET_DATA", response.data.result);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  getDataTodayFlashDeal({ dispatch, commit, state, rootState, getters, rootGetters }) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productFlashDeals/findOne/todayFlashDeal`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        axios.get(url, header)
          .then(response => {
            let obj = response.data.result;
            if (obj) {
              if (obj.productFlashDealDetails.length > 0) {
                obj.productFlashDealDetails.forEach(element => {
                  if (element.products.productImages.length > 0) {
                    element.products.productImages.forEach(elementImage => {
                      elementImage.file_path = `${process.env.VUE_APP_API_BACKEND}/productImages/viewImage/${elementImage.file_name}/${elementImage.type}`;
                    });
                  } else {
                    element.products.productImages.push({ file_path: require("../../assets/images/no-image.png") });
                  }
                });
              }
            }
            commit("SET_DATA_TODAY_FLASH_DEAL", obj);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  getDataById({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productFlashDeals/${payload}`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, header)
          .then(response => {
            commit("SET_DATA_BY_ID", response.data.result);
            resolve(response);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  saveData({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productFlashDeals/create`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          title: payload.title,
          date_from: payload.date_from,
          date_to: payload.date_to
        };

        axios
          .post(url, obj, header)
          .then(response => {
            if (response.data.result) {
              commit("ADD_DATA", response.data.result);
            }
            resolve(response);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  updateData({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productFlashDeals/update/${payload.id}`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          title: payload.title,
          date_from: payload.date_from,
          date_to: payload.date_to,
          is_active: payload.is_active
        };

        axios
          .put(url, obj, header)
          .then(response => {
            if (response.data.result) {
              commit("UPDATE_DATA", response.data.result);
            }
            resolve(response);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  updateActiveStatusData({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productFlashDeals/update/${payload.id}`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          is_active: payload.value
        };

        axios
          .put(url, obj, header)
          .then(response => {
            commit("UPDATE_DATA", response.data.result);
            resolve(response);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  deleteData({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productFlashDeals/delete/${payload}`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        axios
          .put(url, '', header)
          .then(response => {
            commit("DELETE_DATA", payload);
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
      state.productFlashDealList = payload;
    } else {
      state.productFlashDealList = [];
    }
  },
  SET_DATA_TODAY_FLASH_DEAL(state, payload) {
    if (payload) {
      state.productFlashDealTodayFlashDeal = payload;
    } else {
      state.productFlashDealTodayFlashDeal = "";
    }
  },
  SET_DATA_BY_ID(state, payload) {
    if (payload) {
      state.productFlashDealDataById = payload;
    } else {
      state.productFlashDealDataById = "";
    }
  },
  ADD_DATA(state, payload) {
    state.productFlashDealList.push(payload);
  },
  UPDATE_DATA(state, payload) {
    let index = state.productFlashDealList.map(productFlashDeal => productFlashDeal.id).indexOf(payload.id);
    Object.assign(state.productFlashDealList[index], {
      title: payload.title,
      date_from: payload.date_from,
      date_to: payload.date_to,
      is_active: payload.is_active
    });
  },
  DELETE_DATA(state, payload) {
    let index = state.productFlashDealList.map(productFlashDeal => productFlashDeal.id).indexOf(payload);
    state.productFlashDealList.splice(index, 1);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
