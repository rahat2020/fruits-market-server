const express = require('express')
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;

const app = express()
require('dotenv').config()

const port =process.env.PORT || 3300

app.use(cors());
app.use(express.urlencoded({extended: false}))
app.use(express.json())
console.log(process.env.DB_USER)


app.get('/', (req, res) => {
  res.send('Hello World!')
})
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2ixqz.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("fruits").collection("Items");
  
  app.post('/addProduct', (req, res) =>{
    const product = req.body;
    productCollection.insertMany(product)
    .then(result => {
      console.log(result.insertedCount);
      res.send(result.insertedCount)
    })
  })

  app.get('/products', (req, res) =>{
    productCollection.find({})
    .toArray((err, documents) =>{
      res.send(documents);
    })
  })

  console.log('database connected successfully')
 
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})