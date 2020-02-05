const state = {
  alertDetails: {
    alert: false,
    type: "success",
    message: ""
  }
};

const getters = {};

const actions = {
  setAlert({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    commit("SET_ALERT", payload);
  }
};

const mutations = {
  SET_ALERT(state, payload) {
    state.alertDetails = payload;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
