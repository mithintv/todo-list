// requiring npm modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
require("dotenv").config();

// requiring custom modules
const date = require(__dirname + "/js/date.js");

// using modules
const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: true });

const port = process.env.PORT || 5000;

app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect(`mongodb+srv://admin:${process.env.PASSWORD}@cluster0.sealf.mongodb.net/todo-listDB`);

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


const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

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
      res.render("list", { listTitle: "Today", list: listArray });
    }
  });

});

app.get("/:custom", (req, res) => {

  const customListName = _.capitalize(req.params.custom);
  List.findOne({ name: customListName }, (err, foundList) => {
    if (!foundList) {
      const list = new List({
        name: customListName,
        items: todoArray
      });
      list.save();
      res.redirect("/" + customListName);
    }
    else {
      res.render("list", { listTitle: foundList.name, list: foundList.items, route: `/${customListName}` });
    }
  });

});

app.post("/", urlencodedParser, (req, res) => {

  const listName = req.body.button;

  const newItem = new Item({
    name: req.body.newListItem
  });

  if (listName === "Today") {
    newItem.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, (err, foundList) => {
      foundList.items.push(newItem);
      foundList.save();
      res.redirect("/" + listName);
    });
  }



});

app.post("/delete", urlencodedParser, (req, res) => {
  const checkedItemId = req.body.deleteItem;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndDelete(checkedItemId, (err) => {
      if (err) {
        console.log(err);
      } else res.redirect("/");
    });
  } else {
    List.findOneAndUpdate({ name: listName }, {
      $pull: {
        items: {
          _id: checkedItemId
        }
      }
    }, (err, foundList) => {
      if (!err) {
        res.redirect("/" + listName);
      }
    });

  }

});


app.listen(port, () => {
  console.log("Server started succesfully");
});
