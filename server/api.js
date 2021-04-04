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
  
  let limit = parseInt(request.query.limit);
  let brand = request.query.brand;
  let price = parseInt(request.query.price);
  console.log(limit);
  console.log(brand);
  console.log(price);
  let res = await db.filteredproducts(limit, brand, price);

  response.send({
    'limit' : limit,
    'results' : res
  });
})



app.get('/search', async(req, response) => {
  try{
    let res;
    let meta;
  if(req.query.brand){
    res = await db.findPage(parseInt(req.query.page),parseInt(req.query.size),{'brand': req.query.brand});
    meta = await db.getMeta(parseInt(req.query.page),parseInt(req.query.size),{'brand': req.query.brand});
  }
  else{
    res = await db.findPage(parseInt(req.query.page),parseInt(req.query.size));
    meta = await db.getMeta(parseInt(req.query.page),parseInt(req.query.size));
  }
  
  
  let products = {
    "success" : true,
    "data" : {
    "result" : res,
    "meta": meta
      }}
  response.send(products);

    
  }catch(e){
    response.send(e)
  }
})




app.get('/products/:id', async (request, response)=> {
  response.send( await db.findById(request.params.id))
})



app.get('', async (req, response) => {
  console.log("was requested pagination");
  let res = await db.findPage(parseInt(req.query.page),parseInt(req.query.size))
  let meta = await db.getMeta(parseInt(req.query.page),parseInt(req.query.size))
  let products = {
    "success" : true,
    "data" : {
    "result" : res,
    //"meta" : {"currentPage":req.query.page,"pageCount":?,"pageSize":res.length,"count":?}
    "meta": meta
      }

  }
  response.send(products);
  
});

app.listen(PORT);
console.log(`📡 Running on port ${PORT}`);





