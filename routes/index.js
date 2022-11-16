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
req.body.type = "Book"
let result = await db.collection("ngoData").insertOne(req.body);
res.redirect('index.html');
});

/* Handle the Form */
router.post('/insert_game', async function (req, res) {
  req.body.type = "Game"
  let result = await db.collection("ngoData").insertOne(req.body);
  res.redirect('index.html');
 });

 /* Handle the Form */
router.post('/insert_gift', async function (req, res) {
  req.body.type = "Gift"
  let result = await db.collection("ngoData").insertOne(req.body);
  res.status(201).json({ text: 'Created' });
 });

/* Ajax-Pagination */
router.get('/api/inventory', async function (req, res) {

  var whereClause = {};
  if(req.query.type) whereClause.type = req.query.type;
  if (req.query.title) whereClause.title = { $regex: req.query.title };

  var perPage = Math.max(req.query.perPage, 6) || 6;

  var results = await db.collection("ngoData").find(whereClause, {
    limit: perPage,
    skip: perPage * (Math.max(req.query.page - 1, 0) || 0)
  }).toArray();

  var pages = Math.ceil(await db.collection("ngoData").count(whereClause) / perPage);

  return res.json({ ngoData: results, pages: pages })

});

router.post('/api/insert/inventory', async function (req, res) {

  let result = await db.collection("ngoData").insertOne(req.body);
  res.status(201).json({text: result.insertedId});  
});

// Form for updating a single Booking 
router.get('/api/inventory/detail/:id', async function (req, res) {

  if (!ObjectId.isValid(req.params.id))
    return res.status(404).send('Unable to find the requested resource!');

  let result = await db.collection("ngoData").findOne({ _id: ObjectId(req.params.id) });

  if (!result) return res.status(404).send('Unable to find the requested resource!');

  res.json(result);

});

// Updating a single Booking - Ajax
router.put('/api/update/:id', async function (req, res) {

  if (!ObjectId.isValid(req.params.id))
    return res.status(404).send('Unable to find the requested resource!');

  var result = await db.collection("ngoData").findOneAndReplace(
    { _id: ObjectId(req.params.id) }, req.body
  );

  if (!result.value)
    return res.status(404).send('Unable to find the requested resource!');

  res.send("Inventory updated.");

});

// Delete a single Booking - Ajax
router.delete('/api/delete/:id', async function (req, res) {

  if (!ObjectId.isValid(req.params.id))
    return res.status(404).send('Unable to find the requested resource!');

  var result = await db.collection("ngoData").findOneAndDelete({ _id: ObjectId(req.params.id) });

  if (!result.value)
    return res.status(404).send('Unable to find the requested resource!');
  res.send("Inventory deleted.");

});

// GroupBy
router.get('/api/inventory/aggregate/groupby', async function (req, res) {

  const pipeline = [
    { $group: { _id: "$type", count: { $sum: 1 } } }
  ];

  const results = await db.collection("ngoData").aggregate(pipeline).toArray();

  return res.json(results);

});

module.exports = router;
