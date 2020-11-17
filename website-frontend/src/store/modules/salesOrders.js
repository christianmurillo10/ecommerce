import axios from "axios";
const apiUrl = process.env.VUE_APP_API_BACKEND;

const state = {
  salesOrderDataByCustomerIdList: [],
};

const getters = {};

const actions = {
  getDataByCustomerId(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const url = `${apiUrl}/salesOrders/findAllbyCustomerId/${payload}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("cToken")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, header)
          .then((response) => {
            const data = response.data;
            commit("SET_DATA_BY_ID", data.result);
            resolve(data);
          })
          .catch((err) => {
            commit("SET_DATA_BY_ID", []);
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
        const customerDetails = JSON.parse(localStorage.getItem("cDetails"));
        const cartDetails = JSON.parse(localStorage.getItem("cCarts"));
        let obj = {
          remarks: null,
          sub_total_amount: payload.sub_total_amount,
          vat_amount: payload.vat_amount,
          shipping_fee_amount: payload.shipping_fee_amount,
          total_discount_amount: payload.total_discount_amount,
          total_amount: payload.total_amount,
          customer_id: customerDetails.id,
          date_ordered: payload.date_ordered,
          payment_method_type: payload.payment_method_type,
          is_with_vat: 0,
          details: cartDetails,
          shippingDetails: payload.shippingDetails,
        };

        axios
          .post(url, obj, header)
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
};

const mutations = {
  SET_DATA_BY_ID(state, payload) {
    if (payload) {
      state.salesOrderDataByCustomerIdList = payload;
    } else {
      state.salesOrderDataByCustomerIdList = [];
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
