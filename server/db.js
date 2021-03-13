"Here we are connecting to our mongodb cluster, to load the fetch product in our cluster"

const {MongoClient} = require('mongodb');
const MONGODB_URI = 'mongodb+srv://louloulepou:louloulepou123@cluster0.zxrqe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const MONGODB_DB_NAME = 'ClearFashion';

async function debut(){
    const client = await MongoClient.connect(MONGODB_URI, {'useNewUrlParser': true});
    const db = client.db(MONGODB_DB_NAME);

    const dedicatedbrand = require('./sources/dedicatedbrand');
    async function sandbox () {
    try {
        eshop = 'https://www.dedicatedbrand.com/en/men/news';
        const products = await dedicatedbrand.scrape(eshop);
        console.log(products);
        console.log('done');
        return products
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
    }

    const products= await sandbox();
    

/*
    const collection = db.collection('products');
    const result = collection.insertMany(products);*/

"we put the insertMany into /**/ because if we let this function the database will receive again the same function"


    async function q1 (){
        try{


            const brand = "dedicated";
            const collection = db.collection('products');
            const query = await collection.find({brand}).toArray();
            console.log(`-- Products of the brand ${brand} --`)   
            console.log(query);
        }catch(e){
            console.error(e);
            process.exit(1);
        }
    }

    async function q2 (){
        try{
            
            const collection = db.collection('products');
            const maxprice = 60;
            const query = await collection.find({price: {$lt : maxprice}}).toArray();     
            console.log(`price under ${maxprice} --`);
            console.log(query);
        }catch(e){
            console.error(e);
            process.exit(1);
        }
    }

    async function q3 (){
        try{
            const collection = db.collection('products');
            const query = await collection.find({}).sort({ price : -1}).toArray();     
            console.log(`sorted by price`);
            console.log(query);
        }catch(e){
            console.error(e);
            process.exit(1);
        }
    }
    console.log("Query 1 :");
    q1();
    console.log("Query 2 :");
    q2();
    console.log("Query 3 : ");
    q3();
  

}

debut();






    










