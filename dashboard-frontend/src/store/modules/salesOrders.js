import axios from "axios";
const apiUrl = process.env.VUE_APP_API_BACKEND;

const state = {
  salesOrderList: [],
  salesOrderByCustomerList: [],
  salesOrderByStatusList: [],
  salesOrderTotalCount: 0,
};

const getters = {
  getSalesOrderById: (state) => (id) => {
    return state.salesOrderList.find((salesOrder) => salesOrder.id === id);
  },
  getSalesOrderByStatusAndId: (state) => (id) => {
    return state.salesOrderByStatusList.find(
      (salesOrder) => salesOrder.id === id
    );
  },
  getSalesOrderList: (state) => {
    return state.salesOrderList;
  },
  getSalesOrderByCustomerList: (state) => {
    return state.salesOrderByCustomerList;
  },
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    const url = `${apiUrl}/salesOrders/`;
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
    const url = `${apiUrl}/salesOrders/findAllbyCustomerId/${payload}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, header)
          .then((response) => {
            const data = response.data;
            commit("SET_DATA_BY_CUSTOMER_ID", data.result);
            resolve(data);
          })
          .catch((err) => {
            commit("SET_DATA_BY_CUSTOMER_ID", []);
            resolve(err.response.data);
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  getDataByStatus(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const url = `${apiUrl}/salesOrders/findAllbyStatus/${payload}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, header)
          .then((response) => {
            const data = response.data;
            commit("SET_DATA_BY_STATUS", data.result);
            resolve(data);
          })
          .catch((err) => {
            commit("SET_DATA_BY_STATUS", []);
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
    const url = `${apiUrl}/salesOrders/${payload}`;
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
  getTotalCount({ dispatch, commit, state, rootState, getters, rootGetters }) {
    const url = `${apiUrl}/salesOrders/count/all`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, header)
          .then((response) => {
            const data = response.data;
            commit("SET_TOTAL_COUNT", data.result);
            resolve(data);
          })
          .catch((err) => {
            commit("SET_TOTAL_COUNT", o);
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
    const url = `${apiUrl}/salesOrders/create`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
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
          details: payload.details,
        };

        axios
          .post(url, obj, header)
          .then((response) => {
            const data = response.data;
            if (data.result) {
              commit("ADD_DATA_BY_STATUS", data.result);
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
    const url = `${apiUrl}/salesOrders/update/${payload.id}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
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
          details: payload.details,
        };

        axios
          .put(url, obj, header)
          .then((response) => {
            const data = response.data;
            commit("UPDATE_DATA_BY_STATUS", data.result);
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
  updateReturnData(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const url = `${apiUrl}/salesOrders/updateReturn/${payload.id}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          details: payload.details,
        };

        axios
          .put(url, obj, header)
          .then((response) => {
            const data = response.data;
            commit("UPDATE_DATA_BY_STATUS", data.result);
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
  updateStatusData(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const url = `${apiUrl}/salesOrders/updateStatus/${payload.id}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        let obj = {
          status: payload.status,
          date: payload.date,
          employee_id: payload.employee_id,
        };

        axios
          .put(url, obj, header)
          .then((response) => {
            const data = response.data;
            commit("DELETE_DATA_BY_STATUS", data.result);
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
    const url = `${apiUrl}/salesOrders/delete/${payload}`;
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
      state.salesOrderList = payload;
    } else {
      state.salesOrderList = [];
    }
  },
  SET_DATA_BY_CUSTOMER_ID(state, payload) {
    if (payload) {
      state.salesOrderByCustomerList = payload;
    } else {
      state.salesOrderByCustomerList = [];
    }
  },
  SET_DATA_BY_STATUS(state, payload) {
    if (payload) {
      state.salesOrderByStatusList = payload;
    } else {
      state.salesOrderByStatusList = [];
    }
  },
  SET_TOTAL_COUNT(state, payload) {
    if (payload) {
      state.salesOrderTotalCount = payload;
    } else {
      state.salesOrderTotalCount = 0;
    }
  },
  ADD_DATA(state, payload) {
    state.salesOrderList.push(payload);
  },
  ADD_DATA_BY_STATUS(state, payload) {
    state.salesOrderByStatusList.push(payload);
  },
  UPDATE_DATA(state, payload) {
    const index = state.salesOrderList
      .map((salesOrder) => salesOrder.id)
      .indexOf(payload.id);
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
      is_viewed: payload.is_viewed,
    });
  },
  UPDATE_DATA_BY_STATUS(state, payload) {
    const index = state.salesOrderByStatusList
      .map((salesOrder) => salesOrder.id)
      .indexOf(payload.id);
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
      is_viewed: payload.is_viewed,
    });
  },
  DELETE_DATA(state, payload) {
    const index = state.salesOrderList
      .map((salesOrder) => salesOrder.id)
      .indexOf(payload);
    state.salesOrderList.splice(index, 1);
  },
  DELETE_DATA_BY_STATUS(state, payload) {
    const index = state.salesOrderByStatusList
      .map((salesOrder) => salesOrder.id)
      .indexOf(payload);
    state.salesOrderByStatusList.splice(index, 1);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
