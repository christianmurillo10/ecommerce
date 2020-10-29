import axios from "axios";
const apiUrl = process.env.VUE_APP_API_BACKEND;

const state = {
  productList: [],
  productIsFeaturedList: [],
  productTotalCount: 0,
};

const getters = {
  getProductById: (state) => (id) => {
    return state.productList.find((product) => product.id === id);
  },
  getProductCodeById: (state) => (id) => {
    return state.productList.find((product) => product.id === id).code;
  },
  getProductNameById: (state) => (id) => {
    return state.productList.find((product) => product.id === id).name;
  },
  getProductList: (state) => {
    return state.productList;
  },
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    const url = `${apiUrl}/products/`;
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
  getDataByIsFeatured(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const url = `${apiUrl}/products/featured/${payload}`;
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
              obj.forEach((element) => {
                if (element.productImages.length > 0) {
                  element.productImages.forEach((elementImage) => {
                    elementImage.file_path = `${apiUrl}/productImages/viewImage/${
                      elementImage.file_name
                    }/${elementImage.type}`;
                  });
                } else {
                  element.productImages.push({
                    file_path: require("../../assets/images/no-image.png"),
                  });
                }
              });
            }

            commit("SET_DATA_BY_IS_FEATURED", obj);
            resolve(data);
          })
          .catch((err) => {
            commit("SET_DATA_BY_IS_FEATURED", []);
            resolve(err.response.data);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  getDataWithLimitAndOffset(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const { limit, offset } = payload;
    const url = `${apiUrl}/products/findAllWithLimitAndOffset?limit=${limit}&offset=${offset}`;
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

            if (obj.data) {
              obj.data.forEach((element) => {
                obj.data.is_published === 1 ? true : false;
                if (element.productImages.length > 0) {
                  element.productImages.forEach((elementImage) => {
                    elementImage.file_path = `${apiUrl}/productImages/viewImage/${
                      elementImage.file_name
                    }/${elementImage.type}`;
                  });
                } else {
                  element.productImages.push({
                    file_path: require("../../assets/images/no-image.png"),
                  });
                }
              });
            }

            commit("SET_DATA_WITH_COUNT", obj);
            resolve(data);
          })
          .catch((err) => {
            commit("SET_DATA_WITH_COUNT", []);
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
    const url = `${apiUrl}/products/${payload}`;
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

            if (obj.productImages.length !== 0) {
              obj.productImages.forEach((element) => {
                element.file_path = `${apiUrl}/productImages/viewImage/${
                  element.file_name
                }/${element.type}`;
              });
            }

            resolve(obj);
          })
          .catch((err) => {
            resolve(err.response.data);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  getTotalCount({ dispatch, commit, state, rootState, getters, rootGetters }) {
    const url = `${apiUrl}/products/count/all`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, header)
          .then((response) => {
            const data = response.data;
            commit("SET_TOTAL_COUNT", data.result);
            resolve(data);
          })
          .catch((err) => {
            commit("SET_TOTAL_COUNT", 0);
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
    const url = `${apiUrl}/products/create`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
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
          is_published: payload.is_published,
        };

        axios
          .post(url, obj, header)
          .then((response) => {
            const data = response.data;
            let obj = data.result;
            if (obj) {
              obj.productImages = [
                {
                  file_path: require("../../assets/images/no-image.png"),
                },
              ];
              commit("ADD_DATA", obj);
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
    const url = `${apiUrl}/products/update/${payload.id}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
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
          is_published: payload.is_published,
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
  updateStatusData(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const url = `${apiUrl}/products/updateStatus/${payload.id}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        let fieldName = payload.fieldName;
        let obj = {
          [fieldName]: payload.value,
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
    const url = `${apiUrl}/products/delete/${payload}`;
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
    const index = state.productList
      .map((product) => product.id)
      .indexOf(payload.id);
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
      is_published: payload.is_published,
    });
  },
  DELETE_DATA(state, payload) {
    const index = state.productList
      .map((product) => product.id)
      .indexOf(payload);
    state.productList.splice(index, 1);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
