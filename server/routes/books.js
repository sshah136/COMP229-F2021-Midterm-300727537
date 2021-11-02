// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the book model
let book = require('../models/books');

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  // find all books in the books collection
  book.find( (err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('books/index', {
        title: 'Books',
        books: books
      });
    }
  });

});

router.get('/add', (req, res, next) => {
  res.render('books/details', {
      title: 'Add a Book',
      books: ''
  });
});

//  GET the Book Details page in order to add a new Book
router.get('/add', (req, res, next) => {

    //Pass an appropriate value for the title property and blank value for the books property
    res.render('books/details', { title: 'Add a Book' });

});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add', (req, res, next) => {

    //Instantiate an object of the book model and pass this object to the create method of the book model to add a new book to the database
    let books = book({
      "Title": req.body.title,
      "Price": req.body.price,
      "Author": req.body.author,
      "Genre": req.body.genre
  });
  
  book.create(books, (err, book) => {
      if (err) {
          console.log(err);
          res.end(err);
      }
  })

  console.log(books);
  // Redirect the user back to the BookList page ('/books') when the insertion is completed
  res.redirect('/books');

});

// GET the Book Details page in order to edit an existing Book
router.get('/edit/:id', (req, res, next) => {

    //Declare an id variable and set its value to the id property of the request object
    let id = req.params.id;

    //Pass this id to the book model’s findById method to render the book details view
    book.findById(id, (err, bookEdit) => {
        if (err) {
            console.log(err);
            res.end(err);
        }

        //Set an appropriate title property value and set the books property to the book that was returned from the database as you render the view
        res.render('books/details', { title: 'Edit Books', books: bookEdit });
    })
});

// POST - process the information passed from the details form and update the document
router.post('/edit/:id', (req, res, next) => {

    // Declare an id variable and set its value to the id property of the request object
    let id = req.params.id;

    // Instantiate an object of the book model and pass this object to the update method of the book model to edit an existing book in the database
    let updatedBook = book({
        "_id": id,
        "Title": req.body.title,
        "Price": req.body.price,
        "Author": req.body.author,
        "Genre": req.body.genre
    });

    book.updateOne({ _id: id }, updatedBook, (err) => {
        if (err) {
            console.log(err);
            res.end(err);
        }

        //Redirect the user back to the BookList page when the update is completed
        res.redirect('/books'); 
    });

});

// GET - process the delete by user id
router.get('/delete/:id', (req, res, next) => {

    let id = req.params.id;//Declare an id variable and set its value to the id property of the request object

    //Pass the id to the book model’s remove method
    book.remove({ _id: id }, (err) => {
        if (err) {
            console.log(err);
            res.end(err);
        }

        res.redirect('/books');//Redirect the user back to the BookList page when the removal is completed
    });
    
});


module.exports = router;