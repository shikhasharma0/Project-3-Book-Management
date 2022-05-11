const Booksmodel = require('../models/bookModels')
//const jwt = require('Jsonwebtoken');
const Validation = require("../validators/validation");
//const { isValidObjectId } = require('mongoose');

const bookcreate = async function(req, res){
    try {
        const requestBody = req.body;
        if(!Validation.isValidRequestBody(requestBody))
        return res.status(400).send({status:false, massage: "request is unvalid"})

    
  if(!Validation.isValidField(requestBody.title))
  return res.status(400).send({ status: false, message: 'title is required!' });

  let titleExist = await Booksmodel.findOne({title : requestBody.title})
  if (titleExist)
 return res.status(400).send({status: false, message: 'title is alredy exist'})


  if(!Validation.isValidField (requestBody.excerpt))
  return res.status(400).send({ status: false, message: 'excerpt is required!' });

  
  if(!Validation.isValidField(requestBody.userId))
  return res.status(400).send({ status: false, message: 'userId is required!' });
  

  if(!Validation.isValidField(requestBody.ISBN))
  return res.status(400).send({ status: false, message: 'ISBN No. is required!' });
  let ISBNexist= await Booksmodel.findOne({ISBN: requestBody.ISBN})
  if (ISBNexist)
  return res.status(400).send({status: false, message: 'ISBN no. is already exist!'})
 
  if(!Validation.isValidField(requestBody.category))
  return res.status(400).send({ status: false, message: 'category is required!' });
  
  
  if(!Validation.isValidField(requestBody.subcategory))
  return res.status(400).send({ status: false, message: 'subcategory is required!' });
 
  if(requestBody.isPublished)
      
  requestBody.publishedAt = new Date();

     let newBook = await Booksmodel.create(requestBody);
     res.status(201).send({ status: true, message: 'New book created successfully.', data: newBook });
     console.log({status: true, data: newBook});

    }
    catch(error){
      console.log(error)
        return res.status(500).send({status: false, message: ' msg error message'})
    }
}


// get books with particular fileds using query params
const getBooks = async function (req, res) {
  try {

      const query = req.query
      const { userId, category, subcategory } = query
      // user id vlidation 
      if (userId && isValidObjectId(userId)) {
          return res.status(400).send({ status: false, msg: "userid not valid" })
      }

      // filtering by query
      const filterdBooks = await Booksmodel.find({ $and: [{ isDeleted: false }, query] })
          .select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1, subcategory: 1 });

      if (!filterdBooks.length) {
          return res.status(400).send({ status: false, msg: "No Book exist" })
      }
      // sorting name  by Alphabitical
      const sortedBooks = filterdBooks.sort((a, b) => a.title.localeCompare(b.title))

      res.status(200).send({ status: true, msg: "all books", data: sortedBooks })

  } catch (error) {
      res.status(500).send({ status: false, error: error.message })
  }
};




const getBook = async function(req, res){
    try {
    let bookData = req.params
    if(Object.keys(bookData).length == 0)
    return res.status(400).send({status : false , msg : 'Enter the data to search book'})

    let findBook = await Booksmodel.find({ $and : [{ $and :[{isDeleted : false}]}, {$or : [{userId : bookData.userId}, {category : bookData.category}, {subcategory : bookData.subcategory}]}]})
        if(!findBook)
        return res.status(404).send({status : false, msg : 'No such book exist'})
    res.status(200).send({status : true , data : findBook})
    }
    catch(err){
        return res.status(500).send({status : false, error : err.message})
    }
}




const deleteBookById = async function(req,res)
{
    try
    {
        if(req.params.bookId==undefined)
        
           return res.status(400).send({status : false,msg : "Invalid request parameter! Please provide bookId."});
        
        if (!Validation.isValidObjectId(req.params.bookId)) 
      
            return res.status(400).send({ status: false, message: 'Book id is invalid!' });
        
        let book = await Booksmodel.findOneAndUpdate({_id : req.params.bookId,isDeleted : false},{$set : {isDeleted : true,deletedAt : new Date()}});
        if(book!=null)
        {
           return res.status(200).send({status : true,msg : "Book deleted successfully!"});
        }
        else
        {
          return  res.status(404).send({status : false,msg : "Book doesn't exist!"});
        }
    }
    catch(err)
    {
       return res.status(500).send({status : false,msg : err.message});
    }
};

module.exports.getBooks = getBooks;
module.exports.getBook = getBook;
module.exports.bookcreate = bookcreate;
module.exports.deleteBookById = deleteBookById;