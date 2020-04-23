import axios from "axios";

const state = {
  limit: 20,
  offset: 0,
  productList: [],
  productByCategoryList: [],
  productBySubCategoryList: [],
  productBySubSubCategoryList: [],
  productIsFeaturedList: [],
  productTotalCount: 0,
  productByCategoryTotalCount: 0,
  productBySubCategoryTotalCount: 0,
  productBySubSubCategoryTotalCount: 0,
  // productBySearchList: [],
  // productBySearchTotalCount: 0,
  // productSearchKeyword: "",
  // productDataById: {}
};

const getters = {
  // getProductHomeById: (state) => (id) => {
  //   return state.productHomeList.find(ProductHome => product.id === id);
  // },
  // getProductHomeNameById: (state) => (id) => {
  //   return state.productHomeList.find(product => product.id === id).name;
  // },
  // getProductHomeList: (state) => {
  //   return state.productHomeList;
  // }
};

const actions = {
  getDataByIsFeatured({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/products/featured/${payload}`;
    let header = { headers: { Token: localStorage.getItem("token") } };
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
  getDataWithLimitOffset({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/products/findAllWithLimitAndOffset/${payload.limit}/${payload.offset}`;
    return new Promise((resolve, reject) => {
      try {
        axios.get(url)
          .then(response => {
            let obj = response.data.result;
            if (obj) {
              obj.data.forEach(element => {
                if (element.productImages.length > 0) {
                  element.productImages.forEach(elementImage => {
                    elementImage.file_path = `${process.env.VUE_APP_API_BACKEND}/productImages/viewImage/${elementImage.file_name}/${elementImage.type}`;
                  })
                } else {
                  element.productImages.push({ file_path: require("../../assets/images/no-image.png") });
                }
              });
            }
            commit("SET_DATA", obj);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  getDataByProductCategoryIdWithLimitOffset({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/products/findAllByProductCategoryIdWithLimitAndOffset/${payload.category_id}/${payload.limit}/${payload.offset}`;
    return new Promise((resolve, reject) => {
      try {
        axios.get(url)
          .then(response => {
            let obj = response.data.result;
            if (obj) {
              obj.data.forEach(element => {
                if (element.productImages.length > 0) {
                  element.productImages.forEach(elementImage => {
                    elementImage.file_path = `${process.env.VUE_APP_API_BACKEND}/productImages/viewImage/${elementImage.file_name}/${elementImage.type}`;
                  })
                } else {
                  element.productImages.push({ file_path: require("../../assets/images/no-image.png") });
                }
              });
            }
            commit("SET_DATA_BY_CATEGORY", obj);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  getDataByProductSubCategoryIdWithLimitOffset({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/products/findAllByProductSubCategoryIdWithLimitAndOffset/${payload.sub_category_id}/${payload.limit}/${payload.offset}`;
    return new Promise((resolve, reject) => {
      try {
        axios.get(url)
          .then(response => {
            let obj = response.data.result;
            if (obj) {
              obj.data.forEach(element => {
                if (element.productImages.length > 0) {
                  element.productImages.forEach(elementImage => {
                    elementImage.file_path = `${process.env.VUE_APP_API_BACKEND}/productImages/viewImage/${elementImage.file_name}/${elementImage.type}`;
                  })
                } else {
                  element.productImages.push({ file_path: require("../../assets/images/no-image.png") });
                }
              });
            }
            commit("SET_DATA_BY_SUB_CATEGORY", obj);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  getDataByProductSubSubCategoryIdWithLimitOffset({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/products/findAllByProductSubSubCategoryIdWithLimitAndOffset/${payload.sub_sub_category_id}/${payload.limit}/${payload.offset}`;
    return new Promise((resolve, reject) => {
      try {
        axios.get(url)
          .then(response => {
            let obj = response.data.result;
            if (obj) {
              obj.data.forEach(element => {
                if (element.productImages.length > 0) {
                  element.productImages.forEach(elementImage => {
                    elementImage.file_path = `${process.env.VUE_APP_API_BACKEND}/productImages/viewImage/${elementImage.file_name}/${elementImage.type}`;
                  })
                } else {
                  element.productImages.push({ file_path: require("../../assets/images/no-image.png") });
                }
              });
            }
            commit("SET_DATA_BY_SUB_SUB_CATEGORY", obj);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  // getDataById({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
  //   let url = `${process.env.VUE_APP_API_BACKEND}/product/${payload}`;
  //   let header = { headers: { Token: localStorage.getItem("token") } };
  //   return new Promise((resolve, reject) => {
  //     try {
  //       axios
  //         .get(url, header)
  //         .then(response => {
  //           let obj = response.data.result;
  //           obj.productImages.forEach(element => {
  //             if (!_.isEmpty(element)) {
  //               element.file_path = `${process.env.VUE_APP_API_BACKEND}/productImage/viewImage/${element.file_name}`;
  //             } else {
  //               element.file_path = require("../../assets/images/no-image.png");
  //             }
  //           });
  //           commit("SET_DATA_BY_ID", obj);
  //         });
  //     } catch (err) {
  //       reject(err);
  //     }
  //   });
  // }
};

const mutations = {
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
  SET_DATA_BY_IS_FEATURED(state, payload) {
    if (payload) {
      state.productIsFeaturedList = payload;
    } else {
      state.productIsFeaturedList = [];
    }
  },
  // SET_DATA_BY_SEARCH(state, payload) {
  //   if (payload.data) {
  //     state.productBySearchList = payload.data;
  //     state.productBySearchTotalCount = payload.count;
  //   } else {
  //     state.productBySearchList = [];
  //     state.productBySearchTotalCount = 0;
  //   }
  // },
  // SET_DATA_SEARCH_KEYWORD(state, payload) {
  //   if (payload) {
  //     state.productSearchKeyword = payload;
  //   } else {
  //     state.productSearchKeyword = null;
  //   }
  // },
  // SET_DATA_BY_ID(state, payload) {
  //   if (payload) {
  //     state.productDataById = payload;
  //   } else {
  //     state.productDataById = null;
  //   }
  // }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
