<template>
<div>
  <el-menu
    router
    mode="horizontal"
    background-color="white"
    text-color="#222"
    active-text-color="red"
    style="min-width: 1300px">
  <el-menu-item>
  <span @click="logout">logout</span>

    </el-menu-item>
    <el-menu-item>
      {{ username }}
    </el-menu-item>
  </el-menu>

</div>
</template>

<script>
export default {
  name: 'NavLoginMenu',
  data () {
    return {
      username: this.$store.getters.name
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    login () {
      location.href = '/#/login'
    }
  }
}
</script>

<style scoped>

</style>
