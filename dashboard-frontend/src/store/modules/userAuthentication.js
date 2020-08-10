import axios from "axios";

const state = {
  isLogin: false,
  token: localStorage.getItem("token") || "",
  userInfo: [],
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
    let url = `${process.env.VUE_APP_API_BACKEND}/users/login`;
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
              localStorage.setItem("token", token);
              axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

              commit("SET_LOGIN", result);
              resolve(response.data);
            }
          })
          .catch((err) => {
            console.log(err);
            localStorage.removeItem("token");
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  setLogout({ dispatch, commit, state, rootState, getters, rootGetters }) {
    let url = `${process.env.VUE_APP_API_BACKEND}/users/logout`;
    let data = {
      username: state.userInfo.username,
      token: localStorage.getItem("token"),
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
              localStorage.removeItem("token");
              delete axios.defaults.headers.common["Authorization"];
              resolve(response.data);
            }
          })
          .catch((err) => {
            console.log(err);
            localStorage.removeItem("token");
          });
      } catch (err) {
        reject(err);
      }
    });
  },
  validateToken({ dispatch, commit, state, rootState, getters, rootGetters }) {
    let url = `${process.env.VUE_APP_API_BACKEND}/authorizations/validateToken`;
    let data = {
      token: localStorage.getItem("token"),
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

            if (!result) {
              commit("SET_LOGOUT");
              localStorage.removeItem("token");
              delete axios.defaults.headers.common["Authorization"];
              resolve(response.data);
            }
          })
          .catch((err) => {
            console.log(err);
            localStorage.removeItem("token");
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
