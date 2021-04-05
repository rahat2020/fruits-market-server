const express = require('express')
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
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
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("fruits").collection("Items");
  const itemsCollection = client.db("fruits").collection("ItemsOrder");
  
app.post('/addProduct', (req, res) =>{
  const product = req.body;
  console.log(product)
  console.log('add product responsed', product)
  productCollection.insertOne(product)
  .then(result => {
    console.log(result.insertedCount > 0);
    res.send(result.insertedCount > 0)
  })
})

app.post('/itemOrdered', (req, res) =>{
  const product = req.body;
  console.log(product)
  console.log('add product responsed', product)
  itemsCollection.insertOne(product)
  .then(result => {
    console.log(result.insertedCount > 0);
    res.send(result.insertedCount > 0)
  })
})

app.get('/products', (req, res) =>{
  productCollection.find({id:req.params.id})
  .toArray((err, documents) =>{
    res.send(documents);
  })
})

app.get('/product/:id', (req, res) =>{
  productCollection.find({_id:req.params.id})
  .toArray((err, documents) =>{
    res.send(documents);
  })
})

app.get('/ordered', (req, res) =>{
  itemsCollection.find({email: req.query.email})
  .toArray((err, documents) =>{
    res.send(documents)
  })
})

app.delete('/deleteItems/:id', (req, res) => {
  const id = ObjectID(req.params.id);
  productCollection.findOneAndDelete({_id: id})
  .then((err, result) => {
    console.log(result)
    result.deletedCount > 0
  })
  // const id = ObjectID(req.params.id);
  // console.log('delete this item from here', id);
  // productCollection.findOneAndDelete({_id: id})
  // .then(documents => 
  // res.send(!!documents.value))
})
  console.log('database connected successfully')
 
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})