import express from 'express'
import mongoose from 'mongoose';
import cors from "cors"
import bodyparser from 'body-parser'

import adminRouter from './routes/admin'

const port =3000
const url=process.env.MONGO_DB_URL || ''
const app=express();
app.use(express.json());
app.use(bodyparser.json())

app.use(cors()); 
app.use('/admin',adminRouter)

app.listen(port,()=>{
    console.log("Server is listening on port "+port)
})

mongoose.connect(url,{dbName:'leetcode-clone'})

