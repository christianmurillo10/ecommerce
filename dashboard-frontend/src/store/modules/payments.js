import axios from "axios";

const state = {
  paymentList: []
};

const getters = {
  getPaymentById: (state) => (id) => {
    return state.paymentList.find(payment => payment.id === id);
  },
  getPaymentReferenceNoById: (state) => (id) => {
    return state.paymentList.find(payment => payment.id === id).reference_no;
  },
  getPaymentList: (state) => {
    return state.paymentList;
  }
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    let url = `${process.env.VUE_APP_API_BACKEND}/payments/`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
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
    let url = `${process.env.VUE_APP_API_BACKEND}/payments/${payload}`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
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
    let url = `${process.env.VUE_APP_API_BACKEND}/payments/create`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
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
          is_with_vat: payload.is_with_vat
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
    let url = `${process.env.VUE_APP_API_BACKEND}/payments/update/${payload.id}`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
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
          is_with_vat: payload.is_with_vat
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
    let url = `${process.env.VUE_APP_API_BACKEND}/payments/delete/${payload}`;
    let header = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };
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
      state.paymentList = payload;
    } else {
      state.paymentList = [];
    }
  },
  ADD_DATA(state, payload) {
    state.paymentList.push(payload);
  },
  UPDATE_DATA(state, payload) {
    let index = state.paymentList.map(payment => payment.id).indexOf(payload.id);
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
      is_with_vat: payload.is_with_vat
    });
  },
  DELETE_DATA(state, payload) {
    let index = state.paymentList.map(payment => payment.id).indexOf(payload);
    state.paymentList.splice(index, 1);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
