const User = require('../models/user');
const { compare, token } = require('../helpers/helper')
const kue = require('kue');
const queue = kue.createQueue();
const nodemailer = require('nodemailer');

let sendEmail = async (data, done) => {
  const tranporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  })

  const option = {
    from: process.env.EMAIL,
    to: data.to,
    subject: data.title,
    text: data.title
  }

  tranporter.sendMail(option, (err, info) => {
    if (err) {
      console.log(err)
      done()
    } else {
      console.log(info)
      done()
    }
  })
}

queue.process('email', (job, done) => {
  sendEmail(job.data, done)
})

module.exports = {
  register: async (req, res) => {
    try {
      let { email, password } = req.body;
      let user = await User.create({
        email,
        password
      })
      console.log('masokkk =============')
      queue.create('email', {
        title: 'welcoming email from hacvtivoverflow',
        to: email
      }).save()
      res.status(201).json(user)
    } catch (err) {
      console.log(err)
      res.status(500).json({
        errors: err
      })
    }
  },
  login: async (req, res) => {
    try {
      let { email, password } = req.body
      let user = await User.findOne({
        email
      })
      if (!user) {
        res.status(400).json({
          errors: 'invalid email / password'
        })
      } else {
        let check = compare(password, user.password)
        if (!check) {
          res.status(400).json({
            errors: 'invalid email / password'
          })
        } else {
          res.status(200).json({
            token: token(email),
            email: email
          })
        }
      }
    } catch (err) {
      res.status(500).json({
        errors: err
      })
    }
  }
}