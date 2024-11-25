
require('dotenv').config()
const mongoose = require('mongoose')
mongoose.set('debug', true)

const url = process.env.MONGODB_URI
mongoose.set('strictQuery',false)

mongoose.connect(url).then(() => {
  console.log('connected to MongoDB')
})
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  id:String,
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    validate: { validator: function(v) {
      return /^(\d{2,3})-(\d{5,})$/.test(v)
    },
    message: props => `${props.value} is not a valid phone number!` },
    required:[true, 'User phone number required']
  },
})

//replace ID with string(id) and delete version tag
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)