import express,{Request,Response} from "express"
import {Admin,Problem} from '../db/data'
import jwt from 'jsonwebtoken'
const SECRET = process.env.SECRET_KEY || 'secret';
import authenticateJwt from '../middleware/middleware'
import axios,{AxiosResponse}from 'axios'
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

router.post('/submit/problems/execute/:id', authenticateJwt,async (req, res) => {
    const finalresult:any=[];
    const frontendCode = req.body.code.code;
    console.log(frontendCode)
    const language = 62;
    const id=req.params.id;
        
    const stdinput:any=await Problem.findById(id).then((problem)=>{
            const testcases=problem?.testcases;
            return testcases;
        }).then(data=>data)
        console.log(stdinput)


        for(let testCase of stdinput){
          let frontend_modified:string='';

          if(id === '6624f59f8144212dd0b104e4'){
            frontend_modified=`
            import java.io.*;
            import java.util.*;
            public class Main{
            ${frontendCode}
            public static void main(String args[]){
            int a[]={${testCase.input.nums}};
            int arr[]=twoSum(a,${testCase.input.target});
            String output=Arrays.toString(arr);
            System.out.println(output);
                }
            }`

          }
          else if(id === '662ccb15270ad8b7980447ea')
            {
            frontend_modified=`
            import java.io.*;
            import java.util.*;
            public class Main{
            ${frontendCode}
            public static void main(String args[]){
            String str="${testCase.input.s}";
            int result=lengthOfLongestSubstring(str);
            String output = Integer.toString(result);
            System.out.println(output);
                }
            }`

          }
          else if(id === '662ccc89270ad8b7980447ed'){
            frontend_modified=`
            import java.io.*;
            import java.util.*;
            public class Main{
            ${frontendCode}
            public static void main(String args[]){
              String s="${testCase.input.s}";
              String p="${testCase.input.p}";
            boolean result=isMatch(s,p);
            String output = String.valueOf(result);
            System.out.println(output);
                }
            }`

          }

          console.log(frontend_modified);
            

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

              let response:AxiosResponse | null=null;

              try{
                response = await axios.request(options);
              }
              catch(error){
                console.error("Error while fetching token="+error)
              }

              let newUrl;

              if(response){
            newUrl='https://judge0-ce.p.rapidapi.com/submissions/'+response.data.token;
            console.log(newUrl);
              }
              else{
                console.log("Response is null")
              }
                

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

                  let response1:AxiosResponse|null =null;
                  try{
                    response1 = await axios.request(options1);
                  }
                  catch(error){
                    console.error("Error while executing and checking status="+error)
                  }
                  if(response1){
                    status=response1.data.status.id;
                    if(status===1 || status===2){
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        console.log("Waiting for 1 sec and then going again")
                    }
                  }
                  else{
                        console.log("Response is null")
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

              let response1:AxiosResponse|null =null;
              try{
                response1 = await axios.request(options1); 
              }
              catch(error){
                console.error("Error while fetching output="+error)
              }
              if(response1?.data.stdout){
                  const output=response1.data.stdout.trim();
                  const finalStatus=response1.data.status.description;
                  const result={
                    input:testCase.input,
                    output:output,
                    finalStatus:finalStatus,
                    expectedOutput:testCase.expectedOutput
                  }
                  finalresult.push(result);
                }
                else{
                    console.log("Response1 is null while fetching final output")
                }
        }  
         res.status(200).send(finalresult);        
    });
export default router;