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
    console.log(products);


    const collection = db.collection('products');
    const result = collection.insertMany(products);

    console.log(result);

    async function query1(){
        const collection = db.collection('products');
        const query = await collection.find({'price':{$lt : 79}}); // ici je fais la requete donc await car javascript doit attendre 
        // de recup la query avant de terminer
        console.log("$",query);
    
    }
    
console.log("QUERY1");
query1();
}

debut();





    










