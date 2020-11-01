<template>
  <div id="app">
    <span>jack{{this.$store.state.data}}</span>
    <br>
    <span>rose{{this.$store.getters.myAge}}</span>
    <br>
    <span>modules{{this.$store.state.a.data}}</span>
    <br>
    <button @click="$store.state.data = 100"> 直接更改数字 </button>
    <button @click="$store.commit('a/change', 5)"> 同步更新 </button>
    <button @click="$store.dispatch('changes', 20)"> 异步更新 </button>
  </div>
</template>

<script>
export default {
  name: 'app',
  mounted() {
    console.log(this.$store)
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
