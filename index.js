import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import pg from "pg";
const app=express();
const port=3000;
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const API_URL = "http://localhost:5000";
const db=new pg.Client({
    user:process.env.user,
    host:process.env.host,
    database:process.env.database,
    password:process.env.password,
    port:process.env.port,
});
db.connect();
let books = [];
let userbooks = [];
app.get("/",(req,res)=>{
    res.render("index.ejs");
});
app.get("/bestseller",async(req,res)=>{
    books.splice(0,books.length);
    try{
        
        const bestsellers = response.data.results.books.slice(0, 10);
        console.log(bestsellers.length);
        for(var i=0;i<bestsellers.length;i++){
            const isbn=bestsellers[i].isbns[0].isbn13;
            
            const book = response.data.items[0].volumeInfo;
            let bookdes="";
            let pic="";
            if (book.description) {
                bookdes=book.description;
            } else {
                bookdes="not available";
            }
            if (book.imageLinks && book.imageLinks.thumbnail) {
                pic=book.imageLinks.thumbnail;
              } else {
                pic="Not available";
            }
            const bookdata={
                title:book.title,
                author:book.authors.join(', '),
                ISBN:isbn,
                description:bookdes,
                pics:pic,
            };
            books.push(bookdata);
        }
        console.log("Length");
        console.log(books.length);
        res.render("bestseller.ejs",{bestseller:books});
    }
    catch(error){
        console.log("fail man",error.message);
    }
});
app.get("/add",async(req,res)=>{
    const response=await axios.get(`${API_URL}/random`);
    console.log(response.data);
    res.render("form.ejs",{quote:response.data.quoteText,quoteAuth:response.data.quoteAuthor});

});
app.post("/bookdata",async(req,res)=>{
    console.log(req.body.booktitle);
    var title=req.body.booktitle.toLowerCase();
    var finaltitle=title.replaceAll(/\s/g,'');//removes spaces
    console.log(req.body.authorname);
    var author=req.body.authorname.toLowerCase();
    console.log(req.body.message);
    var message=req.body.message;
    console.log(req.body.rating);
    var rate=req.body.rating;
    var isbn;
    try{
        
        console.log(response.data);
        isbn = response.data.items[0].volumeInfo.industryIdentifiers.find(identifier => identifier.type === 'ISBN_13').identifier;
    }
    catch(error){
        isbn="Not Found";
    }
    var tostore_title=req.body.booktitle;
    var tostore_author=req.body.authorname;
    console.log(finaltitle);
    console.log(author);
    console.log(message);
    console.log(isbn);
    console.log(rate);
    await db.query("INSERT INTO user_book (isbn,book_title,book_author,book_des,rating) VALUES($1,$2,$3,$4,$5)",[isbn,tostore_title,tostore_author,message,rate]);
    res.redirect("/mylibrary");
});
app.get("/mylibrary",async(req,res)=>{
    var data;
    const response=await db.query("SELECT * FROM user_book");
    userbooks.splice(0,userbooks.length);
    for(var i=0;i<response.rows.length;i++){
        
        const book = responsetwo.data.items[0].volumeInfo;
        let pic="";
        if (book.imageLinks && book.imageLinks.thumbnail) {
            pic=book.imageLinks.thumbnail;
        } else {
            pic="Not available";
        }
        const userbook={
            userbookid:response.rows[i].id,
            userbooktitle:response.rows[i].book_title,
            userbookauthor:response.rows[i].book_author,
            userbookdes:response.rows[i].book_des,
            userbookrating:response.rows[i].rating,
            userbookpic:pic,
        };
        userbooks.push(userbook);
    }
    res.render("mylibrary.ejs",{data:userbooks});
});
app.get("/edit/:bookid",async(req,res)=>{
    const responsetwo=await axios.get(`${API_URL}/random`);
    console.log(responsetwo.data);
    console.log(req.params.bookid);
    var searchid=req.params.bookid;
    const response=await db.query(`SELECT * FROM user_book WHERE id=${searchid}`);
    const editdata={
        userbookid:response.rows[0].id,
        userbooktitle:response.rows[0].book_title,
        userbookauthor:response.rows[0].book_author,
        userbookdes:response.rows[0].book_des,
        userbookrating:response.rows[0].rating,
    };
    res.render("form.ejs",{edit:editdata,quote:responsetwo.data.quoteText,quoteAuth:responsetwo.data.quoteAuthor});
});
app.post("/edit/post/:bookid",async(req,res)=>{
    var id=req.params.bookid;
    var rate=req.body.rating;
    var message=req.body.message;
    await db.query(`UPDATE user_book SET book_des=$1,rating=$2 WHERE id=${id}`,[message,rate]);
    res.redirect("/mylibrary");
});
app.get("/delete/:bookid",async(req,res)=>{
    var id=req.params.bookid;
    await db.query(`DELETE FROM user_book WHERE id=${id}`);
    res.redirect("/mylibrary");
});
app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
});