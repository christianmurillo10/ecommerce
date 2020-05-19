import axios from "axios";
import FormData from 'form-data';

const state = {
  customerList: [],
  customerTotalCountByStatusAndIsActive: 0
};

const getters = {
  getCustomerById: (state) => (id) => {
    return state.customerList.find(customer => customer.id === id);
  },
  getCustomerCustomerNoById: (state) => (id) => {
    return state.customerList.find(customer => customer.id === id).customer_no;
  },
  getCustomerList: (state) => {
    return state.customerList;
  }
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    let url = `${process.env.VUE_APP_API_BACKEND}/customers/`;
    let header = { headers: { Token: localStorage.getItem("token") } };
    return new Promise((resolve, reject) => {
      try {
        axios.get(url, header)
          .then(response => {
            let obj = response.data.result
            if (obj) {
              obj.forEach(element => {
                if (!_.isEmpty(obj.file_name) && !_.isNull(obj.file_name)) element.file_path = `${process.env.VUE_APP_API_BACKEND}/customers/viewImage/${element.file_name}`;
                else element.file_path = require("../../assets/images/no-image.png");
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
  getTotalCountByStatusAndIsActive({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/customers/countAllByStatusAndIsActive/${payload.status}/${payload.is_active}`;
    let header = { headers: { Token: localStorage.getItem("token") } };
    return new Promise((resolve, reject) => {
      try {
        axios.get(url, header)
          .then(response => {
            commit("SET_TOTAL_COUNT_BY_STATUS_AND_IS_ACTIVE", response.data.result);
            resolve(response);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  saveData({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/customers/create`;
    let header = { headers: { Token: localStorage.getItem("token") } };
    return new Promise((resolve, reject) => {
      try {
        var data = new FormData();
        data.set('firstname', payload.firstname);
        data.set('middlename', payload.middlename);
        data.set('lastname', payload.lastname);
        data.set('email', payload.email);
        data.set('password', payload.password);
        data.set('primary_address', payload.primary_address);
        data.set('secondary_address', payload.secondary_address);
        data.set('contact_no', payload.contact_no);
        data.set('file_name', payload.file_name);
        data.set('date_approved', payload.date_approved);
        data.set('gender_type', payload.gender_type);
        data.set('status', payload.status);
        data.append('image', payload.file);

        axios
          .post(url, data, header)
          .then(response => {
            let obj = response.data.result;
            if (obj) {
              obj.gender_type = parseInt(obj.gender_type);
              obj.status = parseInt(obj.status);
              commit("ADD_DATA", obj);
            }
            resolve(response);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  updateData({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/customers/update/${payload.id}`;
    let header = { headers: { Token: localStorage.getItem("token") } };
    return new Promise((resolve, reject) => {
      try {
        var data = new FormData();
        data.set('firstname', payload.firstname);
        data.set('middlename', payload.middlename);
        data.set('lastname', payload.lastname);
        data.set('email', payload.email);
        data.set('password', payload.password);
        data.set('primary_address', payload.primary_address);
        data.set('secondary_address', payload.secondary_address);
        data.set('contact_no', payload.contact_no);
        data.set('file_name', payload.file_name);
        data.set('date_approved', payload.date_approved);
        data.set('gender_type', payload.gender_type);
        data.set('status', payload.status);
        data.append('image', payload.file);

        axios
          .put(url, data, header)
          .then(response => {
            let obj = response.data.result;
            if (obj) {
              obj.gender_type = parseInt(obj.gender_type);
              obj.status = parseInt(obj.status);
              commit("UPDATE_DATA", obj);
            }
            resolve(response);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  deleteData({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/customers/delete/${payload}`;
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
    if (payload) {
      state.customerList = payload;
    } else {
      state.customerList = [];
    }
  },
  SET_TOTAL_COUNT_BY_STATUS_AND_IS_ACTIVE(state, payload) {
    if (payload) {
      state.customerTotalCountByStatusAndIsActive = payload;
    } else {
      state.customerTotalCountByStatusAndIsActive = 0;
    }
  },
  ADD_DATA(state, payload) {
    let obj = payload;
    if (!_.isEmpty(obj.file_name) && !_.isNull(obj.file_name)) obj.file_path = `${process.env.VUE_APP_API_BACKEND}/customers/viewImage/${obj.file_name}`;
    else obj.file_path = require("../../assets/images/no-image.png");
    state.customerList.push(obj);
  },
  UPDATE_DATA(state, payload) {
    let obj = payload;
    let index = state.customerList.map(customer => customer.id).indexOf(obj.id);
    if (!_.isEmpty(obj.file_name) && !_.isNull(obj.file_name)) obj.file_path = `${process.env.VUE_APP_API_BACKEND}/customers/viewImage/${obj.file_name}`;
    else obj.file_path = require("../../assets/images/no-image.png");

    Object.assign(state.customerList[index], {
      customer_no: obj.customer_no,
      firstname: obj.firstname,
      middlename: obj.middlename,
      lastname: obj.lastname,
      email: obj.email,
      password: obj.password,
      primary_address: obj.primary_address,
      secondary_address: obj.secondary_address,
      contact_no: obj.contact_no,
      file_name: obj.file_name,
      date_approved: obj.date_approved,
      gender_type: obj.gender_type,
      status: obj.status,
      file_path: obj.file_path
    });
  },
  DELETE_DATA(state, payload) {
    let index = state.customerList.map(customer => customer.id).indexOf(payload);
    state.customerList.splice(index, 1);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
