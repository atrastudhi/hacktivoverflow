const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const nodemailer = require('nodemailer')
const kue = require('kue')
const queue = kue.createQueue()

const admin = require('firebase-admin')

var serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://overflow-545e7.firebaseio.com"
});

const db = admin.firestore()

let sendMail = async (data, done) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  })

  const option = {
    from: process.env.EMAIL,
    to: data.email,
    subject: data.title,
    text: data.template
  }

  transporter.sendMail(option, (err, info) => {
    if (err) {
      console.log(err)
    } else {
      console.log(info)
      done()
    }
  })
}

queue.process('weekly', (job, done) => {
  sendMail(job.data, done)
})

module.exports = {
  hash: (password) => {
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    return hash;
  },
  compare: (input, password) => {
    return bcrypt.compareSync(input, password);
  },
  token: (email) => {
    let token = jwt.sign({
      email: email
    }, process.env.SECRET);
    return token
  },
  cronJob: async () => {
    try {
      const users = await User.find()
      users.forEach( async (e) => {
        let { docs } = db.collection('answer').where('owner', '==', e.email).get();
        let question = db.collection('question').where('owner', '==', e.email).get();
        queue.create('weekly', {
          title: 'weekly report from hacktivoverflow',
          to: e.email,
          template: `this is your weekly report, you have ${docs.length} answer and ${question.docs.length} question, enjoy your weekend`
        }).save()
      });
    } catch (err) {
      console.log(err)
    }
  }
}