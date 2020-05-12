import axios from "axios";
import FormData from 'form-data';

const state = { };

const getters = { };

const actions = {
  getDataById({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/customers/${payload}`;
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
  saveData({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/customers/create/pending`;
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          firstname: payload.firstname,
          middlename: payload.middlename,
          lastname: payload.lastname,
          email: payload.email,
          password: payload.password,
          primary_address: payload.primary_address,
          contact_no: payload.contact_no,
          gender_type: payload.gender_type
        };

        axios
          .post(url, obj)
          .then(response => {
            resolve(response);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  updateData({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/customers/update/${payload.id}`;
    let header = { headers: { Token: localStorage.getItem("cToken") } };
    return new Promise((resolve, reject) => {
      try {
        var data = new FormData();
        data.set('firstname', payload.firstname);
        data.set('middlename', payload.middlename);
        data.set('lastname', payload.lastname);
        data.set('email', payload.email);
        data.set('primary_address', payload.primary_address);
        data.set('secondary_address', payload.secondary_address);
        data.set('contact_no', payload.contact_no);
        data.set('file_name', payload.file_name);
        data.set('gender_type', payload.gender_type);
        data.append('image', payload.file);

        axios
          .put(url, data, header)
          .then(response => {
            resolve(response);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  changePassword({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/customers/changePassword/${payload.id}`;
    let header = { headers: { Token: localStorage.getItem("cToken") } };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          old_password: payload.old_password,
          new_password: payload.new_password
        };

        axios
          .put(url, obj, header)
          .then(response => {
            resolve(response);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
};

const mutations = { };

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
