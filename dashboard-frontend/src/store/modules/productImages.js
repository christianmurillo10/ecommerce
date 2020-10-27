import axios from "axios";
import FormData from "form-data";
const apiUrl = process.env.VUE_APP_API_BACKEND;

const imageType = {
  main: 1,
  thumbnail: 2,
  featured: 3,
  flasDeal: 4,
};

const state = {
  productImageList: [],
  productImageMainList: [],
  productImageThumbnailList: [],
  productImageFeaturedList: [],
  productImageFlashDealList: [],
};

const getters = {
  getProductImageByIdAndType: (state) => (id, type) => {
    switch (parseInt(type)) {
      case imageType.main:
        return state.productImageMainList.find(
          (productImage) => productImage.id === id
        );
      case imageType.thumbnail:
        return state.productImageThumbnailList.find(
          (productImage) => productImage.id === id
        );
      case imageType.featured:
        return state.productImageFeaturedList.find(
          (productImage) => productImage.id === id
        );
      case imageType.flasDeal:
        return state.productImageFlashDealList.find(
          (productImage) => productImage.id === id
        );
    }
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
    const url = `${apiUrl}/productImages/${payload}`;
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
  getDataByProductIdAndType(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const url = `${apiUrl}/productImages/findAllbyProductIdAndType/${
      payload.productId
    }/${payload.type}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, header)
          .then((response) => {
            let obj = {
              data: response.data.result,
              type: payload.type,
            };

            if (obj.data) {
              obj.data.forEach((element) => {
                if (!_.isNull(element.file_name)) {
                  element.file_path = `${apiUrl}/productImages/viewImage/${
                    element.file_name
                  }/${element.type}`;
                } else {
                  element.file_path = require("../../assets/images/no-image.png");
                }
              });
            }
            commit("SET_DATA", obj);
            resolve(obj.data);
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
    const url = `${apiUrl}/productImages/create`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        var data = new FormData();
        data.set("file_name", payload.file_name);
        data.set("order", payload.order);
        data.set("product_id", payload.product_id);
        data.set("type", payload.type);
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
    const url = `${apiUrl}/productImages/update/${payload.id}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        var data = new FormData();
        data.set("file_name", payload.file_name);
        data.set("order", payload.order);
        data.set("product_id", payload.product_id);
        data.set("type", payload.type);
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
    const url = `${apiUrl}/productImages/delete/${payload.id}`;
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
    if (payload.data) {
      switch (parseInt(payload.type)) {
        case imageType.main:
          state.productImageMainList = payload.data;
          break;
        case imageType.thumbnail:
          state.productImageThumbnailList = payload.data;
          break;
        case imageType.featured:
          state.productImageFeaturedList = payload.data;
          break;
        case imageType.flasDeal:
          state.productImageFlashDealList = payload.data;
          break;
      }
    } else {
      switch (parseInt(payload.type)) {
        case imageType.main:
          state.productImageMainList = [];
          break;
        case imageType.thumbnail:
          state.productImageThumbnailList = [];
          break;
        case imageType.featured:
          state.productImageFeaturedList = [];
          break;
        case imageType.flasDeal:
          state.productImageFlashDealList = [];
          break;
      }
    }
  },
  ADD_DATA(state, payload) {
    let obj = payload;
    obj.file_path = _.isNull(payload.file_name)
      ? require("../../assets/images/no-image.png")
      : `${apiUrl}/productImages/viewImage/${payload.file_name}/${
          payload.type
        }`;

    switch (parseInt(payload.type)) {
      case imageType.main:
        state.productImageMainList.push(obj);
        break;
      case imageType.thumbnail:
        state.productImageThumbnailList.push(obj);
        break;
      case imageType.featured:
        state.productImageFeaturedList.push(obj);
        break;
      case imageType.flasDeal:
        state.productImageFlashDealList.push(obj);
        break;
    }
  },
  UPDATE_DATA(state, payload) {
    let index = null;
    let obj = {
      file_name: payload.file_name,
      order: payload.order,
      product_id: payload.product_id,
      type: payload.type,
      file_path: _.isNull(payload.file_name)
        ? require("../../assets/images/no-image.png")
        : `${apiUrl}/productImages/viewImage/${payload.file_name}/${
            payload.type
          }`,
    };

    switch (parseInt(payload.type)) {
      case imageType.main:
        index = state.productImageMainList
          .map((productImage) => productImage.id)
          .indexOf(payload.id);
        Object.assign(state.productImageMainList[index], obj);
        break;
      case imageType.thumbnail:
        index = state.productImageThumbnailList
          .map((productImage) => productImage.id)
          .indexOf(payload.id);
        Object.assign(state.productImageThumbnailList[index], obj);
        break;
      case imageType.featured:
        index = state.productImageFeaturedList
          .map((productImage) => productImage.id)
          .indexOf(payload.id);
        Object.assign(state.productImageFeaturedList[index], obj);
        break;
      case imageType.flasDeal:
        index = state.productImageFlashDealList
          .map((productImage) => productImage.id)
          .indexOf(payload.id);
        Object.assign(state.productImageFlashDealList[index], obj);
        break;
    }
  },
  DELETE_DATA(state, payload) {
    let index = null;
    switch (parseInt(payload.type)) {
      case imageType.main:
        index = state.productImageMainList
          .map((productImage) => productImage.id)
          .indexOf(payload.id);
        state.productImageMainList.splice(index, 1);
        break;
      case imageType.thumbnail:
        index = state.productImageThumbnailList
          .map((productImage) => productImage.id)
          .indexOf(payload.id);
        state.productImageThumbnailList.splice(index, 1);
        break;
      case imageType.featured:
        index = state.productImageFeaturedList
          .map((productImage) => productImage.id)
          .indexOf(payload.id);
        state.productImageFeaturedList.splice(index, 1);
        break;
      case imageType.flasDeal:
        index = state.productImageFlashDealList
          .map((productImage) => productImage.id)
          .indexOf(payload.id);
        state.productImageFlashDealList.splice(index, 1);
        break;
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
