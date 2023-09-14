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
      required: true
    },
    number: {
      type: String,
      required: true
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
