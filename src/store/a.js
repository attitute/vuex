import c from './c'

export default {
    namespaced: true,
    state: {
        data: 2,
    },
    mutations: {
        change(state, value){
            state.data = value
        }
    },
    modules: {
        c
    }
}