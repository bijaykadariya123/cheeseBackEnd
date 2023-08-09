// import our dependencies: 
require("dotenv").config()                                  //1
// pull port from .env give default value                   //2
const {PORT =5000, DATABASE_URL}= process.env

const express = require("express");                         //3
const app = express()                                       //4
const mongoose=require("mongoose")                          //7
const cors = require("cors")
const morgan = require("morgan")





//Establishing the connection:                              //8
mongoose.connect(DATABASE_URL)
//Connection event:
mongoose.connection
.on("open", ()=>console.log("You are connected to mongoose"))
.on("clse", ()=>console.log("You are Disconnected  to mongoose"))
.on("error", (error)=>console.log(error))

// MODELS                                                   //10
const cheeseSchema = new mongoose.Schema({
name: String,
countryOfOrigin: String,
image: String

})

const Cheese = mongoose.model("cheese", cheeseSchema)

// MIddelWare                                               //9
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())


//ROUTES                                                    //5
// create a test Route:
// app.get("/", (req, res)=>{
//     res.json({hello: "World"})
// })

// INDEX: - GET "/"                                         //11-1
app.get("/", async(req,res)=>{
    try{
        //fetch all cheese from database:
        const allCheese = await Cheese.find({})
        res.json(allCheese)
    }
    catch(error){
        res.status(400).json({error})
    }
})

// CREATE: - POST- "/"                                      //12-2
app.post("/", async(req, res)=>{
    try{
        // create on cheese:
        const oneCheese = await Cheese.create(req.body)
        res.json(oneCheese)
    }
    catch(error){
        res.status(400).json({error})
    }
})
// SHOW: GET; "/:id" - get a individual cheese              //13-3
app.get("/:id", async(req, res)=>{
    try{
        const id = req.params.id
        const oneCheese= await Cheese.findById(id);
        res.json(oneCheese)
    }
    catch(error){
        res.status(400).json({error})
    }   
})

// UPDATE - PUT - "/:id" - update a cheese           //14-4

app.put("/:id", async(req,res)=>{
    try{
        const id= req.params.id
        const oneCheese = await Cheese.findByIdAndUpdate(id, req.body,{new:true})
        res.json(oneCheese)
    }
    catch(error){
        res.status(400).json(error)
    }
})

// DESTROY - DELETE - "/:id" - delete a cheese
app.delete("/:id", async(req, res)=>{
    try{
        const id = req.params.id
        const oneCheese = await Cheese.findByIdAndDelete(id)
        res.status(204).json(oneCheese)
    }
    catch(error){
        res.status(400).json(error)
    }
})



//LISTENER:                                                 //6
app.listen(PORT, ()=>console.log(`${PORT} is running`))
