// requiring npm modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// requiring custom modules
const date = require(__dirname + "/js/date.js");

// using modules
const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: true });

app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todo-listDB");

const itemsSchema = {
  name: String
};


const Item = mongoose.model("Item", itemsSchema);

const todo1 = new Item({
  name: "Welcome to your todo list!"
});
const todo2 = new Item({
  name: "Hit the + button to add a new item"
});
const todo3 = new Item({
  name: "Hit the checkbox to delete an item"
});

const todoArray = [todo1, todo2, todo3];





app.get("/", (req, res) => {
  Item.find({}, (err, listArray) => {
    if (err) {
      console.log(err);
    }
    else if (listArray.length === 0) {
      Item.insertMany(todoArray, (err) => {
        if (err) {
          console.log(err);
        }
      });
      res.redirect("/");
    }
    else {
      res.render("list", { listTitle: date.getDay(), list: listArray, route: "/" });
    }
  });

});

app.get("/work", (req, res) => {
  res.render("list", { listTitle: "Work List", list: workListArray, route: "/work" });
});

app.post("/", urlencodedParser, (req, res) => {
  listArray.push(req.body.newListItem);
  res.redirect("/");
});

app.post("/work", urlencodedParser, (req, res) => {
  workListArray.push(req.body.newListItem);
  res.redirect("/work");
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
