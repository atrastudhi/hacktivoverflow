<template>
  <v-app>
    <navbar />
    <router-view></router-view>
  </v-app>
</template>

<script>
import navbar from '@/components/navbar'
import { mapState } from 'vuex'

export default {
  name: 'App',
  components: {
    navbar,
  },
  data () {
    return {
      //
    }
  },
  methods: {
    checkLogin: function () {
      if (localStorage.getItem('token')) {
        this.$store.dispatch('isLogin', true)
      }
    }
  },
  computed: mapState ([
    'isLogin'
  ]),
  mounted () {
    this.checkLogin()
  }
}
</script>

<style>
  .navside {
    border-right-style: solid;
    border-right-color: orange;
  }
</style>

