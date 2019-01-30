<template>
  <div>
    <v-toolbar dense color="orange" dark>
      <v-toolbar-title @click="$router.push('/')">Hacktivoverflow</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon @click="dialog = true" v-if="isLogin">
        <v-icon>add</v-icon>
      </v-btn>

      <v-btn flat v-if="isLogin" @click="$router.push('/mypage')">
        My Page
      </v-btn>

      <v-btn icon v-if="!isLogin" @click="$router.push('/signin')">
        <v-icon>people</v-icon>
      </v-btn>

      <v-btn icon v-if="isLogin" @click="logout()">
        <v-icon>logout</v-icon>
      </v-btn>
    </v-toolbar>

    <v-layout row justify-center text-sm-center>
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Ask Question</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field label="Title" v-model="question.title" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-textarea label="Description" v-model="question.description" required></v-textarea>
                </v-flex>
                <v-flex xs12>
                  <v-select
                    :items="items"
                    v-model="question.tag"
                    label="Select"
                    required
                  ></v-select>
                </v-flex>
                <v-btn flat color="orange" @click="questionMethod()">submit</v-btn>
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
import { mapState } from 'vuex'

export default {
  name: 'navbar',
  data () {
    return {
      dialog: false,
      question: {
        title: '',
        description: '',
        tag: ''
      },
      items: [
        'Javascript',
        'Ruby',
        'Java',
        'Go'
      ]
    }
  },
  methods: {
    questionMethod: async function () {
      try {
        if (!this.question.title || !this.question.description || !this.question.tag) {
          swal('Invalid', 'all field is required', 'error')
        } else {
          await db.collection('question').add({
            title: this.question.title,
            description: this.question.description,
            tag: this.question.tag,
            up: [],
            down: [],
            answer: [],
            owner: localStorage.getItem('email'),
            date: new Date
          })
          this.dialog = false
          swal('Success ask!', 'wait for other answer', 'success')
        }
      } catch (err) {
        console.error(err)
      }
    },
    logout: function () {
      localStorage.clear()
      this.$store.dispatch('isLogin', false)
    }
  },
  computed: mapState([
    'isLogin'
  ])
}
</script>

<style>

</style>
