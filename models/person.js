const mongoose = require('mongoose')
const password = process.argv[2]

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

  const phoneValidator = {
    validator: (value) => {
      const regex = /^\d{2,3}-\d+$/; // Matches (two or three digits)-(any number or digits)
      return regex.test(value);
    },
    message: (props) => `${props.value} is not a valid phone number`
  };

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    validate: phoneValidator,
    required: true
  },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
  

module.exports = mongoose.model('Person', personSchema)