const state = {
  recentSearchList: [],
};

const getters = {};

const actions = {};

const mutations = {
  SET_DATA(state, payload) {
    state.recentSearchList = _.isNull(localStorage.getItem("cRecentSearch"))
      ? []
      : JSON.parse(localStorage.getItem("cRecentSearch"));
  },
  ADD_DATA(state, payload) {
    if (!state.recentSearchList.includes(payload) && !_.isEmpty(payload)) {
      state.recentSearchList.push(payload);
      localStorage.setItem(
        "cRecentSearch",
        JSON.stringify(state.recentSearchList)
      );
    }
  },
  DELETE_DATA(state, payload) {
    state.recentSearchList.splice(payload, 1);
    localStorage.setItem(
      "cRecentSearch",
      JSON.stringify(state.recentSearchList)
    );
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
