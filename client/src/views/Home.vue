<template>
  <div>
    <v-layout 
      ma-5 
      column
    >
      <v-flex xs6 offset-sm6 ma-5>
        <v-card max-width="30vw" color="orange" dark>

          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">Tags</h3>
              <hr>
              <div>
                <v-chip color="red" text-color="white" @click="changeTag('Javascript')" small>
                  <v-icon left>label</v-icon>Javascript
                </v-chip>
                <v-chip color="red" text-color="white" @click="changeTag('Ruby')" small>
                  <v-icon left>label</v-icon>Ruby
                </v-chip>
                <v-chip color="red" text-color="white" @click="changeTag('Go')" small>
                  <v-icon left>label</v-icon>Go
                </v-chip>
                <v-chip color="red" text-color="white" @click="changeTag('Java')" small>
                  <v-icon left>label</v-icon>Java
                </v-chip>
                <v-chip color="red" text-color="white" @click="setQuestion()" small>
                  <v-icon left>label</v-icon>All
                </v-chip>
              </div>
            </div>
          </v-card-title>
        </v-card>
      </v-flex>

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
          <v-chip color="red" text-color="white" small>
            <v-icon small>label</v-icon>
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
  </div>
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
      questions: [],
      sample: []
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
        this.sample = questions
      })
    },
    detail: function (id) {
      if (!this.isLogin) {
        this.$router.push('/signin')
      } else {
        this.$router.push(`/question/${id}`);
      }
    },
    changeTag: function (tag) {
      let tagged = this.sample.filter( (e) => {
        if (e.tag === tag) {
          return true
        } else {
          return false
        }
      })
      this.questions = tagged
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
