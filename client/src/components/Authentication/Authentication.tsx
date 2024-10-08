import {useNavigate} from 'react-router-dom'
import './Authentication.scss'
import { CodesandboxIcon } from '@hugeicons/react-pro';
function Authentication(){
    const navigate=useNavigate();
    const handleSignup=()=>{
            navigate('/signup')
    }
    const handleSignin=()=>{
        navigate('/signin')
    }
    return (
        <>
        <div className='app__auth'>
            <div className='app__auth-intro'>
            <h1>Welcome to LogicLoom</h1>
            <CodesandboxIcon 
            size={100}
            color="white"
            variant='solid'
            />
            </div>
            <div className='app__auth-description'>
            <h2>Dive into a diverse range of data structures questions to sharpen your problem-solving skills. From Array to Linked List, we've got you covered.</h2>
            </div>
            
            <div className='app__auth-button'>
            <button onClick={handleSignin}>SignIn</button>
            <button onClick={handleSignup}>SignUp</button>
            </div>
            <p>This app's backend is hosted on render.com which has policy of idling after 15 minutes of inactivity. Please wait for 30 seconds if u see any!</p>
        </div>
        </>
    )
}

export default Authentication
