import express from "express";

const app = express();
const port = 9000;
app.use("/",(req,res)=>{
    res.json({message: "hello world"})
})

app.listen(9000, ()=> {
    console.log(`server running on ${port}`)
})