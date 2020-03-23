import axios from "axios";
import FormData from 'form-data';

const imageType = {
  mainImage: 1,
  thumbnailImage: 2,
  featuredImage: 3,
  flasDealImage: 4,
}

const state = {
  productImageList: [],
  productImageMainList: [],
  productImageThumbnailList: [],
  productImageFeaturedList: [],
  productImageFlashDealList: []
};

const getters = {
  getProductImageByIdAndType: (state) => (id, type) => {
    switch(parseInt(type)) {
      case imageType.mainImage:
        return state.productImageMainList.find(productImage => productImage.id === id);
      case imageType.thumbnailImage:
        return state.productImageThumbnailList.find(productImage => productImage.id === id);
      case imageType.featuredImage:
        return state.productImageFeaturedList.find(productImage => productImage.id === id);
      case imageType.flasDealImage:
        return state.productImageFlashDealList.find(productImage => productImage.id === id);
    }
  },
  getProductImageFileNameById: (state) => (id) => {
    return state.productImageList.find(productImage => productImage.id === id).file_name;
  },
  getProductImageList: (state) => {
    return state.productImageList;
  }
};

const actions = {
  // getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
  //   let url = `${process.env.VUE_APP_API_BACKEND}/productImage/`;
  //   let header = { headers: { Token: localStorage.getItem("token") } };
  //   return new Promise((resolve, reject) => {
  //     try {
  //       axios.get(url, header)
  //         .then(response => {
  //           commit("SET_DATA", response.data.result);
  //         });
  //     } catch (err) {
  //       reject(err);
  //     }
  //   });
  // },
  getDataById({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productImage/${payload}`;
    let header = { headers: { Token: localStorage.getItem("token") } };
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
  // getDataByProductId({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
  //   let url = `${process.env.VUE_APP_API_BACKEND}/productImage/findAllbyProductId/${payload}`;
  //   let header = { headers: { Token: localStorage.getItem("token") } };
  //   return new Promise((resolve, reject) => {
  //     try {
  //       axios
  //         .get(url, header)
  //         .then(response => {
  //           let obj = response.data.result

  //           if (obj) {
  //             obj.forEach(element => {
  //               element.file_path = `${process.env.VUE_APP_API_BACKEND}/productImage/viewImage/${element.file_name}/${element.type}`;
  //             });
  //           }

  //           commit("SET_DATA", obj);
  //           resolve(response);
  //         });
  //     } catch (err) {
  //       reject(err);
  //     }
  //   });
  // },
  getDataByProductIdAndType({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productImage/findAllbyProductIdAndType/${payload.productId}/${payload.type}`;
    let header = { headers: { Token: localStorage.getItem("token") } };
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, header)
          .then(response => {
            let obj = {
              data: response.data.result,
              type: payload.type
            }

            if (obj.data) {
              obj.data.forEach(element => {
                element.file_path = `${process.env.VUE_APP_API_BACKEND}/productImage/viewImage/${element.file_name}/${element.type}`;
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
  saveData({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productImage/create`;
    let header = { headers: { Token: localStorage.getItem("token") } };
    return new Promise((resolve, reject) => {
      try {
        var data = new FormData();
        data.set('file_name', payload.file_name);
        data.set('order', payload.order);
        data.set('product_id', payload.product_id);
        data.set('type', payload.type);
        data.append('image', payload.file);

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
    let url = `${process.env.VUE_APP_API_BACKEND}/productImage/update/${payload.id}`;
    let header = { headers: { Token: localStorage.getItem("token") } };
    return new Promise((resolve, reject) => {
      try {
        var data = new FormData();
        data.set('file_name', payload.file_name);
        data.set('order', payload.order);
        data.set('product_id', payload.product_id);
        data.set('type', payload.type);
        data.append('image', payload.file);

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
  deleteData({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/productImage/delete/${payload.id}`;
    let header = { headers: { Token: localStorage.getItem("token") } };
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
    console.log("OBJ", imageType.mainImage)
    console.log("TYPE", payload)
    if (payload.data) {
      switch(parseInt(payload.type)) {
        case imageType.mainImage:
          state.productImageMainList = payload.data;
          break;
        case imageType.thumbnailImage:
          state.productImageThumbnailList = payload.data;
          break;
        case imageType.featuredImage:
          state.productImageFeaturedList = payload.data;
          break;
        case imageType.flasDealImage:
          state.productImageFlashDealList = payload.data;
          break;
      }
    } else {
      switch(parseInt(payload.type)) {
        case imageType.mainImage:
          state.productImageMainList = [];
          break;
        case imageType.thumbnailImage:
          state.productImageThumbnailList = [];
          break;
        case imageType.featuredImage:
          state.productImageFeaturedList = [];
          break;
        case imageType.flasDealImage:
          state.productImageFlashDealList = [];
          break;
      }
    }
  },
  ADD_DATA(state, payload) {
    let obj = payload;
    obj.file_path = `${process.env.VUE_APP_API_BACKEND}/productImage/viewImage/${payload.file_name}/${payload.type}`;

    switch(parseInt(payload.type)) {
      case imageType.mainImage:
        state.productImageMainList.push(obj);
        break;
      case imageType.thumbnailImage:
        state.productImageThumbnailList.push(obj);
        break;
      case imageType.featuredImage:
        state.productImageFeaturedList.push(obj);
        break;
      case imageType.flasDealImage:
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
      file_path: `${process.env.VUE_APP_API_BACKEND}/productImage/viewImage/${payload.file_name}/${payload.type}`
    }
    
    switch(parseInt(payload.type)) {
      case imageType.mainImage:
        index = state.productImageMainList.map(productImage => productImage.id).indexOf(payload.id);
        Object.assign(state.productImageMainList[index], obj);
        break;
      case imageType.thumbnailImage:
        index = state.productImageThumbnailList.map(productImage => productImage.id).indexOf(payload.id);
        Object.assign(state.productImageThumbnailList[index], obj);
        break;
      case imageType.featuredImage:
        index = state.productImageFeaturedList.map(productImage => productImage.id).indexOf(payload.id);
        Object.assign(state.productImageFeaturedList[index], obj);
        break;
      case imageType.flasDealImage:
        index = state.productImageFlashDealList.map(productImage => productImage.id).indexOf(payload.id);
        Object.assign(state.productImageFlashDealList[index], obj);
        break;
    }
  },
  DELETE_DATA(state, payload) {
    let index = null;
    switch(parseInt(payload.type)) {
      case imageType.mainImage:
        index = state.productImageMainList.map(productImage => productImage.id).indexOf(payload.id);
        state.productImageMainList.splice(index, 1);
        break;
      case imageType.thumbnailImage:
        index = state.productImageThumbnailList.map(productImage => productImage.id).indexOf(payload.id);
        state.productImageThumbnailList.splice(index, 1);
        break;
      case imageType.featuredImage:
        index = state.productImageFeaturedList.map(productImage => productImage.id).indexOf(payload.id);
        state.productImageFeaturedList.splice(index, 1);
        break;
      case imageType.flasDealImage:
        index = state.productImageFlashDealList.map(productImage => productImage.id).indexOf(payload.id);
        state.productImageFlashDealList.splice(index, 1);
        break;
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
