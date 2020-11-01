
export default function applyMixin(Vue) {
    Vue.mixin({
        // 父子组件beforeCreate 执行顺序 父->子->...
        beforeCreate: vuexInit,
    })
}


function vuexInit() {
    const options = this.$options
    if(options.store){  // 根实例
        this.$store = options.store
    }else if (options.parent && options.parent.$store) { // 一定是儿子 孙子。。
        this.$store = options.parent.$store // 为了让子实例也有$store属性 使用父实例的$store属性
    }
}
