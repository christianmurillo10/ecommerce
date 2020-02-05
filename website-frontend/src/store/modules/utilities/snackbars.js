const state = {
  snackbarDetails: {
    color: "",
    snackbar: false,
    text: "",
    timeout: 3000,
  }
};

const getters = {};

const actions = {};

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
