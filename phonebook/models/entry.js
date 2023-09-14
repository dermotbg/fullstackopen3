require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.DB_URL
console.log(`making connection to ${url}`)

mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(result => {
    console.log('connected')
  })
  .catch((error) => {
    console.log('error connecting to DB:', error.message)
  })

const entrySchema = mongoose.Schema({
    name: {
      type: String,
      minLength: 3,
      required: [true, 'Name is required']
    },
    number: {
      type: String,
      validate: {
        validator: function(v) {
          return /^\d{2,3}-\d+/.test(v)
        },
        message: props => `${props.value} not a valid phone number!`
      },
      minLength: [8, 'Minimnum number length is 8'],
      required: [true, 'Phone number is required']
    },
})

entrySchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
  }
})

module.exports = mongoose.model('Entry', entrySchema)
