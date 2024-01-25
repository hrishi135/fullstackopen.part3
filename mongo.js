const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =`mongodb://Hrishi:${password}@ac-dbe4qe8-shard-00-00.csnzg5g.mongodb.net:27017,ac-dbe4qe8-shard-00-01.csnzg5g.mongodb.net:27017,ac-dbe4qe8-shard-00-02.csnzg5g.mongodb.net:27017/phonebookApp?replicaSet=atlas-s5p4ju-shard-0&ssl=true&authSource=admin`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {

  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length === 5) {
  const newName = process.argv[3]
  const newNumber = process.argv[4]

  const person = new Person({
    name: newName,
    number: newNumber,
  })

  person.save().then(() => {
    console.log(`added ${newName} number ${newNumber} to phonebook`)
    mongoose.connection.close()
  })
}