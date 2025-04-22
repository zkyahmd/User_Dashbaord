import { useState } from 'react'
import Signup from './signup'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './Login'
import Home from './Home'
import EditProfile from "./EditProfile";


function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/register' element={<Signup />}>
        </Route>
        <Route path='/login' element={<Login />}>
        </Route>
        <Route path='/home' element={<Home />}></Route>
        <Route path="/edit-profile" element={<EditProfile />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App


