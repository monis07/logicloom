import express from 'express'
import mongoose from 'mongoose';
import cors from "cors"
import bodyparser from 'body-parser'

import adminRouter from './routes/admin'

const port =3000

const app=express();
app.use(express.json());
app.use(bodyparser.json())
app.use(cors({
    origin:'*'
}))
app.use('/admin',adminRouter)

app.listen(port,()=>{
    console.log("Server is listening on port "+port)
})

mongoose.connect('mongodb+srv://monisazeem:monisazeem@cluster0.94aobgx.mongodb.net/',{dbName:'leetcode-clone'})

