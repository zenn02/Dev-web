import { MongoClient } from "mongodb";
27017
const uri = "mongodb://admin:admin@127.0.0.1:71026/devweb2";


const getMongoConn = async () =>{
    const client = new MongoClient(uri);
    const conn = await client.connect();
    return conn;
} 

export default getMongoConn;