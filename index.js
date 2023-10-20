const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

// ecommerce
// 3iOc5bbSsgSvMhux




const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_KEY}@cluster0.lyzjy.mongodb.net/?retryWrites=true&w=majority`;

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

    
    const cardCollection = client.db('cardsDB').collection('cards')
    const myCardDatabase = client.db("myCardDB").collection('myCard')
    


//  data server to client

    app.get('/cards', async(req, res) =>{
      let query = {};
      if(req.query?.brand_name){
        query= {brand_name:req.query.brand_name}
      }
        const result = await cardCollection.find(query).toArray();
        res.send(result);
    })

  
    // brand card details
  

    app.get('/cards/:brand_name', async(req, res) =>{
      const brandName = req.params.brand_name; 
      console.log(brandName);
      const filter = {brand_name: brandName};
      const result = await cardCollection.find(filter).toArray();
      res.send(result);

    })

    // card details

    app.get('/details/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await cardCollection.findOne(query);
      res.send(result);
      console.log(result);
    })


        // update handle

    app.get('/updates/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await cardCollection.findOne(query)
      res.send(result)
    })



    app.put('/updates/:id', async (req, res) =>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true}
      const updateCoffe = req.body;
      const update = {
        $set :{
         
          brand_name: updateCoffe.brand_name,
          name: updateCoffe.name,
          type: updateCoffe.type,
          price: updateCoffe.price,
          rating: updateCoffe.rating,
          description: updateCoffe.description,
          photo: updateCoffe.photo
        
          
        }
      }
      const result = await cardCollection.updateOne(filter, update, options)
      res.send(result)
    })



    // Add to product


    app.post('/cards', async(req, res) => {
        const newCards = req.body;
        console.log(newCards);

        const result = await cardCollection.insertOne(newCards);
        res.send(result);
    })

    // add to card
   
    app.get('/cart', async ( req, res ) => {
      const result = await myCardDatabase.find().toArray();
      res.send(result);
    })

    app.post('/cart', async ( req, res ) => {
      const product = req.body;
      const result = await myCardDatabase.insertOne(product)
      res.send(result);
    })



    // delete items

    app.delete('/cart/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await myCardDatabase.deleteOne(query)
      res.send(result)
    })
   


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);







app.get('/', (req, res) => {
    res.send('This si product home section')
  })
  



 
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })





