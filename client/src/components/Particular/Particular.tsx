import { useState,useEffect } from 'react'
import './particular.scss'
import axios from 'axios'
import { useParams } from 'react-router-dom'

function Particular(){
    const [problem,setProblem]=useState({})
    const [code,setCode]=useState("")
    const [testcases, setTestcases] = useState([])
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
                url:'http://localhost:3000/admin/problems/'+id,
                headers:{
                    'Content-Type':'application/json',
                    authorization:localStorage.getItem('token')
                }
            }
            const response=await axios.request(options)
            setProblem(response.data)
            console.log(response.data.testcases)
            setTestcases(response.data.testcases)
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
                url:'http://localhost:3000/admin/submit/problems/execute/'+id,
                data:{
                    code:{code}
                }
                }
        
                const response= await axios.request(options)
                response.then((data)=>{
                    setData(data.data)
                    console.log(data)
                })
                setStatus("Submit")
        }
        catch(error){
            console.log("Error while submitting problem is="+error)
            setStatus("Submit")
        }
     }


    const handlecodeChange=(e:React.ChangeEvent<HTMLTextAreaElement>)=>{
        setCode(e.target.value)
        console.log(code);
        console.log(problem.codeSnippet)
    }

    const combinedProps = [
        ...testcases.map((testcase: { input: object }) => ({
          input: testcase.input
        })),
        ...data.map((d: { output: string,expectedOutput: string,input:object
        }) => ({
          input:d.input,
          output: d.output,
          expectedOutput: d.expectedOutput
        }))
      ];
      console.log(combinedProps)
    return(
        <>
        <div className='app__particular'>
        <div className="app__particular-container">
            <div className='app__particular-info1'>
                <h1>{problem.title}</h1>
                <pre>{problem.description}</pre>
                <br />
                <pre>Note: If code snippet is not displayed in the code editor. Use this! Else it will not work</pre>
                <pre>Code Snippet: {problem.codeSnippet}</pre>
            </div>
            <div className='app__particular-info2'>
                <div className='code'>
                    <h2>Code Editor(Java)</h2>
                <textarea onChange={handlecodeChange}>{problem.codeSnippet}</textarea>
                </div>
                <div className='testcase'>
                    <h2>Testcases</h2>
                    <table>
                        <thead>
                            <th>Input</th>
                            <th>Expected Output</th>
                            <th>Output</th>
                            <th>Status</th>
                        </thead>
                        <tbody>
                             {combinedProps.map((props)=>(
                                <Child {...props}/>
                            ))}
                            {/* {data.map((d:{output:string})=>(
                                <Child output={d.output}/>
                            ))} */}
                        </tbody>
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

function Child(props){
    const input=JSON.stringify(props.input)
    console.log(input)
    if(props.output !== undefined)
        {
            return(
                <>
                <tr>
                    <td>{input}</td>
                    <td>{props.expectedOutput}</td>
                    <td>{props.output}</td>
                    <td>{props.output == props.expectedOutput ? "Accepted" : "Wrong Answer"}</td>
                </tr>
                </>
            )
        }
}

export default Particular;