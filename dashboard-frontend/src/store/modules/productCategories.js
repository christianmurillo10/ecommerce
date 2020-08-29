import axios from "axios";
import FormData from 'form-data';

const state = {
  productCategoryList: [],
  productCategoryTotalCount: 0
};

const getters = {
  getProductCategoryById: (state) => (id) => {
    return state.productCategoryList.find(productCategory => productCategory.id === id);
  },
  getProductCategoryNameById: (state) => (id) => {
    return state.productCategoryList.find(productCategory => productCategory.id === id).name;
  },
  getProductCategoryList: (state) => {
    return state.productCategoryList;
  }
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productCategories/`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        axios.get(url, header)
          .then(response => {
            let obj = response.data.result

            if (obj) {
              obj.forEach(element => {
                if (!_.isNull(element.icon_file_name)) {
                  element.icon_file_path = `${process.env.VUE_APP_API_BACKEND}/productCategories/viewImage/${element.icon_file_name}`;
                } else {
                  element.icon_file_path = require("../../assets/images/no-image.png");
                }

                if (!_.isNull(element.banner_file_name)) {
                  element.banner_file_path = `${process.env.VUE_APP_API_BACKEND}/productCategories/viewImage/${element.banner_file_name}`;
                } else {
                  element.banner_file_path = require("../../assets/images/no-image.png");
                }
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
    let url = `${process.env.VUE_APP_API_BACKEND}/productCategories/${payload}`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, header)
          .then(response => {
            resolve(response);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  getTotalCount({ dispatch, commit, state, rootState, getters, rootGetters }) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productCategories/count/all`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        axios.get(url, header)
          .then(response => {
            commit("SET_TOTAL_COUNT", response.data.result);
            resolve(response);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  saveData({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productCategories/create`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        var data = new FormData();
        data.set('name', payload.name);
        data.set('description', payload.description);
        data.set('icon_file_name', payload.icon_file_name);
        data.set('banner_file_name', payload.banner_file_name);
        data.append('icon-image', payload.icon_file);
        data.append('banner-image', payload.banner_file);

        axios
          .post(url, data, header)
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
    let url = `${process.env.VUE_APP_API_BACKEND}/productCategories/update/${payload.id}`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        var data = new FormData();
        data.set('name', payload.name);
        data.set('description', payload.description);
        data.set('icon_file_name', payload.icon_file_name);
        data.set('banner_file_name', payload.banner_file_name);
        data.append('icon-image', payload.icon_file);
        data.append('banner-image', payload.banner_file);

        axios
          .put(url, data, header)
          .then(response => {
            commit("UPDATE_DATA", response.data.result);
            resolve(response);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  updateFeaturedData({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productCategories/update/featured/${payload.id}`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          is_featured: payload.value
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
    let url = `${process.env.VUE_APP_API_BACKEND}/productCategories/delete/${payload}`;
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
      state.productCategoryList = payload;
    } else {
      state.productCategoryList = [];
    }
  },
  SET_TOTAL_COUNT(state, payload) {
    if (payload) {
      state.productCategoryTotalCount = payload;
    } else {
      state.productCategoryTotalCount = 0;
    }
  },
  ADD_DATA(state, payload) {
    let obj = payload;
    obj.icon_file_path = _.isNull(payload.icon_file_name) ? require("../../assets/images/no-image.png") : `${process.env.VUE_APP_API_BACKEND}/productCategories/viewImage/${payload.icon_file_name}`;
    obj.banner_file_path = _.isNull(payload.banner_file_name) ? require("../../assets/images/no-image.png") : `${process.env.VUE_APP_API_BACKEND}/productCategories/viewImage/${payload.banner_file_name}`;
    state.productCategoryList.push(obj);
  },
  UPDATE_DATA(state, payload) {
    let index = state.productCategoryList.map(productCategory => productCategory.id).indexOf(payload.id);
    Object.assign(state.productCategoryList[index], {
      name: payload.name,
      description: payload.description,
      icon_file_name: payload.icon_file_name,
      banner_file_name: payload.banner_file_name,
      icon_file_path: _.isNull(payload.icon_file_name) ? require("../../assets/images/no-image.png") : `${process.env.VUE_APP_API_BACKEND}/productCategories/viewImage/${payload.icon_file_name}`,
      banner_file_path: _.isNull(payload.banner_file_name) ? require("../../assets/images/no-image.png") : `${process.env.VUE_APP_API_BACKEND}/productCategories/viewImage/${payload.banner_file_name}`
    });
  },
  DELETE_DATA(state, payload) {
    let index = state.productCategoryList.map(productCategory => productCategory.id).indexOf(payload);
    state.productCategoryList.splice(index, 1);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
