const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 3) {
  console.log('password is required as an argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@practice-0cjck.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

if (process.argv.length < 4) {
  console.log('Phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length < 6) {
  const name = process.argv[3]
  const number = process.argv[4]
  console.log('Person to be saved ', name, number)

  const person = new Person({
    name: name,
    number: number
  })

  person.save().then(response => {
    console.log(`Added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}





