import express from "express";

const app = express();
const port = 9000;

app.listen(9000, ()=> {
    console.log(`server running on ${port}`)
})