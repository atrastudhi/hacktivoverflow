const mongoose = require('mongoose');
const { Schema } = mongoose;
const hash = require('../helpers/hash')

const userSchema = new Schema ({
  email: {
    type: String,
    required: [true, 'email field cant empty'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    validate: {
      validator: async function (value) {
        try {
          let user = await User.findOne({
            email: value
          })
          if (user) return false
        } catch (err) {
          throw err
        }
      },
      message: props => 'this email is already in use'
    }
  },
  password: {
    type: String,
    required: [true, 'password field cant empty']
  }
});

userSchema.pre('save', function (next) {
  // console.log(helpers)
  this.password = hash(this.password)
  next()
})

const User = mongoose.model('User', userSchema);

module.exports = User;