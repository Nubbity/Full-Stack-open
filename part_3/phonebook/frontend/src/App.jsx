import { useState, useEffect } from 'react'
import personsService from './services/persons'
import './index.css'

const Filter = ({ newFilter, handleFilterChange, showFilter }) => {
  return (
  <div>
  <form onSubmit={showFilter}>
    <div>
      Filter shown with:
      <input
        value = {newFilter}
        onChange = {handleFilterChange}
      />
    </div>
  </form>
  </div>)}

const NewEntry =({addPerson, newName,newNumber, handleNameChange, handleNumberChange}) =>
  {return(
    <div>
      <h2>Add a new</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input 
                    value={newName}
                    onChange={handleNameChange}/>
        </div>
        <div>
          number: <input 
                    value={newNumber}
                    onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>)}

const Numbers =({filteredPersons, deletePerson}) => {return(
<div>
  <h2>Numbers</h2>
      <div>
  {filteredPersons
          .map(person =><div key= {person.id}>{person.name}    {person.number} <button onClick={()=>deletePerson(person.id, person.name)}>Delete</button></div>)}
          
      </div>
</div>)}


const Notification =({message}) =>{
  if (message==null) {
    return null
  }

  return (
    <div className='error'>
      {message}
    </div>
  )
}





const App = () => {


  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    console.log('effect')
    personsService
      .getAll()
      .then(persons => {
        setPersons(persons)
      })
    }, [])

  const addPerson = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)


    const personObject = {
      name: newName,
      number: newNumber
    }

    //test if name exists and change entry
    const existingPerson = persons.find(person => person.name.toLowerCase() === newName.toLowerCase());

    if (existingPerson) {
      console.log("id:" + existingPerson.id)
      if(window.confirm(`${newName} is already on the phonebook, would you like to update the number?`)){
        personObject.id = existingPerson.id

        console.log("id:" + personObject.id)
        personsService
          .update(personObject)
          .then(() =>{
            setPersons(persons.map(person => 
              person.id === existingPerson.id ? personObject : person
            ));
          })
          .catch(error => {
            console.log(error.response.data.error)
            setErrorMessage(error.response.data.error)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })

      }
      setErrorMessage(`${personObject.name}'s number was changed to: ${personObject.number}`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
    //add new entry
    else{


      personsService
      .create(personObject)
      .then(personObject => {
        setPersons(persons.concat(personObject))
        setErrorMessage(`${personObject.name} added with phonenumber: ${personObject.number}`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
      .catch(error => {
        console.log(error.response.data.error)
        setErrorMessage(error.response.data.error)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
    }
    setNewName('')
    setNewNumber('')
  }
  

  const showFilter=(event)=>{
    event.preventDefault()
    console.log('button clicked', event.target)
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    console.log(event.target.value);
    setNewFilter(event.target.value);}

  const deletePerson =(id, name)=>{
    console.log("Delete person: " + id)
    if (window.confirm(`Do you really want to remove ${name} from the phonebook?`)) {
      personsService 
      .remove(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id));
      })
    } 
  }

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(newFilter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage}></Notification>
      <Filter newFilter = {newFilter} handleFilterChange={handleFilterChange} showFilter={showFilter}/>
      <NewEntry addPerson={addPerson} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>
      <Numbers filteredPersons={filteredPersons} deletePerson={deletePerson}></Numbers>
    </div>
  )
}

export default App