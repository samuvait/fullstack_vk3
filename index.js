require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')

morgan.token('data', (request, response) => {
  let body = JSON.stringify(request.body)
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

app.get('/', (request, response) => {
  response.send('<h3>This is the backend for a phonebook</h3>')
})

app.get('/info', (request, response) => {
  let date = new Date()
  let tm = date.toString()
  let amount = 0

  Person.find({}).then(result => {
    console.log(`result ${result.length}`)
    amount = result.length
    response.send(`<p>Phonebook has the information of ${amount} people</p><p>${tm}</p>`)
  })
})

app.get('/api/persons', (request, response) => {
  let persons = []
  Person.find({}).then(result => {
    result.forEach(person => {
      persons = persons.concat(person.toJSON())
    })
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person.toJSON())
    } else {
      response.status(404).end()
    }

  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id).then(response.status(204).end()).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  console.log('body', body)

  if (body.name === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson.toJSON())
  }).catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const id = request.params.id

  const newPerson = {
    name: body.name,
    number: body.number
  }

  Person.findOneAndUpdate({ _id: id }, { number: newPerson.number }, { new: true }).then(person => {
    response.json(person.toJSON())
  }).catch(error => next(error))

})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Server running on ${port}`)
})
