const state = {
  primaryDrawer: {
    model: null,
    type: 'temporary'
  }
}

const getters = {
}

const actions = {
  setPrimaryDrawerModel({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
    commit('SET_DRAWER', payload);
  }
}

const mutations = {
  SET_DRAWER(state, payload) {
    state.primaryDrawer.model = payload;
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}