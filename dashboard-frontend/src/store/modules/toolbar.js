const state = {
    primaryDrawer: {
        model: null,
        type: 'default (no property)',
        clipped: false,
        floating: false,
        mini: false
    }
}

const getters = {
}

const actions = {
    setDrawer ({ dispatch, commit, state, rootState, getters, rootGetters }, payload) {
        commit('SET_PRIMARY_DRAWER_MODEL', payload)
    }
}

const mutations = {
    SET_PRIMARY_DRAWER_MODEL (state, payload) {
        state.primaryDrawer.model = payload
    }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}