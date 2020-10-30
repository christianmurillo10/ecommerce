import axios from "axios";
const apiUrl = process.env.VUE_APP_API_BACKEND;

const state = {
  limit: 20,
  offset: 0,
  productIsFeaturedList: [],
  productList: [],
  productByCategoryList: [],
  productBySubCategoryList: [],
  productBySubSubCategoryList: [],
  productBySearchList: [],
  productBySearchBarList: [],
  productTotalCount: 0,
  productByCategoryTotalCount: 0,
  productBySubCategoryTotalCount: 0,
  productBySubSubCategoryTotalCount: 0,
  productBySearchTotalCount: 0,
  productBySearchRelatedCategories: [],
  productBySearchBarTotalCount: 0,
  productDataById: {},
};

const getters = {
  getProductAvailableQuantityBySku: (state) => (sku) => {
    return state.productDataById.inventories.find(
      (inventory) => inventory.sku === sku
    ).quantity_available;
  },
};

const actions = {
  getDataByIsFeatured(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const url = `${apiUrl}/products/featured/${payload}`;
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
                if (element.productImages.length > 0) {
                  element.productImages.forEach((elementImage) => {
                    elementImage.file_path = `${apiUrl}/productImages/viewImage/${elementImage.file_name}/${elementImage.type}`;
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
  getDataWithLimitOffset(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const { limit, offset } = payload;
    const url = `${apiUrl}/products/findAllWithLimitAndOffset`;
    const params = {
      params: { limit: limit, offset: offset },
    };
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, params)
          .then((response) => {
            const data = response.data;
            let obj = data.result;
            if (obj) {
              obj.data.forEach((element) => {
                if (element.productImages.length > 0) {
                  element.productImages.forEach((elementImage) => {
                    elementImage.file_path = `${apiUrl}/productImages/viewImage/${elementImage.file_name}/${elementImage.type}`;
                  });
                } else {
                  element.productImages.push({
                    file_path: require("../../assets/images/no-image.png"),
                  });
                }
              });
            }
            commit("SET_DATA", obj);
            resolve(data);
          })
          .catch((err) => {
            commit("SET_DATA", { data: [], count: 0 });
            resolve(err.response.data);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  getDataByProductCategoryIdWithLimitOffset(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const { limit, offset } = payload;
    const url = `${apiUrl}/products/findAllByProductCategoryIdWithLimitAndOffset/${payload.category_id}`;
    const params = {
      params: { limit: limit, offset: offset },
    };
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, params)
          .then((response) => {
            const data = response.data;
            let obj = data.result;
            if (obj) {
              obj.data.forEach((element) => {
                if (element.productImages.length > 0) {
                  element.productImages.forEach((elementImage) => {
                    elementImage.file_path = `${apiUrl}/productImages/viewImage/${elementImage.file_name}/${elementImage.type}`;
                  });
                } else {
                  element.productImages.push({
                    file_path: require("../../assets/images/no-image.png"),
                  });
                }
              });
            }
            commit("SET_DATA_BY_CATEGORY", obj);
            resolve(data);
          })
          .catch((err) => {
            commit("SET_DATA_BY_CATEGORY", { data: [], count: 0 });
            resolve(err.response.data);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  getDataByProductSubCategoryIdWithLimitOffset(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const { limit, offset } = payload;
    const url = `${apiUrl}/products/findAllByProductSubCategoryIdWithLimitAndOffset/${payload.sub_category_id}`;
    const params = {
      params: { limit: limit, offset: offset },
    };
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, params)
          .then((response) => {
            const data = response.data;
            let obj = data.result;
            if (obj) {
              obj.data.forEach((element) => {
                if (element.productImages.length > 0) {
                  element.productImages.forEach((elementImage) => {
                    elementImage.file_path = `${apiUrl}/productImages/viewImage/${elementImage.file_name}/${elementImage.type}`;
                  });
                } else {
                  element.productImages.push({
                    file_path: require("../../assets/images/no-image.png"),
                  });
                }
              });
            }
            commit("SET_DATA_BY_SUB_CATEGORY", obj);
            resolve(data);
          })
          .catch((err) => {
            commit("SET_DATA_BY_SUB_CATEGORY", { data: [], count: 0 });
            resolve(err.response.data);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  getDataByProductSubSubCategoryIdWithLimitOffset(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const { limit, offset } = payload;
    const url = `${apiUrl}/products/findAllByProductSubSubCategoryIdWithLimitAndOffset/${payload.sub_sub_category_id}`;
    const params = {
      params: { limit: limit, offset: offset },
    };
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, params)
          .then((response) => {
            const data = response.data;
            let obj = data.result;
            if (obj) {
              obj.data.forEach((element) => {
                if (element.productImages.length > 0) {
                  element.productImages.forEach((elementImage) => {
                    elementImage.file_path = `${apiUrl}/productImages/viewImage/${elementImage.file_name}/${elementImage.type}`;
                  });
                } else {
                  element.productImages.push({
                    file_path: require("../../assets/images/no-image.png"),
                  });
                }
              });
            }
            commit("SET_DATA_BY_SUB_SUB_CATEGORY", obj);
            resolve(data);
          })
          .catch((err) => {
            commit("SET_DATA_BY_SUB_SUB_CATEGORY", { data: [], count: 0 });
            resolve(err.response.data);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  getDataBySearchBar(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const { limit, offset } = payload;
    const url = `${apiUrl}/products/search/${payload.keyword}`;
    const params = {
      params: { limit: limit, offset: offset },
    };
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, params)
          .then((response) => {
            const data = response.data;
            let obj = data.result;
            if (obj) {
              obj.data.forEach((element) => {
                if (element.productImages.length > 0) {
                  element.productImages.forEach((elementImage) => {
                    elementImage.file_path = `${apiUrl}/productImages/viewImage/${elementImage.file_name}/${elementImage.type}`;
                  });
                } else {
                  element.productImages.push({
                    file_path: require("../../assets/images/no-image.png"),
                  });
                }
              });
            }
            commit("SET_DATA_BY_SEARCH_BAR", obj);
            resolve(data);
          })
          .catch((err) => {
            commit("SET_DATA_BY_SEARCH_BAR", { data: [], count: 0 });
            resolve(err.response.data);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  getDataBySearchWithRelatedCategories(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const { limit, offset } = payload;
    const url = `${apiUrl}/products/searchWithRelatedCategories/${payload.keyword}`;
    const params = {
      params: { limit: limit, offset: offset },
    };
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, params)
          .then((response) => {
            const data = response.data;
            let obj = data.result;
            if (obj) {
              obj.data.forEach((element) => {
                if (element.productImages.length > 0) {
                  element.productImages.forEach((elementImage) => {
                    elementImage.file_path = `${apiUrl}/productImages/viewImage/${elementImage.file_name}/${elementImage.type}`;
                  });
                } else {
                  element.productImages.push({
                    file_path: require("../../assets/images/no-image.png"),
                  });
                }
              });

              obj.relatedCategoriesData.forEach((element) => {
                element.id = element.product_sub_category_id;
                element.name = element.productSubCategories.name;
              });
            }
            commit("SET_DATA_BY_SEARCH_WITH_RELATED_CATEGORIES", obj);
            resolve(data);
          })
          .catch((err) => {
            commit("SET_DATA_BY_SEARCH_WITH_RELATED_CATEGORIES", {
              data: [],
              count: 0,
              relatedCategoriesData: [],
            });
            resolve(err.response.data);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  getDataBySearchBySubCategoryIdWithRelatedCategories(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const { limit, offset } = payload;
    const url = `${apiUrl}/products/searchBySubCategoryIdWithRelatedCategories/${payload.sub_category_id}/${payload.keyword}`;
    const params = {
      params: { limit: limit, offset: offset },
    };
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, params)
          .then((response) => {
            const data = response.data;
            let obj = data.result;
            if (obj) {
              obj.data.forEach((element) => {
                if (element.productImages.length > 0) {
                  element.productImages.forEach((elementImage) => {
                    elementImage.file_path = `${apiUrl}/productImages/viewImage/${elementImage.file_name}/${elementImage.type}`;
                  });
                } else {
                  element.productImages.push({
                    file_path: require("../../assets/images/no-image.png"),
                  });
                }
              });

              obj.relatedCategoriesData.forEach((element) => {
                element.id = element.product_sub_category_id;
                element.name = element.productSubCategories.name;
              });
            }
            commit("SET_DATA_BY_SEARCH_WITH_RELATED_CATEGORIES", obj);
            resolve(data);
          })
          .catch((err) => {
            commit("SET_DATA_BY_SEARCH_WITH_RELATED_CATEGORIES", {
              data: [],
              count: 0,
              relatedCategoriesData: [],
            });
            resolve(err.response.data);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  getDataByIdWithImageType(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const url = `${apiUrl}/products/findByIdWithImageType/${payload.id}/${payload.image_type}`;
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
            if (obj.productImages.length > 0) {
              obj.productImages.forEach((element) => {
                if (!_.isEmpty(element)) {
                  element.file_path = `${apiUrl}/productImages/viewImage/${element.file_name}/${element.type}`;
                } else {
                  element.file_path = require("../../assets/images/no-image.png");
                }
              });
            } else {
              obj.productImages.push({
                file_path: require("../../assets/images/no-image.png"),
              });
            }
            commit("SET_DATA_BY_ID", obj);
            resolve(data);
          })
          .catch((err) => {
            commit("SET_DATA_BY_ID", {});
            resolve(err.response.data);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
};

const mutations = {
  SET_DATA_BY_IS_FEATURED(state, payload) {
    if (payload) {
      state.productIsFeaturedList = payload;
    } else {
      state.productIsFeaturedList = [];
    }
  },
  SET_DATA(state, payload) {
    if (payload) {
      state.productList = payload.data;
      state.productTotalCount = payload.count;
    } else {
      state.productList = [];
      state.productTotalCount = 0;
    }
  },
  SET_DATA_BY_CATEGORY(state, payload) {
    if (payload) {
      state.productByCategoryList = payload.data;
      state.productByCategoryTotalCount = payload.count;
    } else {
      state.productByCategoryList = [];
      state.productByCategoryTotalCount = 0;
    }
  },
  SET_DATA_BY_SUB_CATEGORY(state, payload) {
    if (payload) {
      state.productBySubCategoryList = payload.data;
      state.productBySubCategoryTotalCount = payload.count;
    } else {
      state.productBySubCategoryList = [];
      state.productBySubCategoryTotalCount = 0;
    }
  },
  SET_DATA_BY_SUB_SUB_CATEGORY(state, payload) {
    if (payload) {
      state.productBySubSubCategoryList = payload.data;
      state.productBySubSubCategoryTotalCount = payload.count;
    } else {
      state.productBySubSubCategoryList = [];
      state.productBySubSubCategoryTotalCount = 0;
    }
  },
  SET_DATA_BY_SEARCH_BAR(state, payload) {
    if (payload) {
      state.productBySearchBarList = payload.data;
      state.productBySearchBarTotalCount = payload.count;
    } else {
      state.productBySearchBarList = [];
      state.productBySearchBarTotalCount = 0;
    }
  },
  SET_DATA_BY_SEARCH_WITH_RELATED_CATEGORIES(state, payload) {
    if (payload) {
      state.productBySearchList = payload.data;
      state.productBySearchTotalCount = payload.count;
      state.productBySearchRelatedCategories = payload.relatedCategoriesData;
    } else {
      state.productBySearchList = [];
      state.productBySearchTotalCount = 0;
      state.productBySearchRelatedCategories = [];
    }
  },
  SET_DATA_BY_ID(state, payload) {
    if (payload) {
      state.productDataById = payload;
    } else {
      state.productDataById = {};
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
