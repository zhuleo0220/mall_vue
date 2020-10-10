<template>
    <el-form class="login-container" label-position="left"
             label-width="0px">
      <h3 class="login_title">login</h3>
      <el-form-item>
        <el-input name="username" type="text" v-model="loginForm.username"
                  auto-complete="off" autoComplete="on" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input name="password" type="password" v-model="loginForm.password"
                  auto-complete="off" autoComplete="on" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item style="width: 100%">
        <el-button style="width: 45%" type="primary" :loading="loading" @click.native.prevent="handleLogin">
          登录
        </el-button>
      </el-form-item>
    </el-form>
</template>

<script>
import {getCookie, setCookie} from '../utils/support'

export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loading: false
    }
  },
  created () {
    this.loginForm.username = getCookie('username')
    this.loginForm.password = getCookie('password')
  },
  methods: {
    handleLogin () {
      this.loading = true
      this.$store.dispatch('Login', this.loginForm).then(() => {
        this.loading = false
        setCookie('username', this.loginForm.username, 15)
        setCookie('password', this.loginForm.password, 15)
        this.$router.push({path: '/index'})
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style>
.login-container {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 90px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.login_title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}

</style>
