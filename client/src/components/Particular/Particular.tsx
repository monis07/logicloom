import { useState,useEffect } from 'react'
import './particular.scss'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import API_URL from '../../config'

function Particular(){
    const [problem,setProblem]=useState({})
    const [code,setCode]=useState("")
    const [status,setStatus]=useState("Submit")
    const [data,setData]=useState([])
    const {id}= useParams();
    useEffect(()=>{
        fetchProblems()
    },[])
    const fetchProblems = async()=>{
        try{
            const options={
                method:'GET',
                url:API_URL+'/admin/problems/'+id,
                headers:{
                    'Content-Type':'application/json',
                    authorization:localStorage.getItem('token')
                }
            }
            const response=await axios.request(options)
            setProblem(response.data)
        }
        catch(error){
            console.log("Error while fetching problems="+error);
        }
    }

     const handleExecution=async()=>{
        setStatus("Loading...")
        try{
            const options={
                method:'POST',
                url:API_URL+'/admin/submit/problems/execute/'+id,
                headers:{
                    'Content-Type':'application/json',
                    authorization:localStorage.getItem('token')
                },
                data:{
                    code:{code}
                }
                }
        
                const response = await axios.request(options);

                if(response.data.length>0){
                    setData(response.data)
                    console.log("data aaya hai backend se")
                    console.log(data)
                }
            else{
                alert("There is some error in your code")
            }
                setStatus("Submit");
        }
        catch(error){
            console.error("Error while submitting problem is="+error)
            setStatus("Submit")
        }
     }


    const handlecodeChange=(e:React.ChangeEvent<HTMLTextAreaElement>)=>{
        setCode(e.target.value)
    }


       
    
    return(
        <>
        <Navbar></Navbar>
        <div className='app__particular'>
        <div className="app__particular-container">
            <div className='app__particular-info1'>
                <h1>{(problem as { title: string }).title}</h1>
                <pre>{(problem as { description: string }).description}</pre>
                <br />
                <pre>Note: If code snippet is not displayed in the code editor. Use this! Else it will not work</pre>
                <pre>Code Snippet: {(problem as {codeSnippet:string}).codeSnippet}</pre>
            </div>
            <div className='app__particular-info2'>
                <div className='code'>
                    <h2>Code Editor(Java)</h2>
                <textarea onChange={handlecodeChange}>{(problem as {codeSnippet:string}).codeSnippet}</textarea>
                </div>
                <div className='testcase'>
                    <h2>Testcases</h2>
                    <table>
                        <thead>
                            <tr>
                            <th>Input</th>
                            <th>Expected Output</th>
                            <th>Output</th>
                            <th>Status</th>
                            </tr>
                        </thead>
                       {Array.isArray(data) && data.length>0 && (
                        <tbody>
                            {
                                data.map((d:{input:object,output:string,expectedOutput:string})=>(
                                    <Child
                                    input={d.input}
                                    output={d.output}
                                    expectedOutput={d.expectedOutput}
                                    />
                                ))
                            }
                        </tbody>
)}
                    </table>
                </div>
            </div>
            </div>
            <div className='app__particular-button'>
            <button onClick={handleExecution}>{status}</button>
            </div>
            
            </div>
        </>    
    )

}



function Child({input, output, expectedOutput}: {input: object, output: string, expectedOutput: string}) {
    const input1 = JSON.stringify(input);
    const modifiedInput = input1.substring(1, input1.length - 1);
    if (output) {
        return (
            <>
                <tr>
                    <td>{modifiedInput}</td>
                    <td>{expectedOutput}</td>
                    <td>{output}</td>
                    <td style={{ color: output === expectedOutput ? "green" : "red" }}>
                        {output === expectedOutput ? "Accepted" : "Wrong Answer"}
                    </td>
                </tr>
            </>
        );
    }
}

export default Particular;