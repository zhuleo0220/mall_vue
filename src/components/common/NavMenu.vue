<template>
  <div>
    <NavLoginMenu></NavLoginMenu>
  <el-menu
    :default-active="'/index'"
    router
    mode="horizontal"
    background-color="white"
    text-color="#222"
    active-text-color="red"
    style="min-width: 1300px">
    <el-menu-item v-for="(item,i) in navList" :key="i" :index="item.name">
      {{ item.navItem }}
    </el-menu-item>
     </el-menu>
  </div>
</template>

<script>
import NavLoginMenu from './NavLoginMenu'

var navlist = [
  {name: '/index', navItem: '首页'},
  {name: '/category', navItem: '分类管理'},
  {name: '/product', navItem: '商品管理'},
  {name: '/user', navItem: '用户管理'},
  {name: '/order', navItem: '订单管理'},
  {name: '/orderitem', navItem: '订单用品管理'}
]
export default {
  name: 'NavMenu',
  data () {
    return {
      navList: navlist
    }
  },
  components: {NavLoginMenu},
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
a{
  text-decoration: none;
}
</style>
