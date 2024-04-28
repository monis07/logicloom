import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Authentication from './components/Authentication/Authentication'
import Signin from './components/Signin/Signin'
import Signup from './components/Signup/Signup'
import Problems from './components/Problems/Problems';
import Particular from './components/Particular/Particular';
function App(){
  return (
    <Router>
      <Routes>
      <Route path='/' element={<Authentication/>}/>
        <Route path='/signin' element={<Signin/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/problems' element={<Problems/>}/>
        <Route path='/problems/:id' element={<Particular/>}/>
      </Routes>
    </Router>
    
  )
}

export default App
