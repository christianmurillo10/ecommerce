import axios from "axios";

const state = {
  isLogin: false,
  token: localStorage.getItem("cToken") || "",
  customerInfo: JSON.parse(localStorage.getItem("cDetails")) || "",
};

const getters = {
  isLoggedIn: (state) => !!state.token,
  authStatus: (state) => state.isLogin,
};

const actions = {
  setLogin(
    { dispatch, commit, state, rootState, getters, rootGetters },
    payload
  ) {
    let url = `${process.env.VUE_APP_API_BACKEND}/customers/login`;
    let data = payload;
    let config = {
      "Content-Type": "application/json",
    };
    return new Promise((resolve, reject) => {
      try {
        axios
          .post(url, data, config)
          .then((response) => {
            let result = response.data.result;
            let token = result.token;

            if (!result) {
              resolve(response.data);
            } else {
              let details = result.data;
              if (_.isEmpty(details.file_name) && details.file_name !== null && _.isUndefined(details.file_name))
                details.file_path = `${process.env.VUE_APP_API_BACKEND}/customers/viewImage/${details.file_name}`;
              else
                details.file_path = require("../../assets/images/no-image.png");

              localStorage.setItem("cDetails", JSON.stringify(details));
              localStorage.setItem("cToken", token);
              axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

              commit("SET_LOGIN", result);
              resolve(response.data);
            }
          })
          .catch((err) => {
            console.log(err);
            localStorage.removeItem("cDetails");
            localStorage.removeItem("cToken");
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  setLogout({ dispatch, commit, state, rootState, getters, rootGetters }) {
    let url = `${process.env.VUE_APP_API_BACKEND}/customers/logout`;
    let data = {
      email: state.customerInfo.email,
      token: localStorage.getItem("cToken"),
    };
    let config = {
      "Content-Type": "application/json",
    };
    return new Promise((resolve, reject) => {
      try {
        axios
          .post(url, data, config)
          .then((response) => {
            let status = response.data.status;

            if (status === 200) {
              commit("SET_LOGOUT");
              localStorage.removeItem("cDetails");
              localStorage.removeItem("cToken");
              delete axios.defaults.headers.common["Authorization"];
              resolve(response.data);
            }
          })
          .catch((err) => {
            console.log(err);
            localStorage.removeItem("cDetails");
            localStorage.removeItem("cToken");
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  validateToken({ dispatch, commit, state, rootState, getters, rootGetters }) {
    let url = `${process.env.VUE_APP_API_BACKEND}/authorizations/validateToken`;
    let data = {
      token: localStorage.getItem("cToken"),
    };
    let config = {
      "Content-Type": "application/json",
    };
    return new Promise((resolve, reject) => {
      try {
        axios
          .post(url, data, config)
          .then((response) => {
            let result = response.data.result;

            if (result) {
              commit("SET_LOGOUT");
              localStorage.removeItem("cDetails");
              localStorage.removeItem("cToken");
              delete axios.defaults.headers.common["Authorization"];
              resolve(response.data);
            }
          })
          .catch((err) => {
            console.log(err);
            localStorage.removeItem("cDetails");
            localStorage.removeItem("cToken");
          });
      } catch (err) {
        reject(err);
      }
    });
  },
};

const mutations = {
  SET_LOGIN(state, payload) {
    (state.isLogin = true), (state.token = payload.token);
    state.customerInfo = payload.data;
  },
  SET_LOGOUT(state, payload) {
    state.isLogin = false;
    state.token = "";
    state.customerInfo = "";
  },
  SET_CUSTOMER_INFO(state, payload) {
    state.customerInfo = payload;
    localStorage.setItem("cDetails", JSON.stringify(payload));
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
