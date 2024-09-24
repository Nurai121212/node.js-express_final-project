const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{
  const filteredUser = users.filter(elem => elem.username === username && elem.password === password);

  if(filteredUser.length){
    return true
  }else {
    return false
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    };
    
    return res.status(200).json({ message: "User successfully logged in" });
  }else {
    return res.status(208).json({ message: "Invalid Login" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  const book = books[isbn];

  if(book){
    book.reviews[username] = review;
    return res.status(200).json({ message: "Successfully added review: " + JSON.stringify(book) });
  }else {
    return res.status(404).json({message: "No book found with this ISBN"});
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  const book = books[isbn];

  if(book){
    delete book.reviews[username]
    return res.status(200).json({ message: "Successfully deleted review: " + JSON.stringify(book) });
  }else {
    return res.status(404).json({message: "No book found with this ISBN"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
