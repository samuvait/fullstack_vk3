const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

morgan.token('data', (req, res) => {
  let body = JSON.stringify(req.body)
  if (body !== '{}') {
    return body
  } else {
    return ''
  }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))

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
  //console.log(persons)
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }

})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const ppl = request.body
  const id = Math.floor((Math.random() * 1000000000) + 1)

  if (ppl.name && ppl.number) {
    if (persons.filter(person => person.name === ppl.name).length > 0) {
      return response.status(400).json({
        error: 'name must be unique'
      })
    } else {
      const person = {
        name: ppl.name,
        number: ppl.number,
        id: id
      }

      persons = persons.concat(person)
      response.json(person)
    }
  } else {
    return response.status(400).json({
      error: 'content missing'
    })
  }
})

app.put('/api/persons/:id', (request, response) => {
  const body = request.body
  const id = Number(request.params.id)

  if (persons.filter(person => person.id === id)[0]) {
    const newPerson = {
      name: body.name,
      number: body.number,
      id: id
    }
  
    persons = persons.map(person => person.id !== id ? person : newPerson)
    response.json(newPerson)
  }
})

const port = process.env.PORT || 3001
app.listen(port)
