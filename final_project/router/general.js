const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesUserExist = (username) => {
  const filteredUser = users.filter(elem => elem.username === username);

  if(filteredUser.length){
    return true
  }else {
    return false
  }
};

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if(username && password){
    if(!doesUserExist(username)){
      users.push({username, password});
      return res.status(200).json({message: 'User successfully registered'})
    }else{
      return res.status(404).json({message: 'User already exists'})
    }
  }else{
    return res.status(404).json({message: 'Unable to register'})
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if(book){
    return res.status(200).json(book);
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
  let matches = [];

  for(let key in books){
    if(books[key].title.toLowerCase() === title.toLowerCase()){
      matches.push(books[key]);
    }
  };

  if(matches.length){
    return res.json(matches);
  }else {
    return res.status(404).json({message: "No books found with this title"});
  }
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

// Get the list of books
async function getAllBooks() {
  try{
    const res = await axios.get('http://localhost:5000/');
    console.log(`Books list: ${JSON.stringify(res.data)}`);
  }catch(error){
    console.log(`Error ${error}`);
  };
};

getAllBooks();

// Get the book details based on its ISBN
async function getBookByISBN() {
  try{
    const res = await axios.get('http://localhost:5000/isbn/2');
    console.log(`Book with this ISBN: ${JSON.stringify(res.data)}`);
  }catch(error){
    console.log(`Error ${error}`);
  };
};

getBookByISBN();

// Get the book details based on author
async function getBookByAuthor() {
  try{
    const res = await axios.get('http://localhost:5000/author/Unknown');
    console.log(`Books by this author: ${JSON.stringify(res.data)}`);
  }catch(error){
    console.log(`Error ${error}`);
  };
};

getBookByAuthor();

// Get the book details based on title
async function getBookByTitle() {
  try{
    const res = await axios.get('http://localhost:5000/title/the book of job');
    console.log(`Book with this title: ${JSON.stringify(res.data)}`);
  }catch(error){
    console.log(`Error ${error}`);
  };
};

getBookByTitle();

module.exports.general = public_users;
