require('dotenv').config()
const express = require('express')
// const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()


app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
// morgan.token('body', (request, response) => JSON.stringify(request.body))
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id+'').then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  }).catch((error) => next(error))
})


app.post('/api/persons', (request, response, next) => {
  const person = request.body

  if (!person.name || !person.number) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const newPerson = new Person({
    name: person.name,
    number: person.number,
  })

  newPerson.save()
    .then(savedPerson => {
      response.json(savedPerson
      )})
    .catch(error => next(error))
  
})

app.put('/api/persons/:id', (request, response, next) => {
  const {name, number} = request.body

  Person.findByIdAndUpdate(request.params.id, 
    {name, number}, 
    {new: true, runValidators: true, context: 'query'})
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.json(result)
    })
    .catch(error => next(error))
})

app.get('/info', async (request, response) => {
  const count = await Person.countDocuments({}).exec()
  const htmlString = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
    </head>
    <body>
      <div>
          Phonebook has info for ${count} people
          <br/>
          ${Date()}
      </div>
    </body>
    </html>`
  response.send(htmlString)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}  
// this has to be the last loaded middleware.
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})