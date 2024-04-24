import jwt from 'jsonwebtoken'
import {Request,Response,NextFunction} from 'express'
const SECRET = process.env.SECRET_KEY || 'secret';

export default function authenticateJwt(req:Request,res:Response,next:NextFunction){
    const token = req.headers.authorization;
    console.log(token)
    if(token){
        jwt.verify(token,SECRET,(err,decoded)=>{
            if(err){
                res.status(401).send("Something went wrong")
            }
            else{
                next();
            }
        })
    }

}