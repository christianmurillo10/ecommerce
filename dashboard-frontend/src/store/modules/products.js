import axios from "axios";

const state = {
  productList: [],
  productIsFeaturedList: [],
  productTotalCount: 0
};

const getters = {
  getProductById: (state) => (id) => {
    return state.productList.find(product => product.id === id);
  },
  getProductNameById: (state) => (id) => {
    return state.productList.find(product => product.id === id).name;
  },
  getProductList: (state) => {
    return state.productList;
  }
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    let url = `${process.env.VUE_APP_API_BACKEND}/products/`;
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
  getDataByIsFeatured({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/products/featured/${payload}`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        axios.get(url, header)
          .then(response => {
            let obj = response.data.result;

            obj.forEach(element => {
              if (element.productImages.length > 0) {
                element.productImages.forEach(elementImage => {
                  elementImage.file_path = `${process.env.VUE_APP_API_BACKEND}/productImages/viewImage/${elementImage.file_name}/${elementImage.type}`;
                });
              } else {
                element.productImages.push({ file_path: require("../../assets/images/no-image.png") });
              }
            });
            commit("SET_DATA_BY_IS_FEATURED", obj);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  getDataWithLimitAndOffset({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/products/findAllWithLimitAndOffset/${payload.limit}/${payload.offset}`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        axios.get(url, header)
          .then(response => {
            let obj = response.data.result;

            obj.data.forEach(element => {
              obj.data.is_published === 1 ? true : false;
              if (element.productImages.length > 0) {
                element.productImages.forEach(elementImage => {
                  elementImage.file_path = `${process.env.VUE_APP_API_BACKEND}/productImages/viewImage/${elementImage.file_name}/${elementImage.type}`;
                });
              } else {
                element.productImages.push({ file_path: require("../../assets/images/no-image.png") });
              }
            });
            commit("SET_DATA_WITH_COUNT", obj);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  getDataById({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/products/${payload}`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, header)
          .then(response => {
            let obj = response;

            if (obj.data.result.productImages.length !== 0) {
              obj.data.result.productImages.forEach(element => {
                element.file_path = `${process.env.VUE_APP_API_BACKEND}/productImages/viewImage/${element.file_name}/${element.type}`;
              });
            }
            resolve(obj);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  getTotalCount({ dispatch, commit, state, rootState, getters, rootGetters }) {
    let url = `${process.env.VUE_APP_API_BACKEND}/products/count/all`;
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
    let url = `${process.env.VUE_APP_API_BACKEND}/products/create`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          code: payload.code,
          name: payload.name,
          description: payload.description,
          unit: payload.unit,
          tags: payload.tags,
          price_amount: payload.price_amount,
          product_store_id: payload.product_store_id,
          product_brand_id: payload.product_brand_id,
          product_category_id: payload.product_category_id,
          product_sub_category_id: payload.product_sub_category_id,
          product_sub_sub_category_id: payload.product_sub_sub_category_id,
          is_featured: payload.is_featured,
          is_published: payload.is_published
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
    let url = `${process.env.VUE_APP_API_BACKEND}/products/update/${payload.id}`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          code: payload.code,
          name: payload.name,
          description: payload.description,
          unit: payload.unit,
          tags: payload.tags,
          price_amount: payload.price_amount,
          product_store_id: payload.product_store_id,
          product_brand_id: payload.product_brand_id,
          product_category_id: payload.product_category_id,
          product_sub_category_id: payload.product_sub_category_id,
          product_sub_sub_category_id: payload.product_sub_sub_category_id,
          is_featured: payload.is_featured,
          is_published: payload.is_published
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
  updateStatusData({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/products/updateStatus/${payload.id}`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
    return new Promise((resolve, reject) => {
      try {
        let fieldName = payload.fieldName;
        let obj = {
          [fieldName]: payload.value,
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
    let url = `${process.env.VUE_APP_API_BACKEND}/products/delete/${payload}`;
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
      state.productList = payload;
    } else {
      state.productList = [];
    }
  },
  SET_DATA_WITH_COUNT(state, payload) {
    if (payload) {
      state.productList = payload.data;
      state.productTotalCount = payload.count;
    } else {
      state.productList = [];
      state.productTotalCount = 0;
    }
  },
  SET_DATA_BY_IS_FEATURED(state, payload) {
    if (payload) {
      state.productIsFeaturedList = payload;
    } else {
      state.productIsFeaturedList = [];
    }
  },
  SET_TOTAL_COUNT(state, payload) {
    if (payload) {
      state.productTotalCount = payload;
    } else {
      state.productTotalCount = 0;
    }
  },
  ADD_DATA(state, payload) {
    state.productList.push(payload);
  },
  UPDATE_DATA(state, payload) {
    let index = state.productList.map(product => product.id).indexOf(payload.id);
    Object.assign(state.productList[index], {
      code: payload.code,
      name: payload.name,
      description: payload.description,
      unit: payload.unit,
      tags: payload.tags,
      price_amount: payload.price_amount,
      product_store_id: payload.product_store_id,
      product_brand_id: payload.product_brand_id,
      product_category_id: payload.product_category_id,
      product_sub_category_id: payload.product_sub_category_id,
      product_sub_sub_category_id: payload.product_sub_sub_category_id,
      is_featured: payload.is_featured,
      is_published: payload.is_published
    });
  },
  DELETE_DATA(state, payload) {
    let index = state.productList.map(product => product.id).indexOf(payload);
    state.productList.splice(index, 1);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
