import axios from "axios";
const apiUrl = process.env.VUE_APP_API_BACKEND;

const state = {
  productFlashDealList: [],
  productFlashDealDataById: "",
  productFlashDealTodayFlashDeal: "",
};

const getters = {
  getProductFlashDealById: (state) => (id) => {
    return state.productFlashDealList.find(
      (productFlashDeal) => productFlashDeal.id === id
    );
  },
  getProductFlashDealTitleById: (state) => (id) => {
    return state.productFlashDealList.find(
      (productFlashDeal) => productFlashDeal.id === id
    ).title;
  },
  getProductFlashDealList: (state) => {
    return state.productFlashDealList;
  },
  getProductFlashDealTodayFlashDeal: (state) => {
    return state.productFlashDealTodayFlashDeal;
  },
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    const url = `${apiUrl}/productFlashDeals/`;
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
  getDataTodayFlashDeal({
    dispatch,
    commit,
    state,
    rootState,
    getters,
    rootGetters,
  }) {
    const url = `${apiUrl}/productFlashDeals/findOne/todayFlashDeal`;
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
              if (obj.productFlashDealDetails.length > 0) {
                obj.productFlashDealDetails.forEach((element) => {
                  if (element.products.productImages.length > 0) {
                    element.products.productImages.forEach((elementImage) => {
                      elementImage.file_path = `${apiUrl}/productImages/viewImage/${
                        elementImage.file_name
                      }/${elementImage.type}`;
                    });
                  } else {
                    element.products.productImages.push({
                      file_path: require("../../assets/images/no-image.png"),
                    });
                  }
                });
              }
            }
            commit("SET_DATA_TODAY_FLASH_DEAL", obj);
            resolve(data);
          })
          .catch((err) => {
            commit("SET_DATA_TODAY_FLASH_DEAL", []);
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
    const url = `${apiUrl}/productFlashDeals/${payload}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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
  saveData(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const url = `${apiUrl}/productFlashDeals/create`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          title: payload.title,
          date_from: `${payload.date_from} ${payload.time_from}`,
          date_to: `${payload.date_to} ${payload.time_to}`,
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
    const url = `${apiUrl}/productFlashDeals/update/${payload.id}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          title: payload.title,
          date_from: payload.date_from,
          date_to: payload.date_to,
          is_active: payload.is_active,
        };

        axios
          .put(url, obj, header)
          .then((response) => {
            const data = response.data;
            if (data.result) {
              commit("UPDATE_DATA", data.result);
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
  updateActiveStatusData(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const url = `${apiUrl}/productFlashDeals/update/${payload.id}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          is_active: payload.value,
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
    const url = `${apiUrl}/productFlashDeals/delete/${payload}`;
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
    const index = state.productFlashDealList
      .map((productFlashDeal) => productFlashDeal.id)
      .indexOf(payload.id);
    Object.assign(state.productFlashDealList[index], {
      title: payload.title,
      date_from: payload.date_from,
      date_to: payload.date_to,
      is_active: payload.is_active,
    });
  },
  DELETE_DATA(state, payload) {
    const index = state.productFlashDealList
      .map((productFlashDeal) => productFlashDeal.id)
      .indexOf(payload);
    state.productFlashDealList.splice(index, 1);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
