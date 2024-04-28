import { useState,useEffect } from 'react'
import './particular.scss'
import axios from 'axios'
import { useParams } from 'react-router-dom'

function Particular(){
    const [problem,setProblem]=useState({})
    const {id}= useParams();
    useEffect(()=>{
        fetchProblems()
    },[])
    const fetchProblems = async()=>{
        const options={
            method:'GET',
            url:'http://localhost:3000/admin/problems/'+id,
            headers:{
                'Content-Type':'application/json',
                authorization:localStorage.getItem('token')
            }
        }
        const response=await axios.request(options)
        setProblem(response.data)
        console.log(response.data)
        console.log("problem is set")
    }
    return(
        <>
        <div className="particular">
            <p>{problem.title}</p>
            <p>{problem.description}</p>
            <p>{problem.difficulty}</p>
            <p>{problem.codeSnippet}</p>
            </div>
        </>    
    )

}

export default Particular;