import axios from "axios";
const apiUrl = process.env.VUE_APP_API_BACKEND;

const state = {
  customerCreditDebitCardList: [],
};

const getters = {
  getCustomerCreditDebitCardById: (state) => (id) => {
    return state.customerCreditDebitCardList.find(
      (customerCreditDebitCard) => customerCreditDebitCard.id === id
    );
  },
  getCustomerCreditDebitCardList: (state) => {
    return state.customerCreditDebitCardList;
  },
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    const url = `${apiUrl}/customerCreditDebitCards/`;
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
  getDataByCustomerId(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const url = `${apiUrl}/customerCreditDebitCards/findAllbyCustomerId/${payload}`;
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
  getDataById(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const url = `${apiUrl}/customerCreditDebitCards/${payload}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, header)
          .then((response) => {
            const data = response.data;
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
  saveData(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const url = `${apiUrl}/customerCreditDebitCards/create`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
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
          type: payload.type,
        };

        axios
          .post(url, obj, header)
          .then((response) => {
            const data = response.data;
            if (data.result) {
              commit("ADD_DATA", data.result);
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
    const url = `${apiUrl}/customerCreditDebitCards/update/${payload.id}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
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
          type: payload.type,
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
    const url = `${apiUrl}/customerCreditDebitCards/delete/${payload}`;
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
      state.customerCreditDebitCardList = payload;
    } else {
      state.customerCreditDebitCardList = [];
    }
  },
  ADD_DATA(state, payload) {
    state.customerCreditDebitCardList.push(payload);
  },
  UPDATE_DATA(state, payload) {
    const index = state.customerCreditDebitCardList
      .map((customerCreditDebitCard) => customerCreditDebitCard.id)
      .indexOf(payload.id);
    Object.assign(state.customerCreditDebitCardList[index], {
      card_no: payload.card_no,
      security_code: payload.security_code,
      firstname: payload.firstname,
      lastname: payload.lastname,
      bank_id: payload.bank_id,
      date_expired: payload.date_expired,
      type: payload.type,
      banks: payload.banks,
    });
  },
  DELETE_DATA(state, payload) {
    const index = state.customerCreditDebitCardList
      .map((customerCreditDebitCard) => customerCreditDebitCard.id)
      .indexOf(payload);
    state.customerCreditDebitCardList.splice(index, 1);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
