const express = require("express");
const {MongoClient} = require("mongodb");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

let db;

client.connect().then(()=>{
    db = client.db("book_store");
    console.log("MongoDB Connected");
});


/* SEARCH BOOK BY TITLE */

app.get("/books/search", async(req,res)=>{

const title = req.query.title;

const books = await db.collection("books")
.find({title:{$regex:title,$options:"i"}})
.toArray();

res.send(books);

});


/* FILTER BY CATEGORY */

app.get("/books/category/:category", async(req,res)=>{

const category = req.params.category;

const books = await db.collection("books")
.find({category:category})
.toArray();

res.send(books);

});


/* SORT BY PRICE */

app.get("/books/sort/price", async(req,res)=>{

const books = await db.collection("books")
.find()
.sort({price:1})
.toArray();

res.send(books);

});


/* SORT BY RATING */

app.get("/books/sort/rating", async(req,res)=>{

const books = await db.collection("books")
.find()
.sort({rating:-1})
.toArray();

res.send(books);

});


/* TOP RATED */

app.get("/books/top", async(req,res)=>{

const books = await db.collection("books")
.find({rating:{$gte:4}})
.limit(5)
.toArray();

res.send(books);

});


/* PAGINATION */

app.get("/books", async(req,res)=>{

const page = parseInt(req.query.page) || 1;

const limit = 5;

const books = await db.collection("books")
.find()
.skip((page-1)*limit)
.limit(limit)
.toArray();

res.send(books);

});


app.listen(3000, ()=>{
console.log("Server running on port 3000");
});