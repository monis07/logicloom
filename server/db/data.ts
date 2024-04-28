import mongoose from 'mongoose'

const adminSchema=new mongoose.Schema({
    username:String,
    password:String,
    problem:[{
        _id:mongoose.Schema.Types.ObjectId,
        status:{type:String,default:"Not Solved"},
        code:{type:String,default:""}
    }]
})

const problemSchema =new mongoose.Schema({
    title:String,
    difficulty:String,
    description:String,
    codeSnippet:String,
    testcases:[{
        input:Object,
        expectedOutput:String
    }]
})



export const Admin=mongoose.model('Admin',adminSchema);
export const Problem = mongoose.model('Problem',problemSchema)
