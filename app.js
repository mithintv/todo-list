// requiring npm modules
const express = require("express");
const bodyParser = require("body-parser");

// requiring custom modules
const date = require(__dirname + "/date.js");

// using modules
const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: true });

app.set("view engine", "ejs");
app.use(express.static("public"));

let listArray = ["Buy Food", "Cook Food", "Eat Food"];
let workListArray = [];

app.get("/", (req, res) => {
  res.render("list", { listTitle: date.getDay(), list: listArray, route: "/" });
});

app.get("/work", (req, res) => {
  res.render("list", { listTitle: "Work List", list: workListArray, route: "/work" });
})

app.post("/", urlencodedParser, (req, res) => {
  listArray.push(req.body.newListItem);
  res.redirect("/");
});

app.post("/work", urlencodedParser, (req, res) => {
  workListArray.push(req.body.newListItem)
  res.redirect("/work")
 })

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
