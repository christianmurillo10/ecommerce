import axios from "axios";
const apiUrl = process.env.VUE_APP_API_BACKEND;

const state = {
  isLogin: false,
  token: localStorage.getItem("token") || "",
  userInfo: JSON.parse(localStorage.getItem("details")) || "",
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
    const url = `${apiUrl}/users/login`;
    const data = payload;
    const config = {
      "Content-Type": "application/json",
    };
    return new Promise((resolve, reject) => {
      try {
        axios
          .post(url, data, config)
          .then((response) => {
            const { token, data } = response.data.result;

            localStorage.setItem("details", JSON.stringify(data));
            localStorage.setItem("token", token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            commit("SET_LOGIN", { token, data });
            resolve(data);
          })
          .catch((err) => {
            resolve(err.response.data);
            localStorage.removeItem("details");
            localStorage.removeItem("token");
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  setLogout({ dispatch, commit, state, rootState, getters, rootGetters }) {
    const url = `${apiUrl}/users/logout`;
    const data = {
      token: localStorage.getItem("token"),
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
              localStorage.removeItem("details");
              localStorage.removeItem("token");
              delete axios.defaults.headers.common["Authorization"];
              resolve(data);
            }
          })
          .catch((err) => {
            resolve(err.response.data);
            localStorage.removeItem("details");
            localStorage.removeItem("token");
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  validateToken({ dispatch, commit, state, rootState, getters, rootGetters }) {
    const token = localStorage.getItem("token");
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
                localStorage.removeItem("details");
                localStorage.removeItem("token");
                delete axios.defaults.headers.common["Authorization"];
                resolve(data);
              }
            })
            .catch((err) => {
              resolve(err.response.data);
              localStorage.removeItem("details");
              localStorage.removeItem("token");
              reject(err);
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
    state.userInfo = payload.data;
  },
  SET_LOGOUT(state, payload) {
    state.isLogin = "";
    state.token = "";
    state.userInfo = [];
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
