<template>
  <div>
    <v-container>
      <v-layout row>
        <v-flex xs1>
          <v-layout column align-center mt-4>
            <v-btn icon @click="upQuestion()">
              <v-icon>keyboard_arrow_up</v-icon>
            </v-btn>
            <h1>{{ detail.up.length - detail.down.length }}</h1>
            <v-btn icon @click="downQuestion()">
              <v-icon>keyboard_arrow_down</v-icon>
            </v-btn>
          </v-layout>
        </v-flex>
        <v-flex ma-5>
          <h1>{{ detail.title }}</h1>
          <br>
          <hr>
          <br>
          <p>{{ detail.description }}</p>
          <v-btn icon>
            <v-icon color="blue" @click="dialog=true" medium>add_comment</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container
      style="max-width:65vw"
    >
      <v-layout 
        row 
        v-for="(answer, i) in answers"
        :key="i"
      >
        <v-flex xs1>
          <v-layout column align-center mt-4>
            <v-btn icon @click="upAnswer(answer)">
              <v-icon>keyboard_arrow_up</v-icon>
            </v-btn>
            <h3>{{ answer.up.length - answer.down.length }}</h3>
            <v-btn icon @click="downAnswer(answer)">
              <v-icon>keyboard_arrow_down</v-icon>
            </v-btn>
          </v-layout>
        </v-flex>
        <v-flex ma-5>
          <h1>{{ answer.title }}</h1>
          <br>
          <hr>
          <br>
          <p>{{ answer.description }}</p>
          <v-btn icon v-if="answer.owner === me">
            <v-icon color="red" @click="update(answer)">edit</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>

    <v-layout row justify-center text-sm-center>
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Answer</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field label="Title" v-model="createAns.title" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-textarea label="Description" v-model="createAns.description" required></v-textarea>
                </v-flex>
                <v-btn flat color="orange" @click="answerMethod()">submit</v-btn>
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

    <v-layout row justify-center text-sm-center>
      <v-dialog v-model="dialog2" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Answer</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field label="Title" v-model="updateAns.title" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-textarea label="Description" v-model="updateAns.description" required></v-textarea>
                </v-flex>
                <v-btn flat color="orange" @click="updateMethod()">submit</v-btn>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="red" flat @click="dialog2 = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
