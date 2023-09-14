require('dotenv').config()
const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
const app = express()
const Entry = require('./models/entry')

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :details'))

morgan.token('details', (req) => {
  return JSON.stringify(req.body)
})

app.get('/api/persons', (request, response) => {
  Entry.find({}).then(entries => {
    response.json(entries)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Entry.findById(request.params.id)
    .then(person => {
      response.json(person)
    })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  const date = new Date()
  Entry.countDocuments({})
    .then(result => {
      response.send(`<p>Phonebook has info for ${result} people</p>
    <p>${date}</p>`)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Entry.findByIdAndRemove(request.params.id)
    .then(result => {
      console.log(result)
      response.status(204).end()
    })
    .catch(error => next(error))
})

// const randomID = (min, max) => Math.floor(Math.random() * (max - min) + min)
// const nameCheck = (name) => nameData.some(n => n.name.toLowerCase() === name.toLowerCase())

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const entry = new Entry({
    name: body.name,
    number: body.number
  })

  entry.save()
    .then(savedEntry => {
      console.log(savedEntry)
      response.json(savedEntry)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  console.log(body)
  const entry = {
    name: body.name,
    number: body.number,
  }
  Entry.findByIdAndUpdate(request.params.id, entry, { new: true, runValidators: true, context: 'query' })
    .then(updatedEntry => {
      response.json(updatedEntry)
    })
    .catch(error => next(error))
})


// Error Middleware
const unknownEndpoint = (request, response) => {
  return response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log('errorhandler called')
  console.error('error name:', error.name)
  console.error('error message:', error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'incorrect id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server Running on ${PORT}`)
console.log(`DB Running on ${process.env.DB_URL}`)
