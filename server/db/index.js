require('dotenv').config();
const {MongoClient} = require('mongodb');
const fs = require('fs');

const MONGODB_DB_NAME = 'clear';
const MONGODB_COLLECTION = 'test3';
const MONGODB_URI = 'mongodb+srv://louloulepou:louloulepou123@cluster0.zxrqe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

let client = null;
let database = null;

/**
 * Get db connection
 * @type {MongoClient}
 */
const getDB = module.exports.getDB = async () => {
  try {
    if (database) {
      return database;
    }

    client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    database = client.db(MONGODB_DB_NAME);

    console.log('💽  Connected');

    return database;
  } catch (error) {
    console.error('🚨 MongoClient.connect...', error);
    return null;
  }
};

/**
 * Insert list of products
 * @param  {Array}  products
 * @return {Object}
 */
module.exports.insert = async products => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    const result = await collection.insertMany(products);

    return result;
  } catch (error) {
    console.error('🚨 collection.insertMany...', error);
    fs.writeFileSync('products.json', JSON.stringify(products));
    return {
      'insertedCount': 0
    };
  }
};

/**
 * Find products based on query
 * @param  {Array}  query
 * @return {Array}
 */
module.exports.find = async query => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    const result = await collection.find(query).toArray();

    return result;
  } catch (error) {
    console.error('🚨 collection.find...', error);
    return null;
  }
};


module.exports.findById = async id => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    const result = await collection.find({'_id':id}).toArray();

    return result;

  } catch (error) {
    console.error('collection.find..', error);
    return null;
  }
}


module.exports.filteredproducts = async (limit, brand, price) => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    const result = await collection.find({'brand':brand,'price':{$lte:price}}).limit(limit).toArray();

    return result;
  } catch (error) {
    console.error('collection.find..', error);
    return null;
  }
}

module.exports.getMeta = async(page, size,query=null ) => {
  const db = await getDB();
  const collection = db.collection(MONGODB_COLLECTION);
  let count;
  if (query==null){
    count = await collection.count();
  }
  else{
    count = await collection.find(query).count();
  }
  
  const pageCount = Math.ceil(count/size);
  return {"currentPage" : page,"pageCount":pageCount,"pageSize":size,"count":count} 
}

module.exports.findPage = async (page,size,query=null) => {
  try {
    const db = await getDB();
    const collection = db.collection(MONGODB_COLLECTION);
    const offset = page ? page * size : 0;
    let result;
    if(query==undefined){
      result = await collection.find({}).skip(offset)
                  .limit(size).toArray(); 
    }else{
      result = await collection.find(query).skip(offset)
                  .limit(size).toArray(); 
    }
    
    return result;
  } catch (error) {
    console.error('🚨 collection.findPage...', error);
    return null;
  }
};


/**
 * Close the connection
 */
module.exports.close = async () => {
  try {
    await client.close();
  } catch (error) {
    console.error('🚨 MongoClient.close...', error);
  }
};
