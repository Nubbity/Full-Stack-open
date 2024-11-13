//Unicafe ALL
import { useState } from 'react'


const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const StatisticLine = ({text, stat}) =>{return(
  <tr>
    <td>{text}</td>
    <td>{stat}</td>
  </tr>
)
}

const Statistics = (props) => {
  const { good, neutral, bad, all } = props
  const avg = (good, bad, all) =>{return((good + (-1*bad))/all).toFixed(2)}
  const percentage = (good, all) =>{return((good/all).toFixed(2))}


  if(all == 0){
    return (
    <div>
      No feedback given
    </div>
  )}

  return(
    <div>
      <h1>{"Statistics"}</h1>
      <StatisticLine text = {"Good"} stat = {good}/>
      <StatisticLine text = {"Neutral"} stat = {neutral}/>
      <StatisticLine text = {"Bad"} stat = {bad}/>
      <StatisticLine text = {"All"} stat = {all}/>
      <StatisticLine text = {"Avg"} stat = {avg(good, bad, all)}/>
      <StatisticLine text = {"Pos"} stat = {percentage(good, all)}/>
    </div>
  )
}


const App = () => {
  // save clicks of each button to its own state
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)
    const [all, setAll] = useState(0)

  return (
    <div>
      <h1>{'Give Feedback'}</h1>

      <Button handleClick ={()=>{setGood(good + 1);setAll(all+1)}} text = {'Good'}/>
      <Button handleClick ={()=>{setNeutral(neutral + 1);setAll(all+1)}} text = {'Neutral'}/>
      <Button handleClick ={()=>{setBad(bad + 1);setAll(all+1)}} text = {'Bad'}/>
      <Statistics good={good} neutral={neutral} bad={bad} all={all} />
    </div>
  )
}



export default App