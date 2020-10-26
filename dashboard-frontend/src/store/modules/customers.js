import axios from "axios";
import FormData from "form-data";
const apiUrl = process.env.VUE_APP_API_BACKEND;

const state = {
  customerList: [],
  customerTotalCountByStatusAndIsActive: 0,
  customerDataById: "",
};

const getters = {
  getCustomerById: (state) => (id) => {
    return state.customerList.find((customer) => customer.id === id);
  },
  getCustomerCustomerNoById: (state) => (id) => {
    return state.customerList.find((customer) => customer.id === id)
      .customer_no;
  },
  getCustomerList: (state) => {
    return state.customerList;
  },
};

const actions = {
  getData({ dispatch, commit, state, rootState, getters, rootGetters }) {
    const url = `${apiUrl}/customers/`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, header)
          .then((response) => {
            const data = response.data;
            let obj = data.result;
            if (obj) {
              obj.forEach((element) => {
                if (!_.isNull(element.file_name)) {
                  element.file_path = `${apiUrl}/customers/viewImage/${
                    element.file_name
                  }`;
                } else {
                  element.file_path = require("../../assets/images/no-image.png");
                }
              });
            }

            commit("SET_DATA", obj);
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
  getTotalCountByStatusAndIsActive(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const url = `${apiUrl}/customers/countAllByStatusAndIsActive/${
      payload.status
    }/${payload.is_active}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        axios
          .get(url, header)
          .then((response) => {
            const data = response.data;
            commit("SET_TOTAL_COUNT_BY_STATUS_AND_IS_ACTIVE", data.result);
            resolve(data);
          })
          .catch((err) => {
            commit("SET_TOTAL_COUNT_BY_STATUS_AND_IS_ACTIVE", []);
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
    const url = `${apiUrl}/customers/${payload}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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
            commit("SET_DATA_BY_ID", "");
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
    const url = `${apiUrl}/customers/create`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        var data = new FormData();
        data.set("firstname", payload.firstname);
        data.set("middlename", payload.middlename);
        data.set("lastname", payload.lastname);
        data.set("email", payload.email);
        data.set("password", payload.password);
        data.set("primary_address", payload.primary_address);
        data.set("secondary_address", payload.secondary_address);
        data.set("contact_no", payload.contact_no);
        data.set("file_name", payload.file_name);
        data.set("date_approved", payload.date_approved);
        data.set("gender_type", payload.gender_type);
        data.set("status", payload.status);
        data.append("image", payload.file);

        axios
          .post(url, data, header)
          .then((response) => {
            const data = response.data;
            let obj = data.result;
            if (obj) {
              obj.gender_type = parseInt(obj.gender_type);
              obj.status = parseInt(obj.status);
              commit("ADD_DATA", obj);
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
    const url = `${apiUrl}/customers/update/${payload.id}`;
    const header = {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    };
    return new Promise((resolve, reject) => {
      try {
        var data = new FormData();
        data.set("firstname", payload.firstname);
        data.set("middlename", payload.middlename);
        data.set("lastname", payload.lastname);
        data.set("email", payload.email);
        data.set("password", payload.password);
        data.set("primary_address", payload.primary_address);
        data.set("secondary_address", payload.secondary_address);
        data.set("contact_no", payload.contact_no);
        data.set("file_name", payload.file_name);
        data.set("date_approved", payload.date_approved);
        data.set("gender_type", payload.gender_type);
        data.set("status", payload.status);
        data.append("image", payload.file);

        axios
          .put(url, data, header)
          .then((response) => {
            const data = response.data;
            let obj = data.result;
            if (obj) {
              obj.gender_type = parseInt(obj.gender_type);
              obj.status = parseInt(obj.status);
              commit("UPDATE_DATA", obj);
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
  deleteData(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    const url = `${apiUrl}/customers/delete/${payload}`;
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
  SET_DATA_BY_ID(state, payload) {
    if (payload) {
      state.customerDataById = payload;
    } else {
      state.customerDataById = "";
    }
  },
  ADD_DATA(state, payload) {
    let obj = payload;
    obj.file_path = _.isNull(payload.file_name)
      ? require("../../assets/images/no-image.png")
      : `${apiUrl}/customers/viewImage/${payload.file_name}`;
    state.customerList.push(obj);
  },
  UPDATE_DATA(state, payload) {
    const index = state.customerList
      .map((customer) => customer.id)
      .indexOf(payload.id);

    Object.assign(state.customerList[index], {
      customer_no: payload.customer_no,
      firstname: payload.firstname,
      middlename: payload.middlename,
      lastname: payload.lastname,
      email: payload.email,
      password: payload.password,
      primary_address: payload.primary_address,
      secondary_address: payload.secondary_address,
      contact_no: payload.contact_no,
      file_name: payload.file_name,
      date_approved: payload.date_approved,
      gender_type: payload.gender_type,
      status: payload.status,
      file_path: _.isNull(payload.file_name)
        ? require("../../assets/images/no-image.png")
        : `${apiUrl}/customers/viewImage/${payload.file_name}`,
    });
  },
  DELETE_DATA(state, payload) {
    const index = state.customerList
      .map((customer) => customer.id)
      .indexOf(payload);
    state.customerList.splice(index, 1);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
