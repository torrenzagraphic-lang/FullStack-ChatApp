import express from 'express';
import "dotenv/config"
const app = express()


app.get("/",(req, res)=>{
    res.send("Hello From backend")
})


app.listen(3000, ()=>{
    console.log("Server is running on port 3000")
})