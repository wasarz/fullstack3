require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

morgan.token('postData', function getData (res) {
    return JSON.stringify(res.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))


let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "123123",
      },
      {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523",
      },
      {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345",
      },
      {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122",
      },
      {
        id: 5,
        name: "Testi",
        number: "39-23-6423122",
      }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for
         ${persons.length} people</p>
         <p> ${new Date()} </p>`)
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
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

app.post('/api/persons', (request, response) => {
    const body = request.body
    
    if (!body.number || !body.name) {
        return response.status(400).json({
            error: 'content missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
/*
    if (persons.find( p => p.name === body.name)) {
        return response.status(400).json({
            error: `${body.name} is already in the phonebook`
        })
    }

    const person = {
        id: Math.floor(Math.random()*1000000),
        name: body.name,
        number: body.number
    }
    
    persons = persons.concat(person)

    response.json(person)
*/
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})