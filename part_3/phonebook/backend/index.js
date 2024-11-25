const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person.js')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (req) => JSON.stringify(req.body))
const logFormat = ':method :url :status :response-time ms :body'

app.use(morgan(logFormat))




app.get('/api/persons', (request, response,next) => {
  Person.find({})
    .then(notes => {
      response.json(notes)
    })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {

  Person.countDocuments({})
    .then(count => {
      const time = new Date()
      response.send(`
      <div>
          <p>Phonebook has info for ${count} people</p>
          <p>${time}</p>
      </div>
    `)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response,next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response,next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))

})

app.put('/api/persons/:id', (request, response,next) => {
  const { name, number } = request.body
  const person = {
    name: name,
    number: number,
  }
  Person.findByIdAndUpdate(
    request.params.id,
    person,
    { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})


app.post('/api/persons', (request, response, next) =>  {
  const { name, number } = request.body
  console.log(name, number)
  if(number ==='' || name ===''){
    return response.status(400).json({ error: 'Name and number are required' })
  }
  const person = new Person({
    name: name,
    number: number,
  })

  person.save()
    .then(newPerson => {
      response.json(newPerson)
    })
    .catch(error => next(error))
})



const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  console.log('Error handled')

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  else if (error.name === 'SyntaxError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)


}
app.use(errorHandler)

const Port = process.env.PORT
app.listen(Port,() => {
  console.log(`Server running on port ${Port}`)
})