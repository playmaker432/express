var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var url = 'mongodb://19222432:cNjEaAIX3x7wk2VAN4E5ME6eAFIh0OAmUSl9KkeJ96KDEriqgUtx8WymWN1Ll382mAXuB6ZJfABj4lxBq2JfTg==@19222432.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@19222432@';

var db;

MongoClient.connect(url, function (err, client) {
  // Need to modify to 'ngoDB'
  db = client.db('ngoDB');
  console.log("DB connected");
});

/* Handle the Form */
router.post('/insert_book', async function (req, res) {
req.body.type = "book"
let result = await db.collection("ngoData").insertOne(req.body);
res.redirect('index.html');
});

/* Handle the Form */
router.post('/insert_game', async function (req, res) {
  req.body.type = "game"
  let result = await db.collection("ngoData").insertOne(req.body);
  res.redirect('index.html');
 });


// Form for updating a single Booking 
// router.get('/update/:id', async function (req, res) {

//   if (!ObjectId.isValid(req.params.id))
//     return res.status(404).send('Unable to find the requested resource!');

//   let result = await db.collection("bookings").findOne({ _id: ObjectId(req.params.id) });

//   if (!result) return res.status(404).send('Unable to find the requested resource!');

//   var numTickets = parseInt(result.numTickets);

//   res.render("update", { booking: result, numTickets: numTickets })

// });

// router.get('/search', async function (req, res) {

// 	var whereClause = {};

// 	if (req.query.email) whereClause.email = { $regex: req.query.email };
// 	  var parsedNumTickets = parseInt(req.query.numTickets);
//     if (!isNaN(parsedNumTickets)) whereClause.numTickets = parsedNumTickets;	
//     if (req.query.team) whereClause.team = req.query.team;
//     if (req.query.superhero) whereClause.superhero = req.query.superhero;
//     if (req.query.payment) whereClause.payment = req.query.payment;
//     if (req.query.terms) whereClause.terms = req.query.terms;

//     var perPage = 6;

//   	var results = await db.collection("bookings").find(whereClause, {
//    		limit: perPage,
//    	 	skip: perPage * (Math.max(req.query.page - 1, 0) || 0)
//  	}).toArray();

//   var curPage = parseInt(req.query.page) || 1;

// 	var pages = Math.ceil(await db.collection("bookings").count() / perPage);

// 	return res.render('paginate', { bookings: results, pages: pages, perPage: perPage, email: whereClause.email, numTickets: whereClause.numTickets, team: whereClause.team, superhero: whereClause.superhero, payment: whereClause.payment, terms:whereClause.terms, currentPage: curPage});
// });

// Updating a single Booking 
// router.post('/update/:id', async function (req, res) {

//   if (!ObjectId.isValid(req.params.id))
//     return res.status(404).send('Unable to find the requested resource!');

//   req.body.numTickets = parseInt(req.body.numTickets);

//   var result = await db.collection("bookings").findOneAndReplace({ _id: ObjectId(req.params.id) },
//     req.body
//   );

//   if (!result.value)
//     return res.status(404).send('Unable to find the requested resource!');

//   res.render("update_redirect");
// });

// Delete a single Booking (I remove the original one as )
// router.get('/delete/:id', async function (req, res) {

//   if (!ObjectId.isValid(req.params.id))
//   return res.status(404).send('Unable to find the requested resource!');

//   let result = await db.collection("bookings").findOneAndDelete({ _id: ObjectId(req.params.id) })
  
//   if (!result) return res.status(404).send('Unable to find the requested resource!');

//   res.render("delete_redirect", {booking: result});

// });

/* Ajax-Pagination */
router.get('/api/bookings', async function (req, res) {

  var perPage = Math.max(req.query.perPage, 2) || 2;

  var results = await db.collection("ngoData").find({}, {
    limit: perPage,
    skip: perPage * (Math.max(req.query.page - 1, 0) || 0)
  }).toArray();

  var pages = Math.ceil(await db.collection("ngoData").count() / perPage);

  // return res.render('paginate', { bookings: results, pages: pages, perPage: perPage });

  return res.json({ ngoData: results, pages: pages })

});

module.exports = router;
