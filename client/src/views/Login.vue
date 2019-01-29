<template>
  <div>
    <v-layout ma-3>
      <v-flex xs6 ma-5>
        <h1>Hacktivoverflow</h1>
        <br>
        <hr>
        <br>
        <p>Stack Overflow is a question and answer site for professional and enthusiast programmers. 
          It is a privately held website, the flagship site of the Stack Exchange Network, 
          created in 2008 by Jeff Atwood and Joel Spolsky. It features questions and answers on a wide 
          range of topics in computer programming.</p>
      </v-flex>
      <v-flex xs6 ma-5 text-sm-center>
        <v-layout column>
          <h1>Join for free!</h1>
          <v-flex xs6>
            <v-text-field label="Email" v-model="signup.email" required></v-text-field>
          </v-flex>
          <v-flex xs6>
            <v-text-field label="Password" type="password" v-model="signup.password" required></v-text-field>
          </v-flex>
          <small>already have an account? <a color="orange" @click="dialog = true">signin here.</a></small>
          <v-btn flat color="orange" @click="signupMethod()">
            Signup
          </v-btn>
          <small>you already agree with <strong> terms </strong> and <strong> conditions</strong></small>
        </v-layout>
      </v-flex>
    </v-layout>

    <v-layout row justify-center text-sm-center>
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Signin</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field label="Email" v-model="signin.email" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field label="Password" type="password" v-model="signin.password" required></v-text-field>
                </v-flex>
                <v-btn flat color="orange" @click="signinMethod()">submit</v-btn>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" flat @click="dialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
import server from '@/server/server'

export default {
  name: 'signin',
  data () {
    return {
      signup: {
        email: '',
        password: ''
      },
      signin: {
        email: '',
        password: ''
      },
      dialog: false
    }
  },
  methods: {
    signupMethod: async function () {
      try {
        await server.post('/users', {
          email: this.signup.email,
          password: this.signup.password
        });
        this.signup.email = ''
        this.signup.password = ''
        swal('Success Signup!', 'now you can login', 'success');
      } catch ({ response }) {
        console.error(response)
        swal('Invalid email / password', 'try again', 'error')
      }
    },
    signinMethod: async function () {
      try {
        let { data } = await server.post('/users/login', {
          email: this.signin.email,
          password: this.signin.password
        })
        this.signin.email = '';
        this.signin.password = '';
        localStorage.setItem('token', data.token);
        localStorage.setItem('email', data.email);
        this.dialog = false
        this.$store.dispatch('isLogin', true)
        this.$router.push('/')
        swal('Success Signin', 'redirect to home...', 'success');
      } catch (response) {
        console.error(response)
        swal('Invalid email / password', 'please check your input', 'error')
      }
    }
  }
}
</script>

<style>

</style>
