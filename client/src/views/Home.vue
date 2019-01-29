<template>
  <v-layout 
    ma-5 
    column
  >
    <v-card
      color="orange"
      height="12vh"
      min-width="30vw"
      v-for="(question, i) in questions"
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
        <v-chip color="cyan" text-color="white" small>
          {{ question.tag }}
        </v-chip>
        <v-layout  column ma-3 justify-end text-sm-right>
          <small>{{ question.owner }}</small>
          <h2><a style="color:white;" @click="detail(question.id)">{{ question.title }}</a></h2>
          <small>{{ question.moment }}</small>
        </v-layout>
      </v-layout>
    </v-card>
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'home',
  components: {
    //
  },
  data () {
    return {
      questions: []
    }
  },
  methods: {
    setQuestion: function () {
      db.collection('question').onSnapshot( (doc) => {
        let questions = doc.docs.map( function (e) {
          return {
            ...e.data(),
            id: e.id,
            moment: moment(e.data().date.toDate()).startOf('hour').fromNow()
          }
        })
        this.questions = questions
      })
    },
    detail: function (id) {
      if (!this.isLogin) {
        this.$router.push('/signin')
      } else {
        this.$router.push(`/question/${id}`);
      }
    }
  },
  mounted () {
    this.setQuestion()
  },
  computed: mapState ([
    'isLogin'
  ])
}
</script>
