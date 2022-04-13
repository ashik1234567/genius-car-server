 const express = require('express')
 const { MongoClient, ServerApiVersion } = require('mongodb');
 const ObjectId = require('mongodb').ObjectId;

 const cors = require('cors')
 require('dotenv').config()

 const app = express();
 const port = process.env.PORT || 5000;

 //middleware
 app.use(cors())
 app.use(express.json());

 const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yzfgf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

 async function run(){
     try{

        await client.connect();
        const database = client.db('carMechanic');
        const servicesCollection = database.collection('services');

        // GET API
        app.get('/services', async(req,res) =>{
            const cursor = servicesCollection.find({}); // empty query load all the options
            const services = await cursor.toArray();
            res.send(services);
        })

        // post API
        app.post('/services' , async(req,res)=>{
            const service = req.body; // data come here from ui BODY
            console.log("hit the api",service)
            const result  = await servicesCollection.insertOne(service)
            res.json(result)
        })

        // GET single services
        app.get('/services/:id', async(req,res) =>{
            const id = req.params.id
            console.log("This is service")
            const query = {_id: ObjectId(id)}
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })
        
        // Delete API 
        app.delete('/services/:id', async(req,res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result  = await servicesCollection.deleteOne(query)
            res.json(result)
        })
        
     }
     finally{
         //await client.close()
     }
 }
 run().catch(console.dir)

 app.get('/',(req,res) => {
     res.send('Hello This is serverrr')
 })

 app.listen(port, () => {
     console.log('Running the server on port: ', port)
 })