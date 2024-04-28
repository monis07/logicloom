import express,{Request,Response} from "express"
import {Admin,Problem} from '../db/data'
import jwt from 'jsonwebtoken'
const SECRET = process.env.SECRET_KEY || 'secret';
import authenticateJwt from '../middleware/middleware'
import axios from 'axios'
const router =express.Router();


//Admin signup
router.post('/signup',(req:Request,res:Response)=>{
    const {username,password}=req.body;
    Admin.findOne({username:username}).then((admin)=>{
        if(admin){
            res.status(400).send("Admin already exists. Please select a different username")
        }else{
            const newAdmin = new Admin({username,password})
            newAdmin.save().then(()=>{
                res.status(201).send("Admin created successfully.Please login to continue")
            })
        }
    })
})

//Admin signin
router.post('/signin',(req:Request,res:Response)=>{
    const {username,password}=req.body;
    Admin.findOne({username:username,password:password}).then((admin)=>{
        if(admin){
            const token = jwt.sign({username:admin.username},SECRET,{expiresIn:'1h'})
            res.status(200).json({msg:"Logged in Successfully",token:token})
        }
        else{
            res.status(401).send("Invalid username or password")
        }
    })

})

//Problem list
router.get('/problems',authenticateJwt,(req:Request,res:Response)=>{
    Problem.find().then((problems)=>{
        if(problems.length !== 0)
        res.status(200).json(problems)
    else{
        res.send("No problems found!!")
    }
    })
})


//Particular problem
router.get('/problems/:id',authenticateJwt,(req:Request,res:Response)=>{
    const id = req.params.id;
    Problem.findById(id).then((problem)=>{
        res.status(200).json(problem)
    })
})

router.post('/submit/problems/execute/:id', async (req, res) => {
    console.log("Hi from execute route")
    const finalresult:any=[];
    const frontendCode = req.body.code;
    const language = req.body.language;
    const id=req.params.id;
        
        const stdinput:any=await Problem.findById(id).then((problem)=>{
            const testcases=problem?.testcases;
            return testcases;
        }).then(data=>data)
        console.log(stdinput)


        for(let testCase of stdinput){
            const frontend_modified=`
            import java.io.*;
            import java.util.*;
            public class Main{
            ${frontendCode}
            public static void main(String args[]){
            int a[]={${testCase.nums}};
            int arr[]=twoSum(a,${testCase.target});
            String output=Arrays.toString(arr);
            System.out.println(output);
                }
            }`

            const frontend_encoded:String=btoa(frontend_modified);

            const options = {
                method: 'POST',
                url: 'https://judge0-ce.p.rapidapi.com/submissions',
                params: {
                  base64_encoded: 'true',
                  fields: '*'
                },
                headers: {
                  'content-type': 'application/json',
                  'Content-Type': 'application/json',
                  'X-RapidAPI-Key': '2d4e6fd131mshbb9fc449b075b36p131830jsn8a3f8c4f05f8',
                  'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
                },
                data: {
                  language_id: language,
                  source_code: frontend_encoded,
                }
              };
            const response = await axios.request(options);
            console.log("Token is="+response.data.token);

            const newUrl='https://judge0-ce.p.rapidapi.com/submissions/'+response.data.token;
            console.log(newUrl);

            let status=null;
            while(status==null || status===1 || status===2){
                const options1 = {
                    method: 'GET',
                    url: newUrl,
                    headers: {
                      'X-RapidAPI-Key': '2d4e6fd131mshbb9fc449b075b36p131830jsn8a3f8c4f05f8',
                      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
                    }
                  }
                const response1 = await axios.request(options1);
                console.log(response1.data);
                status=response1.data.status.id;
                if(status===1 || status===2){
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    console.log("Waiting for 1 sec and then going again")
                }
                
            }

            const options1 = {
                method: 'GET',
                url: newUrl,
                headers: {
                  'X-RapidAPI-Key': '2d4e6fd131mshbb9fc449b075b36p131830jsn8a3f8c4f05f8',
                  'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
                }
              }
                  const response1 = await axios.request(options1); 
                  console.log(response1.data);
                  const output=response1.data.stdout.trim();
                  const finalStatus=response1.data.status.description;
                  const result={
                    output:output,
                    finalStatus:finalStatus,
                    expectedOutput:testCase.expectedOutput
                  }
                  finalresult.push(result);
        }  
        res.status(200).send(finalresult);        
    });
export default router;