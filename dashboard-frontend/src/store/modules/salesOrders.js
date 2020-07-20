import axios from "axios";

const state = {
  salesOrderList: [],
  salesOrderByStatusList: []
};

const getters = {
  getSalesOrderById: (state) => (id) => {
    return state.salesOrderList.find(salesOrder => salesOrder.id === id);
  },
  getSalesOrderByStatusAndId: (state) => (id) => {
    return state.salesOrderByStatusList.find(salesOrder => salesOrder.id === id);
  },
  getSalesOrderList: (state) => {
    return state.salesOrderList;
  }
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    let url = `${process.env.VUE_APP_API_BACKEND}/salesOrders/`;
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
  getDataByStatus({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/salesOrders/findAllbyStatus/${payload}`;
    let header = { headers: { Token: localStorage.getItem("token") } };
    return new Promise((resolve, reject) => {
      try {
        axios.get(url, header)
          .then(response => {
            commit("SET_DATA_BY_STATUS", response.data.result);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  getDataById({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/salesOrders/${payload}`;
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
    let url = `${process.env.VUE_APP_API_BACKEND}/salesOrders/create`;
    let header = { headers: { Token: localStorage.getItem("token") } };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          remarks: payload.remarks,
          sub_total_amount: payload.sub_total_amount,
          vat_amount: payload.vat_amount,
          shipping_fee_amount: payload.shipping_fee_amount,
          total_discount_amount: payload.total_discount_amount,
          total_amount: payload.total_amount,
          customer_id: payload.customer_id,
          date_ordered: payload.date_ordered,
          payment_method_type: payload.payment_method_type,
          is_with_vat: payload.is_with_vat,
          details: payload.details
        };

        axios
          .post(url, obj, header)
          .then(response => {
            if (response.data.result) {
              commit("ADD_DATA_BY_STATUS", response.data.result);
            }
            resolve(response);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  updateData({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/salesOrders/update/${payload.id}`;
    let header = { headers: { Token: localStorage.getItem("token") } };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          remarks: payload.remarks,
          sub_total_amount: payload.sub_total_amount,
          vat_amount: payload.vat_amount,
          shipping_fee_amount: payload.shipping_fee_amount,
          total_discount_amount: payload.total_discount_amount,
          total_amount: payload.total_amount,
          customer_id: payload.customer_id,
          date_ordered: payload.date_ordered,
          payment_method_type: payload.payment_method_type,
          is_with_vat: payload.is_with_vat,
          details: payload.details
        };

        axios
          .put(url, obj, header)
          .then(response => {
            commit("UPDATE_DATA_BY_STATUS", response.data.result);
            resolve(response);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  updateStatusData({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/salesOrders/updateStatus/${payload.id}`;
    let header = { headers: { Token: localStorage.getItem("token") } };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          status: payload.status,
          date: payload.date
        };

        axios
          .put(url, obj, header)
          .then(response => {
            commit("DELETE_DATA_BY_STATUS", response.data.result);
            resolve(response);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  deleteData({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    let url = `${process.env.VUE_APP_API_BACKEND}/salesOrders/delete/${payload}`;
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
      state.salesOrderList = payload;
    } else {
      state.salesOrderList = [];
    }
  },
  SET_DATA_BY_STATUS(state, payload) {
    if (payload) {
      state.salesOrderByStatusList = payload;
    } else {
      state.salesOrderByStatusList = [];
    }
  },
  ADD_DATA(state, payload) {
    state.salesOrderList.push(payload);
  },
  ADD_DATA_BY_STATUS(state, payload) {
    state.salesOrderByStatusList.push(payload);
  },
  UPDATE_DATA(state, payload) {
    let index = state.salesOrderList.map(salesOrder => salesOrder.id).indexOf(payload.id);
    Object.assign(state.salesOrderList[index], {
      order_no: payload.order_no,
      remarks: payload.remarks,
      sub_total_amount: payload.sub_total_amount,
      vat_amount: payload.vat_amount,
      shipping_fee_amount: payload.shipping_fee_amount,
      total_discount_amount: payload.total_discount_amount,
      total_amount: payload.total_amount,
      customer_id: payload.customer_id,
      reviewed_by: payload.reviewed_by,
      approved_by: payload.approved_by,
      date_ordered: payload.date_ordered,
      date_approved: payload.date_approved,
      date_delivery: payload.date_delivery,
      date_delivered: payload.date_delivered,
      payment_method_type: payload.payment_method_type,
      status: payload.status,
      is_with_vat: payload.is_with_vat,
      is_with_return: payload.is_with_return,
      is_paid: payload.is_paid,
      is_fully_paid: payload.is_fully_paid,
      is_viewed: payload.is_viewed
    });
  },
  UPDATE_DATA_BY_STATUS(state, payload) {
    let index = state.salesOrderByStatusList.map(salesOrder => salesOrder.id).indexOf(payload.id);
    Object.assign(state.salesOrderByStatusList[index], {
      order_no: payload.order_no,
      remarks: payload.remarks,
      sub_total_amount: payload.sub_total_amount,
      vat_amount: payload.vat_amount,
      shipping_fee_amount: payload.shipping_fee_amount,
      total_discount_amount: payload.total_discount_amount,
      total_amount: payload.total_amount,
      customer_id: payload.customer_id,
      reviewed_by: payload.reviewed_by,
      approved_by: payload.approved_by,
      date_ordered: payload.date_ordered,
      date_approved: payload.date_approved,
      date_delivery: payload.date_delivery,
      date_delivered: payload.date_delivered,
      payment_method_type: payload.payment_method_type,
      status: payload.status,
      is_with_vat: payload.is_with_vat,
      is_with_return: payload.is_with_return,
      is_paid: payload.is_paid,
      is_fully_paid: payload.is_fully_paid,
      is_viewed: payload.is_viewed
    });
  },
  DELETE_DATA(state, payload) {
    let index = state.salesOrderList.map(salesOrder => salesOrder.id).indexOf(payload);
    state.salesOrderList.splice(index, 1);
  },
  DELETE_DATA_BY_STATUS(state, payload) {
    let index = state.salesOrderByStatusList.map(salesOrder => salesOrder.id).indexOf(payload);
    state.salesOrderByStatusList.splice(index, 1);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
