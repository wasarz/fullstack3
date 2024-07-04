const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://wasarz:${password}@klusteri0.nilnfks.mongodb.net/phonebook?retryWrites=true&w=majority&appName=klusteri0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', contactSchema)

const printPeople = () => {
    console.log("phonebook:")
    return Person.find({})
    .then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
        })
}

if (process.argv.length<4) {
    printPeople()
    .then(() => {process.exit(0)})
} else {
    const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
    })
    
    person.save().then(result => {
    console.log('person saved!')
    mongoose.connection.close()
    })
}




