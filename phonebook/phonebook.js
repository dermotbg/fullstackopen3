const express = require('express')
const app = express()

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
    response.json(nameData)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = nameData.find(p => p.id === id)
  if (person){
    response.json(person)
  }
  else {
    response.statusMessage = 'No such person found'
    response.status(404).end()
  }
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

const PORT = 3001
app.listen(PORT)