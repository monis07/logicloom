import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Authentication from './components/Authentication/Authentication'
import Signin from './components/Signin/Signin'
import Signup from './components/Signup/Signup'
function App(){
  return (
    <Router>
      <Routes>
      <Route path='/' element={<Authentication/>}/>
        <Route path='/signin' element={<Signin/>}/>
        <Route path='/signup' element={<Signup/>}/>
      </Routes>
    
    </Router>
    
  )
}

export default App
