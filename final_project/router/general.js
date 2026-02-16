const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({message:"Username and password required"});
    }

    if (isValid(username)) {
        users.push({
            username: username,
            password: password
        });

        return res.status(200).json({message:"User successfully registered"});
    } else {
        return res.status(400).json({message:"User already exists. Please login"});
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  new Promise((resolve, reject) => {
    resolve(books);
  })
  .then((data) => {
    res.status(200).json(data);
  })
  .catch((error) => {
    res.status(500).json({
      message: "Error fetching book list",
      error: error
    });
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  new Promise((resolve, reject) => {

    const book = books[isbn];

    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }

  })
  .then((data) => {
    res.status(200).json(data);
  })
  .catch((error) => {
    res.status(404).json({
      message: error
    });
  });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  new Promise((resolve,reject) => {
      const filteredBooks = Object.values(books).filter(
      (book) => book.title.toLowerCase() === title.toLowerCase()
  );
  if(filteredBooks.length > 0) {
    resolve(filteredBooks)
  } else {
    reject("No books found")
  }
  })
  .then((data) => {
    res.status(200).json(data);
  })
  .catch((error) => {
    res.status(404).json({
      message: error
    });
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
