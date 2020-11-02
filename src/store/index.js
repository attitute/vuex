import Vue from 'vue'
// import Vuex from 'vuex'
import logger from 'vuex/dist/logger' // 状态改变通知
import Vuex from '../vuex/index'
import a from './a'
import b from './b'

function persists() {
  return function(store) { // store是当前默认传递的
    let data = localStorage.getItem('VUEX:STATE')
    if(data){
      // store.replaceState(JSON.parse(data))
    }
    store.subscribe((mutation, state)=>{
      localStorage.setItem('VUEX:STATE', JSON.stringify(state))
    })
  }
}



Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [
    // logger(),
    persists()
  ],
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
