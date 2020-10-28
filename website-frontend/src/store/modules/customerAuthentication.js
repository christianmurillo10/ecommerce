import axios from "axios";
const apiUrl = process.env.VUE_APP_API_BACKEND;

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
    const url = `${apiUrl}/customers/login`;
    const data = payload;
    const config = {
      "Content-Type": "application/json",
    };
    return new Promise((resolve, reject) => {
      try {
        axios
          .post(url, data, config)
          .then((response) => {
            let { token, data } = response.data.result;

            if (
              _.isEmpty(data.file_name) &&
              data.file_name !== null &&
              _.isUndefined(data.file_name)
            ) {
              data.file_path = `${apiUrl}/customers/viewImage/${data.file_name}`;
            } else {
              data.file_path = require("../../assets/images/no-image.png");
            }

            localStorage.setItem("cDetails", JSON.stringify(data));
            localStorage.setItem("cToken", token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            commit("SET_LOGIN", { token, data });
            resolve(data);
          })
          .catch((err) => {
            resolve(err.response.data);
            localStorage.removeItem("cDetails");
            localStorage.removeItem("cToken");
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  setLogout({ dispatch, commit, state, rootState, getters, rootGetters }) {
    const url = `${apiUrl}/customers/logout`;
    const data = {
      email: state.customerInfo.email,
      token: localStorage.getItem("cToken"),
    };
    const config = {
      "Content-Type": "application/json",
    };
    return new Promise((resolve, reject) => {
      try {
        axios
          .post(url, data, config)
          .then((response) => {
            const data = response.data;

            if (data.status === "success") {
              commit("SET_LOGOUT");
              localStorage.removeItem("cDetails");
              localStorage.removeItem("cToken");
              delete axios.defaults.headers.common["Authorization"];
              resolve(data);
            }
          })
          .catch((err) => {
            resolve(err.response.data);
            localStorage.removeItem("cDetails");
            localStorage.removeItem("cToken");
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  validateToken({ dispatch, commit, state, rootState, getters, rootGetters }) {
    const token = localStorage.getItem("cToken");
    if (token) {
      const url = `${apiUrl}/authorizations/validateToken`;
      const data = {
        token: token,
      };
      const config = {
        "Content-Type": "application/json",
      };
      return new Promise((resolve, reject) => {
        try {
          axios
            .post(url, data, config)
            .then((response) => {
              const data = response.data;

              if (!data.result) {
                commit("SET_LOGOUT");
                localStorage.removeItem("cDetails");
                localStorage.removeItem("cToken");
                delete axios.defaults.headers.common["Authorization"];
                resolve(data);
              }
            })
            .catch((err) => {
              resolve(err.response.data);
              localStorage.removeItem("cDetails");
              localStorage.removeItem("cToken");
            });
        } catch (err) {
          reject(err);
        }
      });
    }
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
