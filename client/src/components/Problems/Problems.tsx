import { useState,useEffect } from 'react'
import './problems.scss'
import axios from 'axios'
import Navbar from '../Navbar/Navbar'
import API_URL from '../../config'

function Problems(){
    const [problems,setProblems]=useState([])
    useEffect(()=>{
        fetchProblems()
    },[])
    const fetchProblems = async()=>{
        const options={
            method:'GET',
            url:API_URL+'/admin/problems',
            headers:{
                'Content-Type':'application/json',
                authorization:localStorage.getItem('token')
            }
        }
        const response=await axios.request(options)
        setProblems(response.data)
        
    }
    
    return(
        <>
        <Navbar></Navbar>
        <table>
            <thead>
                <th>Title</th>
                <th>Difficulty</th>
            </thead>
            <tbody>
            {problems.map((problem: { title: string, difficulty: string, _id: string }) => (
            <Child _id={problem._id} title={problem.title} difficulty={problem.difficulty}></Child>
        ))}
            </tbody>
        
        </table>
        
        </>
    )

}

function Child(props:{title:string,difficulty:string,_id:string}){
    const id="/problems/"+props._id
    // const enum colour{Easy="green",Medium="yellow",Hard="red"}
    return(
        <tr>
            <td><a href={id}>{props.title}</a></td>
            <td style={{color:props.difficulty === 'Easy'?"green":(props.difficulty === 'Medium'?"yellow":"red")}}>{props.difficulty}</td>
        </tr>
    )
}
export default Problems