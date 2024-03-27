
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
const app=express();
const port=5000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/random",(req,res)=>{
    const randomquote=Math.floor(Math.random()*quotes.length);
    console.log(quotes[randomquote]);
    var r=JSON.stringify(quotes[randomquote]);
    res.send(r);
});
app.listen(port,()=>{
    console.log("listening bro");
});
var quotes=[
    {
        id: 1,
        quoteText:"The more that you read, the more things you will know. The more that you learn, the more places you’ll go.",
        quoteAuthor:"Dr. Seuss",
    },
    {
        id: 2,
        quoteText:"Books are a uniquely portable magic.",
        quoteAuthor:"Stephen King",
    },
    {
        id: 3,
        quoteText:"I kept always two books in my pocket, one to read, one to write in.",
        quoteAuthor:"Robert Louis Stevenson",
    },
    {
        id: 4,
        quoteText:"There is more treasure in books than in all the pirate’s loot on Treasure Island.",
        quoteAuthor:"Walt Disney",
    },
    {
        id:5,
        quoteText:"Classic’ – a book which people praise and don’t read.",
        quoteAuthor:"Mark Twain",
    },
    {
        id:6,
        quoteText:"I find television very educating. Every time somebody turns on the set, I go into the other room and read a book.",
        quoteAuthor:"Groucho Marx",
    }
];