const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const db = require('./db');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const MONGODB_COLLECTION = 'prod';



const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});


app.get('/products/search', async (request, response)=> {
  
  console.log(request.query);
  
  let limit = parseInt(request.params.limit);
  let brand = request.params.brand;
  let price = parseInt(request.params.price);
  console.log(limit);


  let res = await db.filteredproducts(limit, brand, price);

  response.send({
    'limit' : limit,
    'results' : res
  });
})

app.get('/products', async (request, response)=> {
  response.send( await db.find({}));
})



app.get('/products/:id', async (request, response)=> {
  response.send( await db.findById(request.params.id))
})



app.listen(PORT);
console.log(`📡 Running on port ${PORT}`);





