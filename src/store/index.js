import Vue from 'vue'
// import Vuex from 'vuex'
import Vuex from '../vuex/index'
import a from './a'
import b from './b'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    data: 1
  },
  getters: {
    myAge(state){
      console.log('cishu')
      return state.data + 20
    }
  },
  mutations: {
    change(state, value) {
      state.data = state.data + value
    }
  },
  actions: {
    changes({commit}, value) {
      commit('change', value)
    }
  },
  modules: {
    a,
    b
  }
})
