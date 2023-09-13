require('dotenv').config()
const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
const app = express()
const Entry = require('./models/entry')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :details'))

morgan.token('details', (req, res) => {
  return JSON.stringify(req.body)
})


let nameData = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    Entry.find({}).then(entries => {
      response.json(entries)
  })
})

app.get('/api/persons/:id', (request, response) => {
    Entry.findById(request.params.id).then(person => {
    response.json(person)
    })
})

app.get('/info', (request, response) => {
  const date = new Date()
  response.send(`<p>Phonebook has info for ${nameData.length} people</p>
  <p>${date}</p>`)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  nameData = nameData.filter(p => p.id !== id)
  response.status(204).end()
})

const randomID = (min, max) => Math.floor(Math.random() * (max - min) + min)
const nameCheck = (name) => nameData.some(n => n.name.toLowerCase() === name.toLowerCase())

app.post('/api/persons', (request, response) => {
  const body = request.body
  const name = nameCheck(body.name)


  if (!body.name || !body.number) {
    return response.status(400).json({
      "error": "Name or Number missing"
    })
  }
  else if (name) {
    return response.status(400).json({
      "error": "Name already exists"
    })
  }

  const entry = new Entry({
    name: body.name,
    number: body.number
  })
  entry.save().then(savedEntry => {
    console.log(savedEntry)
    response.json(savedEntry)
  })
})

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server Running on ${PORT}`)
console.log(`DB Running on ${process.env.DB_URL}`)
