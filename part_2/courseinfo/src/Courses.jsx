const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ sum }) => <h2>total of {sum} exercises</h2>

const Part = ({ part }) => 
    <li>{part.name}{": "}{part.exercises}</li>


const Course =({course})=>{
  console.log(course)
  const total = course.parts.reduce((s, p) => s + p.exercises, 0);
  return(
    <div>
      <Header course={course.name}/>
      <ul>
        {course.parts.map(part =>
             <Part part ={part} />
        )}
      </ul>
      <Total sum = {total}/>
    </div>
  )
}


export default Course