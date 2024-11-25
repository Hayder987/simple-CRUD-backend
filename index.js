const express = require('express')
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());


//hayderbd4290
//LHUylyT77tzvOoJh

app.get("/", (req, res)=>{
    res.send("hello world")
})




const uri = "mongodb+srv://hayderbd4290:LHUylyT77tzvOoJh@cluster0.jheyv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("crudDB");
    const userCollection = database.collection("user");

    app.get('/users', async(req, res)=>{
        const users = userCollection.find()
        const result = await users.toArray()
        res.send(result)
    })

    app.get('/users/:id', async(req, res)=>{
        const id = req.params.id;
        const find = {_id: new ObjectId(id)}
        const user = await userCollection.findOne(find)
        res.send(user)
    })

    app.post('/users', async(req, res)=>{
        const user = req.body;
        console.log(user)
        const result = await userCollection.insertOne(user);
        res.send(result)
    })

    app.put('/users/:id', async(req, res)=>{
        const id = req.params.id;
        const data = req.body;
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };
        const updateUser = {
            $set: {
              name: data.name,
              email : data.email
            },
          };
        const result = await userCollection.updateOne(filter, updateUser, options)
        res.send(result)
    })

    app.delete("/users/:id", async(req, res)=>{
          const id = req.params.id;
          const find = {_id: new ObjectId(id)}
          const result = await userCollection.deleteOne(find)
          res.send(result);
    })

    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port, ()=>{
    console.log(`Running Port: ${port}`)
})
