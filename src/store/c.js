export default {
    state: {
        data: 4
    },
    mutations: {
        change(state, payload){
            state.data += payload
        }
    }
}