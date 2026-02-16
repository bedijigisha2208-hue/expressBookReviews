const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  let user = users.find((user) => user.username==username);
    if(user) {
        return false;
    } else {
        return true;
    }
}

const authenticatedUser = (username,password)=>{ 
  let user = users.find((user) => user.username==username && user.password==password);
    if(user){
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (authenticatedUser(username, password)) {

    let accessToken = jwt.sign(
      { username: username },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username
    };

    return res.status(200).json({
      message: "User successfully logged in"
    });

  } else {
    return res.status(401).json({
      message: "Invalid login. Check username and password"
    });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const books = require("./booksdb.js");

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review text is required" });
  }

  const username = req.session.authorization.username;

  // Add or modify review
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully",
    reviews: books[isbn].reviews
  });
});
regd_users.delete("/auth/review/:isbn", (req, res) => { 
    const isbn = req.params.isbn;
    const books = require("./booksdb.js"); 
    if (!books[isbn]) {
         return res.status(404).json({ message: "Book not found" }); 
        } // Check if user is logged in
         if (!req.session.authorization) { 
            return res.status(403).json({ message: "User not logged in" }); 
        } 
        const username = req.session.authorization.username;
         // Check if review exists for this user
          if (!books[isbn].reviews[username]) {
             return res.status(404).json({ message: "Review not found for this user" });
             } 
             delete books[isbn].reviews[username];
             return res.status(200).json({ message: "Review deleted successfully", reviews: books[isbn].reviews }); 
            });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
