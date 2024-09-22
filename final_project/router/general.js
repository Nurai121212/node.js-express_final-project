const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if(book){
    return res.status(200).send(JSON.stringify(book));
  }else{
    return res.status(404).json({message: "No book found with this ISBN"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let matches = [];

  for(let key in books){
    if(books[key].author.toLowerCase() === author.toLowerCase()){
      matches.push(books[key])
    }
  };

  if(matches.length){
    return res.json(matches);
  }else {
    return res.status(404).json({message: "No books found for the author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;

  for(let key in books){
    if(books[key].title.toLowerCase() === title.toLowerCase()){
      return res.json(books[key]);
    }
  };

  return res.status(404).json({message: "No books found with this title"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if(book){
    return res.json(book.reviews)
  }else{
    return res.status(404).json({message: "No book found with this ISBN"});
  }
});

module.exports.general = public_users;
