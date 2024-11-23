const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (req) => JSON.stringify(req.body));
const logFormat = ':method :url :status :response-time ms :body';

app.use(morgan(logFormat))

let persons = 
[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

app.get('/info', (request, response) => {
  const time = new Date()
  const len = persons.length
  response.send(`
        <div>
            <p>Phonebook has info for ${len} people</p>
            <p>${time}</p>
        </div>
    `)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id == id)
    
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })


app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons= persons.filter(person=> person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const id = Math.floor(Math.random()*(10000-10)+1)
    const {name, number} = request.body
    const person = { id, name, number };

    if(!number || !name){
        return response.status(400).json({ error: 'Name and number are required' });
    }
    else if(persons.some(person => person.name === name)){
        return response.status(400).json({ error: 'Name must be unique' })
    }

    persons = persons.concat(person)

    console.log(person)
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT,() => {
  console.log(`Server running on port ${PORT}`)
})