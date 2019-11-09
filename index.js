const express = require('express')
const app = express()

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]

app.get('/', (request, response) => {
  response.send('<h3>This is the backend for a phonebook</h3>')
})

app.get('/info', (request, response) => {
  let date = new Date()
  let tm = date.toString()
  response.send(`<p>Phonebook has the information of ${persons.length} people</p><p>${tm}</p>`)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

const port = 3001
app.listen(port)
