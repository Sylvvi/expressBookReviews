const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Function to fetch all books, returns a Promise
function getBooks() {
  return new Promise((resolve, reject) => {
  
    if (books) {
      resolve(books);
    } else {
      reject(new Error('Failed to fetch books'));
    }
  });
}

// Function to search books by author, returns a Promise
function getBooksByAuthor(author) {
  return new Promise((resolve, reject) => {
    const filteredBooks = Object.values(books).filter(book => book.author === author);
    if (filteredBooks.length > 0) {
      resolve(filteredBooks);
    } else {
      reject({ status: 404, message: `Books by author '${author}' not found` });
    }
  });
}

// Function to search books by title, returns a Promise
function getBooksByTitle(title) {
  return new Promise((resolve, reject) => {
    const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
    if (filteredBooks.length > 0) {
      resolve(filteredBooks);
    } else {
      reject({ status: 404, message: `Books with title containing '${title}' not found` });
    }
  });
}

// Function to search books by ISBN, returns a Promise
function getBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject({ status: 404, message: `Book with ISBN '${isbn}' not found` });
    }
  });
}

// Route to get all books
public_users.get('/', function (req, res) {
  getBooks()
    .then((bks) => res.send(JSON.stringify(bks)))
    .catch(error => {
      return res.status(500).json({ error: error.message });
    });
});

// Route to search books by author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  getBooksByAuthor(author)
    .then(filteredBooks => res.status(200).json(filteredBooks))
    .catch(error => res.status(error.status || 500).json({ error: error.message }));
});

// Route to search books by title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  getBooksByTitle(title)
    .then(filteredBooks => res.status(200).json(filteredBooks))
    .catch(error => res.status(error.status || 500).json({ error: error.message }));
});

// Route to search book by ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  getBookByISBN(isbn)
    .then(book => res.status(200).json(book))
    .catch(error => res.status(error.status || 500).json({ error: error.message }));
});



module.exports.general = public_users;







/****

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    const bookList = books;
    return res.status(200).json(bookList);
  });
  
  
  // Get book details based on ISBN
  public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const booked = books[isbn]; 
    return res.status(200).json({booked});
   });
    
  // Get book details based on author
  public_users.get('/author/:author',function (req, res) {
    const authorname = req.params.author;
    let booked;
    for (const key in books) {
      if(books[key].author == authorname){
        booked = books[key];
      };
    }
    return res.status(300).json({booked});
  });
  
  // Get all books based on title
  public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let booked;
    for (const key in books) {
      if(books[key].title == title){
        booked = books[key];
      };
    }
    return res.status(200).json({booked});
  });
  
  //  Get book review
  public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const review = books[isbn].reviews; 
    return res.status(200).json({review});
  });*/

module.exports.general = public_users;
