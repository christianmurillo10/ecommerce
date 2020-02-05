const state = {
  snackbarDetails: {
    color: "",
    snackbar: false,
    text: "",
    timeout: 3000
  }
};

const getters = {};

const actions = {
  setSnackbar({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    commit("SET_SNACKBAR", payload);
  },
  closeSnackbar({ dispatch, commit, state, rootState, getters, rootGetters }) {
    commit("CLOSE_SNACKBAR");
  }
};

const mutations = {
  SET_SNACKBAR(state, payload) {
    state.snackbarDetails = payload;
  },
  CLOSE_SNACKBAR(state, payload) {
    state.snackbarDetails.snackbar = false;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