export default {
  name: 'detail',
  data () {
    return {
      dialog: false,
      dialog2: false,
      me: '',
      detail: {
        up: [],
        down: []
      },
      createAns: {
        title: '',
        description: ''
      },
      answers: [{
        up: [],
        down: []
      }],
      updateAns: {
        title: '',
        description: '',
        id: ''
      }
    }
  },
  methods: {
    setDetail: function () {
      db.collection('question').doc(this.$route.params.id).onSnapshot(doc1 => {
        this.detail = {
          ...doc1.data(),
          id: doc1.id
        }
        db.collection('answer').where('original', '==', this.detail.id).onSnapshot(({ docs }) => {
          let mapped = docs.map((e) => {
            return {
              ...e.data(),
              id: e.id
            }
          })
          this.answers = mapped
        })
      })
    },
    answerMethod: async function () {
      try {
        await db.collection('answer').add({
          title: this.createAns.title,
          description: this.createAns.description,
          up: [],
          down: [],
          original: this.detail.id,
          owner: localStorage.getItem('email'),
          date: new Date()
        })
        this.createAns.title = ''
        this.createAns.description = ''
        this.dialog = false
        swal('Success Answer', 'success');
      } catch (err) {
        console.error(err)
      }
    },
    upQuestion: async function () {
      try {
        if ( this.detail.up.includes(localStorage.getItem('email')) ) {
          await db.collection('question').doc(this.$route.params.id).update({
            up: firebase.firestore.FieldValue.arrayRemove(localStorage.getItem('email'))
          })
        } else if ( this.detail.down.includes(localStorage.getItem('email')) ) {
          await db.collection('question').doc(this.$route.params.id).update({
            down: firebase.firestore.FieldValue.arrayRemove(localStorage.getItem('email'))
          })
          await db.collection('question').doc(this.$route.params.id).update({
            up: firebase.firestore.FieldValue.arrayUnion(localStorage.getItem('email'))
          })
        } else if ( this.detail.owner === localStorage.getItem('email') ) {
          swal('Cant vote your own question', 'error')
        } else {
          await db.collection('question').doc(this.$route.params.id).update({
            up: firebase.firestore.FieldValue.arrayUnion(localStorage.getItem('email'))
          })
        }
      } catch (err) {
        console.error(err)
      }
    },
    downQuestion: async function () {
      try {
        if ( this.detail.down.includes(localStorage.getItem('email')) ) {
          await db.collection('question').doc(this.$route.params.id).update({
            down: firebase.firestore.FieldValue.arrayRemove(localStorage.getItem('email'))
          })
        } else if ( this.detail.up.includes(localStorage.getItem('email')) ) {
          await db.collection('question').doc(this.$route.params.id).update({
            up: firebase.firestore.FieldValue.arrayRemove(localStorage.getItem('email'))
          })
          await db.collection('question').doc(this.$route.params.id).update({
            down: firebase.firestore.FieldValue.arrayUnion(localStorage.getItem('email'))
          })
        } else if ( this.detail.owner === localStorage.getItem('email') ) {
          swal('Cant vote your own question', 'error')
        } else {
          await db.collection('question').doc(this.$route.params.id).update({
            down: firebase.firestore.FieldValue.arrayUnion(localStorage.getItem('email'))
          })
        }
      } catch (err) {
        console.error(err)
      }
    },
    upAnswer: async function (answer) {
      try {
        if ( answer.up.includes(localStorage.getItem('email')) ) {
          await db.collection('answer').doc(answer.id).update({
            up: firebase.firestore.FieldValue.arrayRemove(localStorage.getItem('email'))
          })
        } else if ( answer.down.includes(localStorage.getItem('email')) ) {
          await db.collection('answer').doc(answer.id).update({
            down: firebase.firestore.FieldValue.arrayRemove(localStorage.getItem('email'))
          })
          await db.collection('answer').doc(answer.id).update({
            up: firebase.firestore.FieldValue.arrayUnion(localStorage.getItem('email'))
          })
        } else if ( answer.owner === localStorage.getItem('email') ) {
          swal('Cant vote your own answer', 'error')
        } else {
          await db.collection('answer').doc(answer.id).update({
            up: firebase.firestore.FieldValue.arrayUnion(localStorage.getItem('email'))
          })
        }
      } catch (err) {
        console.error(err)
      }
    },
    downAnswer: async function (answer) {
      try {
        if ( answer.down.includes(localStorage.getItem('email')) ) {
          await db.collection('answer').doc(answer.id).update({
            down: firebase.firestore.FieldValue.arrayRemove(localStorage.getItem('email'))
          })
        } else if ( answer.up.includes(localStorage.getItem('email')) ) {
          await db.collection('answer').doc(answer.id).update({
            up: firebase.firestore.FieldValue.arrayRemove(localStorage.getItem('email'))
          })
          await db.collection('answer').doc(answer.id).update({
            down: firebase.firestore.FieldValue.arrayUnion(localStorage.getItem('email'))
          })
        } else if ( answer.owner === localStorage.getItem('email') ) {
          swal('Cant vote your own answer', 'error')
        } else {
          await db.collection('answer').doc(answer.id).update({
            down: firebase.firestore.FieldValue.arrayUnion(localStorage.getItem('email'))
          })
        }
      } catch (err) {
        console.error(err)
      }
    },
    update: function (answer) {
      this.updateAns.title = answer.title
      this.updateAns.description = answer.description
      this.updateAns.id = answer.id
      this.dialog2 = true
    },
    updateMethod: async function () {
      try {
        if (!this.updateAns.title || !this.updateAns.description) {
          swal('Field cant empty', 'error')
        } else {
          await db.collection('answer').doc(this.updateAns.id).update({
            title: this.updateAns.title,
            description: this.updateAns.description
          })
          this.dialog2 = false
          swal('success edit answer', 'success')
        }
      } catch (err) {
        console.error(err)  
      }
    }
  },
  mounted () {
    this.setDetail()
    this.me = localStorage.getItem('email')
  }
}
</script>

<style>

</style>
