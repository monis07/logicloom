import mongoose from 'mongoose'

const adminSchema=new mongoose.Schema({
    username:String,
    password:String
})

const problemSchema =new mongoose.Schema({
    status:Boolean,
    title:String,
    difficulty:String,
    description:String,
    codeSnippet:String,
    testcases:[{
        nums:Array,
        target:Number,
        expectedOutput:String
    }]
})



export const Admin=mongoose.model('Admin',adminSchema);
export const Problem = mongoose.model('Problem',problemSchema)
