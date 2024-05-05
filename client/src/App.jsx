import { useState, useEffect } from 'react'
import './App.css'
import axios from "axios"

function App() {
    const [count, setCount] = useState(0)

    const fetchApi = async () =>{
        const response = await axios.get("http://127.0.0.1:8080/api/hello")
        console.log(response)
    }
    useEffect(() => {fetchApi(), []})
  return (
   <div>Hello World!</div>
  )
}

export default App
