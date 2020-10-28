import axios from "axios";
const apiUrl = process.env.VUE_APP_API_BACKEND;

const state = {
  productFlashDealTodayFlashDeal: "",
};

const getters = {};

const actions = {
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
              if (obj.productFlashDealDetails.length > 0) {
                obj.productFlashDealDetails.forEach((element) => {
                  if (element.products.productImages.length > 0) {
                    element.products.productImages.forEach((elementImage) => {
                      elementImage.file_path = `${apiUrl}/productImages/viewImage/${elementImage.file_name}/${elementImage.type}`;
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
            commit("SET_DATA_TODAY_FLASH_DEAL", "");
            resolve(err.response.data);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
};

const mutations = {
  SET_DATA_TODAY_FLASH_DEAL(state, payload) {
    if (payload) {
      state.productFlashDealTodayFlashDeal = payload;
    } else {
      state.productFlashDealTodayFlashDeal = "";
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
