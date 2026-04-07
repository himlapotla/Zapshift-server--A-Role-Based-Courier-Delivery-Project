const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 3000

// MongoClient - the main tool used to connect to your MongoDB database
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')

app.use(express.json())
// This middleware:
// Sees Content-Type: application/json in the request header
// Reads the raw JSON string from the request body
// Runs JSON.parse() on it
// Attaches the result to req.body.
// So req.body becomes a plain JavaScript object — ready to use.
app.use(cors())

// database connection string
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oj9o1yk.mongodb.net/?appName=Cluster0`

// it as creating a "messenger = client" that knows where my database is (uri) and how to talk to it
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
})

async function run() {
  try {
    // Connect the client to the server.	(optional starting in v4.7)
    await client.connect();

    const db = client.db("zap_shift_db")
    const parcelCollection = db.collection('parcels')


    // api's from here (users parcel related) -- 
    app.get('/my-parcels', async (req, res) => {
      // URL query string (after ?)
      const { email } = req.query
      const option = { sort: { createdAt : -1 } }
      const cursor = await parcelCollection.find({ senderEmail : email }, option).toArray()
      res.send(cursor)
    })

    app.get('/one-parcel/:id', async(req, res) => {
      //  URL path
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await parcelCollection.findOne(query)
      res.send(result)
    })

    app.post('/post-parcels', async (req, res) => {
      const parcel = req.body
      parcel.createdAt = new Date()
      const result = await parcelCollection.insertOne(parcel)
      res.send(result)
    })

    app.delete('/delete-parcels/:id', async(req, res) => {
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await parcelCollection.deleteOne(query)
      res.send(result)
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }
  finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Zap is Shifting..!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
