import { useState, useEffect } from 'react'
import axios from 'axios'
const api_key = import.meta.env.VITE_SOME_KEY

const CountryListing = ({ countries, handleSearchButton }) => {
  if (!countries) return null;
  
  if (countries.length <= 1) return null;
  if (countries.length > 10) return <p>Too many options, make the search more specific</p>;

  return (
    <div>
      {countries.map(country =>
        <div key={country.name.official}>
          {country.name.official}<button onClick={()=>handleSearchButton(country)}>Show</button>
        </div>
      )}
    </div>
  );
}

const CountryShowcase = ({ countries, weather}) => {
  if (!countries) return null
  if (countries.length != 1) return null
  const country = countries[0]

  return(
    <div>
      <h1>{country.name.official}</h1>
      <p>Capital: {country.capital}</p>
      <p>Area: {country.area}</p>
      <h3>Languages:</h3>
      <ul>
        {Object.values(country.languages).map(language => 
          <li key={language}>{language}</li>
        )}
      </ul>
      <img 
        src={country.flags.png}
      />
      <h2>Weather today</h2>
      {weather?.current?.weather && (
      <>
        <img
          src={`https://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`}
          alt="Weather icon"
        />
    <p>Temperature: {(weather.current.temp-273).toFixed(2)}°C</p>
    <p>Wind: {weather.current.wind_speed} m/s</p>
  </>
)}
    </div>
  )
}

function App() {
  const [countries, setCountries] = useState([])
  const [weather, setWeather] = useState(null)
  const [search, setSearch] = useState('')
  const [value, setValue] = useState('')
  const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'

  const getAll = (search) =>{
      axios
      .get(baseUrl)
      .then((response) => {
        const filteredCountries = response.data.filter((country) =>
          country.name.official.toLowerCase().includes(search.toLowerCase())
        )
        setCountries(filteredCountries)
      })
      .catch((error) => {
        console.log("No work", error)
        setCountries([])
      })
  }


  useEffect(() => {
    console.log('effect run, search is: '+countries)

    if (search) {
      console.log('fetching countries')
      getAll(search)
      console.log('Search complete')
    }
  }, [search])

  useEffect(() => {
    if (countries.length == 1) {
      getWeather(countries[0]);
    }
  }, [countries])

  const onSearch =(event)=>{
    event.preventDefault()
    console.log('button clicked', value)
    setSearch(value)
  }

  const handleSearch = (event) => {
    setValue(event.target.value)}

  const handleSearchButton =(country) =>{
    setCountries([country])
  }

  const getWeather =(country) =>{
    console.log("Getting weather"+ country.name.official)
    const lat =  country.latlng[0]
    const lon = country.latlng[1]
    console.log(lat +"  "+ lon)

    const request = axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${api_key}`)
    return request.then(response => {
      setWeather(response.data)})
  }


  if(!countries){return(null)}
  if(countries.length == 1){
  }
  return (
    <div>
        <form onSubmit={onSearch}>
          <div>
            Find countries:
            <input
              value = {value}
              onChange = {handleSearch}
            />

              <button type="submit">Search</button>
          </div>
        </form>
        <CountryListing countries={countries} handleSearchButton={handleSearchButton}></CountryListing>
        <CountryShowcase countries={countries} weather={weather}></CountryShowcase>
    </div>
  )
}

export default App
