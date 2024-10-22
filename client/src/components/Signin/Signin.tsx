import { useEffect, useState } from 'react'
import { AiFillEye } from 'react-icons/ai'
import './signin.scss'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import API_URL from '../../config'

function Signin(){
    const [isVisible,setIsVisible]=useState(false)
    const [msg,setMsg]=useState('') 
    const navigate=useNavigate()
    const change=()=>{
        setIsVisible(!isVisible)
    }

    const [username,setUsername]=useState('')
    const [password,setPassword]=useState('')
    const [filled,setFilled]=useState(true)
    const [color,setColor]=useState('grey')
    const [cursor,setCursor]=useState('not-allowed')
    useEffect(()=>{
        if(username.length>0 && password.length>0){
            setFilled(false)
            setColor('#499bd6')
            setCursor('pointer')
        }
        else{
            setFilled(true)
            setColor('grey')
            setCursor('not-allowed')
        }
    },[username,password,cursor]);
    const options={
        method:'POST',
        url:API_URL+'/admin/signin',
        data:{
            username:username,
            password:password
        }
    }


    const handleSignin=async()=>{
        try{
            const response=await axios.request(options)
            localStorage.setItem('token',response.data.token)
            navigate('/problems')
        }
        catch(error){
            setMsg('Invalid username or password')
        }   
        
    }
    
    return(
    <>
    <div className='app__signup'>
        <div className='app__signup-details'>
        <p style={{color:"white",marginBottom:"0.5rem"}}>Username</p>
    <input type="text" placeholder="username" value={username} onChange={(e)=>{   
        setUsername(e.target.value)
    }}/>
    <p style={{color:"white",marginBottom:"0.5rem",marginTop:"0.5rem"}}>Password</p>
    <div style={{position:'relative'}}>
    <input type={isVisible?"text":"password"} size={50} placeholder="password" value={password} onChange={(e)=>{
        setPassword(e.target.value)
    }} required/>
    <AiFillEye size={22} style={{color:"black",position:"absolute",right:0,cursor:"pointer",margin:"1rem",marginTop:"0.8rem"}} onClick={change}/>
    </div>
    <button disabled={filled} onClick={handleSignin} style={{backgroundColor:color,cursor:cursor}}>SignIn</button>
    <p style={{color:'white',textAlign:"center"}}>Not a User? <a style={{textDecoration:"none",color:"#499bd6"}} href={"/signup"}> SignUp</a></p> 
        </div>
        <p className="app__signup-response" style={{color:"white"}}>{msg}</p>
        
    </div>
    </>
    )
}
export default Signin