import axios from "axios";

const state = {
  productFlashDealHeaderTodayFlashDeal: ""
};

const getters = { };

const actions = {
  getDataTodayFlashDeal({ dispatch, commit, state, rootState, getters, rootGetters }) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productFlashDealHeaders/findOne/todayFlashDeal`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("cToken")}` } };
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
  }
};

const mutations = {
  SET_DATA_TODAY_FLASH_DEAL(state, payload) {
    if (payload) {
      state.productFlashDealHeaderTodayFlashDeal = payload;
    } else {
      state.productFlashDealHeaderTodayFlashDeal = "";
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
