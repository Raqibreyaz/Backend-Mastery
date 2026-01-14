import express from 'express'

const app = express()

app.get('/',(req,res)=>{
    res.end("welcome to get home!")
})
app.post('/',(req,res)=>{
    res.end("welcome to post home!")
})
app.put('/',(req,res)=>{
    res.end("welcome to put home!")
})
app.patch('/',(req,res)=>{
    res.end("welcome to patch home!")
})
app.delete('/',(req,res)=>{
    res.end("welcome to delete home!")
})

app.listen(4000)