import axios from "axios";
const apiUrl = process.env.VUE_APP_API_BACKEND;

const state = {
  paymentList: [],
};

const getters = {
  getPaymentById: (state) => (id) => {
    return state.paymentList.find((payment) => payment.id === id);
  },
  getPaymentReferenceNoById: (state) => (id) => {
    return state.paymentList.find((payment) => payment.id === id).reference_no;
  },
  getPaymentList: (state) => {
    return state.paymentList;
  },
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    const url = `${apiUrl}/payments/`;
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
    const url = `${apiUrl}/payments/${payload}`;
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
    const url = `${apiUrl}/payments/create`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          or_no: payload.or_no,
          remarks: payload.remarks,
          vat_amount: payload.vat_amount,
          amount: payload.amount,
          customer_id: payload.customer_id,
          sales_order_id: payload.sales_order_id,
          bank_id: payload.bank_id,
          customer_credit_debit_card_id: payload.customer_credit_debit_card_id,
          date: payload.date,
          payment_method_type: payload.payment_method_type,
          is_with_vat: payload.is_with_vat,
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
    const url = `${apiUrl}/payments/update/${payload.id}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          or_no: payload.or_no,
          remarks: payload.remarks,
          vat_amount: payload.vat_amount,
          amount: payload.amount,
          customer_id: payload.customer_id,
          sales_order_id: payload.sales_order_id,
          bank_id: payload.bank_id,
          customer_credit_debit_card_id: payload.customer_credit_debit_card_id,
          date: payload.date,
          payment_method_type: payload.payment_method_type,
          is_with_vat: payload.is_with_vat,
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
    const url = `${apiUrl}/payments/delete/${payload}`;
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
      state.paymentList = payload;
    } else {
      state.paymentList = [];
    }
  },
  ADD_DATA(state, payload) {
    state.paymentList.push(payload);
  },
  UPDATE_DATA(state, payload) {
    const index = state.paymentList
      .map((payment) => payment.id)
      .indexOf(payload.id);
    Object.assign(state.paymentList[index], {
      or_no: payload.or_no,
      remarks: payload.remarks,
      vat_amount: payload.vat_amount,
      amount: payload.amount,
      customer_id: payload.customer_id,
      sales_order_id: payload.sales_order_id,
      bank_id: payload.bank_id,
      customer_credit_debit_card_id: payload.customer_credit_debit_card_id,
      date: payload.date,
      payment_method_type: payload.payment_method_type,
      is_with_vat: payload.is_with_vat,
    });
  },
  DELETE_DATA(state, payload) {
    const index = state.paymentList
      .map((payment) => payment.id)
      .indexOf(payload);
    state.paymentList.splice(index, 1);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
