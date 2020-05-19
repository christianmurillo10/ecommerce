import axios from "axios";

const state = {
  customerCreditDebitCardList: []
};

const getters = {
  getCustomerCreditDebitCardById: (state) => (id) => {
    return state.customerCreditDebitCardList.find(customerCreditDebitCard => customerCreditDebitCard.id === id);
  },
  getCustomerCreditDebitCardList: (state) => {
    return state.customerCreditDebitCardList;
  }
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    let url = `${process.env.VUE_APP_API_BACKEND}/customerCreditDebitCards/`;
    let header = { headers: { Token: localStorage.getItem("token") } };
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
  getDataByCustomerId({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/customerCreditDebitCards/findAllbyCustomerId/${payload}`;
    let header = { headers: { Token: localStorage.getItem("token") } };
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
  getDataById({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/customerCreditDebitCards/${payload}`;
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
    let url = `${process.env.VUE_APP_API_BACKEND}/customerCreditDebitCards/create`;
    let header = { headers: { Token: localStorage.getItem("token") } };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          card_no: payload.card_no,
          security_code: payload.security_code,
          firstname: payload.firstname,
          lastname: payload.lastname,
          bank_id: payload.bank_id,
          customer_id: payload.customer_id,
          date_expired: payload.date_expired,
          type: payload.type
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
    let url = `${process.env.VUE_APP_API_BACKEND}/customerCreditDebitCards/update/${payload.id}`;
    let header = { headers: { Token: localStorage.getItem("token") } };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          card_no: payload.card_no,
          security_code: payload.security_code,
          firstname: payload.firstname,
          lastname: payload.lastname,
          bank_id: payload.bank_id,
          customer_id: payload.customer_id,
          date_expired: payload.date_expired,
          type: payload.type
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
    let url = `${process.env.VUE_APP_API_BACKEND}/customerCreditDebitCards/delete/${payload}`;
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
      state.customerCreditDebitCardList = payload;
    } else {
      state.customerCreditDebitCardList = [];
    }
  },
  ADD_DATA(state, payload) {
    state.customerCreditDebitCardList.push(payload);
  },
  UPDATE_DATA(state, payload) {
    let index = state.customerCreditDebitCardList.map(customerCreditDebitCard => customerCreditDebitCard.id).indexOf(payload.id);
    Object.assign(state.customerCreditDebitCardList[index], {
      card_no: payload.card_no,
      security_code: payload.security_code,
      firstname: payload.firstname,
      lastname: payload.lastname,
      bank_id: payload.bank_id,
      date_expired: payload.date_expired,
      type: payload.type,
      banks: payload.banks
    });
  },
  DELETE_DATA(state, payload) {
    let index = state.customerCreditDebitCardList.map(customerCreditDebitCard => customerCreditDebitCard.id).indexOf(payload);
    state.customerCreditDebitCardList.splice(index, 1);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
