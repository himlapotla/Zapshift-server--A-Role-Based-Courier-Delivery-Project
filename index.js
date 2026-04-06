const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 3000

// MongoClient - the main tool used to connect to your MongoDB database
const { MongoClient, ServerApiVersion } = require('mongodb')

app.use(express.json())
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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const db = client.db("zap_shift_db")
    const parcelCollection = db.collection('parcels')


    // api's from here -- 
    app.post('/parcels', async(req, res) => {
      const parcel = req.body
      const result = await parcelCollection.insertOne(parcel)
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
