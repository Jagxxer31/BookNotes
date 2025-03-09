import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "booknotes",
  password: "sonicdash",
  port: 5432,
});
db.connect();

app.get("/", async(req, res) => {
  const books= await db.query("select * from books");
  res.render("index.ejs",{
    books:books.rows,
  });  
});

app.post("/add", async(req,res) =>{
  res.render("new.ejs")
})

app.post("/new", async(req,res) =>{
  let title=req.body["title"];
  let rating=req.body["rating"];
  let imgcode=req.body["imgcode"];
  let note=req.body["note"];
  let author=req.body["author"];
  db.query("insert into books(title,imgcode,rating,note,author) values($1,$2,$3,$4,$5)",
    [title,imgcode,rating,note,author]);
  res.redirect("/")

})

app.post("/edit", async(req,res) =>{
  const id=req.body.id;
  const boook=await db.query("select * from books where id=$1",[id]);
  const book=boook.rows[0];
  console.log(book);
  res.render("edit.ejs",{book});
  await db.query("delete from books where id=$1",[id]);
});

app.post("/edited", async(req,res) =>{
  let title=req.body["title"];
  let rating=req.body["rating"];
  let imgcode=req.body["imgcode"];
  let note=req.body["note"];
  let author=req.body["author"];
  db.query("insert into books(title,imgcode,rating,note,author) values($1,$2,$3,$4,$5)",
    [title,imgcode,rating,note,author]);
  res.redirect("/")
});

app.get("/sortId", async(req,res) =>{
  const books= await db.query("select * from books order by id DESC");
  res.render("index.ejs",{
    books:books.rows,
  }); 
});

app.get("/sortRating", async(req,res) =>{
  const books= await db.query("select * from books order by rating DESC");
  res.render("index.ejs",{
    books:books.rows,
  }); 
});

app.post("/delete", async(req,res) =>{
  const id=req.body.id;
  await db.query("delete from books where id=$1",[id]);
  res.redirect("/");
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
