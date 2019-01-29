<template>
  <div>
    <v-layout 
      ma-5 
      column
    >
      <v-card
        color="orange"
        height="12vh"
        min-width="30vw"
        v-for="(question, i) in myquestion"
        :key="i"
        dark
        style="margin:5px"
      >
        <v-layout align-center>
          <v-layout 
            row
            style="max-width:20vw;margin-top:1vh;"
          >
            <v-layout column justify-center align-center mt-2>
              <h4
                style="border:solid;padding:13px;border-width:1px;margin:2px;"
              >0</h4>
              <p>answer</p>
            </v-layout>
            <v-layout column justify-center align-center mt-2>
              <h4
                style="border:solid;padding:13px;border-width:1px;margin:2px;"
              >{{ question.up.length }}</h4>
              <p>up</p>
            </v-layout>
            <v-layout column justify-center align-center mt-2>
              <h4
                style="border:solid;padding:13px;border-width:1px;margin:2px;"
              >{{ question.down.length }}</h4>
              <p>down</p>
            </v-layout>
          </v-layout>
          <v-layout  column ma-3 justify-end text-sm-right>
            <small>{{ question.owner }}</small>
            <h2><a style="color:white;" @click="detail(question.id)">{{ question.title }}</a></h2>
            <small>2 minutes ago</small>
          </v-layout>
          <v-btn icon>
            <v-icon color="blue" @click="update(question)" large>edit</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon color="red" @click="remove(question.id)" large>delete</v-icon>
          </v-btn>
        </v-layout>
      </v-card>
    </v-layout>

    <v-layout row justify-center text-sm-center>
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Update Question</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field label="Title" v-model="title" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-textarea label="Description" v-model="description" required></v-textarea>
                </v-flex>
                <v-btn flat color="orange" @click="updateMethod()">submit</v-btn>
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
  name: 'mypage',
  data () {
    return {
      myquestion: [],
      dialog: false,
      title: '',
      description: '',
      id: ''
    }
  },
  methods: {
    setQuestion: function () {
      db.collection('question').where('owner', '==', localStorage.getItem('email')).onSnapshot( (doc) => {
        let questions = doc.docs.map( function (e) {
          return {
            ...e.data(),
            id: e.id
          }
        })
        this.myquestion = questions
      })
    },
    detail: function (id) {
      this.$router.push(`/question/${id
      }`);
    },
    update: function (question) {
      this.title = question.title,
      this.description = question.description
      this.id = question.id
      this.dialog = true
    },
    updateMethod: async function () {
      try {
        await db.collection('question').doc(this.id).update({
          title: this.title,
          description: this.description
        })
        this.dialog = false
        swal('Updated!', 'success')
      } catch (err) {
        console.error(err)
      }
    },
    remove: async function (id) {
      try {
        await db.collection('question').doc(id).delete()
        swal('Success delete!', 'success')
      } catch (err) {
        console.error(err)
      }
    }
  },
  mounted () {
    if (!this.isLogin) {
      this.$router.push('/signin')
    } else {
      this.setQuestion()
    }
  },
  computed: mapState ([
    'isLogin'
  ])
}
</script>

<style>

</style>
