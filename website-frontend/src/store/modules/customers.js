import axios from "axios";

const state = { };

const getters = { };

const actions = {
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
            // if (response.data.result) {
            //   commit("ADD_DATA", response.data.result);
            // }
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
