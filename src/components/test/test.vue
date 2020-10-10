<!DOCTYPE html>
<html>
<body>

<div id="app">
<p>{{message}}</p>
</div>

<script>

  new Vue({
    el:'#app',
    data:{
      message: 'Hello Vue.js!'
    }
  })

</script>
</body>
</html>
