import applyMixin from './mixin'
import ModuleCollection from './module/module-collection'
import {forEachValue} from './util'

export let Vue

export const install = (_Vue) =>{ // vue use安装

    Vue = _Vue

    applyMixin(Vue)
}

function getState(store, path) {
    return path.reduce((newState, current)=>{
        return newState[current]
    },store.state)
}

/**
 * 
 * @param {*} store 容器
 * @param {*} state 根模块
 * @param {*} path 所有路径
 * @param {*} module 模块格式完的树结构
 */

const installModule = (store, rootState, path, module)=>{

    // 我要给当前订阅的事件 增加一个命名空间
    let namespace = store._modules.getNamespaced(path) // 返回前缀即可
    console.log(namespace)
    
    // 将所有的子模块的状态安装到父模块的状态上
    if(path.length > 0) { // vuex 可以动态的添加模块
        let parent = path.slice(0, -1).reduce((memo, current) => {
            return memo[current]
        },rootState)
        // Vue.set()将 child的state变成响应式
        Vue.set(parent, path[path.length-1], module.state)
    }

    // 对当前模块进行操作 
    // 将所有的mutations方法 保存在 store._mutations上 
    module.forEachMutation((mutation, mutationName)=>{
        store._mutations[namespace + mutationName] = (store._mutations[namespace + mutationName] || [])
        // payload 用户使用时必传的
        store._mutations[namespace + mutationName].push((payload)=>{
            mutation.call(store, module.state, payload)
            store._subscribes.forEach(fn => {
                fn(mutation, rootState)
            })
        })

    })
    module.forEachAction((action, actionName)=>{
        store._actions[namespace + actionName] = (store._actions[namespace + actionName] || [])
        // payload 用户使用时必传的
        store._actions[namespace + actionName].push((payload)=>{
            action.call(store, store, payload)
        })
    })
    module.forEachGetter((getter, getterName)=>{
        // 模块中getter的名字重复了会覆盖
        store._wrappedGetters[namespace + getterName] = function () {
            return getter(module.state)
        }
    })
    module.forEachChild((child, childName)=>{
        // 递归加载模块
        installModule(store, rootState, path.concat(childName), child)
    })
}

function reserStoreVM(store, state) {
    const computed = {}
    store.getters = {}
    
    forEachValue(store._wrappedGetters, (fn,key)=>{
        computed[key] = ()=>{
            return fn()
        }
        Object.defineProperty(store.getters, key, {
            get: ()=>store._vm[key]
        })
    })
    store._vm = new Vue({
        data: {
            $$state: state
        },
        computed        
    })

}


export class Store {
    constructor(options){
        const state = options.state; // 数据变化要更新视图
        this._subscribes = []

        // 存储用户store中所有的 actions mutations getters
        this._actions = {}
        this._mutations = {}
        this._wrappedGetters = {}

        //1.模块收集   数据得格式化 格式化成我想要得树结构
        this._modules = new ModuleCollection(options)

        // 2.安装模块  根模块的状态中 要将子模块通过模块名 定义在根模块上
        installModule(this, state, [], this._modules.root)


        // 3. 将状态和getters 都定义在当前的vm上
        reserStoreVM(this, state)
        console.log(state)

        // 插件依次执行
        options.plugins.forEach(plugin=>plugin(this))

    }
    replaceState(state) {
        getState()
    }
    subscribe (fn) {
        this._subscribes.push(fn)
    }
    commit = (type, payload)=>{ // 保证当前this 当前store实例
        // 调用commit其实就是去找 刚才绑定得mutation
        this._mutations[type].forEach(mutation=>mutation.call(this, payload))
    }
    dispatch = (type, payload)=>{ // 保证当前this 当前store实例
        // 调用commit其实就是去找 刚才绑定得actions
        this._actions[type].forEach(actions=>actions.call(this, payload))
    }
    get state() { // 属性访问器
        return this._vm._data.$$state
    }
}


