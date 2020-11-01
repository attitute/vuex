export default {
    namespaced: true,
    state: {
        data: 3,
    },
    mutations: {
        change(state, value){
            state.data = value
        }
    }
}