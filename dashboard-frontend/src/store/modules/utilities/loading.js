const state = {
  loadingDetails: {
    dialog: false,
    text: "Please wait"
  }
};

const getters = {};

const actions = {};

const mutations = {
  SET_LOADING(state, payload) {
    console.log("QWEQEQW", payload)
    state.loadingDetails = payload;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
